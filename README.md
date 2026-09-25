<div align="center">

# 🎉 Partify

### La plataforma social para descubrir y conectar con fiestas, eventos nocturnos y gatherings locales en tiempo real.

[![Latest Release](https://img.shields.io/github/v/release/urjos/partify?color=9333EA&label=Versi%C3%B3n&logo=github&style=for-the-badge)](https://github.com/urjos/partify/releases/latest)
[![Android Compatibility](<https://img.shields.io/badge/Android-8.0%2B_(API_26%2B)-3DDC84?style=for-the-badge&logo=android&logoColor=white>)](https://github.com/urjos/partify/releases/latest)
[![Expo SDK](https://img.shields.io/badge/Expo_SDK-54-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React_Native-0.81-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactnative.dev)

---

### 📲 Descarga la App para Android (Instalación Directa)

Puedes instalar Partify directamente en tu teléfono sin pasar por Google Play Store:

<br />

<a href="https://github.com/urjos/partify/releases/download/v1.0.0/partify_1.1.0.apk">
  <img src="https://img.shields.io/badge/%E2%AC%87%EF%B8%8F_DESCARGAR_APK_DIRECTO-Partify.apk-9333EA?style=for-the-badge&logo=android&logoColor=white" height="48" alt="Descargar Partify APK" />
</a>

<br /><br />

<table>
  <tr>
    <td align="center">
      <b>📱 Escanea desde tu celular para descargar:</b><br /><br />
      <img src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=https://github.com/urjos/partify/releases/download/v1.0.0/partify_1.1.0.apk" width="180" height="180" alt="Código QR para descargar Partify APK" /><br />
      <sub>Apunta la cámara de tu teléfono para descargar el archivo <code>Partify.apk</code></sub>
    </td>
  </tr>
</table>

</div>

<br />

---

## 📖 Guía Rápida de Instalación en Android

Al instalar una aplicación fuera de Google Play Store, Android te pedirá confirmar la instalación. Sigue estos 3 sencillos pasos:

1. **Descarga el APK:** Haz clic en el botón de descarga arriba o escanea el código QR desde tu celular.
2. **Autoriza la descarga:** Si tu navegador (Chrome, Brave, Samsung Internet) muestra el aviso _"Este archivo puede ser dañino"_, pulsa en **"Descargar de todos modos"**.
3. **Instala la app:**
   - Toca la notificación de descarga finalizada o abre el archivo desde tu carpeta de **Descargas**.
   - Si es la primera vez que instalas un APK desde ese navegador, Android abrirá Ajustes solicitando **"Instalar aplicaciones de fuentes desconocidas"**. Activa la casilla **"Permitir desde esta fuente"**.
   - Pulsa **Instalar** y ¡listo! Ya puedes abrir Partify.

> [!NOTE]
> Cada versión publicada en [GitHub Releases](https://github.com/urjos/partify/releases) incluye su checksum criptográfico **SHA-256** para que puedas verificar la autenticidad e integridad del binario.

---

## ✨ Características Principales

Partify funciona como una capa de descubrimiento social y contacto directo entre fiesteros y anfitriones:

- 🗺️ **Radar Geoespacial y Mapa Interactivo:** Explora eventos en un mapa dinámico con radio ajustable (1 a 50+ km) y filtros por categorías (Rooftops, Fiestas en Casa, Underground, Discotecas, etc.).
- 👥 **Social RSVP:** Marca tu intención de asistencia con estados como _"Asistiré"_ o _"Me interesa"_ y guarda tus fiestas favoritas en marcadores.
- 💬 **Contacto Directo con el Anfitrión:** Conexión vía WhatsApp o chat para acordar métodos de pago externos sin comisiones de ticketera.
- ⭐ **Sistema de Reputación y Verificación:** Calificaciones comunitarias de 1 a 5 estrellas para anfitriones y fiestas, acumulando el badge de _Anfitrión Verificado_.
- 📸 **Showcase Multimedia:** Carrusel con fotos y videos de alta calidad alojados en Supabase Storage CDN.

---

## 🏗️ Arquitectura Técnica

```
                                  +--------------------+
                                  |     Clerk Auth     |
                                  +---------+----------+
                                            | (Webhooks / JWT)
+--------------------------+      +---------v----------+      +---------------------------+
|  Mobile App (Expo SDK 54 | <--> |  Express REST API  | <--> | MongoDB Atlas             |
|  React Native 0.81)      |      |  (/api/v1)         |      | (2dsphere geospatial idx) |
+------------+-------------+      +---------+----------+      +---------------------------+
       |     |                                  |
       |     | (PostHog Events)                 | (Arcjet Shield)
       |     v                                  v
       |   +-------------------+      +-------------------+
       |   |   PostHog Events  |      |  Arcjet Security  |
       |   +-------------------+      +-------------------+
       v
+-------------------------------------------------------+
| Supabase Storage (CDN)                                |
| - events-media : Event photos and showcase videos     |
| - users-media  : User avatars (auto-cleanup on update)|
+-------------------------------------------------------+
```

| Capa                    | Tecnologías                                                            |
| :---------------------- | :--------------------------------------------------------------------- |
| **Frontend Móvil**      | React Native 0.81, Expo SDK 54, Expo Router v6, NativeWind v5          |
| **Backend REST API**    | Node.js v20, Express, Arcjet Security Shield                           |
| **Base de Datos**       | MongoDB Atlas con índices geoespaciales `2dsphere` y regla ESR         |
| **Almacenamiento**      | Supabase Storage (`events-media`, `users-media`)                       |
| **Autenticación**       | Clerk (`@clerk/expo`) con almacenamiento seguro en `expo-secure-store` |
| **Analítica**           | PostHog React Native                                                   |
| **Compilación & CI/CD** | Expo EAS Build + GitHub Releases                                       |

---

## 💻 Entorno de Desarrollo Local

Si deseas clonar el proyecto y contribuir al desarrollo:

### 1. Clonar el repositorio

```bash
git clone https://github.com/urjos/partify.git
cd partify
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env` en la raíz basado en `.env.example`:

```env
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
EXPO_PUBLIC_API_URL=https://partify-backend-td9j.onrender.com/api/v1
EXPO_PUBLIC_SUPABASE_URL=https://...supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=...
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=...
POSTHOG_PROJECT_TOKEN=...
POSTHOG_HOST=https://us.i.posthog.com
```

### 4. Iniciar la aplicación en modo desarrollo

```bash
npx expo start
```

---

## 📄 Licencia

Distribuido bajo la Licencia MIT. Consulta el archivo `LICENSE` para más información.
