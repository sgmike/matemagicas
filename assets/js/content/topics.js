/* =========================================================
   Los 15 temas del examen: nombre, icono, descripción y
   peso aproximado en el examen (para el simulacro)
   ========================================================= */
(function (global) {
  'use strict';
  const MM = global.MM, T = MM.T;

  MM.TOPICS = [
    { id: 'nat', emoji: '🔢', w: 5,
      name: T('Naturales y divisibilidad', 'Naturāli skaitļi un dalāmība'),
      sub: T('Divisores, múltiplos, primos, MCD y mcm', 'Dalītāji, dalāmie, pirmskaitļi, LKD un MKD') },
    { id: 'frac', emoji: '🍕', w: 11,
      name: T('Fracciones', 'Parastās daļas'),
      sub: T('Sumar, restar, multiplicar, dividir y comparar', 'Saskaitīt, atņemt, reizināt, dalīt un salīdzināt') },
    { id: 'dec', emoji: '🔟', w: 8,
      name: T('Decimales', 'Decimāldaļas'),
      sub: T('Operaciones, coma, redondeo y conversiones', 'Darbības, komats, noapaļošana un pārveidošana') },
    { id: 'neg', emoji: '🌡️', w: 7,
      name: T('Números negativos', 'Pozitīvi un negatīvi skaitļi'),
      sub: T('Recta numérica, módulo y regla de los signos', 'Skaitļu ass, modulis un zīmju likums') },
    { id: 'pow', emoji: '⚡', w: 4,
      name: T('Potencias y orden', 'Pakāpes un darbību secība'),
      sub: T('Cuadrados, cubos y en qué orden se calcula', 'Kvadrāti, kubi un aprēķinu secība') },
    { id: 'pct', emoji: '💯', w: 9,
      name: T('Porcentajes', 'Procenti'),
      sub: T('Descuentos, subidas y el truco del multiplicador', 'Atlaides, pieaugumi un reizinātāja paņēmiens') },
    { id: 'rat', emoji: '⚖️', w: 7,
      name: T('Razones y proporciones', 'Attiecības un proporcijas'),
      sub: T('Regla de tres, reparto proporcional y escalas', 'Trīs likums, proporcionāla sadale un mērogs') },
    { id: 'mag', emoji: '📏', w: 6,
      name: T('Magnitudes y unidades', 'Lielumi un mērvienības'),
      sub: T('Longitud, área, volumen, masa, tiempo y velocidad', 'Garums, laukums, tilpums, masa, laiks un ātrums') },
    { id: 'sta', emoji: '📊', w: 10,
      name: T('Estadística y probabilidad', 'Statistika un varbūtība'),
      sub: T('Media, moda, mediana, diagramas y probabilidad', 'Vidējais, moda, mediāna, diagrammas un varbūtība') },
    { id: 'lang', emoji: '✏️', w: 6,
      name: T('Lenguaje y ecuaciones', 'Matemātiskā valoda un vienādojumi'),
      sub: T('Traducir el texto a matemáticas y despejar la x', 'Tekstu pārtulkot matemātikā un atrast x') },
    { id: 'geo', emoji: '📐', w: 5,
      name: T('Geometría plana', 'Plaknes ģeometrija'),
      sub: T('Perímetro, área, ángulos y triángulos', 'Perimetrs, laukums, leņķi un trijstūri') },
    { id: 'coo', emoji: '🗺️', w: 3,
      name: T('Plano de coordenadas', 'Koordinātu plakne'),
      sub: T('Puntos, cuadrantes y el robot que se mueve', 'Punkti, kvadranti un robota ceļš') },
    { id: 'vol', emoji: '📦', w: 3,
      name: T('Cuerpos y volumen', 'Telpiskās figūras un tilpums'),
      sub: T('Ortoedro, cubo, litros y área total', 'Paralēlskaldnis, kubs, litri un virsmas laukums') },
    { id: 'wm', emoji: '🏃', w: 11,
      name: T('Trabajo y movimiento', 'Darba un kustības uzdevumi'),
      sub: T('Grifos, obreros, encuentros, alcances y conjuntos', 'Krāni, strādnieki, satikšanās, panākšana un kopas') },
    { id: 'log', emoji: '🧩', w: 5,
      name: T('Lógica y razonamiento', 'Loģika un spriešana'),
      sub: T('Tablas, torneos, cortes y trampas de lectura', 'Tabulas, turnīri, griezumi un lasīšanas slazdi') }
  ];

  MM.topic = id => MM.TOPICS.find(t => t.id === id);
  MM.topicIndex = id => MM.TOPICS.findIndex(t => t.id === id) + 1;

})(typeof window !== 'undefined' ? window : globalThis);
