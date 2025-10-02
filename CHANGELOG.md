# Changelog

Toutes les modifications notables de ce projet seront documentées dans ce fichier.

## [1.0.0] - 2025-10-01

### ✨ Fonctionnalités initiales

#### 🎨 Design System
- Système complet de variables SCSS (couleurs, typographie, espacements)
- Reset CSS moderne
- Mixins utilitaires (media queries, truncate, visually-hidden)
- Grid system responsive
- Container avec breakpoints

#### 🧩 Composants pré-construits
- **Button** : 3 tailles, 5 variantes de couleurs, 3 styles (solid, outline, ghost)
- **Card** : En-tête, corps, footer, 3 variantes (default, outlined, flat)
- **Input** : Tous les types HTML5, validation, états disabled/error

#### 🔧 Système de build (Gulp)
- Compilation Twig → HTML
- Compilation SCSS → CSS avec sourcemaps
- Copie automatique des assets (images, fonts, icônes, scripts)
- Mode développement avec BrowserSync et live reload
- Génération automatique du fichier showcase.json

#### 🎯 Showcase interactif
- Page d'accueil listant tous les composants et pages
- Contrôles en temps réel pour chaque composant
- Prévisualisation instantanée
- Affichage du code HTML et Twig
- Copie du code en un clic
- Interface moderne et responsive

#### 📝 Documentation
- README.md complet avec guide d'utilisation
- QUICKSTART.md pour un démarrage rapide
- Exemples de composants commentés
- Guide de création de nouveaux composants

### 🗂️ Structure du projet
```
starter-kit-design-system/
├── dev/                    # Sources de développement
│   ├── assets/            # Assets (SCSS, JS, images, fonts, icônes)
│   ├── components/        # Composants Twig + JSON
│   ├── pages/            # Pages Twig
│   └── data/             # Données générées
├── public/               # Sortie compilée
├── tasks/               # Tâches Gulp
├── gulpfile.js         # Configuration Gulp
└── package.json        # Dépendances npm
```

### 🎨 Variables SCSS disponibles
- **Couleurs** : primary, success, danger, warning, secondary + nuances de gris
- **Typographie** : 8 tailles de police, 4 poids de police
- **Espacements** : 7 niveaux (xs à 3xl)
- **Border radius** : 5 niveaux + full
- **Ombres** : 4 niveaux
- **Breakpoints** : sm, md, lg, xl, 2xl

### 📦 Dépendances principales
- **Gulp 5.0.0** - Task runner
- **Sass 1.80.7** - Preprocesseur CSS
- **gulp-twig 1.2.0** - Compilation Twig
- **browser-sync 3.0.4** - Live reload

### 🚀 Commandes disponibles
- `npm run dev` - Mode développement
- `npm run build` - Build de production
- `npm run clean` - Nettoie le dossier public
- `gulp --tasks` - Liste toutes les tâches

---

## Prochaines versions (roadmap)

### [1.1.0] - Prévu
- [ ] Nouveaux composants (Badge, Alert, Modal, Tabs)
- [ ] Mode sombre (dark mode)
- [ ] Export de composants individuels
- [ ] Tests unitaires

### [1.2.0] - Prévu
- [ ] Documentation automatique avec JSDoc
- [ ] Storybook integration
- [ ] Optimisation des images
- [ ] Minification CSS/JS pour production

### [2.0.0] - Prévu
- [ ] Support TypeScript
- [ ] Web Components
- [ ] Support React/Vue export
- [ ] CLI pour scaffolding de composants

---

## Convention de commits

Ce projet utilise une convention de commits inspirée de [Gitmoji](https://gitmoji.dev/) :

- 🎉 `:tada:` - Nouvelle fonctionnalité majeure
- ✨ `:sparkles:` - Nouvelle fonctionnalité
- 🐛 `:bug:` - Correction de bug
- 🎨 `:art:` - Amélioration du style/design
- ♻️ `:recycle:` - Refactoring
- 📝 `:memo:` - Documentation
- 🚀 `:rocket:` - Amélioration des performances
- ✅ `:white_check_mark:` - Ajout de tests
- 🔧 `:wrench:` - Configuration
- 🚑 `:ambulance:` - Hotfix critique

---

**Légende des versions** : [X.Y.Z]
- **X** : Version majeure (breaking changes)
- **Y** : Version mineure (nouvelles fonctionnalités)
- **Z** : Patch (corrections de bugs)
