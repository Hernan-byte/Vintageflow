import { redirect } from 'next/navigation';
import { obtenerSesion } from '@/lib/sesion';

// true si la persona está en la tabla "administradores" (ver supabase/admin.sql).
export async function esAdministrador(supabase, user) {
  if (!supabase || !user) return false;

  const { data } = await supabase
    .from('administradores')
    .select('user_id')
    .eq('user_id', user.id)
    .maybeSingle();

  return Boolean(data);
}

// Para páginas y acciones del panel: exige sesión y dice si es administradora.
// La seguridad real la ponen los permisos de la base de datos; esto solo evita mostrar el panel a quien no corresponde.
export async function exigirAdmin() {
  const { supabase, user } = await obtenerSesion();
  if (!supabase || !user) redirect('/ingresar');

  const esAdmin = await esAdministrador(supabase, user);
  return { supabase, user, esAdmin };
}
