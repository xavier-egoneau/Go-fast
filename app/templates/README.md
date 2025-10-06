# Application Showcase - Fichiers système

Ce dossier contient les templates Twig de l'application de showcase du Design System.

**⚠️ Ces fichiers font partie du système de showcase. Modifiez-les uniquement si vous voulez personnaliser l'interface du showcase.**

## Fichiers

### `index.twig`
Page d'accueil du showcase qui affiche tous les composants et pages du design system sous forme de grille de cartes.

### `page-showcase.twig`
Page de prévisualisation unifiée pour afficher :
- Les composants avec leurs variants et contenus personnalisables
- Les pages avec leurs différentes variantes
- Vue responsive (mobile/tablet/desktop)
- Boutons "Voir le code" et "Copier le code"

## Workflow

Ces fichiers Twig sont automatiquement compilés en HTML dans `public/` lors de la compilation :

```bash
npx gulp make:html      # Compile pages, composants et fichiers app
npx gulp dev            # Mode développement avec watch
```

Les modifications apportées aux fichiers `.twig` dans `dev/app/` seront automatiquement détectées et recompilées en mode `dev`.

## Nettoyage

La commande `npx gulp clean` supprime tout le contenu de `public/` **sauf** :
- Le dossier `public/data/` (généré automatiquement par le système)

Les fichiers de `dev/app/` sont préservés et seront recopiés lors de la prochaine compilation.
