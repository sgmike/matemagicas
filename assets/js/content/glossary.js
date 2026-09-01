/* =========================================================
   Glosario letón ↔ español de matemáticas
   El examen está escrito SOLO en letón: estas son las
   palabras que hay que reconocer sin dudar.
   ========================================================= */
(function (global) {
  'use strict';
  const MM = global.MM, T = MM.T;

  MM.GLOSSARY = [
    {
      t: T('Lo que pide el enunciado', 'Ko prasa uzdevums'), emoji: '📣',
      items: [
        ['aprēķini', 'calcula'],
        ['atrisini', 'resuelve'],
        ['nosaki', 'determina'],
        ['salīdzini', 'compara'],
        ['pārveido mērvienības', 'convierte las unidades'],
        ['saīsini', 'simplifica'],
        ['uzraksti / pieraksti', 'escribe'],
        ['attēlo', 'representa, dibuja'],
        ['atzīmē', 'marca'],
        ['apvelc', 'encierra (rodea)'],
        ['izvēlies pareizo atbildi', 'elige la respuesta correcta'],
        ['pamato savu atbildi', 'justifica tu respuesta'],
        ['pārbaudi', 'comprueba'],
        ['aizpildi tabulu', 'rellena la tabla'],
        ['norādi visas darbības', 'indica todos los pasos'],
        ['patiess vai aplams', 'verdadero o falso'],
        ['cik', 'cuánto, cuántos'],
        ['kāds / kura / kurš', 'cuál, qué'],
        ['par cik lielāks', 'cuánto mayor (en unidades)'],
        ['cik reižu lielāks', 'cuántas veces mayor'],
        ['atbilde', 'respuesta'],
        ['risinājums', 'solución, procedimiento'],
        ['uzdevums', 'ejercicio, problema']
      ]
    },
    {
      t: T('Números', 'Skaitļi'), emoji: '🔢',
      items: [
        ['skaitlis', 'número'],
        ['cipars', 'cifra, dígito (¡no “número”!)'],
        ['naturāls skaitlis', 'número natural'],
        ['vesels skaitlis', 'número entero'],
        ['pāra / nepāra skaitlis', 'número par / impar'],
        ['pirmskaitlis', 'número primo'],
        ['salikts skaitlis', 'número compuesto'],
        ['dalītājs', 'divisor'],
        ['dalāmais', 'múltiplo (y también dividendo)'],
        ['dalāmība', 'divisibilidad'],
        ['LKD (lielākais kopīgais dalītājs)', 'MCD (máximo común divisor)'],
        ['MKD (mazākais kopīgais dalāmais)', 'mcm (mínimo común múltiplo)'],
        ['pirmreizinātāji', 'factores primos'],
        ['modulis', 'valor absoluto, módulo'],
        ['pretējs skaitlis', 'número opuesto'],
        ['savstarpēji apgriezti skaitļi', 'números recíprocos, inversos'],
        ['pozitīvs / negatīvs', 'positivo / negativo'],
        ['skaitļu ass', 'recta numérica'],
        ['nulle', 'cero']
      ]
    },
    {
      t: T('Operaciones', 'Darbības'), emoji: '➕',
      items: [
        ['saskaitīšana — summa', 'suma — total'],
        ['saskaitāmais', 'sumando'],
        ['atņemšana — starpība', 'resta — diferencia'],
        ['mazināmais / mazinātājs', 'minuendo / sustraendo'],
        ['reizināšana — reizinājums', 'multiplicación — producto'],
        ['reizinātājs', 'factor'],
        ['dalīšana — dalījums', 'división — cociente'],
        ['atlikums', 'resto'],
        ['darbību secība', 'orden de las operaciones'],
        ['iekavas', 'paréntesis'],
        ['izteiksme', 'expresión'],
        ['vienādojums', 'ecuación'],
        ['nezināmais', 'incógnita, término desconocido'],
        ['vienādība', 'igualdad'],
        ['pakāpe', 'potencia'],
        ['bāze / kāpinātājs', 'base / exponente'],
        ['kvadrātā / kubā', 'al cuadrado / al cubo']
      ]
    },
    {
      t: T('Fracciones y decimales', 'Daļas un decimāldaļas'), emoji: '🍕',
      items: [
        ['parastā daļa', 'fracción'],
        ['skaitītājs', 'numerador'],
        ['saucējs', 'denominador'],
        ['kopsaucējs', 'denominador común'],
        ['īstā daļa / neīstā daļa', 'fracción propia / impropia'],
        ['jaukts skaitlis', 'número mixto'],
        ['saīsināt daļu', 'simplificar la fracción'],
        ['paplašināt daļu', 'amplificar la fracción'],
        ['nesaīsināma daļa', 'fracción irreducible'],
        ['decimāldaļa', 'número decimal'],
        ['komats', 'coma decimal'],
        ['desmitdaļas / simtdaļas / tūkstošdaļas', 'décimas / centésimas / milésimas'],
        ['noapaļot', 'redondear'],
        ['puse / trešdaļa / ceturtdaļa', 'mitad / tercio / cuarto']
      ]
    },
    {
      t: T('Porcentajes y proporciones', 'Procenti un proporcijas'), emoji: '💯',
      items: [
        ['procenti (%)', 'porcentaje'],
        ['atlaide', 'descuento'],
        ['cena', 'precio'],
        ['pieaugums / samazinājums', 'subida / bajada'],
        ['attiecība', 'razón'],
        ['proporcija', 'proporción'],
        ['tieši proporcionāli lielumi', 'magnitudes directamente proporcionales'],
        ['apgriezti proporcionāli lielumi', 'magnitudes inversamente proporcionales'],
        ['mērogs', 'escala'],
        ['sadalīt proporcionāli', 'repartir proporcionalmente'],
        ['ziedot', 'donar']
      ]
    },
    {
      t: T('Magnitudes y unidades', 'Lielumi un mērvienības'), emoji: '📏',
      items: [
        ['garums / platums / augstums', 'largo / ancho / alto'],
        ['perimetrs', 'perímetro'],
        ['laukums', 'área'],
        ['tilpums', 'volumen'],
        ['masa', 'masa'],
        ['mērvienība', 'unidad de medida'],
        ['ātrums', 'velocidad'],
        ['attālums', 'distancia'],
        ['laiks', 'tiempo'],
        ['stunda / minūte / sekunde', 'hora / minuto / segundo'],
        ['diennakts', 'día (24 horas)'],
        ['hektārs', 'hectárea'],
        ['litrs', 'litro']
      ]
    },
    {
      t: T('Geometría', 'Ģeometrija'), emoji: '📐',
      items: [
        ['taisnstūris', 'rectángulo'],
        ['kvadrāts', 'cuadrado'],
        ['trijstūris', 'triángulo'],
        ['četrstūris', 'cuadrilátero'],
        ['riņķa līnija / riņķis', 'circunferencia / círculo'],
        ['rādiuss / diametrs', 'radio / diámetro'],
        ['leņķis', 'ángulo'],
        ['šaurs leņķis / taisns leņķis', 'ángulo agudo / recto'],
        ['plats leņķis / izstiepts leņķis', 'ángulo obtuso / llano'],
        ['mala', 'lado'],
        ['virsotne', 'vértice'],
        ['pamats / augstums', 'base / altura'],
        ['taisnstūra paralēlskaldnis', 'ortoedro (caja)'],
        ['kubs', 'cubo'],
        ['šķautne / skaldne', 'arista / cara'],
        ['virsmas laukums', 'área total (superficie)'],
        ['koordinātu plakne', 'plano de coordenadas'],
        ['abscisu ass (x) / ordinātu ass (y)', 'eje x / eje y'],
        ['kvadrants', 'cuadrante'],
        ['punkta koordinātas', 'coordenadas del punto'],
        ['pa labi / pa kreisi', 'a la derecha / a la izquierda'],
        ['uz augšu / uz leju', 'hacia arriba / hacia abajo'],
        ['simetrija', 'simetría']
      ]
    },
    {
      t: T('Datos y probabilidad', 'Dati un varbūtība'), emoji: '📊',
      items: [
        ['vidējais aritmētiskais', 'media aritmética'],
        ['moda', 'moda'],
        ['mediāna', 'mediana'],
        ['amplitūda', 'rango (mayor − menor)'],
        ['diagramma', 'diagrama, gráfico'],
        ['stabiņu diagramma', 'diagrama de barras'],
        ['līniju diagramma', 'gráfico de líneas'],
        ['sektoru diagramma', 'diagrama circular (de sectores)'],
        ['tabula', 'tabla'],
        ['varbūtība', 'probabilidad'],
        ['labvēlīgie gadījumi', 'casos favorables'],
        ['iespējamie gadījumi', 'casos posibles'],
        ['dati', 'datos']
      ]
    },
    {
      t: T('Palabras de los problemas', 'Uzdevumu vārdi'), emoji: '📖',
      items: [
        ['skolēns / klase / skola', 'alumno / clase / escuela'],
        ['veikals / pirkt / maksāt', 'tienda / comprar / pagar'],
        ['eiro (€) / centi', 'euros / céntimos'],
        ['strādnieks / brigāde', 'obrero / cuadrilla'],
        ['ekskavators / mašīna', 'excavadora / máquina'],
        ['krāns (ūdens)', 'grifo'],
        ['tvertne / dīķis', 'depósito / estanque'],
        ['vilciens / autobuss / auto', 'tren / autobús / coche'],
        ['tunelis / ceļš', 'túnel / camino'],
        ['izbraukt / izskriet', 'salir (en coche) / salir corriendo'],
        ['panākt', 'alcanzar'],
        ['satikties', 'encontrarse'],
        ['grozs / maisiņš', 'cesta / bolsa'],
        ['cepums / zupa / porcija', 'galleta / sopa / porción'],
        ['zieds: pīpene / magone / rudzupuķe', 'flor: margarita / amapola / aciano'],
        ['bumbiņa / lente / zīmulis', 'canica / cinta / lápiz'],
        ['soļi / izaicinājums', 'pasos / reto'],
        ['turnīrs / uzvara / neizšķirts / zaudējums', 'torneo / victoria / empate / derrota'],
        ['komanda', 'equipo'],
        ['sacensības', 'competición'],
        ['par ... vairāk / mazāk', '... más / menos que (en unidades)'],
        ['... reizes vairāk', '... veces más'],
        ['katrs / katra', 'cada uno / cada una'],
        ['pārējie', 'los demás, el resto'],
        ['kopā', 'en total'],
        ['vismaz', 'al menos'],
        ['neviens', 'ninguno'],
        ['abi / abas', 'ambos / ambas']
      ]
    }
  ];
})(typeof window !== 'undefined' ? window : globalThis);
