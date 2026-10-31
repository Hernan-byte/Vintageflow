// Últimos drops tomados de Instagram (@vint4ge_fl0w). Las fotos están en public/drops.
// Las prendas marcadas con ❌ en Instagram van como vendidas.
const prenda = (id, nombre, talla, precio, vendido = false) => ({
  id: `drop-${id}`,
  nombre,
  categoria: 'Pantalones',
  talla,
  estado: '10/10',
  precio,
  foto_url: `/drops/${id}.jpg`,
  vendido,
});

export const DROPS = [
  {
    id: '2026-10-28',
    titulo: 'Drop del 28 de octubre',
    detalle: 'Miércoles 28 de octubre, 6:30 pm. Este es el preview que subimos a Instagram.',
    preview: '/drops/2026-10-28-preview.jpg',
    prendas: [],
  },
  {
    id: '2026-10-21',
    titulo: 'Drop del 21 de octubre',
    detalle: 'Pantalones y jorts. Entrega a todo El Salvador.',
    preview: null,
    prendas: [
      prenda('2026-10-21-basic', 'Pantalón basic', '30', 15),
      prenda('2026-10-21-baggy', 'Pantalón baggy', '30', 15),
      prenda('2026-10-21-true-religion', 'True Religion', '36', 30, true),
      prenda('2026-10-21-jort-40', 'Jort', '40', 15),
      prenda('2026-10-21-jort-36', 'Jort', '36', 15, true),
      prenda('2026-10-21-jort-spider', 'Jort spider', 'M (32)', 30, true),
      prenda('2026-10-21-sin-nombre', 'Pants con cruces', 'M', 15),
      prenda('2026-10-21-kike', 'Pants Nike', 'M', 15),
      prenda('2026-10-21-kika', 'Pants Nike negro', 'S/M', 10),
      prenda('2026-10-21-ads', 'Pants Adidas', 'M', 10),
      prenda('2026-10-21-roca-wear', 'Rocawear', 'S', 15),
    ],
  },
];
