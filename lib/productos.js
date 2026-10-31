import { EJEMPLOS } from '@/lib/ejemplos';

const COLUMNAS = 'id, nombre, categoria, talla, estado, precio, foto_url, vendido';

export async function listarProductos(supabase) {
  if (!supabase) return { productos: EJEMPLOS, demo: true, error: null };

  const { data, error } = await supabase
    .from('productos')
    .select(COLUMNAS)
    .order('creado', { ascending: false });

  if (error) return { productos: [], demo: false, error: error.message };
  return { productos: data ?? [], demo: false, error: null };
}

export async function listarFavoritos(supabase, user) {
  if (!supabase || !user) return [];

  const { data } = await supabase
    .from('favoritos')
    .select('producto_id')
    .eq('user_id', user.id);

  return (data ?? []).map((f) => f.producto_id);
}
