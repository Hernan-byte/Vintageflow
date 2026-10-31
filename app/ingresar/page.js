import Link from 'next/link';
import { redirect } from 'next/navigation';
import FormularioAcceso from './FormularioAcceso';
import { obtenerSesion } from '@/lib/sesion';
import { supabaseConfigurado } from '@/lib/config';

export const metadata = { title: 'Ingresar' };

export default async function Ingresar({ searchParams }) {
  const params = await searchParams;
  const { user } = await obtenerSesion();
  if (user) redirect('/cuenta');

  const configurado = supabaseConfigurado();

  return (
    <section className="wrap login">
      <Link className="back" href="/">
        ← Volver a la tienda
      </Link>
      <div className="login-card">
        <h1>Tu cuenta</h1>
        {params?.error === 'confirmacion' && (
          <p className="msg">
            No pudimos confirmar tu correo. El enlace pudo vencer: crea la cuenta otra vez o
            ingresa si ya la confirmaste.
          </p>
        )}
        {!configurado && (
          <p className="aviso">
            Modo demo: la web todavía no está conectada a Supabase, por eso no se pueden crear
            cuentas. Mira el README para conectarla.
          </p>
        )}
        <FormularioAcceso deshabilitado={!configurado} />
      </div>
    </section>
  );
}
