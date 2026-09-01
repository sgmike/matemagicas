/* =========================================================
   Generadores 11–13 · geometría plana, plano de coordenadas,
   cuerpos y volumen
   ========================================================= */
(function (global) {
  'use strict';
  const MM = global.MM, T = MM.T, F = (n, d) => MM.F(n, d);
  const G = MM.G, reg = (id, def) => MM.gen.register(id, def);

  /* ---------- dibujos auxiliares ---------- */
  function rowOfSquares(k) {
    const s = 26, W = k * s + 20, H = s + 24;
    let out = '<svg class="chart" style="max-width:' + Math.min(320, W * 1.4) + 'px" viewBox="0 0 ' + W + ' ' + H + '">';
    for (let i = 0; i < k; i++) {
      out += '<rect x="' + (10 + i * s) + '" y="10" width="' + s + '" height="' + s + '" fill="var(--violet-l)" stroke="var(--violet)" stroke-width="1.5"/>';
    }
    return out + '</svg>';
  }

  function lShape(a, b, c, d) {          // escalón: rectángulo a×b con un trozo c×d quitado
    const k = 90 / Math.max(a, b), W = a * k + 40, H = b * k + 40;
    const x0 = 20, y0 = 20;
    const pts = [
      [x0, y0], [x0 + a * k, y0], [x0 + a * k, y0 + (b - d) * k],
      [x0 + (a - c) * k, y0 + (b - d) * k], [x0 + (a - c) * k, y0 + b * k], [x0, y0 + b * k]
    ];
    let out = '<svg class="chart" style="max-width:260px" viewBox="0 0 ' + W + ' ' + H + '">';
    out += '<polygon points="' + pts.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ') + '" fill="var(--violet-l)" stroke="var(--violet)" stroke-width="2"/>';
    /* medidas: a arriba, b a la izquierda, c y d en el escalón */
    out += '<text x="' + (x0 + a * k / 2) + '" y="' + (y0 - 6) + '" text-anchor="middle">' + a + '</text>';
    out += '<text x="' + (x0 - 6) + '" y="' + (y0 + b * k / 2) + '" text-anchor="end">' + b + '</text>';
    out += '<text x="' + (x0 + (a - c / 2) * k) + '" y="' + (y0 + (b - d) * k + 14) + '" text-anchor="middle">' + c + '</text>';
    out += '<text x="' + (x0 + (a - c) * k + 5) + '" y="' + (y0 + (b - d / 2) * k + 4) + '">' + d + '</text>';
    return out + '</svg>';
  }

  function plane(points, R) {
    R = R || 6;
    const step = 22, pad = 18, size = 2 * R * step + 2 * pad;
    const cx = pad + R * step, cy = pad + R * step;
    let s = '<svg class="chart" style="max-width:290px" viewBox="0 0 ' + size + ' ' + size + '">';
    for (let i = -R; i <= R; i++) {
      s += '<line class="gl" x1="' + (cx + i * step) + '" y1="' + pad + '" x2="' + (cx + i * step) + '" y2="' + (size - pad) + '"/>';
      s += '<line class="gl" x1="' + pad + '" y1="' + (cy + i * step) + '" x2="' + (size - pad) + '" y2="' + (cy + i * step) + '"/>';
    }
    s += '<line class="ax" x1="' + pad + '" y1="' + cy + '" x2="' + (size - pad) + '" y2="' + cy + '"/>';
    s += '<line class="ax" x1="' + cx + '" y1="' + pad + '" x2="' + cx + '" y2="' + (size - pad) + '"/>';
    for (let i = -R; i <= R; i += 2) {
      if (i === 0) continue;
      s += '<text x="' + (cx + i * step) + '" y="' + (cy + 13) + '" text-anchor="middle">' + i + '</text>';
      s += '<text x="' + (cx - 6) + '" y="' + (cy - i * step + 4) + '" text-anchor="end">' + i + '</text>';
    }
    points.forEach(p => {
      s += '<circle class="pt" cx="' + (cx + p[0] * step) + '" cy="' + (cy - p[1] * step) + '" r="5"/>';
      if (p[2]) s += '<text x="' + (cx + p[0] * step + 8) + '" y="' + (cy - p[1] * step - 8) + '" font-weight="700">' + p[2] + '</text>';
    });
    return s + '</svg>';
  }

  /* =====================================================
     TEMA 11 · GEOMETRÍA PLANA
     ===================================================== */

  reg('geo.square', {
    topic: 'geo', level: 1, part: 'A', name: T('Cuadrado', 'Kvadrāts'),
    make(rng) {
      const side = rng.int(3, 25);
      const kind = rng.int(1, 3);
      if (kind === 1) {
        return {
          q: T('Un cuadrado tiene <b>' + side + ' cm</b> de lado. Calcula su perímetro y su área.',
               'Kvadrāta mala ir <b>' + side + ' cm</b>. Aprēķini perimetru un laukumu.'),
          fields: [
            { key: 'p', label: T('Perímetro', 'Perimetrs'), answerType: 'num', answer: String(4 * side), unit: 'cm' },
            { key: 'a', label: T('Área', 'Laukums'), answerType: 'num', answer: String(side * side), unit: 'cm²' }
          ],
          solution: [
            T('Perímetro = 4 · lado = 4 · ' + side + ' = <b>' + (4 * side) + ' cm</b>', 'Perimetrs = 4 · mala = 4 · ' + side + ' = <b>' + (4 * side) + ' cm</b>'),
            T('Área = lado² = ' + side + ' · ' + side + ' = <b>' + (side * side) + ' cm²</b>', 'Laukums = mala² = ' + side + ' · ' + side + ' = <b>' + (side * side) + ' cm²</b>')
          ]
        };
      }
      if (kind === 2) {
        return {
          q: T('El perímetro de un cuadrado es <b>' + (4 * side) + ' cm</b>. ¿Cuánto mide su área?',
               'Kvadrāta perimetrs ir <b>' + (4 * side) + ' cm</b>. Kāds ir tā laukums?'),
          answerType: 'num', answer: String(side * side), unit: 'cm²',
          solution: [
            T('Lado = perímetro : 4 = ' + (4 * side) + ' : 4 = ' + side + ' cm', 'Mala = perimetrs : 4 = ' + (4 * side) + ' : 4 = ' + side + ' cm'),
            T('Área = ' + side + '² = <b>' + (side * side) + ' cm²</b>', 'Laukums = ' + side + '² = <b>' + (side * side) + ' cm²</b>')
          ],
          hint: T('Primero halla el lado.', 'Vispirms atrodi malu.')
        };
      }
      const area = side * side;
      return {
        q: T('El área de un cuadrado es <b>' + area + ' cm²</b>. ¿Cuánto mide su perímetro?',
             'Kvadrāta laukums ir <b>' + area + ' cm²</b>. Kāds ir tā perimetrs?'),
        answerType: 'num', answer: String(4 * side), unit: 'cm',
        solution: [
          T('Se busca el número que multiplicado por sí mismo da ' + area + ': es ' + side + '.',
            'Meklē skaitli, kas reizināts ar sevi dod ' + area + ': tas ir ' + side + '.'),
          T('Perímetro = 4 · ' + side + ' = <b>' + (4 * side) + ' cm</b>', 'Perimetrs = 4 · ' + side + ' = <b>' + (4 * side) + ' cm</b>')
        ]
      };
    }
  });

  reg('geo.rect', {
    topic: 'geo', level: 1, part: 'A', name: T('Rectángulo', 'Taisnstūris'),
    make(rng) {
      const a = rng.int(3, 25), b = rng.int(2, 20);
      const kind = rng.int(1, 3);
      if (kind === 1) {
        return {
          q: T('Un rectángulo mide <b>' + a + ' cm</b> de largo y <b>' + b + ' cm</b> de ancho. Calcula el perímetro y el área.',
               'Taisnstūra garums ir <b>' + a + ' cm</b>, platums <b>' + b + ' cm</b>. Aprēķini perimetru un laukumu.'),
          fields: [
            { key: 'p', label: T('Perímetro', 'Perimetrs'), answerType: 'num', answer: String(2 * (a + b)), unit: 'cm' },
            { key: 'a', label: T('Área', 'Laukums'), answerType: 'num', answer: String(a * b), unit: 'cm²' }
          ],
          solution: [
            T('Perímetro = 2 · (' + a + ' + ' + b + ') = 2 · ' + (a + b) + ' = <b>' + (2 * (a + b)) + ' cm</b>',
              'Perimetrs = 2 · (' + a + ' + ' + b + ') = 2 · ' + (a + b) + ' = <b>' + (2 * (a + b)) + ' cm</b>'),
            T('Área = ' + a + ' · ' + b + ' = <b>' + (a * b) + ' cm²</b>', 'Laukums = ' + a + ' · ' + b + ' = <b>' + (a * b) + ' cm²</b>')
          ]
        };
      }
      if (kind === 2) {
        const area = a * b;
        return {
          q: T('El área de un rectángulo es <b>' + area + ' cm²</b> y su ancho es <b>' + b + ' cm</b>. Halla su perímetro.',
               'Taisnstūra laukums ir <b>' + area + ' cm²</b>, platums <b>' + b + ' cm</b>. Atrodi perimetru.'),
          answerType: 'num', answer: String(2 * (a + b)), unit: 'cm',
          solution: [
            T('Largo = área : ancho = ' + area + ' : ' + b + ' = ' + a + ' cm', 'Garums = laukums : platums = ' + area + ' : ' + b + ' = ' + a + ' cm'),
            T('Perímetro = 2 · (' + a + ' + ' + b + ') = <b>' + (2 * (a + b)) + ' cm</b>', 'Perimetrs = 2 · (' + a + ' + ' + b + ') = <b>' + (2 * (a + b)) + ' cm</b>')
          ]
        };
      }
      const w = rng.int(3, 14), k = rng.pick([2, 3]);
      const per = 2 * (w + k * w);
      return {
        q: T('Un rectángulo tiene <b>' + per + ' cm</b> de perímetro y el largo es <b>' + (k === 2 ? 'el doble' : 'el triple') + '</b> del ancho. ¿Cuál es su área?',
             'Taisnstūra perimetrs ir <b>' + per + ' cm</b>, un garums ir <b>' + k + ' reizes</b> lielāks par platumu. Kāds ir tā laukums?'),
        answerType: 'num', answer: String(w * k * w), unit: 'cm²', level: 3,
        solution: [
          T('Ancho = x, largo = ' + k + 'x → 2 · (x + ' + k + 'x) = ' + per, 'Platums = x, garums = ' + k + 'x → 2 · (x + ' + k + 'x) = ' + per),
          T(2 * (k + 1) + 'x = ' + per + ' → x = ' + w + ' cm', 2 * (k + 1) + 'x = ' + per + ' → x = ' + w + ' cm'),
          T('Lados: ' + w + ' cm y ' + (k * w) + ' cm → Área = <b>' + (w * k * w) + ' cm²</b>',
            'Malas: ' + w + ' cm un ' + (k * w) + ' cm → Laukums = <b>' + (w * k * w) + ' cm²</b>')
        ],
        hint: T('Llama x al ancho y escribe el perímetro con x.', 'Platumu apzīmē ar x un pieraksti perimetru ar x.')
      };
    }
  });

  reg('geo.squaresrow', {
    topic: 'geo', level: 2, part: 'A', name: T('Cuadrados en fila', 'Kvadrāti rindā'),
    make(rng) {
      const k = rng.int(3, 6), per = rng.pick([8, 12, 16, 20, 24]);
      const side = per / 4;
      const long = k * side;
      const rectPer = 2 * (long + side);
      return {
        q: T('El perímetro de cada cuadrado pequeño es <b>' + per + ' cm</b>. Se colocan <b>' + k + '</b> cuadrados iguales en fila formando un rectángulo. ¿Cuál es el perímetro del rectángulo?' + rowOfSquares(k),
             'Katra mazā kvadrāta perimetrs ir <b>' + per + ' cm</b>. <b>' + k + '</b> vienādi kvadrāti novietoti rindā, veidojot taisnstūri. Kāds ir taisnstūra perimetrs?' + rowOfSquares(k)),
        fields: [
          { key: 'p', label: T('Perímetro', 'Perimetrs'), answerType: 'num', answer: String(rectPer), unit: 'cm' },
          { key: 'a', label: T('Área', 'Laukums'), answerType: 'num', answer: String(long * side), unit: 'cm²' }
        ],
        solution: [
          T('Lado del cuadrado = ' + per + ' : 4 = ' + MM.n(side) + ' cm', 'Kvadrāta mala = ' + per + ' : 4 = ' + MM.n(side) + ' cm'),
          T('El rectángulo mide ' + k + ' · ' + MM.n(side) + ' = ' + MM.n(long) + ' cm de largo y ' + MM.n(side) + ' cm de ancho.',
            'Taisnstūra garums ' + k + ' · ' + MM.n(side) + ' = ' + MM.n(long) + ' cm, platums ' + MM.n(side) + ' cm.'),
          T('Perímetro = 2 · (' + MM.n(long) + ' + ' + MM.n(side) + ') = <b>' + MM.n(rectPer) + ' cm</b>',
            'Perimetrs = 2 · (' + MM.n(long) + ' + ' + MM.n(side) + ') = <b>' + MM.n(rectPer) + ' cm</b>'),
          T('Área = ' + MM.n(long) + ' · ' + MM.n(side) + ' = <b>' + MM.n(long * side) + ' cm²</b>',
            'Laukums = ' + MM.n(long) + ' · ' + MM.n(side) + ' = <b>' + MM.n(long * side) + ' cm²</b>'),
          T('Error típico: multiplicar el perímetro del cuadrado por ' + k + '. Los lados interiores no cuentan.',
            'Tipiska kļūda: reizināt kvadrāta perimetru ar ' + k + '. Iekšējās malas neskaitās.')
        ],
        hint: T('Dibuja el rectángulo y mira qué lados quedan por fuera.', 'Uzzīmē taisnstūri un paskaties, kuras malas paliek ārpusē.')
      };
    }
  });

  reg('geo.triangle', {
    topic: 'geo', level: 1, part: 'A', name: T('Triángulos', 'Trijstūri'),
    make(rng) {
      const kind = rng.int(1, 3);
      if (kind === 1) {
        const a = rng.int(20, 100), b = rng.int(20, 150 - a);
        return {
          q: T('Dos ángulos de un triángulo miden <b>' + a + '°</b> y <b>' + b + '°</b>. ¿Cuánto mide el tercero?',
               'Divi trijstūra leņķi ir <b>' + a + '°</b> un <b>' + b + '°</b>. Cik liels ir trešais?'),
          answerType: 'num', answer: String(180 - a - b), unit: '°',
          solution: [
            T('Los tres ángulos de un triángulo suman 180°.', 'Trijstūra leņķu summa ir 180°.'),
            T('180 − ' + a + ' − ' + b + ' = <b>' + (180 - a - b) + '°</b>', '180 − ' + a + ' − ' + b + ' = <b>' + (180 - a - b) + '°</b>')
          ]
        };
      }
      const base = rng.int(4, 24), h = rng.pick([2, 4, 6, 8, 10, 12, 5, 7]);
      if (kind === 2) {
        return {
          q: T('Un triángulo tiene una base de <b>' + base + ' cm</b> y una altura de <b>' + h + ' cm</b>. ¿Cuál es su área?',
               'Trijstūra pamats ir <b>' + base + ' cm</b>, augstums <b>' + h + ' cm</b>. Kāds ir tā laukums?'),
          answerType: 'num', answer: String(base * h / 2), unit: 'cm²',
          solution: [
            T('Área = (base · altura) : 2', 'Laukums = (pamats · augstums) : 2'),
            T('(' + base + ' · ' + h + ') : 2 = ' + (base * h) + ' : 2 = <b>' + MM.n(base * h / 2) + ' cm²</b>',
              '(' + base + ' · ' + h + ') : 2 = ' + (base * h) + ' : 2 = <b>' + MM.n(base * h / 2) + ' cm²</b>')
          ]
        };
      }
      const area = base * h / 2;
      return {
        q: T('El área de un triángulo es <b>' + MM.n(area) + ' cm²</b> y su base mide <b>' + base + ' cm</b>. ¿Cuál es su altura?',
             'Trijstūra laukums ir <b>' + MM.n(area) + ' cm²</b>, pamats <b>' + base + ' cm</b>. Kāds ir augstums?'),
        answerType: 'num', answer: String(h), unit: 'cm',
        solution: [
          T('Del área: altura = (2 · área) : base', 'No laukuma: augstums = (2 · laukums) : pamats'),
          T('(2 · ' + MM.n(area) + ') : ' + base + ' = ' + MM.n(2 * area) + ' : ' + base + ' = <b>' + h + ' cm</b>',
            '(2 · ' + MM.n(area) + ') : ' + base + ' = ' + MM.n(2 * area) + ' : ' + base + ' = <b>' + h + ' cm</b>')
        ],
        hint: T('No olvides el 2 que viene de dividir entre 2.', 'Neaizmirsti reizinātāju 2, kas rodas no dalīšanas ar 2.')
      };
    }
  });

  reg('geo.angletype', {
    topic: 'geo', level: 1, part: 'A', name: T('Tipos de ángulo', 'Leņķu veidi'),
    make(rng) {
      const a = rng.pick([15, 30, 45, 60, 75, 89, 90, 95, 110, 125, 150, 179, 180]);
      const kinds = [
        { t: T('agudo (šaurleņķis)', 'šaurs leņķis'), ok: a < 90 },
        { t: T('recto (taisns leņķis)', 'taisns leņķis'), ok: a === 90 },
        { t: T('obtuso (platleņķis)', 'plats leņķis'), ok: a > 90 && a < 180 },
        { t: T('llano (izstiepts leņķis)', 'izstiepts leņķis'), ok: a === 180 }
      ];
      const good = kinds.find(k => k.ok);
      const bads = kinds.filter(k => !k.ok).map(k => k.t);
      return Object.assign({
        q: T('¿Qué tipo de ángulo es uno de <b>' + a + '°</b>?', 'Kāda veida leņķis ir <b>' + a + '°</b>?'),
        solution: [
          T('Agudo &lt; 90° · recto = 90° · obtuso entre 90° y 180° · llano = 180°',
            'Šaurs &lt; 90° · taisns = 90° · plats no 90° līdz 180° · izstiepts = 180°'),
          T(a + '° → <b>' + good.t.es + '</b>', a + '° → <b>' + good.t.lv + '</b>')
        ]
      }, G.mc(rng, good.t, bads));
    }
  });

  reg('geo.circle', {
    topic: 'geo', level: 2, part: 'A', name: T('Circunferencia y círculo', 'Riņķa līnija un riņķis'),
    make(rng) {
      const r = rng.int(2, 20);
      const useD = rng.chance(0.4);
      const d = 2 * r;
      const circ = Math.round(3.14 * d * 100) / 100;
      const area = Math.round(3.14 * r * r * 100) / 100;
      const askArea = rng.chance(0.45);
      return {
        q: T('Un círculo tiene ' + (useD ? 'un diámetro de <b>' + d + ' cm</b>' : 'un radio de <b>' + r + ' cm</b>') + '. Calcula ' + (askArea ? 'su <b>área</b>' : 'la <b>longitud de la circunferencia</b>') + '. Usa π ≈ 3,14.',
             'Riņķa ' + (useD ? 'diametrs ir <b>' + d + ' cm</b>' : 'rādiuss ir <b>' + r + ' cm</b>') + '. Aprēķini ' + (askArea ? 'tā <b>laukumu</b>' : '<b>riņķa līnijas garumu</b>') + '. Lieto π ≈ 3,14.'),
        answerType: 'num', answer: String(askArea ? area : circ), unit: askArea ? 'cm²' : 'cm', tol: 0.02,
        solution: [
          useD ? T('Radio = diámetro : 2 = ' + d + ' : 2 = ' + r + ' cm', 'Rādiuss = diametrs : 2 = ' + d + ' : 2 = ' + r + ' cm')
               : T('Diámetro = 2 · radio = ' + d + ' cm', 'Diametrs = 2 · rādiuss = ' + d + ' cm'),
          askArea ? T('Área = π · r² = 3,14 · ' + r + '² = 3,14 · ' + (r * r) + ' = <b>' + MM.n(area) + ' cm²</b>',
                      'Laukums = π · r² = 3,14 · ' + r + '² = 3,14 · ' + (r * r) + ' = <b>' + MM.n(area) + ' cm²</b>')
                  : T('Longitud = π · d = 3,14 · ' + d + ' = <b>' + MM.n(circ) + ' cm</b>',
                      'Garums = π · d = 3,14 · ' + d + ' = <b>' + MM.n(circ) + ' cm</b>')
        ],
        hint: T('Longitud = π · diámetro. Área = π · radio².', 'Garums = π · diametrs. Laukums = π · rādiuss².')
      };
    }
  });

  reg('geo.compound', {
    topic: 'geo', level: 3, part: 'B', points: 3, name: T('Figura compuesta', 'Salikta figūra'),
    make(rng) {
      const a = rng.int(6, 14), b = rng.int(5, 12);
      const c = rng.int(2, a - 2), d = rng.int(2, b - 2);
      const area = a * b - c * d;
      const per = 2 * (a + b);
      return {
        q: T('Calcula el <b>área</b> y el <b>perímetro</b> de esta figura (medidas en cm).' + lShape(a, b, c, d),
             'Aprēķini šīs figūras <b>laukumu</b> un <b>perimetru</b> (izmēri centimetros).' + lShape(a, b, c, d)),
        fields: [
          { key: 'a', label: T('Área', 'Laukums'), answerType: 'num', answer: String(area), unit: 'cm²' },
          { key: 'p', label: T('Perímetro', 'Perimetrs'), answerType: 'num', answer: String(per), unit: 'cm' }
        ],
        points: 3,
        solution: [
          T('Se completa el rectángulo grande: ' + a + ' · ' + b + ' = ' + (a * b) + ' cm²',
            'Papildina līdz lielam taisnstūrim: ' + a + ' · ' + b + ' = ' + (a * b) + ' cm²'),
          T('Se quita el trozo que falta: ' + c + ' · ' + d + ' = ' + (c * d) + ' cm²',
            'Atņem izgriezto daļu: ' + c + ' · ' + d + ' = ' + (c * d) + ' cm²'),
          T('Área = ' + (a * b) + ' − ' + (c * d) + ' = <b>' + area + ' cm²</b>', 'Laukums = ' + (a * b) + ' − ' + (c * d) + ' = <b>' + area + ' cm²</b>'),
          T('Para el perímetro, los dos trozos del escalón “se deslizan” y forman el rectángulo completo: 2 · (' + a + ' + ' + b + ') = <b>' + per + ' cm</b>',
            'Perimetram pakāpiena malas “pārbīdās” un veido pilnu taisnstūri: 2 · (' + a + ' + ' + b + ') = <b>' + per + ' cm</b>')
        ],
        hint: T('Divide la figura en dos rectángulos, o completa el grande y resta.',
                'Sadali figūru divos taisnstūros vai papildini līdz lielam un atņem.')
      };
    }
  });

  /* =====================================================
     TEMA 12 · PLANO DE COORDENADAS
     ===================================================== */

  reg('coo.quadrant', {
    topic: 'coo', level: 1, part: 'A', name: T('Cuadrantes', 'Kvadranti'),
    make(rng) {
      const zero = rng.chance(0.22);
      const x = zero && rng.chance(0.5) ? 0 : rng.int(1, 6) * rng.sign();
      const y = zero && x !== 0 ? 0 : (zero ? rng.int(1, 6) * rng.sign() : rng.int(1, 6) * rng.sign());
      const quad = (x === 0 || y === 0) ? 0 : (x > 0 ? (y > 0 ? 1 : 4) : (y > 0 ? 2 : 3));
      const labels = { 0: T('sobre un eje (en ningún cuadrante)', 'uz ass (nevienā kvadrantā)'), 1: 'I', 2: 'II', 3: 'III', 4: 'IV' };
      const correct = quad === 0 ? labels[0] : T('Cuadrante ' + labels[quad], quad + '. kvadrants');
      const wrongs = [1, 2, 3, 4].filter(k => k !== quad).slice(0, 3).map(k => T('Cuadrante ' + labels[k], k + '. kvadrants'));
      if (quad !== 0) wrongs[2] = labels[0];
      return Object.assign({
        q: T('¿En qué cuadrante está el punto <b>(' + MM.n(x) + '; ' + MM.n(y) + ')</b>?' + plane([[x, y, 'P']]),
             'Kurā kvadrantā atrodas punkts <b>(' + MM.n(x) + '; ' + MM.n(y) + ')</b>?' + plane([[x, y, 'P']])),
        solution: [
          T('Se mira el signo de cada coordenada: x = ' + MM.n(x) + ', y = ' + MM.n(y),
            'Skatās katras koordinātas zīmi: x = ' + MM.n(x) + ', y = ' + MM.n(y)),
          quad === 0 ? T('Como una coordenada es 0, el punto está <b>sobre un eje</b>, no en un cuadrante.',
                         'Tā kā viena koordināta ir 0, punkts atrodas <b>uz ass</b>, nevis kvadrantā.')
                     : T('I: (+;+) · II: (−;+) · III: (−;−) · IV: (+;−) → <b>cuadrante ' + labels[quad] + '</b>',
                         'I: (+;+) · II: (−;+) · III: (−;−) · IV: (+;−) → <b>' + labels[quad] + '. kvadrants</b>')
        ]
      }, G.mc(rng, correct, wrongs));
    }
  });

  reg('coo.read', {
    topic: 'coo', level: 1, part: 'A', name: T('Leer coordenadas', 'Koordinātu nolasīšana'),
    make(rng) {
      const x = rng.int(-5, 5), y = rng.int(-5, 5);
      return {
        q: T('¿Cuáles son las coordenadas del punto <b>A</b>?' + plane([[x, y, 'A']]),
             'Kādas ir punkta <b>A</b> koordinātas?' + plane([[x, y, 'A']])),
        fields: [
          { key: 'x', label: 'x', answerType: 'num', answer: String(x) },
          { key: 'y', label: 'y', answerType: 'num', answer: String(y) }
        ],
        solution: [
          T('Primero se camina en horizontal: x = <b>' + x + '</b>', 'Vispirms iet horizontāli: x = <b>' + x + '</b>'),
          T('Después en vertical: y = <b>' + y + '</b>', 'Tad vertikāli: y = <b>' + y + '</b>'),
          T('El punto es A(' + x + '; ' + y + ').', 'Punkts ir A(' + x + '; ' + y + ').')
        ],
        hint: T('Primero se camina, después se sube.', 'Vispirms iet, tad kāpj.')
      };
    }
  });

  reg('coo.robot', {
    topic: 'coo', level: 2, part: 'B', points: 4, name: T('El robot en el plano', 'Robots koordinātu plaknē'),
    make(rng) {
      const moves = [];
      const dirs = [
        { d: 'r', es: 'a la derecha', lv: 'pa labi', dx: 1, dy: 0 },
        { d: 'u', es: 'hacia arriba', lv: 'uz augšu', dx: 0, dy: 1 },
        { d: 'l', es: 'a la izquierda', lv: 'pa kreisi', dx: -1, dy: 0 },
        { d: 'd', es: 'hacia abajo', lv: 'uz leju', dx: 0, dy: -1 }
      ];
      const order = rng.shuffle([0, 1, 2, 3]).concat(rng.int(0, 3));
      let x = 0, y = 0, total = 0;
      const listEs = [], listLv = [], pts = [];
      const letters = ['A', 'B', 'C', 'D', 'E'];
      order.forEach((oi, i) => {
        const dir = dirs[oi], k = rng.int(2, 7);
        x += dir.dx * k; y += dir.dy * k; total += k;
        listEs.push(k + ' unidades ' + dir.es + ' (punto ' + letters[i] + ')');
        listLv.push(k + ' vienības ' + dir.lv + ' (punkts ' + letters[i] + ')');
        pts.push([x, y, letters[i]]);
      });
      const speed = rng.pick([1, 2]), pause = rng.pick([1, 1.5, 2]);
      const tMove = total / speed, tPause = (order.length - 1) * pause;
      const tTotal = Math.round((tMove + tPause) * 1000) / 1000;
      return {
        q: T('El robot Roro sale del punto (0; 0) y ejecuta estas órdenes:<br>· ' + listEs.join('<br>· ') +
             '<br>Roro se mueve a <b>' + speed + ' unidad(es) por segundo</b> y entre cada dos órdenes necesita <b>' + MM.n(pause) + ' s</b>.',
             'Robots Roro sāk ceļu punktā (0; 0) un izpilda šādas komandas:<br>· ' + listLv.join('<br>· ') +
             '<br>Roro pārvietojas ar ātrumu <b>' + speed + ' vienība(s) sekundē</b>, un starp katrām divām komandām tam vajag <b>' + MM.n(pause) + ' s</b>.'),
        fields: [
          { key: 'x', label: T('x del punto final', 'gala punkta x'), answerType: 'num', answer: String(x) },
          { key: 'y', label: T('y del punto final', 'gala punkta y'), answerType: 'num', answer: String(y) },
          { key: 'd', label: T('Unidades recorridas', 'Veiktais ceļš (vienības)'), answerType: 'num', answer: String(total) },
          { key: 't', label: T('Segundos en total', 'Kopējais laiks (s)'), answerType: 'num', answer: String(tTotal), unit: 's' }
        ],
        points: 4,
        solution: [
          T('Se van sumando los movimientos: ' + pts.map(p => p[2] + '(' + p[0] + '; ' + p[1] + ')').join(' → '),
            'Kustības saskaita pa vienai: ' + pts.map(p => p[2] + '(' + p[0] + '; ' + p[1] + ')').join(' → ')),
          T('Punto final: <b>(' + x + '; ' + y + ')</b>', 'Gala punkts: <b>(' + x + '; ' + y + ')</b>'),
          T('Recorrido total = ' + order.length + ' tramos = <b>' + total + ' unidades</b> (se suman aunque vaya y vuelva).',
            'Kopējais ceļš = ' + order.length + ' posmi = <b>' + total + ' vienības</b> (saskaita visus, arī atpakaļceļu).'),
          T('Tiempo moviéndose: ' + total + ' : ' + speed + ' = ' + MM.n(tMove) + ' s',
            'Kustības laiks: ' + total + ' : ' + speed + ' = ' + MM.n(tMove) + ' s'),
          T('Con ' + order.length + ' órdenes hay <b>' + (order.length - 1) + ' pausas</b>: ' + (order.length - 1) + ' · ' + MM.n(pause) + ' = ' + MM.n(tPause) + ' s',
            'Ar ' + order.length + ' komandām ir <b>' + (order.length - 1) + ' pauzes</b>: ' + (order.length - 1) + ' · ' + MM.n(pause) + ' = ' + MM.n(tPause) + ' s'),
          T('Total: ' + MM.n(tMove) + ' + ' + MM.n(tPause) + ' = <b>' + MM.n(tTotal) + ' s</b>',
            'Kopā: ' + MM.n(tMove) + ' + ' + MM.n(tPause) + ' = <b>' + MM.n(tTotal) + ' s</b>')
        ],
        hint: T('Entre 5 órdenes hay 4 pausas, no 5.', 'Starp 5 komandām ir 4 pauzes, nevis 5.')
      };
    }
  });

  reg('coo.distance', {
    topic: 'coo', level: 2, part: 'A', name: T('Distancia entre puntos', 'Attālums starp punktiem'),
    make(rng) {
      const horiz = rng.chance(0.5);
      const a = rng.int(-6, 6), b = rng.int(-6, 6);
      const c = rng.intNot(-6, 6, [a]);
      const p1 = horiz ? [a, b] : [b, a], p2 = horiz ? [c, b] : [b, c];
      const dist = Math.abs(a - c);
      return {
        q: T('¿Cuál es la distancia entre <b>A(' + p1[0] + '; ' + p1[1] + ')</b> y <b>B(' + p2[0] + '; ' + p2[1] + ')</b>?' + plane([[p1[0], p1[1], 'A'], [p2[0], p2[1], 'B']]),
             'Kāds ir attālums starp <b>A(' + p1[0] + '; ' + p1[1] + ')</b> un <b>B(' + p2[0] + '; ' + p2[1] + ')</b>?' + plane([[p1[0], p1[1], 'A'], [p2[0], p2[1], 'B']])),
        answerType: 'num', answer: String(dist), unit: T('unidades', 'vienības'),
        solution: [
          T('Los dos puntos están en la misma ' + (horiz ? 'horizontal (misma y)' : 'vertical (misma x)') + '.',
            'Abi punkti atrodas uz vienas ' + (horiz ? 'horizontāles (vienāds y)' : 'vertikāles (vienāds x)') + '.'),
          T('Se restan las otras coordenadas: |' + a + ' − (' + c + ')| = <b>' + dist + '</b>',
            'Atņem otras koordinātas: |' + a + ' − (' + c + ')| = <b>' + dist + '</b>'),
          T('La distancia siempre es positiva.', 'Attālums vienmēr ir pozitīvs.')
        ]
      };
    }
  });

  reg('coo.rectarea', {
    topic: 'coo', level: 2, part: 'B', points: 3, name: T('Rectángulo en el plano', 'Taisnstūris koordinātu plaknē'),
    make(rng) {
      const x1 = rng.int(-5, 1), y1 = rng.int(-5, 1);
      const w = rng.int(2, 6), h = rng.int(2, 6);
      const x2 = x1 + w, y2 = y1 + h;
      return {
        q: T('Los vértices de un rectángulo son A(' + x1 + '; ' + y1 + '), B(' + x2 + '; ' + y1 + '), C(' + x2 + '; ' + y2 + ') y D(' + x1 + '; ' + y2 + '). Calcula su área y su perímetro.' +
             plane([[x1, y1, 'A'], [x2, y1, 'B'], [x2, y2, 'C'], [x1, y2, 'D']]),
             'Taisnstūra virsotnes ir A(' + x1 + '; ' + y1 + '), B(' + x2 + '; ' + y1 + '), C(' + x2 + '; ' + y2 + ') un D(' + x1 + '; ' + y2 + '). Aprēķini tā laukumu un perimetru.' +
             plane([[x1, y1, 'A'], [x2, y1, 'B'], [x2, y2, 'C'], [x1, y2, 'D']])),
        fields: [
          { key: 'a', label: T('Área', 'Laukums'), answerType: 'num', answer: String(w * h) },
          { key: 'p', label: T('Perímetro', 'Perimetrs'), answerType: 'num', answer: String(2 * (w + h)) }
        ],
        points: 3,
        solution: [
          T('Base = |' + x2 + ' − (' + x1 + ')| = ' + w + ' unidades', 'Pamats = |' + x2 + ' − (' + x1 + ')| = ' + w + ' vienības'),
          T('Altura = |' + y2 + ' − (' + y1 + ')| = ' + h + ' unidades', 'Augstums = |' + y2 + ' − (' + y1 + ')| = ' + h + ' vienības'),
          T('Área = ' + w + ' · ' + h + ' = <b>' + (w * h) + '</b>', 'Laukums = ' + w + ' · ' + h + ' = <b>' + (w * h) + '</b>'),
          T('Perímetro = 2 · (' + w + ' + ' + h + ') = <b>' + (2 * (w + h)) + '</b>', 'Perimetrs = 2 · (' + w + ' + ' + h + ') = <b>' + (2 * (w + h)) + '</b>')
        ]
      };
    }
  });

  /* =====================================================
     TEMA 13 · CUERPOS Y VOLUMEN
     ===================================================== */

  reg('vol.cuboid', {
    topic: 'vol', level: 1, part: 'A', name: T('Volumen del ortoedro', 'Paralēlskaldņa tilpums'),
    make(rng) {
      const a = rng.pick([10, 15, 20, 25, 30, 40, 50]), b = rng.pick([10, 12, 15, 20, 25, 30]), c = rng.pick([5, 8, 10, 12, 15, 20]);
      const v = a * b * c, litres = v / 1000;
      return {
        q: T('Una caja mide <b>' + a + ' cm × ' + b + ' cm × ' + c + ' cm</b>. ¿Cuál es su volumen en cm³ y cuántos litros caben?',
             'Kaste ir <b>' + a + ' cm × ' + b + ' cm × ' + c + ' cm</b>. Kāds ir tās tilpums cm³ un cik litru tajā ietilpst?'),
        fields: [
          { key: 'v', label: T('Volumen', 'Tilpums'), answerType: 'num', answer: String(v), unit: 'cm³' },
          { key: 'l', label: T('Litros', 'Litri'), answerType: 'num', answer: String(litres), unit: 'l' }
        ],
        solution: [
          T('V = largo · ancho · alto = ' + a + ' · ' + b + ' · ' + c + ' = <b>' + MM.nk(v) + ' cm³</b>',
            'V = garums · platums · augstums = ' + a + ' · ' + b + ' · ' + c + ' = <b>' + MM.nk(v) + ' cm³</b>'),
          T('1000 cm³ = 1 litro → ' + MM.nk(v) + ' : 1000 = <b>' + MM.n(litres) + ' l</b>',
            '1000 cm³ = 1 litrs → ' + MM.nk(v) + ' : 1000 = <b>' + MM.n(litres) + ' l</b>')
        ],
        hint: T('1 dm³ = 1 litro = 1000 cm³.', '1 dm³ = 1 litrs = 1000 cm³.')
      };
    }
  });

  reg('vol.missing', {
    topic: 'vol', level: 2, part: 'A', name: T('Falta una arista', 'Trūkst viena šķautne'),
    make(rng) {
      const a = rng.int(2, 15), b = rng.int(2, 15), c = rng.int(2, 15);
      const v = a * b * c;
      return {
        q: T('El volumen de un ortoedro es <b>' + MM.nk(v) + ' cm³</b>. Dos de sus aristas miden <b>' + a + ' cm</b> y <b>' + b + ' cm</b>. ¿Cuánto mide la tercera?',
             'Taisnstūra paralēlskaldņa tilpums ir <b>' + MM.nk(v) + ' cm³</b>. Divas šķautnes ir <b>' + a + ' cm</b> un <b>' + b + ' cm</b>. Cik gara ir trešā?'),
        answerType: 'num', answer: String(c), unit: 'cm',
        solution: [
          T('V = a · b · c → c = V : (a · b)', 'V = a · b · c → c = V : (a · b)'),
          T('a · b = ' + a + ' · ' + b + ' = ' + (a * b), 'a · b = ' + a + ' · ' + b + ' = ' + (a * b)),
          T(MM.nk(v) + ' : ' + (a * b) + ' = <b>' + c + ' cm</b>', MM.nk(v) + ' : ' + (a * b) + ' = <b>' + c + ' cm</b>')
        ]
      };
    }
  });

  reg('vol.surface', {
    topic: 'vol', level: 2, part: 'A', name: T('Área total', 'Virsmas laukums'),
    make(rng) {
      const a = rng.int(2, 12), b = rng.int(2, 12), c = rng.int(2, 12);
      const s = 2 * (a * b + a * c + b * c);
      return {
        q: T('Calcula el <b>área total</b> (las 6 caras) de un ortoedro de <b>' + a + ' cm × ' + b + ' cm × ' + c + ' cm</b>.',
             'Aprēķini taisnstūra paralēlskaldņa <b>virsmas laukumu</b> (6 skaldnes): <b>' + a + ' cm × ' + b + ' cm × ' + c + ' cm</b>.'),
        answerType: 'num', answer: String(s), unit: 'cm²',
        solution: [
          T('Las caras son iguales dos a dos: ' + a + '·' + b + ' = ' + (a * b) + ', ' + a + '·' + c + ' = ' + (a * c) + ', ' + b + '·' + c + ' = ' + (b * c),
            'Skaldnes ir pa pārīšiem vienādas: ' + a + '·' + b + ' = ' + (a * b) + ', ' + a + '·' + c + ' = ' + (a * c) + ', ' + b + '·' + c + ' = ' + (b * c)),
          T('Área = 2 · (' + (a * b) + ' + ' + (a * c) + ' + ' + (b * c) + ') = 2 · ' + (a * b + a * c + b * c) + ' = <b>' + s + ' cm²</b>',
            'Laukums = 2 · (' + (a * b) + ' + ' + (a * c) + ' + ' + (b * c) + ') = 2 · ' + (a * b + a * c + b * c) + ' = <b>' + s + ' cm²</b>')
        ],
        hint: T('Área total = 2·(ab + ac + bc)', 'Virsmas laukums = 2·(ab + ac + bc)')
      };
    }
  });

  reg('vol.cube', {
    topic: 'vol', level: 2, part: 'A', name: T('El cubo', 'Kubs'),
    make(rng) {
      const a = rng.int(2, 12);
      const askVolume = rng.chance(0.6);
      if (askVolume) {
        return {
          q: T('Un cubo tiene <b>' + a + ' cm</b> de arista. Calcula su volumen y su área total.',
               'Kuba šķautne ir <b>' + a + ' cm</b>. Aprēķini tā tilpumu un virsmas laukumu.'),
          fields: [
            { key: 'v', label: T('Volumen', 'Tilpums'), answerType: 'num', answer: String(a * a * a), unit: 'cm³' },
            { key: 's', label: T('Área total', 'Virsmas laukums'), answerType: 'num', answer: String(6 * a * a), unit: 'cm²' }
          ],
          solution: [
            T('V = a³ = ' + a + ' · ' + a + ' · ' + a + ' = <b>' + (a * a * a) + ' cm³</b>', 'V = a³ = ' + a + ' · ' + a + ' · ' + a + ' = <b>' + (a * a * a) + ' cm³</b>'),
            T('Área = 6 · a² = 6 · ' + (a * a) + ' = <b>' + (6 * a * a) + ' cm²</b>', 'Laukums = 6 · a² = 6 · ' + (a * a) + ' = <b>' + (6 * a * a) + ' cm²</b>')
          ]
        };
      }
      return {
        q: T('El volumen de un cubo es <b>' + (a * a * a) + ' cm³</b>. ¿Cuánto mide su arista?',
             'Kuba tilpums ir <b>' + (a * a * a) + ' cm³</b>. Cik gara ir tā šķautne?'),
        answerType: 'num', answer: String(a), unit: 'cm',
        solution: [
          T('Se busca el número que multiplicado tres veces por sí mismo da ' + (a * a * a) + '.',
            'Meklē skaitli, kas reizināts ar sevi trīs reizes dod ' + (a * a * a) + '.'),
          T(a + ' · ' + a + ' · ' + a + ' = ' + (a * a * a) + ' → arista = <b>' + a + ' cm</b>',
            a + ' · ' + a + ' · ' + a + ' = ' + (a * a * a) + ' → šķautne = <b>' + a + ' cm</b>')
        ]
      };
    }
  });

  reg('vol.fill', {
    topic: 'vol', level: 3, part: 'B', points: 3, name: T('Llenar un depósito', 'Tvertnes piepildīšana'),
    make(rng) {
      const a = rng.pick([1, 1.5, 2, 2.5, 3]), b = rng.pick([1, 1.2, 1.5, 2]), c = rng.pick([0.5, 0.8, 1, 1.2]);
      const m3 = Math.round(a * b * c * 1000) / 1000;
      const litres = Math.round(m3 * 1000);
      const rate = rng.pick([50, 100, 150, 200, 250, 300]);
      const minutes = Math.round(litres / rate * 100) / 100;
      return {
        q: T('Un depósito con forma de caja mide <b>' + MM.n(a) + ' m × ' + MM.n(b) + ' m × ' + MM.n(c) + ' m</b> y se llena con un grifo que echa <b>' + rate + ' litros por minuto</b>. ¿Cuántos minutos tarda en llenarse?',
             'Kastes formas tvertne ir <b>' + MM.n(a) + ' m × ' + MM.n(b) + ' m × ' + MM.n(c) + ' m</b>, un to pilda krāns, kas dod <b>' + rate + ' litrus minūtē</b>. Cik minūtēs tvertne piepildīsies?'),
        answerType: 'num', answer: String(minutes), unit: 'min', tol: 0.005, points: 3,
        solution: [
          T('V = ' + MM.n(a) + ' · ' + MM.n(b) + ' · ' + MM.n(c) + ' = ' + MM.n(m3) + ' m³', 'V = ' + MM.n(a) + ' · ' + MM.n(b) + ' · ' + MM.n(c) + ' = ' + MM.n(m3) + ' m³'),
          T('1 m³ = 1000 litros → ' + MM.n(m3) + ' · 1000 = ' + MM.nk(litres) + ' litros', '1 m³ = 1000 litri → ' + MM.n(m3) + ' · 1000 = ' + MM.nk(litres) + ' litri'),
          T(MM.nk(litres) + ' : ' + rate + ' = <b>' + MM.n(minutes) + ' minutos</b>', MM.nk(litres) + ' : ' + rate + ' = <b>' + MM.n(minutes) + ' minūtes</b>')
        ],
        hint: T('Pasa el volumen a litros antes de dividir.', 'Pirms dalīšanas pārveido tilpumu litros.')
      };
    }
  });

})(typeof window !== 'undefined' ? window : globalThis);
