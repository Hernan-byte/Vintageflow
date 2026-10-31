export const INSTAGRAM_URL =
  process.env.NEXT_PUBLIC_INSTAGRAM_URL || 'https://instagram.com/vint4ge_fl0w';
export const INSTAGRAM_USUARIO = '@vint4ge_fl0w';

export const CATEGORIAS = ['Camisas', 'Chaquetas', 'Pantalones', 'Accesorios'];

// Sin las claves de Supabase la web corre en modo demo: catálogo de ejemplo y sin cuentas.
export function supabaseConfigurado() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
