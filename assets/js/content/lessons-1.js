/* =========================================================
   Lecciones 1–5: naturales, fracciones, decimales,
   negativos, potencias y orden de operaciones
   ========================================================= */
(function (global) {
  'use strict';
  const MM = global.MM, T = MM.T;
  const L = MM.LESSONS = MM.LESSONS || {};

  /* ayudas para escribir lecciones */
  const H = MM.L = {
    P:    (es, lv) => ({ k: 'p',    t: T(es, lv) }),
    KEY:  (es, lv) => ({ k: 'key',  t: T(es, lv) }),
    TIP:  (es, lv) => ({ k: 'tip',  t: T(es, lv) }),
    WARN: (es, lv) => ({ k: 'warn', t: T(es, lv) }),
    TAB:  (head, rows) => ({ k: 'table', head: head, rows: rows }),
    EX:   (es, lv, steps) => ({ k: 'ex', t: T(es, lv), steps: steps }),
    LIST: (items) => ({ k: 'list', items: items }),
    S:    (es, lv) => T(es, lv),
    /* dibuja la fracción tal cual, sin simplificar (2/3 = 4/6 = 20/30) */
    F:    (n, d) => MM.frn(n, d),
    FM:   (n, d) => MM.fr(MM.F(n, d), { mixed: true }),
    /* fracción simbólica, con letras: FS('x', 24) */
    FS:   (n, d) => '<span class="mth"><span class="fr"><i>' + n + '</i><i>' + d + '</i></span></span>',
    m:    s => MM.m(s),
    /* 🌍 dónde se usa en la vida real */
    REAL: (es, lv) => ({ k: 'real', t: T(es, lv) }),
    /* dibujo SVG (sin palabras dentro) con pie de foto bilingüe */
    FIG:  (svg, es, lv) => ({ k: 'fig', svg: svg, t: T(es, lv) }),
    /* animación paso a paso ("mini vídeo"): se ve con ▶ */
    ANIM: (es, lv, steps) => ({ k: 'anim', t: T(es, lv), steps: steps }),
    /* pruébalo tú: pregunta con la respuesta escondida */
    TRY:  (qes, qlv, aes, alv) => ({ k: 'try', q: T(qes, qlv), a: T(aes, alv) })
  };
  const { P, KEY, TIP, WARN, TAB, EX, LIST, S, F, FM, m, REAL, FIG, ANIM, TRY } = H;

  /* ayudas de dibujo para las lecciones (SVG sin texto en idioma) */
  const SVG = (w, h, inner) => '<svg viewBox="0 0 ' + w + ' ' + h + '" xmlns="http://www.w3.org/2000/svg" role="img">' + inner + '</svg>';
  const dot = (x, y, color, r) => '<circle cx="' + x + '" cy="' + y + '" r="' + (r || 9) + '" style="fill:' + color + '"/>';
  const txt = (x, y, s, size, extra) => '<text x="' + x + '" y="' + y + '" text-anchor="middle" style="fill:currentColor;font-weight:800;font-size:' + (size || 15) + 'px;font-family:inherit" ' + (extra || '') + '>' + s + '</text>';
  const VIO = 'var(--violet)', GRN = 'var(--green)', ROS = 'var(--rose)', AMB = 'var(--amber)', LIN = 'var(--line)';
  /* rejilla de puntos: n puntos en filas de "cols"; los que sobran en rojo */
  function dots(x0, y0, n, cols, color, leftoverColor) {
    let s = '';
    for (let i = 0; i < n; i++) {
      const r = Math.floor(i / cols), c = i % cols;
      const full = Math.floor(n / cols) * cols;
      s += dot(x0 + c * 24, y0 + r * 24, i >= full ? (leftoverColor || ROS) : color);
    }
    return s;
  }

  /* =====================================================
     1 · NÚMEROS NATURALES Y DIVISIBILIDAD
     ===================================================== */
  /* --- dibujos de la lección de divisibilidad --- */
  const arc = (x1, x2, y, h, color) => '<path d="M' + x1 + ' ' + y + ' Q' + ((x1 + x2) / 2) + ' ' + (y - h) + ' ' + x2 + ' ' + y + '" style="fill:none;stroke:' + color + ';stroke-width:3;stroke-linecap:round"/>';
  const line = (x1, y1, x2, y2, color, w) => '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" style="stroke:' + (color || LIN) + ';stroke-width:' + (w || 2) + ';stroke-linecap:round"/>';
  const node = (x, y, s, color) => '<circle cx="' + x + '" cy="' + y + '" r="20" style="fill:' + color + ';stroke:' + LIN + ';stroke-width:2"/>' + txt(x, y + 6, s, 17, 'style="fill:#fff;font-weight:900;font-size:17px;font-family:inherit"');

  /* 12 : 3 justo  ·  12 : 5 sobran 2 */
  const FIG_EXACT = SVG(560, 120,
    dots(36, 24, 12, 4, GRN) + txt(72, 108, '12 : 3 = 4 ✓', 17) +
    line(280, 10, 280, 110, LIN, 2) +
    dots(320, 24, 12, 5, VIO) + txt(368, 108, '12 : 5 ✗', 17));

  /* parejas de divisores de 12 */
  const FIG_PAIRS = (function () {
    const xs = [60, 150, 240, 330, 420, 510], ns = ['1', '2', '3', '4', '6', '12'];
    let s = arc(60, 510, 88, 110, VIO) + arc(150, 420, 88, 78, GRN) + arc(240, 330, 88, 44, AMB);
    xs.forEach((x, i) => { s += '<circle cx="' + x + '" cy="88" r="17" style="fill:var(--card);stroke:' + [VIO, GRN, AMB, AMB, GRN, VIO][i] + ';stroke-width:3"/>' + txt(x, 94, ns[i], 16); });
    return SVG(560, 120, s);
  })();

  /* recta numérica: saltos de 6 */
  const FIG_JUMPS = (function () {
    let s = line(20, 70, 545, 70, 'var(--ink-mute)', 2);
    for (let k = 0; k <= 6; k++) {
      const x = 30 + k * 80;
      s += line(x, 62, x, 78, 'var(--ink-mute)', 2) + txt(x, 100, String(k * 6), 15);
      if (k > 0) s += arc(x - 80, x, 66, 46, VIO) + dot(x, 70, VIO, 6);
    }
    const x32 = 30 + 32 / 6 * 80;
    s += txt(x32, 38, '32', 15, 'style="fill:' + ROS + ';font-weight:900;font-size:15px;font-family:inherit"') +
         line(x32 - 6, 64, x32 + 6, 76, ROS, 3) + line(x32 - 6, 76, x32 + 6, 64, ROS, 3);
    return SVG(560, 110, s);
  })();

  /* cifras de 2376: última cifra y suma */
  const FIG_DIGITS = SVG(560, 120,
    txt(130, 62, '2', 44) + txt(210, 62, '3', 44) + txt(290, 62, '7', 44) + txt(370, 62, '6', 44) +
    '<circle cx="370" cy="48" r="30" style="fill:none;stroke:' + GRN + ';stroke-width:4"/>' +
    arc(130, 370, 82, -22, VIO) +
    txt(250, 110, '2 + 3 + 7 + 6 = 18', 18));

  /* 7 solo en fila · 12 en 3×4 y 2×6 */
  const FIG_PRIME = SVG(560, 130,
    dots(24, 40, 7, 7, ROS) + txt(96, 100, '7', 17) +
    line(200, 10, 200, 120, LIN, 2) +
    dots(236, 22, 12, 4, GRN) + txt(272, 108, '3 × 4', 16) +
    dots(400, 34, 12, 6, VIO) + txt(460, 108, '2 × 6', 16));

  /* árbol de 180 */
  const FIG_TREE = SVG(560, 240,
    line(280, 30, 180, 90) + line(280, 30, 380, 90) +
    line(180, 90, 120, 150) + line(180, 90, 240, 150) +
    line(380, 90, 340, 150) + line(380, 90, 420, 150) +
    line(240, 150, 200, 210) + line(240, 150, 280, 210) +
    node(280, 30, '180', VIO) + node(180, 90, '18', VIO) + node(380, 90, '10', VIO) +
    node(120, 150, '2', GRN) + node(240, 150, '9', VIO) + node(340, 150, '2', GRN) + node(420, 150, '5', GRN) +
    node(200, 210, '3', GRN) + node(280, 210, '3', GRN));

  /* 24 lápices y 36 gomas en 12 bolsas */
  const FIG_BAGS = (function () {
    let s = '';
    for (let i = 0; i < 12; i++) {
      const x = 40 + i * 42;
      s += '<rect x="' + x + '" y="14" width="36" height="34" rx="8" style="fill:var(--violet-l);stroke:' + VIO + ';stroke-width:2"/>' +
           dot(x + 12, 31, VIO, 6) + dot(x + 24, 31, VIO, 6) +
           '<rect x="' + x + '" y="62" width="36" height="34" rx="8" style="fill:var(--green-l);stroke:' + GRN + ';stroke-width:2"/>' +
           dot(x + 8, 79, GRN, 6) + dot(x + 18, 79, GRN, 6) + dot(x + 28, 79, GRN, 6);
    }
    s += txt(18, 37, '24', 15) + txt(18, 85, '36', 15) + txt(170, 128, '12 · 2 = 24', 16) + txt(410, 128, '12 · 3 = 36', 16);
    return SVG(560, 140, s);
  })();

  /* autobuses cada 12 y cada 18: saltos arriba y abajo */
  const FIG_BUSES = (function () {
    const X = v => 30 + v * 7;
    let s = line(20, 70, 545, 70, 'var(--ink-mute)', 2);
    [0, 12, 24, 36, 48, 60, 72].forEach(v => { s += line(X(v), 64, X(v), 76, 'var(--ink-mute)', 2) + txt(X(v), 128, String(v), 14); });
    for (let v = 12; v <= 72; v += 12) s += arc(X(v - 12), X(v), 66, 44, VIO) + dot(X(v), 70, VIO, 6);
    for (let v = 18; v <= 72; v += 18) s += arc(X(v - 18), X(v), 74, -44, GRN) + dot(X(v), 70, GRN, 6);
    [36, 72].forEach(v => { s += '<circle cx="' + X(v) + '" cy="70" r="14" style="fill:none;stroke:' + AMB + ';stroke-width:4"/>'; });
    s += txt(X(36), 152, '36', 17, 'style="fill:' + AMB + ';font-weight:900;font-size:17px;font-family:inherit"');
    return SVG(560, 160, s);
  })();

  L.nat = {
    sections: [
      /* ---------- 1 ---------- */
      {
        t: T('¿Cabe justo? Dividir sin que sobre nada', 'Vai sanāk tieši? Dalīšana bez atlikuma'),
        b: [
          P('Toda esta lección va de <b>una sola pregunta</b>: ¿se puede repartir <b>sin que sobre nada</b>? Si repartes 12 caramelos entre 3 amigos, cada uno recibe 4 y no sobra ninguno. Por eso decimos que 12 <b>es divisible</b> entre 3.',
            'Visa šī nodaļa ir par <b>vienu jautājumu</b>: vai var sadalīt tā, <b>lai nekas nepaliek pāri</b>? Ja 12 konfektes sadala 3 draugiem, katrs saņem 4 un neviena nepaliek pāri. Tāpēc sakām, ka 12 <b>dalās</b> ar 3.'),
          FIG(FIG_EXACT,
            'A la izquierda, 12 puntos en 3 filas de 4: cabe justo. A la derecha, 12 puntos en filas de 5: se llenan 2 filas y <b>sobran 2</b> (en rojo).',
            'Pa kreisi 12 punkti 3 rindās pa 4: sanāk tieši. Pa labi 12 punkti rindās pa 5: piepildās 2 rindas un <b>2 paliek pāri</b> (sarkanie).'),
          KEY('Lo que sobra se llama <b>resto</b>. “Divisible” quiere decir <b>resto 0</b>: 12 : 3 = 4 y resto 0 → divisible. 12 : 5 = 2 y resto 2 → no divisible.',
              'To, kas paliek pāri, sauc par <b>atlikumu</b>. “Dalās” nozīmē <b>atlikums 0</b>: 12 : 3 = 4, atlikums 0 → dalās. 12 : 5 = 2, atlikums 2 → nedalās.'),
          REAL('Hacer equipos iguales en clase, cortar una pizza en porciones iguales, poner las sillas en filas iguales, repartir el dinero de un regalo entre amigos: siempre te preguntas “¿cabe justo o sobra algo?”.',
               'Sadalīt klasi vienādās komandās, sagriezt picu vienādos gabalos, sarindot krēslus vienādās rindās, sadalīt dāvanas naudu starp draugiem: vienmēr jautā “vai sanāk tieši, vai kas paliek pāri?”.'),
          EX('¿20 sillas se pueden poner en 4 filas iguales? ¿Y en 6?', 'Vai 20 krēslus var sarindot 4 vienādās rindās? Un 6 rindās?', [
            S('20 : 4 = 5 y no sobra nada → <b>sí</b>: 4 filas de 5 sillas.', '20 : 4 = 5, nekas nepaliek pāri → <b>jā</b>: 4 rindas pa 5 krēsliem.'),
            S('20 : 6 → 6 · 3 = 18 y quedan 2 sillas sueltas → <b>no</b> cabe justo (resto 2).', '20 : 6 → 6 · 3 = 18, un 2 krēsli paliek pāri → <b>nesanāk</b> tieši (atlikums 2).')
          ]),
          TRY('¿15 : 4 cabe justo?', 'Vai 15 : 4 sanāk tieši?',
              'No. 4 · 3 = 12 y sobran 3. Así que 15 <b>no</b> es divisible entre 4.',
              'Nē. 4 · 3 = 12, pāri paliek 3. Tāpēc 15 <b>nedalās</b> ar 4.')
        ]
      },
      /* ---------- 2 ---------- */
      {
        t: T('Divisores: los números que caben justo', 'Dalītāji: skaitļi, kas dalās bez atlikuma'),
        b: [
          KEY('Un <b>divisor</b> de 12 es un número que cabe en 12 un número exacto de veces. Los divisores de 12 son <b>1, 2, 3, 4, 6 y 12</b>. El 5 no lo es (sobran 2), el 7 tampoco.',
              '12 <b>dalītājs</b> ir skaitlis, kas 12 ietilpst veselu reižu skaitu. 12 dalītāji ir <b>1, 2, 3, 4, 6 un 12</b>. 5 nav dalītājs (paliek 2), 7 arī nav.'),
          FIG(FIG_PAIRS,
            'Los divisores van <b>en parejas</b> que multiplicadas dan 12: 1 · 12, 2 · 6, 3 · 4. Si encuentras uno, el otro te sale gratis.',
            'Dalītāji iet <b>pāros</b>, kuru reizinājums ir 12: 1 · 12, 2 · 6, 3 · 4. Ja atrodi vienu, otrs nāk par velti.'),
          ANIM('Buscar todos los divisores de 30', 'Atrast visus 30 dalītājus', [
            S('Probamos en orden desde el 1. ¿El 1? Siempre cabe: 1 · 30 = 30 → pareja (1, 30).', 'Pārbaudam pēc kārtas no 1. Vai 1? Vienmēr der: 1 · 30 = 30 → pāris (1, 30).'),
            S('¿El 2? 30 es par: 2 · 15 = 30 → pareja (2, 15).', 'Vai 2? 30 ir pāra skaitlis: 2 · 15 = 30 → pāris (2, 15).'),
            S('¿El 3? 3 · 10 = 30 → pareja (3, 10).', 'Vai 3? 3 · 10 = 30 → pāris (3, 10).'),
            S('¿El 4? 4 · 7 = 28 y 4 · 8 = 32… se salta el 30 → <b>no</b>.', 'Vai 4? 4 · 7 = 28 un 4 · 8 = 32… 30 tiek pārlēkts → <b>nē</b>.'),
            S('¿El 5? Termina en 0: 5 · 6 = 30 → pareja (5, 6).', 'Vai 5? Beidzas ar 0: 5 · 6 = 30 → pāris (5, 6).'),
            S('El siguiente sería el 6, y ya está en una pareja: <b>hemos terminado</b>. Divisores de 30: 1, 2, 3, 5, 6, 10, 15, 30.', 'Nākamais būtu 6, un tas jau ir pārī: <b>gatavs</b>. 30 dalītāji: 1, 2, 3, 5, 6, 10, 15, 30.')
          ]),
          REAL('Vas a sentar a 24 invitados en mesas <b>iguales</b>. Los divisores de 24 (1, 2, 3, 4, 6, 8, 12, 24) son las únicas opciones que funcionan: mesas de 4, de 6, de 8… Con mesas de 5 alguien se queda sin sitio.',
               'Jāsasēdina 24 viesi pie <b>vienādiem</b> galdiem. 24 dalītāji (1, 2, 3, 4, 6, 8, 12, 24) ir vienīgās iespējas: galdi pa 4, pa 6, pa 8… Ar galdiem pa 5 kāds paliek bez vietas.'),
          EX('Divisores de 18 y de 7', '18 un 7 dalītāji', [
            S('18: parejas 1 · 18, 2 · 9, 3 · 6 → divisores <b>1, 2, 3, 6, 9, 18</b>.', '18: pāri 1 · 18, 2 · 9, 3 · 6 → dalītāji <b>1, 2, 3, 6, 9, 18</b>.'),
            S('7: la única pareja es 1 · 7 → divisores <b>1 y 7</b>. Un número con solo dos divisores se llama <b>primo</b> (lo vemos más abajo).', '7: vienīgais pāris ir 1 · 7 → dalītāji <b>1 un 7</b>. Skaitli ar tikai diviem dalītājiem sauc par <b>pirmskaitli</b> (par to zemāk).')
          ]),
          TRY('Escribe todos los divisores de 16.', 'Uzraksti visus 16 dalītājus.',
              'Parejas: 1 · 16, 2 · 8, 4 · 4 → <b>1, 2, 4, 8, 16</b>. El 4 se cuenta una sola vez.',
              'Pāri: 1 · 16, 2 · 8, 4 · 4 → <b>1, 2, 4, 8, 16</b>. Skaitli 4 skaita tikai vienreiz.')
        ]
      },
      /* ---------- 3 ---------- */
      {
        t: T('Múltiplos: saltos en la recta', 'Dalāmie: lēcieni uz skaitļu ass'),
        b: [
          KEY('Un <b>múltiplo</b> de 6 es cualquier número de la <b>tabla del 6</b>: 6, 12, 18, 24, 30, 36… Es como saltar de 6 en 6 por la recta numérica.',
              '6 <b>dalāmais</b> ir jebkurš skaitlis no <b>reizināšanas tabulas ar 6</b>: 6, 12, 18, 24, 30, 36… Tas ir kā lēkt pa 6 uz skaitļu ass.'),
          FIG(FIG_JUMPS,
            'Saltando de 6 en 6 caes en 6, 12, 18, 24, 30, 36… pero <b>nunca en 32</b>: 32 no es múltiplo de 6.',
            'Lecot pa 6, nonāk uz 6, 12, 18, 24, 30, 36… bet <b>nekad uz 32</b>: 32 nav 6 dalāmais.'),
          REAL('Los huevos vienen en cajas de 6. Puedes comprar 6, 12, 18, 24 o 30 huevos, pero nunca exactamente 32. Lo mismo pasa con paquetes de 8 rotuladores, semanas de 7 días o monedas de 2 céntimos.',
               'Olas pārdod kastītēs pa 6. Var nopirkt 6, 12, 18, 24 vai 30 olas, bet nekad tieši 32. Tas pats ar flomāsteriem pa 8, nedēļām pa 7 dienām vai 2 centu monētām.'),
          EX('Los tres múltiplos más pequeños de 15', 'Trīs mazākie 15 dalāmie', [
            S('15 · 1 = <b>15</b>', '15 · 1 = <b>15</b>'),
            S('15 · 2 = <b>30</b>', '15 · 2 = <b>30</b>'),
            S('15 · 3 = <b>45</b> → 15, 30, 45. ¿Cuántos de ellos son divisibles entre 6? Solo el 30 (par y 3+0 = 3).', '15 · 3 = <b>45</b> → 15, 30, 45. Cik no tiem dalās ar 6? Tikai 30 (pāra skaitlis un 3+0 = 3).')
          ]),
          WARN('Divisor y múltiplo son <b>la misma idea vista desde dos lados</b>: 3 es divisor de 12 ⇔ 12 es múltiplo de 3. El divisor es el <b>pequeño</b>, el múltiplo el <b>grande</b>. En letón: <b>dalītājs</b> = divisor, <b>dalāmais</b> = múltiplo. En el examen de 2025 preguntaron “los tres <i>dalāmie</i> más pequeños de 15” → 15, 30, 45.',
               'Dalītājs un dalāmais ir <b>viena ideja no divām pusēm</b>: 3 ir 12 dalītājs ⇔ 12 ir 3 dalāmais. Dalītājs ir <b>mazākais</b>, dalāmais — <b>lielākais</b>. 2025. gada pārbaudījumā jautāja “15 trīs mazākie <i>dalāmie</i>” → 15, 30, 45.'),
          TRY('¿Es 84 múltiplo de 7?', 'Vai 84 ir 7 dalāmais?',
              'Sí: 7 · 12 = 84 (o 84 : 7 = 12 justo).',
              'Jā: 7 · 12 = 84 (vai 84 : 7 = 12 bez atlikuma).')
        ]
      },
      /* ---------- 4 ---------- */
      {
        t: T('Trucos para saber si se puede dividir (sin dividir)', 'Dalāmības pazīmes: kā uzzināt bez dalīšanas'),
        b: [
          P('Con números grandes no hace falta dividir: hay <b>trucos</b> que solo miran algunas cifras. Son tres tipos de truco.',
            'Ar lieliem skaitļiem nav jādala: ir <b>pazīmes</b>, kas skatās tikai uz dažiem cipariem. Ir trīs veidu pazīmes.'),
          P('<b>① Mira la última cifra.</b> Entre <b>2</b> si acaba en 0, 2, 4, 6, 8 (es par). Entre <b>5</b> si acaba en 0 o 5. Entre <b>10</b> si acaba en 0. Ejemplo: 730 se divide entre 2, 5 y 10; 735 solo entre 5.',
            '<b>① Skaties uz pēdējo ciparu.</b> Ar <b>2</b>, ja beidzas ar 0, 2, 4, 6, 8 (pāra). Ar <b>5</b>, ja beidzas ar 0 vai 5. Ar <b>10</b>, ja beidzas ar 0. Piemērs: 730 dalās ar 2, 5 un 10; 735 tikai ar 5.'),
          P('<b>② Suma todas las cifras.</b> Entre <b>3</b> si la suma se divide entre 3. Entre <b>9</b> si la suma se divide entre 9. Ejemplo: 453 → 4+5+3 = 12 → 12 sí entre 3 → 453 es divisible entre 3 (pero no entre 9, porque 12 no lo es).',
            '<b>② Saskaiti visus ciparus.</b> Ar <b>3</b>, ja summa dalās ar 3. Ar <b>9</b>, ja summa dalās ar 9. Piemērs: 453 → 4+5+3 = 12 → 12 dalās ar 3 → 453 dalās ar 3 (bet ne ar 9, jo 12 ar 9 nedalās).'),
          P('<b>③ Mira las dos últimas cifras</b> para el <b>4</b>: 1316 → 16 : 4 = 4 justo → 1316 es divisible entre 4. Así se sabe si un año es bisiesto: 2028 sí (28 : 4 = 7) y 2030 no.',
            '<b>③ Skaties uz pēdējiem diviem cipariem</b> priekš <b>4</b>: 1316 → 16 : 4 = 4 tieši → 1316 dalās ar 4. Tā uzzina, vai gads ir garais: 2028 jā (28 : 4 = 7), 2030 nē.'),
          P('Y para el <b>6</b> tienen que cumplirse <b>dos</b> a la vez: entre 2 (par) <b>y</b> entre 3 (suma).',
            'Un priekš <b>6</b> jāizpildās <b>divām</b> vienlaikus: ar 2 (pāra) <b>un</b> ar 3 (summa).'),
          FIG(FIG_DIGITS,
            'Para el 2, el 5 y el 10 solo miras la <b>última cifra</b> (círculo verde). Para el 3 y el 9 <b>sumas todas</b> las cifras.',
            'Priekš 2, 5 un 10 skaties tikai uz <b>pēdējo ciparu</b> (zaļais aplis). Priekš 3 un 9 <b>saskaiti visus</b> ciparus.'),
          TAB([T('Divisible entre', 'Dalās ar'), T('Cómo se ve', 'Kā to pamanīt'), T('Ejemplo', 'Piemērs')], [
            ['2',  T('termina en 0, 2, 4, 6 u 8', 'beidzas ar 0, 2, 4, 6 vai 8'), '318 ✓ · 315 ✗'],
            ['3',  T('la <b>suma de sus cifras</b> es divisible entre 3', 'tā <b>ciparu summa</b> dalās ar 3'), '741 → 12 ✓'],
            ['4',  T('las <b>dos últimas cifras</b> forman un número divisible entre 4', 'pēdējie <b>divi cipari</b> veido skaitli, kas dalās ar 4'), '1 3<b>16</b> ✓ · 1 3<b>18</b> ✗'],
            ['5',  T('termina en 0 o en 5', 'beidzas ar 0 vai 5'), '905 ✓ · 902 ✗'],
            ['6',  T('divisible entre 2 <b>y</b> entre 3', 'dalās ar 2 <b>un</b> ar 3'), '414 ✓ (par, 4+1+4 = 9)'],
            ['9',  T('la suma de sus cifras es divisible entre 9', 'ciparu summa dalās ar 9'), '783 → 18 ✓'],
            ['10', T('termina en 0', 'beidzas ar 0'), '640 ✓ · 645 ✗']
          ]),
          ANIM('¿2376 es divisible entre 6?', 'Vai 2376 dalās ar 6?', [
            S('Para el 6 necesitamos dos cosas: que sea par y que la suma de cifras se divida entre 3.', 'Priekš 6 vajag divas lietas: pāra skaitli un ciparu summu, kas dalās ar 3.'),
            S('¿Par? Termina en 6 → <b>sí</b>.', 'Pāra? Beidzas ar 6 → <b>jā</b>.'),
            S('¿Suma? 2+3+7+6 = 18, y 18 : 3 = 6 justo → <b>sí</b>.', 'Summa? 2+3+7+6 = 18, un 18 : 3 = 6 tieši → <b>jā</b>.'),
            S('Cumple las dos → <b>2376 es divisible entre 6</b>. Comprobación: 2376 : 6 = 396.', 'Izpildās abas → <b>2376 dalās ar 6</b>. Pārbaude: 2376 : 6 = 396.')
          ]),
          EX('¿Cuáles de 2, 3, 4, 5, 6, 9 dividen a 1350?', 'Kuri no 2, 3, 4, 5, 6, 9 dala 1350?', [
            S('Acaba en 0 → sí entre <b>2</b> y entre <b>5</b> (y entre 10).', 'Beidzas ar 0 → dalās ar <b>2</b> un ar <b>5</b> (un ar 10).'),
            S('1+3+5+0 = 9 → sí entre <b>3</b> y entre <b>9</b>.', '1+3+5+0 = 9 → dalās ar <b>3</b> un ar <b>9</b>.'),
            S('Dos últimas cifras: 50, y 50 : 4 no es exacto → <b>no</b> entre 4.', 'Pēdējie divi cipari: 50, un 50 : 4 nav tieši → ar 4 <b>nedalās</b>.'),
            S('Entre 2 y entre 3 a la vez → también entre <b>6</b>.', 'Ar 2 un ar 3 vienlaikus → dalās arī ar <b>6</b>.')
          ]),
          REAL('348 € para repartir entre 3 hermanos: 3+4+8 = 15 → sí toca justo (116 € cada uno). ¿Y entre 4 amigos? 48 : 4 = 12 → también justo (87 € cada uno). ¿Y entre 5? Acaba en 8 → no, sobra dinero.',
               '348 € jāsadala 3 brāļiem: 3+4+8 = 15 → jā, sanāk tieši (116 € katram). Un 4 draugiem? 48 : 4 = 12 → arī tieši (87 € katram). Un 5? Beidzas ar 8 → nē, nauda paliek pāri.'),
          TRY('¿4725 es divisible entre 9? ¿Y entre 2?', 'Vai 4725 dalās ar 9? Un ar 2?',
              'Suma 4+7+2+5 = 18 → <b>sí</b> entre 9. Acaba en 5 (impar) → <b>no</b> entre 2.',
              'Summa 4+7+2+5 = 18 → ar 9 <b>dalās</b>. Beidzas ar 5 (nepāra) → ar 2 <b>nedalās</b>.')
        ]
      },
      /* ---------- 5 ---------- */
      {
        t: T('Números primos: los ladrillos', 'Pirmskaitļi: skaitļu “ķieģeļi”'),
        b: [
          KEY('Un <b>número primo</b> solo se puede dividir entre 1 y entre sí mismo. No hay forma de ponerlo en filas iguales (salvo una sola fila). Primos hasta 50: <b>2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47</b>.',
              '<b>Pirmskaitlis</b> dalās tikai ar 1 un pats ar sevi. To nevar sakārtot vienādās rindās (tikai vienā rindā). Pirmskaitļi līdz 50: <b>2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47</b>.'),
          FIG(FIG_PRIME,
            '7 puntos solo caben en una fila: 7 es <b>primo</b>. 12 puntos se pueden ordenar en 3 × 4 o en 2 × 6: 12 <b>no</b> es primo (se llama compuesto).',
            '7 punktus var sakārtot tikai vienā rindā: 7 ir <b>pirmskaitlis</b>. 12 punktus var sakārtot 3 × 4 vai 2 × 6: 12 <b>nav</b> pirmskaitlis (to sauc par saliktu skaitli).'),
          WARN('El <b>1 no es primo</b> (solo tiene un divisor). El <b>2 es el único primo par</b>. Y cuidado: 9, 15, 21, 27, 33 parecen “raros” pero no son primos: 9 = 3 · 3, 15 = 3 · 5, 21 = 3 · 7, 27 = 3 · 9, 33 = 3 · 11.',
               '<b>1 nav pirmskaitlis</b> (tam ir tikai viens dalītājs). <b>2 ir vienīgais pāra pirmskaitlis</b>. Uzmanies: 9, 15, 21, 27, 33 izskatās “savādi”, bet nav pirmskaitļi: 9 = 3 · 3, 15 = 3 · 5, 21 = 3 · 7, 27 = 3 · 9, 33 = 3 · 11.'),
          REAL('Los primos son los <b>ladrillos</b> de todos los números: cualquier número se construye multiplicando primos, como las moléculas se construyen con átomos. Las contraseñas de internet y los pagos con tarjeta se protegen con primos gigantes que ningún ordenador consigue descomponer.',
               'Pirmskaitļi ir visu skaitļu <b>ķieģeļi</b>: jebkuru skaitli var uzbūvēt, sareizinot pirmskaitļus, tāpat kā molekulas veido atomi. Interneta paroles un karšu maksājumus aizsargā milzīgi pirmskaitļi, kurus neviens dators nespēj sadalīt.'),
          ANIM('¿91 es primo?', 'Vai 91 ir pirmskaitlis?', [
            S('Probamos los primos pequeños en orden: 2, 3, 5, 7.', 'Pārbaudam mazos pirmskaitļus pēc kārtas: 2, 3, 5, 7.'),
            S('¿2? 91 es impar → no.', 'Vai 2? 91 ir nepāra → nē.'),
            S('¿3? 9+1 = 10, y 10 no se divide entre 3 → no.', 'Vai 3? 9+1 = 10, un 10 nedalās ar 3 → nē.'),
            S('¿5? No acaba en 0 ni en 5 → no.', 'Vai 5? Nebeidzas ar 0 vai 5 → nē.'),
            S('¿7? 7 · 13 = 91 → <b>¡cabe!</b> 91 = 7 · 13, así que 91 <b>no es primo</b>.', 'Vai 7? 7 · 13 = 91 → <b>der!</b> 91 = 7 · 13, tāpēc 91 <b>nav pirmskaitlis</b>.')
          ]),
          TIP('Para un número menor que 100 basta probar <b>2, 3, 5 y 7</b>. Si ninguno cabe, es primo. Ejemplo: 53 → impar, 5+3 = 8, no acaba en 5, y 7 · 7 = 49, 7 · 8 = 56 se lo saltan → <b>53 es primo</b>.',
              'Skaitlim, kas mazāks par 100, pietiek pārbaudīt <b>2, 3, 5 un 7</b>. Ja neviens neder, tas ir pirmskaitlis. Piemērs: 53 → nepāra, 5+3 = 8, nebeidzas ar 5, un 7 · 7 = 49, 7 · 8 = 56 to pārlec → <b>53 ir pirmskaitlis</b>.'),
          TRY('¿51 es primo?', 'Vai 51 ir pirmskaitlis?',
              'No: 5+1 = 6 → se divide entre 3. 51 = 3 · 17.',
              'Nē: 5+1 = 6 → dalās ar 3. 51 = 3 · 17.')
        ]
      },
      /* ---------- 6 ---------- */
      {
        t: T('Descomponer en primos: el árbol y la escalera', 'Sadalīšana pirmreizinātājos: koks un kāpnes'),
        b: [
          P('<b>Descomponer</b> un número es escribirlo como producto de primos, es decir, encontrar sus ladrillos. Se puede dibujar como un <b>árbol</b> o como una <b>escalera</b>; las dos formas dan el mismo resultado.',
            '<b>Sadalīt</b> skaitli nozīmē uzrakstīt to kā pirmskaitļu reizinājumu, tas ir, atrast tā ķieģeļus. To var zīmēt kā <b>koku</b> vai kā <b>kāpnes</b>; abi veidi dod vienu rezultātu.'),
          FIG(FIG_TREE,
            'Árbol de 180: parte el número en dos factores (180 = 18 · 10) y sigue partiendo hasta que todo sean primos (en verde). 180 = 2 · 2 · 3 · 3 · 5.',
            '180 koks: sadali skaitli divos reizinātājos (180 = 18 · 10) un turpini dalīt, kamēr visi ir pirmskaitļi (zaļie). 180 = 2 · 2 · 3 · 3 · 5.'),
          ANIM('La escalera de 180', '180 kāpnes', [
            S('Dividimos por el primo más pequeño que quepa, empezando por el 2: 180 : 2 = 90.', 'Dalām ar mazāko pirmskaitli, kas der, sākot ar 2: 180 : 2 = 90.'),
            S('Otra vez el 2: 90 : 2 = 45.', 'Vēlreiz 2: 90 : 2 = 45.'),
            S('45 es impar, el 2 ya no cabe. Probamos el 3: 45 : 3 = 15.', '45 ir nepāra, 2 vairs neder. Pārbaudam 3: 45 : 3 = 15.'),
            S('Otra vez el 3: 15 : 3 = 5.', 'Vēlreiz 3: 15 : 3 = 5.'),
            S('5 es primo: 5 : 5 = 1. Llegamos a 1 → <b>fin</b>.', '5 ir pirmskaitlis: 5 : 5 = 1. Nonākam pie 1 → <b>beigas</b>.'),
            S('Los divisores usados son la descomposición: 180 = 2 · 2 · 3 · 3 · 5 = <b>2² · 3² · 5</b>.', 'Izmantotie dalītāji ir sadalījums: 180 = 2 · 2 · 3 · 3 · 5 = <b>2² · 3² · 5</b>.')
          ]),
          KEY('Se escribe con <b>potencias</b>: 2 · 2 = 2², 3 · 3 = 3². Así 180 = 2² · 3² · 5. El “2²” solo significa “el 2 aparece dos veces”.',
              'Raksta ar <b>pakāpēm</b>: 2 · 2 = 2², 3 · 3 = 3². Tā 180 = 2² · 3² · 5. “2²” nozīmē tikai “2 parādās divas reizes”.'),
          TIP('Orden para probar: primero el 2 todas las veces que puedas, luego el 3, luego el 5, luego el 7… Usa los trucos de la sección anterior para saber si cabe. Cuando llegues a 1, has terminado.',
              'Pārbaudes kārtība: vispirms 2 tik reižu, cik var, tad 3, tad 5, tad 7… Izmanto iepriekšējās sadaļas pazīmes, lai zinātu, vai der. Kad nonāc pie 1, esi pabeidzis.'),
          EX('Descompón 84', 'Sadali 84 pirmreizinātājos', [
            S('84 : 2 = 42', '84 : 2 = 42'),
            S('42 : 2 = 21', '42 : 2 = 21'),
            S('21 ya no es par; 2+1 = 3 → cabe el 3: 21 : 3 = 7', '21 vairs nav pāra; 2+1 = 3 → der 3: 21 : 3 = 7'),
            S('7 : 7 = 1 → <b>84 = 2² · 3 · 7</b>', '7 : 7 = 1 → <b>84 = 2² · 3 · 7</b>')
          ]),
          EX('Descompón 100', 'Sadali 100 pirmreizinātājos', [
            S('100 : 2 = 50', '100 : 2 = 50'),
            S('50 : 2 = 25', '50 : 2 = 25'),
            S('25 acaba en 5 → cabe el 5: 25 : 5 = 5', '25 beidzas ar 5 → der 5: 25 : 5 = 5'),
            S('5 : 5 = 1 → <b>100 = 2² · 5²</b>', '5 : 5 = 1 → <b>100 = 2² · 5²</b>')
          ]),
          REAL('¿Para qué sirve? Para <b>simplificar fracciones</b> (60/84: los dos tienen 2² · 3, se quita y queda 5/7), para calcular el <b>MCD y el mcm</b> de las dos secciones siguientes, y para saber de cuántas formas se pueden ordenar cosas en filas.',
               'Kam tas noder? Lai <b>saīsinātu daļas</b> (60/84: abiem ir 2² · 3, to noņem un paliek 5/7), lai aprēķinātu <b>LKD un MKD</b> nākamajās divās sadaļās, un lai zinātu, cik veidos lietas var sakārtot rindās.'),
          TRY('Descompón 60.', 'Sadali 60 pirmreizinātājos.',
              '60 : 2 = 30, 30 : 2 = 15, 15 : 3 = 5, 5 : 5 = 1 → <b>60 = 2² · 3 · 5</b>.',
              '60 : 2 = 30, 30 : 2 = 15, 15 : 3 = 5, 5 : 5 = 1 → <b>60 = 2² · 3 · 5</b>.')
        ]
      },
      /* ---------- 7 ---------- */
      {
        t: T('MCD: lo más grande que cabe en los dos', 'LKD: lielākais, kas der abiem'),
        b: [
          P('Tienes <b>24 lápices y 36 gomas</b> y quieres hacer bolsas <b>iguales</b> (todas con los mismos lápices y las mismas gomas) sin que sobre nada. ¿Cuántas bolsas puedes hacer como máximo? Necesitas un número que divida a 24 <b>y</b> a 36, y el más grande posible. Eso es el <b>MCD</b>: máximo común divisor.',
            'Tev ir <b>24 zīmuļi un 36 dzēšgumijas</b>, un gribi salikt <b>vienādus</b> maisiņus (visos vienāds zīmuļu un dzēšgumiju skaits), lai nekas nepaliek pāri. Cik maisiņu var izveidot maksimāli? Vajag skaitli, kas dala 24 <b>un</b> 36, un pēc iespējas lielāku. Tas ir <b>LKD</b>: lielākais kopīgais dalītājs.'),
          FIG(FIG_BAGS,
            '12 bolsas: en cada una van 2 lápices (24 : 12) y 3 gomas (36 : 12). Con 13 bolsas ya no saldría justo.',
            '12 maisiņi: katrā 2 zīmuļi (24 : 12) un 3 dzēšgumijas (36 : 12). Ar 13 maisiņiem tieši vairs nesanāktu.'),
          ANIM('MCD(24, 36) con listas de divisores', 'LKD(24, 36) ar dalītāju sarakstiem', [
            S('Divisores de 24: 1, 2, 3, 4, 6, 8, 12, 24.', '24 dalītāji: 1, 2, 3, 4, 6, 8, 12, 24.'),
            S('Divisores de 36: 1, 2, 3, 4, 6, 9, 12, 18, 36.', '36 dalītāji: 1, 2, 3, 4, 6, 9, 12, 18, 36.'),
            S('Los que están en las dos listas (comunes): 1, 2, 3, 4, 6, 12.', 'Tie, kas ir abos sarakstos (kopīgie): 1, 2, 3, 4, 6, 12.'),
            S('El más grande: <b>MCD(24, 36) = 12</b>.', 'Lielākais: <b>LKD(24, 36) = 12</b>.')
          ]),
          EX('MCD(24, 36) con primos (el método rápido)', 'LKD(24, 36) ar pirmskaitļiem (ātrais veids)', [
            S('24 = 2 · 2 · 2 · 3 = 2³ · 3', '24 = 2 · 2 · 2 · 3 = 2³ · 3'),
            S('36 = 2 · 2 · 3 · 3 = 2² · 3²', '36 = 2 · 2 · 3 · 3 = 2² · 3²'),
            S('Cogemos solo los primos que están <b>en los dos</b>, con el exponente <b>más pequeño</b>: 2² · 3 = <b>12</b>.', 'Ņemam tikai pirmskaitļus, kas ir <b>abos</b>, ar <b>mazāko</b> kāpinātāju: 2² · 3 = <b>12</b>.')
          ]),
          REAL('Cortar dos cintas de 24 cm y 36 cm en trozos iguales lo más largos posible → trozos de 12 cm. Cubrir un suelo de 24 × 36 con baldosas cuadradas lo más grandes posible → baldosas de 12 × 12. Simplificar la fracción 24/36 → dividir arriba y abajo entre 12 → 2/3.',
               'Sagriezt divas lentes 24 cm un 36 cm vienādos, pēc iespējas garākos gabalos → 12 cm gabali. Noklāt 24 × 36 grīdu ar pēc iespējas lielākām kvadrātveida flīzēm → 12 × 12 flīzes. Saīsināt daļu 24/36 → dalīt augšu un apakšu ar 12 → 2/3.'),
          TRY('MCD(18, 30)', 'LKD(18, 30)',
              'Divisores de 18: 1, 2, 3, 6, 9, 18. De 30: 1, 2, 3, 5, 6, 10, 15, 30. Comunes: 1, 2, 3, 6 → <b>MCD = 6</b>.',
              '18 dalītāji: 1, 2, 3, 6, 9, 18. 30: 1, 2, 3, 5, 6, 10, 15, 30. Kopīgie: 1, 2, 3, 6 → <b>LKD = 6</b>.')
        ]
      },
      /* ---------- 8 ---------- */
      {
        t: T('mcm: cuándo vuelven a coincidir', 'MKD: kad atkal sakritīs'),
        b: [
          P('Un autobús sale <b>cada 12 minutos</b> y otro <b>cada 18</b>. Ahora salen juntos. ¿Cuándo volverán a salir juntos? Buscamos el primer número que está en la tabla del 12 <b>y</b> en la del 18: el <b>mcm</b>, mínimo común múltiplo.',
            'Viens autobuss izbrauc <b>ik pēc 12 minūtēm</b>, otrs <b>ik pēc 18</b>. Tagad tie izbrauc kopā. Kad tie atkal izbrauks kopā? Meklējam pirmo skaitli, kas ir gan 12, gan 18 reizināšanas tabulā: <b>MKD</b>, mazākais kopīgais dalāmais.'),
          FIG(FIG_BUSES,
            'Saltos de 12 (arriba, morado) y saltos de 18 (abajo, verde). La primera vez que caen en el mismo sitio es en el <b>36</b>; la siguiente, en el 72.',
            'Lēcieni pa 12 (augšā, violeti) un pa 18 (apakšā, zaļi). Pirmo reizi tie nonāk vienā vietā uz <b>36</b>; nākamo reizi uz 72.'),
          ANIM('mcm(12, 18) con listas de múltiplos', 'MKD(12, 18) ar dalāmo sarakstiem', [
            S('Múltiplos de 12: 12, 24, 36, 48, 60, 72…', '12 dalāmie: 12, 24, 36, 48, 60, 72…'),
            S('Múltiplos de 18: 18, 36, 54, 72…', '18 dalāmie: 18, 36, 54, 72…'),
            S('El primero que está en las dos listas: <b>mcm(12, 18) = 36</b>. Los autobuses vuelven a coincidir a los 36 minutos.', 'Pirmais, kas ir abos sarakstos: <b>MKD(12, 18) = 36</b>. Autobusi atkal sakrīt pēc 36 minūtēm.')
          ]),
          EX('mcm(12, 18) con primos (el método rápido)', 'MKD(12, 18) ar pirmskaitļiem (ātrais veids)', [
            S('12 = 2² · 3', '12 = 2² · 3'),
            S('18 = 2 · 3²', '18 = 2 · 3²'),
            S('Cogemos <b>todos</b> los primos que aparecen, cada uno con el exponente <b>más grande</b>: 2² · 3² = <b>36</b>.', 'Ņemam <b>visus</b> pirmskaitļus, kas parādās, katru ar <b>lielāko</b> kāpinātāju: 2² · 3² = <b>36</b>.')
          ]),
          REAL('Riegas una planta cada 4 días y otra cada 6: las riegas juntas cada 12 días (mcm). Las salchichas vienen en paquetes de 10 y los panecillos en paquetes de 8: para que no sobre nada necesitas 40 de cada (mcm = 40). Y para sumar 1/12 + 1/18 necesitas el denominador común, que es 36.',
               'Vienu augu laisti ik pēc 4 dienām, citu ik pēc 6: abus kopā laisti ik pēc 12 dienām (MKD). Desiņas pārdod pa 10, maizītes pa 8: lai nekas nepaliek pāri, vajag 40 no katra (MKD = 40). Un lai saskaitītu 1/12 + 1/18, vajag kopsaucēju, kas ir 36.'),
          TIP('Comprobación rápida: <b>MCD · mcm = producto de los dos números</b>. Para 12 y 18: MCD = 6, mcm = 36 → 6 · 36 = 216 = 12 · 18 ✓.',
              'Ātra pārbaude: <b>LKD · MKD = abu skaitļu reizinājums</b>. Priekš 12 un 18: LKD = 6, MKD = 36 → 6 · 36 = 216 = 12 · 18 ✓.'),
          TRY('mcm(8, 12)', 'MKD(8, 12)',
              'Múltiplos de 8: 8, 16, <b>24</b>… Múltiplos de 12: 12, <b>24</b>… → mcm = 24.',
              '8 dalāmie: 8, 16, <b>24</b>… 12 dalāmie: 12, <b>24</b>… → MKD = 24.')
        ]
      },
      /* ---------- 9 ---------- */
      {
        t: T('¿MCD o mcm? Cómo elegir en un problema', 'LKD vai MKD? Kā izvēlēties uzdevumā'),
        b: [
          TAB([T('Si el problema dice…', 'Ja uzdevumā teikts…'), T('Usa', 'Lieto')], [
            [T('repartir, cortar en trozos iguales, hacer grupos iguales, “el mayor”, “lo más grande posible”', 'sadalīt, sagriezt vienādos gabalos, veidot vienādas grupas, “lielākais”, “pēc iespējas lielāks”'), T('<b>MCD</b> (LKD)', '<b>LKD</b>')],
            [T('volver a coincidir, “cada X días”, “el menor”, “lo más pequeño posible”, denominador común', 'atkal sakrist, “ik pēc X dienām”, “mazākais”, “pēc iespējas mazāks”, kopsaucējs'), T('<b>mcm</b> (MKD)', '<b>MKD</b>')]
          ]),
          TIP('El MCD siempre es <b>menor o igual</b> que los números (es un divisor). El mcm siempre es <b>mayor o igual</b> (es un múltiplo). Si te sale un MCD más grande que los números, algo ha fallado.',
              'LKD vienmēr ir <b>mazāks vai vienāds</b> ar skaitļiem (tas ir dalītājs). MKD vienmēr ir <b>lielāks vai vienāds</b> (tas ir dalāmais). Ja LKD sanāk lielāks par skaitļiem, kaut kas nav pareizi.'),
          TIP('Si un número es divisor del otro (por ejemplo 6 y 18): MCD = el pequeño (6) y mcm = el grande (18). Se resuelve en un segundo.',
              'Ja viens skaitlis ir otra dalītājs (piem., 6 un 18): LKD = mazākais (6), MKD = lielākais (18). Atrisinās vienā mirklī.'),
          EX('Dos problemas: ¿MCD o mcm?', 'Divi uzdevumi: LKD vai MKD?', [
            S('“Tengo 30 rosas y 45 tulipanes y quiero hacer ramos iguales, el mayor número posible.” → repartir + el mayor → <b>MCD(30, 45) = 15</b> ramos (con 2 rosas y 3 tulipanes cada uno).', '“Man ir 30 rozes un 45 tulpes, gribu salikt vienādus pušķus, pēc iespējas vairāk.” → sadalīt + lielākais → <b>LKD(30, 45) = 15</b> pušķi (katrā 2 rozes un 3 tulpes).'),
            S('“Anna va a la piscina cada 6 días y Juris cada 8. Hoy se han visto. ¿Dentro de cuántos días se volverán a ver?” → coincidir → <b>mcm(6, 8) = 24</b> días.', '“Anna iet uz baseinu ik pēc 6 dienām, Juris ik pēc 8. Šodien viņi satikās. Pēc cik dienām viņi satiksies atkal?” → sakrist → <b>MKD(6, 8) = 24</b> dienas.')
          ]),
          TRY('Un suelo de 60 × 84 cm se cubre con baldosas cuadradas lo más grandes posible. ¿De qué lado?', 'Grīdu 60 × 84 cm noklāj ar pēc iespējas lielākām kvadrātveida flīzēm. Kāda ir flīzes mala?',
              '“Lo más grande” + que quepan justo → MCD(60, 84). 60 = 2² · 3 · 5, 84 = 2² · 3 · 7 → 2² · 3 = <b>12 cm</b>.',
              '“Pēc iespējas lielāks” + lai sanāk tieši → LKD(60, 84). 60 = 2² · 3 · 5, 84 = 2² · 3 · 7 → 2² · 3 = <b>12 cm</b>.')
        ]
      },
      /* ---------- 10 ---------- */
      {
        t: T('Dónde aparece en el examen', 'Kur tas parādās pārbaudījumā'),
        b: [
          LIST([
            T('“¿Cuántos de los tres múltiplos más pequeños de 15 son divisibles entre 6?” → 15, 30, 45 → solo el 30 → 1.', '“Cik no skaitļa 15 trim mazākajiem dalāmajiem dalās ar 6?” → 15, 30, 45 → tikai 30 → 1.'),
            T('“¿Cuál de estos números es divisible entre 3 / 4 / 9?” → usa los trucos de las cifras.', '“Kurš no šiem skaitļiem dalās ar 3 / 4 / 9?” → lieto ciparu pazīmes.'),
            T('“Escribe todos los divisores de…” → búscalos en parejas.', '“Uzraksti visus … dalītājus” → meklē pāros.'),
            T('Dos autobuses salen cada 12 y cada 18 minutos: ¿cuándo coinciden? → mcm.', 'Divi autobusi izbrauc ik pēc 12 un 18 minūtēm: kad sakritīs? → MKD.'),
            T('Repartir 24 lápices y 36 gomas en bolsas iguales → MCD.', 'Sadalīt 24 zīmuļus un 36 dzēšgumijas vienādos maisiņos → LKD.'),
            T('Simplificar una fracción como 24/36 → divide arriba y abajo entre el MCD.', 'Saīsināt daļu, piem., 24/36 → dali augšu un apakšu ar LKD.')
          ])
        ]
      }
    ]
  };

  /* =====================================================
     2 · FRACCIONES
     ===================================================== */
  L.frac = {
    sections: [
      {
        t: T('Ampliar, simplificar y comparar', 'Paplašināt, saīsināt un salīdzināt'),
        b: [
          P('Multiplicar o dividir <b>arriba y abajo</b> por el mismo número no cambia el valor de la fracción: ' +
            F(2,3) + ' = ' + F(4,6) + ' = ' + F(20,30) + '.',
            'Reizinot vai dalot <b>skaitītāju un saucēju</b> ar vienu un to pašu skaitli, daļas vērtība nemainās: ' +
            F(2,3) + ' = ' + F(4,6) + ' = ' + F(20,30) + '.'),
          P('Para <b>comparar</b> dos fracciones se pasan al mismo denominador (el mcm de los denominadores) y se comparan los numeradores.',
            'Lai <b>salīdzinātu</b> divas daļas, tās pārveido ar kopsaucēju (saucēju MKD) un salīdzina skaitītājus.'),
          EX('Compara ' + F(9,14) + ' y ' + F(10,21), 'Salīdzini ' + F(9,14) + ' un ' + F(10,21), [
            S('mcm(14, 21) = 42', 'MKD(14; 21) = 42'),
            S(F(9,14) + ' = ' + F(27,42) + ' &nbsp;y&nbsp; ' + F(10,21) + ' = ' + F(20,42), F(9,14) + ' = ' + F(27,42) + ' &nbsp;un&nbsp; ' + F(10,21) + ' = ' + F(20,42)),
            S('27 > 20, así que ' + F(9,14) + ' <b>&gt;</b> ' + F(10,21), '27 > 20, tātad ' + F(9,14) + ' <b>&gt;</b> ' + F(10,21))
          ]),
          TIP('Truco rápido: si los numeradores son iguales, gana la de <b>denominador más pequeño</b> (' + F(3,5) + ' &gt; ' + F(3,8) + '): el mismo número de trozos, pero más grandes.',
              'Ātrs paņēmiens: ja skaitītāji vienādi, lielāka ir daļa ar <b>mazāko saucēju</b> (' + F(3,5) + ' &gt; ' + F(3,8) + ') — tikpat daudz gabalu, bet lielāki.')
        ]
      },
      {
        t: T('Mixto ↔ impropia', 'Jaukts skaitlis ↔ neīstā daļa'),
        b: [
          P('De impropia a mixto se <b>divide</b>: ' + F(17,5) + ' → 17 : 5 = 3 y sobran 2 → ' + FM(17,5) + '.',
            'No neīstās daļas uz jauktu skaitli <b>dala</b>: ' + F(17,5) + ' → 17 : 5 = 3, atlikums 2 → ' + FM(17,5) + '.'),
          P('De mixto a impropia se <b>multiplica y suma</b>: ' + FM(17,5) + ' → 3 · 5 + 2 = 17 → ' + F(17,5) + '.',
            'No jaukta skaitļa uz neīsto daļu <b>reizina un pieskaita</b>: ' + FM(17,5) + ' → 3 · 5 + 2 = 17 → ' + F(17,5) + '.'),
          KEY('Para <b>multiplicar y dividir</b> hay que pasar SIEMPRE a fracción impropia primero.',
              '<b>Reizinot un dalot</b>, VIENMĒR vispirms jāpārveido par neīsto daļu.')
        ]
      },
      {
        t: T('Sumar y restar', 'Saskaitīšana un atņemšana'),
        b: [
          KEY('Sumar y restar exige <b>el mismo denominador</b>. El numerador cambia; el denominador se queda.',
              'Saskaitot un atņemot, nepieciešams <b>vienāds saucējs</b>. Mainās skaitītājs, saucējs paliek.'),
          EX('Calcula ' + F(4,21) + ' + ' + F(3,14), 'Aprēķini ' + F(4,21) + ' + ' + F(3,14), [
            S('mcm(21, 14) = 42', 'MKD(21; 14) = 42'),
            S(F(4,21) + ' = ' + F(8,42) + ' (×2), &nbsp;' + F(3,14) + ' = ' + F(9,42) + ' (×3)', F(4,21) + ' = ' + F(8,42) + ' (×2), &nbsp;' + F(3,14) + ' = ' + F(9,42) + ' (×3)'),
            S(F(8,42) + ' + ' + F(9,42) + ' = ' + F(17,42) + ' (ya no se simplifica)', F(8,42) + ' + ' + F(9,42) + ' = ' + F(17,42) + ' (vairs nesaīsinās)')
          ]),
          EX('Resta con préstamo: ' + FM(85,12) + ' − ' + FM(49,9), 'Atņemšana ar aizņemšanos: ' + FM(85,12) + ' − ' + FM(49,9), [
            S('Denominador común 36: ' + FM(85,12) + ' = 7 ' + F(3,36) + ' &nbsp;y&nbsp; ' + FM(49,9) + ' = 5 ' + F(16,36), 'Kopsaucējs 36: ' + FM(85,12) + ' = 7 ' + F(3,36) + ' &nbsp;un&nbsp; ' + FM(49,9) + ' = 5 ' + F(16,36)),
            S('3 &lt; 16, así que “pedimos prestada” una unidad: 7 ' + F(3,36) + ' = 6 ' + F(39,36), '3 &lt; 16, tāpēc “aizņemamies” vienu veselo: 7 ' + F(3,36) + ' = 6 ' + F(39,36)),
            S('6 ' + F(39,36) + ' − 5 ' + F(16,36) + ' = <b>1 ' + F(23,36) + '</b>', '6 ' + F(39,36) + ' − 5 ' + F(16,36) + ' = <b>1 ' + F(23,36) + '</b>')
          ])
        ]
      },
      {
        t: T('Multiplicar y dividir', 'Reizināšana un dalīšana'),
        b: [
          P('<b>Multiplicar:</b> numerador por numerador y denominador por denominador. <b>Simplifica en cruz antes</b> de multiplicar: los números se quedan pequeños y no hay que simplificar al final.',
            '<b>Reizināšana:</b> skaitītāju ar skaitītāju, saucēju ar saucēju. <b>Vispirms saīsini krustām</b> — skaitļi paliek mazi.'),
          P('<b>Dividir:</b> se multiplica por el <b>recíproco</b> (se da la vuelta a la segunda fracción). Dividir entre ' + F(1,3) + ' es lo mismo que multiplicar por 3.',
            '<b>Dalīšana:</b> reizina ar <b>apgriezto</b> daļu (otro daļu apgriež otrādi). Dalīt ar ' + F(1,3) + ' ir tas pats, kas reizināt ar 3.'),
          EX('Calcula ' + F(4,9) + ' · ' + FM(9,7), 'Aprēķini ' + F(4,9) + ' · ' + FM(9,7), [
            S('Impropia: ' + FM(9,7) + ' = ' + F(9,7), 'Neīstā daļa: ' + FM(9,7) + ' = ' + F(9,7)),
            S(F(4,9) + ' · ' + F(9,7) + ' → el 9 de arriba se cancela con el 9 de abajo', F(4,9) + ' · ' + F(9,7) + ' → 9 saīsinās ar 9'),
            S('Queda ' + F(4,7), 'Paliek ' + F(4,7))
          ]),
          EX('Calcula ' + FM(10,3) + ' : ' + F(1,3), 'Aprēķini ' + FM(10,3) + ' : ' + F(1,3), [
            S(FM(10,3) + ' = ' + F(10,3), FM(10,3) + ' = ' + F(10,3)),
            S('Dividir entre ' + F(1,3) + ' = multiplicar por ' + F(3,1) + ': ' + F(10,3) + ' · ' + F(3,1) + ' = <b>10</b>', 'Dalīt ar ' + F(1,3) + ' = reizināt ar 3: ' + F(10,3) + ' · 3 = <b>10</b>')
          ]),
          WARN('Al dividir, el resultado puede ser <b>mayor</b> que el número inicial. No es un error: dividir entre un número menor que 1 agranda.',
               'Dalot rezultāts var būt <b>lielāks</b> nekā sākotnējais skaitlis. Tā nav kļūda: dalot ar skaitli, kas mazāks par 1, rezultāts palielinās.')
        ]
      },
      {
        t: T('Fracción de un número y recíprocos', 'Daļa no skaitļa un apgrieztie skaitļi'),
        b: [
          P('“' + F(3,5) + ' de 40” significa 40 : 5 · 3 = 24. <b>Divide entre el denominador y multiplica por el numerador.</b>',
            '“' + F(3,5) + ' no 40” nozīmē 40 : 5 · 3 = 24. <b>Dali ar saucēju, reizini ar skaitītāju.</b>'),
          P('Al revés: si ' + F(3,5) + ' de X son 15, entonces ' + F(1,5) + ' de X = 5 y X = 25.',
            'Otrādi: ja ' + F(3,5) + ' no X ir 15, tad ' + F(1,5) + ' no X = 5 un X = 25.'),
          KEY('Dos números son <b>recíprocos</b> (letón <i>savstarpēji apgriezti</i>) cuando su producto es 1: ' + F(3,7) + ' y ' + F(7,3) + '; 5 y ' + F(1,5) + '.',
              'Divi skaitļi ir <b>savstarpēji apgriezti</b>, ja to reizinājums ir 1: ' + F(3,7) + ' un ' + F(7,3) + '; 5 un ' + F(1,5) + '.')
        ]
      }
    ]
  };

  /* =====================================================
     3 · DECIMALES
     ===================================================== */
  L.dec = {
    sections: [
      {
        t: T('Sumar, restar, multiplicar, dividir', 'Saskaitīt, atņemt, reizināt, dalīt'),
        b: [
          P('<b>Sumar y restar:</b> se alinean las comas y se rellena con ceros. 20 − 6,73 → 20,00 − 6,73 = 13,27.',
            '<b>Saskaitot un atņemot:</b> komats zem komata, tukšās vietas aizpilda ar nullēm. 20 − 6,73 → 20,00 − 6,73 = 13,27.'),
          P('<b>Multiplicar:</b> se multiplica sin comas y al final se cuentan <b>todas</b> las cifras decimales de los dos factores.',
            '<b>Reizinot:</b> reizina bez komatiem, tad saskaita <b>visus</b> abu reizinātāju decimālciparus.'),
          EX('0,12 · 0,3', '0,12 · 0,3', [
            S('12 · 3 = 36', '12 · 3 = 36'),
            S('2 decimales + 1 decimal = 3 decimales', '2 cipari + 1 cipars = 3 decimālcipari'),
            S('Resultado: <b>0,036</b>', 'Rezultāts: <b>0,036</b>')
          ]),
          P('<b>Dividir:</b> se corre la coma del divisor hasta que sea entero y se corre la del dividendo <b>lo mismo</b>.',
            '<b>Dalot:</b> dalītājā komatu pārbīda, līdz tas kļūst par veselu skaitli, un tikpat pārbīda dalāmajā.'),
          EX('4,44 : 0,4', '4,44 : 0,4', [
            S('Ambos ×10 → 44,4 : 4', 'Abus ×10 → 44,4 : 4'),
            S('44,4 : 4 = <b>11,1</b>', '44,4 : 4 = <b>11,1</b>')
          ])
        ]
      },
      {
        t: T('Multiplicar y dividir por 10, 100, 0,1…', 'Reizināt un dalīt ar 10, 100, 0,1…'),
        b: [
          KEY('· 10 → coma <b>una a la derecha</b> &nbsp;|&nbsp; : 10 → coma <b>una a la izquierda</b><br>· 0,1 <b>es lo mismo que</b> : 10 &nbsp;|&nbsp; : 0,1 <b>es lo mismo que</b> · 10',
              '· 10 → komatu <b>pa labi</b> &nbsp;|&nbsp; : 10 → komatu <b>pa kreisi</b><br>· 0,1 <b>ir tas pats, kas</b> : 10 &nbsp;|&nbsp; : 0,1 <b>ir tas pats, kas</b> · 10'),
          P('Esto salió en el examen de 2025 como pregunta de verdadero/falso: 20,02 · 0,1 y 20,02 : 10 valen lo mismo (2,002). <b>Verdadero.</b>',
            'Tas 2025. gadā bija jautājums “patiess vai aplams”: 20,02 · 0,1 un 20,02 : 10 vērtības ir vienādas (2,002). <b>Patiess.</b>')
        ]
      },
      {
        t: T('Fracción ↔ decimal ↔ porcentaje', 'Daļa ↔ decimāldaļa ↔ procenti'),
        b: [
          P('Aprenderse esta tabla ahorra muchísimo tiempo en la Parte A.',
            'Šīs tabulas iemācīšanās ietaupa daudz laika A daļā.'),
          TAB([T('Fracción', 'Daļa'), T('Decimal', 'Decimāldaļa'), T('Porcentaje', 'Procenti')], [
            [F(1,2), '0,5', '50 %'], [F(1,4), '0,25', '25 %'], [F(3,4), '0,75', '75 %'],
            [F(1,5), '0,2', '20 %'], [F(2,5), '0,4', '40 %'], [F(1,8), '0,125', '12,5 %'],
            [F(3,8), '0,375', '37,5 %'], [F(1,10), '0,1', '10 %'], [F(1,20), '0,05', '5 %'],
            [F(1,3), '0,333…', '33,3 %']
          ]),
          P('Para pasar de fracción a decimal: <b>numerador : denominador</b>. Para pasar de decimal a fracción: se escribe sobre 10, 100 o 1000 y se simplifica. 0,35 = ' + F(35,100) + ' = ' + F(7,20) + '.',
            'No daļas uz decimāldaļu: <b>skaitītājs : saucējs</b>. No decimāldaļas uz daļu: raksta virs 10, 100 vai 1000 un saīsina. 0,35 = ' + F(35,100) + ' = ' + F(7,20) + '.'),
          WARN('Si en una operación aparece ' + F(1,3) + ', ' + F(2,3) + ' o ' + F(1,6) + ' (sin decimal exacto), <b>pasa todo a fracciones</b>. Mezclarlo con decimales redondeados da respuesta incorrecta.',
               'Ja izteiksmē ir ' + F(1,3) + ', ' + F(2,3) + ' vai ' + F(1,6) + ' (bez precīzas decimāldaļas), <b>pārveido visu par daļām</b>. Sajaukums ar noapaļotām decimāldaļām dod nepareizu atbildi.')
        ]
      },
      {
        t: T('Redondear', 'Noapaļošana'),
        b: [
          P('Se mira la <b>primera cifra que se va</b>. Si es 5 o más, la anterior sube; si es menor, se queda igual.',
            'Skatās uz <b>pirmo ciparu, ko atmet</b>. Ja tas ir 5 vai lielāks, iepriekšējais palielinās; ja mazāks — paliek.'),
          EX('Redondea 12,4963', 'Noapaļo 12,4963', [
            S('A unidades: la cifra que sigue es 4 → <b>12</b>', 'Līdz veseliem: nākamais cipars 4 → <b>12</b>'),
            S('A décimas: sigue el 9 → <b>12,5</b>', 'Līdz desmitdaļām: nākamais 9 → <b>12,5</b>'),
            S('A centésimas: sigue el 6 → <b>12,50</b>', 'Līdz simtdaļām: nākamais 6 → <b>12,50</b>')
          ])
        ]
      }
    ]
  };

  /* =====================================================
     4 · NÚMEROS NEGATIVOS
     ===================================================== */
  L.neg = {
    sections: [
      {
        t: T('La recta numérica y el módulo', 'Skaitļu ass un modulis'),
        b: [
          P('En la recta, <b>a la derecha siempre es mayor</b>: −7 &lt; −3 &lt; 0 &lt; 2 &lt; 5. Todo negativo es menor que cualquier positivo.',
            'Uz skaitļu ass <b>pa labi vienmēr ir lielāks</b>: −7 &lt; −3 &lt; 0 &lt; 2 &lt; 5. Jebkurš negatīvs skaitlis ir mazāks par jebkuru pozitīvu.'),
          P('El <b>módulo</b> |a| es la <b>distancia al cero</b>, y por eso nunca es negativo: |−7| = 7, |7| = 7, |0| = 0.',
            '<b>Modulis</b> |a| ir <b>attālums līdz nullei</b>, tāpēc tas nekad nav negatīvs: |−7| = 7, |7| = 7, |0| = 0.'),
          WARN('Trampa clásica del examen: “el número mayor tiene mayor módulo”. Es <b>falso</b>: −3 &gt; −7 pero |−3| = 3 &lt; |−7| = 7.',
               'Klasisks slazds: “lielāka skaitļa modulis ir lielāks”. Tas ir <b>aplams</b>: −3 &gt; −7, bet |−3| = 3 &lt; |−7| = 7.'),
          P('Dos números son <b>opuestos</b> (letón <i>pretēji</i>) si tienen el mismo módulo y distinto signo. Suman 0: −4 y 4.',
            'Divi skaitļi ir <b>pretēji</b>, ja tiem ir vienāds modulis un dažādas zīmes. To summa ir 0: −4 un 4.')
        ]
      },
      {
        t: T('Sumar y restar', 'Saskaitīšana un atņemšana'),
        b: [
          KEY('<b>Mismo signo:</b> se suman los módulos y se conserva el signo → (−3) + (−5) = −8.<br><b>Signos distintos:</b> se resta el pequeño del grande y se pone el signo del que tiene mayor módulo → (−9) + 4 = −5.',
              '<b>Vienādas zīmes:</b> moduļus saskaita, zīme paliek → (−3) + (−5) = −8.<br><b>Dažādas zīmes:</b> no lielākā moduļa atņem mazāko, zīme — kā lielākajam modulim → (−9) + 4 = −5.'),
          P('<b>Restar es sumar el opuesto:</b> a − b = a + (−b). Por eso 5 − (−3) = 5 + 3 = 8.',
            '<b>Atņemt nozīmē pieskaitīt pretējo:</b> a − b = a + (−b). Tāpēc 5 − (−3) = 5 + 3 = 8.'),
          TIP('Piensa en dinero: negativo = deuda. −9 € de deuda y pagas 4 € → te quedan −5 € de deuda.',
              'Iedomājies naudu: negatīvs = parāds. −9 € parāds un samaksā 4 € → paliek −5 €.')
        ]
      },
      {
        t: T('Multiplicar y dividir: la regla de los signos', 'Reizināšana un dalīšana: zīmju likums'),
        b: [
          TAB([T('Operación', 'Darbība'), T('Signo', 'Zīme'), T('Ejemplo', 'Piemērs')], [
            ['(+) · (+)', '+', '3 · 4 = 12'],
            ['(−) · (−)', '+', '(−6) · (−7) = 42'],
            ['(+) · (−)', '−', '5 · (−3) = −15'],
            ['(−) : (+)', '−', '(−48) : 8 = −6'],
            ['(−) : (−)', '+', '−36 : (−4) = 9']
          ]),
          KEY('Signos <b>iguales → positivo</b>. Signos <b>distintos → negativo</b>. Con varios factores: cuenta los negativos; si son <b>pares</b>, el resultado es positivo.',
              '<b>Vienādas zīmes → pozitīvs</b>. <b>Dažādas zīmes → negatīvs</b>. Ja reizinātāju daudz: saskaiti negatīvos; ja to skaits ir <b>pāra</b>, rezultāts ir pozitīvs.')
        ]
      },
      {
        t: T('Quitar paréntesis', 'Iekavu atvēršana'),
        b: [
          KEY('Con <b>+</b> delante, todo queda igual: +(a − b) = a − b.<br>Con <b>−</b> delante, <b>todos los signos cambian</b>: −(a − b) = −a + b.',
              'Ja priekšā <b>+</b>, viss paliek: +(a − b) = a − b.<br>Ja priekšā <b>−</b>, <b>visas zīmes mainās</b>: −(a − b) = −a + b.'),
          EX('Calcula −36 : (−4) + 5 · (−3) − (−8)', 'Aprēķini −36 : (−4) + 5 · (−3) − (−8)', [
            S('−36 : (−4) = +9 &nbsp;(signos iguales)', '−36 : (−4) = +9 &nbsp;(vienādas zīmes)'),
            S('5 · (−3) = −15', '5 · (−3) = −15'),
            S('− (−8) = +8', '− (−8) = +8'),
            S('9 − 15 + 8 = <b>2</b>', '9 − 15 + 8 = <b>2</b>')
          ]),
          WARN('El fallo número 1 del examen: perder un signo al quitar paréntesis. Escribe el paso intermedio siempre, aunque parezca fácil.',
               'Biežākā kļūda: pazaudēt zīmi, atverot iekavas. Vienmēr pieraksti starpsoli, pat ja šķiet viegli.')
        ]
      }
    ]
  };

  /* =====================================================
     5 · POTENCIAS Y ORDEN DE OPERACIONES
     ===================================================== */
  L.pow = {
    sections: [
      {
        t: T('Qué es una potencia', 'Kas ir pakāpe'),
        b: [
          P('2⁵ significa multiplicar 2 por sí mismo <b>5 veces</b>: 2 · 2 · 2 · 2 · 2 = 32. El 2 es la <b>base</b> y el 5 el <b>exponente</b>.',
            '2⁵ nozīmē reizināt 2 ar sevi <b>5 reizes</b>: 2 · 2 · 2 · 2 · 2 = 32. 2 ir <b>bāze</b>, 5 ir <b>kāpinātājs</b>.'),
          TAB([T('Potencia', 'Pakāpe'), T('Valor', 'Vērtība'), T('Potencia', 'Pakāpe'), T('Valor', 'Vērtība')], [
            ['2² · 3² · 4² · 5²', '4 · 9 · 16 · 25', '6² · 7² · 8² · 9²', '36 · 49 · 64 · 81'],
            ['10² · 11² · 12²', '100 · 121 · 144', '2³ · 3³ · 4³ · 5³', '8 · 27 · 64 · 125'],
            ['10³', '1000', '2⁴ · 2⁵', '16 · 32']
          ]),
          KEY('Signos: (−2)² = <b>+4</b> pero −2² = <b>−4</b>. El paréntesis decide si el signo se eleva también.<br>Exponente <b>par</b> → siempre positivo. Exponente <b>impar</b> → conserva el signo de la base.',
              'Zīmes: (−2)² = <b>+4</b>, bet −2² = <b>−4</b>. Iekavas nosaka, vai kāpina arī zīmi.<br><b>Pāra</b> kāpinātājs → vienmēr pozitīvs. <b>Nepāra</b> kāpinātājs → saglabā bāzes zīmi.'),
          P('Con decimales y fracciones se eleva todo: 0,1² = 0,01 &nbsp;·&nbsp; (' + F(2,3) + ')² = ' + F(4,9) + '.',
            'Ar decimāldaļām un daļām kāpina visu: 0,1² = 0,01 &nbsp;·&nbsp; (' + F(2,3) + ')² = ' + F(4,9) + '.')
        ]
      },
      {
        t: T('El orden de las operaciones', 'Darbību secība'),
        b: [
          KEY('1) Paréntesis &nbsp;→&nbsp; 2) Potencias &nbsp;→&nbsp; 3) Multiplicar y dividir <b>de izquierda a derecha</b> &nbsp;→&nbsp; 4) Sumar y restar <b>de izquierda a derecha</b>.',
              '1) Iekavas &nbsp;→&nbsp; 2) Pakāpes &nbsp;→&nbsp; 3) Reizināšana un dalīšana <b>no kreisās uz labo</b> &nbsp;→&nbsp; 4) Saskaitīšana un atņemšana <b>no kreisās uz labo</b>.'),
          EX('16 · 2 : 4 · 3', '16 · 2 : 4 · 3', [
            S('16 · 2 = 32', '16 · 2 = 32'),
            S('32 : 4 = 8', '32 : 4 = 8'),
            S('8 · 3 = <b>24</b>', '8 · 3 = <b>24</b>')
          ]),
          WARN('Error típico: hacer primero 4 · 3 = 12 y luego 32 : 12. <b>La multiplicación NO va antes que la división</b>: van en el orden en que aparecen escritas.',
               'Tipiska kļūda: vispirms 4 · 3 = 12, tad 32 : 12. <b>Reizināšana NAV svarīgāka par dalīšanu</b> — darbības veic tādā secībā, kā tās uzrakstītas.'),
          EX('50 − 2 · (3 + 4 · 2)', '50 − 2 · (3 + 4 · 2)', [
            S('Dentro del paréntesis, primero el producto: 4 · 2 = 8', 'Iekavās vispirms reizinājums: 4 · 2 = 8'),
            S('3 + 8 = 11', '3 + 8 = 11'),
            S('2 · 11 = 22', '2 · 11 = 22'),
            S('50 − 22 = <b>28</b>', '50 − 22 = <b>28</b>')
          ])
        ]
      },
      {
        t: T('Potencias y unidades', 'Pakāpes un mērvienības'),
        b: [
          P('Las potencias explican por qué las unidades de área y volumen cambian de 100 en 100 y de 1000 en 1000:',
            'Pakāpes izskaidro, kāpēc laukuma un tilpuma mērvienības mainās pa 100 un pa 1000:'),
          LIST([
            T('1 cm = 10 mm → 1 cm² = 10² mm² = <b>100 mm²</b>', '1 cm = 10 mm → 1 cm² = 10² mm² = <b>100 mm²</b>'),
            T('1 cm = 10 mm → 1 cm³ = 10³ mm³ = <b>1000 mm³</b>', '1 cm = 10 mm → 1 cm³ = 10³ mm³ = <b>1000 mm³</b>'),
            T('Por eso 3 cm² = 300 mm² (y no 30 mm²).', 'Tāpēc 3 cm² = 300 mm² (nevis 30 mm²).')
          ])
        ]
      }
    ]
  };

})(typeof window !== 'undefined' ? window : globalThis);
