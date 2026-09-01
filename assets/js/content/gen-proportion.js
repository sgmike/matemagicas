/* =========================================================
   Generadores 6–8 · porcentajes, razones y proporciones,
   magnitudes y unidades
   ========================================================= */
(function (global) {
  'use strict';
  const MM = global.MM, T = MM.T, F = (n, d) => MM.F(n, d);
  const G = MM.G, reg = (id, def) => MM.gen.register(id, def);
  const fr = G.fr;

  /* =====================================================
     TEMA 6 · PORCENTAJES
     ===================================================== */

  reg('pct.of', {
    topic: 'pct', level: 1, part: 'A', name: T('Porcentaje de un número', 'Procenti no skaitļa'),
    make(rng) {
      const p = rng.pick([5, 10, 12, 15, 20, 25, 30, 35, 40, 45, 50, 60, 70, 75, 80, 90, 120, 150]);
      const base = rng.pick([20, 40, 60, 80, 120, 140, 160, 200, 240, 300, 350, 400, 450, 500, 600, 1500]);
      const res = Math.round(p * base) / 100;
      return {
        q: T('¿Cuánto es el <b>' + p + ' %</b> de <b>' + MM.nk(base) + '</b>?',
             'Cik ir <b>' + p + ' %</b> no <b>' + MM.nk(base) + '</b>?'),
        answerType: 'num', answer: String(res),
        solution: [
          T(p + ' % = ' + MM.n(p / 100) + ' (se divide el porcentaje entre 100)',
            p + ' % = ' + MM.n(p / 100) + ' (procentus dala ar 100)'),
          T(MM.n(p / 100) + ' · ' + MM.nk(base) + ' = <b>' + MM.nk(res) + '</b>',
            MM.n(p / 100) + ' · ' + MM.nk(base) + ' = <b>' + MM.nk(res) + '</b>'),
          T('De cabeza: el 10 % es ' + MM.n(base / 10) + ', y el ' + p + ' % son ' + MM.n(p / 10) + ' veces eso.',
            'No galvas: 10 % ir ' + MM.n(base / 10) + ', un ' + p + ' % ir ' + MM.n(p / 10) + ' reizes vairāk.')
        ],
        hint: T('El 10 % se calcula dividiendo entre 10.', '10 % aprēķina, dalot ar 10.')
      };
    }
  });

  reg('pct.whole', {
    topic: 'pct', level: 2, part: 'A', name: T('Hallar el total', 'Atrast veselo'),
    make(rng) {
      const p = rng.pick([5, 8, 10, 15, 20, 25, 30, 40, 50, 60, 75, 80]);
      const total = rng.pick([40, 60, 80, 120, 140, 200, 250, 300, 400, 500, 600]);
      const part = Math.round(p * total) / 100;
      return {
        q: T('El <b>' + p + ' %</b> de un número es <b>' + MM.n(part) + '</b>. ¿Cuál es el número?',
             '<b>' + p + ' %</b> no skaitļa ir <b>' + MM.n(part) + '</b>. Kāds ir šis skaitlis?'),
        answerType: 'num', answer: String(total),
        solution: [
          T('Aquí se conoce la parte y se busca el total → se <b>divide</b>.',
            'Šeit zināma daļa un jāatrod veselais → <b>dala</b>.'),
          T(MM.n(part) + ' : ' + MM.n(p / 100) + ' = <b>' + MM.nk(total) + '</b>',
            MM.n(part) + ' : ' + MM.n(p / 100) + ' = <b>' + MM.nk(total) + '</b>'),
          T('Otra forma: si el ' + p + ' % es ' + MM.n(part) + ', el 1 % es ' + MM.n(part / p) + ' y el 100 % es ' + MM.nk(total) + '.',
            'Cits ceļš: ja ' + p + ' % ir ' + MM.n(part) + ', tad 1 % ir ' + MM.n(part / p) + ' un 100 % ir ' + MM.nk(total) + '.')
        ],
        hint: T('Calcula primero cuánto vale el 1 %.', 'Vispirms aprēķini, cik ir 1 %.')
      };
    }
  });

  reg('pct.what', {
    topic: 'pct', level: 2, part: 'A', name: T('¿Qué porcentaje es?', 'Cik procentu ir?'),
    make(rng) {
      const total = rng.pick([20, 25, 40, 45, 50, 60, 72, 75, 80, 90, 120, 150, 200, 300]);
      const p = rng.pick([5, 10, 20, 25, 30, 40, 50, 60, 75, 80]);
      const part = Math.round(total * p) / 100;
      return {
        q: T('¿Qué porcentaje de <b>' + total + '</b> es <b>' + MM.n(part) + '</b>?',
             'Cik procentu no <b>' + total + '</b> ir <b>' + MM.n(part) + '</b>?'),
        answerType: 'num', answer: String(p), unit: '%',
        solution: [
          T('Se divide la parte entre el total: ' + MM.n(part) + ' : ' + total + ' = ' + MM.n(part / total),
            'Daļu dala ar veselo: ' + MM.n(part) + ' : ' + total + ' = ' + MM.n(part / total)),
          T('Y se multiplica por 100: ' + MM.n(part / total) + ' · 100 = <b>' + p + ' %</b>',
            'Un reizina ar 100: ' + MM.n(part / total) + ' · 100 = <b>' + p + ' %</b>')
        ],
        hint: T('parte : total · 100', 'daļa : veselais · 100')
      };
    }
  });

  reg('pct.discount', {
    topic: 'pct', level: 2, part: 'A', name: T('Descuentos', 'Atlaides'),
    make(rng) {
      const p = rng.pick([10, 15, 20, 25, 30, 40, 50, 60]);
      const orig = rng.pick([20, 25, 30, 40, 50, 60, 80, 120, 150, 200]);
      const mult = (100 - p) / 100;
      const paid = Math.round(orig * mult * 100) / 100;
      const askOriginal = rng.chance(0.5);
      const item = rng.pick([T('un libro', 'grāmatu'), T('una mochila', 'somu'), T('unos patines', 'skrituļslidas'), T('una chaqueta', 'jaku')]);
      const nm = G.name(rng);
      if (askOriginal) {
        return {
          q: T(nm + ' compró ' + item.es + ' con un <b>' + p + ' % de descuento</b> y pagó <b>' + MM.n(paid) + ' €</b>. ¿Cuánto costaba sin descuento?',
               nm + ' nopirka ' + item.lv + ' ar <b>' + p + ' % atlaidi</b> un samaksāja <b>' + MM.n(paid) + ' €</b>. Cik tā maksāja bez atlaides?'),
          answerType: 'num', answer: String(orig), unit: '€',
          solution: [
            T('Con un ' + p + ' % de descuento se paga el <b>' + (100 - p) + ' %</b> → multiplicador ' + MM.n(mult),
              'Ar ' + p + ' % atlaidi maksā <b>' + (100 - p) + ' %</b> → reizinātājs ' + MM.n(mult)),
            T('Para deshacerlo se divide: ' + MM.n(paid) + ' : ' + MM.n(mult) + ' = <b>' + MM.n(orig) + ' €</b>',
              'Lai atgrieztos, dala: ' + MM.n(paid) + ' : ' + MM.n(mult) + ' = <b>' + MM.n(orig) + ' €</b>'),
            T('Comprobación: ' + MM.n(orig) + ' · ' + MM.n(mult) + ' = ' + MM.n(paid) + ' ✓',
              'Pārbaude: ' + MM.n(orig) + ' · ' + MM.n(mult) + ' = ' + MM.n(paid) + ' ✓')
          ],
          hint: T('¿Qué porcentaje del precio se paga realmente?', 'Cik procentus no cenas patiesībā samaksā?')
        };
      }
      return {
        q: T(item.es.charAt(0).toUpperCase() + item.es.slice(1) + ' cuesta <b>' + MM.n(orig) + ' €</b> y tiene un <b>' + p + ' % de descuento</b>. ¿Cuánto se paga?',
             'Prece maksā <b>' + MM.n(orig) + ' €</b>, un tai ir <b>' + p + ' % atlaide</b>. Cik jāmaksā?'),
        answerType: 'num', answer: String(paid), unit: '€',
        solution: [
          T('Descuento: ' + MM.n(orig) + ' · ' + MM.n(p / 100) + ' = ' + MM.n(orig * p / 100) + ' €',
            'Atlaide: ' + MM.n(orig) + ' · ' + MM.n(p / 100) + ' = ' + MM.n(orig * p / 100) + ' €'),
          T('Se paga: ' + MM.n(orig) + ' − ' + MM.n(orig * p / 100) + ' = <b>' + MM.n(paid) + ' €</b>',
            'Jāmaksā: ' + MM.n(orig) + ' − ' + MM.n(orig * p / 100) + ' = <b>' + MM.n(paid) + ' €</b>'),
          T('Más rápido: ' + MM.n(orig) + ' · ' + MM.n(mult) + ' = ' + MM.n(paid) + ' €',
            'Ātrāk: ' + MM.n(orig) + ' · ' + MM.n(mult) + ' = ' + MM.n(paid) + ' €')
        ]
      };
    }
  });

  reg('pct.increase', {
    topic: 'pct', level: 2, part: 'A', name: T('Subidas de precio', 'Cenas pieaugums'),
    make(rng) {
      const p = rng.pick([5, 10, 15, 20, 25, 30, 50]);
      const orig = rng.pick([40, 60, 80, 120, 150, 200, 250, 400]);
      const res = Math.round(orig * (100 + p)) / 100;
      return {
        q: T('El precio de una entrada era <b>' + MM.n(orig) + ' €</b> y ha subido un <b>' + p + ' %</b>. ¿Cuánto cuesta ahora?',
             'Biļetes cena bija <b>' + MM.n(orig) + ' €</b> un ir pieaugusi par <b>' + p + ' %</b>. Cik tā maksā tagad?'),
        answerType: 'num', answer: String(res), unit: '€',
        solution: [
          T('Subida del ' + p + ' % → se paga el ' + (100 + p) + ' % → multiplicador ' + MM.n((100 + p) / 100),
            'Pieaugums par ' + p + ' % → maksā ' + (100 + p) + ' % → reizinātājs ' + MM.n((100 + p) / 100)),
          T(MM.n(orig) + ' · ' + MM.n((100 + p) / 100) + ' = <b>' + MM.n(res) + ' €</b>',
            MM.n(orig) + ' · ' + MM.n((100 + p) / 100) + ' = <b>' + MM.n(res) + ' €</b>')
        ]
      };
    }
  });

  reg('pct.chain', {
    topic: 'pct', level: 3, part: 'B', points: 3, name: T('Subida y bajada', 'Pieaugums un samazinājums'),
    make(rng) {
      const up = rng.pick([10, 20, 25, 50]), down = rng.pick([10, 20, 25, 40]);
      const orig = rng.pick([80, 100, 120, 200, 240, 400]);
      const mid = Math.round(orig * (100 + up)) / 100;
      const fin = Math.round(mid * (100 - down)) / 100;
      return {
        q: T('Una tienda sube el precio de un artículo de <b>' + MM.n(orig) + ' €</b> un <b>' + up + ' %</b> y después lo baja un <b>' + down + ' %</b>. ¿Cuál es el precio final?',
             'Veikals paaugstina preces cenu no <b>' + MM.n(orig) + ' €</b> par <b>' + up + ' %</b> un pēc tam samazina par <b>' + down + ' %</b>. Kāda ir gala cena?'),
        answerType: 'num', answer: String(fin), unit: '€', points: 3,
        solution: [
          T('Subida: ' + MM.n(orig) + ' · ' + MM.n((100 + up) / 100) + ' = ' + MM.n(mid) + ' €',
            'Pieaugums: ' + MM.n(orig) + ' · ' + MM.n((100 + up) / 100) + ' = ' + MM.n(mid) + ' €'),
          T('Bajada: ' + MM.n(mid) + ' · ' + MM.n((100 - down) / 100) + ' = <b>' + MM.n(fin) + ' €</b>',
            'Samazinājums: ' + MM.n(mid) + ' · ' + MM.n((100 - down) / 100) + ' = <b>' + MM.n(fin) + ' €</b>'),
          T('El precio final es ' + (fin < orig ? 'MENOR' : (fin > orig ? 'MAYOR' : 'IGUAL')) + ' que el inicial: los porcentajes no se suman, porque se aplican sobre bases distintas.',
            'Gala cena ir ' + (fin < orig ? 'MAZĀKA' : (fin > orig ? 'LIELĀKA' : 'TĀDA PATI')) + ' nekā sākotnējā: procentus nesaskaita, jo tos rēķina no dažādām bāzēm.')
        ],
        hint: T('Calcula primero el precio después de la subida y luego aplica la bajada sobre ese nuevo precio.',
                'Vispirms aprēķini cenu pēc pieauguma, tad piemēro samazinājumu jaunajai cenai.')
      };
    }
  });

  reg('pct.class', {
    topic: 'pct', level: 3, part: 'B', points: 3, name: T('Porcentaje que cambia', 'Mainīgs procents'),
    make(rng) {
      const total = rng.pick([20, 25, 30, 40, 50]);
      const p = rng.pick([40, 50, 60, 70]);
      const girls = Math.round(total * p / 100);
      const leave = rng.int(2, 5);
      const nt = total - leave, ng = girls - leave;
      const res = Math.round(ng / nt * 1000) / 10;
      return {
        q: T('En una clase de <b>' + total + '</b> alumnos, el <b>' + p + ' %</b> son niñas. <b>' + leave + '</b> niñas se cambian de escuela. ¿Qué porcentaje de la clase son niñas ahora? (Redondea a una décima.)',
             'Klasē no <b>' + total + '</b> skolēniem <b>' + p + ' %</b> ir meitenes. <b>' + leave + '</b> meitenes pāriet uz citu skolu. Cik procentu klasē tagad ir meitenes? (Noapaļo līdz desmitdaļai.)'),
        answerType: 'num', answer: String(res), unit: '%', tol: 0.06, points: 3,
        solution: [
          T('Niñas al principio: ' + p + ' % de ' + total + ' = ' + girls, 'Meiteņu sākumā: ' + p + ' % no ' + total + ' = ' + girls),
          T('Después: ' + girls + ' − ' + leave + ' = ' + ng + ' niñas y ' + total + ' − ' + leave + ' = ' + nt + ' alumnos.',
            'Pēc tam: ' + girls + ' − ' + leave + ' = ' + ng + ' meitenes un ' + total + ' − ' + leave + ' = ' + nt + ' skolēni.'),
          T(ng + ' : ' + nt + ' = ' + MM.n(ng / nt, 4) + ' → <b>' + MM.n(res) + ' %</b>',
            ng + ' : ' + nt + ' = ' + MM.n(ng / nt, 4) + ' → <b>' + MM.n(res) + ' %</b>'),
          T('Cuidado: cambia la parte <b>y</b> el total.', 'Uzmanību: mainās gan daļa, <b>gan</b> kopskaits.')
        ]
      };
    }
  });

  reg('pct.donate', {
    topic: 'pct', level: 3, part: 'B', points: 4, name: T('Donación y reparto', 'Ziedojums un sadale'),
    make(rng) {
      const nm = G.names(rng, 3);
      const c = [rng.int(15, 30), rng.int(15, 30), rng.int(15, 30)];
      const totalC = c[0] + c[1] + c[2];
      const money = rng.pick([24, 30, 36, 48, 60]);
      const donate = rng.pick([50, 60, 75, 40]);
      const rest = Math.round(money * (100 - donate)) / 100;
      const per = rest / totalC;
      const maxI = c.indexOf(Math.max.apply(null, c));
      const best = Math.round(c[maxI] * per * 100) / 100;
      return {
        q: T('Para el mercadillo escolar, ' + nm[0] + ' horneó <b>' + c[0] + '</b> galletas, ' + nm[1] + ' <b>' + c[1] + '</b> y ' + nm[2] + ' <b>' + c[2] + '</b>. Con ellas obtuvieron <b>' + MM.n(money) + ' €</b>. Donaron el <b>' + donate + ' %</b> a una causa benéfica y el resto lo repartieron proporcionalmente a las galletas horneadas. ¿Cuántos euros recibió quien más recibió?',
             'Skolas tirdziņam ' + nm[0] + ' izcepa <b>' + c[0] + '</b> cepumus, ' + nm[1] + ' <b>' + c[1] + '</b> un ' + nm[2] + ' <b>' + c[2] + '</b>. Par tiem viņas ieguva <b>' + MM.n(money) + ' €</b>. <b>' + donate + ' %</b> viņas ziedoja labdarībai, bet pārējo sadalīja proporcionāli izcepto cepumu skaitam. Cik eiro saņēma tā, kura saņēma visvairāk?'),
        answerType: 'num', answer: String(best), unit: '€', tol: 0.005, points: 4,
        solution: [
          T('Galletas en total: ' + c.join(' + ') + ' = ' + totalC, 'Cepumi kopā: ' + c.join(' + ') + ' = ' + totalC),
          T('Donan el ' + donate + ' % → les queda el ' + (100 - donate) + ' %: ' + MM.n(money) + ' · ' + MM.n((100 - donate) / 100) + ' = ' + MM.n(rest) + ' €',
            'Ziedo ' + donate + ' % → paliek ' + (100 - donate) + ' %: ' + MM.n(money) + ' · ' + MM.n((100 - donate) / 100) + ' = ' + MM.n(rest) + ' €'),
          T('Por galleta: ' + MM.n(rest) + ' : ' + totalC + ' = ' + MM.n(per, 4) + ' €',
            'Par vienu cepumu: ' + MM.n(rest) + ' : ' + totalC + ' = ' + MM.n(per, 4) + ' €'),
          T(nm[maxI] + ' hizo más galletas (' + c[maxI] + '): ' + c[maxI] + ' · ' + MM.n(per, 4) + ' = <b>' + MM.n(best) + ' €</b>',
            nm[maxI] + ' izcepa visvairāk (' + c[maxI] + '): ' + c[maxI] + ' · ' + MM.n(per, 4) + ' = <b>' + MM.n(best) + ' €</b>')
        ],
        hint: T('Primero cuánto dinero queda, después cuánto vale una galleta.',
                'Vispirms, cik naudas paliek; tad, cik vērts ir viens cepums.')
      };
    }
  });

  /* =====================================================
     TEMA 7 · RAZONES Y PROPORCIONES
     ===================================================== */

  reg('rat.simplify', {
    topic: 'rat', level: 1, part: 'A', name: T('Simplificar razones', 'Attiecību saīsināšana'),
    make(rng) {
      const a0 = rng.int(2, 9), b0 = rng.int(2, 9), k = rng.int(2, 12);
      const a = a0 * k, b = b0 * k;
      const g = MM.gcd(a, b);
      const f = F(a, b);
      return {
        q: T('Simplifica la razón <b>' + a + ' : ' + b + '</b><br><small class="muted">Escríbela así: 2:3</small>',
             'Saīsini attiecību <b>' + a + ' : ' + b + '</b><br><small class="muted">Raksti šādi: 2:3</small>'),
        answerType: 'num', answer: f.toString(), mustSimplify: true,
        answerText: '<b>' + f.n + ' : ' + f.d + '</b>',
        solution: [
          T('MCD(' + a + '; ' + b + ') = ' + g, 'LKD(' + a + '; ' + b + ') = ' + g),
          T('Se dividen los dos entre ' + g + ': <b>' + f.n + ' : ' + f.d + '</b>',
            'Abus dala ar ' + g + ': <b>' + f.n + ' : ' + f.d + '</b>')
        ]
      };
    }
  });

  reg('rat.solvex', {
    topic: 'rat', level: 1, part: 'A', name: T('Hallar x en una proporción', 'x atrašana proporcijā'),
    make(rng) {
      const a = rng.int(2, 12), b = rng.int(2, 12), k = rng.int(2, 8);
      const c = a * k, d = b * k;
      const pos = rng.int(1, 2);
      if (pos === 1) {
        return {
          q: T('Halla <b>x</b>: ' + fr(a, b) + ' = ' + MM.L.FS('x', d),
               'Atrodi <b>x</b>: ' + fr(a, b) + ' = ' + MM.L.FS('x', d)),
          answerType: 'num', answer: String(c),
          solution: [
            T('Producto cruzado: ' + a + ' · ' + d + ' = ' + b + ' · x', 'Krustveida reizinājums: ' + a + ' · ' + d + ' = ' + b + ' · x'),
            T(a * d + ' = ' + b + 'x → x = ' + (a * d) + ' : ' + b + ' = <b>' + c + '</b>',
              a * d + ' = ' + b + 'x → x = ' + (a * d) + ' : ' + b + ' = <b>' + c + '</b>')
          ]
        };
      }
      return {
        q: T('Halla <b>x</b>: ' + MM.L.FS(a, 'x') + ' = ' + fr(c, d),
             'Atrodi <b>x</b>: ' + MM.L.FS(a, 'x') + ' = ' + fr(c, d)),
        answerType: 'num', answer: String(b),
        solution: [
          T('Producto cruzado: ' + a + ' · ' + d + ' = x · ' + c, 'Krustveida reizinājums: ' + a + ' · ' + d + ' = x · ' + c),
          T((a * d) + ' = ' + c + 'x → x = ' + (a * d) + ' : ' + c + ' = <b>' + b + '</b>',
            (a * d) + ' = ' + c + 'x → x = ' + (a * d) + ' : ' + c + ' = <b>' + b + '</b>')
        ]
      };
    }
  });

  reg('rat.direct', {
    topic: 'rat', level: 1, part: 'A', name: T('Proporcionalidad directa', 'Tieši proporcionāli lielumi'),
    make(rng) {
      const unit = rng.pick([1.5, 2, 2.5, 3, 4, 0.8, 1.2]);
      const q1 = rng.int(2, 9), q2 = rng.int(3, 15);
      const p1 = Math.round(unit * q1 * 100) / 100, p2 = Math.round(unit * q2 * 100) / 100;
      const kind = rng.pick([
        { a: T('kg de manzanas', 'kg ābolu'), b: T('€', '€') },
        { a: T('litros de gasolina', 'litri degvielas'), b: T('€', '€') },
        { a: T('cuadernos', 'burtnīcas'), b: T('€', '€') }
      ]);
      return {
        q: T('<b>' + q1 + ' ' + kind.a.es + '</b> cuestan <b>' + MM.n(p1) + ' €</b>. ¿Cuánto cuestan <b>' + q2 + '</b>?',
             '<b>' + q1 + ' ' + kind.a.lv + '</b> maksā <b>' + MM.n(p1) + ' €</b>. Cik maksā <b>' + q2 + '</b>?'),
        answerType: 'num', answer: String(p2), unit: '€', tol: 0.005,
        solution: [
          T('Más cantidad → más precio: proporcionalidad <b>directa</b>.', 'Vairāk → dārgāk: <b>tieši</b> proporcionāli lielumi.'),
          T('Precio de uno: ' + MM.n(p1) + ' : ' + q1 + ' = ' + MM.n(unit) + ' €', 'Viena cena: ' + MM.n(p1) + ' : ' + q1 + ' = ' + MM.n(unit) + ' €'),
          T(q2 + ' · ' + MM.n(unit) + ' = <b>' + MM.n(p2) + ' €</b>', q2 + ' · ' + MM.n(unit) + ' = <b>' + MM.n(p2) + ' €</b>')
        ],
        hint: T('Calcula primero cuánto cuesta una unidad.', 'Vispirms aprēķini vienas vienības cenu.')
      };
    }
  });

  reg('rat.inverse', {
    topic: 'rat', level: 2, part: 'A', name: T('Proporcionalidad inversa', 'Apgriezti proporcionāli lielumi'),
    make(rng) {
      const work = rng.pick([60, 72, 90, 120, 144, 180, 240]);
      const ds = MM.divisors(work).filter(x => x >= 3 && x <= 20);
      const w1 = rng.pick(ds), w2 = rng.pick(ds.filter(x => x !== w1));
      const t1 = work / w1, t2 = work / w2;
      const ctx = rng.pick([
        { w: T('obreros', 'strādnieki'), t: T('días', 'dienas') },
        { w: T('bombas', 'sūkņi'), t: T('horas', 'stundas') },
        { w: T('máquinas', 'mašīnas'), t: T('días', 'dienas') }
      ]);
      return {
        q: T('<b>' + w1 + ' ' + ctx.w.es + '</b> terminan un trabajo en <b>' + t1 + ' ' + ctx.t.es + '</b>. ¿Cuánto tardan <b>' + w2 + '</b>?',
             '<b>' + w1 + ' ' + ctx.w.lv + '</b> paveic darbu <b>' + t1 + ' ' + ctx.t.lv + '</b> laikā. Cik ilgi strādās <b>' + w2 + '</b>?'),
        answerType: 'num', answer: String(t2),
        solution: [
          T('Más ' + ctx.w.es + ' → menos ' + ctx.t.es + ': proporcionalidad <b>inversa</b>.',
            'Vairāk ' + ctx.w.lv + ' → mazāk ' + ctx.t.lv + ': <b>apgriezti</b> proporcionāli lielumi.'),
          T('Trabajo total = ' + w1 + ' · ' + t1 + ' = <b>' + work + '</b> unidades de trabajo.',
            'Kopējais darbs = ' + w1 + ' · ' + t1 + ' = <b>' + work + '</b> darba vienības.'),
          T(work + ' : ' + w2 + ' = <b>' + t2 + '</b>', work + ' : ' + w2 + ' = <b>' + t2 + '</b>')
        ],
        hint: T('En la inversa, el producto se mantiene constante.', 'Apgriezti proporcionāliem lielumiem reizinājums nemainās.')
      };
    }
  });

  reg('rat.share', {
    topic: 'rat', level: 2, part: 'B', points: 3, name: T('Reparto proporcional', 'Proporcionāla sadale'),
    make(rng) {
      const r = [rng.int(2, 5), rng.int(2, 6), rng.int(3, 8)];
      const sum = r[0] + r[1] + r[2];
      const unit = rng.pick([5, 10, 15, 20, 25]);
      const total = sum * unit;
      const maxI = r.indexOf(Math.max.apply(null, r));
      return {
        q: T('Reparte <b>' + total + ' €</b> en la proporción <b>' + r.join(' : ') + '</b>. ¿Cuánto le toca a la parte mayor?',
             'Sadali <b>' + total + ' €</b> attiecībā <b>' + r.join(' : ') + '</b>. Cik saņem lielākā daļa?'),
        answerType: 'num', answer: String(r[maxI] * unit), unit: '€', points: 3,
        solution: [
          T('Partes en total: ' + r.join(' + ') + ' = ' + sum, 'Daļas kopā: ' + r.join(' + ') + ' = ' + sum),
          T('Una parte: ' + total + ' : ' + sum + ' = ' + unit + ' €', 'Viena daļa: ' + total + ' : ' + sum + ' = ' + unit + ' €'),
          T('Reparto: ' + r.map(x => x * unit + ' €').join(', ') + ' → la mayor es <b>' + (r[maxI] * unit) + ' €</b>',
            'Sadale: ' + r.map(x => x * unit + ' €').join(', ') + ' → lielākā ir <b>' + (r[maxI] * unit) + ' €</b>'),
          T('Comprobación: ' + r.map(x => x * unit).join(' + ') + ' = ' + total + ' ✓',
            'Pārbaude: ' + r.map(x => x * unit).join(' + ') + ' = ' + total + ' ✓')
        ]
      };
    }
  });

  reg('rat.scale', {
    topic: 'rat', level: 2, part: 'A', name: T('Escala de un mapa', 'Kartes mērogs'),
    make(rng) {
      const sc = rng.pick([1000, 5000, 10000, 25000, 50000, 100000]);
      const cm = rng.pick([2, 3, 4, 5, 6, 8, 12, 2.5, 7.5]);
      const realCm = cm * sc, km = realCm / 100000, m = realCm / 100;
      const askKm = km >= 0.5;
      return {
        q: T('En un mapa a escala <b>1 : ' + MM.nk(sc) + '</b>, dos pueblos están a <b>' + MM.n(cm) + ' cm</b>. ¿Cuál es la distancia real en ' + (askKm ? 'km' : 'm') + '?',
             'Kartē ar mērogu <b>1 : ' + MM.nk(sc) + '</b> divi ciemi atrodas <b>' + MM.n(cm) + ' cm</b> attālumā. Kāds ir patiesais attālums ' + (askKm ? 'km' : 'm') + '?'),
        answerType: 'num', answer: String(askKm ? km : m), unit: askKm ? 'km' : 'm',
        solution: [
          T('1 cm en el mapa = ' + MM.nk(sc) + ' cm reales.', '1 cm kartē = ' + MM.nk(sc) + ' cm dabā.'),
          T(MM.n(cm) + ' · ' + MM.nk(sc) + ' = ' + MM.nk(realCm) + ' cm', MM.n(cm) + ' · ' + MM.nk(sc) + ' = ' + MM.nk(realCm) + ' cm'),
          askKm ? T(MM.nk(realCm) + ' cm : 100 = ' + MM.nk(m) + ' m : 1000 = <b>' + MM.n(km) + ' km</b>',
                    MM.nk(realCm) + ' cm : 100 = ' + MM.nk(m) + ' m : 1000 = <b>' + MM.n(km) + ' km</b>')
                 : T(MM.nk(realCm) + ' cm : 100 = <b>' + MM.n(m) + ' m</b>', MM.nk(realCm) + ' cm : 100 = <b>' + MM.n(m) + ' m</b>')
        ],
        hint: T('cm → m se divide entre 100; m → km entre 1000.', 'cm → m dala ar 100; m → km ar 1000.')
      };
    }
  });

  reg('rat.recipe', {
    topic: 'rat', level: 1, part: 'A', name: T('Recetas y porciones', 'Receptes un porcijas'),
    make(rng) {
      const p1 = rng.int(2, 6), mult = rng.int(2, 4);
      const p2 = p1 * mult;
      const g1 = rng.pick([120, 150, 180, 200, 240, 300, 540]);
      const g2 = g1 * mult;
      const ing = rng.pick([T('verduras', 'dārzeņu'), T('harina', 'miltu'), T('azúcar', 'cukura')]);
      return {
        q: T('Para <b>' + p1 + '</b> porciones de sopa hacen falta <b>' + MM.nk(g1) + ' g</b> de ' + ing.es + '. ¿Cuántos gramos hacen falta para <b>' + p2 + '</b> porciones?',
             'Lai pagatavotu <b>' + p1 + '</b> porcijas zupas, vajag <b>' + MM.nk(g1) + ' g</b> ' + ing.lv + '. Cik gramu vajag <b>' + p2 + '</b> porcijām?'),
        answerType: 'num', answer: String(g2), unit: 'g',
        solution: [
          T(p2 + ' : ' + p1 + ' = ' + mult + ' → hacen falta ' + mult + ' veces más.',
            p2 + ' : ' + p1 + ' = ' + mult + ' → vajag ' + mult + ' reizes vairāk.'),
          T(MM.nk(g1) + ' · ' + mult + ' = <b>' + MM.nk(g2) + ' g</b>', MM.nk(g1) + ' · ' + mult + ' = <b>' + MM.nk(g2) + ' g</b>')
        ]
      };
    }
  });

  /* =====================================================
     TEMA 8 · MAGNITUDES Y UNIDADES
     ===================================================== */

  const UNITS = {
    len: { name: T('longitud', 'garums'), u: { km: 1000, m: 1, dm: 0.1, cm: 0.01, mm: 0.001 } },
    area: { name: T('área', 'laukums'), u: { 'km²': 1e6, ha: 1e4, 'm²': 1, 'dm²': 0.01, 'cm²': 1e-4, 'mm²': 1e-6 } },
    vol: { name: T('volumen', 'tilpums'), u: { 'm³': 1000, 'dm³': 1, l: 1, 'cm³': 0.001, ml: 0.001 } },
    mass: { name: T('masa', 'masa'), u: { t: 1000, kg: 1, g: 0.001, mg: 1e-6 } }
  };

  function convGen(id, kind, level) {
    reg(id, {
      topic: 'mag', level: level, part: 'A',
      name: T('Convertir ' + UNITS[kind].name.es, 'Pārveidot: ' + UNITS[kind].name.lv),
      make(rng) {
        const keys = Object.keys(UNITS[kind].u);
        const from = rng.pick(keys);
        const to = rng.pick(keys.filter(k => k !== from && UNITS[kind].u[k] !== UNITS[kind].u[from]));
        const factor = UNITS[kind].u[from] / UNITS[kind].u[to];
        const v = rng.pick([2, 3, 4, 5, 7, 8, 12, 25, 45, 0.5, 1.5, 2.5, 3.4, 0.8, 250, 4200, 750]);
        const res = Math.round(v * factor * 1e9) / 1e9;
        if (res > 1e7 || res < 1e-4) return this.make(MM.rng(rng.int(1, 1e6)));
        return {
          q: T('Convierte: <b>' + MM.n(v) + ' ' + from + '</b> = …… ' + to,
               'Pārveido: <b>' + MM.n(v) + ' ' + from + '</b> = …… ' + to),
          answerType: 'num', answer: String(res), unit: to,
          solution: [
            factor >= 1
              ? T('1 ' + from + ' = ' + MM.nk(factor) + ' ' + to, '1 ' + from + ' = ' + MM.nk(factor) + ' ' + to)
              : T('1 ' + to + ' = ' + MM.nk(1 / factor) + ' ' + from, '1 ' + to + ' = ' + MM.nk(1 / factor) + ' ' + from),
            factor >= 1
              ? T('Se pasa a una unidad más pequeña → se <b>multiplica</b>: ' + MM.n(v) + ' · ' + MM.nk(factor) + ' = <b>' + MM.nk(res) + ' ' + to + '</b>',
                  'Pāreja uz mazāku mērvienību → <b>reizina</b>: ' + MM.n(v) + ' · ' + MM.nk(factor) + ' = <b>' + MM.nk(res) + ' ' + to + '</b>')
              : T('Se pasa a una unidad más grande → se <b>divide</b>: ' + MM.n(v) + ' : ' + MM.nk(1 / factor) + ' = <b>' + MM.n(res) + ' ' + to + '</b>',
                  'Pāreja uz lielāku mērvienību → <b>dala</b>: ' + MM.n(v) + ' : ' + MM.nk(1 / factor) + ' = <b>' + MM.n(res) + ' ' + to + '</b>')
          ],
          hint: kind === 'area' ? T('En áreas cada escalón es ×100 o :100.', 'Laukuma mērvienībās katrs solis ir ×100 vai :100.')
              : kind === 'vol' ? T('En volúmenes cada escalón es ×1000. Recuerda: 1 dm³ = 1 l.', 'Tilpuma mērvienībās katrs solis ir ×1000. Atceries: 1 dm³ = 1 l.')
              : T('¿Vas a una unidad más pequeña? Entonces el número crece.', 'Vai ej uz mazāku mērvienību? Tad skaitlis kļūst lielāks.')
        };
      }
    });
  }
  convGen('mag.len', 'len', 1);
  convGen('mag.area', 'area', 2);
  convGen('mag.vol', 'vol', 2);
  convGen('mag.mass', 'mass', 1);

  reg('mag.time', {
    topic: 'mag', level: 2, part: 'A', name: T('Tiempo', 'Laiks'),
    make(rng) {
      const kind = rng.int(1, 3);
      if (kind === 1) {
        const h = rng.pick([1.5, 2.25, 2.5, 3.4, 0.75, 1.2, 4.5, 0.25, 3.75]);
        const min = Math.round(h * 60);
        return {
          q: T('Convierte: <b>' + MM.n(h) + ' h</b> = …… min', 'Pārveido: <b>' + MM.n(h) + ' h</b> = …… min'),
          answerType: 'num', answer: String(min), unit: 'min',
          solution: [
            T('1 hora = 60 minutos, así que se multiplica por 60 (¡no por 100!).',
              '1 stunda = 60 minūtes, tāpēc reizina ar 60 (nevis ar 100!).'),
            T(MM.n(h) + ' · 60 = <b>' + min + ' min</b>', MM.n(h) + ' · 60 = <b>' + min + ' min</b>')
          ],
          hint: T('El tiempo no es decimal de base 100.', 'Laiks nav decimāls ar bāzi 100.')
        };
      }
      if (kind === 2) {
        const total = rng.int(70, 500);
        const h = Math.floor(total / 60), m = total % 60;
        return {
          q: T('<b>' + total + ' minutos</b> son …… horas y …… minutos.', '<b>' + total + ' minūtes</b> ir …… stundas un …… minūtes.'),
          fields: [
            { key: 'h', label: T('horas', 'stundas'), answerType: 'num', answer: String(h) },
            { key: 'm', label: T('minutos', 'minūtes'), answerType: 'num', answer: String(m) }
          ],
          solution: [
            T(total + ' : 60 = ' + h + ' y sobran ' + m, total + ' : 60 = ' + h + ', atlikums ' + m),
            T('Es decir, <b>' + h + ' h ' + m + ' min</b>.', 'Tas ir <b>' + h + ' h ' + m + ' min</b>.')
          ]
        };
      }
      const f = rng.pick([[1, 2], [1, 3], [1, 4], [3, 4], [1, 6], [2, 3], [5, 6], [1, 12]]);
      const min = 60 * f[0] / f[1];
      return {
        q: T('¿Cuántos minutos son ' + fr(f[0], f[1]) + ' de hora?', 'Cik minūtes ir ' + fr(f[0], f[1]) + ' stundas?'),
        answerType: 'num', answer: String(min), unit: 'min',
        solution: [
          T('60 : ' + f[1] + ' = ' + (60 / f[1]) + ' min es ' + fr(1, f[1]) + ' de hora.',
            '60 : ' + f[1] + ' = ' + (60 / f[1]) + ' min ir ' + fr(1, f[1]) + ' stundas.'),
          T((60 / f[1]) + ' · ' + f[0] + ' = <b>' + min + ' min</b>', (60 / f[1]) + ' · ' + f[0] + ' = <b>' + min + ' min</b>')
        ]
      };
    }
  });

  reg('mag.compare', {
    topic: 'mag', level: 1, part: 'A', name: T('Comparar medidas', 'Mērvienību salīdzināšana'),
    make(rng) {
      const sets = [
        { u: ['mm', 'cm'], f: [1, 10] }, { u: ['cm', 'm'], f: [1, 100] }, { u: ['m', 'km'], f: [1, 1000] },
        { u: ['g', 'kg'], f: [1, 1000] }, { u: ['ml', 'l'], f: [1, 1000] }, { u: ['dm', 'm'], f: [1, 10] },
        { u: ['cm²', 'dm²'], f: [1, 100] }, { u: ['min', 'h'], f: [1, 60] }
      ];
      const s = rng.pick(sets);
      const a = rng.int(2, 90) * (rng.chance(0.5) ? 10 : 1);
      const b = rng.int(1, 9) + (rng.chance(0.4) ? 0.5 : 0);
      const av = a * s.f[0], bv = b * s.f[1];
      return Object.assign({
        q: T('Compara: <b>' + MM.n(a) + ' ' + s.u[0] + '</b> &nbsp;y&nbsp; <b>' + MM.n(b) + ' ' + s.u[1] + '</b>',
             'Salīdzini: <b>' + MM.n(a) + ' ' + s.u[0] + '</b> &nbsp;un&nbsp; <b>' + MM.n(b) + ' ' + s.u[1] + '</b>'),
        solution: [
          T('Primero hay que pasar todo a la misma unidad.', 'Vispirms viss jāpārveido vienā mērvienībā.'),
          T(MM.n(b) + ' ' + s.u[1] + ' = ' + MM.nk(bv) + ' ' + s.u[0], MM.n(b) + ' ' + s.u[1] + ' = ' + MM.nk(bv) + ' ' + s.u[0]),
          T(MM.nk(av) + ' ' + (av < bv ? '&lt;' : (av > bv ? '&gt;' : '=')) + ' ' + MM.nk(bv) + ' → <b>' + MM.n(a) + ' ' + s.u[0] + ' ' + (av < bv ? '&lt;' : (av > bv ? '&gt;' : '=')) + ' ' + MM.n(b) + ' ' + s.u[1] + '</b>',
            MM.nk(av) + ' ' + (av < bv ? '&lt;' : (av > bv ? '&gt;' : '=')) + ' ' + MM.nk(bv) + ' → <b>' + MM.n(a) + ' ' + s.u[0] + ' ' + (av < bv ? '&lt;' : (av > bv ? '&gt;' : '=')) + ' ' + MM.n(b) + ' ' + s.u[1] + '</b>')
        ]
      }, G.cmpField(av, bv));
    }
  });

  reg('mag.speed', {
    topic: 'mag', level: 2, part: 'A', name: T('Velocidad, distancia, tiempo', 'Ātrums, attālums, laiks'),
    make(rng) {
      const v = rng.pick([4, 5, 6, 12, 15, 18, 20, 60, 72, 80, 90]);
      const tMin = rng.pick([15, 20, 30, 40, 45, 90, 120, 150]);
      const t = tMin / 60, d = Math.round(v * t * 100) / 100;
      const ask = rng.int(1, 3);
      if (ask === 1) {
        return {
          q: T('Un ciclista va a <b>' + v + ' km/h</b> durante <b>' + tMin + ' minutos</b>. ¿Cuántos kilómetros recorre?',
               'Riteņbraucējs brauc ar ātrumu <b>' + v + ' km/h</b> <b>' + tMin + ' minūtes</b>. Cik kilometru viņš veic?'),
          answerType: 'num', answer: String(d), unit: 'km', tol: 0.005,
          solution: [
            T('Las unidades tienen que casar: ' + tMin + ' min = ' + MM.fr(F(tMin, 60), { mixed: true }) + ' h = ' + MM.n(t) + ' h',
              'Mērvienībām jāsader: ' + tMin + ' min = ' + MM.fr(F(tMin, 60), { mixed: true }) + ' h = ' + MM.n(t) + ' h'),
            T('d = v · t = ' + v + ' · ' + MM.n(t) + ' = <b>' + MM.n(d) + ' km</b>',
              's = v · t = ' + v + ' · ' + MM.n(t) + ' = <b>' + MM.n(d) + ' km</b>')
          ],
          hint: T('Pasa los minutos a horas antes de multiplicar.', 'Pirms reizināšanas pārveido minūtes stundās.')
        };
      }
      if (ask === 2) {
        return {
          q: T('Un tren recorre <b>' + MM.n(d) + ' km</b> en <b>' + (tMin >= 60 ? Math.floor(tMin / 60) + ' h ' + (tMin % 60 ? (tMin % 60) + ' min' : '') : tMin + ' min') + '</b>. ¿Cuál es su velocidad media en km/h?',
               'Vilciens veic <b>' + MM.n(d) + ' km</b> <b>' + (tMin >= 60 ? Math.floor(tMin / 60) + ' h ' + (tMin % 60 ? (tMin % 60) + ' min' : '') : tMin + ' min') + '</b> laikā. Kāds ir tā vidējais ātrums km/h?'),
          answerType: 'num', answer: String(v), unit: 'km/h', tol: 0.02,
          solution: [
            T('Tiempo en horas: ' + tMin + ' min = ' + MM.n(t) + ' h', 'Laiks stundās: ' + tMin + ' min = ' + MM.n(t) + ' h'),
            T('v = d : t = ' + MM.n(d) + ' : ' + MM.n(t) + ' = <b>' + v + ' km/h</b>', 'v = s : t = ' + MM.n(d) + ' : ' + MM.n(t) + ' = <b>' + v + ' km/h</b>')
          ]
        };
      }
      return {
        q: T('¿Cuántos minutos tarda en recorrer <b>' + MM.n(d) + ' km</b> a <b>' + v + ' km/h</b>?',
             'Cik minūtēs var veikt <b>' + MM.n(d) + ' km</b> ar ātrumu <b>' + v + ' km/h</b>?'),
        answerType: 'num', answer: String(tMin), unit: 'min', tol: 0.02,
        solution: [
          T('t = d : v = ' + MM.n(d) + ' : ' + v + ' = ' + MM.n(t) + ' h', 't = s : v = ' + MM.n(d) + ' : ' + v + ' = ' + MM.n(t) + ' h'),
          T(MM.n(t) + ' h · 60 = <b>' + tMin + ' min</b>', MM.n(t) + ' h · 60 = <b>' + tMin + ' min</b>')
        ]
      };
    }
  });

  reg('mag.cut', {
    topic: 'mag', level: 2, part: 'A', name: T('Cortar en trozos', 'Sagriezt gabalos'),
    make(rng) {
      const pieces = rng.pick([12, 15, 18, 20, 24, 25, 30]);
      const pieceCm = rng.pick([15, 20, 25, 30, 40, 50]);
      const totalCm = pieces * pieceCm;
      const totalM = totalCm / 100;
      const useDm = rng.chance(0.4);
      const pieceShown = useDm ? MM.n(pieceCm / 10) + ' dm' : pieceCm + ' cm';
      return {
        q: T('Se corta una cinta de <b>' + MM.n(totalM) + ' m</b> en trozos de <b>' + pieceShown + '</b>. ¿Cuántos trozos salen?',
             'Lenti, kas gara <b>' + MM.n(totalM) + ' m</b>, sagriež <b>' + pieceShown + '</b> garos gabalos. Cik gabalu iznāk?'),
        answerType: 'num', answer: String(pieces),
        solution: [
          T('Primero, todo en la misma unidad: ' + MM.n(totalM) + ' m = ' + MM.nk(totalCm) + ' cm' + (useDm ? ' y ' + MM.n(pieceCm / 10) + ' dm = ' + pieceCm + ' cm' : ''),
            'Vispirms viss vienā mērvienībā: ' + MM.n(totalM) + ' m = ' + MM.nk(totalCm) + ' cm' + (useDm ? ' un ' + MM.n(pieceCm / 10) + ' dm = ' + pieceCm + ' cm' : '')),
          T(MM.nk(totalCm) + ' : ' + pieceCm + ' = <b>' + pieces + ' trozos</b>', MM.nk(totalCm) + ' : ' + pieceCm + ' = <b>' + pieces + ' gabali</b>')
        ],
        hint: T('No se puede dividir metros entre centímetros sin convertir antes.',
                'Nedrīkst dalīt metrus ar centimetriem, tos vispirms nepārveidojot.')
      };
    }
  });

})(typeof window !== 'undefined' ? window : globalThis);
