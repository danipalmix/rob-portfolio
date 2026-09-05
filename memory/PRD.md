# PRD — RoPhil Portfolio (Vue 2 + Vuetify + Firebase)

## Problem Statement (originale, giugno 2026)
Correggere e migliorare il sito portfolio esistente mantenendo stile, contenuti e funzionamento desktop:
1. Fix immagini invisibili su iPad/smartphone in orizzontale
2. Filtro "All" attivo graficamente all'apertura di una categoria
3. Zoom immagini nel lightbox (+/−, rotellina, pinch, reset)
4. Gerarchia visiva "Portfolio" (grassetto, più piccolo) + logo ridimensionato
5. Footer "© 2026 RoPhil Portfolio"
6. Favicon dal logo (Google Drive)
7. Hover più marcato sulle opere (titolo leggibile)
8. Icona hamburger personalizzata (Google Drive)
9. Supporto video YouTube nel pannello admin (validazione URL, player responsive)
10. Immagini tra i paragrafi di "About Me" (upload admin, alt text, responsive)
Vincoli: font Nunito, testo #393939, nessuna regressione desktop, accessibilità, NON toccare la compressione immagini esistente.

## Architettura
- SPA Vue 2 (vue-cli 4) + Vuetify, componente unico `/app/src/components/rob-portfolio.vue`
- Firebase (produzione, progetto rob-portfolio-bdba9): Auth (admin) + Firestore
  - `portfolioImages`, `siteContent/about`, `siteContent/categories`, `admins`
  - NUOVA collezione: `aboutSectionImages` (doc per slot: intro/journey/curiosity/cta → {src, alt})
- Dev server: supervisor `frontend` → `/app/frontend/package.json` proxy → `yarn serve` in /app su porta 3000 (NODE_OPTIONS=--openssl-legacy-provider per Node 20)
- Deploy reale utente: Firebase Hosting (`yarn build` → dist)

## Implementato (24/06/2026) — tutto testato ✅ (iteration_1 + iteration_2, 100%)
1. Fix immagini iOS: rimosso backdrop-filter dal wrapper (bug rendering WebKit), transition specifiche (no `transition: all` + blur), handler @load/@error, check `img.complete` su updated/resize/orientationchange, animazione CSS di fallback (visibile dopo ~1.8s anche senza evento load), viewport meta senza user-scalable=0
2. Sub-filtro "All" con classe active all'apertura categoria
3. Lightbox zoom: pulsanti +/−/reset, rotellina, pinch-to-zoom, pan (mouse/touch), doppio tap/click, limite 1x–5x, Escape per chiudere
4. Titolo "Portfolio" bold 800 / 2.1rem, filtri principali bold 700 (sub normali), logo 84px (70px mobile), header 92px
5. Footer "© 2026 RoPhil Portfolio"
6. Favicon generati dal logo Drive: favicon.ico multi-size, 16/32 png, apple-touch-icon 180, android-chrome 192/512, linkati in index.html
7. Overlay hover: gradiente scuro + blur, titolo bold con text-shadow; su touch (hover:none) gradiente inferiore sempre visibile
8. Hamburger personalizzato (`src/assets/hamburger_custom.png`), mdi-close per chiusura, aria-label/aria-expanded invariati
9. Card YouTube: selettore tipo nel modal admin, validazione URL (watch/youtu.be/shorts/embed/live), errore inline, thumbnail img.youtube.com + play badge, player 16:9 responsive (youtube-nocookie, autoplay)
10. Editor "Immagini tra i paragrafi" in About Me (admin): 4 slot, upload/sostituisci/rimuovi, alt text, salvataggio batch in `aboutSectionImages`, figure responsive per i visitatori
- Font Nunito globale, testi #393939, compressImage NON modificata (richiesta utente)

## Implementato (05/06/2026) — Hero Slider homepage ✅ (iteration_3, 11/12 pass, prod DB pulito)
- Hero slider full-width (NON 100vh, height clamp 340-560px) subito sotto l'header (header INVARIATO), visibile solo se esistono slide attive
- Ogni slide: immagine sfondo (base64 via compressImage, come portfolio), titolo, sottotitolo, testo descrittivo, CTA multiple (interna → changePage / esterna → target=_blank), overlay configurabile (scuro/gradiente/nessuno + intensità 0-90%), transizione fade o slide, durata 2-30s (default 6s)
- Navigazione: autoplay (pausa su hover/tab nascosta), frecce, pallini, swipe touch; su ≤480px frecce spostate in basso e ridotte
- Admin: pagina "Gestione Slider" (sidenav, solo admin) con lista draggable (riordino → batch order), toggle attiva/disattiva, modifica, elimina (confirm), modale add/edit con validazioni (immagine obbligatoria, label CTA, URL esterni http/https); pulsante "Gestisci slider" overlay su hero per admin
- Firestore: nuova collezione `heroSlides` (title, subtitle, description, src base64, active, order, duration, transition, overlay, overlayOpacity, ctas[])
- Nota test: errore validazione URL non intercettato in un run automatico (probabile click su bottone disabilitato durante compressione img) ma slide invalida correttamente NON salvata; caso "senza immagine" mostra errore correttamente

## Credenziali
- Admin: rophil.art@gmail.com / RobAdmin2025! (vedi memory/test_credentials.md)

## Backlog / P2
- Refactor componente monolitico (>2600 righe) in sottocomponenti
- Sostituire window.alert/confirm con toast/sweetalert già installati
- data-testid sul FAB (add-card-fab)
- Eventuale ordine/drag delle card video separato per categoria
