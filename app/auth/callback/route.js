import { NextResponse } from 'next/server';
import { crearClienteServidor } from '@/lib/supabase/server';
import { supabaseConfigurado } from '@/lib/config';

// Supabase redirige aquí desde el correo de confirmación con un código de un solo uso.
export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');

  if (code && supabaseConfigurado()) {
    const supabase = await crearClienteServidor();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}/cuenta`);
  }

  return NextResponse.redirect(`${origin}/ingresar?error=confirmacion`);
}
