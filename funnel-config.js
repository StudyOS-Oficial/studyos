/*
  StudyOS | Configuración del embudo (un solo sitio para todos los anuncios)

  Cada anuncio lleva a la MISMA landing con un parámetro en la dirección:
     https://studyos-oficial.github.io/studyos/?dolor=hinchazon
  La web cambia el titular y el subtítulo y deja preseleccionada la respuesta del test.

  PARA AÑADIR UN ANUNCIO NUEVO: copia un bloque de painPointConfig, cambia su nombre, sus textos y
  la necesidad (need) o el momento (moment) que quieres preseleccionar. No hay que tocar nada más.

  need   (Q2): en más energía | hi bajar la hinchazón | an calmar los antojos | sa saciarme de verdad | ra algo rápido | ai priorizar lo antiinflamatorio
  moment (Q3): D desayuno | C comida | N cena | S snack o algo dulce
  Opcional en la dirección: &etapa=perimenopausia (o menopausia, menstrual, folicular, ovulatoria, lutea) para preseleccionar la Q1.

  Este archivo es pequeño y se carga antes de pintar la página para que no haya "parpadeo" de texto.
*/
(function () {
  "use strict";

  // Mensaje general (sin parámetro): el que ya tenía la portada
  var DEFAULT_HERO = {
    title: "Come a favor de tus hormonas en cada etapa de tu ciclo",
    lede: "Recetas antiinflamatorias, sencillas y explicadas con ciencia real, para tu ciclo, la perimenopausia y la menopausia."
  };

  var painPointConfig = {
    hinchazon: {
      need: "hi",
      title: "¿Hoy te preocupa la hinchazón?",
      lede: "Descubre una receta antiinflamatoria que encaja contigo y empieza con 10 recetas gratuitas."
    },
    energia: {
      need: "en",
      title: "¿Te falta energía últimamente?",
      lede: "Encuentra una receta para los días de poca energía y empieza con 10 recetas gratuitas."
    },
    antojos: {
      need: "an",
      title: "¿Los antojos aparecen justo cuando no los necesitas?",
      lede: "Descubre una receta pensada para los días de antojos y empieza con 10 recetas gratuitas."
    },
    rapido: {
      need: "ra",
      title: "¿Quieres comer mejor pero no tienes tiempo para cocinar?",
      lede: "Encuentra una receta rápida y sencilla y empieza con 10 recetas gratuitas."
    },
    saciedad: {
      need: "sa",
      title: "¿Buscas comidas que te dejen saciada de verdad?",
      lede: "Encuentra una receta saciante, con proteína y fibra, y empieza con 10 recetas gratuitas."
    },
    antiinflamatorio: {
      need: "ai",
      title: "¿Quieres poner lo antiinflamatorio en tu plato cada día?",
      lede: "Encuentra una receta antiinflamatoria que encaja contigo y empieza con 10 recetas gratuitas."
    },
    noches: {
      need: "hi",
      moment: "N",
      title: "¿Te gustaría terminar el día con una cena ligera?",
      lede: "Descubre una cena que encaja contigo y empieza con 10 recetas gratuitas."
    }
  };

  var STAGES = ["menstrual", "folicular", "ovulatoria", "lutea", "perimenopausia", "menopausia"];

  function param(name) {
    try { return new URLSearchParams(window.location.search).get(name); } catch (e) { return null; }
  }
  // Solo se aceptan claves que existen en la configuración (evita textos raros o inyectados desde la dirección)
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

  // Lo que el test debe dejar preseleccionado según el anuncio
  window.studyosPreselect = function () {
    var k = painKey(), c = k ? painPointConfig[k] : {};
    return { need: c.need || "", moment: c.moment || "", stage: stageParam() };
  };

  // Cambia el titular y el subtítulo de la portada (se llama justo después de pintar la portada)
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
