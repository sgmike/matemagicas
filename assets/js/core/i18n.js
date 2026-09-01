/* =========================================================
   MateMágicas · textos de la interfaz (ES / LV)
   ========================================================= */
(function (global) {
  'use strict';
  const MM = global.MM, T = MM.T;

  MM.UI = {
    /* general */
    back:        T('Volver', 'Atpakaļ'),
    close:       T('Cerrar', 'Aizvērt'),
    save:        T('Guardar', 'Saglabāt'),
    cancel:      T('Cancelar', 'Atcelt'),
    start:       T('Empezar', 'Sākt'),
    continueW:   T('Continuar', 'Turpināt'),
    of:          T('de', 'no'),
    points:      T('puntos', 'punkti'),
    minutes:     T('min', 'min'),
    level:       T('Nivel', 'Līmenis'),
    day:         T('día', 'diena'),
    days:        T('días', 'dienas'),

    /* inicio */
    hi:          T('¡Hola', 'Sveika'),
    heroSub:     T('Un poco cada día y en abril el examen será pan comido.',
                   'Katru dienu pa druskai — un aprīlī pārbaudījums būs viegls.'),
    daysToExam:  T('días para el examen', 'dienas līdz pārbaudījumam'),
    dayToExam:   T('día para el examen', 'diena līdz pārbaudījumam'),
    streakOne:   T('día seguido', 'diena pēc kārtas'),
    attemptOne:  T('intento', 'mēģinājums'),
    exerciseOne: T('ejercicio', 'uzdevums'),
    streak:      T('días seguidos', 'dienas pēc kārtas'),
    todayGoal:   T('Hoy', 'Šodien'),
    exercises:   T('ejercicios', 'uzdevumi'),
    keepGoing:   T('Seguir donde lo dejamos', 'Turpināt iesākto'),
    dailyTitle:  T('Reto del día', 'Dienas izaicinājums'),
    dailySub:    T('10 ejercicios mezclados de todos los temas. Cambian cada día.',
                   '10 jaukti uzdevumi no visiem tematiem. Katru dienu citi.'),
    dailyDone:   T('¡Reto de hoy terminado!', 'Šodienas izaicinājums pabeigts!'),
    topicsTitle: T('Los 15 temas del examen', 'Pārbaudījuma 15 temati'),
    weakest:     T('Lo que más conviene repasar hoy', 'Ko šodien vērts atkārtot'),

    /* temas */
    lesson:      T('Lección', 'Mācība'),
    practice:    T('Practicar', 'Trenēties'),
    theory:      T('Explicación y ejemplos', 'Skaidrojums un piemēri'),
    mastery:     T('Dominio', 'Prasme'),
    attempts:    T('intentos', 'mēģinājumi'),
    correctPct:  T('aciertos', 'pareizi'),
    startPractice: T('Practicar este tema', 'Trenēties šajā tematā'),
    readLesson:  T('Leer la lección', 'Lasīt mācību'),
    exTypes:     T('Tipos de ejercicio de este tema', 'Šī temata uzdevumu veidi'),

    /* práctica */
    check:       T('Comprobar', 'Pārbaudīt'),
    next:        T('Siguiente', 'Nākamais'),
    hint:        T('Pista', 'Padoms'),
    showSol:     T('Ver solución', 'Rādīt risinājumu'),
    solution:    T('Solución paso a paso', 'Risinājums soli pa solim'),
    skip:        T('Saltar', 'Izlaist'),
    correct:     T('¡Correcto!', 'Pareizi!'),
    incorrect:   T('Casi. Mira la solución 👇', 'Gandrīz. Apskati risinājumu 👇'),
    revealed:    T('Solución mostrada. Inténtalo tú en el siguiente.',
                   'Risinājums parādīts. Nākamo mēģini pats.'),
    yourAns:     T('Tu respuesta', 'Tava atbilde'),
    rightAns:    T('Respuesta correcta', 'Pareizā atbilde'),
    sessionEnd:  T('Ronda terminada', 'Kārta pabeigta'),
    againRound:  T('Otra ronda', 'Vēl viena kārta'),
    reviewFails: T('Repasar los fallos', 'Atkārtot kļūdas'),
    newExercise: T('Ejercicio nuevo', 'Jauns uzdevums'),
    writeAnswer: T('Escribe la respuesta', 'Ieraksti atbildi'),
    tapAnswer:   T('Elige la respuesta', 'Izvēlies atbildi'),
    duoTurn:     T('Turno de', 'Kārta:'),
    duoOn:       T('Modo dúo (por turnos)', 'Duo režīms (pēc kārtas)'),

    /* errores */
    errTitle:    T('Cuaderno de errores', 'Kļūdu burtnīca'),
    errSub:      T('Aquí se guarda cada fallo con su solución. Repetirlos es lo que más sube la nota.',
                   'Šeit glabājas katra kļūda ar risinājumu. To atkārtošana visvairāk uzlabo rezultātu.'),
    errEmpty:    T('Todavía no hay errores guardados. ¡A practicar!', 'Kļūdu vēl nav. Uz priekšu!'),
    errRepeat:   T('Repetir estos ejercicios', 'Atkārtot šos uzdevumus'),
    errClear:    T('Vaciar el cuaderno', 'Iztukšot burtnīcu'),
    errSolved:   T('¡Corregido y borrado del cuaderno!', 'Izlabots un izņemts no burtnīcas!'),

    /* examen */
    examTitle:   T('Simulacro de examen', 'Pārbaudījuma simulācija'),
    examIntro:   T('Igual que el examen de verdad: Parte A (35 respuestas cortas) y Parte B (15 problemas con todos los pasos). 150 minutos, sin calculadora.',
                   'Tāpat kā īstajā pārbaudījumā: A daļa (35 īsas atbildes) un B daļa (15 uzdevumi ar visiem soļiem). 150 minūtes, bez kalkulatora.'),
    examStart:   T('Empezar el simulacro', 'Sākt simulāciju'),
    examShort:   T('Versión corta (30 min)', 'Īsā versija (30 min)'),
    examFinish:  T('Terminar y corregir', 'Beigt un labot'),
    examConfirm: T('¿Seguro que quieres terminar y corregir?', 'Vai tiešām beigt un labot?'),
    examTime:    T('Tiempo', 'Laiks'),
    examScore:   T('Puntuación', 'Vērtējums'),
    examByTopic: T('Puntos débiles por tema', 'Vājās vietas pa tematiem'),
    examReview:  T('Revisar todas las soluciones', 'Apskatīt visus risinājumus'),
    examAgain:   T('Otro simulacro', 'Vēl viena simulācija'),
    examHistory: T('Simulacros anteriores', 'Iepriekšējās simulācijas'),
    partA:       T('Parte A · respuesta corta', 'A daļa · īsā atbilde'),
    partB:       T('Parte B · con procedimiento', 'B daļa · ar risinājumu'),
    partBNote:   T('En el examen real hay que escribir TODOS los pasos en papel. Escribe aquí solo el resultado, pero haz el procedimiento en tu cuaderno.',
                   'Īstajā pārbaudījumā uz papīra jāpieraksta VISI soļi. Šeit ieraksti tikai rezultātu, bet risinājumu izpildi burtnīcā.'),

    /* plan */
    planTitle:   T('Plan de 6 meses', '6 mēnešu plāns'),
    planSub:     T('Dos sesiones de 45 minutos por semana. Marca cada semana cuando la terminéis.',
                   'Divas 45 minūšu nodarbības nedēļā. Atzīmē katru pabeigto nedēļu.'),
    planWeek:    T('Semana', 'Nedēļa'),
    planGoal:    T('Objetivo', 'Mērķis'),

    /* glosario */
    gloTitle:    T('Glosario letón ↔ español', 'Vārdnīca latviski ↔ spāniski'),
    gloSub:      T('Las palabras que aparecen en los enunciados del examen. El examen es solo en letón.',
                   'Vārdi, kas parādās pārbaudījuma uzdevumos. Pārbaudījums ir tikai latviski.'),
    gloSearch:   T('Buscar palabra…', 'Meklēt vārdu…'),
    gloQuiz:     T('Ponme a prueba', 'Pārbaudi mani'),

    /* progreso */
    progTitle:   T('Progreso', 'Progress'),
    progDays:    T('Actividad de los últimos 3 meses', 'Pēdējo 3 mēnešu aktivitāte'),
    progTopics:  T('Dominio por tema', 'Prasme pa tematiem'),
    progExams:   T('Simulacros', 'Simulācijas'),
    progTotal:   T('Ejercicios resueltos', 'Atrisināti uzdevumi'),

    /* ajustes */
    setTitle:    T('Ajustes', 'Iestatījumi'),
    setProfiles: T('Perfiles', 'Profili'),
    setNew:      T('Añadir perfil', 'Pievienot profilu'),
    setName:     T('Nombre', 'Vārds'),
    setExamDate: T('Fecha del examen', 'Pārbaudījuma datums'),
    setLen:      T('Ejercicios por ronda', 'Uzdevumi vienā kārtā'),
    setExport:   T('Descargar copia del progreso', 'Lejupielādēt progresa dublējumu'),
    setImport:   T('Cargar copia', 'Ielādēt dublējumu'),
    setReset:    T('Borrar todo', 'Dzēst visu'),
    setResetAsk: T('Se borrará TODO el progreso de todos los perfiles. ¿Seguro?',
                   'Tiks dzēsts VISS progress visiem profiliem. Vai tiešām?'),
    setSound:    T('Sonidos', 'Skaņas')
  };
})(typeof window !== 'undefined' ? window : globalThis);
