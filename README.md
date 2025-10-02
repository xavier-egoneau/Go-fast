# 🎨 Starter Kit Design System

Un starter kit moderne pour l'intégration HTML avec showcase de composants dynamique.

## 📋 Table des matières

1. [Prérequis](#prérequis)
2. [Installation](#installation)
3. [Utilisation](#utilisation)
4. [Structure du projet](#structure-du-projet)
5. [Créer un nouveau composant](#créer-un-nouveau-composant)
6. [Tâches Gulp disponibles](#tâches-gulp-disponibles)

---

## 🔧 Prérequis

- **Node.js** (v16 ou supérieur)
- **npm** (v8 ou supérieur)
- **Gulp CLI** installé globalement : `npm install -g gulp-cli`

## 🚀 Installation

1. **Cloner le projet**
```bash
git clone [url-du-repo]
cd starter-kit-design-system
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Lancer le projet en mode développement**
```bash
npm run dev
# ou
gulp dev
```

Le projet sera accessible sur `http://localhost:3000`

## 📖 Utilisation

### Mode développement

```bash
gulp dev
```

Cette commande :
- Génère la liste des composants et pages
- Compile SCSS en CSS
- Compile Twig en HTML
- Copie les assets (scripts, images, fonts, icônes)
- Lance un serveur local avec live reload
- Surveille les modifications de fichiers

### Build de production

```bash
gulp
```

Compile tout le projet dans le dossier `public/`

## 📁 Structure du projet

```
starter-kit-design-system/
├── dev/                          # Dossier de développement
│   ├── assets/
│   │   ├── scss/                 # Styles SCSS
│   │   │   ├── base/            # Reset, variables, mixins, typography
│   │   │   ├── components/      # Styles des composants
│   │   │   ├── layout/          # Grid, container
│   │   │   ├── showcase/        # Styles de la page showcase
│   │   │   └── style.scss       # Point d'entrée
│   │   ├── scripts/             # Scripts JavaScript
│   │   │   └── showcase.js      # Script principal du showcase
│   │   ├── images/              # Images
│   │   ├── fonts/               # Polices
│   │   └── icones/              # Icônes SVG
│   ├── components/               # Composants Twig + JSON
│   │   ├── button/
│   │   │   ├── button.twig      # Template du composant
│   │   │   └── button.json      # Configuration du composant
│   │   ├── card/
│   │   └── input/
│   ├── pages/                    # Pages Twig
│   │   └── index.twig           # Page showcase
│   └── data/                     # Données générées
│       └── showcase.json        # Liste des composants/pages (auto-généré)
├── public/                       # Sortie compilée
├── tasks/                        # Tâches Gulp
│   ├── clean.js
│   ├── css.js
│   ├── html.js
│   ├── scripts.js
│   ├── assets.js
│   ├── showcase.js
│   └── watch.js
├── gulpfile.js
├── package.json
└── README.md
```

## ✨ Créer un nouveau composant

### 1. Créer le dossier du composant

```bash
mkdir -p dev/components/mon-composant
```

### 2. Créer le fichier JSON de configuration

**`dev/components/mon-composant/mon-composant.json`**

```json
{
  "name": "Mon Composant",
  "category": "Category",
  "description": "Description du composant",
  "variants": {
    "size": {
      "label": "Taille",
      "type": "select",
      "default": "medium",
      "options": ["small", "medium", "large"]
    },
    "color": {
      "label": "Couleur",
      "type": "select",
      "default": "blue",
      "options": ["blue", "red", "green"]
    },
    "disabled": {
      "label": "Désactivé",
      "type": "checkbox",
      "default": false
    }
  },
  "content": {
    "text": {
      "label": "Texte",
      "type": "text",
      "default": "Contenu par défaut"
    },
    "description": {
      "label": "Description",
      "type": "textarea",
      "default": "Description longue..."
    }
  }
}
```

### 3. Créer le template Twig

**`dev/components/mon-composant/mon-composant.twig`**

```twig
{# Mon Composant #}
{% set size = size|default('medium') %}
{% set color = color|default('blue') %}
{% set disabled = disabled|default(false) %}
{% set text = text|default('Default text') %}

<div class="mon-composant mon-composant--{{ size }} mon-composant--{{ color }}"
     {% if disabled %}aria-disabled="true"{% endif %}>
  {{ text }}
</div>
```

### 4. Créer les styles SCSS

**`dev/assets/scss/components/_mon-composant.scss`**

```scss
.mon-composant {
  padding: $spacing-md;
  border-radius: $radius-md;
  
  // Sizes
  &--small { font-size: $font-size-sm; }
  &--medium { font-size: $font-size-base; }
  &--large { font-size: $font-size-lg; }
  
  // Colors
  &--blue { background-color: $color-primary; }
  &--red { background-color: $color-danger; }
  &--green { background-color: $color-success; }
  
  // States
  &[aria-disabled="true"] {
    opacity: 0.5;
    pointer-events: none;
  }
}
```

### 5. Importer le style dans style.scss

**`dev/assets/scss/style.scss`**

```scss
// Ajouter cette ligne
@import 'components/mon-composant';
```

### 6. Le composant apparaîtra automatiquement

Sauvegardez vos fichiers et le composant apparaîtra automatiquement sur la page showcase avec tous ses contrôles !

## 🛠️ Tâches Gulp disponibles

### Tâches principales

- `gulp` - Build complet du projet
- `gulp dev` - Mode développement avec live reload
- `gulp clean` - Supprime le dossier `public/`

### Tâches individuelles

- `gulp make:css` - Compile SCSS → CSS
- `gulp make:html` - Compile Twig → HTML
- `gulp copy:js` - Copie les scripts JS
- `gulp copy:images` - Copie les images
- `gulp copy:fonts` - Copie les polices
- `gulp copy:icons` - Copie les icônes
- `gulp generate:showcase` - Génère le fichier showcase.json

### Voir toutes les tâches

```bash
gulp --tasks
```

## 📝 Configuration des composants (JSON)

### Types de contrôles disponibles

#### Select (liste déroulante)

```json
"variant": {
  "label": "Variante",
  "type": "select",
  "default": "primary",
  "options": ["primary", "secondary", "success"]
}
```

#### Checkbox (case à cocher)

```json
"disabled": {
  "label": "Désactivé",
  "type": "checkbox",
  "default": false
}
```

#### Text (champ texte)

```json
"title": {
  "label": "Titre",
  "type": "text",
  "default": "Mon titre"
}
```

#### Number (champ numérique)

```json
"count": {
  "label": "Nombre",
  "type": "number",
  "default": 5
}
```

#### Textarea (champ texte multi-ligne)

```json
"description": {
  "label": "Description",
  "type": "textarea",
  "default": "Description longue..."
}
```

## 🎨 Variables SCSS disponibles

Le projet inclut un système complet de design tokens :

### Couleurs
- `$color-primary`, `$color-success`, `$color-danger`, `$color-warning`, `$color-secondary`
- `$color-gray-50` à `$color-gray-900`

### Typographie
- `$font-size-xs` à `$font-size-4xl`
- `$font-weight-normal`, `medium`, `semibold`, `bold`

### Espacements
- `$spacing-xs` à `$spacing-3xl`

### Border radius
- `$radius-sm` à `$radius-2xl`, `$radius-full`

### Ombres
- `$shadow-sm`, `$shadow-md`, `$shadow-lg`, `$shadow-xl`

## 🔥 Fonctionnalités

✅ Showcase dynamique des composants
✅ Configuration JSON intuitive
✅ Prévisualisation en temps réel
✅ Contrôles interactifs pour chaque variante
✅ Génération automatique de code HTML/Twig
✅ Copie du code en un clic
✅ Live reload en développement
✅ Design System complet avec variables SCSS
✅ Système de grille responsive
✅ Composants pré-construits (Button, Card, Input)

## 📄 License

ISC
