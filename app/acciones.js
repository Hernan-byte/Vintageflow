'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { obtenerSesion } from '@/lib/sesion';

// Agrega o quita una prenda de los favoritos de la persona que inició sesión.
export async function alternarFavorito(formData) {
  const productoId = String(formData.get('productoId') || '');
  const { supabase, user } = await obtenerSesion();

  if (!supabase || !user) redirect('/ingresar');
  if (!productoId) return;

  const { data: existente } = await supabase
    .from('favoritos')
    .select('producto_id')
    .eq('user_id', user.id)
    .eq('producto_id', productoId)
    .maybeSingle();

  if (existente) {
    await supabase
      .from('favoritos')
      .delete()
      .eq('user_id', user.id)
      .eq('producto_id', productoId);
  } else {
    await supabase.from('favoritos').insert({ user_id: user.id, producto_id: productoId });
  }

  revalidatePath('/');
  revalidatePath('/cuenta');
}

export async function salir() {
  const { supabase } = await obtenerSesion();
  if (supabase) await supabase.auth.signOut();
  redirect('/');
}
