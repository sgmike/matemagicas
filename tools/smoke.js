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
    for (const [name, r] of [['inicio', '#/'], ['tema', '#/tema/frac'], ['practica', '#/practica/dec'], ['plan', '#/plan'], ['glosario', '#/glosario'], ['progreso', '#/progreso']]) {
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
