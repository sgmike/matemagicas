/* =========================================================
   Plan de estudio de 6 meses (24 semanas)
   Dos sesiones de 45 minutos por semana.
   ========================================================= */
(function (global) {
  'use strict';
  const MM = global.MM, T = MM.T;

  MM.PLAN = {
    intro: T('Seis meses, dos sesiones de 45 minutos por semana. Los tres primeros meses son las bases (más de la mitad del examen); los dos siguientes, las herramientas; el último, simulacros cronometrados.',
             'Seši mēneši, divas 45 minūšu nodarbības nedēļā. Pirmie trīs mēneši — pamati (vairāk nekā puse pārbaudījuma); nākamie divi — rīki; pēdējais — simulācijas ar hronometru.'),
    months: [
      {
        t: T('Mes 1 · Los cimientos', '1. mēnesis · Pamati'),
        note: T('Sin fracciones automáticas no hay examen que valga. Este mes es el más importante de los seis.',
                'Bez automātiskām daļām nav ko cerēt. Šis mēnesis ir vissvarīgākais no visiem sešiem.'),
        weeks: [
          { n: 1, topics: ['nat'], goal: T('Criterios de divisibilidad de memoria y descomposición en factores primos.', 'Dalāmības pazīmes no galvas un sadalīšana pirmreizinātājos.') },
          { n: 2, topics: ['nat', 'frac'], goal: T('MCD y mcm sin dudar; simplificar fracciones con soltura.', 'LKD un MKD bez šaubām; prast saīsināt daļas.') },
          { n: 3, topics: ['frac'], goal: T('Sumar y restar fracciones y números mixtos, incluido el préstamo.', 'Saskaitīt un atņemt daļas un jauktus skaitļus, arī ar aizņemšanos.') },
          { n: 4, topics: ['frac'], goal: T('Multiplicar y dividir fracciones simplificando en cruz.', 'Reizināt un dalīt daļas, saīsinot krustām.') }
        ]
      },
      {
        t: T('Mes 2 · Decimales y negativos', '2. mēnesis · Decimāldaļas un negatīvie skaitļi'),
        note: T('Aquí se pierden más puntos por despiste que por no saber. Escribir todos los pasos.',
                'Šeit vairāk punktu zaudē neuzmanības dēļ nekā nezināšanas dēļ. Pieraksti visus soļus.'),
        weeks: [
          { n: 5, topics: ['dec'], goal: T('Las cuatro operaciones con decimales y el truco de la coma.', 'Četras darbības ar decimāldaļām un komata paņēmiens.') },
          { n: 6, topics: ['dec', 'frac'], goal: T('Pasar de fracción a decimal y al revés; la tabla de memoria.', 'Pārveidot daļas decimāldaļās un otrādi; tabula no galvas.') },
          { n: 7, topics: ['neg'], goal: T('Recta numérica, módulo, opuestos y sumar/restar negativos.', 'Skaitļu ass, modulis, pretēji skaitļi, saskaitīšana un atņemšana.') },
          { n: 8, topics: ['neg', 'pow'], goal: T('Regla de los signos y quitar paréntesis sin perder ninguno.', 'Zīmju likums un iekavu atvēršana, nepazaudējot nevienu zīmi.') }
        ]
      },
      {
        t: T('Mes 3 · Porcentajes y proporciones', '3. mēnesis · Procenti un proporcijas'),
        note: T('El bloque más rentable: aparece en la Parte A y en la Parte B todos los años.',
                'Visizdevīgākais bloks: parādās gan A, gan B daļā katru gadu.'),
        weeks: [
          { n: 9, topics: ['pow'], goal: T('Potencias, orden de operaciones y unidades al cuadrado.', 'Pakāpes, darbību secība un kvadrātiskās mērvienības.') },
          { n: 10, topics: ['pct'], goal: T('Los tres tipos de problema de porcentaje.', 'Trīs procentu uzdevumu veidi.') },
          { n: 11, topics: ['pct'], goal: T('Descuentos y subidas con el multiplicador; deshacerlos dividiendo.', 'Atlaides un pieaugumi ar reizinātāju; atgriešanās, dalot.') },
          { n: 12, topics: ['rat'], goal: T('Distinguir directa e inversa; reparto proporcional y escalas.', 'Atšķirt tieši un apgriezti proporcionālu; sadale un mērogs.') }
        ]
      },
      {
        t: T('Mes 4 · Medidas, datos y lenguaje', '4. mēnesis · Mērījumi, dati un valoda'),
        note: T('Un cuarto del examen se juega en leer bien y traducir el texto a números.',
                'Ceturtā daļa pārbaudījuma ir prasme uzmanīgi lasīt un pārtulkot tekstu skaitļos.'),
        weeks: [
          { n: 13, topics: ['mag'], goal: T('Conversiones de longitud, área, volumen y masa.', 'Garuma, laukuma, tilpuma un masas pārveidošana.') },
          { n: 14, topics: ['mag'], goal: T('El tiempo no es decimal; velocidad, distancia y tiempo.', 'Laiks nav decimāls; ātrums, attālums un laiks.') },
          { n: 15, topics: ['sta'], goal: T('Media, moda, mediana, rango y leer diagramas.', 'Vidējais, moda, mediāna, amplitūda un diagrammu lasīšana.') },
          { n: 16, topics: ['lang'], goal: T('Traducir enunciados y hallar el término desconocido.', 'Pārtulkot uzdevumus un atrast nezināmo.') }
        ]
      },
      {
        t: T('Mes 5 · Geometría y problemas', '5. mēnesis · Ģeometrija un uzdevumi'),
        note: T('Los problemas de la Parte B casi siempre son de estos tipos. Repetirlos hasta que salgan solos.',
                'B daļas uzdevumi gandrīz vienmēr ir šie tipi. Jāatkārto, līdz sanāk automātiski.'),
        weeks: [
          { n: 17, topics: ['geo'], goal: T('Perímetro, área, ángulos y figuras compuestas.', 'Perimetrs, laukums, leņķi un saliktas figūras.') },
          { n: 18, topics: ['coo', 'vol'], goal: T('Plano de coordenadas, el robot, volumen y litros.', 'Koordinātu plakne, robots, tilpums un litri.') },
          { n: 19, topics: ['wm'], goal: T('Trabajo conjunto por unidades de trabajo y por ritmos.', 'Kopīgs darbs — darba vienības un ražīgums.') },
          { n: 20, topics: ['wm'], goal: T('Encuentro, alcance, trenes y conjuntos.', 'Satikšanās, panākšana, vilcieni un kopas.') }
        ]
      },
      {
        t: T('Mes 6 · Simulacros', '6. mēnesis · Simulācijas'),
        note: T('Cronómetro, bolígrafo y sin calculadora. Después de cada simulacro, media hora repasando SOLO los fallos.',
                'Hronometrs, pildspalva, bez kalkulatora. Pēc katras simulācijas pusstunda TIKAI kļūdu labošanai.'),
        weeks: [
          { n: 21, topics: ['log', 'lang'], goal: T('Lógica, torneos, cortes y las trampas de lectura.', 'Loģika, turnīri, griezumi un lasīšanas slazdi.') },
          { n: 22, topics: [], goal: T('Primer simulacro completo cronometrado (150 min).', 'Pirmā pilnā simulācija ar hronometru (150 min).') },
          { n: 23, topics: [], goal: T('Repasar el cuaderno de errores y practicar los 3 temas más flojos.', 'Pārskatīt kļūdu burtnīcu un trenēt 3 vājākos tematus.') },
          { n: 24, topics: [], goal: T('Segundo simulacro completo + repaso final del glosario en letón.', 'Otrā pilnā simulācija + latviešu vārdnīcas atkārtošana.') }
        ]
      }
    ],
    habits: [
      T('<b>Escribir todos los pasos siempre</b>, incluso en lo fácil: en la Parte B se puntúa el procedimiento, no solo el resultado.',
        '<b>Vienmēr pieraksti visus soļus</b>, arī vieglajos uzdevumos: B daļā vērtē risinājumu, ne tikai rezultātu.'),
      T('<b>Cuaderno de errores.</b> Cada fallo, una línea con la causa. Repasarlo antes de cada simulacro sube más la nota que hacer ejercicios nuevos.',
        '<b>Kļūdu burtnīca.</b> Katrai kļūdai — viena rinda ar iemeslu. Tās pārlasīšana pirms simulācijas dod vairāk nekā jauni uzdevumi.'),
      T('<b>15 minutos diarios</b> valen más que dos horas el domingo.',
        '<b>15 minūtes katru dienu</b> ir vērtīgākas nekā divas stundas svētdienā.'),
      T('<b>Leer el enunciado dos veces</b> y subrayar la pregunta antes de calcular.',
        '<b>Izlasi uzdevumu divreiz</b> un pasvītro jautājumu, pirms sāc rēķināt.'),
      T('<b>Practicar en letón.</b> El examen es solo en letón: el glosario de esta web es para eso.',
        '<b>Trenējies latviski.</b> Pārbaudījums ir tikai latviešu valodā — tam ir šī vārdnīca.')
    ]
  };
})(typeof window !== 'undefined' ? window : globalThis);
