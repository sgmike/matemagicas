/* =========================================================
   Lecciones 11–15: geometría, coordenadas, volumen,
   trabajo/movimiento y lógica
   ========================================================= */
(function (global) {
  'use strict';
  const MM = global.MM, T = MM.T, L = MM.LESSONS;
  const { P, KEY, TIP, WARN, TAB, EX, LIST, S, F, FM } = MM.L;

  /* =====================================================
     11 · GEOMETRÍA PLANA
     ===================================================== */
  L.geo = {
    sections: [
      {
        t: T('Perímetro y área', 'Perimetrs un laukums'),
        b: [
          KEY('<b>Perímetro</b> = lo que mide el borde (se mide en cm, m…). <b>Área</b> = la superficie que ocupa (se mide en cm², m²…).<br>Si te piden “cuánta valla” → perímetro. Si te piden “cuánto césped” → área.',
              '<b>Perimetrs</b> — malu garumu summa (cm, m…). <b>Laukums</b> — virsmas lielums (cm², m²…).<br>Ja jautā par žogu → perimetrs. Ja par zālienu → laukums.'),
          TAB([T('Figura', 'Figūra'), T('Perímetro', 'Perimetrs'), T('Área', 'Laukums')], [
            [T('Cuadrado (lado a)', 'Kvadrāts (mala a)'), '4a', 'a²'],
            [T('Rectángulo (a, b)', 'Taisnstūris (a, b)'), '2(a + b)', 'a · b'],
            [T('Triángulo', 'Trijstūris'), 'a + b + c', T('(base · altura) : 2', '(pamats · augstums) : 2')],
            [T('Círculo (radio r)', 'Riņķis (rādiuss r)'), T('2πr (longitud de la circunferencia)', '2πr (riņķa līnijas garums)'), 'πr²']
          ]),
          P('En 6.º se usa <b>π ≈ 3,14</b>. El diámetro es el doble del radio: d = 2r.',
            '6. klasē lieto <b>π ≈ 3,14</b>. Diametrs ir divreiz lielāks par rādiusu: d = 2r.')
        ]
      },
      {
        t: T('Ir hacia atrás: del área al lado', 'Atpakaļejošie uzdevumi: no laukuma uz malu'),
        b: [
          EX('Un rectángulo tiene 48 cm de perímetro y el largo es el doble del ancho. ¿Área?',
             'Taisnstūra perimetrs ir 48 cm, garums divreiz lielāks par platumu. Kāds ir laukums?', [
            S('Ancho = x, largo = 2x', 'Platums = x, garums = 2x'),
            S('2(x + 2x) = 48 → 6x = 48 → x = 8', '2(x + 2x) = 48 → 6x = 48 → x = 8'),
            S('Ancho 8 cm, largo 16 cm', 'Platums 8 cm, garums 16 cm'),
            S('Área = 8 · 16 = <b>128 cm²</b>', 'Laukums = 8 · 16 = <b>128 cm²</b>')
          ]),
          WARN('Figuras hechas con cuadraditos: el perímetro <b>no</b> es la suma de los perímetros. Los lados interiores desaparecen. 4 cuadrados de lado 2 cm en fila → rectángulo 8 × 2 → perímetro 20 cm (no 32).',
               'Figūras no kvadrātiņiem: perimetrs <b>nav</b> perimetru summa — iekšējās malas pazūd. 4 kvadrāti ar malu 2 cm rindā → taisnstūris 8 × 2 → perimetrs 20 cm (nevis 32).')
        ]
      },
      {
        t: T('Ángulos', 'Leņķi'),
        b: [
          TAB([T('Tipo', 'Veids'), T('Letón', 'Latviski'), T('Medida', 'Lielums')], [
            [T('Agudo', 'Šaurs'), 'šaurleņķis', '< 90°'],
            [T('Recto', 'Taisns'), 'taisns leņķis', '= 90°'],
            [T('Obtuso', 'Plats'), 'platleņķis', '90° – 180°'],
            [T('Llano', 'Izstiepts'), 'izstiepts leņķis', '= 180°']
          ]),
          KEY('Los tres ángulos de un triángulo suman <b>180°</b>. Los cuatro de un cuadrilátero suman <b>360°</b>.',
              'Trijstūra leņķu summa ir <b>180°</b>. Četrstūra leņķu summa ir <b>360°</b>.'),
          P('Ángulos <b>complementarios</b> suman 90°; <b>suplementarios</b> suman 180°.',
            'Leņķi, kuru summa ir 90°, ir <b>komplementāri</b>; kuru summa ir 180° — <b>blakusleņķi</b>.')
        ]
      }
    ]
  };

  /* =====================================================
     12 · PLANO DE COORDENADAS
     ===================================================== */
  L.coo = {
    sections: [
      {
        t: T('Leer y escribir puntos', 'Punktu lasīšana un pierakstīšana'),
        b: [
          KEY('Un punto se escribe (x; y): <b>primero se camina y después se sube</b>.<br>x positiva → derecha · x negativa → izquierda · y positiva → arriba · y negativa → abajo.',
              'Punktu pieraksta (x; y): <b>vispirms iet, tad kāpj</b>.<br>x pozitīvs → pa labi · x negatīvs → pa kreisi · y pozitīvs → uz augšu · y negatīvs → uz leju.'),
          P('En letón los ejes son <b>abscisu ass</b> (x) y <b>ordinātu ass</b> (y). Los cuatro cuadrantes se numeran en sentido contrario a las agujas del reloj empezando arriba a la derecha.',
            'Asis latviski: <b>abscisu ass</b> (x) un <b>ordinātu ass</b> (y). Četrus kvadrantus numurē pretēji pulksteņrādītāja virzienam, sākot no augšējā labā stūra.'),
          TAB([T('Cuadrante', 'Kvadrants'), 'x', 'y', T('Ejemplo', 'Piemērs')], [
            ['I', '+', '+', '(2; 3)'], ['II', '−', '+', '(−4; 1)'],
            ['III', '−', '−', '(−3; −2)'], ['IV', '+', '−', '(5; −1)']
          ]),
          TIP('Un punto con un cero, como (0; −5), está <b>sobre un eje</b>, no en ningún cuadrante. Es una pregunta trampa habitual.',
              'Punkts ar nulli, piemēram (0; −5), atrodas <b>uz ass</b>, nevis kādā kvadrantā. Tas ir bieži sastopams slazds.')
        ]
      },
      {
        t: T('El robot que se mueve por el plano', 'Robots, kas pārvietojas pa plakni'),
        b: [
          P('Es un clásico del examen. Se pide el recorrido, las coordenadas de cada punto y el tiempo total.',
            'Klasisks pārbaudījuma uzdevums. Jautā par ceļu, katra punkta koordinātām un kopējo laiku.'),
          EX('Roro sale de (0; 0): 3 a la derecha, 4 arriba, 5 a la izquierda, 7 abajo, 2 a la derecha',
             'Roro sāk (0; 0): 3 pa labi, 4 uz augšu, 5 pa kreisi, 7 uz leju, 2 pa labi', [
            S('A(3; 0) → B(3; 4) → C(−2; 4) → D(−2; −3) → E(0; −3)', 'A(3; 0) → B(3; 4) → C(−2; 4) → D(−2; −3) → E(0; −3)'),
            S('Recorrido: 3 + 4 + 5 + 7 + 2 = <b>21 unidades</b>', 'Ceļš: 3 + 4 + 5 + 7 + 2 = <b>21 vienība</b>'),
            S('A 2 unidades/s: 21 : 2 = 10,5 s de movimiento', 'Ar ātrumu 2 vienības sekundē: 21 : 2 = 10,5 s kustībā'),
            S('5 órdenes → <b>4 pausas</b> · 1,5 s = 6 s', '5 komandas → <b>4 pauzes</b> · 1,5 s = 6 s'),
            S('Total: 10,5 + 6 = <b>16,5 s</b>', 'Kopā: 10,5 + 6 = <b>16,5 s</b>')
          ]),
          WARN('Entre 5 órdenes hay <b>4</b> pausas, igual que entre 5 postes hay 4 tramos de valla. Contar 5 es el error típico.',
               'Starp 5 komandām ir <b>4</b> pauzes — tāpat kā starp 5 mietiem ir 4 žoga posmi. Saskaitīt 5 ir tipiska kļūda.')
        ]
      },
      {
        t: T('Distancias y áreas en el plano', 'Attālumi un laukumi plaknē'),
        b: [
          P('Si dos puntos están en la misma horizontal, la distancia es la <b>resta de las x</b>; en la misma vertical, la resta de las y. Siempre en positivo.',
            'Ja divi punkti ir uz vienas horizontāles, attālums ir <b>x koordinātu starpība</b>; uz vertikāles — y starpība. Vienmēr pozitīva.'),
          P('Con cuatro vértices se puede calcular el área del rectángulo: base · altura, contando cuadraditos.',
            'Ar četrām virsotnēm var aprēķināt taisnstūra laukumu: pamats · augstums, saskaitot rūtiņas.')
        ]
      }
    ]
  };

  /* =====================================================
     13 · CUERPOS Y VOLUMEN
     ===================================================== */
  L.vol = {
    sections: [
      {
        t: T('El ortoedro', 'Taisnstūra paralēlskaldnis'),
        b: [
          KEY('<b>Volumen</b> V = largo · ancho · alto.<br><b>Área total</b> = 2·(ab + ac + bc) — las seis caras, iguales dos a dos.',
              '<b>Tilpums</b> V = garums · platums · augstums.<br><b>Virsmas laukums</b> = 2·(ab + ac + bc) — sešas skaldnes, pa pārīšiem vienādas.'),
          KEY('<b>1 dm³ = 1 litro</b> y <b>1 cm³ = 1 ml</b>. Es el puente entre geometría y capacidad.',
              '<b>1 dm³ = 1 litrs</b> un <b>1 cm³ = 1 ml</b>. Tas ir tilts starp ģeometriju un tilpumu.'),
          EX('Una caja de 30 cm × 20 cm × 15 cm: ¿cuántos litros caben?', 'Kaste 30 cm × 20 cm × 15 cm: cik litru tajā ietilpst?', [
            S('V = 30 · 20 · 15 = 9000 cm³', 'V = 30 · 20 · 15 = 9000 cm³'),
            S('1000 cm³ = 1 l → 9000 : 1000 = <b>9 litros</b>', '1000 cm³ = 1 l → 9000 : 1000 = <b>9 litri</b>')
          ]),
          TIP('Otra forma: pasa las medidas a dm antes de multiplicar (3 dm · 2 dm · 1,5 dm = 9 dm³ = 9 l). Menos ceros, menos errores.',
              'Cits paņēmiens: pārveido izmērus dm pirms reizināšanas (3 dm · 2 dm · 1,5 dm = 9 dm³ = 9 l). Mazāk nuļļu — mazāk kļūdu.')
        ]
      },
      {
        t: T('El cubo y los problemas al revés', 'Kubs un atpakaļejošie uzdevumi'),
        b: [
          P('En el cubo todas las aristas son iguales: V = a³ y área total = 6a².',
            'Kubam visas šķautnes ir vienādas: V = a³ un virsmas laukums = 6a².'),
          EX('Un depósito de 2 m × 1,5 m × 0,8 m se llena a 300 l/min', 'Tvertni 2 m × 1,5 m × 0,8 m pilda ar 300 l/min', [
            S('V = 2 · 1,5 · 0,8 = 2,4 m³', 'V = 2 · 1,5 · 0,8 = 2,4 m³'),
            S('1 m³ = 1000 l → 2400 litros', '1 m³ = 1000 l → 2400 litri'),
            S('2400 : 300 = <b>8 minutos</b>', '2400 : 300 = <b>8 minūtes</b>')
          ])
        ]
      }
    ]
  };

  /* =====================================================
     14 · TRABAJO, MOVIMIENTO Y CONJUNTOS
     ===================================================== */
  L.wm = {
    sections: [
      {
        t: T('Trabajo conjunto: dos métodos', 'Kopīgs darbs: divas metodes'),
        b: [
          KEY('<b>Método 1 — unidades de trabajo.</b> Trabajo total = trabajadores × tiempo, y esa cantidad <b>no cambia</b>. 5 excavadoras en 10 días = 50 excavadora-días.',
              '<b>1. metode — darba vienības.</b> Kopējais darbs = strādnieku skaits × laiks, un tas <b>nemainās</b>. 5 ekskavatori 10 dienās = 50 ekskavatoru-dienas.'),
          KEY('<b>Método 2 — ritmos.</b> Si alguien tarda t, en una unidad de tiempo hace ' + MM.L.FS(1,'t') + ' del trabajo. Los ritmos <b>se suman</b>.',
              '<b>2. metode — darba ražīgums.</b> Ja kāds paveic laikā t, vienā laika vienībā viņš izdara ' + MM.L.FS(1,'t') + ' no darba. Ražīgumus <b>saskaita</b>.'),
          EX('Un grifo llena en 4 h y otro en 6 h. ¿Juntos?', 'Viens krāns piepilda 4 h, otrs 6 h. Cik ilgi kopā?', [
            S('Ritmos: ' + F(1,4) + ' + ' + F(1,6) + ' = ' + F(3,12) + ' + ' + F(2,12) + ' = ' + F(5,12) + ' por hora', 'Ražīgums: ' + F(1,4) + ' + ' + F(1,6) + ' = ' + F(5,12) + ' stundā'),
            S('Tiempo = 1 : ' + F(5,12) + ' = ' + F(12,5) + ' = <b>2,4 h = 2 h 24 min</b>', 'Laiks = 1 : ' + F(5,12) + ' = ' + F(12,5) + ' = <b>2,4 h = 2 h 24 min</b>')
          ]),
          EX('5 excavadoras, 10 días. A los 4 días se rompen 2. ¿Cuándo termina?', '5 ekskavatori, 10 dienas. Pēc 4 dienām 2 salūst. Kad darbs būs pabeigts?', [
            S('Trabajo total = 5 · 10 = 50 excavadora-días', 'Kopējais darbs = 5 · 10 = 50 ekskavatoru-dienas'),
            S('En 4 días: 5 · 4 = 20 hechos, faltan 30', '4 dienās: 5 · 4 = 20 paveikts, atlicis 30'),
            S('Quedan 3 excavadoras: 30 : 3 = 10 días más', 'Paliek 3 ekskavatori: 30 : 3 = vēl 10 dienas'),
            S('Total: 4 + 10 = <b>14 días</b>', 'Kopā: 4 + 10 = <b>14 dienas</b>')
          ])
        ]
      },
      {
        t: T('Movimiento: encuentro y alcance', 'Kustība: pretimbraukšana un panākšana'),
        b: [
          KEY('<b>Sentidos opuestos (se encuentran):</b> velocidad de acercamiento = v₁ + v₂.<br><b>Mismo sentido (uno alcanza al otro):</b> velocidad de acercamiento = v₁ − v₂.<br>Tiempo = distancia entre ellos : velocidad de acercamiento.',
              '<b>Pretēji virzieni (satiekas):</b> tuvošanās ātrums = v₁ + v₂.<br><b>Viens virziens (panāk):</b> tuvošanās ātrums = v₁ − v₂.<br>Laiks = attālums starp tiem : tuvošanās ātrums.'),
          EX('Sale un coche a 60 km/h. Dos horas después sale otro a 90 km/h. ¿Cuándo lo alcanza?',
             'Izbrauc auto ar 60 km/h. Divas stundas vēlāk izbrauc otrs ar 90 km/h. Kad panāks?', [
            S('Ventaja del primero: 60 · 2 = 120 km', 'Pirmā priekšrocība: 60 · 2 = 120 km'),
            S('Acercamiento: 90 − 60 = 30 km/h', 'Tuvošanās ātrums: 90 − 60 = 30 km/h'),
            S('120 : 30 = <b>4 horas</b>', '120 : 30 = <b>4 stundas</b>')
          ]),
          TIP('Un tren que atraviesa un túnel recorre <b>túnel + tren</b>: 400 m + 200 m = 600 m.',
              'Vilciens, kas šķērso tuneli, veic <b>tunelis + vilciens</b>: 400 m + 200 m = 600 m.')
        ]
      },
      {
        t: T('Conjuntos: “los dos” y “ninguno”', 'Kopas: “abi” un “neviens”'),
        b: [
          KEY('En al menos una actividad = A + B − (los dos).<br>Ninguna = Total − (en al menos una).',
              'Vismaz vienā = A + B − (abās).<br>Nevienā = Kopā − (vismaz vienā).'),
          EX('24 alumnos: ' + F(1,3) + ' en matemáticas, ' + F(3,4) + ' en deporte, 7 en las dos. ¿Cuántos en ninguna?',
             '24 skolēni: ' + F(1,3) + ' matemātikā, ' + F(3,4) + ' sportā, 7 abās. Cik nevienā?', [
            S('Matemáticas: 24 : 3 = 8', 'Matemātikā: 24 : 3 = 8'),
            S('Deporte: 24 : 4 · 3 = 18', 'Sportā: 24 : 4 · 3 = 18'),
            S('En al menos una: 8 + 18 − 7 = 19', 'Vismaz vienā: 8 + 18 − 7 = 19'),
            S('Ninguna: 24 − 19 = <b>5</b>', 'Nevienā: 24 − 19 = <b>5</b>')
          ]),
          P('Se resta “los dos” porque esas personas se han contado dos veces, una en cada grupo.',
            '“Abās” atņem tāpēc, ka šie skolēni ir saskaitīti divreiz — katrā grupā pa vienai reizei.')
        ]
      }
    ]
  };

  /* =====================================================
     15 · LÓGICA Y RAZONAMIENTO
     ===================================================== */
  L.log = {
    sections: [
      {
        t: T('La tabla de “quién hace qué”', '“Kurš ko dara” tabula'),
        b: [
          P('Se dibuja una cuadrícula, se marca ✗ en lo imposible y, cuando en una fila o columna queda un solo hueco, ese es. <b>Empieza siempre por el dato que dice “ni… ni…”</b>: es el que más información da.',
            'Uzzīmē tabulu, atzīmē ✗ neiespējamo, un, kad rindā vai kolonnā paliek viena brīva vieta, tā ir atbilde. <b>Sāc ar to nosacījumu, kas saka “ne… ne…”</b> — tas dod visvairāk informācijas.'),
          EX('Kārlis no juega fútbol; Āris no juega ni fútbol ni voleibol. ¿Qué juega Kārlis?',
             'Kārlis netrenējas futbolā; Āris netrenējas ne futbolā, ne volejbolā. Kurā sporta veidā trenējas Kārlis?', [
            S('Āris: no fútbol y no voleibol → <b>baloncesto</b>', 'Āris: ne futbols, ne volejbols → <b>basketbols</b>'),
            S('Kārlis: no fútbol y el baloncesto ya está ocupado → <b>voleibol</b>', 'Kārlis: ne futbols, basketbols aizņemts → <b>volejbols</b>'),
            S('A Māris le queda el fútbol.', 'Mārim paliek futbols.')
          ])
        ]
      },
      {
        t: T('Torneos', 'Turnīri'),
        b: [
          KEY('Con n equipos, todos contra todos una vez: <b>n · (n − 1) : 2</b> partidos. 3 equipos → 3 partidos; 4 → 6; 5 → 10.<br>Cada partido reparte <b>3 puntos</b> (si hay ganador) o <b>2</b> (si es empate).',
              'Ar n komandām, katra ar katru vienu reizi: <b>n · (n − 1) : 2</b> spēles. 3 komandas → 3 spēles; 4 → 6; 5 → 10.<br>Katrā spēlē tiek izdalīti <b>3 punkti</b> (ja ir uzvarētājs) vai <b>2</b> (ja neizšķirts).'),
          EX('3 equipos. Osos 4 puntos, Liebres 3. ¿Cuántos tienen los Lobos?', '3 komandas. Lāči 4 punkti, Zaķi 3. Cik punktu Vilkiem?', [
            S('Cada equipo juega 2 partidos.', 'Katra komanda spēlē 2 spēles.'),
            S('Osos con 4 puntos en 2 partidos = 3 + 1 → una victoria y un empate.', 'Lāči ar 4 punktiem 2 spēlēs = 3 + 1 → uzvara un neizšķirts.'),
            S('Liebres con 3 puntos = 3 + 0 → una victoria y una derrota, sin empate.', 'Zaķi ar 3 punktiem = 3 + 0 → uzvara un zaudējums, bez neizšķirta.'),
            S('El empate de Osos fue con Lobos; la victoria de Liebres, contra Lobos.', 'Lāču neizšķirts bija ar Vilkiem; Zaķu uzvara — pret Vilkiem.'),
            S('Lobos: 1 empate + 1 derrota = <b>1 punto</b>', 'Vilki: 1 neizšķirts + 1 zaudējums = <b>1 punkts</b>')
          ])
        ]
      },
      {
        t: T('Postes, cortes y filas', 'Mieti, griezumi un rindas'),
        b: [
          KEY('Entre <b>n</b> objetos en fila hay <b>n − 1</b> espacios. Cortar en n trozos necesita <b>n − 1</b> cortes. Entre 5 órdenes hay 4 pausas.',
              'Starp <b>n</b> objektiem rindā ir <b>n − 1</b> atstarpes. Sagriezt n daļās nozīmē <b>n − 1</b> griezumus. Starp 5 komandām ir 4 pauzes.'),
          EX('Cortar un tronco en 4 partes tarda 12 min. ¿Y en 6 partes?', 'Sazāģēt baļķi 4 daļās aizņem 12 min. Cik ilgi 6 daļās?', [
            S('4 partes = 3 cortes → 12 : 3 = 4 min por corte', '4 daļas = 3 griezumi → 12 : 3 = 4 min viens griezums'),
            S('6 partes = 5 cortes → 5 · 4 = <b>20 min</b>', '6 daļas = 5 griezumi → 5 · 4 = <b>20 min</b>')
          ]),
          EX('Marta es la 7.ª por delante y la 12.ª por detrás. ¿Cuántos hay en la fila?', 'Marta ir 7. no priekšas un 12. no aizmugures. Cik cilvēku rindā?', [
            S('7 + 12 = 19, pero Marta se ha contado dos veces', '7 + 12 = 19, bet Marta saskaitīta divreiz'),
            S('19 − 1 = <b>18 personas</b>', '19 − 1 = <b>18 cilvēki</b>')
          ])
        ]
      },
      {
        t: T('Leer bien el enunciado', 'Uzdevuma uzmanīga izlasīšana'),
        b: [
          WARN('“Marta tiene 1 hermana y 2 hermanos. ¿Cuántos hijos hay en la familia?” → <b>4</b>. Hay que contar también a Marta. Lee dos veces y subraya lo que se pregunta.',
               '“Martai ir 1 māsa un 2 brāļi. Cik bērnu ģimenē?” → <b>4</b>. Jāsaskaita arī Marta. Izlasi divreiz un pasvītro jautājumu.'),
          LIST([
            T('Subraya la pregunta antes de calcular.', 'Pirms rēķināšanas pasvītro jautājumu.'),
            T('Comprueba si la respuesta tiene sentido (¿puede haber 2,5 personas?).', 'Pārbaudi, vai atbilde ir loģiska (vai var būt 2,5 cilvēki?).'),
            T('Escribe las unidades en la respuesta: 12 km, 5 alumnos, 3,84 €.', 'Atbildē pieraksti mērvienības: 12 km, 5 skolēni, 3,84 €.')
          ])
        ]
      }
    ]
  };

})(typeof window !== 'undefined' ? window : globalThis);
