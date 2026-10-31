import './globals.css';
import Encabezado from '@/components/Encabezado';
import Pie from '@/components/Pie';

export const metadata = {
  title: { default: 'Vintage Flow', template: '%s · Vintage Flow' },
  description: 'Ropa vintage y de segunda mano. Piezas únicas, una sola unidad de cada una.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;800&display=swap"
        />
      </head>
      <body>
        <Encabezado />
        <main>{children}</main>
        <Pie />
      </body>
    </html>
  );
}
