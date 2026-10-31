# Brief équipe app IRL (31/10, présentation jury à 17h30, urgent)

App Expo React Native de démo, cliquable de bout en bout, sans backend. Mathieu la fait défiler lui-même devant un jury pendant qu'un autre parle.

## Règles de Mathieu (verbatim résumé)
- « C'est nous qui cliquons, c'est pas toi. » Rien n'avance tout seul : chaque passage d'écran vient d'un tap. Seules exceptions : animations dans un écran (joueurs qui arrivent en salle d'attente, compte à rebours 3-2-1, rouleau de la machine à sous). Si je touche « Capturer », ça passe à la suivante.
- NE PILOTE JAMAIS le navigateur visible (outils mcp Claude_Browser ou claude-in-chrome) : Mathieu le regarde et clique lui-même. Captures en headless uniquement (puppeteer ou playwright via node, viewport 390x844, deviceScaleFactor 2).
- « Fais page par page. Propre, tu fais une, tu fais un screen. » Pour chaque écran : coder, capturer, regarder la capture (Read), comparer au visuel de référence, corriger, recapturer, puis seulement l'écran suivant. Qualité App Store.
- « Beaucoup plus réaliste. La carte et tout, il faut que tu évites les erreurs. »
- Première page : les boutons « Commencer » et « J'ai déjà un compte » doivent reprendre l'effet des visuels (bouton en relief brillant, arrière-plan). « Fait le même effet sur le bouton, l'arrière-plan, tout. »

## Références visuelles (la vérité du style)
- `~/Desktop/irl/site/screens/NN-*.jpg` : 20 maquettes validées en style. Chaque écran codé doit leur ressembler (fond, boutons en pilule relief brillante 50 pt, cartes très arrondies, chrono géant gras, bulles photo à bord blanc épais, carte claire style Apple Plans, zone azur à bord lumineux).
- Dossier complet produit et décisions : `~/Desktop/irl/site/src/head.md` et `tail.md`. Respecte les décisions figées (3 jeux, pas d'amis, pas de choix de rôle, accueil = 2 boutons + profil, aucun emoji, jamais « Le jeu, c'est dehors » ni « cache-cache »).
- Logo validé : `assets/img/logo.jpg` (v15). Avatars : `assets/av/`. Images : `assets/img/` (carte, lieu, rue, boite). Sons : `assets/sfx/`, via `src/sound.ts`.
- Une image manque (carte plus réaliste, photo, icône 3D) : ne la dessine pas en SVG ou CSS. Écris la demande précise dans ton rapport final (« IMAGE À GÉNÉRER : … »), le chef la génère.

## Cohérence (la même partout)
Toi = Mathieu (av/moi). Joueurs : Léa, Hugo, Sam, Inès, Théo. Code de partie K7Q2. Zone 500 m par défaut. Manhunt : la cible est Hugo ; un fuyard, plusieurs chasseurs (Toi, Léa, Sam). Une distance affichée correspond à la position sur la carte. Un temps affiché est le vrai temps écoulé. Paywall une seule fois par session (état partagé). Palette : bleu azur #4FB3F4, bleu vif #086EF7, rouge #FC1D33, texte #03061C ; pas de vert, violet, orange.

## Technique
- Navigation : `App.tsx` (pile d'écrans, `nav.go/replace/back/reset`). Ouvrir un écran directement en web : `http://localhost:PORT/?s=lobby&jeu=manhunt&role=chasseur`.
- Lancer : `npx expo start --web --port <ton port>` en arrière-plan (ou `npx expo export -p web` puis servir `dist/`).
- Composants partagés : `src/ui.tsx`, `src/theme.ts`. Tu peux y AJOUTER, jamais casser une signature existante.
- Chaque agent ne modifie que SES fichiers d'écran (liste dans sa mission). `npx tsc --noEmit` vert avant chaque commit. Commit `git add <tes fichiers> && git commit -m "fix: ..."`, sans Co-Authored-By, sans push (le chef pousse).
- Captures finales : `captures/<agent>/NN-ecran.png`, une par écran, plus une planche `captures/<agent>/planche.jpg`.
- Rapport final en 10 lignes au plus : écrans faits, capture de chacun, ce qui reste faux, images à générer.
