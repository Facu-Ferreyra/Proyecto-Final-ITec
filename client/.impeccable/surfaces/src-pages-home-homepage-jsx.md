---
version: 1
slug: "src-pages-home-homepage-jsx"
primary_target: "src/pages/home/HomePage.jsx"
related_targets: ["src/App.jsx"]
---

# Surface brief: EasyBot, whole platform redesign (landing first)

Scope: landing (`/`, Persuade) plus the app surfaces in the same world: auth, Mis bots, wizard, public chat, panel, admin, legal, error pages (Operate / Read). Functionality, routes and API contracts are untouched.

Audience: small-business owner, non-technical, often on a phone. Job: understand in seconds that a bot is built in 4 steps without programming, see the chat working, press "Crear mi bot". Proof: the real chat (animated example) and the real wizard preview; no invented customers, numbers or testimonials. Constraint: final presentation 2026-11-26.

Revision 2026-11-19 (user-pinned): no fluorescent colours; more professional typography (user chose Bricolage Grotesque); motion that is not the usual fades (user asked). User picked palette "Azul tinta y arena".

## Direction contract

THESIS: Every answer the bot gives is a sign in the shop window: printed cardstock, set large, readable from the sidewalk. Refuses the SaaS split hero on a dark navy field with a floating chat mockup and a bento of equal cards.

OWN-WORLD: Sand ground #f3f1ec, warm paper #fffefb, ink #14171f; printed cardstock signs in sand #e6dcc4 / deep sand #d8cbab and ink blue #23408e (paper text on blue); a strip of torn paper tape (slightly skewed) holds each sign. Ink blue is the one action colour and the selection colour (soft #e2e7f3 with ink-blue border); green #2f6b45 only for published/active (soft fill + green border + green text). Single family Bricolage Grotesque variable, display at weight 720 with optical sizing and tight tracking, body 400–600. Numbers tabular. Signs flat, 4px corners, soft paper lift. Published = solid green edge; draft = dashed edge, unfilled.

STORY: The visitor sees a shop window full of signs that are actually a bot answering a customer, understands "I write the signs once, the bot answers forever", reads the 4 steps as 4 full-width rows, sees the three templates as three signs (sand, ink blue, paper), and presses "Crear mi bot".

FIRST VIEWPORT: Sand ground with a thin header (logo stamp left, "Iniciar sesión" + ink-blue "Crear mi bot" right). Left 7 columns: h1 "Chatbot para tu negocio, sin programar" set large on a sand sign with the fact line (4 pasos · Gratis · Tus clientes no instalan nada) under an ink rule inside the sign; sub-line; ink-blue "Crear mi bot" and "Ver los 4 pasos" text link. Right 5 columns: the live chat as a phone-width column; greeting and options keep the real public chat's bubbles (the demo must look like the product), visitor bubble in ink blue, and the answer lands as a taped sand sign ("De 9:00 AM a 7:00 PM"); a visible "Chat de ejemplo" stamp labels the synthetic data. Primary action inside the viewport at every width.

FORM: Own grounded direction "Cartel de vidriera" (shop-window cardstock signs), list position 4 of 7, assigned by the roll; materials re-pinned by the user from fluorescent to printed sand / ink blue. seed:ba87c1fa84dd756f. Raises: tabular fixed-position numerals (nixie); state by form not only hue (emission rail); logo stamp that survives QR/favicon size (skate wall); one step per full-width row (forge); every sign carries one concrete stamped fact (brine calendar). Motion grammar, three gestures: HANG (a sign swings from its tape as a damped pendulum, -4.5° → 0 over ~1 s: hero sign, chat answer, 404 sign, chosen template), DRAW (ink rules trace left to right with a pen ease: hero fact rule, step rows, page-title underline in the app, nav hover underline, button ink-fill), ROLL (step numbers roll up to their value like a "su turno" counter). Chat bubbles grow from their tail corner. Reduced motion: everything rests in its final state.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Unresolved

- Real screenshots of the product for the landing were declined before (2026-11-17); the landing uses live HTML of the chat instead.
- App-wide font sizes predate DESIGN.md's ramp (detector advisories); normalising them is a separate task.
