/* =========================================================
   Lecciones 6–10: porcentajes, proporciones, magnitudes,
   estadística, lenguaje matemático y ecuaciones
   ========================================================= */
(function (global) {
  'use strict';
  const MM = global.MM, T = MM.T, L = MM.LESSONS;
  const { P, KEY, TIP, WARN, TAB, EX, LIST, S, F, FM, FS } = MM.L;

  /* =====================================================
     6 · PORCENTAJES
     ===================================================== */
  L.pct = {
    sections: [
      {
        t: T('Qué es un porcentaje', 'Kas ir procenti'),
        b: [
          P('Un porcentaje es una <b>fracción de denominador 100</b>: 35 % = ' + F(35,100) + ' = 0,35. “Por ciento” significa “de cada cien”.',
            'Procenti ir <b>daļa ar saucēju 100</b>: 35 % = ' + F(35,100) + ' = 0,35. “Procents” nozīmē “no simta”.'),
          KEY('De cabeza: 10 % → dividir entre 10 · 1 % → dividir entre 100 · 50 % → la mitad · 25 % → la cuarta parte · 20 % → dividir entre 5 · 75 % → tres cuartas partes.',
              'No galvas: 10 % → dalīt ar 10 · 1 % → dalīt ar 100 · 50 % → puse · 25 % → ceturtā daļa · 20 % → dalīt ar 5 · 75 % → trīs ceturtdaļas.')
        ]
      },
      {
        t: T('Los tres tipos de problema', 'Trīs uzdevumu veidi'),
        b: [
          TAB([T('Tipo', 'Veids'), T('Pregunta', 'Jautājums'), T('Se hace', 'Darbība'), T('Ejemplo', 'Piemērs')], [
            ['1', T('¿cuánto es el 20 % de 350?', 'cik ir 20 % no 350?'), T('multiplicar', 'reizina'), '0,2 · 350 = 70'],
            ['2', T('el 20 % de un número es 70, ¿cuál es?', '20 % no skaitļa ir 70. Kāds ir skaitlis?'), T('dividir', 'dala'), '70 : 0,2 = 350'],
            ['3', T('¿qué % es 70 de 350?', 'cik procentu no 350 ir 70?'), T('dividir y ·100', 'dala un reizina ar 100'), '70 : 350 = 0,2 = 20 %']
          ]),
          TIP('Si dudas de si multiplicar o dividir: la respuesta a “¿cuánto es el X % de algo?” siempre es <b>más pequeña</b> que ese algo (si X &lt; 100).',
              'Ja neesi drošs: atbilde uz “cik ir X % no kaut kā” vienmēr ir <b>mazāka</b> par to (ja X &lt; 100).')
        ]
      },
      {
        t: T('Descuentos y subidas: el multiplicador', 'Atlaides un cenu pieaugums: reizinātājs'),
        b: [
          KEY('Descuento del 20 % → se paga el <b>80 %</b> → <b>· 0,8</b><br>Subida del 15 % → se paga el <b>115 %</b> → <b>· 1,15</b><br>Para <b>deshacer</b> (hallar el precio original) → <b>dividir</b> por ese mismo número.',
              'Atlaide 20 % → maksā <b>80 %</b> → <b>· 0,8</b><br>Cena aug par 15 % → maksā <b>115 %</b> → <b>· 1,15</b><br>Lai atgrieztos pie sākotnējās cenas → <b>dala</b> ar to pašu skaitli.'),
          EX('Pagó 12 € con 20 % de descuento. ¿Cuánto costaba?', 'Samaksāja 12 € ar 20 % atlaidi. Cik maksāja sākumā?', [
            S('Con 20 % de descuento se paga el 80 % → multiplicador 0,8', 'Ar 20 % atlaidi maksā 80 % → reizinātājs 0,8'),
            S('Precio original = 12 : 0,8 = <b>15 €</b>', 'Sākotnējā cena = 12 : 0,8 = <b>15 €</b>'),
            S('Comprobación: 15 · 0,8 = 12 ✓', 'Pārbaude: 15 · 0,8 = 12 ✓')
          ]),
          WARN('Los porcentajes <b>no se suman entre sí</b>: subir 20 % y luego bajar 20 % NO deja el precio igual. 200 · 1,2 = 240; 240 · 0,8 = 192. Queda <b>más barato</b>, porque el descuento se aplica sobre una base mayor.',
               'Procentus <b>nedrīkst saskaitīt</b>: paaugstināt par 20 % un pēc tam samazināt par 20 % NEATGRIEŽ sākotnējo cenu. 200 · 1,2 = 240; 240 · 0,8 = 192. Iznāk <b>lētāk</b>, jo atlaidi rēķina no lielākas summas.')
        ]
      },
      {
        t: T('Problemas típicos del examen', 'Tipiskie pārbaudījuma uzdevumi'),
        b: [
          EX('Donan el 60 % de 24 € y el resto se reparte proporcionalmente', 'No 24 € ziedo 60 %, pārējo sadala proporcionāli', [
            S('Si donan el 60 %, les queda el <b>40 %</b>: 24 · 0,4 = 9,60 €', 'Ja ziedo 60 %, paliek <b>40 %</b>: 24 · 0,4 = 9,60 €'),
            S('Después ya es un reparto proporcional normal (tema 7).', 'Tālāk seko parasta proporcionāla sadale (7. temats).')
          ]),
          EX('En una clase de 25 alumnos el 60 % son niñas. Se van 3 niñas. ¿Qué % son ahora?', 'Klasē no 25 skolēniem 60 % ir meitenes. Aiziet 3 meitenes. Cik procentu tagad?', [
            S('Niñas al principio: 60 % de 25 = 15', 'Sākumā meiteņu: 60 % no 25 = 15'),
            S('Ahora hay 12 niñas y 22 alumnos en total', 'Tagad 12 meitenes un 22 skolēni'),
            S('12 : 22 ≈ 0,545 → <b>≈ 54,5 %</b>', '12 : 22 ≈ 0,545 → <b>≈ 54,5 %</b>'),
            S('Ojo: cambia el total, no solo la parte.', 'Uzmanību: mainās arī kopskaits, ne tikai daļa.')
          ])
        ]
      }
    ]
  };

  /* =====================================================
     7 · RAZONES Y PROPORCIONES
     ===================================================== */
  L.rat = {
    sections: [
      {
        t: T('Razón y proporción', 'Attiecība un proporcija'),
        b: [
          P('Una <b>razón</b> compara dos cantidades dividiendo: la razón de 12 a 18 es 12 : 18 = 2 : 3.',
            '<b>Attiecība</b> salīdzina divus lielumus, tos dalot: 12 attiecība pret 18 ir 12 : 18 = 2 : 3.'),
          P('Una <b>proporción</b> es la igualdad de dos razones: ' + FS('a','b') + ' = ' + FS('c','d') + '. Su propiedad fundamental es el <b>producto cruzado</b>: a · d = b · c.',
            '<b>Proporcija</b> ir divu attiecību vienādība: ' + FS('a','b') + ' = ' + FS('c','d') + '. Pamatīpašība — <b>krustveida reizinājumi</b>: a · d = b · c.'),
          EX('Halla x: ' + F(5,8) + ' = ' + FS('x',24), 'Atrodi x: ' + F(5,8) + ' = ' + FS('x',24), [
            S('Producto cruzado: 5 · 24 = 8 · x', 'Krustveida reizinājums: 5 · 24 = 8 · x'),
            S('120 = 8x → x = <b>15</b>', '120 = 8x → x = <b>15</b>')
          ])
        ]
      },
      {
        t: T('Directa o inversa: cómo distinguirlas', 'Tieši vai apgriezti: kā atšķirt'),
        b: [
          KEY('<b>Directa</b> (más → más): más kilos, más precio. Se conserva el <b>cociente</b> (el precio por kilo).<br><b>Inversa</b> (más → menos): más obreros, menos días. Se conserva el <b>producto</b> (obreros · días).',
              '<b>Tieši proporcionāli</b> (vairāk → vairāk): vairāk kilogramu — lielāka cena. Nemainīgs ir <b>dalījums</b> (cena par kg).<br><b>Apgriezti proporcionāli</b> (vairāk → mazāk): vairāk strādnieku — mazāk dienu. Nemainīgs ir <b>reizinājums</b> (strādnieki · dienas).'),
          EX('Directa: 4 kg cuestan 6 €. ¿7 kg?', 'Tieši: 4 kg maksā 6 €. Cik maksā 7 kg?', [
            S('Precio por kg: 6 : 4 = 1,5 €', 'Cena par kg: 6 : 4 = 1,5 €'),
            S('7 · 1,5 = <b>10,50 €</b>', '7 · 1,5 = <b>10,50 €</b>')
          ]),
          EX('Inversa: 6 obreros tardan 15 días. ¿9 obreros?', 'Apgriezti: 6 strādnieki paveic 15 dienās. Cik dienās 9?', [
            S('Trabajo total = 6 · 15 = <b>90 obrero-días</b>', 'Kopējais darbs = 6 · 15 = <b>90 strādnieku-dienas</b>'),
            S('90 : 9 = <b>10 días</b>', '90 : 9 = <b>10 dienas</b>')
          ]),
          WARN('Antes de calcular, pregúntate en voz alta: “si aumento uno, ¿el otro sube o baja?”. Esa frase evita el error más caro del bloque.',
               'Pirms rēķināšanas skaļi pajautā: “ja viens palielinās, otrs aug vai samazinās?”. Šis jautājums pasargā no dārgākās kļūdas.')
        ]
      },
      {
        t: T('Reparto proporcional', 'Proporcionāla sadale'),
        b: [
          P('Se suman las partes, se calcula <b>cuánto vale una parte</b> y se multiplica.',
            'Saskaita daļas, aprēķina, <b>cik vērta ir viena daļa</b>, un reizina.'),
          EX('Reparte 180 € en la proporción 2 : 3 : 4', 'Sadali 180 € attiecībā 2 : 3 : 4', [
            S('Partes: 2 + 3 + 4 = 9', 'Daļas: 2 + 3 + 4 = 9'),
            S('Una parte: 180 : 9 = 20 €', 'Viena daļa: 180 : 9 = 20 €'),
            S('20 · 2 = 40 €, 20 · 3 = 60 €, 20 · 4 = 80 €', '20 · 2 = 40 €, 20 · 3 = 60 €, 20 · 4 = 80 €'),
            S('Comprobación: 40 + 60 + 80 = 180 ✓', 'Pārbaude: 40 + 60 + 80 = 180 ✓')
          ])
        ]
      },
      {
        t: T('Escala de mapas', 'Mērogs'),
        b: [
          P('Escala 1 : 50 000 significa que <b>1 cm en el mapa = 50 000 cm en la realidad</b>.',
            'Mērogs 1 : 50 000 nozīmē, ka <b>1 cm kartē = 50 000 cm dabā</b>.'),
          EX('8 cm en un mapa 1 : 50 000', '8 cm kartē ar mērogu 1 : 50 000', [
            S('8 · 50 000 = 400 000 cm', '8 · 50 000 = 400 000 cm'),
            S('400 000 cm = 4000 m = <b>4 km</b>', '400 000 cm = 4000 m = <b>4 km</b>'),
            S('Regla: cm → m es <b>: 100</b>, m → km es <b>: 1000</b>.', 'Likums: cm → m ir <b>: 100</b>, m → km ir <b>: 1000</b>.')
          ])
        ]
      }
    ]
  };

  /* =====================================================
     8 · MAGNITUDES Y UNIDADES
     ===================================================== */
  L.mag = {
    sections: [
      {
        t: T('Longitud, área y volumen', 'Garums, laukums un tilpums'),
        b: [
          KEY('<b>Longitud</b> km — m — dm — cm — mm: cada escalón <b>×10</b>.<br><b>Área</b>: cada escalón <b>×100</b>.<br><b>Volumen</b>: cada escalón <b>×1000</b>.',
              '<b>Garums</b> km — m — dm — cm — mm: katrs solis <b>×10</b>.<br><b>Laukums</b>: katrs solis <b>×100</b>.<br><b>Tilpums</b>: katrs solis <b>×1000</b>.'),
          TAB([T('Magnitud', 'Lielums'), T('Equivalencias que hay que saber', 'Jāzina no galvas')], [
            [T('Longitud', 'Garums'), '1 km = 1000 m · 1 m = 100 cm = 1000 mm · 1 dm = 10 cm'],
            [T('Área', 'Laukums'), '1 m² = 10 000 cm² · 1 cm² = 100 mm² · 1 ha = 10 000 m² · 1 km² = 100 ha'],
            [T('Volumen', 'Tilpums'), '1 m³ = 1000 dm³ · <b>1 dm³ = 1 l</b> · <b>1 cm³ = 1 ml</b> · 1 l = 1000 ml'],
            [T('Masa', 'Masa'), '1 t = 1000 kg · 1 kg = 1000 g · 1 g = 1000 mg']
          ]),
          TIP('Al convertir, pregúntate: ¿voy a una unidad más pequeña? Entonces el número tiene que salir <b>más grande</b>. Es la comprobación que salva.',
              'Pārveidojot pajautā: vai eju uz mazāku mērvienību? Tad skaitlim jākļūst <b>lielākam</b>. Šī pārbaude glābj.')
        ]
      },
      {
        t: T('El tiempo NO es decimal', 'Laiks NAV decimāls'),
        b: [
          WARN('El error más frecuente del examen: 3,4 h <b>no</b> son 340 minutos, son 3,4 · 60 = <b>204 minutos</b>. Y 2,5 h = 2 h 30 min (no 2 h 50 min).',
               'Biežākā pārbaudījuma kļūda: 3,4 h <b>nav</b> 340 minūtes, bet 3,4 · 60 = <b>204 minūtes</b>. Un 2,5 h = 2 h 30 min (nevis 2 h 50 min).'),
          TAB([T('Fracción de hora', 'Stundas daļa'), T('Minutos', 'Minūtes')], [
            [F(1,2) + ' h', '30 min'], [F(1,3) + ' h', '20 min'], [F(1,4) + ' h', '15 min'],
            [F(3,4) + ' h', '45 min'], [F(1,6) + ' h', '10 min'], [F(1,12) + ' h', '5 min']
          ]),
          P('Para pasar minutos a horas: 195 min = 195 : 60 = 3 y sobran 15 → <b>3 h 15 min</b>.',
            'No minūtēm uz stundām: 195 min = 195 : 60 = 3, atlikums 15 → <b>3 h 15 min</b>.')
        ]
      },
      {
        t: T('Velocidad, distancia y tiempo', 'Ātrums, attālums un laiks'),
        b: [
          KEY('v = d : t &nbsp;·&nbsp; d = v · t &nbsp;·&nbsp; t = d : v<br>Las unidades tienen que <b>casar</b>: si la velocidad está en km/h, el tiempo va en horas.',
              'v = s : t &nbsp;·&nbsp; s = v · t &nbsp;·&nbsp; t = s : v<br>Mērvienībām jāsader: ja ātrums km/h, laiks jāizsaka stundās.'),
          EX('Un ciclista va a 18 km/h durante 40 minutos', 'Riteņbraucējs brauc 18 km/h 40 minūtes', [
            S('40 min = ' + F(40,60) + ' h = ' + F(2,3) + ' h', '40 min = ' + F(40,60) + ' h = ' + F(2,3) + ' h'),
            S('d = 18 · ' + F(2,3) + ' = <b>12 km</b>', 's = 18 · ' + F(2,3) + ' = <b>12 km</b>')
          ]),
          TIP('1 m/s = 3,6 km/h. Para pasar km/h → m/s se divide entre 3,6. 72 km/h = 20 m/s.',
              '1 m/s = 3,6 km/h. No km/h uz m/s dala ar 3,6. 72 km/h = 20 m/s.')
        ]
      }
    ]
  };

  /* =====================================================
     9 · ESTADÍSTICA Y PROBABILIDAD
     ===================================================== */
  L.sta = {
    sections: [
      {
        t: T('Media, moda, mediana y rango', 'Vidējais, moda, mediāna un amplitūda'),
        b: [
          TAB([T('Concepto', 'Jēdziens'), T('Letón', 'Latviski'), T('Cómo se calcula', 'Kā aprēķina')], [
            [T('Media aritmética', 'Vidējais aritmētiskais'), 'vidējais aritmētiskais', T('suma de los datos : cuántos son', 'datu summa : datu skaits')],
            [T('Moda', 'Moda'), 'moda', T('el valor que más se repite', 'visbiežāk sastopamā vērtība')],
            [T('Mediana', 'Mediāna'), 'mediāna', T('el del centro <b>después de ordenar</b> (si son pares, la media de los dos centrales)', 'vidējā vērtība <b>pēc sakārtošanas</b> (ja skaits pāra — divu vidējo vidējais)')],
            [T('Rango', 'Amplitūda'), 'amplitūda', T('el mayor menos el menor', 'lielākais mīnus mazākais')]
          ]),
          KEY('La media se <b>deshace multiplicando</b>: si la media de 5 datos es 12, la suma es 5 · 12 = 60. Casi todos los problemas de media del examen se resuelven con esta idea.',
              'Vidējo <b>atgriež, reizinot</b>: ja 5 datu vidējais ir 12, summa ir 5 · 12 = 60. Gandrīz visi vidējā uzdevumi risinās ar šo domu.'),
          EX('Notas 7, 8, 6, 9, 8. ¿Qué hace falta en la 6.ª para tener media 8?', 'Vērtējumi 7, 8, 6, 9, 8. Kāds vajadzīgs 6., lai vidējais būtu 8?', [
            S('Suma actual: 7+8+6+9+8 = 38', 'Pašreizējā summa: 7+8+6+9+8 = 38'),
            S('Suma necesaria: 8 · 6 = 48', 'Nepieciešamā summa: 8 · 6 = 48'),
            S('48 − 38 = <b>10</b>', '48 − 38 = <b>10</b>')
          ])
        ]
      },
      {
        t: T('Leer diagramas', 'Diagrammu lasīšana'),
        b: [
          LIST([
            T('<b>De barras</b> (stabiņu diagramma): compara categorías. Lee siempre la escala del eje vertical.', '<b>Stabiņu diagramma</b>: salīdzina kategorijas. Vienmēr izlasi vertikālās ass skalu.'),
            T('<b>De líneas</b> (līniju diagramma): muestra la evolución en el tiempo.', '<b>Līniju diagramma</b>: rāda izmaiņas laikā.'),
            T('<b>Circular</b> (sektoru diagramma): partes de un todo. El círculo entero = 100 % = 360°.', '<b>Sektoru diagramma</b>: daļas no veselā. Viss riņķis = 100 % = 360°.')
          ]),
          KEY('En un diagrama circular, <b>1 % = 3,6°</b>. Así, 35 % → 35 · 3,6 = 126°.',
              'Sektoru diagrammā <b>1 % = 3,6°</b>. Tātad 35 % → 35 · 3,6 = 126°.')
        ]
      },
      {
        t: T('Probabilidad sencilla', 'Vienkārša varbūtība'),
        b: [
          P('P = <b>casos favorables : casos posibles</b>. Siempre sale un número entre 0 y 1 (o entre 0 % y 100 %).',
            'P = <b>labvēlīgo gadījumu skaits : visu iespējamo gadījumu skaits</b>. Rezultāts vienmēr ir no 0 līdz 1 (jeb no 0 % līdz 100 %).'),
          EX('En una bolsa hay 5 rojas, 3 azules y 4 verdes. ¿Probabilidad de azul?', 'Maisiņā 5 sarkanas, 3 zilas, 4 zaļas. Kāda ir varbūtība izvilkt zilu?', [
            S('Total: 5 + 3 + 4 = 12', 'Kopā: 5 + 3 + 4 = 12'),
            S('P = ' + F(3,12) + ' = ' + F(1,4) + ' = 0,25 = <b>25 %</b>', 'P = ' + F(3,12) + ' = ' + F(1,4) + ' = 0,25 = <b>25 %</b>')
          ])
        ]
      }
    ]
  };

  /* =====================================================
     10 · LENGUAJE MATEMÁTICO Y ECUACIONES
     ===================================================== */
  L.lang = {
    sections: [
      {
        t: T('Traducir el texto a matemáticas', 'Teksta pārtulkošana matemātikas valodā'),
        b: [
          TAB([T('En palabras', 'Vārdiem'), T('Latviski', 'Latviski'), T('En símbolos', 'Simbolos')], [
            [T('un número', 'kāds skaitlis'), 'skaitlis', 'x'],
            [T('5 más que x', 'par 5 lielāks nekā x'), 'par 5 vairāk', 'x + 5'],
            [T('el triple de x', 'x trīskāršs'), '3 reizes vairāk', '3x'],
            [T('la mitad de x', 'puse no x'), 'puse', FS('x',2)],
            [T('x aumentado un 20 %', 'x palielināts par 20 %'), 'par 20 % vairāk', '1,2x'],
            [T('dos números consecutivos', 'divi secīgi skaitļi'), 'secīgi skaitļi', 'x, x+1'],
            [T('x es 4 <b>veces</b> mayor que y', 'x ir 4 <b>reizes</b> lielāks nekā y'), '4 reizes', 'x = 4y'],
            [T('x es 4 <b>unidades</b> mayor que y', 'x ir <b>par</b> 4 lielāks nekā y'), 'par 4', 'x = y + 4']
          ]),
          WARN('“4 veces más” (<i>4 reizes vairāk</i>) y “4 más” (<i>par 4 vairāk</i>) son cosas distintas. El examen lo pregunta casi todos los años.',
               '“4 reizes vairāk” un “par 4 vairāk” ir dažādas lietas. Pārbaudījumā tas parādās gandrīz katru gadu.')
        ]
      },
      {
        t: T('Hallar el término desconocido', 'Nezināmā darbības locekļa atrašana'),
        b: [
          TAB([T('Ecuación', 'Vienādojums'), T('Despeje', 'Atrisinājums'), T('Regla en palabras', 'Likums vārdiem')], [
            ['x + a = b', 'x = b − a', T('sumando = suma − sumando', 'saskaitāmais = summa − saskaitāmais')],
            ['x − a = b', 'x = b + a', T('minuendo = diferencia + sustraendo', 'mazināmais = starpība + mazinātājs')],
            ['a − x = b', 'x = a − b', T('sustraendo = minuendo − diferencia', 'mazinātājs = mazināmais − starpība')],
            ['x · a = b', 'x = b : a', T('factor = producto : factor', 'reizinātājs = reizinājums : reizinātājs')],
            ['x : a = b', 'x = b · a', T('dividendo = cociente · divisor', 'dalāmais = dalījums · dalītājs')],
            ['a : x = b', 'x = a : b', T('divisor = dividendo : cociente', 'dalītājs = dalāmais : dalījums')]
          ]),
          EX('Resuelve x : ' + F(1,5) + ' = 20', 'Atrisini x : ' + F(1,5) + ' = 20', [
            S('Dividendo = cociente · divisor', 'Dalāmais = dalījums · dalītājs'),
            S('x = 20 · ' + F(1,5) + ' = <b>4</b>', 'x = 20 · ' + F(1,5) + ' = <b>4</b>'),
            S('Comprobación: 4 : ' + F(1,5) + ' = 4 · 5 = 20 ✓', 'Pārbaude: 4 : ' + F(1,5) + ' = 4 · 5 = 20 ✓')
          ])
        ]
      },
      {
        t: T('Ecuaciones de dos pasos', 'Divsoļu vienādojumi'),
        b: [
          P('Se deshacen las operaciones <b>en orden inverso</b>: primero lo que está más lejos de la x.',
            'Darbības atceļ <b>apgrieztā secībā</b>: vispirms to, kas ir vistālāk no x.'),
          EX('Pensé un número, lo multipliqué por 4, resté 7 y obtuve 25', 'Iedomājos skaitli, reizināju ar 4, atņēmu 7 un ieguvu 25', [
            S('4x − 7 = 25', '4x − 7 = 25'),
            S('4x = 25 + 7 = 32', '4x = 25 + 7 = 32'),
            S('x = 32 : 4 = <b>8</b>', 'x = 32 : 4 = <b>8</b>'),
            S('Comprobación: 8 · 4 − 7 = 25 ✓', 'Pārbaude: 8 · 4 − 7 = 25 ✓')
          ]),
          TIP('Truco para los problemas de edades y de repartos: llama x <b>a lo más pequeño</b>. Así las demás cantidades salen sumando, no restando.',
              'Padoms vecuma un sadales uzdevumos: par x apzīmē <b>mazāko</b> lielumu. Tad pārējos iegūst, saskaitot, nevis atņemot.'),
          EX('Ana tiene 3 años más que Beto y juntos suman 27', 'Anna ir par 3 gadiem vecāka nekā Bruno; kopā 27 gadi', [
            S('Beto = x (el pequeño), Ana = x + 3', 'Bruno = x (mazākais), Anna = x + 3'),
            S('x + (x + 3) = 27 → 2x + 3 = 27', 'x + (x + 3) = 27 → 2x + 3 = 27'),
            S('2x = 24 → x = 12', '2x = 24 → x = 12'),
            S('Beto <b>12</b>, Ana <b>15</b>', 'Bruno <b>12</b>, Anna <b>15</b>')
          ])
        ]
      }
    ]
  };

})(typeof window !== 'undefined' ? window : globalThis);
