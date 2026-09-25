# Technical & Product Specification (spec.md)

**Project Name:** Partify  
**Version:** 1.0.0  
**Stack:** React Native (Expo SDK 54) | Node.js (Express v4/v5) | MongoDB Atlas | Supabase Storage | Clerk | NativeWind v5 | PostHog | EAS  
**Author:** Senior PM, Software Engineer & Digital Marketer

---

## 1. Executive Summary & Product Vision

### 1.1 Product Vision

**Partify** is a location-based social platform designed to connect partygoers with local event hosts, nightlife organizers, and underground social gatherings in real time. Rather than acting as a rigid ticketing engine with transaction fees, Partify serves as a social discovery hub and peer-to-peer (P2P) interaction layer.

### 1.2 Core Value Proposition

- **For Attendees:** Real-time interactive map and list feed of nearby social events, category/radius filters, direct host communication, and social RSVP (`going` / `interested`).
- **For Hosts:** Direct communication with attendees, zero-commission event listing, detailed event configuration (media, pricing tiers, dress code, amenities), host reputation system with 1-5 star ratings, and community credibility.

---

## 2. System Architecture & Tech Stack

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
       |     | (PostHog Events)                 | (Bot & Rate-Limit Shield)
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

### 2.1 Tech Stack Breakdown

| Layer                       | Technology                        | Role & Justification                                                                                                                                |
| :-------------------------- | :-------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Frontend Mobile**         | React Native (0.81) + Expo SDK 54 | Cross-platform (iOS/Android) mobile app leveraging Expo SDK 54, fast refresh, and modern architecture.                                              |
| **Routing**                 | Expo Router (v6)                  | File-based routing (`app/(tabs)/...`, `app/(events)/...`, `app/(user)/...`, `app/(auth)/...`) supporting deep linking.                              |
| **Styling & UI**            | NativeWind (v5) + Liquid Glass    | Utility-first Tailwind styling with `@callstack/liquid-glass` native effects and `expo-linear-gradient`.                                            |
| **Interactive Map & Radar** | `react-native-maps`               | Interactive map discovery with custom markers, radius visualization, and geolocation via `expo-location`.                                           |
| **Authentication**          | Clerk (`@clerk/expo`)             | Social logins (Google, Apple, Email), token management with `expo-secure-store`, and server-side Clerk Webhook synchronization.                     |
| **Backend API**             | Node.js (v20+) + Express          | Modular Controller-Service-Model architecture served at `/api/v1` with standard `{ success, data, message }` JSON envelope.                         |
| **Security & Middleware**   | Arcjet                            | Rate-limiting, bot protection, and security middleware at API gateway level.                                                                        |
| **Database**                | MongoDB Atlas (Mongoose)          | NoSQL document store optimized with `2dsphere` spatial indexing for `$geoWithin` proximity queries and ESR compound indexes.                        |
| **Cloud Storage**           | Supabase Storage (`@supabase/js`) | Media asset storage in dedicated buckets: `events-media` (event gallery) and `users-media` (user avatars with automatic cleanup of replaced files). |
| **Analytics & Funnels**     | PostHog (`posthog-react-native`)  | Event tracking, conversion funnels, and feature adoption analytics wrapped at the root layout.                                                      |
| **DevOps & Delivery**       | EAS Build + EAS Update            | Cloud compilation of Android (APK/AAB) and iOS binaries with instant Over-The-Air JavaScript updates.                                               |
| **Code Quality**            | CodeRabbit / ESLint               | AI-driven PR reviews, Mongoose query audit (IXSCAN verification), and ESLint static checks.                                                         |

---

## 3. User Personas & Actors

### 3.1 Attendee (Partygoer / Fiestero)

- Discovers active parties nearby using an interactive map or feed with adjustable radius (1-50+ km) and category filters.
- Explores event details: media carousel, dress code, open bar/corkage rules, price tiers, and host credibility score.
- Engages directly with the host (via external messaging like WhatsApp) to negotiate payment or request tickets.
- Marks attendance (`going` / `interested`), saves events to favorites, and rates events/hosts upon attendance.

### 3.2 Host (Promoter / Organizer / Anfitrión)

- Publishes and manages party listings with photos, promotional videos, location address, music genres, age requirements, and pricing rules.
- Receives attendee requests and handles manual payment verifications outside the platform.
- Builds host credibility through verified host badges and positive star ratings (1 to 5 stars) from attendees.

### 3.3 Platform Ops (Admin)

- Moderates listings, ensures platform safety, handles reported events, and highlights featured parties.

---

## 4. Functional Modules & Use Cases

### CU-01: Authentication & User Social Identity

- **Actors:** All Users
- **Description:** Authenticate using Clerk (Google, Apple, Email OTP).
- **Technical Flow:**
  1. Client authenticates via `@clerk/expo` with secure session caching in `expo-secure-store`.
  2. Clerk dispatches an event to the backend webhook (`POST /api/v1/webhooks/clerk`).
  3. Express controller upserts the public user profile in MongoDB (`User` collection).
  4. Client syncs and caches authenticated user data via `GET /api/v1/users/me`.

### CU-02: Geospatial Party Discovery (Map Radar & Feed)

- **Actors:** Attendee
- **Description:** Explore parties within an adjustable geographic radius or by category.
- **Technical Flow:**
  1. Client retrieves device coordinates using `expo-location`.
  2. Map tab (`search.tsx`) or Feed tab (`index.tsx`) executes `GET /api/v1/events?lat={lat}&lng={lng}&radiusKm={km}&category={cat}`.
  3. Backend executes `$geoWithin` using `$centerSphere` with MongoDB `2dsphere` index on `location.coordinates`.
  4. Results render with smooth infinite marquee headers (`MarqueeText`), skeleton loaders, and interactive map markers.

### CU-03: Direct Host Contact & Social Interaction

- **Actors:** Attendee & Host
- **Description:** Direct communication channel between attendee and host to agree on payment method or ticket link.
- **Technical Flow:**
  1. Attendee opens event details (`app/(events)/[id].tsx`) and taps "Contactar Anfitrión" or "WhatsApp".
  2. If configured with `contactMethod: "external"`, triggers direct external URL.
  3. If configured with `contactMethod: "chat"`, triggers direct whatsapp chat using the phone number provided by the host.

### CU-04: Attendance Confirmation & Favorites

- **Actors:** Attendee & Host
- **Description:** Attendees register their attendance intent and save favorite parties.
- **Technical Flow:**
  1. Attendee taps "Asistiré" (`going`) or "Me interesa" (`interested`).
  2. Client dispatches `PATCH /api/v1/events/:id/attendance` with `{ status: "going" | "interested" }`.
  3. MongoDB atomic update modifies `attendees` array without race conditions.
  4. Attendee can bookmark parties using `PATCH /api/v1/events/:id/favorite` to store references in `user.favorites`.

### CU-05: Event Creation & Media Publishing (Host)

- **Actors:** Host
- **Description:** Create social event listings with media showcase, geo-tagging, and party amenities.
- **Technical Flow:**
  1. Host enters details in creation wizard (`app/(tabs)/create.tsx` & `app/create-location.tsx`).
  2. Host picks media (images/videos); files are uploaded to Supabase Storage bucket `events-media` via `@supabase/supabase-js`.
  3. Coordinates are selected via interactive map pin and stored as GeoJSON `Point`: `[longitude, latitude]`.
  4. Host sets pricing (free, single price, or multiple prices), music genres, dress code, open bar, and corkage rules.
  5. Client sends `POST /api/v1/events` to persist the listing in MongoDB.

### CU-06: Profile Management & Avatar Lifecycle

- **Actors:** All Users
- **Description:** Edit user profile, music preferences, and update profile picture with automatic storage optimization.
- **Technical Flow:**
  1. User edits profile in `app/(user)/edit/[id].tsx`.
  2. New avatar is uploaded to Supabase Storage bucket `users-media` under `avatars/${userId}_${timestamp}.${ext}`.
  3. If previous avatar URL belonged to `users-media`, it is automatically deleted from Supabase Storage to prevent orphaned files. External avatars (Google, Clerk) remain untouched.
  4. Profile updates (bio, phone, location, genres, spotify playlist) are saved via `PUT /api/v1/users/me`.

### CU-07: Trust, Safety & Reputation Rating System

- **Actors:** Attendee & Host
- **Description:** Rate events and hosts on a 1 to 5 star scale to establish community trust.
- **Technical Flow:**
  1. Attendee submits rating via `PATCH /api/v1/events/:id/rate` with `{ score: 1..5 }`.
  2. Attendee submits host rating via `POST /api/v1/users/:id/rate` with `{ score: 1..5 }`.
  3. Mongoose virtuals compute dynamic averages (`rating`, `ratingsCount`) without stale cached values.
  4. Hosts with high ratings earn verified host status and greater visibility in radar results.

---

## 5. Database Schema Specification (MongoDB / Mongoose)

### 5.1 User Schema (`users`)

```javascript
const ratingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    score: { type: Number, min: 1, max: 5, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false },
);

const userSchema = new mongoose.Schema(
  {
    clerkId: { type: String, required: true, unique: true, index: true },
    name: {
      type: String,
      required: true,
      trim: true,
      minLength: 2,
      maxLength: 50,
    },
    email: { type: String, trim: true, lowercase: true, unique: true },
    avatarUrl: { type: String, trim: true },
    username: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      lowercase: true,
    },
    bio: { type: String, trim: true, maxLength: 250, default: "" },
    location: { type: String, trim: true, default: "" },
    genres: [{ type: String, trim: true }],
    spotifyPlaylist: { type: String, trim: true, default: "" },
    phone: { type: String, unique: true, sparse: true, trim: true },
    visibleInRadar: { type: Boolean, default: true, index: true },
    ratings: { type: [ratingSchema], default: [] },
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }],
  },
  { timestamps: true },
);
```

### 5.2 Event Schema (`events`)

```javascript
const mediaItemSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["image", "video"], required: true },
    url: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const attendeeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["going", "interested"], required: true },
    respondedAt: { type: Date, default: Date.now },
  },
  { _id: false },
);

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minLength: 2,
      maxLength: 100,
    },
    description: { type: String, required: true, trim: true, maxLength: 2000 },
    category: {
      type: String,
      required: true,
      enum: [
        "Rooftop",
        "Fiesta en Casa",
        "Underground",
        "After",
        "Discoteca",
        "Pool party",
        "Cumpleaños",
        "After office",
        "Fiesta electrónica",
        "Music",
        "Nightlife",
        "House party",
        "Outdoors",
        "Food & Drink",
        "Art & Culture",
        "Sports",
        "Networking",
      ],
    },
    typeMusic: { type: String, default: "" },
    media: {
      type: [mediaItemSchema],
      validate: [
        (val) => Array.isArray(val) && val.length > 0,
        "Needs at least 1 media item",
      ],
    },
    startAt: { type: Date, required: true },
    closingAt: { type: Date, default: null },
    location: {
      address: { type: String, required: true, trim: true },
      coordinates: {
        type: { type: String, enum: ["Point"], default: "Point" },
        coordinates: { type: [Number], required: true }, // [longitude, latitude]
      },
    },
    capacity: { type: Number, min: 1, default: null },
    isFreeEvent: { type: Boolean, default: true },
    price: { type: Number, min: 0, default: null },
    priceWomen: { type: Number, min: 0, default: null },
    isMultiplePrices: { type: Boolean, default: false },
    contactMethod: {
      type: String,
      enum: ["chat", "external"],
      default: "chat",
    },
    contactPhone: { type: String, trim: true, default: "" },
    externalTicketUrl: { type: String, trim: true, default: "" },
    hideExactAddress: { type: Boolean, default: false },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    attendees: { type: [attendeeSchema], default: [] },
    status: { type: String, enum: ["active", "cancelled"], default: "active" },
    dressCode: { type: String, default: "Casual", trim: true },
    dressCodeDetails: { type: String, maxLength: 50, default: "", trim: true },
    corkageFree: { type: Boolean, default: false },
    openBar: { type: Boolean, default: false },
    isAdultsOnly: { type: Boolean, default: false },
    requirePhysicalId: { type: Boolean, default: false },
    ratings: { type: [ratingSchema], default: [] },
  },
  { timestamps: true },
);

// Performance Indexes (ESR Pattern)
eventSchema.index({ "location.coordinates": "2dsphere" });
eventSchema.index({ status: 1, startAt: 1 });
eventSchema.index({ status: 1, category: 1, startAt: 1 });
eventSchema.index({ organizer: 1, createdAt: -1 });
eventSchema.index({ "attendees.user": 1 });
```

---

## 6. API Endpoint Specification

All backend endpoints are prefixed with `/api/v1` and follow standard response envelopes:
`{ "success": boolean, "data": object | array, "message"?: string }`.

### 6.1 Authentication & Webhooks

| Method | Endpoint                 | Auth Required | Description                                                   |
| :----- | :----------------------- | :------------ | :------------------------------------------------------------ |
| `POST` | `/api/v1/webhooks/clerk` | Raw Webhook   | Handles Clerk webhook events (`user.created`, `user.updated`) |
| `POST` | `/api/v1/auth/sign-up`   | Public        | Custom sign-up endpoint (fallback)                            |
| `POST` | `/api/v1/auth/sign-in`   | Public        | Custom sign-in endpoint (fallback)                            |
| `POST` | `/api/v1/auth/sign-out`  | Public        | Custom sign-out endpoint                                      |

### 6.2 Users (`/api/v1/users`)

| Method | Endpoint                       | Auth Required | Description                                              |
| :----- | :----------------------------- | :------------ | :------------------------------------------------------- |
| `GET`  | `/api/v1/users`                | Public        | List visible users                                       |
| `GET`  | `/api/v1/users/check-username` | Yes (Clerk)   | Validate username uniqueness during onboarding / editing |
| `GET`  | `/api/v1/users/me`             | Yes (Clerk)   | Fetch authenticated user profile with favorites          |
| `PUT`  | `/api/v1/users/me`             | Yes (Clerk)   | Update authenticated user profile data                   |
| `GET`  | `/api/v1/users/:id`            | Yes (Clerk)   | Fetch public profile of specific user / host             |
| `PUT`  | `/api/v1/users/:id`            | Yes (Clerk)   | Update user profile by ID                                |
| `POST` | `/api/v1/users/:id/rate`       | Yes (Clerk)   | Rate a host / user (1 to 5 stars)                        |

### 6.3 Events (`/api/v1/events`)

| Method   | Endpoint                        | Auth Required | Description                                                    |
| :------- | :------------------------------ | :------------ | :------------------------------------------------------------- |
| `GET`    | `/api/v1/events`                | Yes (Clerk)   | Discover events with filters (`lat`, `lng`, `radiusKm`, `cat`) |
| `GET`    | `/api/v1/events/:id`            | Yes (Clerk)   | Get detailed event information including organizer & media     |
| `GET`    | `/api/v1/events/user/:id`       | Yes (Clerk)   | Fetch events organized by specific user                        |
| `POST`   | `/api/v1/events`                | Yes (Clerk)   | Create new event listing with media and coordinates            |
| `PUT`    | `/api/v1/events/:id`            | Yes (Clerk)   | Update existing event listing                                  |
| `DELETE` | `/api/v1/events/:id`            | Yes (Clerk)   | Cancel event listing (`status: "cancelled"`)                   |
| `PATCH`  | `/api/v1/events/:id/attendance` | Yes (Clerk)   | Toggle attendance status (`going` / `interested`)              |
| `PATCH`  | `/api/v1/events/:id/rate`       | Yes (Clerk)   | Rate an event (1 to 5 stars)                                   |
| `PATCH`  | `/api/v1/events/:id/favorite`   | Yes (Clerk)   | Toggle bookmark in user's favorites                            |

---

## 7. UI/UX Design System Guidelines

### 7.1 Design Tokens (NativeWind v5 / Tailwind CSS)

- **Background Canvas:** `#0A0A0A` / `#0D0D12` (Deep Night Dark)
- **Card Background:** `#161622` with border subtle `#232533`
- **Primary Neon Accent:** `#A855F7` / `#D946EF` (Electric Purple / Neon Magenta)
- **Secondary Accent:** `#F97316` (Sunset Orange)
- **Success / Going:** `#22C55E` (Emerald Green)
- **Typography:** Manrope font family (`@expo-google-fonts/manrope`), clean modern sans-serif.

### 7.2 Custom Interactive Components

- **MarqueeText:** Reusable text component with infinite continuous horizontal scrolling and double-ended linear gradient fades (`expo-linear-gradient`) for long event titles.
- **Interactive Radar Map:** Map view (`react-native-maps`) with dynamic slider (1-50 km), geolocation centering, and custom event markers.
- **Skeleton Loading:** Shimmer loaders implemented for zero layout shift during API fetching.

---

## 8. Analytics & Cloud Storage Architecture

### 8.1 Supabase Storage Structure

- **Bucket `events-media`:**
  - Public bucket hosting party photos and promotional videos.
  - Path convention: `events/${eventId}/${timestamp}_${filename}`.
- **Bucket `users-media`:**
  - Public bucket hosting user profile avatars.
  - Path convention: `avatars/${userId}_${timestamp}.${ext}`.
  - **Storage Cleanup Guard:** Whenever a user uploads a new avatar, any previous image hosted inside `users-media` is deleted from Supabase. External provider URLs (Google, Clerk) and local temporary URIs are explicitly safeguarded from deletion calls.

### 8.2 PostHog Event Tracking

Analytics are wrapped at the root layout (`app/_layout.tsx`) and captured during critical business actions:

- `user_signed_up` / `user_signed_in`
- `event_viewed` (with event ID and category)
- `event_created` (with event category and pricing type)
- `attendance_updated` (with `going` or `interested`)
- `host_contacted` (with contact method: chat or external)

---

## 9. DevOps, Deployment & Security

1. **API Security:**
   - **Arcjet Middleware:** Protects endpoints against automated bots, attacks, and abusive rate limits.
   - **Clerk Bearer Auth:** Validates session tokens and injects verified user identity into `req.user`.
2. **Mobile Deployment (EAS):**
   - `eas build --profile preview --platform android` for APK distribution and testing.
   - `eas build --profile production` for store-ready binaries.
   - `eas update --channel production` for zero-downtime over-the-air bug fixes and UI iterations.
3. **Database Maintenance:**
   - Periodic audit of execution stats using `.explain("executionStats")` to verify 100% `IXSCAN` coverage across queries.
4. **GitHub Release & Direct APK Distribution Strategy:**
   - **Distribution Channel:** GitHub Releases hosted under `urjos/partify`.
   - **Semantic Versioning:** Releases tagged with `vX.Y.Z` matching `app.config.js` `version`.
   - **Binary Assets:** Every release publishes standalone APK binaries (`Partify-vX.Y.Z.apk` and `Partify.apk`).
   - **Permanent Latest URL:** Direct download endpoint configured at `https://github.com/urjos/partify/releases/latest/download/Partify.apk`.
   - **Security & Integrity:** SHA-256 checksums published alongside release notes for client verification.
   - **Client Installation Support:** README landing page equipped with scannable dynamic QR codes and Android sideloading instructions ("Instalar aplicaciones de fuentes desconocidas").
