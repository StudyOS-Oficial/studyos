// IA fácil no longer requires an account or login to enter the course.
// Keep this module for backwards compatibility with existing lesson pages.
export const supabase = null;

export async function requireCourseAccess() {
  return { supabase: null, session: null, data: { has_access: true } };
}
