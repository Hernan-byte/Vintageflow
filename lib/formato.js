export function formatearPrecio(valor) {
  if (valor === null || valor === undefined) return 'Consultar';
  return '$' + Number(valor).toFixed(2);
}

// De la dirección pública de una foto saca su ruta dentro del bucket "prendas".
export function rutaDeFoto(url) {
  if (!url || !url.includes('/prendas/')) return null;
  const ruta = url.split('/prendas/')[1].split('?')[0];
  return ruta ? decodeURIComponent(ruta) : null;
}
