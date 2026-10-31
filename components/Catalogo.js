'use client';

import { useState } from 'react';
import Tarjeta from './Tarjeta';
import { CATEGORIAS } from '@/lib/config';

export default function Catalogo({ productos, favoritos = [], conFavoritos = false }) {
  const [filtro, setFiltro] = useState('Todo');
  const opciones = ['Todo', ...CATEGORIAS];
  const lista = productos.filter((p) => filtro === 'Todo' || p.categoria === filtro);
  const favs = new Set(favoritos);

  return (
    <>
      <div className="filters" role="group" aria-label="Filtrar por categoría">
        {opciones.map((c) => (
          <button
            key={c}
            type="button"
            className="filter"
            aria-pressed={c === filtro}
            onClick={() => setFiltro(c)}
          >
            {c}
          </button>
        ))}
      </div>

      <p className="count" aria-live="polite">
        {lista.length} {lista.length === 1 ? 'prenda' : 'prendas'}
      </p>

      {lista.length === 0 ? (
        <p className="vacio">Todavía no hay prendas en esta categoría.</p>
      ) : (
        <div className="grid">
          {lista.map((p) => (
            <Tarjeta key={p.id} p={p} favorito={favs.has(p.id)} conFavoritos={conFavoritos} />
          ))}
        </div>
      )}
    </>
  );
}
