---
trigger: always_on
---

Estos son los casos de uso que debe abordar la app:
Módulo 1: Casos de Uso del Asistente (Fiestero)

- CU-01: Registro e Identidad Social (Clerk + MongoDB)
  - **Flujo:** El usuario se autentica mediante **Clerk** (correo o redes sociales). Clerk gestiona la sesión de forma segura cifrando los tokens en el dispositivo, y el backend en Express persiste el perfil público en **MongoDB** mediante Mongoose.
- **CU-02: Descubrimiento Geográfico y Filtro de Fiestas**
  - Flujo: El usuario explora el mapa o feed de fiestas cercanas a su ubicación. Al presionar un evento, visualiza detalles, fotos, rango de precios referenciales y el perfil del anfitrión con sus valoraciones de reputación.
- CU-03: Contacto Directo y Chat en Tiempo Real con el Anfitrión
  - Flujo: El asistente presiona _"Contactar Anfitrión"_ o _"Solicitar Entrada"_, lo que abre una sala de chat privada en tiempo real entre el usuario y el anfitrión para acordar el medio de pago o solicitar el enlace de compra externo (Passline, Eventbrite, etc.).
- CU-04: Recepción y Confirmación de Entrada Digital
  - Flujo: Una vez enviado el pago fuera de la app, el anfitrión presiona _"Confirmar Pago"_ en la conversación del chat o le envía el código/enlace de la entrada (ej. Passline o un código QR generado). El ticket queda registrado en la pestaña _"Mis Accesos"_ del asistente.

---

Módulo 2: Casos de Uso del Anfitrión (Promotor / Event Organiser)

- CU-05: Publicación y Configuración del Evento (Social Listing)
  - Flujo: El anfitrión crea la fiesta definiendo ubicación, ambiente, rango de precio referencial, método de pago preferido.
- CU-06: Gestión de Mensajes y Verificación Manual de Pago
  - Flujo: El anfitrión recibe solicitudes en su bandeja de entrada de Partify. Al verificar la transferencia o pago acordado, el anfitrión valida el estado del usuario en el chat enviando la confirmación de asistencia y agregandolo a asistencia del evento.
- CU-07: Sistema de Calificación y Verificación de Anfitrión (Trust & Safety)
  - Flujo: Para evitar estafas en pagos fuera de la app, Partify incluye un sistema de reputación. Los asistentes califican las fiestas asistidas y el anfitrión acumula un badge de _"Anfitrión Verificado"_.
