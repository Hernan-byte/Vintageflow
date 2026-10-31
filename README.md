# Vintage Flow

Tienda web de ropa vintage y de segunda mano (Instagram: [@vint4ge_fl0w](https://instagram.com/vint4ge_fl0w)).

- **Next.js 15** (App Router, JavaScript) y CSS propio, sin librerías de estilos.
- **Supabase** para las cuentas de clientes (registro, inicio de sesión), el catálogo y los favoritos.
- Pensada para publicarse en **Vercel**.

## Qué hace

- Catálogo con filtro por categoría (Camisas, Chaquetas, Pantalones, Accesorios).
- Registro e inicio de sesión con correo y clave, con correo de confirmación.
- Favoritos por persona (corazón en cada prenda) y página **Mi cuenta**.
- Cada prenda se pide por Instagram (botón con enlace a la cuenta de la tienda).
- Modo claro y oscuro según el sistema, y diseño pensado primero para celular.

Si no pones las claves de Supabase, la web arranca en **modo demo**: muestra prendas de ejemplo y avisa que no hay cuentas.

## Puesta en marcha

1. **Crea un proyecto en [Supabase](https://supabase.com)** (plan gratis alcanza para empezar).
2. En **SQL Editor** ejecuta, en este orden:
   - `supabase/schema.sql` (tablas, permisos por fila y favoritos).
   - `supabase/ejemplo.sql` (opcional, 8 prendas de prueba).
3. Copia `.env.example` como `.env.local` y completa las dos claves de **Project Settings > API**:
   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   ```
   Sirve la clave `anon` o la `publishable`. Nunca uses la `service_role` en la web.
4. Instala y arranca:
   ```bash
   npm install
   npm run dev
   ```
   Abre http://localhost:3000.
5. En Supabase > **Authentication > URL Configuration** agrega:
   - Site URL: la dirección pública de la web (para pruebas, `http://localhost:3000`).
   - Redirect URLs: `http://localhost:3000/auth/callback` y la misma ruta con tu dominio real.

## Cargar prendas

Por ahora las prendas se administran desde Supabase > **Table Editor > productos**:

- `nombre`, `categoria` (una de las cuatro), `talla`, `estado` y `precio`.
- `foto_url`: sube la foto a **Storage** (crea un bucket público llamado `prendas`) y pega aquí su enlace público.
- `vendido`: márcalo en `true` cuando se venda; la prenda queda visible con la etiqueta "Vendida" y sin botón de pedido.

## Publicar en Vercel

1. Sube este repositorio a GitHub e impórtalo en [Vercel](https://vercel.com).
2. En **Environment Variables** agrega las mismas variables de `.env.local` y pon `NEXT_PUBLIC_SITE_URL` con tu dominio.
3. Vuelve a Supabase y agrega el dominio de Vercel a **Site URL** y **Redirect URLs** (`https://tu-dominio/auth/callback`).

Para producción conviene configurar un servidor de correo propio en Supabase (**Authentication > SMTP**), porque el que viene por defecto tiene un límite bajo de envíos por hora.

## Estructura

```
app/
  page.js              Inicio, catálogo, cómo comprar, Instagram
  ingresar/            Inicio de sesión y registro (server actions)
  cuenta/              Mi cuenta y favoritos (protegida)
  auth/callback/       Confirmación del correo
  acciones.js          Favoritos y cierre de sesión
components/            Encabezado, Catálogo, Tarjeta, Pie
lib/                   Configuración, sesión, productos y clientes de Supabase
middleware.js          Refresca la sesión y protege /cuenta
supabase/              schema.sql y ejemplo.sql
```

## Pendiente

- Panel para que la tienda cargue prendas y fotos sin entrar a Supabase.
- Carrito y pagos en línea (hoy los pedidos van por Instagram).
- Textos reales de estado, medidas, entrega y forma de pago (están marcados con corchetes en la página de inicio).
