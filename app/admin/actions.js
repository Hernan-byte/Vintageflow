'use server';

import { revalidatePath } from 'next/cache';
import { exigirAdmin } from '@/lib/admin';
import { rutaDeFoto } from '@/lib/formato';

function refrescar() {
  revalidatePath('/');
  revalidatePath('/admin');
  revalidatePath('/cuenta');
}

export async function alternarVendida(formData) {
  const id = String(formData.get('id') || '');
  const vendidoActual = formData.get('vendido') === 'true';

  const { supabase, esAdmin } = await exigirAdmin();
  if (!esAdmin || !id) return;

  await supabase.from('productos').update({ vendido: !vendidoActual }).eq('id', id);
  refrescar();
}

export async function eliminarPrenda(formData) {
  const id = String(formData.get('id') || '');
  const foto = String(formData.get('foto') || '');

  const { supabase, esAdmin } = await exigirAdmin();
  if (!esAdmin || !id) return;

  const { error } = await supabase.from('productos').delete().eq('id', id);

  // Si la prenda se borró, también se borra su foto para no dejar archivos sueltos.
  const ruta = rutaDeFoto(foto);
  if (!error && ruta) await supabase.storage.from('prendas').remove([ruta]);

  refrescar();
}
