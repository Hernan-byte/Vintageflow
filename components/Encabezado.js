import Link from 'next/link';
import { obtenerSesion } from '@/lib/sesion';
import { INSTAGRAM_URL, INSTAGRAM_USUARIO } from '@/lib/config';

export default async function Encabezado() {
  const { user } = await obtenerSesion();

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
