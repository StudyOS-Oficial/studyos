// Progress is stored locally so the course works without login or account creation.
const key = "iafacil-completed-modules";

function read() {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(value) ? value.map(Number).filter(Boolean) : [];
  } catch {
    return [];
  }
}

function write(values) {
  localStorage.setItem(key, JSON.stringify([...new Set(values.map(Number))].sort((a,b)=>a-b)));
}

export async function loadCompletedModules() {
  return read();
}

export async function saveModuleCompleted(moduleNumber, completed) {
  const current = read();
  const next = new Set(current);
  if (completed) next.add(Number(moduleNumber));
  else next.delete(Number(moduleNumber));
  const values = [...next].sort((a,b)=>a-b);
  write(values);
  // The course portal reads the per-module completion flags.
  try {
    localStorage.setItem(`iafacil-m${Number(moduleNumber)}-done`, completed ? "1" : "0");
  } catch {}
  return values;
}

// Completing the module quiz with 5/5 correct answers also completes the module.
function watchQuizCompletion() {
  const result = document.getElementById("result");
  const match = window.location.pathname.match(/\/modulo-(\d+)\//);
  const moduleNumber = match ? Number(match[1]) : 0;
  if (!result || !moduleNumber) return;

  const markFromQuiz = async (passed = false) => {
    let quizPassed = passed;
    try {
      quizPassed = quizPassed || localStorage.getItem("iafacil-quiz-m" + moduleNumber + "-passed") === "1";
    } catch {}
    if (!quizPassed && !/Resultado:\s*5\s*\/\s*5/.test(result.textContent || "")) return;
    try {
      await saveModuleCompleted(moduleNumber, true);
      const box = document.getElementById("done");
      if (box && !box.checked) box.checked = true;
      if (typeof window.up === "function") window.up();
      if (typeof window.update === "function") window.update();
    } catch (err) {
      console.error("No se pudo guardar el progreso del cuestionario:", err);
    }
  };

  new MutationObserver(() => markFromQuiz()).observe(result, {
    childList: true,
    characterData: true,
    subtree: true
  });
  document.addEventListener("iafacil-quiz-finished", event => {
    if (Number(event.detail?.module) !== moduleNumber || !event.detail?.passed) return;
    markFromQuiz(true);
  });
  markFromQuiz();
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", watchQuizCompletion, { once: true });
  } else {
    watchQuizCompletion();
  }
}
