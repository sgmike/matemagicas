/* =========================================================
   Generadores 1–5 · naturales, fracciones, decimales,
   negativos, potencias y orden de operaciones
   Cada generador crea ejercicios infinitos a partir de una
   semilla, con su solución paso a paso calculada.
   ========================================================= */
(function (global) {
  'use strict';
  const MM = global.MM, T = MM.T, F = (n, d) => MM.F(n, d);
  const reg = (id, def) => MM.gen.register(id, def);

  /* ---------- utilidades comunes a todos los generadores ---------- */
  const G = MM.G = {
    /* fracción sin simplificar, para mostrar los pasos intermedios */
    fr: (n, d) => MM.frn(n, d),
    frf: (f, mixed) => MM.fr(f, { mixed: !!mixed }),
    n: MM.n,
    calc: expr => T('Calcula: ' + expr, 'Aprēķini: ' + expr),
    /** respuesta numérica */
    num(x, opts) {
      return Object.assign({ answerType: 'num', answer: (x instanceof MM.Frac) ? x.toString() : String(x) }, opts || {});
    },
    /** respuesta en forma de fracción (se exige simplificada) */
    frac(f, mixed) {
      return {
        answerType: 'num', answer: f.toString(), mustSimplify: true,
        answerText: '<b>' + MM.fr(f, { mixed: !!mixed }) + '</b>' + (f.isInt() ? '' : (mixed ? '' : ''))
      };
    },
    /** comparación  <  >  = */
    cmpField(a, b) {
      const s = a.cmp ? a.cmp(b) : Math.sign(a - b);
      const sym = s < 0 ? '<' : (s > 0 ? '>' : '=');
      return {
        answerType: 'cmp', answer: sym,
        choices: [{ v: '<', t: '&lt;' }, { v: '=', t: '=' }, { v: '>', t: '&gt;' }]
      };
    },
    /** verdadero / falso */
    bool(isTrue) {
      return {
        answerType: 'bool', answer: isTrue ? '1' : '0',
        choices: [{ v: '1', t: T('Sí / Patiess', 'Jā / Patiess') }, { v: '0', t: T('No / Falso', 'Nē / Aplams') }]
      };
    },
    /** opción múltiple: mezcla la correcta con las incorrectas */
    mc(rng, correct, wrongs) {
      const items = rng.shuffle([{ t: correct, ok: true }].concat(wrongs.map(w => ({ t: w, ok: false }))));
      return {
        answerType: 'choice',
        choices: items.map((it, i) => ({ v: String(i), t: it.t })),
        answer: String(items.findIndex(it => it.ok))
      };
    },
    name: rng => rng.pick(MM.NAMES),
    names: (rng, k) => rng.sample(MM.NAMES, k)
  };
  const fr = G.fr, frf = G.frf, n = MM.n;

  /* =====================================================
     TEMA 1 · NATURALES Y DIVISIBILIDAD
     ===================================================== */

  function critText(k, num) {
    const ds = String(num).split('').map(Number), s = ds.reduce((a, b) => a + b, 0);
    const ok = num % k === 0;
    switch (k) {
      case 2: return T('Termina en ' + (num % 10) + ' → ' + (ok ? 'es par' : 'no es par') + '.',
                       'Beidzas ar ' + (num % 10) + ' → ' + (ok ? 'ir pāra skaitlis' : 'nav pāra skaitlis') + '.');
      case 3: return T('Suma de cifras: ' + ds.join(' + ') + ' = ' + s + ' → ' + (s % 3 === 0 ? 'divisible entre 3' : 'no divisible entre 3') + '.',
                       'Ciparu summa: ' + ds.join(' + ') + ' = ' + s + ' → ' + (s % 3 === 0 ? 'dalās ar 3' : 'nedalās ar 3') + '.');
      case 4: return T('Las dos últimas cifras: ' + (num % 100) + ' → ' + (num % 4 === 0 ? 'divisible entre 4' : 'no divisible entre 4') + '.',
                       'Pēdējie divi cipari: ' + (num % 100) + ' → ' + (num % 4 === 0 ? 'dalās ar 4' : 'nedalās ar 4') + '.');
      case 5: return T('Termina en ' + (num % 10) + ' → ' + (ok ? 'divisible entre 5' : 'no divisible entre 5') + '.',
                       'Beidzas ar ' + (num % 10) + ' → ' + (ok ? 'dalās ar 5' : 'nedalās ar 5') + '.');
      case 6: return T('Entre 2: ' + (num % 2 === 0 ? 'sí' : 'no') + '. Entre 3: suma ' + s + ' → ' + (s % 3 === 0 ? 'sí' : 'no') + '. Hacen falta los dos.',
                       'Ar 2: ' + (num % 2 === 0 ? 'jā' : 'nē') + '. Ar 3: summa ' + s + ' → ' + (s % 3 === 0 ? 'jā' : 'nē') + '. Vajag abus.');
      case 9: return T('Suma de cifras: ' + s + ' → ' + (s % 9 === 0 ? 'divisible entre 9' : 'no divisible entre 9') + '.',
                       'Ciparu summa: ' + s + ' → ' + (s % 9 === 0 ? 'dalās ar 9' : 'nedalās ar 9') + '.');
      default: return T('Termina en ' + (num % 10) + ' → ' + (ok ? 'divisible entre 10' : 'no divisible entre 10') + '.',
                        'Beidzas ar ' + (num % 10) + ' → ' + (ok ? 'dalās ar 10' : 'nedalās ar 10') + '.');
    }
  }

  reg('nat.divisible', {
    topic: 'nat', level: 1, part: 'A', name: T('Criterios de divisibilidad', 'Dalāmības pazīmes'),
    make(rng) {
      const k = rng.pick([2, 3, 4, 5, 6, 9, 10]);
      const yes = rng.chance(0.5);
      let num;
      if (yes) num = k * rng.int(13, 111);
      else { do { num = rng.int(120, 999); } while (num % k === 0); }
      return Object.assign({
        q: T('¿El número <b>' + num + '</b> es divisible entre <b>' + k + '</b>?',
             'Vai skaitlis <b>' + num + '</b> dalās ar <b>' + k + '</b>?'),
        solution: [critText(k, num),
          T('Respuesta: <b>' + (num % k === 0 ? 'sí' : 'no') + '</b> (' + num + ' : ' + k + (num % k === 0 ? ' = ' + (num / k) : ' deja resto ' + (num % k)) + ')',
            'Atbilde: <b>' + (num % k === 0 ? 'jā' : 'nē') + '</b> (' + num + ' : ' + k + (num % k === 0 ? ' = ' + (num / k) : ' atlikums ' + (num % k)) + ')')],
        hint: T('Repasa el criterio del ' + k + '.', 'Atceries dalāmības pazīmi ar ' + k + '.')
      }, G.bool(num % k === 0));
    }
  });

  reg('nat.whichdiv', {
    topic: 'nat', level: 2, part: 'A', name: T('¿Cuál es divisible?', 'Kurš dalās?'),
    make(rng) {
      const k = rng.pick([3, 4, 6, 9]);
      const good = k * rng.int(20, 120);
      const bads = [];
      while (bads.length < 3) { const x = rng.int(100, 999); if (x % k !== 0 && !bads.includes(x)) bads.push(x); }
      return Object.assign({
        q: T('¿Cuál de estos números es divisible entre <b>' + k + '</b>?',
             'Kurš no šiem skaitļiem dalās ar <b>' + k + '</b>?'),
        solution: [critText(k, good),
          T('<b>' + good + '</b> = ' + k + ' · ' + (good / k), '<b>' + good + '</b> = ' + k + ' · ' + (good / k))]
      }, G.mc(rng, String(good), bads.map(String)));
    }
  });

  reg('nat.divisors', {
    topic: 'nat', level: 1, part: 'A', name: T('Divisores de un número', 'Skaitļa dalītāji'),
    make(rng) {
      const num = rng.pick([12, 16, 18, 20, 24, 28, 30, 36, 40, 42, 45, 48, 50, 54, 60, 72]);
      const ds = MM.divisors(num);
      return Object.assign({
        q: T('¿Cuántos divisores tiene el número <b>' + num + '</b>?',
             'Cik dalītāju ir skaitlim <b>' + num + '</b>?'),
        solution: [
          T('Se buscan por parejas: ' + ds.map(d => d + ' · ' + (num / d)).slice(0, Math.ceil(ds.length / 2)).join(', '),
            'Meklē pa pāriem: ' + ds.map(d => d + ' · ' + (num / d)).slice(0, Math.ceil(ds.length / 2)).join(', ')),
          T('Divisores: ' + ds.join(', '), 'Dalītāji: ' + ds.join(', ')),
          T('En total hay <b>' + ds.length + '</b>.', 'Kopā ir <b>' + ds.length + '</b>.')
        ],
        hint: T('Ve probando 1, 2, 3… y apunta también el compañero de cada uno.',
                'Pārbaudi 1, 2, 3… un pieraksti arī katra pāri.')
      }, G.num(ds.length));
    }
  });

  reg('nat.factor', {
    topic: 'nat', level: 2, part: 'A', name: T('Descomponer en factores primos', 'Sadalīšana pirmreizinātājos'),
    make(rng) {
      const num = rng.pick([84, 90, 120, 126, 132, 150, 168, 180, 198, 210, 225, 240, 252, 300, 360]);
      const pf = MM.primeFactors(num), pw = MM.factorPowers(num);
      const steps = []; let x = num;
      pf.forEach(p => { steps.push(x + ' : ' + p + ' = ' + (x / p)); x /= p; });
      return {
        q: T('Descompón <b>' + num + '</b> en factores primos.<br><small class="muted">Escríbelo así: 2·2·3·7 o 2^2·3·7</small>',
             'Sadali <b>' + num + '</b> pirmreizinātājos.<br><small class="muted">Raksti šādi: 2·2·3·7 vai 2^2·3·7</small>'),
        answerType: 'factor', answer: num, canonicalInput: pf.join('·'),
        answerText: '<b>' + pf.join(' · ') + ' = ' + pw.map(([p, e]) => e > 1 ? p + '<sup>' + e + '</sup>' : p).join(' · ') + '</b>',
        solution: [
          T('Se divide siempre por el primo más pequeño posible:', 'Dala ar mazāko iespējamo pirmskaitli:'),
          T(steps.join(' → '), steps.join(' → ')),
          T('<b>' + num + ' = ' + pf.join(' · ') + '</b>', '<b>' + num + ' = ' + pf.join(' · ') + '</b>')
        ],
        hint: T('Empieza probando 2, luego 3, luego 5, luego 7…', 'Sāc ar 2, tad 3, tad 5, tad 7…')
      };
    }
  });

  reg('nat.gcdlcm', {
    topic: 'nat', level: 2, part: 'A', name: T('MCD y mcm', 'LKD un MKD'),
    make(rng) {
      const a = rng.pick([12, 15, 16, 18, 20, 24, 28, 30, 36, 40, 45]);
      const b = rng.pick([12, 15, 18, 20, 24, 27, 30, 32, 40, 42, 48, 60].filter(x => x !== a));
      const g = MM.gcd(a, b), l = MM.lcm(a, b);
      const fa = MM.factorPowers(a).map(([p, e]) => e > 1 ? p + '<sup>' + e + '</sup>' : p).join(' · ');
      const fb = MM.factorPowers(b).map(([p, e]) => e > 1 ? p + '<sup>' + e + '</sup>' : p).join(' · ');
      return {
        q: T('Halla el <b>MCD</b> y el <b>mcm</b> de <b>' + a + '</b> y <b>' + b + '</b>.',
             'Atrodi skaitļu <b>' + a + '</b> un <b>' + b + '</b> <b>LKD</b> un <b>MKD</b>.'),
        fields: [
          { key: 'g', label: T('MCD (LKD)', 'LKD'), answerType: 'num', answer: String(g) },
          { key: 'l', label: T('mcm (MKD)', 'MKD'), answerType: 'num', answer: String(l) }
        ],
        solution: [
          T(a + ' = ' + fa + ' &nbsp;·&nbsp; ' + b + ' = ' + fb, a + ' = ' + fa + ' &nbsp;·&nbsp; ' + b + ' = ' + fb),
          T('MCD = lo común con el exponente menor = <b>' + g + '</b>', 'LKD = kopīgie ar mazāko kāpinātāju = <b>' + g + '</b>'),
          T('mcm = todo con el exponente mayor = <b>' + l + '</b>', 'MKD = visi ar lielāko kāpinātāju = <b>' + l + '</b>'),
          T('Comprobación: ' + g + ' · ' + l + ' = ' + (g * l) + ' = ' + a + ' · ' + b + ' ✓',
            'Pārbaude: ' + g + ' · ' + l + ' = ' + (g * l) + ' = ' + a + ' · ' + b + ' ✓')
        ]
      };
    }
  });

  reg('nat.multiples', {
    topic: 'nat', level: 2, part: 'A', name: T('Múltiplos', 'Dalāmie'),
    make(rng) {
      const a = rng.int(6, 25), k = rng.pick([2, 3, 4, 6]);
      const ms = [a, 2 * a, 3 * a], hit = ms.filter(x => x % k === 0);
      return {
        q: T('¿Cuántos de los <b>tres múltiplos naturales más pequeños</b> de ' + a + ' son divisibles entre <b>' + k + '</b>?',
             'Cik no skaitļa ' + a + ' <b>trim mazākajiem naturālajiem dalāmajiem</b> dalās ar <b>' + k + '</b>?'),
        answerType: 'num', answer: String(hit.length),
        solution: [
          T('Los tres múltiplos más pequeños de ' + a + ' son ' + ms.join(', ') + '.',
            'Trīs mazākie ' + a + ' dalāmie ir ' + ms.join(', ') + '.'),
          T(ms.map(x => x + ' : ' + k + (x % k === 0 ? ' ✓' : ' ✗')).join(' &nbsp; '),
            ms.map(x => x + ' : ' + k + (x % k === 0 ? ' ✓' : ' ✗')).join(' &nbsp; ')),
          T('Respuesta: <b>' + hit.length + '</b>' + (hit.length ? ' (' + hit.join(', ') + ')' : ''),
            'Atbilde: <b>' + hit.length + '</b>' + (hit.length ? ' (' + hit.join(', ') + ')' : ''))
        ],
        hint: T('Múltiplo = el número multiplicado por 1, 2, 3… El propio número cuenta.',
                'Dalāmais = skaitlis, reizināts ar 1, 2, 3… Pats skaitlis arī skaitās.')
      };
    }
  });

  reg('nat.bus', {
    topic: 'nat', level: 2, part: 'B', points: 3, name: T('Problema de mcm', 'MKD uzdevums'),
    make(rng) {
      const a = rng.pick([8, 9, 10, 12, 14, 15]), b = rng.pick([6, 12, 16, 18, 20, 21, 24].filter(x => x !== a));
      const l = MM.lcm(a, b), h = rng.int(7, 10);
      const endH = h + Math.floor(l / 60), endM = l % 60;
      const ctx = rng.pick([
        T('Dos autobuses salen de la misma parada: uno cada <b>' + a + '</b> minutos y otro cada <b>' + b + '</b> minutos.',
          'No vienas pieturas izbrauc divi autobusi: viens ik pēc <b>' + a + '</b> minūtēm, otrs ik pēc <b>' + b + '</b> minūtēm.'),
        T('Dos faros parpadean: uno cada <b>' + a + '</b> segundos y otro cada <b>' + b + '</b> segundos.',
          'Divas bākas mirgo: viena ik pēc <b>' + a + '</b> sekundēm, otra ik pēc <b>' + b + '</b> sekundēm.')
      ]);
      return {
        q: T(ctx.es + ' Coinciden a las <b>' + h + ':00</b>. ¿Cuántos minutos pasan hasta que vuelven a coincidir?',
             ctx.lv + ' Tie sakrīt plkst. <b>' + h + ':00</b>. Pēc cik minūtēm tie sakritīs atkal?'),
        answerType: 'num', answer: String(l), unit: 'min',
        solution: [
          T('Vuelven a coincidir en el <b>mínimo común múltiplo</b> de ' + a + ' y ' + b + '.',
            'Tie sakrīt <b>mazākajā kopīgajā dalāmajā</b> skaitļiem ' + a + ' un ' + b + '.'),
          T(a + ' = ' + MM.primeFactors(a).join(' · ') + ' &nbsp;·&nbsp; ' + b + ' = ' + MM.primeFactors(b).join(' · '),
            a + ' = ' + MM.primeFactors(a).join(' · ') + ' &nbsp;·&nbsp; ' + b + ' = ' + MM.primeFactors(b).join(' · ')),
          T('mcm(' + a + '; ' + b + ') = <b>' + l + ' minutos</b>', 'MKD(' + a + '; ' + b + ') = <b>' + l + ' minūtes</b>'),
          T('Es decir, a las ' + endH + ':' + String(endM).padStart(2, '0') + '.',
            'Tas ir plkst. ' + endH + ':' + String(endM).padStart(2, '0') + '.')
        ]
      };
    }
  });

  reg('nat.share', {
    topic: 'nat', level: 3, part: 'B', points: 3, name: T('Problema de MCD', 'LKD uzdevums'),
    make(rng) {
      const g = rng.pick([6, 8, 9, 12]), x = rng.int(2, 6), y = rng.int(2, 7);
      const a = g * x, b = g * y;
      const gg = MM.gcd(a, b);
      const nm = G.name(rng);
      return {
        q: T(nm + ' quiere repartir <b>' + a + ' lápices</b> y <b>' + b + ' gomas</b> en bolsas iguales, sin que sobre nada. ¿Cuál es el <b>mayor número de bolsas</b> que puede hacer?',
             nm + ' vēlas sadalīt <b>' + a + ' zīmuļus</b> un <b>' + b + ' dzēšgumijas</b> vienādos maisiņos, lai nekas nepaliktu pāri. Kāds ir <b>lielākais maisiņu skaits</b>?'),
        fields: [
          { key: 'g', label: T('Bolsas', 'Maisiņi'), answerType: 'num', answer: String(gg) },
          { key: 'p', label: T('Lápices en cada bolsa', 'Zīmuļi katrā maisiņā'), answerType: 'num', answer: String(a / gg) }
        ],
        solution: [
          T('“Repartir en partes iguales sin que sobre” → <b>MCD</b>.', '“Sadalīt vienādi, lai nekas nepaliek pāri” → <b>LKD</b>.'),
          T(a + ' = ' + MM.primeFactors(a).join(' · ') + ' &nbsp;·&nbsp; ' + b + ' = ' + MM.primeFactors(b).join(' · '),
            a + ' = ' + MM.primeFactors(a).join(' · ') + ' &nbsp;·&nbsp; ' + b + ' = ' + MM.primeFactors(b).join(' · ')),
          T('MCD(' + a + '; ' + b + ') = <b>' + gg + ' bolsas</b>', 'LKD(' + a + '; ' + b + ') = <b>' + gg + ' maisiņi</b>'),
          T('En cada bolsa: ' + a + ' : ' + gg + ' = <b>' + (a / gg) + ' lápices</b> y ' + b + ' : ' + gg + ' = ' + (b / gg) + ' gomas.',
            'Katrā maisiņā: ' + a + ' : ' + gg + ' = <b>' + (a / gg) + ' zīmuļi</b> un ' + b + ' : ' + gg + ' = ' + (b / gg) + ' dzēšgumijas.')
        ]
      };
    }
  });

  /* =====================================================
     TEMA 2 · FRACCIONES
     ===================================================== */

  function addSubSteps(f1, f2, op) {
    const L = MM.lcm(f1.d, f2.d);
    const a = f1.n * (L / f1.d), b = f2.n * (L / f2.d);
    const res = op === '+' ? f1.add(f2) : f1.sub(f2);
    const raw = F(op === '+' ? a + b : a - b, L);
    const steps = [
      T('Denominador común: mcm(' + f1.d + '; ' + f2.d + ') = <b>' + L + '</b>',
        'Kopsaucējs: MKD(' + f1.d + '; ' + f2.d + ') = <b>' + L + '</b>'),
      T(MM.fr(f1) + ' = ' + fr(a, L) + ' &nbsp;·&nbsp; ' + MM.fr(f2) + ' = ' + fr(b, L),
        MM.fr(f1) + ' = ' + fr(a, L) + ' &nbsp;·&nbsp; ' + MM.fr(f2) + ' = ' + fr(b, L)),
      T(fr(a, L) + ' ' + op + ' ' + fr(b, L) + ' = ' + fr(op === '+' ? a + b : a - b, L),
        fr(a, L) + ' ' + op + ' ' + fr(b, L) + ' = ' + fr(op === '+' ? a + b : a - b, L))
    ];
    if (raw.d !== L || Math.abs(raw.n) !== Math.abs(op === '+' ? a + b : a - b)) {
      steps.push(T('Se simplifica: <b>' + MM.fr(res, { mixed: true }) + '</b>', 'Saīsina: <b>' + MM.fr(res, { mixed: true }) + '</b>'));
    } else {
      steps.push(T('Resultado: <b>' + MM.fr(res, { mixed: true }) + '</b>', 'Rezultāts: <b>' + MM.fr(res, { mixed: true }) + '</b>'));
    }
    return { res, steps };
  }

  reg('frac.addsub', {
    topic: 'frac', level: 1, part: 'A', name: T('Sumar y restar fracciones', 'Daļu saskaitīšana un atņemšana'),
    make(rng) {
      const d1 = rng.pick([4, 6, 8, 9, 10, 12, 14, 15, 18, 20, 21]);
      let d2 = rng.pick([3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 15, 16]);
      const n1 = rng.int(1, d1 - 1), n2 = rng.int(1, d2 - 1);
      let f1 = F(n1, d1), f2 = F(n2, d2);
      const op = rng.chance(0.5) ? '+' : '−';
      if (op === '−' && f1.lt(f2)) { const t = f1; f1 = f2; f2 = t; }
      const { res, steps } = addSubSteps(f1, f2, op === '+' ? '+' : '−');
      return Object.assign({
        q: G.calc(MM.fr(f1) + ' <span class="op">' + op + '</span> ' + MM.fr(f2)),
        solution: steps,
        hint: T('Primero busca el denominador común (el mcm).', 'Vispirms atrodi kopsaucēju (MKD).')
      }, G.frac(res, true));
    }
  });

  reg('frac.mixadd', {
    topic: 'frac', level: 2, part: 'A', name: T('Mixtos: sumar y restar', 'Jaukti skaitļi: saskaitīt un atņemt'),
    make(rng) {
      const d1 = rng.pick([4, 6, 8, 9, 12]), d2 = rng.pick([3, 4, 6, 8, 9, 12]);
      const w1 = rng.int(2, 7), w2 = rng.int(1, w1 - 1);
      const n1 = rng.int(1, d1 - 1), n2 = rng.int(1, d2 - 1);
      const f1 = F(w1 * d1 + n1, d1), f2 = F(w2 * d2 + n2, d2);
      const op = rng.chance(0.45) ? '+' : '−';
      const a = op === '+' ? f1 : (f1.gt(f2) ? f1 : f2), b = op === '+' ? f2 : (f1.gt(f2) ? f2 : f1);
      const res = op === '+' ? a.add(b) : a.sub(b);
      const L = MM.lcm(a.d, b.d);
      const pa = a.mixedParts(), pb = b.mixedParts();
      const na = pa.n * (L / a.d), nb = pb.n * (L / b.d);
      const steps = [
        T('Denominador común ' + L + ': ' + MM.fr(a, { mixed: true }) + ' = ' + pa.w + ' ' + fr(na, L) + ' &nbsp;y&nbsp; ' + MM.fr(b, { mixed: true }) + ' = ' + pb.w + ' ' + fr(nb, L),
          'Kopsaucējs ' + L + ': ' + MM.fr(a, { mixed: true }) + ' = ' + pa.w + ' ' + fr(na, L) + ' &nbsp;un&nbsp; ' + MM.fr(b, { mixed: true }) + ' = ' + pb.w + ' ' + fr(nb, L))
      ];
      if (op === '−' && na < nb) {
        steps.push(T('Como ' + na + ' &lt; ' + nb + ', se pide prestada una unidad: ' + pa.w + ' ' + fr(na, L) + ' = ' + (pa.w - 1) + ' ' + fr(na + L, L),
                     'Tā kā ' + na + ' &lt; ' + nb + ', aizņemamies vienu veselo: ' + pa.w + ' ' + fr(na, L) + ' = ' + (pa.w - 1) + ' ' + fr(na + L, L)));
      }
      steps.push(T('Enteros y fracciones por separado → <b>' + MM.fr(res, { mixed: true }) + '</b>',
                   'Veselos un daļas atsevišķi → <b>' + MM.fr(res, { mixed: true }) + '</b>'));
      return Object.assign({
        q: G.calc(MM.fr(a, { mixed: true }) + ' <span class="op">' + op + '</span> ' + MM.fr(b, { mixed: true })),
        solution: steps,
        hint: op === '−' ? T('Si la primera fracción es menor, pide prestada una unidad.', 'Ja pirmā daļa ir mazāka, aizņemies vienu veselo.')
                         : T('Suma los enteros por un lado y las fracciones por otro.', 'Saskaiti veselos atsevišķi un daļas atsevišķi.')
      }, G.frac(res, true));
    }
  });

  reg('frac.mul', {
    topic: 'frac', level: 1, part: 'A', name: T('Multiplicar fracciones', 'Daļu reizināšana'),
    make(rng) {
      const useMixed = rng.chance(0.4);
      const d1 = rng.pick([3, 4, 5, 6, 7, 8, 9, 10, 12, 15]), d2 = rng.pick([3, 4, 5, 6, 7, 8, 9, 10, 14, 16]);
      let f1 = F(rng.int(1, d1 - 1), d1), f2 = F(rng.int(1, d2 - 1), d2);
      if (useMixed) f2 = F(rng.int(1, 3) * d2 + rng.int(1, d2 - 1), d2);
      const res = f1.mul(f2);
      const showA = useMixed ? MM.fr(f1) : MM.fr(f1), showB = useMixed ? MM.fr(f2, { mixed: true }) : MM.fr(f2);
      const steps = [];
      if (useMixed) steps.push(T('Primero a fracción impropia: ' + MM.fr(f2, { mixed: true }) + ' = ' + MM.fr(f2),
                                 'Vispirms par neīsto daļu: ' + MM.fr(f2, { mixed: true }) + ' = ' + MM.fr(f2)));
      steps.push(T('Numerador · numerador y denominador · denominador: ' + fr(f1.n * f2.n, f1.d * f2.d),
                   'Skaitītājs · skaitītājs, saucējs · saucējs: ' + fr(f1.n * f2.n, f1.d * f2.d)));
      if (f1.n * f2.n !== res.n || f1.d * f2.d !== res.d) {
        steps.push(T('Se simplifica dividiendo entre ' + MM.gcd(f1.n * f2.n, f1.d * f2.d) + ': <b>' + MM.fr(res, { mixed: true }) + '</b>',
                     'Saīsina, dalot ar ' + MM.gcd(f1.n * f2.n, f1.d * f2.d) + ': <b>' + MM.fr(res, { mixed: true }) + '</b>'));
      }
      steps.push(T('Consejo: simplificar <b>en cruz antes</b> de multiplicar evita números enormes.',
                   'Padoms: saīsināt <b>krustām pirms</b> reizināšanas — skaitļi paliek mazi.'));
      return Object.assign({
        q: G.calc(showA + ' <span class="op">·</span> ' + showB),
        solution: steps
      }, G.frac(res, true));
    }
  });

  reg('frac.div', {
    topic: 'frac', level: 2, part: 'A', name: T('Dividir fracciones', 'Daļu dalīšana'),
    make(rng) {
      const kind = rng.int(1, 3);
      let f1, f2, qa, qb;
      const d1 = rng.pick([3, 4, 5, 6, 8, 9, 10, 12]), d2 = rng.pick([2, 3, 4, 5, 6, 7, 8, 9]);
      if (kind === 1) { f1 = F(rng.int(1, d1 - 1), d1); f2 = F(rng.int(1, d2 - 1), d2); qa = MM.fr(f1); qb = MM.fr(f2); }
      else if (kind === 2) { f1 = F(rng.int(1, 4) * d1 + rng.int(1, d1 - 1), d1); f2 = F(rng.int(1, d2 - 1), d2); qa = MM.fr(f1, { mixed: true }); qb = MM.fr(f2); }
      else { f1 = F(rng.int(2, 9), 1); f2 = F(rng.int(1, d2 - 1), d2); qa = String(f1.n); qb = MM.fr(f2); }
      const res = f1.div(f2);
      return Object.assign({
        q: G.calc(qa + ' <span class="op">:</span> ' + qb),
        solution: [
          kind === 2 ? T('A fracción impropia: ' + MM.fr(f1, { mixed: true }) + ' = ' + MM.fr(f1), 'Par neīsto daļu: ' + MM.fr(f1, { mixed: true }) + ' = ' + MM.fr(f1))
                     : T('Dividir = multiplicar por el recíproco.', 'Dalīt = reizināt ar apgriezto daļu.'),
          T('El recíproco de ' + MM.fr(f2) + ' es ' + MM.fr(f2.inv()) + '.', MM.fr(f2) + ' apgrieztā daļa ir ' + MM.fr(f2.inv()) + '.'),
          T(MM.fr(f1) + ' · ' + MM.fr(f2.inv()) + ' = ' + fr(f1.n * f2.d, f1.d * f2.n) + ' = <b>' + MM.fr(res, { mixed: true }) + '</b>',
            MM.fr(f1) + ' · ' + MM.fr(f2.inv()) + ' = ' + fr(f1.n * f2.d, f1.d * f2.n) + ' = <b>' + MM.fr(res, { mixed: true }) + '</b>')
        ],
        hint: T('Da la vuelta a la segunda fracción y multiplica.', 'Apgriez otro daļu otrādi un reizini.')
      }, G.frac(res, true));
    }
  });

  reg('frac.compare', {
    topic: 'frac', level: 1, part: 'A', name: T('Comparar fracciones', 'Daļu salīdzināšana'),
    make(rng) {
      const d1 = rng.pick([3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 15, 21]);
      const d2 = rng.pick([4, 5, 6, 7, 8, 9, 10, 12, 14, 16, 20, 21]);
      const f1 = F(rng.int(1, d1 - 1), d1), f2 = F(rng.int(1, d2 - 1), d2);
      const L = MM.lcm(f1.d, f2.d);
      const a = f1.n * (L / f1.d), b = f2.n * (L / f2.d);
      return Object.assign({
        q: T('Compara: ' + MM.fr(f1) + ' &nbsp;y&nbsp; ' + MM.fr(f2), 'Salīdzini: ' + MM.fr(f1) + ' &nbsp;un&nbsp; ' + MM.fr(f2)),
        solution: [
          T('Denominador común ' + L + ': ' + MM.fr(f1) + ' = ' + fr(a, L) + ' &nbsp;y&nbsp; ' + MM.fr(f2) + ' = ' + fr(b, L),
            'Kopsaucējs ' + L + ': ' + MM.fr(f1) + ' = ' + fr(a, L) + ' &nbsp;un&nbsp; ' + MM.fr(f2) + ' = ' + fr(b, L)),
          T(a + (a === b ? ' = ' : (a > b ? ' > ' : ' < ')) + b + ' → ' + MM.fr(f1) + ' <b>' + (a === b ? '=' : (a > b ? '&gt;' : '&lt;')) + '</b> ' + MM.fr(f2),
            a + (a === b ? ' = ' : (a > b ? ' > ' : ' < ')) + b + ' → ' + MM.fr(f1) + ' <b>' + (a === b ? '=' : (a > b ? '&gt;' : '&lt;')) + '</b> ' + MM.fr(f2))
        ]
      }, G.cmpField(f1, f2));
    }
  });

  reg('frac.simplify', {
    topic: 'frac', level: 1, part: 'A', name: T('Simplificar', 'Saīsināšana'),
    make(rng) {
      const base = F(rng.int(1, 9), rng.pick([2, 3, 4, 5, 6, 7, 8, 9, 11]));
      const k = rng.int(2, 9);
      const num = base.n * k, den = base.d * k;
      return Object.assign({
        q: T('Simplifica hasta la fracción irreducible: ' + fr(num, den),
             'Saīsini līdz nesaīsināmai daļai: ' + fr(num, den)),
        solution: [
          T('MCD(' + num + '; ' + den + ') = ' + MM.gcd(num, den), 'LKD(' + num + '; ' + den + ') = ' + MM.gcd(num, den)),
          T('Se divide arriba y abajo entre ' + MM.gcd(num, den) + ': <b>' + MM.fr(F(num, den)) + '</b>',
            'Dala skaitītāju un saucēju ar ' + MM.gcd(num, den) + ': <b>' + MM.fr(F(num, den)) + '</b>')
        ],
        hint: T('Busca el mayor número que divida a los dos.', 'Meklē lielāko skaitli, ar ko dalās abi.')
      }, G.frac(F(num, den)));
    }
  });

  reg('frac.convert', {
    topic: 'frac', level: 1, part: 'A', name: T('Mixto ↔ impropia', 'Jaukts ↔ neīstā daļa'),
    make(rng) {
      const d = rng.pick([3, 4, 5, 6, 7, 8, 9, 11, 12]), w = rng.int(2, 8), r = rng.int(1, d - 1);
      const f = F(w * d + r, d);
      const toMixed = rng.chance(0.5);
      if (toMixed) {
        return Object.assign({
          q: T('Escribe como número mixto: ' + MM.fr(f) + '<br><small class="muted">Escríbelo así: 3 2/5</small>',
               'Uzraksti kā jauktu skaitli: ' + MM.fr(f) + '<br><small class="muted">Raksti šādi: 3 2/5</small>'),
          solution: [
            T(f.n + ' : ' + d + ' = ' + w + ' y sobran ' + r, f.n + ' : ' + d + ' = ' + w + ', atlikums ' + r),
            T('El cociente es el entero y el resto el numerador: <b>' + MM.fr(f, { mixed: true }) + '</b>',
              'Dalījums ir veselā daļa, atlikums — skaitītājs: <b>' + MM.fr(f, { mixed: true }) + '</b>')
          ]
        }, G.frac(f, true));
      }
      return Object.assign({
        q: T('Escribe como fracción impropia: ' + MM.fr(f, { mixed: true }),
             'Uzraksti kā neīsto daļu: ' + MM.fr(f, { mixed: true })),
        solution: [
          T(w + ' · ' + d + ' + ' + r + ' = ' + f.n, w + ' · ' + d + ' + ' + r + ' = ' + f.n),
          T('Resultado: <b>' + MM.fr(f) + '</b>', 'Rezultāts: <b>' + MM.fr(f) + '</b>')
        ]
      }, G.frac(f));
    }
  });

  reg('frac.recip', {
    topic: 'frac', level: 1, part: 'A', name: T('Números recíprocos', 'Savstarpēji apgriezti skaitļi'),
    make(rng) {
      const kind = rng.int(1, 3);
      let f, show;
      if (kind === 1) { const d = rng.pick([3, 4, 5, 7, 8, 9, 11]); f = F(rng.int(1, d - 1), d); show = MM.fr(f); }
      else if (kind === 2) { const d = rng.pick([3, 4, 5, 6, 7]); f = F(rng.int(1, 3) * d + rng.int(1, d - 1), d); show = MM.fr(f, { mixed: true }); }
      else { const v = rng.pick([2, 3, 4, 5, 6, 8, 10]); f = F(v, 1); show = String(v); }
      const inv = f.inv();
      return Object.assign({
        q: T('¿Cuál es el número recíproco (inverso) de ' + show + '?',
             'Kurš skaitlis ir savstarpēji apgriezts skaitlim ' + show + '?'),
        solution: [
          kind === 2 ? T('Primero a impropia: ' + show + ' = ' + MM.fr(f), 'Vispirms par neīsto daļu: ' + show + ' = ' + MM.fr(f))
                     : T('Se le da la vuelta a la fracción.', 'Daļu apgriež otrādi.'),
          T('Recíproco: <b>' + MM.fr(inv, { mixed: true }) + '</b>', 'Apgrieztais: <b>' + MM.fr(inv, { mixed: true }) + '</b>'),
          T('Comprobación: ' + MM.fr(f) + ' · ' + MM.fr(inv) + ' = 1 ✓', 'Pārbaude: ' + MM.fr(f) + ' · ' + MM.fr(inv) + ' = 1 ✓')
        ]
      }, G.frac(inv, true));
    }
  });

  reg('frac.ofnum', {
    topic: 'frac', level: 2, part: 'A', name: T('Fracción de un número', 'Daļa no skaitļa'),
    make(rng) {
      const d = rng.pick([3, 4, 5, 6, 8, 9, 10]);
      const nu = rng.pick([1, 2, 3, 4, 5, 6, 7, 8, 9].filter(x => x < d && MM.gcd(x, d) === 1));
      const unit = rng.int(3, 20), total = unit * d;
      const forward = rng.chance(0.55);
      const part = unit * nu;
      if (forward) {
        return {
          q: T('¿Cuánto es ' + fr(nu, d) + ' de <b>' + total + '</b>?', 'Cik ir ' + fr(nu, d) + ' no <b>' + total + '</b>?'),
          answerType: 'num', answer: String(part),
          solution: [
            T('Se divide entre el denominador: ' + total + ' : ' + d + ' = ' + unit, 'Dala ar saucēju: ' + total + ' : ' + d + ' = ' + unit),
            T('Y se multiplica por el numerador: ' + unit + ' · ' + nu + ' = <b>' + part + '</b>', 'Un reizina ar skaitītāju: ' + unit + ' · ' + nu + ' = <b>' + part + '</b>')
          ]
        };
      }
      return {
        q: T('Se sabe que ' + fr(nu, d) + ' de <b>X</b> es <b>' + part + '</b>. ¿Cuánto vale X?',
             'Zināms, ka ' + fr(nu, d) + ' no <b>X</b> ir <b>' + part + '</b>. Cik ir X?'),
        answerType: 'num', answer: String(total),
        solution: [
          T('Si ' + fr(nu, d) + ' son ' + part + ', entonces ' + fr(1, d) + ' es ' + part + ' : ' + nu + ' = ' + unit,
            'Ja ' + fr(nu, d) + ' ir ' + part + ', tad ' + fr(1, d) + ' ir ' + part + ' : ' + nu + ' = ' + unit),
          T('El total son ' + d + ' partes: ' + unit + ' · ' + d + ' = <b>' + total + '</b>',
            'Viss ir ' + d + ' daļas: ' + unit + ' · ' + d + ' = <b>' + total + '</b>')
        ],
        hint: T('Primero calcula cuánto vale UNA parte.', 'Vispirms aprēķini, cik ir VIENA daļa.')
      };
    }
  });

  reg('frac.expr', {
    topic: 'frac', level: 3, part: 'B', points: 4, name: T('Expresión con fracciones', 'Izteiksme ar daļām'),
    make(rng) {
      const d1 = rng.pick([3, 4, 6]), d2 = rng.pick([2, 4, 5]), d3 = rng.pick([2, 3, 4, 5]);
      const f1 = F(rng.int(1, d1 - 1), d1), f2 = F(rng.int(1, d2 - 1), d2), f3 = F(rng.int(1, d3 - 1), d3);
      const inner = f2.add(f3);
      const res = f1.add(inner.mul(F(1, 2)));
      return Object.assign({
        q: G.calc(MM.fr(f1) + ' + ( ' + MM.fr(f2) + ' + ' + MM.fr(f3) + ' ) · ' + fr(1, 2)),
        points: 4,
        solution: [
          T('Primero el paréntesis: ' + MM.fr(f2) + ' + ' + MM.fr(f3) + ' = ' + MM.fr(inner),
            'Vispirms iekavas: ' + MM.fr(f2) + ' + ' + MM.fr(f3) + ' = ' + MM.fr(inner)),
          T('Después la multiplicación: ' + MM.fr(inner) + ' · ' + fr(1, 2) + ' = ' + MM.fr(inner.mul(F(1, 2))),
            'Tad reizināšana: ' + MM.fr(inner) + ' · ' + fr(1, 2) + ' = ' + MM.fr(inner.mul(F(1, 2)))),
          T('Y al final la suma: ' + MM.fr(f1) + ' + ' + MM.fr(inner.mul(F(1, 2))) + ' = <b>' + MM.fr(res, { mixed: true }) + '</b>',
            'Un beigās saskaitīšana: ' + MM.fr(f1) + ' + ' + MM.fr(inner.mul(F(1, 2))) + ' = <b>' + MM.fr(res, { mixed: true }) + '</b>')
        ],
        hint: T('Paréntesis → multiplicar → sumar.', 'Iekavas → reizināšana → saskaitīšana.')
      }, G.frac(res, true));
    }
  });

  reg('frac.word', {
    topic: 'frac', level: 3, part: 'B', points: 4, name: T('Problema con fracciones', 'Teksta uzdevums ar daļām'),
    make(rng) {
      const d = rng.pick([8, 10, 12]);
      const a = rng.int(3, d - 3), b = rng.int(1, a - 1);          // a/d y b/d del total
      const unit = rng.int(4, 15), total = unit * d;
      const diff = (a - b) * unit;
      const nm = G.name(rng);
      return {
        q: T(nm + ' recibió flores para hacer ramos: ' + fr(a, d) + ' eran margaritas y ' + fr(b, d) + ' amapolas; el resto, acianos. Había <b>' + diff + '</b> margaritas más que amapolas. ¿Cuántas flores recibió en total y cuántos acianos había?',
             nm + ' saņēma ziedus pušķiem: ' + fr(a, d) + ' bija pīpenes un ' + fr(b, d) + ' magones, pārējās — rudzupuķes. Pīpeņu bija par <b>' + diff + '</b> vairāk nekā magoņu. Cik ziedu bija kopā un cik bija rudzupuķu?'),
        points: 4,
        fields: [
          { key: 't', label: T('Total de flores', 'Ziedi kopā'), answerType: 'num', answer: String(total) },
          { key: 'c', label: T('Acianos', 'Rudzupuķes'), answerType: 'num', answer: String(total - (a + b) * unit) }
        ],
        solution: [
          T('Diferencia en fracción: ' + fr(a, d) + ' − ' + fr(b, d) + ' = ' + MM.fr(F(a - b, d)) + ' del total.',
            'Starpība daļās: ' + fr(a, d) + ' − ' + fr(b, d) + ' = ' + MM.fr(F(a - b, d)) + ' no visa.'),
          T('Esa diferencia son ' + diff + ' flores → ' + fr(1, d) + ' del total = ' + diff + ' : ' + (a - b) + ' = ' + unit,
            'Šī starpība ir ' + diff + ' ziedi → ' + fr(1, d) + ' no visa = ' + diff + ' : ' + (a - b) + ' = ' + unit),
          T('Total = ' + unit + ' · ' + d + ' = <b>' + total + ' flores</b>', 'Kopā = ' + unit + ' · ' + d + ' = <b>' + total + ' ziedi</b>'),
          T('Margaritas ' + (a * unit) + ', amapolas ' + (b * unit) + ' → acianos = ' + total + ' − ' + (a * unit) + ' − ' + (b * unit) + ' = <b>' + (total - (a + b) * unit) + '</b>',
            'Pīpenes ' + (a * unit) + ', magones ' + (b * unit) + ' → rudzupuķes = ' + total + ' − ' + (a * unit) + ' − ' + (b * unit) + ' = <b>' + (total - (a + b) * unit) + '</b>')
        ],
        hint: T('¿Qué fracción del total es la diferencia entre las dos flores?',
                'Kāda daļa no visa ir starpība starp abiem ziedu veidiem?')
      };
    }
  });

  /* =====================================================
     TEMA 3 · DECIMALES
     ===================================================== */

  reg('dec.addsub', {
    topic: 'dec', level: 1, part: 'A', name: T('Sumar y restar decimales', 'Decimāldaļu saskaitīšana un atņemšana'),
    make(rng) {
      const a = rng.int(15, 900) / rng.pick([10, 100]);
      const b = rng.int(8, 700) / rng.pick([10, 100]);
      const plus = rng.chance(0.5);
      const res = plus ? a + b : a - b;
      return {
        q: G.calc(MM.d(a) + ' <span class="op">' + (plus ? '+' : '−') + '</span> ' + MM.d(b)),
        answerType: 'num', answer: String(Math.round(res * 10000) / 10000),
        solution: [
          T('Se alinean las comas y se rellena con ceros si hace falta.', 'Komats zem komata; tukšās vietas aizpilda ar nullēm.'),
          T(MM.n(a) + ' ' + (plus ? '+' : '−') + ' ' + MM.n(b) + ' = <b>' + MM.n(res) + '</b>',
            MM.n(a) + ' ' + (plus ? '+' : '−') + ' ' + MM.n(b) + ' = <b>' + MM.n(res) + '</b>'),
          res < 0 ? T('Sale negativo porque se resta un número mayor.', 'Iznāk negatīvs, jo atņem lielāku skaitli.')
                  : T('Comprobación rápida: el resultado tiene que estar cerca de ' + Math.round(res) + '.',
                      'Ātra pārbaude: rezultātam jābūt tuvu ' + Math.round(res) + '.')
        ]
      };
    }
  });

  reg('dec.mul', {
    topic: 'dec', level: 1, part: 'A', name: T('Multiplicar decimales', 'Decimāldaļu reizināšana'),
    make(rng) {
      const A = rng.int(11, 99), B = rng.int(2, 99);
      const da = rng.int(1, 2), db = rng.int(1, 2);
      const a = A / Math.pow(10, da), b = B / Math.pow(10, db);
      const res = (A * B) / Math.pow(10, da + db);
      return {
        q: G.calc(MM.d(a) + ' <span class="op">·</span> ' + MM.d(b)),
        answerType: 'num', answer: String(res),
        solution: [
          T('Sin comas: ' + A + ' · ' + B + ' = ' + (A * B), 'Bez komatiem: ' + A + ' · ' + B + ' = ' + (A * B)),
          T('Cifras decimales: ' + da + ' + ' + db + ' = ' + (da + db), 'Decimālcipari: ' + da + ' + ' + db + ' = ' + (da + db)),
          T('Se ponen ' + (da + db) + ' decimales: <b>' + MM.n(res) + '</b>', 'Atdala ' + (da + db) + ' decimālciparus: <b>' + MM.n(res) + '</b>')
        ],
        hint: T('Multiplica como si no hubiera comas y cuenta los decimales al final.',
                'Reizini tā, it kā komatu nebūtu, un beigās saskaiti decimālciparus.')
      };
    }
  });

  reg('dec.div', {
    topic: 'dec', level: 2, part: 'A', name: T('Dividir decimales', 'Decimāldaļu dalīšana'),
    make(rng) {
      const q0 = rng.int(11, 99) / rng.pick([1, 10]);
      const b = rng.pick([0.2, 0.4, 0.5, 0.05, 0.4, 3, 4, 6, 8, 9, 0.3]);
      const a = Math.round(q0 * b * 1000) / 1000;
      const res = Math.round((a / b) * 1000) / 1000;
      const shift = (String(b).split('.')[1] || '').length;
      return {
        q: G.calc(MM.d(a) + ' <span class="op">:</span> ' + MM.d(b)),
        answerType: 'num', answer: String(res),
        solution: shift ? [
          T('El divisor tiene ' + shift + ' decimal(es): se multiplican los dos por ' + Math.pow(10, shift) + '.',
            'Dalītājam ir ' + shift + ' decimālcipars(-i): abus reizina ar ' + Math.pow(10, shift) + '.'),
          T(MM.n(a) + ' : ' + MM.n(b) + ' = ' + MM.n(a * Math.pow(10, shift)) + ' : ' + MM.n(b * Math.pow(10, shift)),
            MM.n(a) + ' : ' + MM.n(b) + ' = ' + MM.n(a * Math.pow(10, shift)) + ' : ' + MM.n(b * Math.pow(10, shift))),
          T('Resultado: <b>' + MM.n(res) + '</b>', 'Rezultāts: <b>' + MM.n(res) + '</b>')
        ] : [
          T('El divisor ya es entero: se divide directamente.', 'Dalītājs jau ir vesels skaitlis: dala tieši.'),
          T(MM.n(a) + ' : ' + MM.n(b) + ' = <b>' + MM.n(res) + '</b>', MM.n(a) + ' : ' + MM.n(b) + ' = <b>' + MM.n(res) + '</b>')
        ],
        hint: T('Corre la coma del divisor hasta que sea entero y corre la del dividendo lo mismo.',
                'Pārbīdi komatu dalītājā, līdz tas kļūst vesels, un tikpat pārbīdi dalāmajā.')
      };
    }
  });

  reg('dec.pow10', {
    topic: 'dec', level: 1, part: 'A', name: T('Por 10, 100, 0,1…', 'Ar 10, 100, 0,1…'),
    make(rng) {
      const a = rng.int(15, 9990) / rng.pick([10, 100, 1000]);
      const op = rng.pick([
        { s: '· 10', f: x => x * 10, e: T('multiplicar por 10 → coma una posición a la derecha', 'reizināt ar 10 → komatu vienu vietu pa labi') },
        { s: '· 100', f: x => x * 100, e: T('multiplicar por 100 → coma dos posiciones a la derecha', 'reizināt ar 100 → komatu divas vietas pa labi') },
        { s: ': 10', f: x => x / 10, e: T('dividir entre 10 → coma una posición a la izquierda', 'dalīt ar 10 → komatu vienu vietu pa kreisi') },
        { s: ': 1000', f: x => x / 1000, e: T('dividir entre 1000 → coma tres posiciones a la izquierda', 'dalīt ar 1000 → komatu trīs vietas pa kreisi') },
        { s: '· 0,1', f: x => x / 10, e: T('multiplicar por 0,1 es lo mismo que dividir entre 10', 'reizināt ar 0,1 ir tas pats, kas dalīt ar 10') },
        { s: ': 0,1', f: x => x * 10, e: T('dividir entre 0,1 es lo mismo que multiplicar por 10', 'dalīt ar 0,1 ir tas pats, kas reizināt ar 10') },
        { s: ': 0,01', f: x => x * 100, e: T('dividir entre 0,01 es lo mismo que multiplicar por 100', 'dalīt ar 0,01 ir tas pats, kas reizināt ar 100') }
      ]);
      const res = Math.round(op.f(a) * 1e6) / 1e6;
      return {
        q: T('Calcula mentalmente: ' + MM.d(a) + ' <span class="op">' + op.s + '</span>',
             'Aprēķini galvā: ' + MM.d(a) + ' <span class="op">' + op.s + '</span>'),
        answerType: 'num', answer: String(res),
        solution: [op.e, T(MM.n(a) + ' ' + op.s + ' = <b>' + MM.n(res) + '</b>', MM.n(a) + ' ' + op.s + ' = <b>' + MM.n(res) + '</b>')]
      };
    }
  });

  reg('dec.round', {
    topic: 'dec', level: 1, part: 'A', name: T('Redondear', 'Noapaļošana'),
    make(rng) {
      const x = rng.int(10000, 999999) / 10000;
      const to = rng.pick([
        { dp: 0, t: T('unidades', 'veseliem') },
        { dp: 1, t: T('décimas', 'desmitdaļām') },
        { dp: 2, t: T('centésimas', 'simtdaļām') }
      ]);
      const res = Math.round(x * Math.pow(10, to.dp)) / Math.pow(10, to.dp);
      const digits = MM.n(x).split(',')[1] || '';
      const nextDigit = digits[to.dp] || '0';
      return {
        q: T('Redondea <b>' + MM.n(x) + '</b> a las <b>' + to.t.es + '</b>.',
             'Noapaļo <b>' + MM.n(x) + '</b> līdz <b>' + to.t.lv + '</b>.'),
        answerType: 'num', answer: String(res), tol: 0,
        solution: [
          T('La primera cifra que se va es el <b>' + nextDigit + '</b>.', 'Pirmais atmestais cipars ir <b>' + nextDigit + '</b>.'),
          T(Number(nextDigit) >= 5 ? 'Como es 5 o más, la anterior sube.' : 'Como es menor que 5, la anterior se queda igual.',
            Number(nextDigit) >= 5 ? 'Tā kā tas ir 5 vai lielāks, iepriekšējais palielinās.' : 'Tā kā tas ir mazāks par 5, iepriekšējais paliek.'),
          T('Resultado: <b>' + MM.n(res) + '</b>', 'Rezultāts: <b>' + MM.n(res) + '</b>')
        ]
      };
    }
  });

  reg('dec.convert', {
    topic: 'dec', level: 2, part: 'A', name: T('Fracción ↔ decimal', 'Daļa ↔ decimāldaļa'),
    make(rng) {
      const pairs = [[1, 2], [1, 4], [3, 4], [1, 5], [2, 5], [3, 5], [4, 5], [1, 8], [3, 8], [5, 8], [7, 8],
                     [1, 10], [3, 10], [7, 10], [1, 20], [3, 20], [9, 20], [1, 16], [5, 16], [11, 4], [7, 2], [9, 5]];
      const [a, b] = rng.pick(pairs);
      const f = F(a, b);
      const toDec = rng.chance(0.5);
      if (toDec) {
        return {
          q: T('Escribe como número decimal: ' + MM.fr(f), 'Uzraksti kā decimāldaļu: ' + MM.fr(f)),
          answerType: 'num', answer: String(f.v),
          solution: [
            T('Fracción a decimal = numerador : denominador', 'No daļas uz decimāldaļu = skaitītājs : saucējs'),
            T(a + ' : ' + b + ' = <b>' + MM.n(f.v) + '</b>', a + ' : ' + b + ' = <b>' + MM.n(f.v) + '</b>')
          ]
        };
      }
      const dec = MM.n(f.v), dp = (dec.split(',')[1] || '').length;
      const den = Math.pow(10, dp), num = Math.round(f.v * den);
      return Object.assign({
        q: T('Escribe como fracción irreducible: <b>' + dec + '</b>', 'Uzraksti kā nesaīsināmu daļu: <b>' + dec + '</b>'),
        solution: [
          T('Se escribe sobre ' + den + ': ' + fr(num, den), 'Raksta virs ' + den + ': ' + fr(num, den)),
          T('Se simplifica dividiendo entre ' + MM.gcd(num, den) + ': <b>' + MM.fr(f, { mixed: true }) + '</b>',
            'Saīsina, dalot ar ' + MM.gcd(num, den) + ': <b>' + MM.fr(f, { mixed: true }) + '</b>')
        ]
      }, G.frac(f, true));
    }
  });

  reg('dec.mix', {
    topic: 'dec', level: 2, part: 'A', name: T('Fracciones y decimales juntos', 'Daļas un decimāldaļas kopā'),
    make(rng) {
      const pairs = [[3, 4], [1, 2], [1, 4], [2, 5], [3, 5], [1, 5], [3, 8], [1, 8]];
      const [a, b] = rng.pick(pairs);
      const f = F(a, b);
      const dec = rng.pick([0.25, 0.5, 0.75, 0.2, 0.4, 0.6, 0.125, 1.5]);
      const plus = rng.chance(0.6);
      const res = plus ? f.add(MM.Frac.from(dec)) : f.mul(MM.Frac.from(dec));
      return Object.assign({
        q: G.calc(MM.fr(f) + ' <span class="op">' + (plus ? '+' : '·') + '</span> ' + MM.d(dec)),
        solution: [
          T('Se pasa todo al mismo formato. ' + MM.fr(f) + ' = ' + MM.n(f.v) + ' y ' + MM.n(dec) + ' = ' + MM.fr(MM.Frac.from(dec)),
            'Visu pārveido vienādā formā. ' + MM.fr(f) + ' = ' + MM.n(f.v) + ' un ' + MM.n(dec) + ' = ' + MM.fr(MM.Frac.from(dec))),
          T(MM.n(f.v) + ' ' + (plus ? '+' : '·') + ' ' + MM.n(dec) + ' = <b>' + MM.n(res.v) + '</b> = ' + MM.fr(res, { mixed: true }),
            MM.n(f.v) + ' ' + (plus ? '+' : '·') + ' ' + MM.n(dec) + ' = <b>' + MM.n(res.v) + '</b> = ' + MM.fr(res, { mixed: true }))
        ],
        hint: T('Puedes hacerlo todo en decimal o todo en fracción; elige lo más fácil.',
                'Vari rēķināt visu decimāldaļās vai visu parastajās daļās — izvēlies vieglāko.')
      }, G.num(res, { answerText: '<b>' + MM.n(res.v) + '</b> = ' + MM.fr(res, { mixed: true }) }));
    }
  });

  reg('dec.expr', {
    topic: 'dec', level: 3, part: 'B', points: 4, name: T('Expresión con decimales', 'Izteiksme ar decimāldaļām'),
    make(rng) {
      /* se construye al revés para que todas las divisiones sean exactas */
      const c = rng.pick([0.1, 0.2, 0.5]);
      const k = rng.int(2, 6);
      const quot = rng.pick([2, 3, 4, 5, 6, 8]);          // b : c
      const inner = Math.round((quot - c * k) * 1000) / 1000;
      const b = Math.round(quot * c * 1000) / 1000;
      const useful = inner > 0;
      const factor = rng.pick([0.4, 0.5, 0.6, 1.2, 2, 3]);
      const a = Math.round(inner * factor * 10000) / 10000;
      const d = rng.pick([[5, 8], [3, 4], [7, 8], [1, 2]]);
      const tail = F(d[0], d[1]).mul(F(4, 1));
      const res = useful ? Math.round((factor + tail.v) * 10000) / 10000 : Math.round((a + tail.v) * 10000) / 10000;
      const expr = MM.d(a) + ' : ( ' + MM.d(b) + ' : ' + MM.d(c) + ' − ' + MM.d(c) + ' · ' + k + ' ) + ' + fr(d[0], d[1]) + ' · 4';
      return {
        q: useful ? G.calc(expr) : G.calc(MM.d(a) + ' + ' + fr(d[0], d[1]) + ' · 4'),
        answerType: 'num', answer: String(res), points: 4,
        solution: useful ? [
          T('Paréntesis: ' + MM.n(b) + ' : ' + MM.n(c) + ' = ' + MM.n(b / c) + ' y ' + MM.n(c) + ' · ' + k + ' = ' + MM.n(c * k),
            'Iekavas: ' + MM.n(b) + ' : ' + MM.n(c) + ' = ' + MM.n(b / c) + ' un ' + MM.n(c) + ' · ' + k + ' = ' + MM.n(c * k)),
          T(MM.n(b / c) + ' − ' + MM.n(c * k) + ' = ' + MM.n(inner), MM.n(b / c) + ' − ' + MM.n(c * k) + ' = ' + MM.n(inner)),
          T('División: ' + MM.n(a) + ' : ' + MM.n(inner) + ' = ' + MM.n(a / inner), 'Dalīšana: ' + MM.n(a) + ' : ' + MM.n(inner) + ' = ' + MM.n(a / inner)),
          T('Producto: ' + fr(d[0], d[1]) + ' · 4 = ' + MM.n(tail.v), 'Reizinājums: ' + fr(d[0], d[1]) + ' · 4 = ' + MM.n(tail.v)),
          T('Suma final: ' + MM.n(a / inner) + ' + ' + MM.n(tail.v) + ' = <b>' + MM.n(res) + '</b>',
            'Beigu summa: ' + MM.n(a / inner) + ' + ' + MM.n(tail.v) + ' = <b>' + MM.n(res) + '</b>')
        ] : [
          T(fr(d[0], d[1]) + ' · 4 = ' + MM.n(tail.v), fr(d[0], d[1]) + ' · 4 = ' + MM.n(tail.v)),
          T(MM.n(a) + ' + ' + MM.n(tail.v) + ' = <b>' + MM.n(res) + '</b>', MM.n(a) + ' + ' + MM.n(tail.v) + ' = <b>' + MM.n(res) + '</b>')
        ],
        hint: T('Paréntesis primero, y dentro del paréntesis también manda el orden de operaciones.',
                'Vispirms iekavas — un arī iekavās darbību secība ir svarīga.')
      };
    }
  });

  /* =====================================================
     TEMA 4 · NÚMEROS NEGATIVOS
     ===================================================== */

  reg('neg.addsub', {
    topic: 'neg', level: 1, part: 'A', name: T('Sumar y restar negativos', 'Negatīvu skaitļu saskaitīšana un atņemšana'),
    make(rng) {
      const a = rng.int(2, 20) * rng.sign(), b = rng.int(2, 20) * rng.sign();
      const minus = rng.chance(0.5);
      const res = minus ? a - b : a + b;
      const bs = b < 0 ? '(−' + Math.abs(b) + ')' : String(b);
      return {
        q: G.calc(MM.d(a) + ' <span class="op">' + (minus ? '−' : '+') + '</span> ' + bs),
        answerType: 'num', answer: String(res),
        solution: [
          minus ? T('Restar es sumar el opuesto: ' + MM.n(a) + ' − (' + MM.n(b) + ') = ' + MM.n(a) + ' + (' + MM.n(-b) + ')',
                    'Atņemt nozīmē pieskaitīt pretējo: ' + MM.n(a) + ' − (' + MM.n(b) + ') = ' + MM.n(a) + ' + (' + MM.n(-b) + ')')
                : T('Signos ' + ((a < 0) === (b < 0) ? 'iguales: se suman los módulos y se conserva el signo.' : 'distintos: se resta el pequeño del grande y manda el de mayor módulo.'),
                    'Zīmes ' + ((a < 0) === (b < 0) ? 'vienādas: moduļus saskaita, zīme paliek.' : 'dažādas: no lielākā moduļa atņem mazāko, zīmi nosaka lielākais modulis.')),
          T('Resultado: <b>' + MM.n(res) + '</b>', 'Rezultāts: <b>' + MM.n(res) + '</b>'),
          T('En la recta numérica: se parte de ' + MM.n(a) + ' y se avanza ' + Math.abs(minus ? -b : b) + ' hacia ' + ((minus ? -b : b) > 0 ? 'la derecha' : 'la izquierda') + '.',
            'Uz skaitļu ass: sāk no ' + MM.n(a) + ' un pārvietojas par ' + Math.abs(minus ? -b : b) + ' ' + ((minus ? -b : b) > 0 ? 'pa labi' : 'pa kreisi') + '.')
        ]
      };
    }
  });

  reg('neg.muldiv', {
    topic: 'neg', level: 1, part: 'A', name: T('Multiplicar y dividir negativos', 'Negatīvu skaitļu reizināšana un dalīšana'),
    make(rng) {
      const mul = rng.chance(0.5);
      let a, b, res;
      if (mul) { a = rng.int(2, 12) * rng.sign(); b = rng.int(2, 12) * rng.sign(); res = a * b; }
      else { b = rng.int(2, 12) * rng.sign(); res = rng.int(2, 12) * rng.sign(); a = b * res; }
      const bs = b < 0 ? '(−' + Math.abs(b) + ')' : String(b);
      const same = (a < 0) === (b < 0);
      return {
        q: G.calc(MM.d(a) + ' <span class="op">' + (mul ? '·' : ':') + '</span> ' + bs),
        answerType: 'num', answer: String(res),
        solution: [
          T('Sin signos: ' + Math.abs(a) + ' ' + (mul ? '·' : ':') + ' ' + Math.abs(b) + ' = ' + Math.abs(res),
            'Bez zīmēm: ' + Math.abs(a) + ' ' + (mul ? '·' : ':') + ' ' + Math.abs(b) + ' = ' + Math.abs(res)),
          T(same ? 'Signos iguales → resultado <b>positivo</b>.' : 'Signos distintos → resultado <b>negativo</b>.',
            same ? 'Vienādas zīmes → rezultāts <b>pozitīvs</b>.' : 'Dažādas zīmes → rezultāts <b>negatīvs</b>.'),
          T('Resultado: <b>' + MM.n(res) + '</b>', 'Rezultāts: <b>' + MM.n(res) + '</b>')
        ]
      };
    }
  });

  reg('neg.abs', {
    topic: 'neg', level: 1, part: 'A', name: T('Valor absoluto', 'Modulis'),
    make(rng) {
      const a = rng.int(2, 25) * rng.sign(), b = rng.int(2, 25) * rng.sign();
      const kind = rng.int(1, 3);
      let q, res, sol;
      if (kind === 1) {
        res = Math.abs(a);
        q = G.calc('|' + MM.n(a) + '|');
        sol = [T('El módulo es la distancia al cero, siempre positiva o cero.', 'Modulis ir attālums līdz nullei — vienmēr pozitīvs vai nulle.'),
               T('|' + MM.n(a) + '| = <b>' + res + '</b>', '|' + MM.n(a) + '| = <b>' + res + '</b>')];
      } else if (kind === 2) {
        res = Math.abs(a) - Math.abs(b);
        q = G.calc('|' + MM.n(a) + '| <span class="op">−</span> |' + MM.n(b) + '|');
        sol = [T('|' + MM.n(a) + '| = ' + Math.abs(a) + ' y |' + MM.n(b) + '| = ' + Math.abs(b), '|' + MM.n(a) + '| = ' + Math.abs(a) + ' un |' + MM.n(b) + '| = ' + Math.abs(b)),
               T(Math.abs(a) + ' − ' + Math.abs(b) + ' = <b>' + MM.n(res) + '</b>', Math.abs(a) + ' − ' + Math.abs(b) + ' = <b>' + MM.n(res) + '</b>')];
      } else {
        res = Math.abs(a) * Math.abs(b);
        q = G.calc('|' + MM.n(a) + '| <span class="op">·</span> |' + MM.n(b) + '|');
        sol = [T('Primero los módulos: ' + Math.abs(a) + ' y ' + Math.abs(b), 'Vispirms moduļi: ' + Math.abs(a) + ' un ' + Math.abs(b)),
               T(Math.abs(a) + ' · ' + Math.abs(b) + ' = <b>' + res + '</b>', Math.abs(a) + ' · ' + Math.abs(b) + ' = <b>' + res + '</b>')];
      }
      return { q: q, answerType: 'num', answer: String(res), solution: sol };
    }
  });

  reg('neg.compare', {
    topic: 'neg', level: 1, part: 'A', name: T('Comparar negativos', 'Negatīvu skaitļu salīdzināšana'),
    make(rng) {
      const mk = () => rng.chance(0.5) ? rng.int(1, 300) / 10 * rng.sign() : rng.int(1, 40) * rng.sign();
      const a = mk(), b = mk();
      return Object.assign({
        q: T('Compara: ' + MM.d(a) + ' &nbsp;y&nbsp; ' + MM.d(b), 'Salīdzini: ' + MM.d(a) + ' &nbsp;un&nbsp; ' + MM.d(b)),
        solution: [
          T('En la recta numérica, el de más a la derecha es el mayor.', 'Uz skaitļu ass lielākais ir tas, kas atrodas tālāk pa labi.'),
          (a < 0 && b < 0) ? T('Los dos son negativos: gana el de <b>menor</b> módulo (|' + MM.n(a) + '| = ' + Math.abs(a) + ', |' + MM.n(b) + '| = ' + Math.abs(b) + ').',
                               'Abi ir negatīvi: lielāks ir tas, kuram <b>mazāks</b> modulis (|' + MM.n(a) + '| = ' + Math.abs(a) + ', |' + MM.n(b) + '| = ' + Math.abs(b) + ').')
                            : T('Todo negativo es menor que 0, y 0 es menor que cualquier positivo.', 'Jebkurš negatīvs skaitlis ir mazāks par 0, un 0 ir mazāks par jebkuru pozitīvu.'),
          T(MM.n(a) + ' <b>' + (a < b ? '&lt;' : (a > b ? '&gt;' : '=')) + '</b> ' + MM.n(b), MM.n(a) + ' <b>' + (a < b ? '&lt;' : (a > b ? '&gt;' : '=')) + '</b> ' + MM.n(b))
        ]
      }, G.cmpField(a, b));
    }
  });

  reg('neg.tf', {
    topic: 'neg', level: 2, part: 'A', name: T('¿Verdadero o falso?', 'Patiess vai aplams?'),
    make(rng) {
      const a = rng.int(2, 20), b = rng.int(2, 20);
      const items = [
        { q: T('El valor absoluto de un número mayor siempre es mayor.', 'Lielāka skaitļa modulis vienmēr ir lielāks.'), v: false,
          e: T('Falso: −3 &gt; −7 pero |−3| = 3 &lt; |−7| = 7.', 'Aplams: −3 &gt; −7, bet |−3| = 3 &lt; |−7| = 7.') },
        { q: T('El producto de dos números recíprocos siempre es 1.', 'Savstarpēji apgrieztu skaitļu reizinājums vienmēr ir 1.'), v: true,
          e: T('Verdadero: es justo la definición de recíprocos.', 'Patiess: tāda ir apgriezto skaitļu definīcija.') },
        { q: T('El producto de tres números negativos es positivo.', 'Trīs negatīvu skaitļu reizinājums ir pozitīvs.'), v: false,
          e: T('Falso: (−)·(−) = (+), y (+)·(−) = (−). Con un número impar de negativos sale negativo.',
               'Aplams: (−)·(−) = (+), un (+)·(−) = (−). Ar nepāra skaitu negatīvu iznāk negatīvs.') },
        { q: T('Si a &lt; b, entonces −a &gt; −b.', 'Ja a &lt; b, tad −a &gt; −b.'), v: true,
          e: T('Verdadero: al cambiar de signo se invierte el orden. 2 &lt; 5 pero −2 &gt; −5.',
               'Patiess: mainot zīmi, secība apgriežas. 2 &lt; 5, bet −2 &gt; −5.') },
        { q: T('−' + a + ' − ' + b + ' = −' + (a + b), '−' + a + ' − ' + b + ' = −' + (a + b)), v: true,
          e: T('Verdadero: dos negativos se suman y el resultado es negativo.', 'Patiess: divus negatīvus saskaita, rezultāts ir negatīvs.') },
        { q: T('El opuesto de −' + a + ' es ' + a + '.', 'Skaitlim −' + a + ' pretējais ir ' + a + '.'), v: true,
          e: T('Verdadero: mismo módulo, signo contrario. Su suma es 0.', 'Patiess: vienāds modulis, pretēja zīme. To summa ir 0.') },
        { q: T('|−' + a + '| = −' + a, '|−' + a + '| = −' + a), v: false,
          e: T('Falso: el módulo nunca es negativo. |−' + a + '| = ' + a + '.', 'Aplams: modulis nekad nav negatīvs. |−' + a + '| = ' + a + '.') }
      ];
      const it = rng.pick(items);
      return Object.assign({
        q: T('¿Verdadero o falso? ' + it.q.es, 'Patiess vai aplams? ' + it.q.lv),
        solution: [it.e]
      }, G.bool(it.v));
    }
  });

  reg('neg.parens', {
    topic: 'neg', level: 3, part: 'B', points: 4, name: T('Fracciones con signos', 'Daļas ar zīmēm'),
    make(rng) {
      const d1 = rng.pick([9, 6, 12]), d2 = rng.pick([3, 4, 5]), d3 = rng.pick([9, 6, 15]);
      const f1 = F(rng.int(1, d1 - 1), d1), f2 = F(rng.int(1, d2 - 1), d2);
      const f3 = F(rng.int(1, 3) * d3 + rng.int(1, d3 - 1), d3);
      const expr = '(+' + MM.fr(f1) + ') + (−' + MM.fr(f2) + ') − (+' + MM.fr(f3, { mixed: true }) + ') − (−' + MM.fr(f3.div(F(2, 1)), { mixed: true }) + ')';
      const step1 = f1.sub(f2), step2 = step1.sub(f3), fin = step2.add(f3.div(F(2, 1)));
      return Object.assign({
        q: G.calc(expr), points: 4,
        solution: [
          T('Se quitan los paréntesis: + (−x) → −x &nbsp;y&nbsp; − (−x) → +x',
            'Atver iekavas: + (−x) → −x &nbsp;un&nbsp; − (−x) → +x'),
          T(MM.fr(f1) + ' − ' + MM.fr(f2) + ' − ' + MM.fr(f3, { mixed: true }) + ' + ' + MM.fr(f3.div(F(2, 1)), { mixed: true }),
            MM.fr(f1) + ' − ' + MM.fr(f2) + ' − ' + MM.fr(f3, { mixed: true }) + ' + ' + MM.fr(f3.div(F(2, 1)), { mixed: true })),
          T('Paso a paso: ' + MM.fr(f1) + ' − ' + MM.fr(f2) + ' = ' + MM.fr(step1, { mixed: true }),
            'Soli pa solim: ' + MM.fr(f1) + ' − ' + MM.fr(f2) + ' = ' + MM.fr(step1, { mixed: true })),
          T(MM.fr(step1, { mixed: true }) + ' − ' + MM.fr(f3, { mixed: true }) + ' = ' + MM.fr(step2, { mixed: true }),
            MM.fr(step1, { mixed: true }) + ' − ' + MM.fr(f3, { mixed: true }) + ' = ' + MM.fr(step2, { mixed: true })),
          T(MM.fr(step2, { mixed: true }) + ' + ' + MM.fr(f3.div(F(2, 1)), { mixed: true }) + ' = <b>' + MM.fr(fin, { mixed: true }) + '</b>',
            MM.fr(step2, { mixed: true }) + ' + ' + MM.fr(f3.div(F(2, 1)), { mixed: true }) + ' = <b>' + MM.fr(fin, { mixed: true }) + '</b>')
        ],
        hint: T('Menos por menos, más. Quita todos los paréntesis antes de calcular.',
                'Mīnus reiz mīnus ir plus. Atver visas iekavas pirms rēķināšanas.')
      }, G.frac(fin, true));
    }
  });

  reg('neg.expr', {
    topic: 'neg', level: 3, part: 'B', points: 4, name: T('Expresión con signos', 'Izteiksme ar zīmēm'),
    make(rng) {
      const a = rng.int(20, 99), b = rng.pick([0.2, 0.5, 0.4, 0.25]);
      const c = rng.int(11, 99) / 10, d = rng.pick([10, 100]);
      const e = rng.int(15, 60) * 10, g = rng.pick([5, 10]);
      const t1 = -a / -b, t2 = c * -d, t3 = -(e / -g);
      const res = Math.round((t1 + t2 + t3) * 1000) / 1000;
      return {
        q: G.calc('−' + a + ' : (−' + MM.n(b) + ') + ' + MM.n(c) + ' · (−' + d + ') − ' + e + ' : (−' + g + ')'),
        answerType: 'num', answer: String(res), points: 4,
        solution: [
          T('−' + a + ' : (−' + MM.n(b) + ') = <b>+' + MM.n(t1) + '</b> (negativo entre negativo → positivo)',
            '−' + a + ' : (−' + MM.n(b) + ') = <b>+' + MM.n(t1) + '</b> (negatīvs ar negatīvu → pozitīvs)'),
          T(MM.n(c) + ' · (−' + d + ') = <b>' + MM.n(t2) + '</b>', MM.n(c) + ' · (−' + d + ') = <b>' + MM.n(t2) + '</b>'),
          T(e + ' : (−' + g + ') = ' + MM.n(-e / g) + ', y va restando: −(' + MM.n(-e / g) + ') = <b>+' + MM.n(e / g) + '</b>',
            e + ' : (−' + g + ') = ' + MM.n(-e / g) + ', un tas tiek atņemts: −(' + MM.n(-e / g) + ') = <b>+' + MM.n(e / g) + '</b>'),
          T(MM.n(t1) + ' ' + (t2 < 0 ? '−' + MM.n(-t2) : '+' + MM.n(t2)) + ' + ' + MM.n(t3) + ' = <b>' + MM.n(res) + '</b>',
            MM.n(t1) + ' ' + (t2 < 0 ? '−' + MM.n(-t2) : '+' + MM.n(t2)) + ' + ' + MM.n(t3) + ' = <b>' + MM.n(res) + '</b>')
        ],
        hint: T('Resuelve cada trozo con su signo y súmalos al final.',
                'Aprēķini katru daļu ar tās zīmi un beigās saskaiti.')
      };
    }
  });

  /* =====================================================
     TEMA 5 · POTENCIAS Y ORDEN DE OPERACIONES
     ===================================================== */

  reg('pow.eval', {
    topic: 'pow', level: 1, part: 'A', name: T('Calcular potencias', 'Pakāpju aprēķināšana'),
    make(rng) {
      const kind = rng.int(1, 4);
      let base, exp, res, q, sol;
      if (kind === 1) {
        base = rng.int(2, 12); exp = rng.pick([2, 2, 3]);
        res = Math.pow(base, exp);
        q = G.calc(base + '<sup>' + exp + '</sup>');
        sol = [T(base + '<sup>' + exp + '</sup> = ' + Array(exp).fill(base).join(' · ') + ' = <b>' + res + '</b>',
                 base + '<sup>' + exp + '</sup> = ' + Array(exp).fill(base).join(' · ') + ' = <b>' + res + '</b>')];
      } else if (kind === 2) {
        base = -rng.int(2, 9); exp = rng.pick([2, 3]);
        res = Math.pow(base, exp);
        q = G.calc('(−' + Math.abs(base) + ')<sup>' + exp + '</sup>');
        sol = [T('Exponente ' + (exp % 2 === 0 ? 'par → resultado positivo' : 'impar → resultado negativo'),
                 (exp % 2 === 0 ? 'Pāra kāpinātājs → pozitīvs rezultāts' : 'Nepāra kāpinātājs → negatīvs rezultāts')),
               T('(−' + Math.abs(base) + ')<sup>' + exp + '</sup> = <b>' + res + '</b>', '(−' + Math.abs(base) + ')<sup>' + exp + '</sup> = <b>' + res + '</b>')];
      } else if (kind === 3) {
        const b2 = rng.int(2, 9); exp = 2;
        res = -(b2 * b2);
        q = G.calc('−' + b2 + '<sup>2</sup>');
        sol = [T('Sin paréntesis, el menos NO se eleva: primero ' + b2 + '² = ' + (b2 * b2) + ' y luego se le pone el signo.',
                 'Bez iekavām mīnusu NEKĀPINA: vispirms ' + b2 + '² = ' + (b2 * b2) + ', tad pieliek zīmi.'),
               T('Resultado: <b>' + res + '</b> &nbsp;(ojo: (−' + b2 + ')² sí sería +' + (b2 * b2) + ')',
                 'Rezultāts: <b>' + res + '</b> &nbsp;(uzmanību: (−' + b2 + ')² būtu +' + (b2 * b2) + ')')];
      } else {
        const dec = rng.pick([0.1, 0.2, 0.3, 0.5, 1.1, 0.4]);
        exp = 2; res = Math.round(dec * dec * 1000) / 1000;
        q = G.calc(MM.n(dec) + '<sup>2</sup>');
        sol = [T(MM.n(dec) + ' · ' + MM.n(dec) + ': sin comas ' + Math.round(dec * 10) + ' · ' + Math.round(dec * 10) + ' = ' + Math.round(dec * 10) * Math.round(dec * 10) + ', y 2 decimales.',
                 MM.n(dec) + ' · ' + MM.n(dec) + ': bez komatiem ' + Math.round(dec * 10) + ' · ' + Math.round(dec * 10) + ' = ' + Math.round(dec * 10) * Math.round(dec * 10) + ', un 2 decimālcipari.'),
               T('Resultado: <b>' + MM.n(res) + '</b>', 'Rezultāts: <b>' + MM.n(res) + '</b>')];
      }
      return { q: q, answerType: 'num', answer: String(res), solution: sol };
    }
  });

  reg('pow.order', {
    topic: 'pow', level: 1, part: 'A', name: T('Orden de operaciones', 'Darbību secība'),
    make(rng) {
      const a = rng.pick([12, 16, 18, 20, 24, 36, 48]);
      const b = rng.int(2, 4);
      const divisors = MM.divisors(a * b).filter(x => x > 1 && x <= 12);
      const c = rng.pick(divisors), d = rng.int(2, 5);
      const s1 = a * b, s2 = s1 / c, res = s2 * d;
      return {
        q: G.calc(a + ' <span class="op">·</span> ' + b + ' <span class="op">:</span> ' + c + ' <span class="op">·</span> ' + d),
        answerType: 'num', answer: String(res),
        solution: [
          T('Multiplicaciones y divisiones <b>en el orden en que aparecen</b>, de izquierda a derecha.',
            'Reizināšanu un dalīšanu veic <b>tādā secībā, kā uzrakstīts</b>, no kreisās uz labo.'),
          T(a + ' · ' + b + ' = ' + s1, a + ' · ' + b + ' = ' + s1),
          T(s1 + ' : ' + c + ' = ' + s2, s1 + ' : ' + c + ' = ' + s2),
          T(s2 + ' · ' + d + ' = <b>' + res + '</b>', s2 + ' · ' + d + ' = <b>' + res + '</b>'),
          T('Error típico: hacer primero ' + c + ' · ' + d + '.', 'Tipiska kļūda: vispirms aprēķināt ' + c + ' · ' + d + '.')
        ]
      };
    }
  });

  reg('pow.parens', {
    topic: 'pow', level: 2, part: 'A', name: T('Paréntesis y potencias', 'Iekavas un pakāpes'),
    make(rng) {
      const a = rng.int(30, 90), b = rng.int(2, 5), c = rng.int(2, 8), d = rng.int(2, 6), e = rng.int(2, 4);
      const inner = c + d * e, res = a - b * inner;
      return {
        q: G.calc(a + ' <span class="op">−</span> ' + b + ' <span class="op">·</span> ( ' + c + ' <span class="op">+</span> ' + d + ' <span class="op">·</span> ' + e + ' )'),
        answerType: 'num', answer: String(res),
        solution: [
          T('Dentro del paréntesis primero el producto: ' + d + ' · ' + e + ' = ' + (d * e),
            'Iekavās vispirms reizinājums: ' + d + ' · ' + e + ' = ' + (d * e)),
          T(c + ' + ' + (d * e) + ' = ' + inner, c + ' + ' + (d * e) + ' = ' + inner),
          T(b + ' · ' + inner + ' = ' + (b * inner), b + ' · ' + inner + ' = ' + (b * inner)),
          T(a + ' − ' + (b * inner) + ' = <b>' + res + '</b>', a + ' − ' + (b * inner) + ' = <b>' + res + '</b>')
        ]
      };
    }
  });

  reg('pow.missing', {
    topic: 'pow', level: 2, part: 'A', name: T('¿Qué exponente falta?', 'Kāds kāpinātājs trūkst?'),
    make(rng) {
      const base = rng.pick([2, 3, 4, 5, 10]), exp = rng.int(2, base === 2 ? 6 : 4);
      const val = Math.pow(base, exp);
      return {
        q: T('¿Cuánto vale <b>n</b> si ' + base + '<sup>n</sup> = ' + val + '?',
             'Cik ir <b>n</b>, ja ' + base + '<sup>n</sup> = ' + val + '?'),
        answerType: 'num', answer: String(exp),
        solution: [
          T('Se multiplica ' + base + ' por sí mismo hasta llegar a ' + val + ':', 'Reizina ' + base + ' ar sevi, līdz iegūst ' + val + ':'),
          T(Array.from({ length: exp }, (_, i) => base + '<sup>' + (i + 1) + '</sup> = ' + Math.pow(base, i + 1)).join(' · '),
            Array.from({ length: exp }, (_, i) => base + '<sup>' + (i + 1) + '</sup> = ' + Math.pow(base, i + 1)).join(' · ')),
          T('n = <b>' + exp + '</b>', 'n = <b>' + exp + '</b>')
        ]
      };
    }
  });

  reg('pow.compare', {
    topic: 'pow', level: 2, part: 'A', name: T('Comparar potencias', 'Pakāpju salīdzināšana'),
    make(rng) {
      const b1 = rng.int(2, 6), e1 = rng.int(2, 4), b2 = rng.int(2, 6), e2 = rng.int(2, 4);
      const v1 = Math.pow(b1, e1), v2 = Math.pow(b2, e2);
      return Object.assign({
        q: T('Compara: ' + b1 + '<sup>' + e1 + '</sup> &nbsp;y&nbsp; ' + b2 + '<sup>' + e2 + '</sup>',
             'Salīdzini: ' + b1 + '<sup>' + e1 + '</sup> &nbsp;un&nbsp; ' + b2 + '<sup>' + e2 + '</sup>'),
        solution: [
          T(b1 + '<sup>' + e1 + '</sup> = ' + v1 + ' &nbsp;y&nbsp; ' + b2 + '<sup>' + e2 + '</sup> = ' + v2,
            b1 + '<sup>' + e1 + '</sup> = ' + v1 + ' &nbsp;un&nbsp; ' + b2 + '<sup>' + e2 + '</sup> = ' + v2),
          T(v1 + ' ' + (v1 < v2 ? '&lt;' : (v1 > v2 ? '&gt;' : '=')) + ' ' + v2,
            v1 + ' ' + (v1 < v2 ? '&lt;' : (v1 > v2 ? '&gt;' : '=')) + ' ' + v2)
        ]
      }, G.cmpField(v1, v2));
    }
  });

  reg('pow.units', {
    topic: 'pow', level: 2, part: 'A', name: T('Unidades al cuadrado y al cubo', 'Kvadrātiskās un kubiskās mērvienības'),
    make(rng) {
      const opts = [
        { a: 'cm²', b: 'mm²', k: 100, e: T('1 cm = 10 mm → 1 cm² = 10² = 100 mm²', '1 cm = 10 mm → 1 cm² = 10² = 100 mm²') },
        { a: 'm²', b: 'cm²', k: 10000, e: T('1 m = 100 cm → 1 m² = 100² = 10 000 cm²', '1 m = 100 cm → 1 m² = 100² = 10 000 cm²') },
        { a: 'dm²', b: 'cm²', k: 100, e: T('1 dm = 10 cm → 1 dm² = 100 cm²', '1 dm = 10 cm → 1 dm² = 100 cm²') },
        { a: 'm³', b: 'dm³', k: 1000, e: T('1 m = 10 dm → 1 m³ = 10³ = 1000 dm³', '1 m = 10 dm → 1 m³ = 10³ = 1000 dm³') },
        { a: 'cm³', b: 'mm³', k: 1000, e: T('1 cm = 10 mm → 1 cm³ = 10³ = 1000 mm³', '1 cm = 10 mm → 1 cm³ = 10³ = 1000 mm³') }
      ];
      const o = rng.pick(opts), v = rng.pick([2, 3, 4, 5, 0.5, 1.2, 2.5]);
      const res = Math.round(v * o.k * 1000) / 1000;
      return {
        q: T('Convierte: <b>' + MM.n(v) + ' ' + o.a + '</b> = …… ' + o.b,
             'Pārveido: <b>' + MM.n(v) + ' ' + o.a + '</b> = …… ' + o.b),
        answerType: 'num', answer: String(res), unit: o.b,
        solution: [o.e, T(MM.n(v) + ' · ' + MM.nk(o.k) + ' = <b>' + MM.nk(res) + ' ' + o.b + '</b>', MM.n(v) + ' · ' + MM.nk(o.k) + ' = <b>' + MM.nk(res) + ' ' + o.b + '</b>')],
        hint: T('El factor de la longitud se eleva al cuadrado o al cubo.',
                'Garuma reizinātāju kāpina kvadrātā vai kubā.')
      };
    }
  });

})(typeof window !== 'undefined' ? window : globalThis);
