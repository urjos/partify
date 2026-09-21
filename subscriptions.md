# Partify Pro — Subscription Plans

Consistent with `spec.md` §1.2: Partify is zero-commission for ticketing.
Subscriptions monetize **host tools**, never gate attendee actions
(discovery, RSVP, contacting hosts stay free forever).

## Plans

### Partify Free (`user:free` — default, no purchase needed)

#### 1\. Límite de Fiestas Activas

- **Slug:** `basic_events_limit`
- **Title:** `2 Active Events Limit`
- **Description:** `Allows hosts to create and manage up to 2 active events simultaneously.`

#### 2\. Posicionamiento Estándar

- **Slug:** `standard_visibility`
- **Title:** `Standard Feed Placement`
- **Description:** `Displays events in the main feed and map sorted chronologically without promotional boost.`

#### 3\. Perfil Básico de Anfitrión

- **Slug:** `basic_host_profile`
- **Title:** `Basic Host Profile`
- **Description:** `Standard host profile branding without the Verified Pro badge.`

#### 4\. Mensajería Directa (Chat P2P)

- **Slug:** `p2p_messaging`
- **Title:** `Direct Host-Guest Messaging`
- **Description:** `Enables direct messaging with attendees to coordinate event details and off-platform payments`

### Partify Pro (`user:pro` — $5.90/mo or $58.80/yr)

#### 1\. Eventos Ilimitados

- **Slug:** `unlimited_events`
- **Title:** `Unlimited Active Events`
- **Description:** `Allows hosts to create and publish an unlimited number of active events simultaneously without restriction.`

#### 2\. Impulso Semanal de Evento

- **Slug:** `event_boost`
- **Title:** `Weekly Event Boost`
- **Description:** `Grants the ability to pin 1 event per week to the top of the "Near You" feed for 24 hours for maximum visibility.`

#### 3\. Insignia de Verificación Pro

- **Slug:** `verified_badge`
- **Title:** `Verified Pro Host Badge`
- **Description:** `Displays a distinctive verification badge next to the host's name on event cards and public profile to build attendee trust.`

## Clerk Dashboard setup

1. Dashboard → **Billing** → enable Billing for the app (connects Stripe).
2. **Plans** → Create plan:
   - `Free` — slug `free`, price $0 (usually the default/implicit plan — skip if Clerk already treats "no active plan" as free).
   - `Pro` — slug `pro`, monthly price $5.90, add annual price $58.80.
3. On the `pro` plan, add **Features** with slugs exactly: `unlimited_events`, `event_boost`, `verified_badge`.
4. Every `has()` check in code uses the `user:` scope prefix (Partify has no Organizations) — e.g. `has({ feature: "user:unlimited_events" })`.

## Checkout flow (no native Clerk UI for this)

`@clerk/expo` does not ship a Checkout/PricingTable component. Send the user
to Clerk's **Account Portal** billing page in the in-app browser, same
pattern already used for Google OAuth (`expo-web-browser`):

```ts
import * as WebBrowser from "expo-web-browser";

const openBillingPortal = () => {
  WebBrowser.openBrowserAsync(
    "https://accounts.YOUR-CLERK-DOMAIN.com/user/billing",
  );
};
```

Replace `YOUR-CLERK-DOMAIN` with your instance's Account Portal domain
(Dashboard → Account Portal → copy the base URL). Confirm the exact
`/user/billing` path in your dashboard before shipping — Clerk's Account
Portal paths can vary slightly by instance configuration, and I don't have
live access to verify yours.
