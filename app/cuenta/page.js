import Link from 'next/link';
import { redirect } from 'next/navigation';
import Tarjeta from '@/components/Tarjeta';
import { obtenerSesion } from '@/lib/sesion';
import { salir } from '@/app/acciones';

export const metadata = { title: 'Mi cuenta' };

export default async function Cuenta() {
  const { supabase, user } = await obtenerSesion();
  if (!supabase || !user) redirect('/ingresar');

  const { data } = await supabase
    .from('favoritos')
    .select(
      'producto_id, creado, productos(id, nombre, categoria, talla, estado, precio, foto_url, vendido)'
    )
    .eq('user_id', user.id)
    .order('creado', { ascending: false });

  const favoritos = (data ?? []).map((f) => f.productos).filter(Boolean);
  const nombre = user.user_metadata?.nombre || user.email;

  return (
    <section className="wrap cuenta">
      <Link className="back" href="/">
        ← Volver a la tienda
      </Link>

      <div className="cuenta-head">
        <div className="cuenta-datos">
          <span className="eyebrow">Mi cuenta</span>
          <h1>{nombre}</h1>
          <p className="sub">{user.email}</p>
        </div>
        <form action={salir}>
          <button type="submit" className="btn btn-claro">
            Cerrar sesión
          </button>
        </form>
      </div>

      <h2 className="cuenta-sub">Mis favoritos</h2>
      {favoritos.length === 0 ? (
        <p className="vacio">
          Todavía no guardas ninguna prenda. Toca el corazón en el catálogo para guardarlas aquí.
        </p>
      ) : (
        <div className="grid">
          {favoritos.map((p) => (
            <Tarjeta key={p.id} p={p} favorito conFavoritos />
          ))}
        </div>
      )}
    </section>
  );
}
