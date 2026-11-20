# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Primary: the owner of a small business** (microemprendimiento or pequeño comercio: a shop, a hair salon, a practice, a food place) with no technical knowledge. They build a chatbot for their business so customers get answers, book appointments or place orders without the owner being there. They usually work from a phone or a laptop between other tasks.
- **Secondary: that business's customers**, who open the bot through a public link (`/chat/:slug`) shared on social media, in a QR code or in a message. They don't sign up or install anything; most arrive on a phone.
- **Tertiary: the platform admin**, who activates or deactivates templates and manages user accounts and roles.

## Product Purpose

EasyBot lets a small business create, without programming, a chatbot with predefined answers (frequently asked questions, appointments or orders) and share it with its customers through a public link. Success for the owner: a working, published bot in minutes, and an inbox of conversations, contacts, appointments and orders they can act on. Success for the customer: an instant answer at any hour.

## Positioning

**Total simplicity.** Four steps, no programming, a link to share. No integrations to connect, no flow builder, no configuration screens: pick a template, fill in your business details while watching a live preview of the chat, review, publish. Every surface should make the product feel as short and obvious as that promise.

## Operating Context

- Owner flow: register → "Mis bots" (list with draft/published status) → 4-step wizard (template, business data with chat preview, review, publish) → share the link → panel (conversations with messages; contacts, appointments or orders with status changes: pendiente, confirmado, entregado, etc.).
- Customer flow: open the public link → chat with the bot → leave contact data, book an appointment or place an order.
- Admin flow: templates (activate, deactivate, delete) and users (role change, deactivate), search and audit log.
- Account flows: login, register, password reset by email, privacy policy (`/privacidad`), 404 and 403 pages.

## Capabilities and Constraints

- Stack in place: React 19 + Vite + React Router 7, plain CSS (no Tailwind, no UI kit), Zod schemas; Node + Express + Prisma + PostgreSQL (Neon); JWT in httpOnly cookie. Express serves `client/dist` from a single Render service (free plan: first request after idle can take seconds).
- Templates: FAQ (preguntas frecuentes), turnos (appointments), pedidos (orders).
- Bot status: borrador (draft) or publicado (published).
- Language: Spanish, Argentina (voseo: "Creá", "elegí", "Registrate"); `lang="es"`, `og:locale es_AR`.
- Timeline constraint: feature freeze was 2026-11-16, final presentation is 2026-11-26. The redesign changes the look and copy presentation, never functionality, routes or API contracts.
- Team project (4 members, course graded per member's commits): work stays on a feature branch and goes through a PR.

## Brand Commitments

- Name: **EasyBot**. Tagline in use: "Tu chatbot en minutos, sin programar."
- Voice: plain, warm, direct Rioplatense Spanish addressed to the owner with voseo; short sentences, no jargon ("bot", "link", "plantilla" are fine; "flujo", "integración", "NLP" are not).
- The user chose a **full redesign** (2026-11-19): the previous visual identity ("B · Azul afinado" in `src/styles/tokens.css`) is evidence, not a commitment.
- Footer credit must remain: "Proyecto Integrador Final · Programación Web con IA aplicada · IntegrarTEC 2026".

## Evidence on Hand

- Real product UI to show: the wizard with live chat preview, the public chat, the owner panel, the "Mis bots" list. Screenshots can be captured from the running app with mock data (`VITE_USE_MOCKS=true`).
- Existing illustrations: `src/assets/illustrations/` (hero-dial.svg, dial.svg, empty-bots.svg: concept "Hora de mostrador", a 24h dial with the hand at 22:30 = answers after closing). Usable or replaceable in the redesign.
- Favicon, apple-touch-icon and OG image in `public/`.
- **No real customers, testimonials, usage numbers, logos or press exist.** Never fabricate them. No pricing exists: the product is free.

## Product Principles

1. **Shorter than you expected.** Every screen should feel like one fewer step; remove before adding.
2. **Show the bot, not the promise.** The chat itself is the proof: real conversations and the live preview beat abstract claims.
3. **Built for a non-technical owner on a phone.** Plain words, big touch targets, nothing that needs a manual.
4. **The customer never feels software.** The public chat is the business's face, not EasyBot's: fast, friendly, registration-free.
5. **Honest.** Free, academic project, no invented social proof.

## Accessibility & Inclusion

Target WCAG 2.2 AA: keyboard operable (dialogs, drawer, custom listbox already exist and must stay accessible), visible focus, sufficient contrast, `prefers-reduced-motion` respected, usable at 360px wide. Privacy page cites Ley 25.326 (Argentina) and the AAIP legend.
