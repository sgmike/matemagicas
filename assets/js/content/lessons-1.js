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
    m:    s => MM.m(s)
  };
  const { P, KEY, TIP, WARN, TAB, EX, LIST, S, F, FM, m } = H;

  /* =====================================================
     1 · NÚMEROS NATURALES Y DIVISIBILIDAD
     ===================================================== */
  L.nat = {
    sections: [
      {
        t: T('Divisor y múltiplo', 'Dalītājs un dalāmais'),
        b: [
          P('Un <b>divisor</b> de 12 es un número que cabe en 12 un número exacto de veces: 1, 2, 3, 4, 6 y 12.',
            '12 <b>dalītājs</b> ir skaitlis, ar kuru 12 dalās bez atlikuma: 1, 2, 3, 4, 6 un 12.'),
          P('Un <b>múltiplo</b> de 12 sale de multiplicar 12 por un número natural: 12, 24, 36, 48…',
            '12 <b>dalāmais</b> rodas, reizinot 12 ar naturālu skaitli: 12, 24, 36, 48…'),
          WARN('En letón se confunden fácil: <b>dalītājs</b> = divisor (el pequeño), <b>dalāmais</b> = múltiplo (el grande). En el examen de 2025 preguntaron “los tres <i>dalāmie</i> más pequeños de 15” → 15, 30, 45.',
               'Latviski viegli sajaukt: <b>dalītājs</b> — mazākais, <b>dalāmais</b> — lielākais. 2025. gada pārbaudījumā jautāja par 15 trim mazākajiem <i>dalāmajiem</i> → 15, 30, 45.')
        ]
      },
      {
        t: T('Criterios de divisibilidad (de memoria)', 'Dalāmības pazīmes (jāzina no galvas)'),
        b: [
          TAB([T('Divisible entre', 'Dalās ar'), T('Cómo se ve', 'Kā to pamanīt')], [
            ['2',  T('termina en 0, 2, 4, 6 u 8', 'beidzas ar 0, 2, 4, 6 vai 8')],
            ['3',  T('la <b>suma de sus cifras</b> es divisible entre 3', 'tā <b>ciparu summa</b> dalās ar 3')],
            ['4',  T('las <b>dos últimas cifras</b> forman un número divisible entre 4', 'pēdējie <b>divi cipari</b> veido skaitli, kas dalās ar 4')],
            ['5',  T('termina en 0 o en 5', 'beidzas ar 0 vai 5')],
            ['6',  T('divisible entre 2 <b>y</b> entre 3', 'dalās ar 2 <b>un</b> ar 3')],
            ['9',  T('la suma de sus cifras es divisible entre 9', 'ciparu summa dalās ar 9')],
            ['10', T('termina en 0', 'beidzas ar 0')]
          ]),
          EX('¿2376 es divisible entre 6?', 'Vai 2376 dalās ar 6?', [
            S('Entre 2: termina en 6 → sí.', 'Ar 2: beidzas ar 6 → jā.'),
            S('Entre 3: 2+3+7+6 = 18, y 18 sí es divisible entre 3 → sí.', 'Ar 3: 2+3+7+6 = 18, un 18 dalās ar 3 → jā.'),
            S('Como cumple los dos, <b>sí es divisible entre 6</b>.', 'Tā kā izpildās abas pazīmes, <b>skaitlis dalās ar 6</b>.')
          ])
        ]
      },
      {
        t: T('Primos y descomposición', 'Pirmskaitļi un sadalīšana reizinātājos'),
        b: [
          P('Un <b>número primo</b> tiene exactamente dos divisores: 1 y él mismo. Los primeros: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37.',
            '<b>Pirmskaitlim</b> ir tieši divi dalītāji: 1 un pats skaitlis. Pirmie: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37.'),
          P('<b>Descomponer</b> es escribir el número como producto de primos. Se va dividiendo por el primo más pequeño que quepa.',
            '<b>Sadalīt pirmreizinātājos</b> nozīmē uzrakstīt skaitli kā pirmskaitļu reizinājumu, dalot ar mazāko iespējamo pirmskaitli.'),
          EX('Descompón 180', 'Sadali 180 pirmreizinātājos', [
            S('180 : 2 = 90', '180 : 2 = 90'),
            S('90 : 2 = 45', '90 : 2 = 45'),
            S('45 : 3 = 15', '45 : 3 = 15'),
            S('15 : 3 = 5', '15 : 3 = 5'),
            S('5 : 5 = 1 → 180 = 2 · 2 · 3 · 3 · 5 = 2² · 3² · 5', '5 : 5 = 1 → 180 = 2 · 2 · 3 · 3 · 5 = 2² · 3² · 5')
          ])
        ]
      },
      {
        t: T('MCD y mcm (LKD y MKD)', 'LKD un MKD'),
        b: [
          KEY('<b>MCD</b> (letón <b>LKD</b>): factores comunes con el <b>menor</b> exponente. Sirve para <i>repartir en grupos iguales</i> y para simplificar fracciones.<br><b>mcm</b> (letón <b>MKD</b>): todos los factores con el <b>mayor</b> exponente. Sirve para <i>cuándo vuelven a coincidir</i> y para el denominador común.',
              '<b>LKD</b>: kopīgie reizinātāji ar <b>mazāko</b> kāpinātāju. Noder, <i>sadalot vienādās grupās</i> un saīsinot daļas.<br><b>MKD</b>: visi reizinātāji ar <b>lielāko</b> kāpinātāju. Noder, lai zinātu, <i>kad atkal sakritīs</i>, un kopsaucējam.'),
          EX('MCD y mcm de 24 y 36', '24 un 36 LKD un MKD', [
            S('24 = 2³ · 3', '24 = 2³ · 3'),
            S('36 = 2² · 3²', '36 = 2² · 3²'),
            S('MCD = 2² · 3 = <b>12</b> (lo común, exponente pequeño)', 'LKD = 2² · 3 = <b>12</b>'),
            S('mcm = 2³ · 3² = <b>72</b> (todo, exponente grande)', 'MKD = 2³ · 3² = <b>72</b>'),
            S('Comprobación: 12 · 72 = 864 = 24 · 36 ✓', 'Pārbaude: 12 · 72 = 864 = 24 · 36 ✓')
          ]),
          TIP('Si un número es divisor del otro (por ejemplo 6 y 18), entonces MCD = el pequeño y mcm = el grande. Se resuelve en un segundo.',
              'Ja viens skaitlis ir otra dalītājs (piem., 6 un 18), tad LKD = mazākais, MKD = lielākais. Atrisinās vienā mirklī.')
        ]
      },
      {
        t: T('Dónde aparece en el examen', 'Kur tas parādās pārbaudījumā'),
        b: [
          LIST([
            T('“¿Cuántos de los tres múltiplos más pequeños de 15 son divisibles entre 6?”', '“Cik no skaitļa 15 trim mazākajiem dalāmajiem dalās ar 6?”'),
            T('Dos autobuses salen cada 12 y cada 18 minutos: ¿cuándo coinciden? → mcm.', 'Divi autobusi izbrauc ik pēc 12 un 18 minūtēm: kad sakritīs? → MKD.'),
            T('Repartir 24 lápices y 36 gomas en bolsas iguales → MCD.', 'Sadalīt 24 zīmuļus un 36 dzēšgumijas vienādos maisiņos → LKD.')
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
