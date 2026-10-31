# IRL

App iPhone de jeux en vraie vie entre potes : Manhunt, GeoGuessr, Trouve l'objet. Prototype de démo cliquable de bout en bout (aucun backend).

## Lancer

```bash
npm install
npx expo start
```

Scanner le QR avec Expo Go sur iPhone, ou touche `w` pour le navigateur.

## Parcours

Onboarding (pages qui défilent, pseudo, selfie) → accueil (Lancer une partie, Rejoindre, profil) → choix du jeu → paywall → distance → salle d'attente (les joueurs arrivent seuls) → 3, 2, 1 → reveal (chassé en rouge ou chasseur) → partie jouable jusqu'à la fin → classement.

Code : `App.tsx` (navigation), `src/screens/` (un fichier par étape), `src/ui.tsx` (composants), `src/theme.ts` (couleurs, images).
