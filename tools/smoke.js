/* =========================================================
   Prueba de humo en un navegador real (Playwright + Chromium)
   Recorre las pantallas, resuelve ejercicios y hace un examen.
   Uso:  node tools/smoke.js [--shots]
   ========================================================= */
/* usa el Playwright y el Chromium ya instalados en el sistema */
const PW = (() => {
  try { return require('playwright'); }
  catch (e) { return require('/opt/node22/lib/node_modules/playwright'); }
})();
const chromium = PW.chromium;
const CHROME = process.env.CHROME_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PORT = 8899;
const SHOTS = process.argv.includes('--shots');
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml',
  '.webmanifest': 'application/manifest+json', '.json': 'application/json'
};

const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p === '/') p = '/index.html';
  const file = path.join(ROOT, p);
  if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    res.writeHead(404); return res.end('no');
  }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});

const problems = [];
function bad(msg) { problems.push(msg); console.error('✗ ' + msg); }
function ok(msg) { console.log('✓ ' + msg); }

(async () => {
  await new Promise(r => server.listen(PORT, r));
  const browser = await chromium.launch(require('fs').existsSync(CHROME) ? { executablePath: CHROME } : {});
  const page = await browser.newPage({ viewport: { width: 420, height: 900 } });

  /* las fuentes de Google no cargan en entornos sin salida a internet: no es un fallo de la web */
  const EXTERNAL = /fonts\.(googleapis|gstatic)\.com/;
  page.on('requestfailed', r => { if (!EXTERNAL.test(r.url())) bad('petición fallida: ' + r.url()); });
  page.on('console', m => {
    if (m.type() !== 'error') return;
    const txt = m.text();
    if (/net::ERR/.test(txt) && EXTERNAL.test(m.location().url || '')) return;
    if (/Failed to load resource/.test(txt) && /fonts/.test(m.location().url || '')) return;
    bad('consola: ' + txt + ' @ ' + (m.location().url || ''));
  });
  page.on('pageerror', e => bad('excepción JS: ' + e.message));

  const url = 'http://localhost:' + PORT + '/';
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(700);
  await page.keyboard.press('Escape');
  await page.evaluate(() => { const m = document.getElementById('modal'); if (m) { m.hidden = true; m.innerHTML = ''; } });

  /* --- carga básica --- */
  const counts = await page.evaluate(() => ({
    gens: MM.gen.all().length, topics: MM.TOPICS.length,
    lessons: Object.keys(MM.LESSONS).length, glossary: MM.GLOSSARY.length
  }));
  if (counts.gens < 100) bad('pocos generadores: ' + counts.gens); else ok(counts.gens + ' generadores cargados');
  if (counts.topics !== 15) bad('temas: ' + counts.topics); else ok('15 temas');
  if (counts.lessons !== 15) bad('lecciones: ' + counts.lessons); else ok('15 lecciones');

  /* --- recorrido de rutas --- */
  const routes = ['#/', '#/temas', '#/tema/frac', '#/errores', '#/plan', '#/glosario', '#/progreso', '#/ajustes', '#/examen'];
  for (const r of routes) {
    await page.goto(url + r, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(180);
    const len = await page.evaluate(() => document.getElementById('main').innerHTML.length);
    if (len < 200) bad('ruta vacía: ' + r); else ok('ruta ' + r + ' (' + len + ' bytes)');
  }

  /* --- todas las lecciones se renderizan --- */
  const topicIds = await page.evaluate(() => MM.TOPICS.map(t => t.id));
  for (const id of topicIds) {
    await page.goto(url + '#/tema/' + id, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(60);
    const info = await page.evaluate(() => ({
      len: document.getElementById('main').innerHTML.length,
      undef: document.getElementById('main').innerHTML.includes('undefined')
    }));
    if (info.len < 1500) bad('lección corta en ' + id + ' (' + info.len + ')');
    if (info.undef) bad('“undefined” en la lección ' + id);
  }
  ok('las 15 lecciones se renderizan');

  /* --- práctica: responder bien y mal --- */
  await page.goto(url + '#/practica/frac', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(300);
  for (let i = 0; i < 6; i++) {
    const info = await page.evaluate(() => {
      const it = MM.engine.item();
      return it ? { fields: it.ex.fields.map(f => ({ key: f.key, type: f.answerType || 'num', ans: String(f.answer), input: f.canonicalInput })) } : null;
    });
    if (!info) { bad('no hay ejercicio en la ronda'); break; }
    for (const f of info.fields) {
      if (f.type === 'num') {
        await page.fill('input.ans[data-key="' + f.key + '"]', i === 3 ? '999999' : (f.input || f.ans));
      } else {
        await page.click('.choice[data-key="' + f.key + '"][data-val="' + (i === 3 ? '' : f.ans) + '"]').catch(async () => {
          await page.click('.choice[data-key="' + f.key + '"]');
        });
      }
    }
    await page.click('[data-act="check"]');
    await page.waitForTimeout(120);
    const fb = await page.evaluate(() => {
      const el = document.querySelector('.feedback');
      return { cls: el ? el.className : null, sol: !!document.querySelector('.sol') };
    });
    if (!fb.cls) bad('sin respuesta visible tras comprobar (ejercicio ' + (i + 1) + ')');
    if (!fb.sol) bad('sin solución tras comprobar (ejercicio ' + (i + 1) + ')');
    if (i !== 3 && fb.cls && !fb.cls.includes('ok')) bad('la respuesta correcta se marcó como incorrecta (ejercicio ' + (i + 1) + ')');
    if (i === 3 && fb.cls && !fb.cls.includes('bad')) bad('una respuesta incorrecta se marcó como correcta');
    await page.click('[data-act="next"]');
    await page.waitForTimeout(120);
  }
  ok('la ronda de práctica corrige bien');

  const st = await page.evaluate(() => {
    const p = MM.store.p();
    return { xp: p.xp, mistakes: p.mistakes.length, att: (p.topics.frac || {}).att || 0 };
  });
  if (st.xp <= 0) bad('no se ganó XP'); else ok('XP: ' + st.xp);
  if (st.mistakes < 1) bad('el fallo no se guardó en el cuaderno'); else ok('cuaderno de errores: ' + st.mistakes);

  /* el progreso sobrevive a una recarga */
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(300);
  const st2 = await page.evaluate(() => MM.store.p().xp);
  if (st2 !== st.xp) bad('el progreso no se guarda al recargar (' + st2 + ' vs ' + st.xp + ')');
  else ok('el progreso se guarda entre sesiones');

  /* --- ver solución sin responder --- */
  await page.goto(url + '#/practica/pct', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(250);
  await page.click('[data-act="reveal"]');
  await page.waitForTimeout(120);
  if (!(await page.$('.sol'))) bad('“Ver solución” no muestra la solución'); else ok('“Ver solución” funciona siempre');

  /* --- reto del día --- */
  await page.goto(url + '#/reto', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(250);
  if (!(await page.$('.qcard'))) bad('el reto del día no arranca'); else ok('reto del día');

  /* --- examen corto completo --- */
  await page.goto(url + '#/examen', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(200);
  await page.click('[data-act="exam-start-short"]');
  await page.waitForTimeout(400);
  const nq = await page.evaluate(() => MM.exam.state.items.length);
  if (nq !== 16) bad('el examen corto tiene ' + nq + ' preguntas (esperadas 16)'); else ok('examen corto: 16 preguntas');
  /* se responde todo bien desde el modelo de datos */
  await page.evaluate(() => {
    MM.exam.state.items.forEach((it, i) => it.ex.fields.forEach(f => {
      MM.exam.state.answers['q' + i + '_' + f.key] = String(f.canonicalInput !== undefined ? f.canonicalInput : f.answer);
    }));
  });
  await page.evaluate(() => { window.confirm = () => true; });
  await page.click('[data-act="exam-submit"]');
  await page.waitForTimeout(500);
  const res = await page.evaluate(() => MM.exam.state.result);
  if (!res) bad('el examen no se corrigió');
  else if (res.score !== res.max) bad('examen con todo correcto puntuó ' + res.score + '/' + res.max);
  else ok('examen corregido: ' + res.score + '/' + res.max);
  if (!(await page.$('.scorebig'))) bad('no se ve la pantalla de resultados');

  /* --- hoja para imprimir --- */
  await page.goto(url + '#/imprimir/nat', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(300);
  const sheet = await page.evaluate(() => ({
    items: MM.sheet ? MM.sheet.items.length : 0,
    qs: document.querySelectorAll('.sheet-q').length
  }));
  if (sheet.items !== 12) bad('la hoja imprimible tiene ' + sheet.items + ' ejercicios');
  else if (sheet.qs !== 24) bad('la hoja no muestra ejercicios + soluciones (' + sheet.qs + ')');
  else ok('hoja imprimible: 12 ejercicios + soluciones');

  /* --- modo juego --- */
  async function answerCurrent(wrong) {
    const info = await page.evaluate(() => {
      const it = MM.engine.item();
      return it ? it.ex.fields.map(f => ({ key: f.key, type: f.answerType || 'num', ans: String(f.answer), input: f.canonicalInput })) : null;
    });
    if (!info) return false;
    for (const f of info) {
      if (f.type === 'num' || f.type === 'factor') await page.fill('input.ans[data-key="' + f.key + '"]', wrong ? '424242' : (f.input || f.ans));
      else if (wrong) await page.click('.choice[data-key="' + f.key + '"]:not([data-val="' + f.ans + '"])');
      else await page.click('.choice[data-key="' + f.key + '"][data-val="' + f.ans + '"]');
    }
    return true;
  }
  await page.goto(url + '#/juego', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(250);
  if (!(await page.$('.world'))) bad('el mapa de mundos no se ve');
  const locked = await page.evaluate(() => document.querySelectorAll('.world.locked').length);
  if (locked !== 14) bad('deberían estar bloqueados 14 mundos, hay ' + locked);
  // lección (nivel 1)
  await page.click('.world:not(.locked)');
  await page.waitForTimeout(200);
  if ((await page.evaluate(() => document.querySelectorAll('.gnode').length)) !== 6) bad('el mundo no tiene 6 niveles');
  await page.click('.gnode.open .gnode-btn', { force: true });
  await page.waitForTimeout(250);
  for (let i = 0; i < 40; i++) {
    const nextBtn = await page.$('[data-act="g-page"][data-d="1"]');
    if (!nextBtn) break;
    await nextBtn.click(); await page.waitForTimeout(80);
  }
  await page.click('[data-act="g-finish-read"]');
  await page.waitForTimeout(200);
  if (!(await page.evaluate(() => MM.game.run && MM.game.run.quiz))) bad('la lección no pasa a la comprobación rápida');
  for (let i = 0; i < 2; i++) {
    await answerCurrent(false);
    await page.click('[data-act="g-check"]'); await page.waitForTimeout(120);
    await page.click('[data-act="g-next"]'); await page.waitForTimeout(150);
  }
  let pts = await page.evaluate(() => MM.store.pointsTotal());
  if (!(await page.evaluate(() => MM.game.run.finished))) bad('la lección con comprobación no termina');
  if (pts < 20) bad('la lección no dio puntos (' + pts + ')'); else ok('juego: lección + comprobación, ' + pts + ' pts');
  // ejemplos (nivel 2): reproductor de pasos
  await page.click('[data-act="g-play"][data-n="2"]');
  await page.waitForTimeout(1400);
  const shown = await page.evaluate(() => document.querySelectorAll('.psteps li.shown').length);
  if (shown < 1) bad('el reproductor de pasos no avanza solo'); else ok('reproductor de pasos: ' + shown + ' paso(s) visibles');
  for (let i = 0; i < 40; i++) {
    const nextBtn = await page.$('[data-act="g-page"][data-d="1"]');
    if (!nextBtn) break;
    await nextBtn.click(); await page.waitForTimeout(60);
  }
  await page.click('[data-act="g-finish-read"]');
  await page.waitForTimeout(200);
  // nivel 1 de práctica: 5 ejercicios, uno mal (pierde una vida)
  await page.click('[data-act="g-play"][data-n="3"]');
  await page.waitForTimeout(300);
  for (let i = 0; i < 5; i++) {
    const info = await page.evaluate(() => {
      const it = MM.engine.item();
      return it.ex.fields.map(f => ({ key: f.key, type: f.answerType || 'num', ans: String(f.answer), input: f.canonicalInput }));
    });
    for (const f of info) {
      if (f.type === 'num' || f.type === 'factor') await page.fill('input.ans[data-key="' + f.key + '"]', i === 1 ? '424242' : (f.input || f.ans));
      else if (i === 1) await page.click('.choice[data-key="' + f.key + '"]:not([data-val="' + f.ans + '"])');
      else await page.click('.choice[data-key="' + f.key + '"][data-val="' + f.ans + '"]');
    }
    await page.click('[data-act="g-check"]');
    await page.waitForTimeout(150);
    await page.click('[data-act="g-next"]');
    await page.waitForTimeout(150);
  }
  const g = await page.evaluate(() => ({ run: MM.game.run, done: !!MM.store.p().game.levels['nat:3'], stars: (MM.store.p().game.levels['nat:3'] || {}).stars,
    unlocked2: MM.game.worldUnlocked(1), lockedNow: document.querySelectorAll('.world.locked').length }));
  if (!g.run.finished) bad('el nivel de práctica no terminó');
  if (!g.done) bad('el nivel no quedó marcado como superado');
  if (g.stars !== 2) bad('con un fallo debería dar 2 estrellas, dio ' + g.stars);
  if (!g.unlocked2) bad('el mundo 2 no se desbloqueó al pasar el Nivel 1');
  ok('nivel 1 superado con ' + g.stars + ' estrellas, mundo 2 desbloqueado, ' + g.run.pts + ' pts');
  // misiones y logros
  const extra = await page.evaluate(() => ({ quests: MM.game.quests().length, badges: Object.keys(MM.store.p().badges).length,
    home: document.body.innerHTML.length }));
  await page.goto(url + '#/', { waitUntil: 'domcontentloaded' }); await page.waitForTimeout(250);
  const homeBits = await page.evaluate(() => ({ mascot: !!document.querySelector('.mascot'), quests: document.querySelectorAll('.quests li').length, badges: document.querySelectorAll('.bdg').length }));
  if (extra.quests !== 3 || homeBits.quests !== 3) bad('misiones diarias: ' + extra.quests + '/' + homeBits.quests);
  if (extra.badges < 1) bad('no se concedió ningún logro tras superar niveles');
  if (!homeBits.mascot || homeBits.badges < 10) bad('portada del juego sin mascota o logros');
  ok('portada: mascota, ' + homeBits.quests + ' misiones, ' + extra.badges + ' logro(s) ganados');
  // modo relámpago
  await page.goto(url + '#/juego/relampago', { waitUntil: 'domcontentloaded' }); await page.waitForTimeout(200);
  await page.click('[data-act="g-flash-start"]'); await page.waitForTimeout(300);
  for (let i = 0; i < 6; i++) {
    await answerCurrent(i === 2);
    await page.click('[data-act="g-flash-check"]'); await page.waitForTimeout(120);
  }
  await page.evaluate(() => { MM.game.flash.started -= 61000; });
  await page.waitForTimeout(600);
  const fl = await page.evaluate(() => ({ ended: MM.game.flash && MM.game.flash.ended, score: MM.game.flash && MM.game.flash.score, best: MM.store.p().flash.best, awarded: MM.game.flash && MM.game.flash.awarded }));
  if (!fl.ended || fl.score !== 5 || fl.best !== 5 || fl.awarded !== 50) bad('relámpago: ' + JSON.stringify(fl)); else ok('relámpago: 5 aciertos, récord guardado, +' + fl.awarded);
  // panel de padres
  await page.goto(url + '#/padres', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(200);
  await page.fill('#pinInput', '1234');
  await page.click('[data-act="pin-ok"]');
  await page.waitForTimeout(200);
  const panel = await page.evaluate(() => ({ chart: !!document.querySelector('svg.chart'), rows: document.querySelectorAll('[data-act="reward-given"]').length,
    week: MM.store.weekSummary(MM.weekStart()) }));
  if (!panel.chart || panel.rows !== 8) bad('el panel de padres no se renderiza bien');
  else ok('panel de padres: semana con ' + panel.week.pts + ' pts, ' + panel.week.levels + ' niveles');

  /* --- idiomas --- */
  for (const l of ['es', 'lv', 'both']) {
    await page.click('[data-lang-btn="' + l + '"]');
    await page.waitForTimeout(80);
    const attr = await page.getAttribute('html', 'data-lang');
    if (attr !== l) bad('el idioma no cambia a ' + l);
  }
  ok('cambio de idioma ES / LV / ES+LV');

  if (SHOTS) {
    const dir = path.join(ROOT, 'tools', 'shots');
    fs.mkdirSync(dir, { recursive: true });
    for (const [name, r] of [['inicio', '#/'], ['tema', '#/tema/frac'], ['practica', '#/practica/dec'], ['plan', '#/plan'], ['glosario', '#/glosario'], ['progreso', '#/progreso'],
                             ['juego', '#/juego'], ['mundo', '#/juego/mundo/nat'], ['padres', '#/padres']]) {
      await page.goto(url + r, { waitUntil: 'networkidle' });
      await page.waitForTimeout(400);
      await page.screenshot({ path: path.join(dir, name + '.png'), fullPage: r !== '#/practica/dec' });
    }
    ok('capturas en tools/shots/');
  }

  await browser.close();
  server.close();
  console.log('\n' + (problems.length ? '❌ ' + problems.length + ' problema(s)' : '✅ Todo correcto'));
  process.exit(problems.length ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
