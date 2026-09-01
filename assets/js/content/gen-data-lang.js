/* =========================================================
   Generadores 9–10 · estadística y probabilidad,
   lenguaje matemático y ecuaciones
   ========================================================= */
(function (global) {
  'use strict';
  const MM = global.MM, T = MM.T, F = (n, d) => MM.F(n, d);
  const G = MM.G, reg = (id, def) => MM.gen.register(id, def);
  const fr = G.fr;

  /* diagrama de barras en SVG (se dibuja dentro del enunciado) */
  function barChart(labels, values, unitLabel) {
    const W = 340, H = 190, L = 34, B = 30, Ttop = 12, R = 8;
    const max = Math.max.apply(null, values);
    const step = max <= 10 ? 2 : (max <= 25 ? 5 : (max <= 60 ? 10 : 20));
    const top = Math.ceil(max / step) * step;
    const plotH = H - B - Ttop, plotW = W - L - R;
    const bw = plotW / labels.length;
    let s = '<svg class="chart" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + MM.esc(unitLabel || 'diagrama') + '">';
    for (let v = 0; v <= top; v += step) {
      const y = Ttop + plotH - (v / top) * plotH;
      s += '<line class="gl" x1="' + L + '" y1="' + y + '" x2="' + (W - R) + '" y2="' + y + '"/>';
      s += '<text x="' + (L - 5) + '" y="' + (y + 4) + '" text-anchor="end">' + v + '</text>';
    }
    labels.forEach((lb, i) => {
      const h = (values[i] / top) * plotH;
      const x = L + i * bw + bw * 0.18, w = bw * 0.64;
      s += '<rect class="barv" x="' + x.toFixed(1) + '" y="' + (Ttop + plotH - h).toFixed(1) + '" width="' + w.toFixed(1) + '" height="' + h.toFixed(1) + '" rx="3"/>';
      s += '<text x="' + (x + w / 2).toFixed(1) + '" y="' + (H - 10) + '" text-anchor="middle">' + MM.esc(lb) + '</text>';
    });
    s += '<line class="ax" x1="' + L + '" y1="' + (Ttop + plotH) + '" x2="' + (W - R) + '" y2="' + (Ttop + plotH) + '"/>';
    s += '<line class="ax" x1="' + L + '" y1="' + Ttop + '" x2="' + L + '" y2="' + (Ttop + plotH) + '"/>';
    return s + '</svg>';
  }

  /* =====================================================
     TEMA 9 · ESTADÍSTICA Y PROBABILIDAD
     ===================================================== */

  reg('sta.mean', {
    topic: 'sta', level: 1, part: 'A', name: T('Media aritmética', 'Vidējais aritmētiskais'),
    make(rng) {
      const k = rng.int(4, 6);
      const target = rng.int(4, 15);
      const vals = [];
      let sum = 0;
      for (let i = 0; i < k - 1; i++) { const v = rng.int(Math.max(1, target - 4), target + 4); vals.push(v); sum += v; }
      const last = target * k - sum;
      vals.push(last < 1 ? target : last);
      const total = vals.reduce((a, b) => a + b, 0);
      const mean = Math.round(total / k * 1000) / 1000;
      return {
        q: T('Calcula la <b>media aritmética</b> de: ' + vals.join(', '),
             'Aprēķini <b>vidējo aritmētisko</b>: ' + vals.join('; ')),
        answerType: 'num', answer: String(mean), tol: 0.005,
        solution: [
          T('Suma: ' + vals.join(' + ') + ' = ' + total, 'Summa: ' + vals.join(' + ') + ' = ' + total),
          T('Son ' + k + ' datos: ' + total + ' : ' + k + ' = <b>' + MM.n(mean) + '</b>',
            'Datu skaits ' + k + ': ' + total + ' : ' + k + ' = <b>' + MM.n(mean) + '</b>')
        ],
        hint: T('Suma todo y divide entre cuántos son.', 'Saskaiti visu un dali ar datu skaitu.')
      };
    }
  });

  reg('sta.stats', {
    topic: 'sta', level: 2, part: 'A', name: T('Moda, mediana y rango', 'Moda, mediāna un amplitūda'),
    make(rng) {
      const k = rng.pick([7, 8, 9]);
      const vals = [];
      const modeVal = rng.int(2, 9);
      vals.push(modeVal, modeVal, modeVal);
      while (vals.length < k) {
        const v = rng.int(1, 12);
        if (vals.filter(x => x === v).length < 2 && v !== modeVal) vals.push(v);
      }
      const shown = rng.shuffle(vals);
      const sorted = shown.slice().sort((a, b) => a - b);
      const median = sorted.length % 2 ? sorted[(sorted.length - 1) / 2]
                                      : (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2;
      const range = sorted[sorted.length - 1] - sorted[0];
      const which = rng.pick(['moda', 'mediana', 'rango']);
      const ans = which === 'moda' ? modeVal : (which === 'mediana' ? median : range);
      const nameT = which === 'moda' ? T('la <b>moda</b>', '<b>moda</b>')
                  : which === 'mediana' ? T('la <b>mediana</b>', '<b>mediāna</b>')
                  : T('el <b>rango</b> (mayor − menor)', '<b>amplitūda</b> (lielākais − mazākais)');
      const sol = [T('Ordenados: ' + sorted.join(', '), 'Sakārtoti: ' + sorted.join('; '))];
      if (which === 'moda') sol.push(T('El valor que más se repite es <b>' + modeVal + '</b> (aparece ' + shown.filter(x => x === modeVal).length + ' veces).',
                                       'Visbiežāk atkārtojas <b>' + modeVal + '</b> (' + shown.filter(x => x === modeVal).length + ' reizes).'));
      else if (which === 'mediana') sol.push(sorted.length % 2
        ? T('Hay ' + sorted.length + ' datos (impar): el del centro es <b>' + median + '</b>.', 'Ir ' + sorted.length + ' dati (nepāra): vidējais ir <b>' + median + '</b>.')
        : T('Hay ' + sorted.length + ' datos (par): la media de los dos centrales (' + sorted[sorted.length / 2 - 1] + ' y ' + sorted[sorted.length / 2] + ') = <b>' + MM.n(median) + '</b>.',
            'Ir ' + sorted.length + ' dati (pāra): divu vidējo (' + sorted[sorted.length / 2 - 1] + ' un ' + sorted[sorted.length / 2] + ') vidējais = <b>' + MM.n(median) + '</b>.'));
      else sol.push(T(sorted[sorted.length - 1] + ' − ' + sorted[0] + ' = <b>' + range + '</b>', sorted[sorted.length - 1] + ' − ' + sorted[0] + ' = <b>' + range + '</b>'));
      return {
        q: T('Datos: ' + shown.join(', ') + '<br>Calcula ' + nameT.es + '.',
             'Dati: ' + shown.join('; ') + '<br>Nosaki ' + nameT.lv + '.'),
        answerType: 'num', answer: String(ans),
        solution: sol,
        hint: which === 'mediana' ? T('Ordena los datos antes de buscar el centro.', 'Vispirms sakārto datus, tad meklē vidējo.')
                                  : T('Fíjate bien en qué te piden.', 'Uzmanīgi izlasi, ko prasa.')
      };
    }
  });

  reg('sta.missing', {
    topic: 'sta', level: 2, part: 'A', name: T('Nota que falta', 'Trūkstošais vērtējums'),
    make(rng) {
      const k = rng.int(4, 5);
      const vals = Array.from({ length: k }, () => rng.int(4, 10));
      const target = rng.int(6, 9);
      const need = target * (k + 1) - vals.reduce((a, b) => a + b, 0);
      if (need < 1 || need > 10) return this.make(MM.rng(rng.int(1, 1e6)));
      const nm = G.name(rng);
      return {
        q: T('Las notas de ' + nm + ' son ' + vals.join(', ') + '. ¿Qué nota necesita en el siguiente examen para que su media sea <b>' + target + '</b>?',
             nm + ' vērtējumi ir ' + vals.join('; ') + '. Kāds vērtējums vajadzīgs nākamajā pārbaudes darbā, lai vidējais būtu <b>' + target + '</b>?'),
        answerType: 'num', answer: String(need),
        solution: [
          T('Suma actual: ' + vals.join(' + ') + ' = ' + vals.reduce((a, b) => a + b, 0),
            'Pašreizējā summa: ' + vals.join(' + ') + ' = ' + vals.reduce((a, b) => a + b, 0)),
          T('Con ' + (k + 1) + ' notas y media ' + target + ', la suma tiene que ser ' + target + ' · ' + (k + 1) + ' = ' + (target * (k + 1)),
            'Ar ' + (k + 1) + ' vērtējumiem un vidējo ' + target + ' summai jābūt ' + target + ' · ' + (k + 1) + ' = ' + (target * (k + 1))),
          T((target * (k + 1)) + ' − ' + vals.reduce((a, b) => a + b, 0) + ' = <b>' + need + '</b>',
            (target * (k + 1)) + ' − ' + vals.reduce((a, b) => a + b, 0) + ' = <b>' + need + '</b>')
        ],
        hint: T('La media se deshace multiplicando: suma = media · número de datos.',
                'Vidējo atgriež, reizinot: summa = vidējais · datu skaits.')
      };
    }
  });

  reg('sta.combine', {
    topic: 'sta', level: 3, part: 'B', points: 3, name: T('Media de medias', 'Vidējais no vidējiem'),
    make(rng) {
      const d1 = rng.int(4, 6), m1 = rng.int(8, 20);
      const extra = rng.int(1, 2), mExtra = rng.int(10, 26);
      const sum = d1 * m1 + extra * mExtra;
      const res = Math.round(sum / (d1 + extra) * 1000) / 1000;
      return {
        q: T('La temperatura media de <b>' + d1 + ' días</b> fue de <b>' + m1 + ' °C</b>. ' +
             (extra === 1 ? 'Al día siguiente hubo <b>' + mExtra + ' °C</b>.' : 'Los <b>' + extra + '</b> días siguientes la media fue <b>' + mExtra + ' °C</b>.') +
             ' ¿Cuál es la media de los <b>' + (d1 + extra) + '</b> días?',
             'Vidējā temperatūra <b>' + d1 + ' dienās</b> bija <b>' + m1 + ' °C</b>. ' +
             (extra === 1 ? 'Nākamajā dienā bija <b>' + mExtra + ' °C</b>.' : 'Nākamajās <b>' + extra + '</b> dienās vidējā bija <b>' + mExtra + ' °C</b>.') +
             ' Kāds ir vidējais <b>' + (d1 + extra) + '</b> dienās?'),
        answerType: 'num', answer: String(res), unit: '°C', tol: 0.005, points: 3,
        solution: [
          T('Suma de los ' + d1 + ' primeros días: ' + d1 + ' · ' + m1 + ' = ' + (d1 * m1),
            'Pirmo ' + d1 + ' dienu summa: ' + d1 + ' · ' + m1 + ' = ' + (d1 * m1)),
          T('Suma de los ' + extra + ' siguientes: ' + extra + ' · ' + mExtra + ' = ' + (extra * mExtra),
            'Nākamo ' + extra + ' summa: ' + extra + ' · ' + mExtra + ' = ' + (extra * mExtra)),
          T('Total: ' + (d1 * m1) + ' + ' + (extra * mExtra) + ' = ' + sum + ' en ' + (d1 + extra) + ' días',
            'Kopā: ' + (d1 * m1) + ' + ' + (extra * mExtra) + ' = ' + sum + ' ' + (d1 + extra) + ' dienās'),
          T(sum + ' : ' + (d1 + extra) + ' = <b>' + MM.n(res) + ' °C</b>', sum + ' : ' + (d1 + extra) + ' = <b>' + MM.n(res) + ' °C</b>'),
          T('Ojo: NO se puede hacer la media de las medias sin tener en cuenta cuántos días hay de cada una.',
            'Uzmanību: NEDRĪKST vienkārši ņemt vidējo no vidējiem, neievērojot dienu skaitu.')
        ]
      };
    }
  });

  reg('sta.pie', {
    topic: 'sta', level: 2, part: 'A', name: T('Diagrama circular', 'Sektoru diagramma'),
    make(rng) {
      const p = rng.pick([5, 10, 12, 15, 20, 25, 30, 35, 40, 45, 50, 60, 75]);
      const deg = Math.round(p * 3.6 * 100) / 100;
      const toDeg = rng.chance(0.6);
      if (toDeg) {
        return {
          q: T('En un diagrama circular, un sector representa el <b>' + p + ' %</b>. ¿Cuántos grados mide ese sector?',
               'Sektoru diagrammā sektors attēlo <b>' + p + ' %</b>. Cik grādu ir šis sektors?'),
          answerType: 'num', answer: String(deg), unit: '°',
          solution: [
            T('El círculo entero son 360° = 100 %, así que 1 % = 360 : 100 = 3,6°',
              'Viss riņķis ir 360° = 100 %, tātad 1 % = 360 : 100 = 3,6°'),
            T(p + ' · 3,6 = <b>' + MM.n(deg) + '°</b>', p + ' · 3,6 = <b>' + MM.n(deg) + '°</b>')
          ]
        };
      }
      return {
        q: T('En un diagrama circular, un sector mide <b>' + MM.n(deg) + '°</b>. ¿Qué porcentaje representa?',
             'Sektoru diagrammā sektors ir <b>' + MM.n(deg) + '°</b>. Cik procentus tas attēlo?'),
        answerType: 'num', answer: String(p), unit: '%',
        solution: [
          T('1 % = 3,6°, así que se divide entre 3,6.', '1 % = 3,6°, tāpēc dala ar 3,6.'),
          T(MM.n(deg) + ' : 3,6 = <b>' + p + ' %</b>', MM.n(deg) + ' : 3,6 = <b>' + p + ' %</b>')
        ]
      };
    }
  });

  reg('sta.prob', {
    topic: 'sta', level: 2, part: 'A', name: T('Probabilidad', 'Varbūtība'),
    make(rng) {
      const a = rng.int(2, 8), b = rng.int(2, 8), c = rng.int(2, 8);
      const total = a + b + c;
      const which = rng.pick([{ n: a, t: T('roja', 'sarkanu') }, { n: b, t: T('azul', 'zilu') }, { n: c, t: T('verde', 'zaļu') }]);
      const f = F(which.n, total);
      const asPct = rng.chance(0.35) && Number.isInteger(f.v * 100);
      const base = {
        q: T('En una bolsa hay <b>' + a + '</b> canicas rojas, <b>' + b + '</b> azules y <b>' + c + '</b> verdes. Se saca una sin mirar. ¿Cuál es la probabilidad de sacar una <b>' + which.t.es + '</b>?' +
             (asPct ? ' (en %)' : '<br><small class="muted">Escríbela como fracción simplificada</small>'),
             'Maisiņā ir <b>' + a + '</b> sarkanas, <b>' + b + '</b> zilas un <b>' + c + '</b> zaļas bumbiņas. Izvelk vienu neskatoties. Kāda ir varbūtība izvilkt <b>' + which.t.lv + '</b>?' +
             (asPct ? ' (procentos)' : '<br><small class="muted">Uzraksti kā saīsinātu daļu</small>')),
        solution: [
          T('Casos posibles: ' + a + ' + ' + b + ' + ' + c + ' = ' + total, 'Iespējamie gadījumi: ' + a + ' + ' + b + ' + ' + c + ' = ' + total),
          T('Casos favorables: ' + which.n, 'Labvēlīgie gadījumi: ' + which.n),
          T('P = ' + fr(which.n, total) + ' = ' + MM.fr(f) + (f.terminates() ? ' = ' + MM.n(f.v) + ' = ' + MM.n(f.v * 100) + ' %' : ''),
            'P = ' + fr(which.n, total) + ' = ' + MM.fr(f) + (f.terminates() ? ' = ' + MM.n(f.v) + ' = ' + MM.n(f.v * 100) + ' %' : ''))
        ],
        hint: T('P = casos favorables : casos posibles', 'P = labvēlīgie gadījumi : visi iespējamie gadījumi')
      };
      if (asPct) return Object.assign(base, { answerType: 'num', answer: String(f.v * 100), unit: '%' });
      return Object.assign(base, G.frac(f));
    }
  });

  reg('sta.chart', {
    topic: 'sta', level: 2, part: 'A', name: T('Leer un diagrama de barras', 'Stabiņu diagrammas lasīšana'),
    make(rng) {
      const daysEs = ['L', 'M', 'X', 'J', 'V'], daysLv = ['P', 'O', 'T', 'C', 'Pk'];
      const vals = Array.from({ length: 5 }, () => rng.int(2, 20) * (rng.chance(0.3) ? 5 : 1));
      const total = vals.reduce((a, b) => a + b, 0);
      const maxI = vals.indexOf(Math.max.apply(null, vals));
      const minI = vals.indexOf(Math.min.apply(null, vals));
      const ask = rng.int(1, 3);
      const thing = rng.pick([T('libros leídos', 'izlasītās grāmatas'), T('kilómetros recorridos', 'nobrauktie kilometri'), T('vasos de agua', 'ūdens glāzes')]);
      const chartEs = barChart(daysEs, vals, thing.es), chartLv = barChart(daysLv, vals, thing.lv);
      let qEs, qLv, ans, sol;
      if (ask === 1) {
        ans = total;
        qEs = 'El diagrama muestra los ' + thing.es + ' de cada día. ¿Cuántos hay en total en los 5 días?';
        qLv = 'Diagramma rāda ' + thing.lv + ' katrā dienā. Cik kopā piecās dienās?';
        sol = [T(vals.join(' + ') + ' = <b>' + total + '</b>', vals.join(' + ') + ' = <b>' + total + '</b>')];
      } else if (ask === 2) {
        ans = vals[maxI] - vals[minI];
        qEs = 'El diagrama muestra los ' + thing.es + ' de cada día. ¿Cuál es la diferencia entre el día de más y el de menos?';
        qLv = 'Diagramma rāda ' + thing.lv + ' katrā dienā. Kāda ir starpība starp lielāko un mazāko dienu?';
        sol = [T('Máximo: ' + vals[maxI] + ' &nbsp; Mínimo: ' + vals[minI], 'Lielākais: ' + vals[maxI] + ' &nbsp; Mazākais: ' + vals[minI]),
               T(vals[maxI] + ' − ' + vals[minI] + ' = <b>' + ans + '</b>', vals[maxI] + ' − ' + vals[minI] + ' = <b>' + ans + '</b>')];
      } else {
        ans = Math.round(total / 5 * 100) / 100;
        qEs = 'El diagrama muestra los ' + thing.es + ' de cada día. ¿Cuál es la media diaria?';
        qLv = 'Diagramma rāda ' + thing.lv + ' katrā dienā. Kāds ir dienas vidējais?';
        sol = [T('Suma: ' + vals.join(' + ') + ' = ' + total, 'Summa: ' + vals.join(' + ') + ' = ' + total),
               T(total + ' : 5 = <b>' + MM.n(ans) + '</b>', total + ' : 5 = <b>' + MM.n(ans) + '</b>')];
      }
      return {
        q: T(qEs + '<div>' + chartEs + '</div>', qLv + '<div>' + chartLv + '</div>'),
        answerType: 'num', answer: String(ans), tol: 0.005,
        solution: [T('Se leen las alturas: ' + vals.join(', '), 'Nolasa stabiņu augstumus: ' + vals.join('; '))].concat(sol),
        hint: T('Lee con cuidado la escala del eje vertical.', 'Uzmanīgi izlasi vertikālās ass skalu.')
      };
    }
  });

  /* =====================================================
     TEMA 10 · LENGUAJE MATEMÁTICO Y ECUACIONES
     ===================================================== */

  reg('lang.missing', {
    topic: 'lang', level: 1, part: 'A', name: T('Término desconocido', 'Nezināmais loceklis'),
    make(rng) {
      const kind = rng.int(1, 6);
      const a = rng.int(2, 30), x = rng.int(2, 40);
      let q, ans, sol;
      if (kind === 1) { ans = x; q = 'x + ' + a + ' = ' + (x + a);
        sol = [T('x = suma − sumando = ' + (x + a) + ' − ' + a + ' = <b>' + x + '</b>', 'x = summa − saskaitāmais = ' + (x + a) + ' − ' + a + ' = <b>' + x + '</b>')]; }
      else if (kind === 2) { ans = x; q = 'x − ' + a + ' = ' + (x - a);
        sol = [T('x = diferencia + sustraendo = ' + (x - a) + ' + ' + a + ' = <b>' + x + '</b>', 'x = starpība + mazinātājs = ' + (x - a) + ' + ' + a + ' = <b>' + x + '</b>')]; }
      else if (kind === 3) { const big = x + a; ans = a; q = big + ' − x = ' + x;
        sol = [T('x = minuendo − diferencia = ' + big + ' − ' + x + ' = <b>' + a + '</b>', 'x = mazināmais − starpība = ' + big + ' − ' + x + ' = <b>' + a + '</b>')]; }
      else if (kind === 4) { const k = rng.int(2, 12); ans = x; q = 'x · ' + k + ' = ' + (x * k);
        sol = [T('x = producto : factor = ' + (x * k) + ' : ' + k + ' = <b>' + x + '</b>', 'x = reizinājums : reizinātājs = ' + (x * k) + ' : ' + k + ' = <b>' + x + '</b>')]; }
      else if (kind === 5) { const d = rng.pick([2, 3, 4, 5]); ans = x * d; q = 'x : ' + d + ' = ' + x;
        sol = [T('x = cociente · divisor = ' + x + ' · ' + d + ' = <b>' + (x * d) + '</b>', 'x = dalījums · dalītājs = ' + x + ' · ' + d + ' = <b>' + (x * d) + '</b>')]; }
      else { const d = rng.pick([2, 3, 4, 5, 6]); const big = d * rng.int(2, 12); ans = big / (big / d); q = big + ' : x = ' + (big / d);
        sol = [T('x = dividendo : cociente = ' + big + ' : ' + (big / d) + ' = <b>' + d + '</b>', 'x = dalāmais : dalījums = ' + big + ' : ' + (big / d) + ' = <b>' + d + '</b>')];
        ans = d; }
      return {
        q: T('Halla el término desconocido: <b>' + q + '</b>', 'Atrodi nezināmo darbības locekli: <b>' + q + '</b>'),
        answerType: 'num', answer: String(ans),
        solution: sol.concat([T('Comprobación: sustituye la x y mira si la igualdad se cumple.', 'Pārbaude: ievieto x un pārliecinies, vai vienādība izpildās.')]),
        hint: T('Piensa qué operación deshace la que aparece.', 'Padomā, kura darbība atceļ doto darbību.')
      };
    }
  });

  reg('lang.fracmissing', {
    topic: 'lang', level: 2, part: 'A', name: T('Desconocido con fracciones', 'Nezināmais ar daļām'),
    make(rng) {
      const d = rng.pick([2, 3, 4, 5, 6, 8]), nu = rng.chance(0.5) ? 1 : rng.int(2, d - 1);
      const f = F(nu, d);
      const res = rng.int(3, 25);
      const kind = rng.chance(0.5);
      if (kind) {
        const x = f.mul(F(res, 1));
        return Object.assign({
          q: T('Halla <b>x</b>: &nbsp; x : ' + MM.fr(f) + ' = ' + res, 'Atrodi <b>x</b>: &nbsp; x : ' + MM.fr(f) + ' = ' + res),
          solution: [
            T('x = cociente · divisor = ' + res + ' · ' + MM.fr(f), 'x = dalījums · dalītājs = ' + res + ' · ' + MM.fr(f)),
            T('x = <b>' + MM.fr(x, { mixed: true }) + '</b>', 'x = <b>' + MM.fr(x, { mixed: true }) + '</b>'),
            T('Comprobación: ' + MM.fr(x, { mixed: true }) + ' : ' + MM.fr(f) + ' = ' + MM.fr(x.div(f), { mixed: true }) + ' ✓',
              'Pārbaude: ' + MM.fr(x, { mixed: true }) + ' : ' + MM.fr(f) + ' = ' + MM.fr(x.div(f), { mixed: true }) + ' ✓')
          ]
        }, G.frac(x, true));
      }
      const x = F(res, 1).div(f);
      return Object.assign({
        q: T('Halla <b>x</b>: &nbsp; x · ' + MM.fr(f) + ' = ' + res, 'Atrodi <b>x</b>: &nbsp; x · ' + MM.fr(f) + ' = ' + res),
        solution: [
          T('x = producto : factor = ' + res + ' : ' + MM.fr(f) + ' = ' + res + ' · ' + MM.fr(f.inv()),
            'x = reizinājums : reizinātājs = ' + res + ' : ' + MM.fr(f) + ' = ' + res + ' · ' + MM.fr(f.inv())),
          T('x = <b>' + MM.fr(x, { mixed: true }) + '</b>', 'x = <b>' + MM.fr(x, { mixed: true }) + '</b>')
        ]
      }, G.frac(x, true));
    }
  });

  reg('lang.linear', {
    topic: 'lang', level: 2, part: 'A', name: T('Ecuación de dos pasos', 'Divsoļu vienādojums'),
    make(rng) {
      const a = rng.int(2, 9), x = rng.int(2, 20), b = rng.int(3, 30);
      const plus = rng.chance(0.5);
      const c = plus ? a * x + b : a * x - b;
      return {
        q: T('Resuelve: <b>' + a + 'x ' + (plus ? '+' : '−') + ' ' + b + ' = ' + c + '</b>',
             'Atrisini: <b>' + a + 'x ' + (plus ? '+' : '−') + ' ' + b + ' = ' + c + '</b>'),
        answerType: 'num', answer: String(x),
        solution: [
          T('Se deshace primero la suma/resta: ' + a + 'x = ' + c + ' ' + (plus ? '−' : '+') + ' ' + b + ' = ' + (a * x),
            'Vispirms atceļ saskaitīšanu/atņemšanu: ' + a + 'x = ' + c + ' ' + (plus ? '−' : '+') + ' ' + b + ' = ' + (a * x)),
          T('Después la multiplicación: x = ' + (a * x) + ' : ' + a + ' = <b>' + x + '</b>',
            'Tad reizināšanu: x = ' + (a * x) + ' : ' + a + ' = <b>' + x + '</b>'),
          T('Comprobación: ' + a + ' · ' + x + ' ' + (plus ? '+' : '−') + ' ' + b + ' = ' + c + ' ✓',
            'Pārbaude: ' + a + ' · ' + x + ' ' + (plus ? '+' : '−') + ' ' + b + ' = ' + c + ' ✓')
        ],
        hint: T('Deshaz las operaciones en orden inverso.', 'Atceļ darbības apgrieztā secībā.')
      };
    }
  });

  reg('lang.translate', {
    topic: 'lang', level: 2, part: 'B', points: 3, name: T('Traducir un enunciado', 'Teksta pārtulkošana'),
    make(rng) {
      const k = rng.int(2, 6), b = rng.int(3, 20), x = rng.int(2, 20);
      const res = k * x - b;
      const word = k === 2 ? T('el doble', 'divkāršs') : (k === 3 ? T('el triple', 'trīskāršs') : T(k + ' veces', k + ' reizes vairāk'));
      return {
        q: T('Si a ' + word.es + ' de un número le restas <b>' + b + '</b>, obtienes <b>' + res + '</b>. ¿Cuál es el número?',
             'Ja no skaitļa ' + (k === 2 ? 'divkārša' : (k === 3 ? 'trīskārša' : k + ' reizes lielāka')) + ' atņem <b>' + b + '</b>, iegūst <b>' + res + '</b>. Kāds ir šis skaitlis?'),
        answerType: 'num', answer: String(x), points: 3,
        solution: [
          T('Se traduce: ' + k + 'x − ' + b + ' = ' + res, 'Pieraksta matemātiski: ' + k + 'x − ' + b + ' = ' + res),
          T(k + 'x = ' + res + ' + ' + b + ' = ' + (k * x), k + 'x = ' + res + ' + ' + b + ' = ' + (k * x)),
          T('x = ' + (k * x) + ' : ' + k + ' = <b>' + x + '</b>', 'x = ' + (k * x) + ' : ' + k + ' = <b>' + x + '</b>'),
          T('Comprobación: ' + k + ' · ' + x + ' − ' + b + ' = ' + res + ' ✓', 'Pārbaude: ' + k + ' · ' + x + ' − ' + b + ' = ' + res + ' ✓')
        ]
      };
    }
  });

  reg('lang.consecutive', {
    topic: 'lang', level: 2, part: 'A', name: T('Números consecutivos', 'Secīgi skaitļi'),
    make(rng) {
      const x = rng.int(8, 60);
      const three = rng.chance(0.35);
      const sum = three ? 3 * x + 3 : 2 * x + 1;
      return {
        q: T('La suma de ' + (three ? 'tres' : 'dos') + ' números naturales consecutivos es <b>' + sum + '</b>. ¿Cuál es el <b>menor</b>?',
             (three ? 'Trīs' : 'Divu') + ' secīgu naturālu skaitļu summa ir <b>' + sum + '</b>. Kurš ir <b>mazākais</b>?'),
        answerType: 'num', answer: String(x),
        solution: [
          T('Se llama x al menor: ' + (three ? 'x + (x+1) + (x+2) = ' + sum : 'x + (x+1) = ' + sum),
            'Mazāko apzīmē ar x: ' + (three ? 'x + (x+1) + (x+2) = ' + sum : 'x + (x+1) = ' + sum)),
          T((three ? '3x + 3 = ' + sum + ' → 3x = ' + (sum - 3) + ' → x = ' + x : '2x + 1 = ' + sum + ' → 2x = ' + (sum - 1) + ' → x = ' + x),
            (three ? '3x + 3 = ' + sum + ' → 3x = ' + (sum - 3) + ' → x = ' + x : '2x + 1 = ' + sum + ' → 2x = ' + (sum - 1) + ' → x = ' + x)),
          T('Los números son ' + (three ? x + ', ' + (x + 1) + ' y ' + (x + 2) : x + ' y ' + (x + 1)) + '.',
            'Skaitļi ir ' + (three ? x + '; ' + (x + 1) + '; ' + (x + 2) : x + ' un ' + (x + 1)) + '.')
        ],
        hint: T('Llama x al más pequeño; el siguiente es x + 1.', 'Mazāko apzīmē ar x; nākamais ir x + 1.')
      };
    }
  });

  reg('lang.ages', {
    topic: 'lang', level: 2, part: 'B', points: 3, name: T('Problema de edades', 'Vecuma uzdevums'),
    make(rng) {
      const nm = G.names(rng, 2);
      const diff = rng.int(2, 12), young = rng.int(6, 40);
      const sum = 2 * young + diff;
      return {
        q: T(nm[0] + ' tiene <b>' + diff + ' años más</b> que ' + nm[1] + ', y entre los dos suman <b>' + sum + ' años</b>. ¿Cuántos años tiene ' + nm[1] + '?',
             nm[0] + ' ir par <b>' + diff + ' gadiem vecāk(s)</b> nekā ' + nm[1] + ', un kopā viņiem ir <b>' + sum + ' gadi</b>. Cik gadu ir ' + nm[1] + '?'),
        answerType: 'num', answer: String(young), points: 3,
        solution: [
          T('Se llama x a la edad del más joven (' + nm[1] + '): ' + nm[0] + ' tiene x + ' + diff + '.',
            'Jaunākā (' + nm[1] + ') vecumu apzīmē ar x: ' + nm[0] + ' vecums ir x + ' + diff + '.'),
          T('x + (x + ' + diff + ') = ' + sum + ' → 2x + ' + diff + ' = ' + sum, 'x + (x + ' + diff + ') = ' + sum + ' → 2x + ' + diff + ' = ' + sum),
          T('2x = ' + (sum - diff) + ' → x = <b>' + young + '</b>', '2x = ' + (sum - diff) + ' → x = <b>' + young + '</b>'),
          T(nm[1] + ': ' + young + ' años · ' + nm[0] + ': ' + (young + diff) + ' años. Comprobación: ' + young + ' + ' + (young + diff) + ' = ' + sum + ' ✓',
            nm[1] + ': ' + young + ' gadi · ' + nm[0] + ': ' + (young + diff) + ' gadi. Pārbaude: ' + young + ' + ' + (young + diff) + ' = ' + sum + ' ✓')
        ],
        hint: T('Llama x a la cantidad más pequeña.', 'Ar x apzīmē mazāko lielumu.')
      };
    }
  });

  reg('lang.marbles', {
    topic: 'lang', level: 3, part: 'B', points: 4, name: T('Dar y quedar igual', 'Iedot un izlīdzināt'),
    make(rng) {
      const k = rng.pick([2, 3, 4]);
      const give = rng.int(3, 12);
      const small = 2 * give / (k - 1);
      if (!Number.isInteger(small)) return this.make(MM.rng(rng.int(1, 1e6)));
      const nm = G.names(rng, 2);
      const big = k * small;
      return {
        q: T(nm[0] + ' tiene <b>' + (k === 2 ? 'el doble' : (k === 3 ? 'el triple' : k + ' veces más')) + '</b> canicas que ' + nm[1] + '. Si ' + nm[0] + ' le da <b>' + give + '</b> canicas, los dos tienen las mismas. ¿Cuántas canicas tenía ' + nm[1] + '?',
             nm[0] + ' ir <b>' + k + ' reizes vairāk</b> bumbiņu nekā ' + nm[1] + '. Ja ' + nm[0] + ' iedod <b>' + give + '</b> bumbiņas, abiem ir vienāds skaits. Cik bumbiņu bija ' + nm[1] + '?'),
        answerType: 'num', answer: String(small), points: 4,
        solution: [
          T(nm[1] + ' = x, ' + nm[0] + ' = ' + k + 'x', nm[1] + ' = x, ' + nm[0] + ' = ' + k + 'x'),
          T('Después de dar ' + give + ': ' + k + 'x − ' + give + ' = x + ' + give,
            'Pēc ' + give + ' iedošanas: ' + k + 'x − ' + give + ' = x + ' + give),
          T((k - 1) + 'x = ' + (2 * give) + ' → x = <b>' + small + '</b>', (k - 1) + 'x = ' + (2 * give) + ' → x = <b>' + small + '</b>'),
          T(nm[1] + ' tenía ' + small + ' y ' + nm[0] + ' ' + big + '. Comprobación: ' + big + ' − ' + give + ' = ' + (big - give) + ' = ' + small + ' + ' + give + ' ✓',
            nm[1] + ' bija ' + small + ', ' + nm[0] + ' — ' + big + '. Pārbaude: ' + big + ' − ' + give + ' = ' + (big - give) + ' = ' + small + ' + ' + give + ' ✓')
        ],
        hint: T('Lo que uno da, el otro lo recibe: la diferencia cambia el doble.',
                'Ko viens iedod, to otrs saņem: starpība mainās divkārt.')
      };
    }
  });

  reg('lang.words', {
    topic: 'lang', level: 1, part: 'A', name: T('“Veces más” o “más que”', '“Reizes vairāk” vai “par ... vairāk”'),
    make(rng) {
      const y = rng.int(3, 20), k = rng.int(2, 6);
      const timesMore = rng.chance(0.5);
      const correct = timesMore ? k * y : y + k;
      const wrong = timesMore ? y + k : k * y;
      return Object.assign({
        q: T('Si <b>y = ' + y + '</b> y se dice que <b>x es ' + (timesMore ? k + ' veces mayor que y' : 'y más ' + k + ' unidades') + '</b>, ¿cuánto vale x?',
             'Ja <b>y = ' + y + '</b> un teikts, ka <b>x ir ' + (timesMore ? k + ' reizes lielāks nekā y' : 'par ' + k + ' lielāks nekā y') + '</b>, cik ir x?'),
        solution: [
          T(timesMore ? '“' + k + ' veces mayor” significa multiplicar: x = ' + k + ' · ' + y + ' = <b>' + correct + '</b>'
                      : '“' + k + ' unidades más” significa sumar: x = ' + y + ' + ' + k + ' = <b>' + correct + '</b>',
            timesMore ? '“' + k + ' reizes lielāks” nozīmē reizināt: x = ' + k + ' · ' + y + ' = <b>' + correct + '</b>'
                      : '“par ' + k + ' lielāks” nozīmē saskaitīt: x = ' + y + ' + ' + k + ' = <b>' + correct + '</b>'),
          T('Si fuera lo otro, saldría ' + wrong + '. Es la trampa clásica del examen.',
            'Otrā gadījumā iznāktu ' + wrong + '. Tas ir klasisks pārbaudījuma slazds.')
        ]
      }, G.mc(rng, String(correct), [String(wrong), String(correct + k), String(Math.abs(correct - y))].filter((v, i, arr) => v !== String(correct) && arr.indexOf(v) === i).slice(0, 3)));
    }
  });

})(typeof window !== 'undefined' ? window : globalThis);
