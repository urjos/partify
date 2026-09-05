# Partify — Design System

> **Fuente**: Stitch MCP · Proyecto `projects/9758156734394357670` · Tema: **Nocturnal Pulse**
> Última actualización del proyecto: 2026-09-04

---

## 🎨 Paleta de Colores

### Colores de Marca (Brand Accents)

| Rol | Token | Hex | Descripción |
|-----|-------|-----|-------------|
| Primary | `primary` | `#b24bfb` | Electric Violet — botones principales, estados activos, tags, puntos de mapa |
| Secondary | `secondary` | `#ea4bc8` | Neon Pink — gradientes hero, indicadores live, branding soundwave |
| Tertiary | `tertiary` | `#22c55e` | Vivid Emerald — confirmaciones RSVP, validez de tickets, capacidad positiva |
| Neutral base | `neutral` | `#0b0b0f` | Deep Obsidian — canvas principal nocturno |
| Destructive | — | `#ef4444` | Signal Crimson — cancelaciones y advertencias críticas |

### Gradiente de Marca

```css
background: linear-gradient(135deg, #b24bfb, #ea4bc8);
```

### Superficies (Tonal Surfaces)

| Token | Hex | Uso |
|-------|-----|-----|
| `surface` / `background` | `#131317` | Canvas base |
| `surface-dim` | `#131317` | Canvas oscurecido |
| `surface-container-lowest` | `#0e0e12` | Nivel más bajo |
| `surface-container-low` | `#1b1b1f` | Nivel bajo |
| `surface-container` | `#1f1f23` | Cards, inputs primarios |
| `surface-container-high` | `#2a292e` | Controles anidados, tiles secundarios |
| `surface-container-highest` | `#353439` | Nivel más alto |
| `surface-bright` | `#39393d` | Superficie brillante |
| `surface-variant` | `#353439` | Variante de superficie |

### Colores Semánticos

| Token | Hex |
|-------|-----|
| `on-surface` | `#e4e1e7` |
| `on-surface-variant` | `#d1c1d6` |
| `inverse-surface` | `#e4e1e7` |
| `inverse-on-surface` | `#303034` |
| `inverse-primary` | `#8d19d6` |
| `outline` | `#9a8ca0` |
| `outline-variant` | `#4e4354` |
| `surface-tint` | `#e2b6ff` |
| `on-background` | `#e4e1e7` |

### Primary Scale

| Token | Hex |
|-------|-----|
| `primary` | `#e2b6ff` |
| `on-primary` | `#4d007a` |
| `primary-container` | `#bf67ff` |
| `on-primary-container` | `#43006c` |
| `primary-fixed` | `#f3daff` |
| `primary-fixed-dim` | `#e2b6ff` |
| `on-primary-fixed` | `#2f004d` |
| `on-primary-fixed-variant` | `#6e00ab` |

### Secondary Scale

| Token | Hex |
|-------|-----|
| `secondary` | `#ffade4` |
| `on-secondary` | `#5f0050` |
| `secondary-container` | `#ae0294` |
| `on-secondary-container` | `#ffc9ea` |
| `secondary-fixed` | `#ffd7ee` |
| `secondary-fixed-dim` | `#ffade4` |
| `on-secondary-fixed` | `#3a0030` |
| `on-secondary-fixed-variant` | `#860071` |

### Tertiary Scale

| Token | Hex |
|-------|-----|
| `tertiary` | `#4ae176` |
| `on-tertiary` | `#003915` |
| `tertiary-container` | `#00a74b` |
| `on-tertiary-container` | `#003111` |
| `tertiary-fixed` | `#6bff8f` |
| `tertiary-fixed-dim` | `#4ae176` |
| `on-tertiary-fixed` | `#002109` |
| `on-tertiary-fixed-variant` | `#005321` |

### Error Scale

| Token | Hex |
|-------|-----|
| `error` | `#ffb4ab` |
| `on-error` | `#690005` |
| `error-container` | `#93000a` |
| `on-error-container` | `#ffdad6` |

### Transparencias y Efectos Glassmorphism

| Uso | Valor |
|-----|-------|
| Nav blur background | `rgba(23, 23, 29, 0.55)` |
| Bottom nav background | `rgba(11, 11, 15, 0.85)` |
| Specular rim (top) | `rgba(255, 255, 255, 0.55)` |
| Specular rim (bottom) | `rgba(255, 255, 255, 0.02)` |
| Hairline border | `rgba(245, 244, 242, 0.12)` |
| Secondary text | `rgba(245, 244, 242, 0.62)` |
| Primary text | `#f5f4f2` |
| Neon ambient (activo) | `rgba(178, 75, 251, 0.06–0.15)` |
| Press state | `opacity: 0.85; scale: 0.95` |

---

## 🔤 Tipografía

### Familia de Fuentes

| Rol | Fuente |
|-----|--------|
| Headline | **Plus Jakarta Sans** |
| Body | **Plus Jakarta Sans** |
| Label | **Plus Jakarta Sans** |

> Importar desde Google Fonts: `https://fonts.google.com/specimen/Plus+Jakarta+Sans`

### Escala Tipográfica

| Token | Tamaño | Peso | Line-Height | Letter-Spacing |
|-------|--------|------|-------------|----------------|
| `display-xl` | 36px | 800 | 44px | -0.02em |
| `display-xl-mobile` | 30px | 800 | 38px | -0.02em |
| `display-lg` | 30px | 800 | 38px | -0.02em |
| `headline-lg` | 24px | 700 | 32px | -0.01em |
| `headline-md` | 20px | 700 | 28px | -0.01em |
| `title-base` | 18px | 700 | 24px | 0 |
| `body-base` | 16px | 500 | 24px | 0 |
| `body-bold` | 16px | 700 | 24px | 0 |
| `body-sub` | 14px | 500 | 20px | 0 |
| `body-sub-semibold` | 14px | 600 | 20px | 0 |
| `label-badge` | 12px | 700 | 16px | +0.04em |
| `caption-caps` | 11px | 600 | 14px | +0.08em |

> **Nota**: `label-badge` y `caption-caps` se usan en **UPPERCASE** para máxima legibilidad en badges y etiquetas de estado.

---

## 📐 Espaciado

| Token | rem | px |
|-------|-----|----|
| `space-1` | 0.25rem | 4px |
| `space-2` | 0.5rem | 8px |
| `space-3` | 0.75rem | 12px |
| `space-4` | 1rem | 16px |
| `space-5` | 1.25rem | 20px |
| `space-6` | 1.5rem | 24px |
| `space-7` | 1.75rem | 28px |
| `space-8` | 2rem | 32px |
| `space-10` | 2.5rem | 40px |
| `space-12` | 3rem | 48px |
| `space-16` | 4rem | 64px |
| `space-20` | 5rem | 80px |
| `space-30` | 7.5rem | 120px |
| `gutter-mobile` | 0.75rem | 12px |
| `gutter-desktop` | 1.5rem | 24px |
| `margin-screen` | 0.75rem | 12px |
| `dock-offset` | 7.5rem | 120px |

---

## 🔲 Formas y Radios

| Token | Valor | Uso |
|-------|-------|-----|
| `sm` | 0.25rem (4px) | — |
| `DEFAULT` | 0.5rem (8px) | — |
| `md` | 0.75rem (12px) | — |
| `lg` | 1rem (16px) | Inputs, segmented controls, list items |
| `xl` | 1.5rem (24px) | Cards principales, bottom sheets |
| `2xl` | 2rem (32px) | Modals, bottom sheets premium |
| `full` | 9999px | Pills, badges, chips, switches, tab bar activo |

---

## 🧩 Componentes

### Botones

| Variante | Background | Border | Texto |
|----------|-----------|--------|-------|
| Primary | `#b24bfb` o gradiente `135deg #b24bfb→#ea4bc8` | — | `#f5f4f2`, `body-bold` |
| Secondary / Outlined | `rgba(178,75,251,0.10)` | `1px rgba(178,75,251,0.30)` | `#b24bfb` |
| Destructive | `rgba(239,68,68,0.10)` | `1px rgba(239,68,68,0.30)` | `#ef4444` |

Radio: `16px` (`rounded-2xl`) o `9999px` para variantes pill.
Press state: `transform: scale(0.85); opacity: 0.85`.

### Cards de Eventos

- Fondo: `#17171d` · Radius: `24px` (`rounded-3xl`) · `overflow: hidden`
- **Media**: edge-to-edge en la parte superior con chip flotante (`rgba(11,11,15,0.85)`, texto `label-badge` uppercase)
- **Body**: padding `16px`, título 2 líneas clamped, fila metadata (timestamp + distancia), avatar stack bottom-right

### Chips / Category Filter

| Estado | Background | Border | Radio |
|--------|-----------|--------|-------|
| Inactivo | `#17171d` | `rgba(245,244,242,0.12)` | `rounded-full` |
| Activo | `#b24bfb` o `#f5f4f2` | — | `rounded-full` |

Padding: `8px 16px`.

### Inputs de Texto

```css
background: #17171d;
border-radius: 16px;
padding: 12px 16px;
color: #f5f4f2;
/* Placeholder */
color: rgba(245, 244, 242, 0.62);
/* Error */
border: 1px solid #ef4444;
```

### Toggle Switch

- Tamaño: `52px × 30px` · Radio: `rounded-full`
- Inactivo track: `#2a2a33` → Activo track: `#b24bfb`
- Thumb: `24px` circle, color `#f5f4f2`, transición spring

### Floating Glass Tab Bar

- Posición: `32px` desde el borde inferior · Altura: `64px` · Radius: `28px`
- Fondo: `rgba(23,23,29,0.55)` + `backdrop-filter: blur(18px)`
- Borde superior: gradiente especular `rgba(255,255,255,0.55)` → `rgba(255,255,255,0.02)`
- Tab activo: pill circular `48px`, color `#b24bfb`

### Avatar Stack

- Círculos superpuestos con offset `-10px`
- Borde separador: `2px solid #17171d`
- Label inline: `body-sub-semibold`

---

## 🌑 Elevación y Profundidad (Glassmorphism)

| Nivel | Canvas | Técnica |
|-------|--------|---------|
| Floor | `#0b0b0f` | Canvas base |
| Cards / Inputs | `#17171d` | Tonal stepping |
| Inset / Nested | `#212129` | Tonal stepping |
| Modals / Sheets | `#17171d` + borde frosted | Tonal stepping |
| Floating nav | — | `backdrop-filter: blur(18px)` + semi-opaco |
| Ambient glow | — | `box-shadow: 0 0 28px rgba(178,75,251,0.10)` |
| Rim especular | — | `border: 1px solid` gradiente `rgba(255,255,255,0.55)` → `transparent` |

---

## 🎭 Personalidad de Marca

- **Público objetivo**: Exploradores urbanos, asiduos a la vida nocturna, fanáticos de música en vivo
- **Personalidad**: Magnética · Nocturna · Tecnológicamente refinada · Inmersiva
- **Estética**: Glassmorphism + High-Contrast Dark Mode
- **Referentes visuales**: Luces de escenario, lásers de club, ondas de ecualizador en OLED

---

*Generado automáticamente desde Stitch MCP · Partify `projects/9758156734394357670`*
