# Application Showcase - Fichiers système

Ce dossier contient les fichiers HTML de l'application de showcase du Design System.

**⚠️ Ces fichiers sont gérés par le système et ne doivent pas être modifiés manuellement.**

## Fichiers

### `index.html`
Page d'accueil du showcase qui affiche tous les composants et pages du design system sous forme de grille de cartes.

### `page-showcase.html`
Page de prévisualisation unifiée pour afficher :
- Les composants avec leurs variants et contenus personnalisables
- Les pages avec leurs différentes variantes
- Vue responsive (mobile/tablet/desktop)
- Boutons "Voir le code" et "Copier le code"

## Workflow

Ces fichiers sont automatiquement copiés dans `public/` lors de la compilation :

```bash
npx gulp make:html      # Compile pages, composants et copie les fichiers app
npx gulp dev            # Mode développement avec watch
```

Les modifications apportées aux fichiers dans `dev/app/` seront automatiquement détectées et copiées en mode `dev`.

## Nettoyage

La commande `npx gulp clean` supprime tout le contenu de `public/` **sauf** :
- Le dossier `public/data/` (généré automatiquement par le système)

Les fichiers de `dev/app/` sont préservés et seront recopiés lors de la prochaine compilation.
