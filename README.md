# Dictée

Un clavier parlant pour apprendre à lire en recopiant les mots qui nous entourent.

**▶ [steevelefort.github.io/dictee](https://steevelefort.github.io/dictee/)**

## Le but

L'enfant recopie, lettre par lettre, un mot qu'il voit autour de lui : sur une boîte de céréales, une affiche, la couverture d'un livre, un panneau… Il appuie ensuite sur le bouton vert, et la tablette lit le mot à voix haute.

En associant les lettres qu'il reconnaît au son du mot, il découvre peu à peu comment s'écrit ce qu'il entend et comment se lit ce qu'il voit, à son rythme et sans l'aide d'un adulte.

## Un peu d'histoire

Ce projet reproduit un logiciel écrit il y a une dizaine d'années pour iPad, dans le même but. Cette nouvelle version est une application web, entièrement *vibe codée* avec [Claude Code](https://claude.com/claude-code) à partir d'une simple photo de l'application d'origine.

## Utilisation

- Toucher une lettre l'ajoute au texte affiché en haut de l'écran.
- **Appui long sur une lettre** : une bulle propose les accents (é è ê ë, à â, ç, ô œ…). Glisser le doigt sur la variante voulue puis relâcher, ou relâcher puis toucher la variante.
- **Touche rouge** : efface la dernière lettre. Maintenue, elle efface tout le texte (une jauge se remplit).
- **Touche verte** : lit le texte à voix haute grâce à la synthèse vocale de l'appareil.

Le clavier est alphabétique (et non AZERTY), avec de grandes touches qui affichent à la fois la majuscule et la minuscule.

## Installation sur tablette

L'application est une PWA : une fois ajoutée à l'écran d'accueil (Safari › Partager › *Sur l'écran d'accueil*), elle s'ouvre en plein écran et fonctionne **hors ligne**.

Elle vise les vieilles tablettes : **iPad mini 2 et ultérieurs** (iOS 12.5 / Safari 12), ainsi que tout navigateur récent.

## Développement

Prérequis : Node.js 20.19+ ou 22.12+.

```sh
npm install
npm run dev        # http://localhost:5173/dictee/
```

Le serveur de développement sert du code moderne non transpilé, que Safari 12 ne sait pas lire. Pour tester sur un vieil iPad, passer par le build :

```sh
npm run build
npm run preview -- --host
```

### Déploiement

```sh
npm run deploy     # build puis publication sur la branche gh-pages
```

Dans GitHub › Settings › Pages, la source doit être la branche `gh-pages`.

Après un déploiement, la PWA télécharge la nouvelle version en arrière-plan : elle s'affiche au lancement suivant.

### Icônes

Les icônes (favicon, PWA, iOS) sont générées à partir de `assets/icon-source.png` avec ImageMagick :

```sh
./scripts/generate-icons.sh
```

### Stack

React 19 et Vite 8, avec [vite-plugin-pwa](https://vite-pwa-org.netlify.app/) pour le mode hors ligne et [gh-pages](https://github.com/tschaub/gh-pages) pour le déploiement. Le build cible Safari 12 (`build.target` dans `vite.config.js`).

## Crédits

- Police **[Andika](https://software.sil.org/andika/)** © SIL International, distribuée sous licence [SIL Open Font License 1.1](https://openfontlicense.org/), intégrée via [Fontsource](https://fontsource.org/fonts/andika).

## Licence

Code sous licence [MIT](LICENSE). La police Andika reste sous sa propre licence (SIL OFL 1.1).
