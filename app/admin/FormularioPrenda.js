'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { crearClienteNavegador } from '@/lib/supabase/client';
import { CATEGORIAS } from '@/lib/config';
import { rutaDeFoto } from '@/lib/formato';

// Achica la foto antes de subirla: máximo 1600 px de lado y JPG. Así sube rápido aunque venga del celular.
async function reducirImagen(archivo, maximo = 1600) {
  let imagen;
  try {
    imagen = await createImageBitmap(archivo);
  } catch {
    throw new Error('No se pudo leer la foto. Usa una imagen JPG, PNG o WebP.');
  }

  const escala = Math.min(1, maximo / Math.max(imagen.width, imagen.height));
  const ancho = Math.round(imagen.width * escala);
  const alto = Math.round(imagen.height * escala);

  const lienzo = document.createElement('canvas');
  lienzo.width = ancho;
  lienzo.height = alto;
  lienzo.getContext('2d').drawImage(imagen, 0, 0, ancho, alto);
  if (imagen.close) imagen.close();

  return new Promise((resolver, rechazar) => {
    lienzo.toBlob(
      (blob) => (blob ? resolver(blob) : rechazar(new Error('No se pudo procesar la foto.'))),
      'image/jpeg',
      0.85
    );
  });
}

export default function FormularioPrenda({ prenda = null }) {
  const router = useRouter();
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState(null);
  const editando = Boolean(prenda);
  const base = prenda ? `p-${prenda.id}` : 'nueva';

  async function enviar(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const datos = new FormData(form);

    const nombre = String(datos.get('nombre') || '').trim();
    if (!nombre) {
      setMensaje({ error: 'Escribe el nombre de la prenda.' });
      return;
    }

    const precioTexto = String(datos.get('precio') || '').trim().replace(',', '.');
    const precio = precioTexto === '' ? null : Number(precioTexto);
    if (precio !== null && (Number.isNaN(precio) || precio < 0)) {
      setMensaje({ error: 'El precio debe ser un número, por ejemplo 12.50.' });
      return;
    }

    setGuardando(true);
    setMensaje(null);

    try {
      const supabase = crearClienteNavegador();
      const fila = {
        nombre,
        categoria: String(datos.get('categoria')),
        talla: String(datos.get('talla') || '').trim() || null,
        estado: String(datos.get('estado') || '').trim() || null,
        precio,
      };

      const archivo = datos.get('foto');
      if (archivo && archivo.size > 0) {
        const blob = await reducirImagen(archivo);
        const ruta = `${crypto.randomUUID()}.jpg`;
        const { error: errorSubida } = await supabase.storage
          .from('prendas')
          .upload(ruta, blob, { contentType: 'image/jpeg', cacheControl: '31536000' });
        if (errorSubida) {
          throw new Error(
            'No se pudo subir la foto. Revisa que exista el bucket "prendas" y que tu cuenta sea administradora.'
          );
        }
        fila.foto_url = supabase.storage.from('prendas').getPublicUrl(ruta).data.publicUrl;
      }

      const consulta = editando
        ? supabase.from('productos').update(fila).eq('id', prenda.id)
        : supabase.from('productos').insert(fila);
      const { error } = await consulta;
      if (error) {
        throw new Error(
          error.code === '42501'
            ? 'Tu cuenta no tiene permisos de administración.'
            : 'No se pudo guardar la prenda. Intenta de nuevo.'
        );
      }

      // Al cambiar la foto de una prenda, la anterior ya no se usa y se borra.
      const rutaAnterior = editando && fila.foto_url ? rutaDeFoto(prenda.foto_url) : null;
      if (rutaAnterior) await supabase.storage.from('prendas').remove([rutaAnterior]);

      if (!editando) form.reset();
      setMensaje({ ok: editando ? 'Cambios guardados.' : 'Prenda agregada al catálogo.' });
      router.refresh();
    } catch (err) {
      setMensaje({ error: err.message || 'No se pudo guardar.' });
    } finally {
      setGuardando(false);
    }
  }

  return (
    <form className="admin-form" onSubmit={enviar} noValidate>
      <div className="campo ancho">
        <label htmlFor={`${base}-nombre`}>Nombre</label>
        <input
          id={`${base}-nombre`}
          name="nombre"
          type="text"
          defaultValue={prenda?.nombre ?? ''}
          required
        />
      </div>
      <div className="campo">
        <label htmlFor={`${base}-categoria`}>Categoría</label>
        <select
          id={`${base}-categoria`}
          name="categoria"
          defaultValue={prenda?.categoria ?? CATEGORIAS[0]}
        >
          {CATEGORIAS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
      <div className="campo">
        <label htmlFor={`${base}-precio`}>Precio (USD)</label>
        <input
          id={`${base}-precio`}
          name="precio"
          type="text"
          inputMode="decimal"
          placeholder="12.50"
          defaultValue={prenda?.precio ?? ''}
        />
      </div>
      <div className="campo">
        <label htmlFor={`${base}-talla`}>Talla</label>
        <input
          id={`${base}-talla`}
          name="talla"
          type="text"
          placeholder="M, 32, Única"
          defaultValue={prenda?.talla ?? ''}
        />
      </div>
      <div className="campo">
        <label htmlFor={`${base}-estado`}>Estado</label>
        <input
          id={`${base}-estado`}
          name="estado"
          type="text"
          placeholder="Buen estado, detalle en el puño…"
          defaultValue={prenda?.estado ?? ''}
        />
      </div>
      <div className="campo ancho">
        <label htmlFor={`${base}-foto`}>{editando ? 'Cambiar la foto' : 'Foto'}</label>
        <input id={`${base}-foto`} name="foto" type="file" accept="image/*" />
        <span className="ayuda">
          {editando
            ? 'Déjalo vacío para conservar la foto actual.'
            : 'JPG, PNG o WebP. Se achica sola antes de subir.'}
        </span>
      </div>
      <div className="ancho acciones-form">
        <button className="btn" type="submit" disabled={guardando}>
          {guardando ? 'Guardando…' : editando ? 'Guardar cambios' : 'Agregar prenda'}
        </button>
      </div>
      <p className="msg ancho" role="status" hidden={!mensaje}>
        {mensaje?.error || mensaje?.ok}
      </p>
    </form>
  );
}
