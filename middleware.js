import { NextResponse } from 'next/server';
import { actualizarSesion } from '@/lib/supabase/middleware';
import { supabaseConfigurado } from '@/lib/config';

export async function middleware(request) {
  // Modo demo: sin Supabase no hay sesiones que refrescar.
  if (!supabaseConfigurado()) return NextResponse.next();

  const { response, user } = await actualizarSesion(request);

  const ruta = request.nextUrl.pathname;
  if (!user && (ruta.startsWith('/cuenta') || ruta.startsWith('/admin'))) {
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
