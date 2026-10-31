import { NextResponse } from 'next/server';
import { actualizarSesion } from '@/lib/supabase/middleware';
import { supabaseConfigurado } from '@/lib/config';

export async function middleware(request) {
  // Modo demo: sin Supabase no hay sesiones que refrescar.
  if (!supabaseConfigurado()) return NextResponse.next();

  const { response, user } = await actualizarSesion(request);

  if (!user && request.nextUrl.pathname.startsWith('/cuenta')) {
    const url = request.nextUrl.clone();
    url.pathname = '/ingresar';
    url.search = '';
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
