# Partify — Documento base de producto

## La idea en una frase

Red social para descubrir y publicar eventos/fiestas cerca de ti. Cualquier usuario puede tanto crear un evento como descubrir los de otros — no hay roles separados de "organizador" vs "asistente".

## Principios de diseño

- **Minimalista, moderno, tech** — nada de fuentes tipo fiesta infantil ni iconos recargados.
- **Estética "noche cálida"**: fondo casi negro con violeta (`#0a0a12`), tarjetas cálidas color crema (`#fff6e8`), acento coral vibrante (`#ff6f5e`) para CTAs.
- **Tipografía**: Plus Jakarta Sans (ya integrada — regular, medium, semibold, bold, extrabold, light).
- **Iconos**: línea (outline), peso consistente, sin relleno — deben leerse bien tanto sobre el fondo oscuro como sobre las tarjetas crema.
- **Marca**: Partify — pin de ubicación + forma de "P", gradiente violeta→rosa en el ícono de app.

## Funcionalidad núcleo (roles mezclados)

Todo usuario autenticado puede:

1. Ver un feed de eventos cercanos (vista principal).
2. Filtrar/buscar (por fecha, categoría, distancia); el mapa es un filtro visual secundario, no la vista principal.
3. Crear un evento propio.
4. Ver el detalle de un evento y marcar "voy" / "me interesa".
5. Ver quién más va (lista de asistentes).
6. Gestionar sus propios eventos creados (editar, cancelar, ver asistentes).
7. Gestionar su perfil.

## Arquitectura de navegación (tabs ya scaffoldeados)

```
(auth)                          (tabs)
 ├─ sign-in                      ├─ index        → Feed / Home
 ├─ sign-up                      ├─ subscriptions → Monetización / planes
 └─ forgot-password              ├─ insights      → Analíticas de tus eventos
                                  └─ settings      → Perfil y ajustes
```

## Pantallas a diseñar, en orden sugerido de construcción

### 2. Detalle de evento

- Mapa interactivo de Maps con APi Key
- Sección de comentarios (opcional para MVP, se puede posponer).
- Tocar imagen y que se pueda visualizar completa

### 3. Crear evento

- Flujo tipo formulario en pasos o scroll único (a decidir según cuánta fricción quieras).
- Campos: foto de portada, título, descripción, fecha/hora, ubicación (selector en mapa + dirección), categoría, capacidad (opcional), precio (opcional, si luego monetizas por evento).
- Preview antes de publicar.

### 4. Búsqueda / Filtros

- Puede vivir como modal o pantalla propia accesible desde el feed.
- Filtros: categoría, rango de fechas, distancia, "gratis vs de pago" (si aplica).
- Resultados en el mismo formato de card que el feed.

### 5. Mapa (vista alternativa al feed, no pantalla separada en la IA, pero sí una vista)

- Mismos eventos del feed, como pines.
- Tap en pin → preview card flotante → tap de nuevo → detalle completo.

### 6. Perfil / Settings (`(tabs)/settings.tsx`)

- Datos del usuario (foto, nombre, editar perfil).
- "Mis eventos" — creados y a los que vas.
- Preferencias de notificaciones.
- Cerrar sesión.

### 7. Insights (`(tabs)/insights.tsx`)

- Solo relevante para eventos que el usuario ha creado: vistas, asistentes confirmados vs interesados, alcance.
- Gráficas simples (barras/línea), nada sobrecargado.

### 8. Subscriptions (`(tabs)/subscriptions.tsx`)

- Ángulo SaaS: funciones premium para quien crea eventos seguido — destacar evento, estadísticas avanzadas, remover límite de eventos activos.
- Comparación de planes simple (free vs pro), no una tabla compleja.

## Componentes reutilizables a construir primero

Estos los vas a usar en casi todas las pantallas — constrúyelos antes que las pantallas completas:

1. **EventCard** — la card del feed (foto, título, fecha, distancia, chip categoría, avatar-stack).
2. **CategoryChip** — chip de categoría/filtro, con estado activo/inactivo.
3. **AvatarStack** — círculos de avatares superpuestos + contador ("+12").
4. **PrimaryButton / SecondaryButton** — ya tienes la base en `auth-button` de `global.css`, generalízala fuera del contexto de auth.
5. **EmptyState** — ilustración/ícono + texto, reutilizable en feed vacío, búsqueda sin resultados, etc.
6. **SectionHeader** — título + acción secundaria a la derecha (ej. "Cerca de ti" — "Ver todo").

## Notas de alcance para MVP

Cosas que puedes posponer sin bloquear un MVP funcional:

- Comentarios en eventos.
- Sistema de pago/entradas (empieza con eventos gratuitos).
- Notificaciones push (déjalo para cuando el feed y creación de eventos ya funcionen end-to-end).
- Insights avanzados — un conteo simple de "van/interesados" alcanza para empezar.
