'use server';

import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { crearClienteServidor } from '@/lib/supabase/server';
import { supabaseConfigurado } from '@/lib/config';

const MENSAJES = {
  'Invalid login credentials': 'Correo o clave incorrectos.',
  'Email not confirmed': 'Falta confirmar tu correo. Revisa tu bandeja de entrada.',
  'User already registered': 'Ese correo ya tiene una cuenta. Prueba ingresando.',
};

function traducir(mensaje, codigo) {
  if (codigo === 'weak_password') return 'La clave es muy débil. Usa al menos 8 caracteres.';
  if (codigo === 'over_email_send_rate_limit') {
    return 'Se enviaron muchos correos seguidos. Espera unos minutos e intenta de nuevo.';
  }
  return MENSAJES[mensaje] || 'No se pudo completar. Intenta de nuevo en un momento.';
}

const correoValido = (c) => /^\S+@\S+\.\S+$/.test(c);
const SIN_SUPABASE = 'La tienda todavía no está conectada a Supabase. Mira el README.';

export async function ingresar(_estado, formData) {
  if (!supabaseConfigurado()) return { error: SIN_SUPABASE };

  const correo = String(formData.get('correo') || '').trim();
  const clave = String(formData.get('clave') || '');

  if (!correoValido(correo)) return { error: 'Escribe un correo válido.' };
  if (!clave) return { error: 'Escribe tu clave.' };

  const supabase = await crearClienteServidor();
  const { error } = await supabase.auth.signInWithPassword({ email: correo, password: clave });
  if (error) return { error: traducir(error.message, error.code) };

  redirect('/cuenta');
}

export async function crearCuenta(_estado, formData) {
  if (!supabaseConfigurado()) return { error: SIN_SUPABASE };

  const nombre = String(formData.get('nombre') || '').trim();
  const correo = String(formData.get('correo') || '').trim();
  const clave = String(formData.get('clave') || '');

  if (!nombre) return { error: 'Escribe tu nombre.' };
  if (!correoValido(correo)) return { error: 'Escribe un correo válido.' };
  if (clave.length < 8) return { error: 'La clave necesita al menos 8 caracteres.' };

  const origen =
    (await headers()).get('origin') || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const supabase = await crearClienteServidor();
  const { data, error } = await supabase.auth.signUp({
    email: correo,
    password: clave,
    options: { data: { nombre }, emailRedirectTo: `${origen}/auth/callback` },
  });
  if (error) return { error: traducir(error.message, error.code) };

  // Si el proyecto no exige confirmar el correo, la sesión ya viene abierta.
  if (data.session) redirect('/cuenta');

  return { ok: 'Te enviamos un correo para confirmar tu cuenta. Ábrelo y después ingresa.' };
}
