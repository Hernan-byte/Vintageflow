# Vintage Flow

Tienda web de ropa vintage y de segunda mano (Instagram: [@vint4ge_fl0w](https://instagram.com/vint4ge_fl0w)).

- **Next.js 15** (App Router, JavaScript) y CSS propio, sin librerías de estilos.
- **Supabase** para las cuentas de clientes (registro, inicio de sesión), el catálogo y los favoritos.
- Pensada para publicarse en **Vercel**.

## Qué hace

- Catálogo con filtro por categoría (Camisas, Chaquetas, Pantalones, Accesorios).
- Registro e inicio de sesión con correo y clave, con correo de confirmación.
- Favoritos por persona (corazón en cada prenda) y página **Mi cuenta**.
- Panel de administración para cargar prendas y fotos sin entrar a Supabase.
- Cada prenda se pide por Instagram (botón con enlace a la cuenta de la tienda).
- Modo claro y oscuro según el sistema, y diseño pensado primero para celular.

Si no pones las claves de Supabase, la web arranca en **modo demo**: muestra prendas de ejemplo y avisa que no hay cuentas.

## Puesta en marcha

1. **Crea un proyecto en [Supabase](https://supabase.com)** (plan gratis alcanza para empezar).
2. En **SQL Editor** ejecuta, en este orden:
   - `supabase/schema.sql` (tablas, permisos por fila y favoritos).
   - `supabase/admin.sql` (panel de la tienda: administradoras, permisos y bucket de fotos).
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

## Panel de la tienda

La tienda carga y cambia sus prendas desde **/admin** (aparece el enlace "Panel" en el menú cuando la cuenta es administradora). Desde ahí se puede:

- Agregar una prenda con nombre, categoría, talla, estado, precio y foto (la foto se achica sola en el navegador y se guarda en Supabase Storage).
- Editar una prenda o cambiar su foto.
- Marcar una prenda como vendida o volver a ponerla disponible.
- Eliminar una prenda (se borra también su foto).

Para activarlo:

1. Ejecuta `supabase/admin.sql` en el SQL Editor de Supabase (después de `schema.sql`).
2. Entra a la web y **crea la cuenta** de quien va a administrar (Iniciar sesión > Crear cuenta) y confirma el correo.
3. En el SQL Editor ejecuta, con ese mismo correo:
   ```sql
   insert into public.administradores (user_id)
   select id from auth.users where email = 'tu-correo@ejemplo.com';
   ```
4. Cierra sesión y vuelve a entrar. Verás "Panel" en el menú.

Los permisos los aplica la base de datos: aunque alguien abra /admin, solo las cuentas de la tabla `administradores` pueden crear, cambiar o borrar prendas y fotos. Para sumar a otra persona, repite el paso 3 con su correo.

También se pueden seguir editando las prendas desde Supabase > **Table Editor > productos**.

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
  admin/               Panel de la tienda: prendas y fotos (protegido)
  auth/callback/       Confirmación del correo
  acciones.js          Favoritos y cierre de sesión
components/            Encabezado, Catálogo, Tarjeta, Pie
lib/                   Configuración, sesión, productos y clientes de Supabase
middleware.js          Refresca la sesión y protege /cuenta y /admin
supabase/              schema.sql, admin.sql y ejemplo.sql
```

## Pendiente

- Varias fotos por prenda (hoy es una sola).
- Carrito y pagos en línea (hoy los pedidos van por Instagram).
- Textos reales de estado, medidas, entrega y forma de pago (están marcados con corchetes en la página de inicio).
