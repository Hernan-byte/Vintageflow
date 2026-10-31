import { alternarFavorito } from '@/app/acciones';
import { INSTAGRAM_URL } from '@/lib/config';

export function formatearPrecio(valor) {
  if (valor === null || valor === undefined) return 'Consultar';
  return '$' + Number(valor).toFixed(2);
}

export default function Tarjeta({ p, favorito = false, conFavoritos = false }) {
  const fondo = p.foto_url ? undefined : { background: `var(--t${p.tono || 1})` };

  return (
    <article className="card">
      <div className="photo" style={fondo}>
        {p.foto_url ? (
          <img src={p.foto_url} alt={p.nombre} loading="lazy" />
        ) : (
          <span className="chip">Foto de la prenda</span>
        )}
        <span className="unica">1 / 1</span>
        {p.vendido && <span className="vendida">Vendida</span>}

        {conFavoritos && (
          <form action={alternarFavorito} className="fav-form">
            <input type="hidden" name="productoId" value={p.id} />
            <button
              type="submit"
              className="fav"
              aria-pressed={favorito}
              aria-label={
                favorito
                  ? `Quitar ${p.nombre} de favoritos`
                  : `Guardar ${p.nombre} en favoritos`
              }
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill={favorito ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
            </button>
          </form>
        )}
      </div>

      <div className="row">
        <h3>{p.nombre}</h3>
        <span className="price">{formatearPrecio(p.precio)}</span>
      </div>
      <p className="sub">
        Talla {p.talla || '[M]'} · {p.estado || '[Estado]'}
      </p>

      {p.vendido ? (
        <span className="order agotado">Ya se vendió</span>
      ) : (
        <a className="order" href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
          Pedir por Instagram
        </a>
      )}
    </article>
  );
}
