# Oilart — web + panel de administración

Este proyecto contiene tu página web y un pequeño "backend" (una función
en la nube) que guarda el catálogo de productos que vayas añadiendo desde
el panel de administración, protegido con una contraseña real.

No necesitas saber programar para publicarlo. Sigue estos pasos en orden.

---

## 1. Sube el proyecto a GitHub (una sola vez)

1. Crea una cuenta gratuita en https://github.com si no tienes una.
2. Pulsa el botón verde **"New"** (o el **+** de arriba a la derecha → *New repository*).
3. Ponle un nombre, por ejemplo `oilart-web`. Puede ser público o privado, da igual.
4. Pulsa **"Create repository"**. No marques ninguna otra opción.
5. En la página del repositorio recién creado, pulsa el enlace **"uploading an existing file"**
   (o ve a *Add file → Upload files*).
6. Arrastra **toda la carpeta** de este proyecto (con sus subcarpetas `public`,
   `netlify` incluidas) a la ventana del navegador. GitHub conserva las
   subcarpetas automáticamente.
7. Baja hasta el final y pulsa **"Commit changes"**.

Ya tienes el proyecto en GitHub.

---

## 2. Conecta el repositorio con Netlify

1. Crea una cuenta gratuita en https://netlify.com (puedes registrarte
   directamente con tu cuenta de GitHub, es lo más cómodo).
2. En el panel de Netlify, pulsa **"Add new site" → "Import an existing project"**.
3. Elige **GitHub** y autoriza el acceso si te lo pide.
4. Selecciona el repositorio `oilart-web` que acabas de subir.
5. Netlify detectará automáticamente el archivo `netlify.toml` de este
   proyecto (carpeta a publicar: `public`, funciones: `netlify/functions`).
   No hace falta que cambies nada. Pulsa **"Deploy site"**.
6. Espera un par de minutos. Cuando termine, Netlify te dará una dirección
   del tipo `https://algo-al-azar.netlify.app` — ya puedes abrir tu web ahí.

---

## 3. Activa el acceso de administrador (Netlify Identity)

1. Dentro del sitio en Netlify, ve a **"Site configuration" → "Identity"**.
2. Pulsa **"Enable Identity"**.
3. Baja hasta **"Registration"** y cámbialo a **"Invite only"** (así nadie
   puede crearse una cuenta por su cuenta; solo tú decides quién entra).
4. Ve a la pestaña **"Identity" → "Invite users"** y escribe tu propio
   correo electrónico. Pulsa **"Send"**.
5. Revisa tu bandeja de entrada, abre el correo de Netlify y pulsa el
   enlace. Te llevará a tu web, donde te pedirá que establezcas una
   contraseña. Esa es la contraseña real con la que entrarás como
   administrador.

### (Recomendado) Restringir aún más el acceso por correo

Aunque "Invite only" ya impide que se registre gente nueva, puedes añadir
una capa extra para que la función del catálogo solo acepte cambios de tu
correo exacto:

1. Ve a **"Site configuration" → "Environment variables"**.
2. Añade una variable:
   - **Key:** `ADMIN_EMAILS`
   - **Value:** tu-correo@ejemplo.com (si hay varias personas admin,
     sepáralas por comas: `tu-correo@ejemplo.com, socio@ejemplo.com`)
3. Ve a la pestaña **"Deploys"** y pulsa **"Trigger deploy" → "Deploy site"**
   para que la función recoja la variable nueva.

---

## 4. Usar el panel de administración

1. Abre tu web publicada.
2. Baja hasta el pie de página y pulsa **"🔒 Acceso administrador"**.
3. Inicia sesión con el correo y la contraseña que configuraste en el paso 3.
4. Se abrirá el panel: rellena nombre, descripción y foto del producto,
   y pulsa **"Publicar producto"**. Aparecerá al instante en la sección
   "Productos" de la web, para cualquier persona que la visite.
5. Puedes editar o eliminar productos desde la misma lista del panel.

---

## 5. Conectar tu dominio propio (oilart.es)

1. En Netlify, ve a **"Site configuration" → "Domain management"**.
2. Pulsa **"Add a domain"** y escribe `oilart.es`.
3. Netlify te mostrará los registros DNS que debes configurar en el sitio
   donde compraste el dominio (tu proveedor de dominios). Netlify te guía
   paso a paso según el proveedor.
4. Netlify emite el certificado de seguridad (https) automáticamente en
   cuanto el DNS apunta correctamente — puede tardar unas horas.

---

## Notas técnicas

- Las fotos del catálogo se guardan en **Netlify Blobs**, un almacenamiento
  incluido en tu plan de Netlify — no necesitas contratar nada aparte.
- La contraseña de administrador la gestiona Netlify Identity (estándar de
  la industria), no un valor escrito en el código.
- Las 5 fotos de la web (portada, historia, colección) están fijas en
  `public/images/` y no se pueden editar desde el panel — son solo las
  fotos que se añadan desde "Productos" las que se gestionan ahí.
- Si algún día quieres invitar a más gente del equipo, repite el paso 3
  (Invite users) con su correo.
