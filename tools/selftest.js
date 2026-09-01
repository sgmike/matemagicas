/* =========================================================
   Prueba automática de los generadores.
   Uso:  node tools/selftest.js [semillas]
   Comprueba, para cada generador y muchas semillas, que:
     · el ejercicio se construye sin errores
     · hay enunciado en los dos idiomas
     · la respuesta correcta se valida como correcta
     · hay solución paso a paso
     · no aparece NaN / undefined / Infinity en los textos
   ========================================================= */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const FILES = [
  'assets/js/core/core.js',
  'assets/js/core/store.js',
  'assets/js/core/i18n.js',
  'assets/js/content/lessons-1.js',
  'assets/js/content/lessons-2.js',
  'assets/js/content/lessons-3.js',
  'assets/js/content/gen-numbers.js',
  'assets/js/content/gen-proportion.js',
  'assets/js/content/gen-data-lang.js',
  'assets/js/content/gen-geometry.js',
  'assets/js/content/gen-problems.js',
  'assets/js/content/topics.js',
  'assets/js/content/plan.js',
  'assets/js/content/glossary.js'
];

/* entorno mínimo de navegador */
global.window = global;
global.document = {
  documentElement: { getAttribute: () => 'es', setAttribute: () => {} }
};
global.localStorage = {
  _d: {}, getItem(k) { return this._d[k] || null; },
  setItem(k, v) { this._d[k] = String(v); }, removeItem(k) { delete this._d[k]; }
};

FILES.forEach(f => {
  const p = path.join(ROOT, f);
  if (!fs.existsSync(p)) { console.log('  (falta ' + f + ', se omite)'); return; }
  try { vm.runInThisContext(fs.readFileSync(p, 'utf8'), { filename: f }); }
  catch (e) { console.error('✗ Error cargando ' + f + ':\n', e); process.exit(1); }
});

const MM = global.MM;
const SEEDS = Number(process.argv[2] || 200);
/* ojo: en letón "nulle/nullēm" contiene "null", por eso el negative lookahead */
const BAD = /(NaN|undefined|Infinity|\[object|null(?![a-zāēīōūčģķļņšž]))/;

let errors = 0, checked = 0;
const perTopic = {};

function textOf(t) {
  if (!t) return '';
  if (typeof t === 'string') return t;
  return String(t.es || '') + ' ||| ' + String(t.lv || '');
}

function fail(gen, seed, msg, extra) {
  errors++;
  console.error('✗ [' + gen + ' seed=' + seed + '] ' + msg + (extra ? '\n    ' + extra : ''));
}

const gens = MM.gen.all();
console.log('Generadores registrados: ' + gens.length + ' · semillas por generador: ' + SEEDS + '\n');

gens.forEach(def => {
  perTopic[def.topic] = (perTopic[def.topic] || 0) + 1;
  let localErr = 0;
  for (let i = 0; i < SEEDS; i++) {
    const seed = i * 7919 + 13;
    let ex;
    try { ex = MM.gen.make(def.id, seed); }
    catch (e) { fail(def.id, seed, 'excepción al generar: ' + e.message); localErr++; continue; }
    if (!ex) { fail(def.id, seed, 'devolvió null'); localErr++; continue; }
    checked++;

    /* enunciado bilingüe */
    if (!ex.q || !ex.q.es || !ex.q.lv) { fail(def.id, seed, 'falta enunciado en algún idioma'); localErr++; continue; }
    const qt = textOf(ex.q);
    if (BAD.test(qt)) { fail(def.id, seed, 'texto sospechoso en el enunciado', qt.slice(0, 220)); localErr++; }

    /* solución */
    if (!Array.isArray(ex.solution) || !ex.solution.length) { fail(def.id, seed, 'sin solución paso a paso'); localErr++; }
    else ex.solution.forEach((s, k) => {
      if (!s || !s.es || !s.lv) { fail(def.id, seed, 'paso ' + (k + 1) + ' incompleto'); localErr++; }
      else if (BAD.test(textOf(s))) { fail(def.id, seed, 'texto sospechoso en el paso ' + (k + 1), textOf(s).slice(0, 220)); localErr++; }
    });

    /* la respuesta correcta debe validarse */
    (ex.fields || []).forEach(f => {
      if (f.answer === undefined || f.answer === null || f.answer === '') {
        fail(def.id, seed, 'campo sin respuesta'); localErr++; return;
      }
      const canon = String(f.canonicalInput !== undefined ? f.canonicalInput : f.answer);
      if (!MM.checkField(f, canon)) {
        fail(def.id, seed, 'la respuesta canónica NO se valida: "' + canon + '" (tipo ' + (f.answerType || 'num') + ')');
        localErr++;
      }
      /* formatos alternativos que el alumno puede escribir */
      if ((f.answerType || 'num') === 'num') {
        const alt = canon.replace('.', ',');
        if (alt !== canon && !MM.checkField(f, alt)) { fail(def.id, seed, 'no acepta coma decimal: ' + alt); localErr++; }
        const fr = MM.parse(canon);
        if (fr && !fr.isInt() && fr.terminates() && !f.mustSimplify) {
          const dec = MM.n(fr.v);
          if (!MM.checkField(f, dec)) { fail(def.id, seed, 'no acepta el decimal equivalente: ' + dec); localErr++; }
        }
        if (fr && !fr.isInt()) {
          const mixed = fr.toMixedString();
          if (!MM.checkField(f, mixed)) { fail(def.id, seed, 'no acepta el número mixto equivalente: ' + mixed); localErr++; }
        }
      }
      /* una respuesta claramente falsa NO debe validarse */
      if ((f.answerType || 'num') === 'num') {
        const wrong = String(Number(MM.parse(canon) ? MM.parse(canon).v : 0) + 1.37);
        if (MM.checkField(f, wrong)) { fail(def.id, seed, 'acepta una respuesta incorrecta: ' + wrong); localErr++; }
      }
      if (BAD.test(String(MM.answerHtml(f)))) { fail(def.id, seed, 'respuesta mostrada sospechosa: ' + MM.answerHtml(f)); localErr++; }
    });

    if (localErr > 6) { console.error('  … se detiene este generador tras varios fallos'); break; }
  }
});

/* lecciones */
Object.keys(MM.LESSONS || {}).forEach(id => {
  const l = MM.LESSONS[id];
  if (!l.sections || !l.sections.length) { console.error('✗ lección ' + id + ' vacía'); errors++; }
  (l.sections || []).forEach(sec => {
    if (!sec.t || !sec.t.es || !sec.t.lv) { console.error('✗ lección ' + id + ': sección sin título bilingüe'); errors++; }
    (sec.b || []).forEach(bl => {
      const txt = JSON.stringify(bl);
      if (/NaN|undefined/.test(txt)) { console.error('✗ lección ' + id + ': bloque con texto sospechoso'); errors++; }
    });
  });
});

/* temas: todos deben tener lección y generadores */
if (MM.TOPICS) {
  MM.TOPICS.forEach(t => {
    if (!MM.LESSONS[t.id]) { console.error('✗ el tema ' + t.id + ' no tiene lección'); errors++; }
    const gs = MM.gen.byTopic(t.id);
    if (gs.length < 3) { console.error('✗ el tema ' + t.id + ' solo tiene ' + gs.length + ' generadores'); errors++; }
  });
  const covered = new Set(MM.TOPICS.map(t => t.id));
  gens.forEach(g => { if (!covered.has(g.topic)) { console.error('✗ el generador ' + g.id + ' apunta al tema inexistente ' + g.topic); errors++; } });
}

console.log('\nEjercicios comprobados: ' + checked);
console.log('Generadores por tema: ' + JSON.stringify(perTopic));
if (errors) { console.error('\n❌ ' + errors + ' problema(s) encontrados'); process.exit(1); }
console.log('\n✅ Todo correcto');
