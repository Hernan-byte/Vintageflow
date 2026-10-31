import { createBrowserClient } from '@supabase/ssr';

// Cliente de Supabase para el navegador. Usa la sesión que ya está en las cookies,
// así que las subidas de fotos y los cambios pasan por los permisos de la persona que inició sesión.
export function crearClienteNavegador() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
