/* =========================================================
   MateMágicas · núcleo
   - generador de números aleatorios reproducible (semilla)
   - clase Fracción con aritmética exacta
   - formato de números al estilo LV/ES (coma decimal)
   - lectura y validación de respuestas del alumno
   ========================================================= */
(function (global) {
  'use strict';

  const MM = global.MM || (global.MM = {});

  /* ---------------------------------------------------------
     Utilidades básicas
     --------------------------------------------------------- */
  const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) { [a, b] = [b, a % b]; } return a || 1; };
  const lcm = (a, b) => Math.abs(a * b) / gcd(a, b);
  MM.gcd = gcd; MM.lcm = lcm;

  MM.esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  MM.isPrime = n => {
    n = Math.abs(n);
    if (n < 2) return false;
    if (n % 2 === 0) return n === 2;
    for (let i = 3; i * i <= n; i += 2) if (n % i === 0) return false;
    return true;
  };
  MM.primeFactors = n => {                     // [2,2,3,7] para 84
    const out = []; n = Math.abs(n);
    for (let p = 2; p * p <= n; p++) while (n % p === 0) { out.push(p); n /= p; }
    if (n > 1) out.push(n);
    return out;
  };
  MM.factorPowers = n => {                     // [[2,2],[3,1],[7,1]]
    const f = MM.primeFactors(n), out = [];
    f.forEach(p => { const last = out[out.length - 1]; if (last && last[0] === p) last[1]++; else out.push([p, 1]); });
    return out;
  };
  MM.divisors = n => {
    const out = []; n = Math.abs(n);
    for (let i = 1; i * i <= n; i++) if (n % i === 0) { out.push(i); if (i !== n / i) out.push(n / i); }
    return out.sort((a, b) => a - b);
  };

  MM.hash = str => {                            // texto -> semilla entera
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  };

  MM.today = (d) => {
    d = d || new Date();
    const p = n => String(n).padStart(2, '0');
    return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate());
  };
  MM.daysBetween = (a, b) => Math.round((new Date(b) - new Date(a)) / 86400000);

  /* ---------------------------------------------------------
     Aleatoriedad reproducible (misma semilla = mismo ejercicio)
     --------------------------------------------------------- */
  function mulberry32(a) {
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      let t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  MM.rng = function (seed) {
    const r = mulberry32(typeof seed === 'string' ? MM.hash(seed) : (seed | 0));
    const api = {
      seed: seed,
      next: r,
      int(a, b) { return Math.floor(r() * (b - a + 1)) + a; },      // ambos inclusive
      pick(arr) { return arr[Math.floor(r() * arr.length)]; },
      chance(p) { return r() < p; },
      sign() { return r() < 0.5 ? -1 : 1; },
      shuffle(arr) {
        const a = arr.slice();
        for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
        return a;
      },
      sample(arr, k) { return api.shuffle(arr).slice(0, k); },
      /** entero de [a,b] distinto de los valores dados */
      intNot(a, b, not) {
        not = [].concat(not); let v, guard = 0;
        do { v = api.int(a, b); } while (not.includes(v) && ++guard < 60);
        return v;
      },
      /** divisor propio "bonito" de n */
      divisorOf(n) { const d = MM.divisors(n).filter(x => x > 1 && x < n); return d.length ? api.pick(d) : 1; }
    };
    return api;
  };

  /* ---------------------------------------------------------
     Fracciones exactas
     --------------------------------------------------------- */
  class Frac {
    constructor(n, d) {
      if (d === undefined) d = 1;
      if (d === 0) throw new Error('denominador 0');
      if (!Number.isFinite(n) || !Number.isFinite(d)) throw new Error('fracción no finita');
      if (d < 0) { n = -n; d = -d; }
      const g = gcd(n, d);
      this.n = Math.round(n / g);
      this.d = Math.round(d / g);
    }
    static from(x) {
      if (x instanceof Frac) return x;
      if (typeof x === 'number') {
        if (Number.isInteger(x)) return new Frac(x, 1);
        return Frac.fromString(String(x));
      }
      if (typeof x === 'string') return Frac.fromString(x);
      throw new Error('no convertible a fracción: ' + x);
    }
    /** Acepta "3", "-2,5", "3/4", "-1 2/3", "1.75" */
    static fromString(s) {
      const f = MM.parse(s);
      if (!f) throw new Error('no se pudo leer la fracción: ' + s);
      return f;
    }
    add(o) { o = Frac.from(o); return new Frac(this.n * o.d + o.n * this.d, this.d * o.d); }
    sub(o) { o = Frac.from(o); return new Frac(this.n * o.d - o.n * this.d, this.d * o.d); }
    mul(o) { o = Frac.from(o); return new Frac(this.n * o.n, this.d * o.d); }
    div(o) { o = Frac.from(o); if (o.n === 0) throw new Error('división por 0'); return new Frac(this.n * o.d, this.d * o.n); }
    neg() { return new Frac(-this.n, this.d); }
    abs() { return new Frac(Math.abs(this.n), this.d); }
    inv() { return new Frac(this.d, this.n); }
    pow(k) { let r = new Frac(1, 1); const b = k < 0 ? this.inv() : this; for (let i = 0; i < Math.abs(k); i++) r = r.mul(b); return r; }
    cmp(o) { o = Frac.from(o); return Math.sign(this.n * o.d - o.n * this.d); }
    eq(o) { return this.cmp(o) === 0; }
    lt(o) { return this.cmp(o) < 0; }
    gt(o) { return this.cmp(o) > 0; }
    get v() { return this.n / this.d; }
    valueOf() { return this.n / this.d; }
    isInt() { return this.d === 1; }
    isNeg() { return this.n < 0; }
    /** ¿tiene desarrollo decimal finito? */
    terminates() { let d = this.d; while (d % 2 === 0) d /= 2; while (d % 5 === 0) d /= 5; return d === 1; }
    toString() { return this.d === 1 ? String(this.n) : this.n + '/' + this.d; }
    /** {sign:-1|1, w:entero, n, d} */
    mixedParts() {
      const s = this.n < 0 ? -1 : 1, an = Math.abs(this.n);
      return { sign: s, w: Math.floor(an / this.d), n: an % this.d, d: this.d };
    }
    toMixedString() {
      const p = this.mixedParts(); const sg = p.sign < 0 ? '-' : '';
      if (p.n === 0) return sg + p.w;
      if (p.w === 0) return sg + p.n + '/' + p.d;
      return sg + p.w + ' ' + p.n + '/' + p.d;
    }
  }
  MM.Frac = Frac;
  MM.F = (n, d) => new Frac(n, d === undefined ? 1 : d);

  /* ---------------------------------------------------------
     Formato de números (coma decimal, como en LV y ES)
     --------------------------------------------------------- */
  /** número -> texto. 1234.5 -> "1234,5" ; 0.036 -> "0,036" */
  MM.n = function (x, dp) {
    if (x instanceof Frac) x = x.v;
    let s;
    if (dp === undefined) {
      s = String(Math.round(x * 1e10) / 1e10);
      if (s.includes('e')) s = x.toFixed(10);
    } else {
      s = Number(x).toFixed(dp);
    }
    if (s.includes('.')) s = s.replace(/0+$/, '').replace(/\.$/, '');
    if (s === '-0') s = '0';
    return s.replace('.', ',');
  };
  /** separador de miles con espacio fino (10 000) */
  MM.nk = function (x, dp) {
    const s = MM.n(x, dp).split(',');
    s[0] = s[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return s.join(',');
  };

  /** Fracción como HTML apilado.  opts: {mixed:true} */
  MM.fr = function (f, opts) {
    f = f instanceof Frac ? f : Frac.from(f);
    opts = opts || {};
    if (f.isInt()) return '<span class="mth">' + MM.n(f.n) + '</span>';
    if (opts.mixed) {
      const p = f.mixedParts();
      const sg = p.sign < 0 ? '−' : '';
      if (p.w === 0) return '<span class="mth">' + sg + frBox(p.n, p.d) + '</span>';
      return '<span class="mth mix">' + sg + p.w + frBox(p.n, p.d) + '</span>';
    }
    const sg = f.n < 0 ? '−' : '';
    return '<span class="mth">' + sg + frBox(Math.abs(f.n), f.d) + '</span>';
  };
  function frBox(n, d) { return '<span class="fr"><i>' + n + '</i><i>' + d + '</i></span>'; }

  /**
   * Fracción TAL CUAL, sin simplificar: imprescindible para enseñar
   * los pasos (8/42, 35/100, 27/42…). MM.fr() sí simplifica porque
   * trabaja con valores; MM.frn() solo dibuja lo que se le pide.
   */
  MM.frn = function (n, d) {
    if (d === 1 || d === undefined) return '<span class="mth">' + MM.n(n) + '</span>';
    const sg = n < 0 ? '−' : '';
    return '<span class="mth">' + sg + frBox(Math.abs(n), d) + '</span>';
  };

  /** número decimal en HTML con signo menos tipográfico */
  MM.d = function (x, dp) { return '<span class="mth">' + MM.n(x, dp).replace('-', '−') + '</span>'; };

  /** Envuelve una expresión matemática */
  MM.m = s => '<span class="mth">' + s + '</span>';

  /* ---------------------------------------------------------
     Lectura de la respuesta escrita por el alumno
     --------------------------------------------------------- */
  /**
   * Admite: 12 · −3,5 · 3/4 · -3/4 · 1 2/3 · 1u2153 no · "x = 5" · "5 %" · "5 cm"
   * Devuelve Frac o null.
   */
  MM.parse = function (raw) {
    if (raw === null || raw === undefined) return null;
    let s = String(raw).trim().toLowerCase();
    if (!s) return null;
    s = s.replace(/[−–—]/g, '-')     // menos tipográficos
         .replace(/[  ]/g, ' ')           // espacios raros
         .replace(/^[a-zā-ž]+\s*=\s*/i, '')         // "x = 5"
         .replace(/%/g, '')
         .replace(/(cm|mm|dm|km|m|kg|g|t|ml|l|h|min|s|€|eur|gab|piez|un|u)\.?$/i, '')
         .replace(/\s*:\s*/g, '/')                  // ":" como división
         .replace(/\s*\/\s*/g, '/')
         .replace(/,/g, '.')
         .trim();
    if (!s) return null;
    let m;
    if ((m = s.match(/^([+-]?)(\d+)\s+(\d+)\/(\d+)$/))) {          // mixto  1 2/3
      const sg = m[1] === '-' ? -1 : 1, w = +m[2], n = +m[3], d = +m[4];
      if (!d) return null;
      return new Frac(sg * (w * d + n), d);
    }
    if ((m = s.match(/^([+-]?\d+(?:\.\d+)?)\/([+-]?\d+(?:\.\d+)?)$/))) {  // a/b
      const a = decToFrac(m[1]), b = decToFrac(m[2]);
      if (!a || !b || b.n === 0) return null;
      return a.div(b);
    }
    if (/^[+-]?\d*\.?\d+$/.test(s)) return decToFrac(s);
    return null;
  };
  function decToFrac(s) {
    if (!/^[+-]?\d*\.?\d+$/.test(s)) return null;
    const neg = s.startsWith('-');
    s = s.replace(/^[+-]/, '');
    const [i, f] = s.split('.');
    const dec = f || '';
    const num = parseInt((i || '0') + dec, 10);
    const den = Math.pow(10, dec.length);
    return new Frac((neg ? -1 : 1) * num, den);
  }

  /** ¿el alumno escribió una fracción y está simplificada? */
  MM.typedFractionIsReduced = function (raw) {
    const s = String(raw).replace(/[−]/g, '-').replace(/\s*:\s*/g, '/').replace(/\s+/g, ' ').trim();
    const m = s.match(/^[+-]?(?:\d+\s+)?(\d+)\/(\d+)$/);
    if (!m) return true;                    // no escribió fracción: no aplica
    return gcd(+m[1], +m[2]) === 1;
  };

  /**
   * Comprueba la respuesta.
   * spec: { answer, tol, mustSimplify, mustBeMixed }
   */
  MM.check = function (spec, raw) {
    if (raw === null || raw === undefined || String(raw).trim() === '') return false;
    const got = MM.parse(raw);
    if (!got) return false;
    const want = spec.answer instanceof Frac ? spec.answer : Frac.from(spec.answer);
    if (spec.tol) return Math.abs(got.v - want.v) <= spec.tol + 1e-12;
    if (!got.eq(want)) return false;
    if (spec.mustSimplify && !MM.typedFractionIsReduced(raw)) return false;
    return true;
  };

  /**
   * Comprueba una descomposición en factores primos escrita por el alumno.
   * Acepta "2·2·3·7", "2*2*3*7", "2^2*3*7", "2²·3·7", "2x2x3x7"
   */
  MM.checkFactor = function (raw, n) {
    if (!raw) return false;
    let s = String(raw).toLowerCase().trim()
      .replace(/[·×x*]/g, '*')
      .replace(/\s+/g, '')
      .replace(/²/g, '^2').replace(/³/g, '^3').replace(/⁴/g, '^4').replace(/⁵/g, '^5');
    if (!/^[\d*^]+$/.test(s)) return false;
    const parts = s.split('*').filter(Boolean);
    if (!parts.length) return false;
    let prod = 1;
    for (const p of parts) {
      const [b, e] = p.split('^');
      const base = Number(b), exp = e === undefined ? 1 : Number(e);
      if (!Number.isInteger(base) || !Number.isInteger(exp) || exp < 1) return false;
      if (!MM.isPrime(base)) return false;            // todos los factores deben ser primos
      prod *= Math.pow(base, exp);
    }
    return prod === Number(n) && parts.length >= (MM.primeFactors(n).length > 1 ? 2 : 1);
  };

  /** valida un campo de respuesta según su tipo */
  MM.checkField = function (field, input) {
    const t = field.answerType || 'num';
    if (t === 'choice' || t === 'bool' || t === 'cmp') return String(input) === String(field.answer);
    if (t === 'factor') return MM.checkFactor(input, field.answer);
    return MM.check(field, input);
  };

  /** cómo se muestra la respuesta correcta */
  MM.answerHtml = function (field) {
    if (field.answerText) return field.answerText;
    const t = field.answerType || 'num';
    if (t === 'cmp') return '<b>' + field.answer + '</b>';
    if (t === 'bool' || t === 'choice') {
      const c = (field.choices || []).find(c => String(c.v) === String(field.answer));
      return c ? MM.bi(c.t) : '<b>' + field.answer + '</b>';
    }
    if (t === 'factor') return '<b>' + String(field.answer) + ' = ' + MM.primeFactors(field.answer).join(' · ') + '</b>';
    const u = field.unit ? ' ' + (typeof field.unit === 'string' ? field.unit : MM.bi(field.unit)) : '';
    try {
      const f = Frac.from(field.answer);
      return '<b>' + (f.isInt() || f.terminates() ? MM.n(f.v) : MM.fr(f, { mixed: true })) + '</b>' + u;
    } catch (e) { return '<b>' + MM.esc(field.answer) + '</b>' + u; }
  };

  /* ---------------------------------------------------------
     Textos bilingües
     --------------------------------------------------------- */
  /** T('hola','sveiki') -> {es, lv} */
  const T = (es, lv) => ({ es: es, lv: lv === undefined ? es : lv });
  MM.T = T;

  /** en línea:  Español · Latviski */
  MM.bi = function (t) {
    if (!t) return '';
    if (typeof t === 'string') return t;
    return '<span class="bi"><span class="es">' + t.es + '</span><span class="lv">' + (t.lv || t.es) + '</span></span>';
  };
  /** en bloque: una línea cada idioma */
  MM.biB = function (t, tag) {
    if (!t) return '';
    tag = tag || 'div';
    if (typeof t === 'string') return '<' + tag + '>' + t + '</' + tag + '>';
    return '<' + tag + ' class="bi-b bi"><span class="es">' + t.es + '</span><span class="lv">' + (t.lv || t.es) + '</span></' + tag + '>';
  };
  /** texto plano en el idioma activo (para títulos, aria-label…) */
  MM.txt = function (t) {
    if (!t) return '';
    if (typeof t === 'string') return t;
    const lang = document.documentElement.getAttribute('data-lang');
    const s = lang === 'lv' ? (t.lv || t.es) : t.es;
    return String(s).replace(/<[^>]+>/g, '');
  };

  /* ---------------------------------------------------------
     Palabras que se repiten mucho en los enunciados
     --------------------------------------------------------- */
  MM.W = {
    calc: T('Calcula', 'Aprēķini'),
    solve: T('Resuelve', 'Atrisini'),
    compare: T('Compara', 'Salīdzini'),
    determine: T('Determina', 'Nosaki'),
    convert: T('Convierte las unidades', 'Pārveido mērvienības'),
    simplify: T('Simplifica', 'Saīsini'),
    answer: T('Respuesta', 'Atbilde'),
    howMany: T('¿Cuántos?', 'Cik?'),
    yes: T('Sí', 'Jā'),
    no: T('No', 'Nē'),
    trueFalse: T('¿Verdadero o falso?', 'Patiess vai aplams?'),
    result: T('Resultado', 'Rezultāts'),
    total: T('Total', 'Kopā'),
    euro: T('€', '€'),
    minutes: T('minutos', 'minūtes'),
    hours: T('horas', 'stundas'),
    km: T('km', 'km'),
    cm: T('cm', 'cm')
  };

  /* nombres letones para los enunciados (los mismos en ambos idiomas) */
  MM.NAMES = ['Anna', 'Marta', 'Elza', 'Laura', 'Sofija', 'Emīls', 'Roberts', 'Kārlis', 'Jānis', 'Toms',
              'Ilze', 'Guna', 'Dace', 'Zane', 'Rūdolfs', 'Mārcis', 'Juris', 'Alise', 'Katrīna', 'Artūrs'];

  /* ---------------------------------------------------------
     Registro de generadores de ejercicios
     Un ejercicio queda definido por (idGenerador, semilla):
     con esos dos datos se vuelve a construir siempre igual.
     --------------------------------------------------------- */
  MM.gen = {
    list: {},
    /**
     * def = { topic, level:1|2|3, part:'A'|'B', points, name:T(), make(rng) }
     * make(rng) devuelve:
     *   { q:T(), answer, answerType, unit, choices, fields, solution:[T()], hint:T(), answerText }
     */
    register(id, def) {
      def.id = id;
      def.points = def.points || (def.part === 'B' ? 3 : 1);
      def.level = def.level || 1;
      def.part = def.part || 'A';
      this.list[id] = def;
      return def;
    },
    byTopic(topicId) { return Object.values(this.list).filter(g => g.topic === topicId); },
    all() { return Object.values(this.list); },
    /** construye el ejercicio concreto */
    make(genId, seed) {
      const def = this.list[genId];
      if (!def) return null;
      const rng = MM.rng(genId + '#' + seed);
      let ex;
      try { ex = def.make(rng); }
      catch (e) { console.error('Error generando ' + genId, e); return null; }
      ex.gen = genId; ex.seed = seed; ex.topic = def.topic;
      ex.level = ex.level || def.level; ex.part = ex.part || def.part;
      ex.points = ex.points || def.points;
      ex.typeName = def.name;
      if (!ex.fields) {
        ex.fields = [{
          key: 'a', answer: ex.answer, answerType: ex.answerType || 'num',
          unit: ex.unit, tol: ex.tol, mustSimplify: ex.mustSimplify,
          choices: ex.choices, label: ex.label, answerText: ex.answerText,
          canonicalInput: ex.canonicalInput, placeholder: ex.placeholder
        }];
      }
      return ex;
    },
    /** semilla nueva basada en el reloj */
    newSeed() { return (Date.now() % 100000) * 97 + Math.floor(Math.random() * 97); }
  };

})(typeof window !== 'undefined' ? window : globalThis);
