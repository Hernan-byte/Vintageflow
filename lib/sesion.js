import { crearClienteServidor } from '@/lib/supabase/server';
import { supabaseConfigurado } from '@/lib/config';

// Devuelve el cliente de Supabase y el usuario actual.
// En modo demo (sin claves) devuelve { supabase: null, user: null }.
export async function obtenerSesion() {
  if (!supabaseConfigurado()) return { supabase: null, user: null };

  const supabase = await crearClienteServidor();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { supabase, user };
}
