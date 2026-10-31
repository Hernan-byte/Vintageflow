import Link from 'next/link';
import Catalogo from '@/components/Catalogo';
import Tarjeta from '@/components/Tarjeta';
import { DROPS } from '@/lib/drops';
import { obtenerSesion } from '@/lib/sesion';
import { listarProductos, listarFavoritos } from '@/lib/productos';
import { INSTAGRAM_URL, INSTAGRAM_USUARIO } from '@/lib/config';

export default async function Inicio() {
  const { supabase, user } = await obtenerSesion();
  const { productos, demo, error } = await listarProductos(supabase);
  const favoritos = await listarFavoritos(supabase, user);

  return (
    <>
      <section className="wrap hero">
        <div className="hero-photo">
          <img src={DROPS[0].preview} alt={`Preview del ${DROPS[0].titulo.toLowerCase()}`} />
          <span className="chip">{DROPS[0].titulo}</span>
        </div>
        <div className="hero-copy">
          <span className="eyebrow">Ropa vintage y de segunda mano</span>
          <h1>Prendas que ya tienen historia.</h1>
          <p className="lede">
            Cada pieza es única y llega en una sola unidad. Elige la tuya antes de que se vaya.
          </p>
          <div className="actions">
            <Link className="btn" href="/#catalogo">
              Ver catálogo
            </Link>
            <a className="textlink" href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
              Escríbenos en Instagram
            </a>
          </div>
        </div>
      </section>

      <section className="wrap drops" id="drops">
        <div className="cat-head">
          <h2>Últimos drops</h2>
          <span className="sample-note">Tomados de nuestro Instagram</span>
        </div>

        {DROPS.map((d) => (
          <div className="drop" key={d.id}>
            <div className="drop-head">
              <h3>{d.titulo}</h3>
              <p>{d.detalle}</p>
            </div>
            {d.prendas.length > 0 ? (
              <div className="grid">
                {d.prendas.map((p) => (
                  <Tarjeta key={p.id} p={p} />
                ))}
              </div>
            ) : (
              <a className="drop-preview" href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
                <img src={d.preview} alt={`Preview del ${d.titulo.toLowerCase()}`} loading="lazy" />
                <span className="order">Ver las prendas en Instagram</span>
              </a>
            )}
          </div>
        ))}
      </section>

      <section className="wrap catalog" id="catalogo">
        <div className="cat-head">
          <h2>Catálogo</h2>
          {demo && <span className="sample-note">Prendas de ejemplo. Aquí van las reales.</span>}
        </div>

        {demo && (
          <p className="aviso">
            Modo demo: la web no está conectada a Supabase, así que se ven prendas de ejemplo y no
            hay cuentas. Mira el README para conectarla.
          </p>
        )}
        {error && (
          <p className="aviso">
            No se pudo cargar el catálogo. Revisa las claves de Supabase y que el esquema esté
            creado. Detalle: {error}
          </p>
        )}

        <Catalogo productos={productos} favoritos={favoritos} conFavoritos={!demo} />
      </section>

      <section className="how" id="como">
        <div className="wrap">
          <div className="pill">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 12l9-9h9v9l-9 9z" />
              <circle cx="16.5" cy="7.5" r="1.2" />
            </svg>
            <h3>Pieza única</h3>
            <p>Cada prenda existe en una sola unidad. Si se vende, no vuelve.</p>
          </div>
          <div className="pill">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="7" width="18" height="10" rx="1" />
              <path d="M6 17v-4M10 17v-2M14 17v-4M18 17v-2" />
            </svg>
            <h3>Estado y medidas</h3>
            <p>[Completar: cómo se informa el estado y las medidas de cada prenda.]</p>
          </div>
          <div className="pill">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" />
            </svg>
            <h3>Pídela por mensaje</h3>
            <p>
              Escríbenos por Instagram con la prenda y tu talla. [Completar: entrega y forma de
              pago.]
            </p>
          </div>
        </div>
      </section>

      <section className="wrap insta" id="instagram">
        <div className="insta-head">
          <div>
            <span className="eyebrow">Instagram</span>
            <h2>{INSTAGRAM_USUARIO}</h2>
          </div>
          <a className="btn" href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
            Seguir en Instagram
          </a>
        </div>
        <div className="squares">
          {DROPS.flatMap((d) => (d.preview ? [d.preview] : d.prendas.map((p) => p.foto_url)))
            .slice(0, 5)
            .map((src) => (
              <a key={src} href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
                <img src={src} alt="" loading="lazy" />
              </a>
            ))}
        </div>
      </section>
    </>
  );
}
