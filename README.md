# ✨ MateMágicas · Riga 7. klase

Web bilingüe **español–letón** para preparar el **examen unificado de matemáticas de los gimnasios
estatales de Riga** (entrada a 7.º curso), pensada para trabajar madre/padre e hija juntos.

- **15 temas** con explicación, ejemplos resueltos y ejercicios.
- **Ejercicios infinitos**: se generan al azar, nunca se repiten igual.
- **Se autocorrigen** y **siempre** se puede ver la **solución paso a paso**, antes o después de responder.
- **Todo en los dos idiomas** a la vez (ES · LV), porque el examen es solo en letón.
- **Guarda el progreso** en el navegador: racha, nivel, estrellas por tema y cuaderno de errores.
- **Simulacro de examen** cronometrado con la estructura real (Parte A + Parte B).
- **Plan de estudio de 6 meses** y **glosario letón ↔ español**.
- **🎮 Modo juego** (en español, estilo Duolingo): 15 mundos × 6 niveles (aprende, mira cómo se hace,
  tres niveles de ejercicios y un jefe final), vidas, estrellas, puntos, objetivo diario y semanal.
  Los ejemplos se ven paso a paso con un reproductor (▶ ⏸ ⏭). En los niveles altos el enunciado
  aparece en letón con traducción a un toque.
- **👨‍👧 Panel de padres** con PIN: puntos por semana comparados con las semanas anteriores, días
  activos, aciertos, niveles superados y una tabla para anotar el premio de cada semana.

---

## Cómo se usa

1. Abre la URL de la web (ver *Publicar* más abajo).
2. La primera vez pide un nombre y un avatar. Se pueden crear **dos perfiles** (por ejemplo, hija y padre)
   y cambiar de uno a otro en **Ajustes**.
3. Rutina recomendada: **lección → practicar → reto del día**. Y una vez al mes, un **simulacro**.
4. El botón **ES / ES+LV / LV** (arriba a la derecha) cambia el idioma al instante.

### El juego, en dos líneas

Ella entra en **🎮 Juego** y pulsa **▶ Continuar**: la web le lleva siempre al siguiente nivel.
Tú entras en **👨‍👧 Padres** (PIN de fábrica `1234`, cámbialo dentro), ves los puntos de la semana
y marcas el premio.

### Consejos de uso

- En la **Parte B** del examen real se puntúa el procedimiento: aunque aquí solo se escriba el resultado,
  conviene hacer los pasos en papel.
- El **cuaderno de errores** guarda cada fallo con su ejercicio exacto para repetirlo después.
  Es lo que más sube la nota.
- El **modo dúo** (Ajustes) hace que los dos perfiles se turnen y compitan en la misma ronda.
- El progreso vive en el navegador. En **Ajustes → Copia de seguridad** se puede descargar un `.json`
  y cargarlo en otro dispositivo.

---

## Cómo se escriben las respuestas

| Se puede escribir | Ejemplos |
|---|---|
| Enteros y decimales (con coma o punto) | `24` · `3,5` · `3.5` |
| Fracciones | `17/42` · `-4/5` |
| Números mixtos | `1 23/36` (con un espacio) |
| Razones | `2:3` |
| Porcentajes | `30` o `30 %` |
| Factorizaciones | `2·2·3·7` · `2^2*3*7` |

Se aceptan las formas equivalentes (`0,75` = `3/4`), salvo cuando el ejercicio pide explícitamente
la fracción simplificada.

---

## Publicar la web (GitHub Pages)

El sitio es HTML/CSS/JS puro: **no hay que compilar nada**.

1. En GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
   (Es el único paso manual; hay que hacerlo una vez.)
2. Con cada push a la rama principal, el workflow `.github/workflows/pages.yml`
   pasa las pruebas y publica la web.
3. La URL será **`https://sgmike.github.io/matemagicas/`**.

También funciona abriendo `index.html` directamente desde el disco (sin servidor), y se puede
**instalar como app** en el móvil o la tablet ("Añadir a la pantalla de inicio"), con funcionamiento
sin conexión.

---

## Estructura del proyecto

```
index.html                  una sola página; las pantallas se montan con JS
assets/css/app.css          todos los estilos (claro/oscuro, responsive, impresión)
assets/js/core/
  core.js                   fracciones exactas, formato de números, lectura y
                            validación de respuestas, registro de generadores
  store.js                  progreso, perfiles, racha, cuaderno de errores
  i18n.js                   textos de la interfaz (ES/LV)
assets/js/content/
  lessons-1..3.js           las 15 lecciones bilingües
  gen-*.js                  109 generadores de ejercicios con su solución paso a paso
  topics.js                 los 15 temas y su peso en el examen
  plan.js                   plan de 6 meses
  glossary.js               glosario letón ↔ español
assets/js/app/
  engine.js                 rondas de práctica, dificultad adaptativa, modo dúo
  views.js                  pantallas
  exam.js                   simulacro y corrección
  main.js                   rutas, eventos y arranque
tools/selftest.js           prueba todos los generadores (sin navegador)
tools/smoke.js              prueba la web en un navegador real
```

### Añadir un tipo de ejercicio nuevo

```js
MM.gen.register('frac.miEjercicio', {
  topic: 'frac', level: 2, part: 'A',
  name: MM.T('Nombre en español', 'Nosaukums latviski'),
  make(rng) {
    const a = rng.int(2, 9);
    return {
      q: MM.T('¿Cuánto es ' + a + ' · 3?', 'Cik ir ' + a + ' · 3?'),
      answerType: 'num', answer: String(a * 3),
      solution: [MM.T(a + ' · 3 = <b>' + a * 3 + '</b>', a + ' · 3 = <b>' + a * 3 + '</b>')],
      hint: MM.T('Piensa en sumas repetidas.', 'Padomā par atkārtotu saskaitīšanu.')
    };
  }
});
```

El tema se elige con `topic`, la dificultad con `level` (1–3) y `part` decide si el ejercicio puede
salir en la Parte A (respuesta corta) o en la Parte B (problema).

---

## Pruebas

```bash
node tools/selftest.js 250   # genera ~27.000 ejercicios y comprueba que se corrigen bien
node tools/smoke.js          # abre la web en Chromium y recorre todas las pantallas
node tools/smoke.js --shots  # además guarda capturas en tools/shots/
```

`selftest` comprueba, para cada generador y cientos de semillas, que el enunciado existe en los dos
idiomas, que la respuesta correcta se valida como correcta (y una incorrecta como incorrecta), que
hay solución paso a paso y que no se cuela ningún `NaN` ni `undefined`.

---

## Contenido cubierto

Los 15 temas siguen el contenido obligatorio del estándar de matemáticas de 1.º a 9.º que exige la
prueba, con el reparto aproximado del examen real:

| Bloque del examen | Peso | Temas de la web |
|---|---|---|
| Números y operaciones | ~35 % | Naturales y divisibilidad · Fracciones · Decimales · Negativos · Potencias |
| Modelos matemáticos (problemas) | ~38 % | Porcentajes · Proporciones · Trabajo y movimiento · Lógica |
| Información y estadística | ~10 % | Estadística y probabilidad |
| Magnitudes y medición | ~9 % | Magnitudes y unidades · Volumen |
| Lenguaje matemático | ~8 % | Lenguaje y ecuaciones · Geometría · Coordenadas |

Fuentes consultadas para el temario y el formato de la prueba:
[programa de la prueba de acceso (RVKĢ, PDF)](https://rkg.rkg.lv/documents/433/Valsts_%C4%A3imn%C4%81ziju_matem%C4%81tikas_iest%C4%81jp%C4%81rbaud%C4%ABjuma_programma_6_1.pdf) ·
[organización de las pruebas de acceso a los gimnasios estatales de Riga](https://izglitiba.riga.lv/lv/izglitiba?target=news_item&news_item=iestajparbaudijumu-organizesana-rigas-valsts-gimnazijas-20262027-macibu-gada-15783) ·
[Rīgas Valsts vācu ģimnāzija · uzņemšana](https://www.rvvg.lv/lv/uznemsana)
