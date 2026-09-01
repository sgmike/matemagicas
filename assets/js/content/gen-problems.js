/* =========================================================
   Generadores 14–15 · problemas de trabajo y movimiento,
   lógica y razonamiento
   ========================================================= */
(function (global) {
  'use strict';
  const MM = global.MM, T = MM.T, F = (n, d) => MM.F(n, d);
  const G = MM.G, reg = (id, def) => MM.gen.register(id, def);
  const fr = G.fr;

  /* =====================================================
     TEMA 14 · TRABAJO, MOVIMIENTO Y CONJUNTOS
     ===================================================== */

  reg('wm.workchange', {
    topic: 'wm', level: 3, part: 'B', points: 4, name: T('Cambia el número de trabajadores', 'Mainās strādnieku skaits'),
    make(rng) {
      const w0 = rng.int(4, 8), days = rng.pick([8, 10, 12, 15]);
      const total = w0 * days;
      const after = rng.int(2, Math.min(4, w0 - 1));
      const left = w0 - after;
      const d1 = rng.int(2, days - 3);
      const remaining = total - w0 * d1;
      const more = remaining / left;
      if (!Number.isInteger(more)) return this.make(MM.rng(rng.int(1, 1e6)));
      const ctx = rng.pick([
        { w: T('excavadoras', 'ekskavatori'), job: T('cavar un estanque', 'izrakt dīķi'), br: T('se estropearon', 'salūza') },
        { w: T('máquinas', 'mašīnas'), job: T('hacer el trabajo', 'paveikt darbu'), br: T('se averiaron', 'sabojājās') }
      ]);
      return {
        q: T('Una cuadrilla con <b>' + w0 + ' ' + ctx.w.es + '</b> puede ' + ctx.job.es + ' en <b>' + days + ' días</b>. Después de <b>' + d1 + ' días</b> ' + ctx.br.es + ' <b>' + after + '</b> y hubo que terminar con las que quedaban. ¿En cuántos días en total se terminó el trabajo? (Todas rinden igual.)',
             'Brigāde ar <b>' + w0 + ' ' + ctx.w.lv + '</b> var ' + ctx.job.lv + ' <b>' + days + ' dienās</b>. Pēc <b>' + d1 + ' dienām</b> ' + ctx.br.lv + ' <b>' + after + '</b>, un darbs bija jāpabeidz ar atlikušajiem. Cik dienās kopā darbs tika pabeigts? (Visi ir vienlīdz jaudīgi.)'),
        answerType: 'num', answer: String(d1 + more), unit: T('días', 'dienas'), points: 4,
        solution: [
          T('Trabajo total = ' + w0 + ' · ' + days + ' = <b>' + total + '</b> unidades de trabajo.',
            'Kopējais darbs = ' + w0 + ' · ' + days + ' = <b>' + total + '</b> darba vienības.'),
          T('En ' + d1 + ' días se hicieron ' + w0 + ' · ' + d1 + ' = ' + (w0 * d1) + ' → faltan ' + remaining + '.',
            'Pirmajās ' + d1 + ' dienās paveikts ' + w0 + ' · ' + d1 + ' = ' + (w0 * d1) + ' → atlicis ' + remaining + '.'),
          T('Quedan ' + left + ': ' + remaining + ' : ' + left + ' = ' + more + ' días más.',
            'Paliek ' + left + ': ' + remaining + ' : ' + left + ' = vēl ' + more + ' dienas.'),
          T('Total = ' + d1 + ' + ' + more + ' = <b>' + (d1 + more) + ' días</b>', 'Kopā = ' + d1 + ' + ' + more + ' = <b>' + (d1 + more) + ' dienas</b>')
        ],
        hint: T('Convierte todo a “unidades de trabajo”: trabajadores × días.',
                'Pārveido visu “darba vienībās”: strādnieki × dienas.')
      };
    }
  });

  reg('wm.rates', {
    topic: 'wm', level: 2, part: 'B', points: 3, name: T('Dos que trabajan juntos', 'Divi strādā kopā'),
    make(rng) {
      const t1 = rng.pick([2, 3, 4, 5, 6, 8, 9, 10, 12]);
      const t2 = rng.pick([3, 4, 6, 8, 12, 15, 18].filter(x => x !== t1));
      const r1 = F(1, t1), r2 = F(1, t2);
      const both = r1.add(r2);
      const time = both.inv();
      const mins = Math.round(time.v * 60);
      const ctx = rng.pick([
        { a: T('Un grifo llena un depósito', 'Viens krāns piepilda tvertni'), b: T('otro grifo lo llena', 'otrs krāns to piepilda') },
        { a: T('Una impresora hace un pedido', 'Viens printeris izpilda pasūtījumu'), b: T('la otra lo hace', 'otrs to izpilda') },
        { a: T('Un pintor pinta una habitación', 'Viens krāsotājs nokrāso istabu'), b: T('el otro la pinta', 'otrs to nokrāso') }
      ]);
      return Object.assign({
        q: T(ctx.a.es + ' en <b>' + t1 + ' horas</b> y ' + ctx.b.es + ' en <b>' + t2 + ' horas</b>. ¿Cuánto tardan trabajando juntos? (en horas)',
             ctx.a.lv + ' <b>' + t1 + ' stundās</b>, bet ' + ctx.b.lv + ' <b>' + t2 + ' stundās</b>. Cik ilgi tie strādā kopā? (stundās)'),
        points: 3,
        solution: [
          T('Ritmo del primero: ' + fr(1, t1) + ' del trabajo por hora. Del segundo: ' + fr(1, t2) + '.',
            'Pirmā ražīgums: ' + fr(1, t1) + ' no darba stundā. Otrā: ' + fr(1, t2) + '.'),
          T('Juntos: ' + fr(1, t1) + ' + ' + fr(1, t2) + ' = ' + MM.fr(both) + ' por hora.',
            'Kopā: ' + fr(1, t1) + ' + ' + fr(1, t2) + ' = ' + MM.fr(both) + ' stundā.'),
          T('Tiempo = 1 : ' + MM.fr(both) + ' = <b>' + MM.fr(time, { mixed: true }) + ' h</b> = ' + MM.n(time.v) + ' h ≈ ' + Math.floor(time.v) + ' h ' + (mins - 60 * Math.floor(time.v)) + ' min',
            'Laiks = 1 : ' + MM.fr(both) + ' = <b>' + MM.fr(time, { mixed: true }) + ' h</b> = ' + MM.n(time.v) + ' h ≈ ' + Math.floor(time.v) + ' h ' + (mins - 60 * Math.floor(time.v)) + ' min'),
          T('Comprobación: el tiempo juntos siempre es MENOR que el del más rápido.',
            'Pārbaude: kopīgais laiks vienmēr ir MAZĀKS nekā ātrākajam.')
        ],
        hint: T('Los ritmos se suman; el tiempo es el inverso del ritmo total.',
                'Ražīgumus saskaita; laiks ir kopējā ražīguma apgrieztais lielums.')
      }, G.frac(time, true));
    }
  });

  reg('wm.ratehelp', {
    topic: 'wm', level: 3, part: 'B', points: 5, name: T('Ayuda durante un rato', 'Palīdzība uz brīdi'),
    make(rng) {
      const a = rng.pick([45, 60, 36, 40]), b = rng.pick([30, 20, 24]), c = rng.pick([36, 30, 60, 45].filter(x => x !== a));
      const help = rng.pick([10, 15, 20, 30]);
      const baskets = 2;
      const ra = F(1, a), rb = F(1, b), rc = F(1, c);
      const together = ra.add(rb).add(rc);
      const done = together.mul(F(help, 1));
      const rest = F(baskets, 1).sub(done);
      if (rest.n <= 0) return this.make(MM.rng(rng.int(1, 1e6)));
      const alone = rest.div(ra);
      const total = help + alone.v;
      const nm = G.names(rng, 3);
      return {
        q: T(nm[0] + ' tiene que llenar <b>' + baskets + ' cestas</b> de fresas. Sus amigas ' + nm[1] + ' y ' + nm[2] + ' le ayudaron durante <b>' + help + ' minutos</b> y después se fueron. ' + nm[0] + ' llena una cesta en <b>' + a + ' min</b>, ' + nm[1] + ' en <b>' + b + ' min</b> y ' + nm[2] + ' en <b>' + c + ' min</b>. ¿Cuántos minutos se tardó en llenar las dos cestas?',
             nm[0] + ' jāpielasa <b>' + baskets + ' grozi</b> zemeņu. Draudzenes ' + nm[1] + ' un ' + nm[2] + ' palīdzēja <b>' + help + ' minūtes</b> un tad aizgāja. ' + nm[0] + ' vienu grozu pielasa <b>' + a + ' min</b>, ' + nm[1] + ' — <b>' + b + ' min</b>, ' + nm[2] + ' — <b>' + c + ' min</b>. Cik minūtēs tika pielasīti abi grozi?'),
        answerType: 'num', answer: String(Math.round(total * 1000) / 1000), unit: 'min', tol: 0.02, points: 5,
        solution: [
          T('Ritmos por minuto: ' + fr(1, a) + ', ' + fr(1, b) + ' y ' + fr(1, c) + ' de cesta.',
            'Ražīgums minūtē: ' + fr(1, a) + ', ' + fr(1, b) + ' un ' + fr(1, c) + ' no groza.'),
          T('Juntas: ' + fr(1, a) + ' + ' + fr(1, b) + ' + ' + fr(1, c) + ' = ' + MM.fr(together) + ' de cesta por minuto.',
            'Kopā: ' + fr(1, a) + ' + ' + fr(1, b) + ' + ' + fr(1, c) + ' = ' + MM.fr(together) + ' no groza minūtē.'),
          T('En ' + help + ' minutos: ' + help + ' · ' + MM.fr(together) + ' = ' + MM.fr(done, { mixed: true }) + ' de cesta.',
            help + ' minūtēs: ' + help + ' · ' + MM.fr(together) + ' = ' + MM.fr(done, { mixed: true }) + ' groza.'),
          T('Falta: ' + baskets + ' − ' + MM.fr(done, { mixed: true }) + ' = ' + MM.fr(rest, { mixed: true }) + ' de cesta, y ' + nm[0] + ' sigue sola a ' + fr(1, a) + ' por minuto.',
            'Atlicis: ' + baskets + ' − ' + MM.fr(done, { mixed: true }) + ' = ' + MM.fr(rest, { mixed: true }) + ' groza, un ' + nm[0] + ' turpina viena ar ' + fr(1, a) + ' minūtē.'),
          T('Tiempo sola: ' + MM.fr(rest, { mixed: true }) + ' : ' + fr(1, a) + ' = ' + MM.n(alone.v) + ' min',
            'Laiks vienai: ' + MM.fr(rest, { mixed: true }) + ' : ' + fr(1, a) + ' = ' + MM.n(alone.v) + ' min'),
          T('Total = ' + help + ' + ' + MM.n(alone.v) + ' = <b>' + MM.n(total) + ' minutos</b>',
            'Kopā = ' + help + ' + ' + MM.n(alone.v) + ' = <b>' + MM.n(total) + ' minūtes</b>')
        ],
        hint: T('Calcula qué parte del trabajo hacen entre todas durante la ayuda.',
                'Aprēķini, cik lielu daļu no darba viņas paveic kopā palīdzības laikā.')
      };
    }
  });

  reg('wm.meet', {
    topic: 'wm', level: 2, part: 'A', name: T('Se encuentran', 'Satiekas'),
    make(rng) {
      const v1 = rng.pick([40, 50, 60, 70, 80, 90]), v2 = rng.pick([40, 50, 60, 70, 80, 90]);
      const hours = rng.pick([1, 1.5, 2, 2.5, 3]);
      const dist = (v1 + v2) * hours;
      const askDist = rng.chance(0.4);
      return {
        q: T('Dos ciudades distan <b>' + MM.nk(dist) + ' km</b>. Salen dos coches a la vez, uno de cada ciudad, a <b>' + v1 + ' km/h</b> y <b>' + v2 + ' km/h</b>. ' +
             (askDist ? '¿A qué distancia de la primera ciudad se encuentran?' : '¿En cuánto tiempo se encuentran? (en horas)'),
             'Divas pilsētas atrodas <b>' + MM.nk(dist) + ' km</b> attālumā. Vienlaikus no katras izbrauc auto ar ātrumu <b>' + v1 + ' km/h</b> un <b>' + v2 + ' km/h</b>. ' +
             (askDist ? 'Cik tālu no pirmās pilsētas tie satiksies?' : 'Pēc cik ilga laika tie satiksies? (stundās)')),
        answerType: 'num', answer: String(askDist ? v1 * hours : hours), unit: askDist ? 'km' : 'h', tol: 0.005,
        solution: [
          T('Van uno hacia el otro → las velocidades <b>se suman</b>: ' + v1 + ' + ' + v2 + ' = ' + (v1 + v2) + ' km/h',
            'Brauc viens otram pretī → ātrumus <b>saskaita</b>: ' + v1 + ' + ' + v2 + ' = ' + (v1 + v2) + ' km/h'),
          T('Tiempo = ' + MM.nk(dist) + ' : ' + (v1 + v2) + ' = <b>' + MM.n(hours) + ' h</b>',
            'Laiks = ' + MM.nk(dist) + ' : ' + (v1 + v2) + ' = <b>' + MM.n(hours) + ' h</b>'),
          askDist ? T('Distancia desde la primera: ' + v1 + ' · ' + MM.n(hours) + ' = <b>' + MM.n(v1 * hours) + ' km</b>',
                      'Attālums no pirmās: ' + v1 + ' · ' + MM.n(hours) + ' = <b>' + MM.n(v1 * hours) + ' km</b>')
                  : T('Comprobación: ' + v1 + ' · ' + MM.n(hours) + ' + ' + v2 + ' · ' + MM.n(hours) + ' = ' + MM.nk(dist) + ' ✓',
                      'Pārbaude: ' + v1 + ' · ' + MM.n(hours) + ' + ' + v2 + ' · ' + MM.n(hours) + ' = ' + MM.nk(dist) + ' ✓')
        ],
        hint: T('Sentidos opuestos → velocidad de acercamiento = v₁ + v₂.',
                'Pretēji virzieni → tuvošanās ātrums = v₁ + v₂.')
      };
    }
  });

  reg('wm.catchup', {
    topic: 'wm', level: 3, part: 'B', points: 3, name: T('Alcanzar a otro', 'Panākšana'),
    make(rng) {
      const v2 = rng.pick([12, 15, 40, 50, 60]), v1 = v2 + rng.pick([3, 5, 10, 20, 30]);
      const headMin = rng.pick([10, 12, 15, 20, 30, 60]);
      const head = F(headMin, 60);
      const gap = head.mul(F(v2, 1));
      const t = gap.div(F(v1 - v2, 1));
      const dist = t.mul(F(v1, 1));
      return {
        q: T('Un corredor sale a <b>' + v2 + ' km/h</b>. <b>' + headMin + ' minutos</b> después sale otro a <b>' + v1 + ' km/h</b> por el mismo camino. ¿A qué distancia de la salida lo alcanza?',
             'Skrējējs izskrien ar ātrumu <b>' + v2 + ' km/h</b>. Pēc <b>' + headMin + ' minūtēm</b> pa to pašu ceļu izskrien otrs ar ātrumu <b>' + v1 + ' km/h</b>. Cik tālu no starta viņš to panāks?'),
        answerType: 'num', answer: String(Math.round(dist.v * 10000) / 10000), unit: 'km', tol: 0.02, points: 3,
        solution: [
          T('Ventaja del primero: ' + headMin + ' min = ' + MM.fr(head) + ' h → ' + v2 + ' · ' + MM.fr(head) + ' = ' + MM.fr(gap, { mixed: true }) + ' km',
            'Pirmā priekšrocība: ' + headMin + ' min = ' + MM.fr(head) + ' h → ' + v2 + ' · ' + MM.fr(head) + ' = ' + MM.fr(gap, { mixed: true }) + ' km'),
          T('Velocidad de acercamiento: ' + v1 + ' − ' + v2 + ' = ' + (v1 - v2) + ' km/h',
            'Tuvošanās ātrums: ' + v1 + ' − ' + v2 + ' = ' + (v1 - v2) + ' km/h'),
          T('Tiempo hasta alcanzarlo: ' + MM.fr(gap, { mixed: true }) + ' : ' + (v1 - v2) + ' = ' + MM.fr(t, { mixed: true }) + ' h = ' + MM.n(t.v * 60) + ' min',
            'Laiks līdz panākšanai: ' + MM.fr(gap, { mixed: true }) + ' : ' + (v1 - v2) + ' = ' + MM.fr(t, { mixed: true }) + ' h = ' + MM.n(t.v * 60) + ' min'),
          T('Distancia: ' + v1 + ' · ' + MM.fr(t, { mixed: true }) + ' = <b>' + MM.fr(dist, { mixed: true }) + ' km</b> ≈ ' + MM.n(dist.v, 2) + ' km',
            'Attālums: ' + v1 + ' · ' + MM.fr(t, { mixed: true }) + ' = <b>' + MM.fr(dist, { mixed: true }) + ' km</b> ≈ ' + MM.n(dist.v, 2) + ' km')
        ],
        hint: T('Primero, ¿cuántos km lleva de ventaja el que salió antes?',
                'Vispirms: cik km priekšrocība ir tam, kurš izgāja agrāk?')
      };
    }
  });

  reg('wm.race', {
    topic: 'wm', level: 3, part: 'B', points: 5, name: T('Carrera con salida escalonada', 'Skrējiens ar dažādiem startiem'),
    make(rng) {
      const v2 = rng.pick([8, 10, 12]), v1 = v2 + rng.pick([2, 3, 4]);
      const D = rng.pick([6, 8, 10, 12]);
      const headMin = rng.pick([4, 5, 6, 8]);
      const head = F(headMin, 60);
      const gap = head.mul(F(v2, 1));
      const t = gap.div(F(v1 - v2, 1));
      const runFast = t.mul(F(v1, 1));
      if (runFast.v >= D) return this.make(MM.rng(rng.int(1, 1e6)));
      const toFinish = F(D, 1).sub(runFast);
      const diffMin = 60 * D / v2 - headMin - 60 * D / v1;
      const nm = G.names(rng, 2);
      return {
        q: T(nm[0] + ' y ' + nm[1] + ' corren <b>' + D + ' km</b>. ' + nm[1] + ' corre a <b>' + v2 + ' km/h</b> y ' + nm[0] + ' a <b>' + v1 + ' km/h</b>, pero ' + nm[1] + ' sale <b>' + headMin + ' minutos antes</b>. ¿A qué distancia de la meta lo alcanza ' + nm[0] + '? ¿Cuántos minutos después llegará ' + nm[1] + ' a la meta?',
             nm[0] + ' un ' + nm[1] + ' skrien <b>' + D + ' km</b>. ' + nm[1] + ' skrien ar ātrumu <b>' + v2 + ' km/h</b>, bet ' + nm[0] + ' — <b>' + v1 + ' km/h</b>, tomēr ' + nm[1] + ' startē <b>' + headMin + ' minūtes agrāk</b>. Kādā attālumā no finiša ' + nm[0] + ' panāks ' + nm[1] + '? Cik minūtes pēc ' + nm[0] + ' finišēs ' + nm[1] + '?'),
        fields: [
          { key: 'd', label: T('Distancia a la meta (km)', 'Attālums līdz finišam (km)'), answerType: 'num', answer: String(Math.round(toFinish.v * 10000) / 10000), unit: 'km', tol: 0.02 },
          { key: 'm', label: T('Diferencia al llegar (min)', 'Starpība finišā (min)'), answerType: 'num', answer: String(Math.round(diffMin * 1000) / 1000), unit: 'min', tol: 0.02 }
        ],
        points: 5,
        solution: [
          T('Ventaja inicial: ' + headMin + ' min = ' + MM.fr(head) + ' h → ' + v2 + ' · ' + MM.fr(head) + ' = ' + MM.fr(gap, { mixed: true }) + ' km',
            'Sākuma priekšrocība: ' + headMin + ' min = ' + MM.fr(head) + ' h → ' + v2 + ' · ' + MM.fr(head) + ' = ' + MM.fr(gap, { mixed: true }) + ' km'),
          T('Acercamiento: ' + v1 + ' − ' + v2 + ' = ' + (v1 - v2) + ' km/h → tiempo = ' + MM.fr(t, { mixed: true }) + ' h',
            'Tuvošanās ātrums: ' + v1 + ' − ' + v2 + ' = ' + (v1 - v2) + ' km/h → laiks = ' + MM.fr(t, { mixed: true }) + ' h'),
          T('En ese tiempo ' + nm[0] + ' recorre ' + v1 + ' · ' + MM.fr(t, { mixed: true }) + ' = ' + MM.fr(runFast, { mixed: true }) + ' km',
            'Šajā laikā ' + nm[0] + ' veic ' + v1 + ' · ' + MM.fr(t, { mixed: true }) + ' = ' + MM.fr(runFast, { mixed: true }) + ' km'),
          T('Distancia a la meta: ' + D + ' − ' + MM.fr(runFast, { mixed: true }) + ' = <b>' + MM.fr(toFinish, { mixed: true }) + ' km</b> ≈ ' + MM.n(toFinish.v, 2),
            'Attālums līdz finišam: ' + D + ' − ' + MM.fr(runFast, { mixed: true }) + ' = <b>' + MM.fr(toFinish, { mixed: true }) + ' km</b> ≈ ' + MM.n(toFinish.v, 2)),
          T(nm[0] + ' tarda ' + D + ' : ' + v1 + ' = ' + MM.n(60 * D / v1) + ' min desde su salida; ' + nm[1] + ' tarda ' + D + ' : ' + v2 + ' = ' + MM.n(60 * D / v2) + ' min desde la suya (' + headMin + ' min antes).',
            nm[0] + ' laiks: ' + D + ' : ' + v1 + ' = ' + MM.n(60 * D / v1) + ' min no sava starta; ' + nm[1] + ' laiks: ' + D + ' : ' + v2 + ' = ' + MM.n(60 * D / v2) + ' min no sava starta (' + headMin + ' min agrāk).'),
          T('Diferencia: ' + MM.n(60 * D / v2) + ' − ' + headMin + ' − ' + MM.n(60 * D / v1) + ' = <b>' + MM.n(diffMin) + ' min</b>',
            'Starpība: ' + MM.n(60 * D / v2) + ' − ' + headMin + ' − ' + MM.n(60 * D / v1) + ' = <b>' + MM.n(diffMin) + ' min</b>')
        ],
        hint: T('Para la segunda pregunta, mide los tiempos desde la salida del que salió primero.',
                'Otrajam jautājumam mēri laikus no pirmā starta brīža.')
      };
    }
  });

  reg('wm.train', {
    topic: 'wm', level: 2, part: 'B', points: 3, name: T('Tren y túnel', 'Vilciens un tunelis'),
    make(rng) {
      const len = rng.pick([100, 150, 200, 250, 300]);
      const tunnel = rng.pick([300, 400, 500, 600, 800, 1000]);
      const kmh = rng.pick([36, 54, 72, 90, 108]);
      const ms = kmh / 3.6;
      const secs = Math.round((len + tunnel) / ms * 100) / 100;
      return {
        q: T('Un tren de <b>' + len + ' m</b> de largo viaja a <b>' + kmh + ' km/h</b> y atraviesa un túnel de <b>' + tunnel + ' m</b>. ¿Cuántos segundos tarda en salir por completo?',
             'Vilciens, kas garš <b>' + len + ' m</b>, brauc ar ātrumu <b>' + kmh + ' km/h</b> un šķērso <b>' + tunnel + ' m</b> garu tuneli. Cik sekundēs tas pilnībā izbrauc no tuneļa?'),
        answerType: 'num', answer: String(secs), unit: 's', tol: 0.02, points: 3,
        solution: [
          T('El tren recorre el túnel <b>más su propia longitud</b>: ' + tunnel + ' + ' + len + ' = ' + MM.nk(tunnel + len) + ' m',
            'Vilciens veic tuneļa garumu <b>plus savu garumu</b>: ' + tunnel + ' + ' + len + ' = ' + MM.nk(tunnel + len) + ' m'),
          T('Velocidad: ' + kmh + ' km/h : 3,6 = ' + MM.n(ms) + ' m/s', 'Ātrums: ' + kmh + ' km/h : 3,6 = ' + MM.n(ms) + ' m/s'),
          T(MM.nk(tunnel + len) + ' : ' + MM.n(ms) + ' = <b>' + MM.n(secs) + ' s</b>', MM.nk(tunnel + len) + ' : ' + MM.n(ms) + ' = <b>' + MM.n(secs) + ' s</b>')
        ],
        hint: T('No basta con el túnel: el último vagón también tiene que salir.',
                'Ar tuneļa garumu vien nepietiek: arī pēdējam vagonam jāizbrauc.')
      };
    }
  });

  reg('wm.sets', {
    topic: 'wm', level: 2, part: 'B', points: 3, name: T('Conjuntos: los dos y ninguno', 'Kopas: abi un neviens'),
    make(rng) {
      const total = rng.pick([24, 25, 28, 30, 32, 36]);
      const bothN = rng.int(3, 9);
      const onlyA = rng.int(3, 10), onlyB = rng.int(3, 10);
      const neither = total - (onlyA + onlyB + bothN);
      if (neither < 0 || neither > 10) return this.make(MM.rng(rng.int(1, 1e6)));
      const A = onlyA + bothN, B = onlyB + bothN;
      const askBoth = rng.chance(0.5);
      const s1 = rng.pick([T('fútbol', 'futbolu'), T('baloncesto', 'basketbolu')]);
      const s2 = rng.pick([T('voleibol', 'volejbolu'), T('ajedrez', 'šahu')]);
      if (askBoth) {
        return {
          q: T('En una clase de <b>' + total + '</b> alumnos, <b>' + A + '</b> juegan a ' + s1.es + ', <b>' + B + '</b> juegan a ' + s2.es + ' y <b>' + neither + '</b> no juegan a ninguno de los dos. ¿Cuántos juegan a los dos?',
               'Klasē ir <b>' + total + '</b> skolēni: <b>' + A + '</b> spēlē ' + s1.lv + ', <b>' + B + '</b> spēlē ' + s2.lv + ', un <b>' + neither + '</b> nespēlē nevienu. Cik spēlē abus?'),
          answerType: 'num', answer: String(bothN), points: 3,
          solution: [
            T('Al menos uno: ' + total + ' − ' + neither + ' = ' + (total - neither), 'Vismaz vienu: ' + total + ' − ' + neither + ' = ' + (total - neither)),
            T('A + B − (los dos) = al menos uno → ' + A + ' + ' + B + ' − x = ' + (total - neither),
              'A + B − (abi) = vismaz viens → ' + A + ' + ' + B + ' − x = ' + (total - neither)),
            T('x = ' + (A + B) + ' − ' + (total - neither) + ' = <b>' + bothN + '</b>', 'x = ' + (A + B) + ' − ' + (total - neither) + ' = <b>' + bothN + '</b>')
          ],
          hint: T('|A ∪ B| = |A| + |B| − |A ∩ B|', '|A ∪ B| = |A| + |B| − |A ∩ B|')
        };
      }
      return {
        q: T('En una clase de <b>' + total + '</b> alumnos, <b>' + A + '</b> juegan a ' + s1.es + ', <b>' + B + '</b> juegan a ' + s2.es + ' y <b>' + bothN + '</b> juegan a los dos. ¿Cuántos no juegan a ninguno?',
             'Klasē ir <b>' + total + '</b> skolēni: <b>' + A + '</b> spēlē ' + s1.lv + ', <b>' + B + '</b> spēlē ' + s2.lv + ', un <b>' + bothN + '</b> spēlē abus. Cik nespēlē nevienu?'),
        answerType: 'num', answer: String(neither), points: 3,
        solution: [
          T('En al menos una actividad: ' + A + ' + ' + B + ' − ' + bothN + ' = ' + (total - neither) + ' (se resta porque se contaron dos veces).',
            'Vismaz vienā: ' + A + ' + ' + B + ' − ' + bothN + ' = ' + (total - neither) + ' (atņem, jo tie saskaitīti divreiz).'),
          T('Ninguna: ' + total + ' − ' + (total - neither) + ' = <b>' + neither + '</b>', 'Nevienā: ' + total + ' − ' + (total - neither) + ' = <b>' + neither + '</b>')
        ],
        hint: T('Los que hacen las dos cosas se han contado dos veces.', 'Tie, kas dara abus, ir saskaitīti divreiz.')
      };
    }
  });

  /* =====================================================
     TEMA 15 · LÓGICA Y RAZONAMIENTO
     ===================================================== */

  reg('log.table', {
    topic: 'log', level: 2, part: 'A', name: T('¿Quién hace qué?', 'Kurš ko dara?'),
    make(rng) {
      const people = G.names(rng, 3);
      const acts = rng.sample([
        T('fútbol', 'futbolu'), T('baloncesto', 'basketbolu'), T('voleibol', 'volejbolu'),
        T('ajedrez', 'šahu'), T('natación', 'peldēšanu'), T('tenis', 'tenisu')
      ], 3);
      const assign = rng.shuffle([0, 1, 2]);             // persona i -> acts[assign[i]]
      const k = rng.int(0, 2);                            // persona con doble negativa
      const others = [0, 1, 2].filter(i => i !== k);
      const j = rng.pick(others), mIdx = others.find(i => i !== j);
      const notK = [0, 1, 2].filter(a => a !== assign[k]);
      const clues = [
        T(people[k] + ' no practica ' + acts[notK[0]].es + ' ni ' + acts[notK[1]].es + '.',
          people[k] + ' netrenējas ne ' + acts[notK[0]].lv + ', ne ' + acts[notK[1]].lv + '.'),
        T(people[j] + ' no practica ' + acts[assign[mIdx]].es + '.',
          people[j] + ' netrenējas ' + acts[assign[mIdx]].lv + '.')
      ];
      const askIdx = rng.pick([j, mIdx]);
      const correct = acts[assign[askIdx]];
      const wrongs = [0, 1, 2].filter(a => a !== assign[askIdx]).map(a => acts[a]);
      return Object.assign({
        q: T('Tres amigos —' + people.join(', ') + '— practican cada uno un deporte distinto: ' + acts.map(a => a.es).join(', ') + '. ' +
             clues[0].es + ' ' + clues[1].es + ' ¿Qué practica <b>' + people[askIdx] + '</b>?',
             'Trīs draugi — ' + people.join(', ') + ' — katrs trenējas citā sporta veidā: ' + acts.map(a => a.lv).join(', ') + '. ' +
             clues[0].lv + ' ' + clues[1].lv + ' Ar ko nodarbojas <b>' + people[askIdx] + '</b>?'),
        solution: [
          T('Empieza por la pista más restrictiva: ' + people[k] + ' solo puede practicar ' + acts[assign[k]].es + '.',
            'Sāc ar visstingrāko nosacījumu: ' + people[k] + ' var trenēties tikai ' + acts[assign[k]].lv + '.'),
          T('Entonces ' + people[j] + ', que tampoco practica ' + acts[assign[mIdx]].es + ', practica ' + acts[assign[j]].es + '.',
            'Tad ' + people[j] + ', kurš netrenējas arī ' + acts[assign[mIdx]].lv + ', trenējas ' + acts[assign[j]].lv + '.'),
          T('A ' + people[mIdx] + ' le queda ' + acts[assign[mIdx]].es + '. Respuesta: <b>' + people[askIdx] + ' → ' + correct.es + '</b>',
            people[mIdx] + ' paliek ' + acts[assign[mIdx]].lv + '. Atbilde: <b>' + people[askIdx] + ' → ' + correct.lv + '</b>')
        ],
        hint: T('Haz una tabla y marca ✗ en lo imposible.', 'Uzzīmē tabulu un atzīmē ✗ neiespējamo.')
      }, G.mc(rng, correct, wrongs));
    }
  });

  reg('log.tournament', {
    topic: 'log', level: 3, part: 'A', name: T('Torneo de 3 equipos', '3 komandu turnīrs'),
    make(rng) {
      const teams = [T('Lobos', 'Vilki'), T('Osos', 'Lāči'), T('Liebres', 'Zaķi')];
      const pairs = [[0, 1], [0, 2], [1, 2]];
      const all = [];
      for (let a = 0; a < 3; a++) for (let b = 0; b < 3; b++) for (let c = 0; c < 3; c++) {
        const out = [a, b, c], pts = [0, 0, 0];
        out.forEach((o, i) => {
          const [x, y] = pairs[i];
          if (o === 0) pts[x] += 3; else if (o === 1) pts[y] += 3; else { pts[x]++; pts[y]++; }
        });
        all.push(pts);
      }
      /* solo escenarios en los que los dos datos determinan el tercero */
      const valid = all.filter(p => {
        const same = all.filter(q => q[1] === p[1] && q[2] === p[2]);
        return same.every(q => q[0] === p[0]);
      });
      const pick = rng.pick(valid);
      return {
        q: T('En un torneo de clase juegan 3 equipos: ' + teams.map(t => '“' + t.es + '”').join(', ') + '. Cada equipo juega una vez contra cada otro. Por victoria 3 puntos, por empate 1 punto y por derrota 0. Al final, “' + teams[1].es + '” tiene <b>' + pick[1] + '</b> puntos y “' + teams[2].es + '” tiene <b>' + pick[2] + '</b>. ¿Cuántos puntos tiene “' + teams[0].es + '”?',
             'Klases turnīrā piedalās 3 komandas: ' + teams.map(t => '“' + t.lv + '”').join(', ') + '. Katra komanda ar katru spēlē vienu reizi. Par uzvaru 3 punkti, par neizšķirtu 1 punkts, par zaudējumu 0. Beigās “' + teams[1].lv + '” ir <b>' + pick[1] + '</b> punkti, bet “' + teams[2].lv + '” — <b>' + pick[2] + '</b>. Cik punktu ir “' + teams[0].lv + '”?'),
        answerType: 'num', answer: String(pick[0]),
        solution: [
          T('Hay 3 partidos en total y cada equipo juega 2.', 'Kopā ir 3 spēles, un katra komanda spēlē 2.'),
          T('En cada partido se reparten 3 puntos (con ganador) o 2 (empate). El total de puntos del torneo es ' + (pick[0] + pick[1] + pick[2]) + '.',
            'Katrā spēlē tiek izdalīti 3 punkti (ar uzvarētāju) vai 2 (neizšķirts). Turnīra kopējais punktu skaits ir ' + (pick[0] + pick[1] + pick[2]) + '.'),
          T('Descomponiendo los puntos de cada equipo en victorias y empates, la única posibilidad deja a “' + teams[0].es + '” con <b>' + pick[0] + ' puntos</b>.',
            'Sadalot katras komandas punktus uzvarās un neizšķirtos, vienīgā iespēja atstāj “' + teams[0].lv + '” ar <b>' + pick[0] + ' punktiem</b>.')
        ],
        hint: T('Con 2 partidos: 6 = dos victorias, 4 = victoria + empate, 3 = victoria + derrota, 2 = dos empates, 1 = empate + derrota, 0 = dos derrotas.',
                'Ar 2 spēlēm: 6 = divas uzvaras, 4 = uzvara + neizšķirts, 3 = uzvara + zaudējums, 2 = divi neizšķirti, 1 = neizšķirts + zaudējums, 0 = divi zaudējumi.')
      };
    }
  });

  reg('log.handshake', {
    topic: 'log', level: 1, part: 'A', name: T('Saludos y partidos', 'Sasveicināšanās un spēles'),
    make(rng) {
      const n = rng.int(4, 12);
      const res = n * (n - 1) / 2;
      const isTeams = rng.chance(0.5);
      return {
        q: isTeams
          ? T('En un torneo de <b>' + n + ' equipos</b>, cada equipo juega una vez contra cada uno de los demás. ¿Cuántos partidos se juegan?',
              'Turnīrā ar <b>' + n + ' komandām</b> katra komanda ar katru spēlē vienu reizi. Cik spēļu notiek?')
          : T('<b>' + n + ' amigos</b> se saludan todos con todos una vez. ¿Cuántos saludos hay?',
              '<b>' + n + ' draugi</b> sasveicinās katrs ar katru vienu reizi. Cik sasveicināšanos notiek?'),
        answerType: 'num', answer: String(res),
        solution: [
          T('Cada uno se encuentra con los otros ' + (n - 1) + ': ' + n + ' · ' + (n - 1) + ' = ' + (n * (n - 1)),
            'Katrs satiekas ar pārējiem ' + (n - 1) + ': ' + n + ' · ' + (n - 1) + ' = ' + (n * (n - 1))),
          T('Pero así cada pareja se cuenta dos veces → ' + (n * (n - 1)) + ' : 2 = <b>' + res + '</b>',
            'Bet tā katrs pāris saskaitīts divreiz → ' + (n * (n - 1)) + ' : 2 = <b>' + res + '</b>')
        ],
        hint: T('n · (n − 1) : 2', 'n · (n − 1) : 2')
      };
    }
  });

  reg('log.cuts', {
    topic: 'log', level: 1, part: 'A', name: T('Cortes, postes y pausas', 'Griezumi, mieti un pauzes'),
    make(rng) {
      const kind = rng.int(1, 3);
      if (kind === 1) {
        const p1 = rng.int(3, 6), tPer = rng.int(2, 6), p2 = p1 + rng.int(1, 4);
        const t1 = (p1 - 1) * tPer, t2 = (p2 - 1) * tPer;
        return {
          q: T('Cortar un tronco en <b>' + p1 + ' partes</b> tarda <b>' + t1 + ' minutos</b>. ¿Cuánto se tarda en cortarlo en <b>' + p2 + ' partes</b>?',
               'Sazāģēt baļķi <b>' + p1 + ' daļās</b> aizņem <b>' + t1 + ' minūtes</b>. Cik ilgi to sazāģēt <b>' + p2 + ' daļās</b>?'),
          answerType: 'num', answer: String(t2), unit: 'min',
          solution: [
            T(p1 + ' partes = <b>' + (p1 - 1) + ' cortes</b> → ' + t1 + ' : ' + (p1 - 1) + ' = ' + tPer + ' min por corte.',
              p1 + ' daļas = <b>' + (p1 - 1) + ' griezumi</b> → ' + t1 + ' : ' + (p1 - 1) + ' = ' + tPer + ' min viens griezums.'),
            T(p2 + ' partes = ' + (p2 - 1) + ' cortes → ' + (p2 - 1) + ' · ' + tPer + ' = <b>' + t2 + ' min</b>',
              p2 + ' daļas = ' + (p2 - 1) + ' griezumi → ' + (p2 - 1) + ' · ' + tPer + ' = <b>' + t2 + ' min</b>')
          ],
          hint: T('Para n partes hacen falta n − 1 cortes.', 'n daļām vajag n − 1 griezumus.')
        };
      }
      if (kind === 2) {
        const posts = rng.int(5, 15), gap = rng.int(2, 6);
        return {
          q: T('En una valla recta hay <b>' + posts + ' postes</b> separados <b>' + gap + ' m</b> entre sí. ¿Cuánto mide la valla?',
               'Taisnā žogā ir <b>' + posts + ' mieti</b>, starp tiem <b>' + gap + ' m</b>. Cik garš ir žogs?'),
          answerType: 'num', answer: String((posts - 1) * gap), unit: 'm',
          solution: [
            T('Entre ' + posts + ' postes hay <b>' + (posts - 1) + ' tramos</b>.', 'Starp ' + posts + ' mietiem ir <b>' + (posts - 1) + ' posmi</b>.'),
            T((posts - 1) + ' · ' + gap + ' = <b>' + ((posts - 1) * gap) + ' m</b>', (posts - 1) + ' · ' + gap + ' = <b>' + ((posts - 1) * gap) + ' m</b>')
          ]
        };
      }
      const front = rng.int(3, 12), back = rng.int(3, 14);
      return {
        q: T('En una fila, ' + G.name(rng) + ' es el <b>' + front + '.º</b> empezando por delante y el <b>' + back + '.º</b> empezando por detrás. ¿Cuántas personas hay en la fila?',
             'Rindā ' + G.name(rng) + ' ir <b>' + front + '.</b> no priekšas un <b>' + back + '.</b> no aizmugures. Cik cilvēku ir rindā?'),
        answerType: 'num', answer: String(front + back - 1),
        solution: [
          T(front + ' + ' + back + ' = ' + (front + back) + ', pero esa persona se ha contado <b>dos veces</b>.',
            front + ' + ' + back + ' = ' + (front + back) + ', bet šis cilvēks saskaitīts <b>divreiz</b>.'),
          T((front + back) + ' − 1 = <b>' + (front + back - 1) + ' personas</b>', (front + back) + ' − 1 = <b>' + (front + back - 1) + ' cilvēki</b>')
        ]
      };
    }
  });

  reg('log.family', {
    topic: 'log', level: 1, part: 'A', name: T('Leer bien el enunciado', 'Uzmanīga lasīšana'),
    make(rng) {
      const nm = G.name(rng);
      const sisters = rng.int(1, 3), brothers = rng.int(1, 3);
      const age = rng.int(9, 13);
      return {
        q: T(nm + ', de ' + age + ' años, tiene <b>' + sisters + ' hermana(s)</b> y <b>' + brothers + ' hermano(s)</b>. ¿Cuántos hijos hay en la familia de ' + nm + '?',
             nm + ', ' + age + ' gadus vec(a), ir <b>' + sisters + ' māsa(s)</b> un <b>' + brothers + ' brālis(-ļi)</b>. Cik bērnu ir ' + nm + ' ģimenē?'),
        answerType: 'num', answer: String(sisters + brothers + 1),
        solution: [
          T('Hermanas: ' + sisters + ' · hermanos: ' + brothers, 'Māsas: ' + sisters + ' · brāļi: ' + brothers),
          T('¡Y hay que contar también a ' + nm + '! ' + sisters + ' + ' + brothers + ' + 1 = <b>' + (sisters + brothers + 1) + '</b>',
            'Un jāsaskaita arī ' + nm + '! ' + sisters + ' + ' + brothers + ' + 1 = <b>' + (sisters + brothers + 1) + '</b>')
        ],
        hint: T('¿A quién se te está olvidando contar?', 'Kuru tu aizmirsti saskaitīt?')
      };
    }
  });

  reg('log.sequence', {
    topic: 'log', level: 2, part: 'A', name: T('Continúa la serie', 'Turpini virkni'),
    make(rng) {
      const kind = rng.int(1, 4);
      let seq = [], next, rule;
      if (kind === 1) {
        const a = rng.int(1, 12), d = rng.int(2, 9);
        seq = Array.from({ length: 5 }, (_, i) => a + i * d);
        next = a + 5 * d;
        rule = T('Se suma ' + d + ' cada vez.', 'Katru reizi pieskaita ' + d + '.');
      } else if (kind === 2) {
        const a = rng.int(1, 5), r = rng.int(2, 3);
        seq = Array.from({ length: 5 }, (_, i) => a * Math.pow(r, i));
        next = a * Math.pow(r, 5);
        rule = T('Se multiplica por ' + r + ' cada vez.', 'Katru reizi reizina ar ' + r + '.');
      } else if (kind === 3) {
        const a = rng.int(1, 6);
        seq = Array.from({ length: 5 }, (_, i) => a + i * (i + 1) / 2 + i);
        seq = [a];
        for (let i = 1; i < 5; i++) seq.push(seq[i - 1] + i + 1);
        next = seq[4] + 5 + 1;
        rule = T('La diferencia crece de uno en uno: +2, +3, +4, +5…', 'Starpība aug par vienu: +2, +3, +4, +5…');
      } else {
        const a = rng.int(2, 9);
        seq = Array.from({ length: 5 }, (_, i) => (i + 1) * (i + 1) + a);
        next = 36 + a;
        rule = T('Son los cuadrados 1, 4, 9, 16, 25… más ' + a + '.', 'Tie ir kvadrāti 1, 4, 9, 16, 25… plus ' + a + '.');
      }
      return {
        q: T('¿Qué número sigue? <b>' + seq.join(', ') + ', …</b>', 'Kurš skaitlis ir nākamais? <b>' + seq.join('; ') + '; …</b>'),
        answerType: 'num', answer: String(next),
        solution: [
          T('Diferencias: ' + seq.slice(1).map((v, i) => v - seq[i]).join(', '), 'Starpības: ' + seq.slice(1).map((v, i) => v - seq[i]).join('; ')),
          rule,
          T('El siguiente es <b>' + next + '</b>.', 'Nākamais ir <b>' + next + '</b>.')
        ],
        hint: T('Calcula la diferencia entre cada dos términos seguidos.', 'Aprēķini starpību starp katriem diviem blakus locekļiem.')
      };
    }
  });

})(typeof window !== 'undefined' ? window : globalThis);
