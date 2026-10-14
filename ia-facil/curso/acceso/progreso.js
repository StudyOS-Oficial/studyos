import { supabase } from "./access.js";

async function currentUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) throw new Error("Sesión no válida");
  return data.user;
}

export async function loadCompletedModules() {
  const user = await currentUser();
  const { data, error } = await supabase
    .from("course_progress")
    .select("completed_modules")
    .eq("user_id", user.id)
    .maybeSingle();
  if (error) throw error;
  return Array.isArray(data?.completed_modules) ? data.completed_modules.map(Number) : [];
}

export async function saveModuleCompleted(moduleNumber, completed) {
  const user = await currentUser();
  const current = await loadCompletedModules();
  const next = new Set(current);
  if (completed) next.add(Number(moduleNumber));
  else next.delete(Number(moduleNumber));

  const completed_modules = [...next].sort((a,b) => a-b);
  const { error } = await supabase
    .from("course_progress")
    .upsert(
      { user_id: user.id, completed_modules },
      { onConflict: "user_id" }
    );
  if (error) throw error;
  return completed_modules;
}
