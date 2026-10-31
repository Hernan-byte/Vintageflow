import Link from 'next/link';
import { obtenerSesion } from '@/lib/sesion';
import { esAdministrador } from '@/lib/admin';
import { INSTAGRAM_URL, INSTAGRAM_USUARIO } from '@/lib/config';

export default async function Encabezado() {
  const { supabase, user } = await obtenerSesion();
  const admin = await esAdministrador(supabase, user);

  return (
    <header className="wrap top">
      <Link className="brand" href="/">
        vintage flow
      </Link>
      <nav className="nav" aria-label="Principal">
        <Link href="/#catalogo">Catálogo</Link>
        <Link href="/#como">Cómo comprar</Link>
        <a className="ig" href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
          {INSTAGRAM_USUARIO}
        </a>
        {admin && <Link href="/admin">Panel</Link>}
        {user ? (
          <Link className="login-link" href="/cuenta">
            Mi cuenta
          </Link>
        ) : (
          <Link className="login-link" href="/ingresar">
            Iniciar sesión
          </Link>
        )}
      </nav>
    </header>
  );
}
