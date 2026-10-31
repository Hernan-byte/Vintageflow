import Link from 'next/link';
import FormularioPrenda from './FormularioPrenda';
import { alternarVendida, eliminarPrenda } from './actions';
import { exigirAdmin } from '@/lib/admin';
import { formatearPrecio } from '@/lib/formato';

export const metadata = { title: 'Panel de la tienda' };

export default async function Admin() {
  const { supabase, esAdmin } = await exigirAdmin();

  if (!esAdmin) {
    return (
      <section className="wrap login">
        <Link className="back" href="/">
          ← Volver a la tienda
        </Link>
        <div className="login-card">
          <h1>Panel de la tienda</h1>
          <p className="aviso">
            Esta cuenta no tiene permisos de administración. Si eres parte de la tienda, pide que
            agreguen tu cuenta como administradora (ver el README, sección Panel de la tienda).
          </p>
        </div>
      </section>
    );
  }

  const { data: prendas, error } = await supabase
    .from('productos')
    .select('id, nombre, categoria, talla, estado, precio, foto_url, vendido, creado')
    .order('creado', { ascending: false });

  return (
    <section className="wrap admin">
      <Link className="back" href="/">
        ← Volver a la tienda
      </Link>
      <h1>Panel de la tienda</h1>

      <div className="admin-bloque">
        <h2>Nueva prenda</h2>
        <FormularioPrenda />
      </div>

      <div className="admin-bloque">
        <h2>
          Prendas <span className="admin-total">({prendas?.length ?? 0})</span>
        </h2>

        {error && <p className="aviso">No se pudieron cargar las prendas. Revisa el esquema SQL.</p>}
        {!error && prendas?.length === 0 && (
          <p className="vacio">Todavía no hay prendas. Agrega la primera con el formulario de arriba.</p>
        )}

        <ul className="admin-lista">
          {(prendas ?? []).map((p) => (
            <li key={p.id} className="admin-item">
              <div className="admin-fila">
                <div className="admin-mini">
                  {p.foto_url && <img src={p.foto_url} alt="" loading="lazy" />}
                </div>
                <div className="admin-info">
                  <strong>{p.nombre}</strong>
                  <span>
                    {p.categoria} · Talla {p.talla || '-'} · {formatearPrecio(p.precio)}
                  </span>
                  {p.vendido && <span className="etiqueta">Vendida</span>}
                </div>
                <form action={alternarVendida}>
                  <input type="hidden" name="id" value={p.id} />
                  <input type="hidden" name="vendido" value={String(p.vendido)} />
                  <button type="submit" className="mini">
                    {p.vendido ? 'Marcar disponible' : 'Marcar vendida'}
                  </button>
                </form>
              </div>

              <div className="admin-extra">
                <details className="admin-det">
                  <summary>Editar</summary>
                  <FormularioPrenda prenda={p} />
                </details>
                <details className="admin-det">
                  <summary>Eliminar</summary>
                  <p className="ayuda">Se borra la prenda y su foto. No se puede deshacer.</p>
                  <form action={eliminarPrenda}>
                    <input type="hidden" name="id" value={p.id} />
                    <input type="hidden" name="foto" value={p.foto_url ?? ''} />
                    <button type="submit" className="mini peligro">
                      Sí, eliminar esta prenda
                    </button>
                  </form>
                </details>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
