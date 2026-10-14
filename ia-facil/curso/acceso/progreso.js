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
  return values;
}
