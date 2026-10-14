import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
export const supabase = createClient("https://wquosenmzaezycdrpujz.supabase.co", "sb_publishable_hCZNRQgU9Rco89U7FUr12w_pp91r7uM");

const accessUrl = () => new URL("./", import.meta.url).href;

export async function requireCourseAccess() {
  const { data:{session} } = await supabase.auth.getSession();
  if (!session) { location.replace(accessUrl()); return null; }
  const { data, error } = await supabase.functions.invoke("ia-facil-access");
  if (error || !data?.has_access) {
    location.replace(new URL("?denied=1", accessUrl).href);
    return null;
  }
  return { supabase, session, data };
}
