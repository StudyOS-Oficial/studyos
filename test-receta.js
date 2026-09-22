/*
  StudyOS | Test "Encuentra tu receta de hoy", motor de recomendación y calculadora de fase.

  - Todo ocurre en el navegador. Las respuestas y la fecha NO se guardan ni se envían a ningún sitio.
  - El test es una MUESTRA: enseña una receta (título, fase, tiempo, ingredientes principales) y bloquea el resto.
    Solo se puede completar una vez por persona (con cookies aceptadas se recuerda entre visitas).
  - Analítica (GA4, solo con consentimiento): quiz_start, quiz_question_1..3, quiz_complete, recipe_result_view.
    Nunca se envían la etapa, la necesidad ni el momento que elige la persona: solo el paso y el id de la receta.
*/
(function () {
  "use strict";

  // Las 100 recetas del recetario (versión mejorada):
  // id, t título, ph fase (texto del libro), p fases, m minutos, k kcal, d dificultad, a alérgenos,
  // g ingredientes principales, n necesidades, mo momentos del día
  var R = [{"id":"tortitas-de-avena-y-calabaza","t":"Tortitas de Avena y Calabaza","ph":"Fase Lútea y Menstrual","p":["menstrual","lutea"],"m":12,"k":340,"d":"Fácil","a":"Huevo, Gluten y Frutos Secos","g":["harina de avena","puré de calabaza","claras de huevo"],"n":["an","en","ra"],"mo":["D"]},{"id":"bowl-de-quinoa-y-pollo-al-limon-con-curcuma","t":"Bowl de Quinoa y Pollo al Limón con Cúrcuma","ph":"Fase Folicular","p":["folicular"],"m":15,"k":460,"d":"Medio","a":"Ninguno","g":["quinoa","pechuga de pollo","calabacín"],"n":["ai","en","ra","sa"],"mo":["C"]},{"id":"tartar-de-atun-mango-y-aguacate","t":"Tartar de Atún, Mango y Aguacate","ph":"Fase Ovulatoria","p":["ovulatoria"],"m":10,"k":420,"d":"Medio","a":"Pescado, Soja, Sésamo","g":["atún rojo","mango","semillas de sésamo"],"n":["ai","ra","sa"],"mo":["C","N"]},{"id":"pudding-de-chia-y-cacao-antiantojos","t":"Pudding de Chía y Cacao \"Antiantojos\"","ph":"Fase Lútea","p":["lutea"],"m":5,"k":290,"d":"Fácil","a":"Frutos secos","g":["semillas de chía","leche de coco","cacao puro desgrasado"],"n":["ai","an","en","ra","sa"],"mo":["D","S"]},{"id":"crema-de-calabacin-y-jengibre-con-dados-de-pavo","t":"Crema de Calabacín y Jengibre con Dados de Pavo","ph":"Fase Menstrual","p":["menstrual"],"m":20,"k":310,"d":"Medio","a":"Ninguno","g":["calabacín","puerro","jengibre"],"n":["ai","en","hi"],"mo":["C","N"]},{"id":"revuelto-de-champinones-y-espinacas","t":"Revuelto de Champiñones y Espinacas","ph":"Fase Folicular","p":["folicular"],"m":10,"k":330,"d":"Fácil","a":"Huevo, Gluten","g":["huevos","champiñones","espinacas"],"n":["ai","ra"],"mo":["D"]},{"id":"smoothie-bowl-equilibrio-hormonal","t":"Smoothie Bowl \"Equilibrio Hormonal\"","ph":"Fase Folicular","p":["folicular"],"m":8,"k":380,"d":"Fácil","a":"Lácteos, Frutos secos","g":["plátano","arándanos","yogur griego natural"],"n":["ai","en","ra","sa"],"mo":["D","S"]},{"id":"salmon-al-horno-con-costra-de-sesamo-y-brocoli","t":"Salmón al Horno con Costra de Sésamo y Brócoli","ph":"Fase Ovulatoria","p":["ovulatoria"],"m":18,"k":490,"d":"Medio","a":"Pescado, Sésamo, Mostaza","g":["salmón","floretes de brócoli","semillas de sésamo"],"n":["ai","sa"],"mo":["C"]},{"id":"crema-de-lentejas-rojas-y-moniato-al-comino","t":"Crema de Lentejas Rojas y Moniato al Comino","ph":"Fase Lútea","p":["lutea"],"m":22,"k":390,"d":"Medio","a":"Ninguno","g":["lentejas rojas","moniato","cebolla"],"n":["ai","an","en","hi","sa"],"mo":["C","N"]},{"id":"tostada-de-aguacate-huevo-poche-y-semillas-de-girasol","t":"Tostada de Aguacate, Huevo Poché y Semillas de Girasol","ph":"Fase Menstrual","p":["menstrual"],"m":10,"k":360,"d":"Media","a":"Huevo, Gluten","g":["pan integral de","huevo","semillas de girasol"],"n":["ra"],"mo":["D"]},{"id":"crema-de-calabaza-curcuma-y-leche-de-coco","t":"Crema de Calabaza, Cúrcuma y Leche de Coco","ph":"Fase Lútea / Menopausia","p":["lutea","menopausia"],"m":25,"k":310,"d":"Medio","a":"Ninguno","g":["calabaza","zanahoria","cebolla"],"n":["ai","an","hi"],"mo":["C","N"]},{"id":"ensalada-de-garbanzos-espinacas-y-bacalao","t":"Ensalada de Garbanzos, Espinacas y Bacalao","ph":"Fase Menstrual","p":["menstrual"],"m":12,"k":390,"d":"Fácil","a":"Pescado","g":["garbanzos","migas de bacalao","espinacas"],"n":["ai","en","ra","sa"],"mo":["C"]},{"id":"omelette-fluffy-de-claras-champinones-y-oregano","t":"Omelette Fluffy de Claras, Champiñones y Orégano","ph":"Fase Folicular","p":["folicular"],"m":10,"k":240,"d":"Medio","a":"Huevo","g":["claras de huevo","champiñones portobello","cebolla morada"],"n":["ra"],"mo":["D","N"]},{"id":"bowl-de-lentejas-aguacate-y-semillas-de-sesamo","t":"Bowl de Lentejas, Aguacate y Semillas de Sésamo","ph":"Fase Lútea / Menopausia","p":["lutea","menopausia"],"m":10,"k":410,"d":"Fácil","a":"Sésamo, Soja","g":["lentejas","zanahoria","pepino"],"n":["en","ra","sa"],"mo":["C"]},{"id":"pechuga-de-pavo-al-curry-suave-con-calabacin-y-arroz-integral","t":"Pechuga de Pavo al Curry Suave con Calabacín y Arroz Integral","ph":"Fase Ovulatoria","p":["ovulatoria"],"m":20,"k":440,"d":"Medio","a":"Frutos secos","g":["pechuga de pavo","calabacín","arroz integral"],"n":["en","hi","sa"],"mo":["C"]},{"id":"mousse-expres-de-yogur-griego-cacao-y-crema-de-cacahuete","t":"Mousse Exprés de Yogur Griego, Cacao y Crema de Cacahuete","ph":"Fase Lútea","p":["lutea"],"m":5,"k":260,"d":"Fácil","a":"Lácteos, Cacahuete","g":["yogur griego natural","cacao puro desgrasado","crema de cacahuete"],"n":["an","en","ra","sa"],"mo":["S"]},{"id":"salmon-salteado-con-esparragos-trigueros-y-ajo","t":"Salmón Salteado con Espárragos Trigueros y Ajo","ph":"Fase Ovulatoria / Folicular","p":["folicular","ovulatoria"],"m":15,"k":430,"d":"Fácil","a":"Pescado","g":["salmón","espárragos trigueros finos","ajo"],"n":["ai","hi","ra","sa"],"mo":["C"]},{"id":"revuelto-de-tofu-curcuma-y-espinacas","t":"Revuelto de Tofu, Cúrcuma y Espinacas","ph":"Fase Menstrual","p":["menstrual"],"m":10,"k":290,"d":"Fácil","a":"Soja, Gluten","g":["tofu","espinacas","ajo"],"n":["ai","ra"],"mo":["D","N"]},{"id":"tartar-de-aguacate-fresas-y-ventresca-de-atun","t":"Tartar de Aguacate, Fresas y Ventresca de Atún","ph":"Fase Ovulatoria","p":["ovulatoria"],"m":10,"k":400,"d":"Medio","a":"Pescado, Sulfitos, Sésamo","g":["ventresca","fresas","semillas de amapola"],"n":["ai","ra","sa"],"mo":["C","N"]},{"id":"medallones-de-solomillo-de-pavo-a-la-naranja-y-romero","t":"Medallones de Solomillo de Pavo a la Naranja y Romero","ph":"Fase Ovulatoria","p":["ovulatoria"],"m":18,"k":420,"d":"Media","a":"Ninguno","g":["solomillo de pavo","romero","calabacín"],"n":["en","sa"],"mo":["C"]},{"id":"crema-antioxidante-de-lombarda-manzana-y-jengibre","t":"Crema Antioxidante de Lombarda, Manzana y Jengibre","ph":"Fase Menstrual","p":["menstrual"],"m":22,"k":250,"d":"Medio","a":"Ninguno","g":["col lombarda","manzana roja","puerro"],"n":["ai","hi"],"mo":["C","N"]},{"id":"bowl-de-quinoa-bacalao-desmigado-y-aguacate-al-eneldo","t":"Bowl de Quinoa, Bacalao Desmigado y Aguacate al Eneldo","ph":"Fase Folicular","p":["folicular"],"m":15,"k":450,"d":"Medio","a":"Pescado","g":["quinoa","bacalao","pepino"],"n":["en","ra","sa"],"mo":["C"]},{"id":"hamburguesa-casera-de-lentejas-rojas-y-curcuma-en-pan-de-centeno","t":"Hamburguesa Casera de Lentejas Rojas y Cúrcuma en Pan de Centeno","ph":"Fase Lútea","p":["lutea"],"m":20,"k":410,"d":"Media","a":"Gluten","g":["lentejas rojas","harina de avena","cebolla"],"n":["ai","en","sa"],"mo":["C"]},{"id":"dorada-a-la-plancha-con-salteado-de-pimiento-rojo-y-sesamo","t":"Dorada a la Plancha con Salteado de Pimiento Rojo y Sésamo","ph":"Fase Ovulatoria","p":["ovulatoria"],"m":15,"k":380,"d":"Medio","a":"Pescado, Sésamo, Soja","g":["dorada","pimiento rojo","cebolla morada"],"n":["ra","sa"],"mo":["C","N"]},{"id":"crema-de-brocoli-espinacas-y-queso-de-cabra","t":"Crema de Brócoli, Espinacas y Queso de Cabra","ph":"Fase Menstrual","p":["menstrual"],"m":18,"k":280,"d":"Medio","a":"Lácteos","g":["brócoli","espinacas","puerro"],"n":["ai","hi"],"mo":["C","N"]},{"id":"omelette-roll-con-salmon-ahumado-y-canonigos","t":"Omelette Roll con Salmón Ahumado y Canónigos","ph":"Fase Lútea","p":["lutea"],"m":8,"k":330,"d":"Medio","a":"Huevo, Pescado, Frutos secos, Lácteos","g":["huevos","salmón ahumado de","canónigos"],"n":["ai","ra"],"mo":["D","N"]},{"id":"pavo-salteado-con-calabacin-champinones-y-salsa-de-sesamo","t":"Pavo Salteado con Calabacín, Champiñones y Salsa de Sésamo","ph":"Fase Folicular","p":["folicular"],"m":12,"k":370,"d":"Fácil","a":"Sésamo","g":["pechuga de pavo","calabacín a dados","champiñones"],"n":["ai","en","hi","ra","sa"],"mo":["C","N"]},{"id":"tartar-de-remolacha-aguacate-y-nueces","t":"Tartar de Remolacha, Aguacate y Nueces","ph":"Fase Menstrual","p":["menstrual"],"m":10,"k":310,"d":"Medio","a":"Frutos secos, Mostaza","g":["remolacha","nueces","mostaza antigua"],"n":["ai","ra"],"mo":["C","N"]},{"id":"wok-de-tofu-brocoli-y-pimiento-con-salsa-de-soja","t":"Wok de Tofu, Brócoli y Pimiento con Salsa de Soja","ph":"Fase Folicular","p":["folicular"],"m":15,"k":340,"d":"Fácil","a":"Soja, Sésamo","g":["tofu","floretes de brócoli","pimiento verde"],"n":["ai","ra"],"mo":["C","N"]},{"id":"revuelto-de-bacalao-puerro-y-calabacin-al-eneldo","t":"Revuelto de Bacalao, Puerro y Calabacín al Eneldo","ph":"Fase Menstrual","p":["menstrual"],"m":15,"k":340,"d":"Medio","a":"Pescado, Huevo","g":["bacalao desalado desmigado","huevos camperos","puerro"],"n":["hi","ra"],"mo":["D","N"]},{"id":"pechuga-de-pollo-marinada-a-la-plancha-con-salsa-tzatziki-de-men","t":"Pechuga de Pollo Marinada a la Plancha con Salsa Tzatziki de Menta y Limón","ph":"Fase Folicular","p":["folicular"],"m":18,"k":360,"d":"Medio","a":"Lácteos","g":["pechuga de pollo","yogur griego natural","pepino"],"n":["en","hi","sa"],"mo":["C","N"]},{"id":"crema-de-zanahoria-curcuma-y-pipas-de-girasol","t":"Crema de Zanahoria, Cúrcuma y Pipas de Girasol","ph":"Fase Lútea / Perimenopausia","p":["lutea","perimenopausia"],"m":22,"k":280,"d":"Medio","a":"Ninguno","g":["zanahorias","cebolla","pipas de girasol"],"n":["ai","hi"],"mo":["C","N"]},{"id":"salmon-al-horno-con-costra-de-sesamo-y-canonigos-al-limon","t":"Salmón al Horno con Costra de Sésamo y Canónigos al Limón","ph":"Fase Ovulatoria","p":["ovulatoria"],"m":16,"k":450,"d":"Medio","a":"Pescado, Sésamo, Mostaza","g":["salmón","semillas de sésamo","mostaza antigua"],"n":["ai","sa"],"mo":["C"]},{"id":"ensalada-templada-de-lentejas-pimiento-asado-y-ventresca","t":"Ensalada Templada de Lentejas, Pimiento Asado y Ventresca","ph":"Fase Menstrual","p":["menstrual"],"m":10,"k":380,"d":"Fácil","a":"Pescado","g":["lentejas","pimiento rojo asado","ventresca de atún"],"n":["ai","en","ra","sa"],"mo":["C","N"]},{"id":"salteado-de-pavo-con-champinones-y-tomates-cherrys","t":"Salteado de Pavo con Champiñones y Tomates Cherrys","ph":"Fase Folicular","p":["folicular"],"m":14,"k":340,"d":"Fácil","a":"Ninguno","g":["pechuga de pavo","champiñones portobello","tomates cherry"],"n":["ai","en","ra"],"mo":["C","N"]},{"id":"tortilla-jugosa-de-espinacas-nueces-y-queso-feta","t":"Tortilla Jugosa de Espinacas, Nueces y Queso Feta","ph":"Fase Lútea","p":["lutea"],"m":12,"k":410,"d":"Medio","a":"Huevo, Frutos secos, Lácteos","g":["huevos camperos","espinacas frescas baby","queso feta desmenuzado"],"n":["ai","ra","sa"],"mo":["D","N"]},{"id":"wok-de-tofu-pimiento-verde-y-calabacin-al-jengibre","t":"Wok de Tofu, Pimiento Verde y Calabacín al Jengibre","ph":"Fase Folicular","p":["folicular"],"m":16,"k":330,"d":"Fácil","a":"Soja, Sésamo","g":["tofu","pimiento verde","calabacín"],"n":["ai","hi"],"mo":["C","N"]},{"id":"crema-de-calabacin-puerro-y-semillas-de-chia","t":"Crema de Calabacín, Puerro y Semillas de Chía","ph":"Fase Menstrual","p":["menstrual"],"m":18,"k":210,"d":"Fácil","a":"Ninguno","g":["calabacín","puerro troceado","semillas de chía"],"n":["ai","hi"],"mo":["C","N"]},{"id":"tartar-de-aguacate-pepino-y-merluza-desmigada-al-limon-y-eneldo","t":"Tartar de Aguacate, Pepino y Merluza Desmigada al Limón y Eneldo","ph":"Fase Ovulatoria","p":["ovulatoria"],"m":15,"k":370,"d":"Medio","a":"Pescado","g":["merluza","pepino"],"n":["hi","ra"],"mo":["C","N"]},{"id":"solomillo-de-cerdo-glaseado-a-la-mostaza-manzana-y-salvia","t":"Solomillo de Cerdo Glaseado a la Mostaza, Manzana y Salvia","ph":"Fase Lútea / Perimenopausia","p":["lutea","perimenopausia"],"m":20,"k":420,"d":"Elaborado","a":"Mostaza","g":["solomillo de cerdo","manzana","mostaza Dijon"],"n":["sa"],"mo":["C"]},{"id":"merluza-al-vapor-de-jengibre-con-zanahoria-y-tirabeques","t":"Merluza al Vapor de Jengibre con Zanahoria y Tirabeques","ph":"Fase Ovulatoria","p":["ovulatoria"],"m":15,"k":290,"d":"Medio","a":"Pescado","g":["merluza","zanahoria","tirabeques"],"n":["ai","hi","ra"],"mo":["C","N"]},{"id":"pechuga-de-pavo-glaseada-con-naranja-hinojo-y-granos-de-granada","t":"Pechuga de Pavo Glaseada con Naranja, Hinojo y Granos de Granada","ph":"Fase Folicular","p":["folicular"],"m":18,"k":360,"d":"Medio","a":"Ninguno","g":["pechuga de pavo","hinojo","granos de granada"],"n":["ai","en","hi"],"mo":["C","N"]},{"id":"crema-de-batata-tostada-lentejas-amarillas-y-comino","t":"Crema de Batata Tostada, Lentejas Amarillas y Comino","ph":"Fase Lútea / Perimenopausia","p":["lutea","perimenopausia"],"m":22,"k":390,"d":"Medio","a":"Ninguno","g":["batata","lentejas amarillas","cebolla"],"n":["ai","an","en","hi","sa"],"mo":["C","N"]},{"id":"salmon-al-horno-con-costra-de-almendras-eneldo-y-calabacin-asado","t":"Salmón al Horno con Costra de Almendras, Eneldo y Calabacín Asado","ph":"Fase Lútea","p":["lutea"],"m":18,"k":460,"d":"Medio","a":"Pescado, Frutos secos","g":["salmón","almendra molida","calabacín"],"n":["ai","hi","sa"],"mo":["C"]},{"id":"salteado-de-ternera-magra-con-esparragos-trigueros-y-semillas-de","t":"Salteado de Ternera Magra con Espárragos Trigueros y Semillas de Sésamo","ph":"Fase Menstrual","p":["menstrual"],"m":14,"k":370,"d":"Fácil","a":"Sésamo, Soja","g":["ternera magra","espárragos trigueros","ajo"],"n":["en","hi","ra","sa"],"mo":["C","N"]},{"id":"poke-bowl-de-atun-edamame-y-mango","t":"Poke Bowl de Atún, Edamame y Mango","ph":"Fase Ovulatoria","p":["ovulatoria"],"m":15,"k":430,"d":"Fácil","a":"Pescado, Soja, Sésamo","g":["atún rojo fresco","arroz integral","edamame desgranado"],"n":["ai","ra","sa"],"mo":["C"]},{"id":"vieiras-a-la-plancha-con-pure-de-coliflor-y-pipas-de-calabaza","t":"Vieiras a la Plancha con Puré de Coliflor y Pipas de Calabaza","ph":"Fase Ovulatoria","p":["ovulatoria"],"m":18,"k":380,"d":"Medio","a":"Moluscos","g":["vieiras","coliflor","leche vegetal"],"n":["an","sa"],"mo":["C","N"]},{"id":"ensalada-templada-de-quinoa-langostinos-y-aguacate","t":"Ensalada Templada de Quinoa, Langostinos y Aguacate","ph":"Fase Ovulatoria","p":["ovulatoria"],"m":15,"k":420,"d":"Fácil","a":"Crustáceos","g":["quinoa","langostinos","cebolla morada"],"n":["en","ra","sa"],"mo":["C"]},{"id":"chili-de-alubias-negras-boniato-y-cacao","t":"Chili de Alubias Negras, Boniato y Cacao","ph":"Fase Lútea","p":["lutea"],"m":25,"k":380,"d":"Medio","a":"Ninguno","g":["alubias negras","boniato","cebolla"],"n":["an","en","sa"],"mo":["C"]},{"id":"guiso-reconfortante-de-judias-blancas-calabaza-y-romero","t":"Guiso Reconfortante de Judías Blancas, Calabaza y Romero","ph":"Fase Lútea","p":["lutea"],"m":22,"k":350,"d":"Fácil","a":"Ninguno","g":["judías blancas","calabaza","cebolla"],"n":["an","en"],"mo":["C"]},{"id":"bowl-de-garbanzos-especiados-y-boniato-asado","t":"Bowl de Garbanzos Especiados y Boniato Asado","ph":"Fase Folicular","p":["folicular"],"m":25,"k":420,"d":"Fácil","a":"Sésamo","g":["garbanzos","boniato","espinacas baby"],"n":["ai","an","en","sa"],"mo":["C"]},{"id":"merluza-en-papillote-con-hierbas-frescas-y-patata","t":"Merluza en Papillote con Hierbas Frescas y Patata","ph":"Fase Folicular","p":["folicular"],"m":20,"k":310,"d":"Fácil","a":"Pescado","g":["merluza","patatas baby","perejil"],"n":["en","hi"],"mo":["C","N"]},{"id":"gambas-al-ajillo-ligeras-con-quinoa-y-rucula","t":"Gambas al Ajillo Ligeras con Quinoa y Rúcula","ph":"Fase Ovulatoria","p":["ovulatoria"],"m":18,"k":430,"d":"Fácil","a":"Marisco","g":["gambas","quinoa","ajo"],"n":["en","sa"],"mo":["C"]},{"id":"ensalada-cesar-ligera-de-pollo-y-parmesano","t":"Ensalada César Ligera de Pollo y Parmesano","ph":"Fase Ovulatoria","p":["ovulatoria"],"m":15,"k":380,"d":"Fácil","a":"Lácteos, Pescado, Gluten","g":["pechuga de pollo","corazón de lechuga","queso parmesano"],"n":["en","ra","sa"],"mo":["C","N"]},{"id":"curry-de-garbanzos-espinacas-y-leche-de-coco","t":"Curry de Garbanzos, Espinacas y Leche de Coco","ph":"Fase Lútea","p":["lutea"],"m":20,"k":400,"d":"Fácil","a":"Ninguno","g":["garbanzos","espinacas","cebolla"],"n":["ai","en","sa"],"mo":["C"]},{"id":"brownie-de-boniato-y-cacao-sin-azucar-anadido","t":"Brownie de Boniato y Cacao sin Azúcar Añadido","ph":"Fase Lútea","p":["lutea"],"m":35,"k":220,"d":"Fácil","a":"Huevo, Gluten","g":["boniato asado y","huevos","cacao puro desgrasado"],"n":["an","en"],"mo":["S"]},{"id":"sopa-de-miso-con-tofu-y-alga-wakame","t":"Sopa de Miso con Tofu y Alga Wakame","ph":"Fase Menstrual","p":["menstrual"],"m":12,"k":180,"d":"Fácil","a":"Soja","g":["pasta de miso","tofu","alga wakame deshidratada"],"n":["ai","hi","ra"],"mo":["C","N"]},{"id":"pollo-al-horno-con-especias-antiinflamatorias-y-pure-de-chirivia","t":"Pollo al Horno con Especias Antiinflamatorias y Puré de Chirivía","ph":"Fase Menstrual","p":["menstrual"],"m":30,"k":380,"d":"Medio","a":"Ninguno","g":["contramuslo de pollo","chirivía","leche vegetal"],"n":["ai","en","sa"],"mo":["C"]},{"id":"salteado-de-edamame-espinacas-y-pinones","t":"Salteado de Edamame, Espinacas y Piñones","ph":"Fase Lútea / Perimenopausia","p":["lutea","perimenopausia"],"m":12,"k":340,"d":"Fácil","a":"Soja, Frutos secos","g":["edamame desgranado","espinacas","piñones"],"n":["ai","ra"],"mo":["C","N"]},{"id":"yogur-griego-con-higos-nueces-y-miel-de-romero","t":"Yogur Griego con Higos, Nueces y Miel de Romero","ph":"Fase Lútea / Perimenopausia","p":["lutea","perimenopausia"],"m":8,"k":290,"d":"Fácil","a":"Lácteos, Frutos secos","g":["yogur griego natural","higos","nueces"],"n":["ai","an","en","ra","sa"],"mo":["S"]},{"id":"pudding-de-chia-con-cacao-puro-frambuesas-y-nueces","t":"Pudding de Chía con Cacao Puro, Frambuesas y Nueces","ph":"Fase Menstrual / Menopausia","p":["menstrual","menopausia"],"m":5,"k":310,"d":"Fácil","a":"Frutos secos","g":["semillas de chía","bebida vegetal","cacao puro"],"n":["ai","an","en","ra","sa"],"mo":["D","S"]},{"id":"tostada-de-boniato-con-aguacate-huevo-poche-y-sesamo","t":"Tostada de Boniato con Aguacate, Huevo Poché y Sésamo","ph":"Fase Ovulatoria / Perimenopausia","p":["ovulatoria","perimenopausia"],"m":15,"k":340,"d":"Media","a":"Huevo, Sésamo","g":["rebanadas longitudinales gruesas","huevo ecológico","semillas de sésamo"],"n":["an","en","ra"],"mo":["D"]},{"id":"batido-dorado-de-avena-y-especias","t":"Batido Dorado de Avena y Especias","ph":"Fase Lútea / Menopausia","p":["lutea","menopausia"],"m":5,"k":150,"d":"Fácil","a":"Gluten","g":["bebida de avena","jengibre","toque de canela"],"n":["ai","en","hi","ra"],"mo":["N","S"]},{"id":"lomo-de-salmon-con-costra-de-pistachos-y-esparragos","t":"Lomo de Salmón con Costra de Pistachos y Espárragos","ph":"Fase Menstrual / Menopausia","p":["menstrual","menopausia"],"m":20,"k":420,"d":"Fácil","a":"Pescado, Frutos secos, Mostaza","g":["salmón salvaje","pistachos","mostaza de Dijon"],"n":["ai","hi","sa"],"mo":["C"]},{"id":"crema-reconfortante-de-calabaza-hinojo-y-leche-de-coco","t":"Crema Reconfortante de Calabaza, Hinojo y Leche de Coco","ph":"Fase Menstrual / Perimenopausia","p":["menstrual","perimenopausia"],"m":25,"k":220,"d":"Fácil","a":"Ninguno","g":["calabaza","hinojo","leche de coco"],"n":["an","hi"],"mo":["C","N"]},{"id":"bol-tibio-de-quinoa-brocoli-asado-y-pipas-de-girasol","t":"Bol Tibio de Quinoa, Brócoli Asado y Pipas de Girasol","ph":"Fase Lútea","p":["lutea"],"m":20,"k":350,"d":"Fácil","a":"Sésamo","g":["quinoa","floretes de brócoli","pipas de girasol"],"n":["ai","en"],"mo":["C","N"]},{"id":"carpaccio-de-calabacin-con-pinones-parmesano-y-limon","t":"Carpaccio de Calabacín con Piñones, Parmesano y Limón","ph":"Fase Folicular","p":["folicular"],"m":10,"k":210,"d":"Fácil","a":"Lácteos, Frutos secos","g":["calabacín mediano muy","piñones ibéricos","queso parmesano"],"n":["hi","ra"],"mo":["C","N"]},{"id":"tortitas-de-trigo-sarraceno-con-compota-de-manzana-a-la-canela","t":"Tortitas de Trigo Sarraceno con Compota de Manzana a la Canela","ph":"Fase Lútea / Perimenopausia","p":["lutea","perimenopausia"],"m":15,"k":290,"d":"Media","a":"Huevo","g":["harina de trigo","huevo ecológico","bebida vegetal"],"n":["an","ra"],"mo":["D"]},{"id":"smoothie-antioxidante-de-arandanos-espinacas-y-semillas-de-lino","t":"Smoothie Antioxidante de Arándanos, Espinacas y Semillas de Lino","ph":"Fase Folicular / Menopausia","p":["folicular","menopausia"],"m":5,"k":230,"d":"Fácil","a":"Ninguno","g":["arándanos","hojas de espinacas","semillas de lino"],"n":["ai","en","hi","ra"],"mo":["D","S"]},{"id":"aguacate-relleno-de-garbanzos-y-cilantro","t":"Aguacate Relleno de Garbanzos y Cilantro","ph":"Fase Ovulatoria","p":["ovulatoria"],"m":10,"k":320,"d":"Fácil","a":"Ninguno","g":["garbanzos","cebolla roja pequeña","hojas de cilantro"],"n":["en","ra"],"mo":["C","N"]},{"id":"ensalada-templada-de-lentejas-beluga-y-granada-con-vinagreta-de","t":"Ensalada Templada de Lentejas Beluga y Granada con Vinagreta de Nueces","ph":"Fase Menstrual / Perimenopausia","p":["menstrual","perimenopausia"],"m":15,"k":320,"d":"Fácil","a":"Frutos secos","g":["lentejas beluga","granos de granada","espinacas baby"],"n":["ai","en","ra"],"mo":["C","N"]},{"id":"pechuga-de-pavo-glaseada-con-miso-sobre-cama-de-tirabeques","t":"Pechuga de Pavo Glaseada con Miso sobre Cama de Tirabeques","ph":"Fase Folicular / Menopausia","p":["folicular","menopausia"],"m":20,"k":280,"d":"Media","a":"Soja, Sésamo","g":["pechuga de pavo","pasta de miso","tirabeques"],"n":["hi"],"mo":["C","N"]},{"id":"tortilla-abierta-de-ajetes-champinones-y-curcuma-fresca","t":"Tortilla Abierta de Ajetes, Champiñones y Cúrcuma Fresca","ph":"Fase Lútea / Perimenopausia","p":["lutea","perimenopausia"],"m":12,"k":250,"d":"Fácil","a":"Huevo","g":["huevos ecológicos","ajetes tiernos","champiñones Portobello"],"n":["ai","ra"],"mo":["D","N"]},{"id":"kefir-de-cabra-con-cerezas-y-nibs-de-cacao-puro","t":"Kéfir de Cabra con Cerezas y Nibs de Cacao Puro","ph":"Fase Lútea / Menopausia","p":["lutea","menopausia"],"m":5,"k":210,"d":"Fácil","a":"Lácteos","g":["kéfir de leche","cerezas","nibs de cacao"],"n":["an","en","ra","sa"],"mo":["S"]},{"id":"caballa-al-horno-con-tomates-cherry-asados-y-romero","t":"Caballa al Horno con Tomates Cherry Asados y Romero","ph":"Fase Menstrual / Menopausia","p":["menstrual","menopausia"],"m":25,"k":380,"d":"Fácil","a":"Pescado","g":["caballa limpia y","tomates cherry","romero"],"n":["ai","sa"],"mo":["C"]},{"id":"hummus-de-remolacha-con-crudites-de-apio","t":"Hummus de Remolacha con Crudités de Apio","ph":"Fase Ovulatoria / Perimenopausia","p":["ovulatoria","perimenopausia"],"m":10,"k":260,"d":"Fácil","a":"Sésamo, Apio","g":["garbanzos","remolacha pequeña previamente","tahini"],"n":["ai","hi","ra","sa"],"mo":["S"]},{"id":"sopa-fria-de-pepino-aguacate-y-menta-con-semillas-de-canamo","t":"Sopa Fría de Pepino, Aguacate y Menta con Semillas de Cáñamo","ph":"Fase Folicular","p":["folicular"],"m":10,"k":240,"d":"Fácil","a":"Ninguno","g":["pepino","menta","semillas de cáñamo"],"n":["hi","ra"],"mo":["C","N"]},{"id":"rollitos-ligeros-de-papel-de-arroz-con-langostinos-y-mango","t":"Rollitos Ligeros de Papel de Arroz con Langostinos y Mango","ph":"Fase Ovulatoria","p":["ovulatoria"],"m":15,"k":270,"d":"Media","a":"Crustáceos, Soja","g":["papel de arroz","langostinos","mango"],"n":["ra"],"mo":["C","N"]},{"id":"porridge-caliente-de-trigo-sarraceno-higos-y-almendras","t":"Porridge Caliente de Trigo Sarraceno, Higos y Almendras","ph":"Fase Lútea / Perimenopausia","p":["lutea","perimenopausia"],"m":15,"k":340,"d":"Fácil","a":"Frutos secos","g":["copos de trigo","bebida de almendras","higos"],"n":["an","en","ra"],"mo":["D"]},{"id":"alcachofas-salteadas-con-jamon-iberico-y-pinones","t":"Alcachofas Salteadas con Jamón Ibérico y Piñones","ph":"Fase Folicular / Menopausia","p":["folicular","menopausia"],"m":20,"k":290,"d":"Media","a":"Frutos secos","g":["corazones de alcachofa","virutas de jamón","piñones ibéricos"],"n":["hi"],"mo":["C","N"]},{"id":"sardinas-al-limon-con-costra-de-perejil-y-almendras","t":"Sardinas al Limón con Costra de Perejil y Almendras","ph":"Fase Menstrual / Menopausia","p":["menstrual","menopausia"],"m":15,"k":360,"d":"Fácil","a":"Pescado, Frutos secos","g":["sardinas frescas limpias","almendras molidas","perejil"],"n":["ai","ra"],"mo":["C","N"]},{"id":"crema-purpura-de-col-lombarda-manzana-y-comino","t":"Crema Púrpura de Col Lombarda, Manzana y Comino","ph":"Fase Lútea / Perimenopausia","p":["lutea","perimenopausia"],"m":25,"k":210,"d":"Fácil","a":"Ninguno","g":["col lombarda","manzana Granny Smith","cebolla morada"],"n":["hi"],"mo":["C","N"]},{"id":"tacos-de-hojas-de-roble-con-shiitake-tofu-y-sesamo","t":"Tacos de Hojas de Roble con Shiitake, Tofu y Sésamo","ph":"Fase Ovulatoria / Menopausia","p":["ovulatoria","menopausia"],"m":15,"k":280,"d":"Media","a":"Soja, Sésamo","g":["y firmes de","tofu","setas shiitake frescas"],"n":["ai","ra"],"mo":["C","N"]},{"id":"sopa-de-tomate-asado-y-pimiento-rojo-con-albahaca-fresca","t":"Sopa de Tomate Asado y Pimiento Rojo con Albahaca Fresca","ph":"Fase Menstrual / Perimenopausia","p":["menstrual","perimenopausia"],"m":30,"k":230,"d":"Fácil","a":"Ninguno","g":["tomates pera muy","pimiento rojo","ajo"],"n":["ai","hi"],"mo":["C","N"]},{"id":"batido-enzimatico-de-papaya-jengibre-y-lino","t":"Batido Enzimático de Papaya, Jengibre y Lino","ph":"Fase Lútea / Menopausia","p":["lutea","menopausia"],"m":5,"k":200,"d":"Fácil","a":"Ninguno","g":["papaya fresca y","un centímetro de","semillas de lino"],"n":["ai","en","hi","ra"],"mo":["S"]},{"id":"ensalada-citrica-de-quinoa-pomelo-hinojo-y-pistachos","t":"Ensalada Cítrica de Quinoa, Pomelo, Hinojo y Pistachos","ph":"Fase Ovulatoria / Perimenopausia","p":["ovulatoria","perimenopausia"],"m":15,"k":310,"d":"Fácil","a":"Frutos secos","g":["quinoa tricolor","pomelo rosa","bulbo de hinojo"],"n":["ai","en","hi","ra"],"mo":["C","N"]},{"id":"tostada-de-sarraceno-con-tapenade-de-olivas-negras-y-anchoas","t":"Tostada de Sarraceno con Tapenade de Olivas Negras y Anchoas","ph":"Fase Folicular / Menopausia","p":["folicular","menopausia"],"m":5,"k":260,"d":"Fácil","a":"Pescado","g":["rebanada grande de","olivada","o 4 filetes"],"n":["ai","ra"],"mo":["D"]},{"id":"tartar-rapido-de-tomate-aguacate-y-edamames","t":"Tartar Rápido de Tomate, Aguacate y Edamames","ph":"Fase Lútea","p":["lutea"],"m":10,"k":330,"d":"Fácil","a":"Soja, Sulfitos","g":["tomate de ensalada","habas de edamame","cebollino"],"n":["ai","ra"],"mo":["C","N"]},{"id":"estofado-expres-de-azukis-con-calabaza-y-curcuma","t":"Estofado Exprés de Azukis con Calabaza y Cúrcuma","ph":"Fase Menstrual","p":["menstrual"],"m":15,"k":300,"d":"Fácil","a":"Ninguno","g":["judías azuki","calabaza","cebolla"],"n":["ai","an","en","ra"],"mo":["C","N"]},{"id":"gofres-o-tortitas-de-harina-de-almendra-y-arandanos","t":"Gofres (o Tortitas) de Harina de Almendra y Arándanos","ph":"Fase Ovulatoria / Perimenopausia","p":["ovulatoria","perimenopausia"],"m":15,"k":340,"d":"Media","a":"Huevo, Frutos secos","g":["harina de almendra","huevo ecológico","bebida de almendra"],"n":["ai","an","ra"],"mo":["D"]},{"id":"crema-de-coliflor-asada-con-ajo-negro-y-avellanas","t":"Crema de Coliflor Asada con Ajo Negro y Avellanas","ph":"Fase Lútea / Menopausia","p":["lutea","menopausia"],"m":30,"k":240,"d":"Fácil","a":"Frutos secos","g":["floretes de coliflor","ajo negro","avellanas tostadas"],"n":["hi"],"mo":["C","N"]},{"id":"ensalada-templada-de-lentejas-rojas-con-vinagreta-de-naranja","t":"Ensalada Templada de Lentejas Rojas con Vinagreta de Naranja","ph":"Fase Menstrual / Perimenopausia","p":["menstrual","perimenopausia"],"m":15,"k":310,"d":"Fácil","a":"Ninguno","g":["lentejas rojas crudas","espinacas baby","cebolla roja"],"n":["ai","en","ra"],"mo":["C","N"]},{"id":"tacos-de-hojas-de-cogollo-con-pollo-desmenuzado-al-cacao","t":"Tacos de Hojas de Cogollo con Pollo Desmenuzado al Cacao","ph":"Fase Ovulatoria / Perimenopausia","p":["ovulatoria","perimenopausia"],"m":20,"k":330,"d":"Media","a":"Ninguno","g":["pechuga de pollo","cogollo de lechuga","cacao puro"],"n":["an","en"],"mo":["C","N"]},{"id":"ceviche-vegano-de-portobello-con-algas-wakame","t":"Ceviche Vegano de Portobello con Algas Wakame","ph":"Fase Folicular / Menopausia","p":["folicular","menopausia"],"m":15,"k":180,"d":"Fácil","a":"Ninguno","g":["champiñones Portobello grandes","algas wakame deshidratadas","cebolla morada"],"n":["ra"],"mo":["C","N"]},{"id":"pimientos-rellenos-de-tempeh-especiado-y-nueces-pecanas","t":"Pimientos Rellenos de Tempeh Especiado y Nueces Pecanas","ph":"Fase Lútea / Menopausia","p":["lutea","menopausia"],"m":30,"k":350,"d":"Media","a":"Soja, Frutos secos","g":["pimiento rojo","tempeh de soja","nueces pecanas"],"n":["ai"],"mo":["C"]},{"id":"porridge-frio-overnight-oats-de-sarraceno-con-crema-de-almendras","t":"Porridge Frío (Overnight Oats) de Sarraceno con Crema de Almendras","ph":"Fase Folicular","p":["folicular"],"m":5,"k":310,"d":"Fácil","a":"Frutos secos","g":["copos de trigo","semillas de chía","bebida de almendras"],"n":["ai","en","ra"],"mo":["D"]},{"id":"esparragos-blancos-frescos-a-la-plancha-con-mahonesa-de-aguacate","t":"Espárragos Blancos Frescos a la Plancha con Mahonesa de Aguacate","ph":"Fase Ovulatoria","p":["ovulatoria"],"m":20,"k":260,"d":"Fácil","a":"Huevo","g":["espárragos blancos","yema de huevo"],"n":["hi"],"mo":["C","N"]},{"id":"curry-rapido-de-garbanzos-espinacas-y-leche-de-coco","t":"Curry Rápido de Garbanzos, Espinacas y Leche de Coco","ph":"Fase Menstrual / Perimenopausia","p":["menstrual","perimenopausia"],"m":15,"k":380,"d":"Fácil","a":"Ninguno","g":["garbanzos","leche de coco","espinacas"],"n":["ai","en","ra","sa"],"mo":["C","N"]},{"id":"carpaccio-de-remolacha-cruda-con-queso-feta-de-oveja","t":"Carpaccio de Remolacha Cruda con Queso Feta de Oveja","ph":"Fase Ovulatoria / Menopausia","p":["ovulatoria","menopausia"],"m":10,"k":240,"d":"Fácil","a":"Lácteos, Frutos secos","g":["remolacha cruda","queso feta","pipas de calabaza"],"n":["ai","ra"],"mo":["C","N"]},{"id":"manzanas-asadas-al-horno-con-relleno-de-nueces-y-ghee","t":"Manzanas Asadas al Horno con Relleno de Nueces y Ghee","ph":"Fase Lútea / Perimenopausia","p":["lutea","perimenopausia"],"m":35,"k":280,"d":"Fácil","a":"Frutos secos, Lácteos","g":["manzanas tipo Reineta","ghee","nueces"],"n":["ai","an","en","sa"],"mo":["S"]}];

  // Pesos de la puntuación. Cambia estos números para ajustar el motor.
  var W = { need: 6, moment: 6, stage: 4 };

  var NEED = { en: "más energía", hi: "bajar la hinchazón", an: "calmar los antojos", sa: "saciarte de verdad", ra: "algo rápido", ai: "priorizar lo antiinflamatorio" };
  var MOMENT = { D: "el desayuno", C: "la comida", N: "la cena", S: "un snack o algo dulce" };
  var STAGELABEL = { menstrual: "la fase menstrual", folicular: "la fase folicular", ovulatoria: "la fase ovulatoria", lutea: "la fase lútea", perimenopausia: "la perimenopausia", menopausia: "la menopausia" };
  var LOCK = '<svg class="lockico" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>';

  function esc(v) {
    return String(v).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; });
  }
  function funnel(name, extra) { try { if (window.studyosFunnel) window.studyosFunnel(name, extra); } catch (e) {} }

  /* ---------------------------------------------------------------- Motor de recomendación */
  var AVOID = { lacteos: /lácteos/i, gluten: /gluten/i, huevo: /huevo/i, frutossecos: /frutos secos/i, pescado: /pescado|crustáceos|moluscos|marisco/i, soja: /soja/i };
  var AVOIDLABEL = { lacteos: "Sin lácteos", gluten: "Sin gluten", huevo: "Sin huevo", frutossecos: "Sin frutos secos", pescado: "Sin pescado ni marisco", soja: "Sin soja" };
  var STAGECAP = { menstrual: "Fase menstrual", folicular: "Fase folicular", ovulatoria: "Fase ovulatoria", lutea: "Fase lútea", perimenopausia: "Perimenopausia", menopausia: "Menopausia", ninguna: "Etapa sin filtrar" };
  var MOMENTCAP = { D: "Desayuno", C: "Comida", N: "Cena", S: "Snack o algo dulce" };
  var TIMECAP = { "15": "Hasta 15 minutos", "30": "Unos 30 minutos", any: "Sin prisa" };

  function stageMatch(r, stage) { return !!stage && stage !== "ninguna" && r.p.indexOf(stage) > -1; }
  function allowed(r, avoid) { return !avoid.some(function (k) { return AVOID[k] && AVOID[k].test(r.a); }); }

  function score(r, pf) {
    var s = 0;
    if (r.n.indexOf(pf.need) > -1) s += W.need;
    if (r.mo.indexOf(pf.moment) > -1) s += W.moment;
    if (stageMatch(r, pf.stage)) s += W.stage;
    if (pf.time === "15" && r.m <= 15) s += 3;   // el tiempo disponible suma, pero no es excluyente
    else if (pf.time === "30" && r.m <= 30) s += 2;
    if (pf.need === "ra" && r.m <= 10) s += 1;   // desempates suaves
    if (pf.need === "hi" && r.k <= 320) s += 1;
    if (pf.need === "sa" && r.k >= 380) s += 1;
    return s;
  }

  // Devuelve siempre una receta: la mejor puntuada entre las que respetan lo que la persona quiere evitar
  // (si esa exclusión dejara muy pocas recetas, se relaja). match: "exacta" o "parcial".
  function getRecommendedRecipe(stage, need, moment, prefs) {
    prefs = prefs || {};
    var avoid = prefs.avoid || [], time = prefs.time || "any";
    var pool = R.filter(function (r) { return allowed(r, avoid); });
    var relaxed = pool.length < 3;
    if (relaxed) pool = R;
    var pf = { stage: stage, need: need, moment: moment, time: time };
    var ranked = pool.map(function (r, i) { return { r: r, i: i, s: score(r, pf) }; })
      .sort(function (a, b) { return b.s - a.s || a.i - b.i; });
    var top = ranked[0].r;
    var timeOk = time === "any" || top.m <= Number(time);
    var full = top.n.indexOf(need) > -1 && top.mo.indexOf(moment) > -1 && (!stage || stage === "ninguna" || stageMatch(top, stage)) && timeOk;
    return { recipe: top, score: ranked[0].s, match: full ? "exacta" : "parcial", stageMatched: stageMatch(top, stage), relaxed: relaxed && avoid.length > 0, alternatives: ranked.slice(1, 3).map(function (x) { return x.r; }) };
  }
  window.studyosRecipes = { all: R, getRecommendedRecipe: getRecommendedRecipe };

  /* ---------------------------------------------------------------- Test (5 preguntas) */
  var quiz = document.getElementById("quiz");
  var api = {};
  var QUIZ_KEY = "studyos_quiz";
  var TOTAL = 5;

  if (quiz) {
    var steps = quiz.querySelectorAll(".qstep");
    var result = document.getElementById("quiz-result");
    var doneBox = document.getElementById("quiz-done");
    var topBar = quiz.querySelector(".quiz-top");
    var stepLabel = document.getElementById("quiz-step");
    var bar = document.getElementById("quiz-bar-i");
    var back = document.getElementById("quiz-back");
    var pre = window.studyosPreselect ? window.studyosPreselect() : {};
    var state = { stage: pre.stage || null, need: pre.need || null, mo: pre.moment || null, avoid: [], time: null };
    var fromAd = { 1: !!pre.stage, 2: !!pre.need, 3: !!pre.moment };   // pasos con respuesta que viene del anuncio
    var started = false, current = 1, finished = false;

    function valueOf(q) { return q === 1 ? state.stage : q === 2 ? state.need : q === 3 ? state.mo : state.time; }
    function setValue(q, v) { if (q === 1) state.stage = v; else if (q === 2) state.need = v; else if (q === 3) state.mo = v; else if (q === 5) state.time = v; }

    function mark(q, value) {
      quiz.querySelectorAll('.qstep[data-q="' + q + '"] .qopts button').forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-v") === value)); });
    }
    [1, 2, 3].forEach(function (q) { if (valueOf(q)) mark(q, valueOf(q)); });

    function isDone() { return !!(window.studyosStore && window.studyosStore.get(QUIZ_KEY)) || finished; }

    function showDone() {
      steps.forEach(function (st) { st.hidden = true; });
      result.hidden = true; topBar.hidden = true; back.hidden = true;
      doneBox.hidden = false;
    }

    function showStep(n, focus) {
      current = n;
      doneBox.hidden = true; result.hidden = true; topBar.hidden = false;
      steps.forEach(function (st) {
        var q = Number(st.getAttribute("data-q"));
        st.hidden = q !== n;
        var cont = st.querySelector(".qcont");
        if (cont) cont.hidden = !(q === n && fromAd[q] && valueOf(q));
      });
      stepLabel.textContent = "Pregunta " + n + " de " + TOTAL;
      bar.style.width = Math.round((n / TOTAL) * 100) + "%";
      back.hidden = n === 1;
      if (focus) {
        var h = quiz.querySelector('.qstep[data-q="' + n + '"] h3');
        if (h) h.focus({ preventScroll: true });
      }
    }

    function answered(q, wasPreselected) {
      if (!started) { started = true; funnel("quiz_start"); }
      funnel("quiz_question_" + q, { step: q, preselected: wasPreselected ? "yes" : "no" });   // nunca se envía la respuesta
      window.setTimeout(function () { if (q < TOTAL) showStep(q + 1, true); else finish(); }, 240);
    }

    function cap(t) { return t.charAt(0).toUpperCase() + t.slice(1); }

    function finish() {
      finished = true;
      var rec = getRecommendedRecipe(state.stage, state.need, state.mo, { avoid: state.avoid, time: state.time || "any" });
      var r = rec.recipe;

      var why = "Elegida porque buscas <b>" + NEED[state.need] + "</b> para <b>" + MOMENT[state.mo] + "</b>";
      if (rec.stageMatched) why += " y está pensada para <b>" + STAGELABEL[state.stage] + "</b>";
      else if (state.stage && state.stage !== "ninguna") why += ". Para esta combinación no hay una receta específica de " + STAGELABEL[state.stage] + "; esta es la que mejor encaja";
      if (state.time && state.time !== "any") why += (r.m <= Number(state.time) ? ", y la tienes lista en " + r.m + " minutos" : "");
      why += ".";

      var chips = [STAGECAP[state.stage || "ninguna"], cap(NEED[state.need]), MOMENTCAP[state.mo]]
        .concat(state.avoid.map(function (k) { return AVOIDLABEL[k]; }))
        .concat(state.time ? [TIMECAP[state.time]] : []);
      var chipHtml = chips.map(function (c) { return "<li>" + esc(c) + "</li>"; }).join("");

      var ing = r.g.length ? '<p class="res-ing"><b>Ingredientes principales:</b> ' + esc(r.g.join(", ").replace(/, ([^,]*)$/, " y $1")) + ".</p>" : "";
      var locked = rec.alternatives.map(function (a) {
        return '<div class="locked">' + LOCK + "<b>Receta bloqueada</b><span>" + a.m + " min, " + a.k + " kcal aprox.</span></div>";
      }).join("");
      var week = '<span class="wday on">Hoy</span>';
      for (var d = 2; d <= 7; d++) week += '<span class="wday">' + LOCK + "Día " + d + "</span>";

      result.innerHTML =
        '<p class="res-thanks">Gracias por contárnoslo. Esto es lo que entendimos:</p>' +
        '<ul class="chips2">' + chipHtml + "</ul>" +
        '<div class="res-main">' +
          '<p class="res-kicker">Tu receta de hoy</p>' +
          '<h3 class="res-title" tabindex="-1" id="res-title">' + esc(r.t) + "</h3>" +
          '<p class="res-meta"><span>' + esc(r.ph) + "</span><span>" + r.m + " minutos</span><span>" + r.k + " kcal aprox.</span><span>Alérgenos: " + esc(r.a) + "</span></p>" +
          '<p class="res-why">' + why + "</p>" + ing +
          '<p class="res-check">Revisa siempre los alérgenos antes de cocinar.</p>' +
          '<div class="res-lock">' + LOCK + "<p>La cantidad exacta, la preparación paso a paso y El Porqué Biológico de esta receta están en el recetario completo.</p></div>" +
        "</div>" +
        '<p class="res-sub">Tu semana de arranque</p><div class="week" aria-label="Tu semana de arranque: hoy desbloqueado y seis días bloqueados">' + week + "</div>" +
        '<p class="res-once">Un hábito se construye día a día. Tu primera receta ya está elegida; para las demás necesitas más recetas y un plan.</p>' +
        '<p class="res-sub">Cómo seguir</p>' +
        '<div class="compare">' +
          '<div class="cmp"><h4>10 recetas gratis</h4><div class="bar" aria-hidden="true"><i style="width:7%"></i></div><p><b>≈ 3 días</b> de comidas sin repetir</p><ul><li>Para probar el método</li><li>Sin menús ni listas de la compra</li></ul></div>' +
          '<div class="cmp cmp-paid"><h4>100 recetas completas</h4><div class="bar" aria-hidden="true"><i style="width:100%"></i></div><p><b>6 semanas</b> de menús (42 días) y ≈ 33 días de recetas sin repetir</p><ul><li>Menús semanales y listas de la compra</li><li>Batch cooking y sustituciones</li><li>El Porqué Biológico en cada receta</li></ul></div>' +
        "</div>" +
        '<p class="cmp-note">Cálculo con 3 platos al día. Cada cuerpo es distinto y no prometemos resultados: el recetario te da variedad y un plan para mantener el hábito.</p>' +
        '<div class="res-cta"><a class="btn btn-yellow btn-lg" href="gratis.html" data-track="free">Quiero 10 recetas gratis</a>' +
        '<a class="btn btn-olive btn-lg" href="https://buy.stripe.com/9B6fZj3tX6j8dvKcni1VK00" data-track="checkout">Quiero las 100 recetas</a></div>' +
        '<p class="res-sub res-alt-title">Otras 2 recetas también encajan contigo</p><div class="res-alt">' + locked + "</div>";

      steps.forEach(function (st) { st.hidden = true; });
      stepLabel.textContent = "Resultado";
      bar.style.width = "100%";
      back.hidden = true;
      result.hidden = false;
      var t = document.getElementById("res-title");
      if (t) t.focus({ preventScroll: true });
      quiz.scrollIntoView({ behavior: "smooth", block: "start" });

      if (window.studyosStore) window.studyosStore.set(QUIZ_KEY, "1");   // el test solo se puede hacer una vez
      funnel("quiz_complete");
      funnel("recipe_result_view", { recipe_id: r.id, match_quality: rec.match });
    }

    quiz.addEventListener("click", function (e) {
      var b = e.target.closest && e.target.closest(".qopts button");
      if (b) {
        var q = Number(b.closest(".qstep").getAttribute("data-q"));
        var v = b.getAttribute("data-v");
        if (q === 4) {   // varias respuestas posibles; "Nada en especial" es excluyente
          var group = b.closest(".qstep");
          if (v === "nada") { state.avoid = []; group.querySelectorAll(".qopts button").forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); }); b.setAttribute("aria-pressed", "true"); return; }
          group.querySelector('[data-v="nada"]').setAttribute("aria-pressed", "false");
          var on = b.getAttribute("aria-pressed") !== "true";
          b.setAttribute("aria-pressed", String(on));
          state.avoid = Array.prototype.filter.call(group.querySelectorAll(".qopts button"), function (x) { return x.getAttribute("aria-pressed") === "true" && x.getAttribute("data-v") !== "nada"; }).map(function (x) { return x.getAttribute("data-v"); });
          return;
        }
        var same = fromAd[q] && valueOf(q) === v;
        setValue(q, v); mark(q, v); fromAd[q] = false;
        answered(q, same);
        return;
      }
      var c = e.target.closest && e.target.closest("[data-continue]");
      if (c) { var qc = Number(c.closest(".qstep").getAttribute("data-q")); answered(qc, true); return; }
      if (e.target.closest && e.target.closest("[data-next]")) answered(4, false);
    });
    back.addEventListener("click", function () { if (current > 1) showStep(current - 1, true); });

    // Empezar desde otra parte de la web (por ejemplo, la calculadora de fase)
    api.start = function (stage) {
      quiz.scrollIntoView({ behavior: "smooth", block: "start" });
      if (isDone()) { showDone(); return; }
      state.stage = stage; fromAd[1] = false; mark(1, stage);
      showStep(2, false);
    };

    if (isDone()) showDone(); else showStep(1, false);
  }
  window.studyosQuiz = api;

  /* ---------------------------------------------------------------- Calculadora de fase */
  var form = document.getElementById("calc");
  if (form) {
    var dateEl = document.getElementById("calc-date");
    var lenEl = document.getElementById("calc-len");
    var out = document.getElementById("calc-out");
    var KEYS = ["menstrual", "folicular", "ovulatoria", "lutea"];
    var NAMES = ["menstrual", "folicular", "ovulatoria", "lútea"];

    function pad(n) { return (n < 10 ? "0" : "") + n; }
    function iso(d) { return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
    var today = new Date();
    var min = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 90);
    dateEl.max = iso(today);
    dateEl.min = iso(min);

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!dateEl.value) { out.innerHTML = '<p class="calc-warn">Elige primero el primer día de tu última regla.</p>'; return; }
      var p = dateEl.value.split("-");
      var start = Date.UTC(Number(p[0]), Number(p[1]) - 1, Number(p[2]));
      var now = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
      var day = Math.floor((now - start) / 86400000) + 1;
      var L = Number(lenEl.value);

      if (day < 1) { out.innerHTML = '<p class="calc-warn">Esa fecha es futura. Elige el primer día de tu última regla.</p>'; return; }
      if (day > L + 14) {
        out.innerHTML = '<p class="calc-warn">Han pasado muchos días desde esa fecha. Si tus ciclos son irregulares o estás en la perimenopausia, elige la fase a mano con los botones de abajo.</p>';
        return;
      }
      var ov = L - 14;             // día aproximado de la ovulación
      var ovStart = ov - 1, ovEnd = ov + 2;
      var idx = day <= 5 ? 0 : day < ovStart ? 1 : day <= ovEnd ? 2 : 3;
      var late = day > L;

      out.innerHTML =
        '<p class="calc-res"><b>Hoy sería el día ' + day + ' de tu ciclo.</b> Estás en la <b>fase ' + NAMES[idx] + "</b> (aproximado).</p>" +
        (late ? '<p class="calc-warn">Tu ciclo podría ser más largo de lo habitual o estar retrasado, así que la fase es aún más aproximada.</p>' : "") +
        '<button type="button" class="btn btn-yellow" id="calc-go">Ver recetas para hoy</button>';
      if (typeof window.selectPhase === "function") window.selectPhase(idx);
      document.getElementById("calc-go").addEventListener("click", function () { if (api.start) api.start(KEYS[idx]); });
      funnel("phase_calculated");
    });
  }
})();
