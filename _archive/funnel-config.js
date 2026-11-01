/*
  StudyOS | Configuración del embudo
  Mantiene una única landing y personaliza el hero con ?dolor= y, opcionalmente, &etapa=.
  No modifica el funcionamiento del test: solo preselecciona respuestas y cambia el copy del hero.
*/
(function () {
  "use strict";

  var DEFAULT_HERO = {
    title: "Hoy no necesitas otra receta. Necesitas saber cuál elegir.",
    lede: "StudyOS reúne 100 recetas y una herramienta interactiva para ayudarte a encontrar una opción según tu etapa, lo que buscas hoy y el tiempo que tienes."
  };

  var painPointConfig = {
    hinchazon: {
      need: "hi",
      title: "¿Hoy buscas una opción más ligera?",
      lede: "Prueba StudyOS y encuentra una receta del recetario a partir de tu etapa, el momento del día y lo que buscas hoy."
    },
    energia: {
      need: "en",
      title: "¿Hoy buscas una comida que encaje con un día de poca energía?",
      lede: "StudyOS te ayuda a reducir opciones entre 100 recetas según tu etapa, el momento del día y el tiempo que tienes."
    },
    antojos: {
      need: "an",
      title: "¿No sabes qué elegir cuando te apetece algo dulce?",
      lede: "Prueba StudyOS y encuentra una opción del recetario según lo que buscas hoy, tu etapa y el momento del día."
    },
    rapido: {
      need: "ra",
      title: "¿Tienes poco tiempo y no quieres pensar qué cocinar?",
      lede: "StudyOS te ayuda a encontrar recetas rápidas entre las 100 opciones del recetario."
    },
    saciedad: {
      need: "sa",
      title: "¿Buscas una comida que te resulte más saciante?",
      lede: "Prueba StudyOS y encuentra una receta del recetario según tu etapa, el momento del día y lo que buscas hoy."
    },
    antiinflamatorio: {
      need: "ai",
      title: "¿Quieres incorporar más recetas de estilo antiinflamatorio?",
      lede: "StudyOS reúne 100 recetas y una herramienta para ayudarte a encontrar una opción según tu etapa, el momento del día y el tiempo que tienes."
    },
    noches: {
      need: "hi",
      moment: "N",
      title: "¿Otra noche sin saber qué cenar?",
      lede: "Prueba StudyOS y encuentra una cena del recetario según tu etapa, lo que buscas hoy y el tiempo que tienes."
    }
  };

  var STAGES = ["menstrual", "folicular", "ovulatoria", "lutea", "perimenopausia", "menopausia"];

  function param(name) {
    try { return new URLSearchParams(window.location.search).get(name); } catch (e) { return null; }
  }
  function painKey() {
    var d = String(param("dolor") || "").toLowerCase();
    return Object.prototype.hasOwnProperty.call(painPointConfig, d) ? d : "";
  }
  function stageParam() {
    var e = String(param("etapa") || "").toLowerCase();
    return STAGES.indexOf(e) > -1 ? e : "";
  }

  window.painPointConfig = painPointConfig;
  window.studyosDefaultHero = DEFAULT_HERO;
  window.studyosPainKey = painKey;

  window.studyosPreselect = function () {
    var k = painKey(), c = k ? painPointConfig[k] : {};
    return { need: c.need || "", moment: c.moment || "", stage: stageParam() };
  };

  window.studyosApplyHero = function () {
    var k = painKey();
    if (!k) return;
    var c = painPointConfig[k];
    var h = document.getElementById("hero-title");
    var l = document.getElementById("hero-lede");
    if (h) h.textContent = c.title;
    if (l) l.textContent = c.lede;
    document.documentElement.setAttribute("data-pain", k);
  };
})();
