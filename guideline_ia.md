# Guidelines IA - Design System Starter Kit

Ce document contient toutes les informations nécessaires pour qu'une IA puisse créer des composants et des pages conformes aux standards de ce design system.

---

## 📋 Vue d'ensemble

Ce design system utilise **Twig** comme moteur de template, **SCSS** pour les styles, et **JSON** pour la configuration des variants. Le projet est compilé avec **Gulp**.

### Architecture du projet

```
dev/
├── components/           # Composants réutilisables
│   └── [nom]/
│       ├── [nom].twig   # Template Twig du composant
│       ├── [nom].json   # Configuration des variants
│       └── _[nom].scss  # Styles du composant
├── pages/               # Pages complètes
│   ├── [nom].twig      # Template Twig de la page
│   └── [nom].json      # Configuration des variants (optionnel)
├── assets/
│   └── scss/
│       ├── base/
│       │   ├── _variables.scss  # Design tokens
│       │   └── _mixins.scss     # Mixins réutilisables
│       ├── components/
│       │   └── _index.scss      # Auto-généré
│       └── showcase/
│           └── _showcase.scss
```

---

## 🎨 Design Tokens (Variables SCSS)

### Couleurs

```scss
// Couleurs principales
$color-primary: #3b82f6;
$color-primary-dark: #2563eb;
$color-primary-light: #60a5fa;

$color-success: #10b981;
$color-danger: #ef4444;
$color-warning: #f59e0b;
$color-secondary: #6b7280;

// Couleurs neutres
$color-white: #ffffff;
$color-black: #000000;
$color-gray-50 à $color-gray-900 (9 nuances)
```

### Typographie

```scss
$font-family-base: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
$font-family-mono: 'Monaco', 'Courier New', monospace;

// Tailles
$font-size-xs: 0.75rem;    // 12px
$font-size-sm: 0.875rem;   // 14px
$font-size-base: 1rem;     // 16px
$font-size-lg: 1.125rem;   // 18px
$font-size-xl: 1.25rem;    // 20px
$font-size-2xl: 1.5rem;    // 24px
$font-size-3xl: 1.875rem;  // 30px
$font-size-4xl: 2.25rem;   // 36px

// Poids
$font-weight-normal: 400;
$font-weight-medium: 500;
$font-weight-semibold: 600;
$font-weight-bold: 700;
```

### Espacements

```scss
$spacing-xs: 0.25rem;   // 4px
$spacing-sm: 0.5rem;    // 8px
$spacing-md: 1rem;      // 16px
$spacing-lg: 1.5rem;    // 24px
$spacing-xl: 2rem;      // 32px
$spacing-2xl: 3rem;     // 48px
$spacing-3xl: 4rem;     // 64px
```

### Border Radius

```scss
$radius-sm: 0.25rem;    // 4px
$radius-md: 0.375rem;   // 6px
$radius-lg: 0.5rem;     // 8px
$radius-xl: 0.75rem;    // 12px
$radius-2xl: 1rem;      // 16px
$radius-full: 9999px;
```

### Ombres

```scss
$shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
$shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
$shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
$shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
```

### Transitions

```scss
$transition-fast: 150ms ease-in-out;
$transition-base: 300ms ease-in-out;
$transition-slow: 500ms ease-in-out;
```

### Breakpoints

```scss
$breakpoint-sm: 640px;
$breakpoint-md: 768px;
$breakpoint-lg: 1024px;
$breakpoint-xl: 1280px;
$breakpoint-2xl: 1536px;
```

---

## 🛠️ Mixins disponibles

```scss
// Media queries
@include respond-to('sm') { ... }
@include respond-to('md') { ... }
@include respond-to('lg') { ... }

// Utilitaires
@include truncate;           // Texte tronqué avec ellipsis
@include visually-hidden;    // Masquer visuellement mais accessible
@include focus-visible;      // Style de focus accessible
@include button-reset;       // Reset des styles de bouton

// Flexbox
@include flex-center;        // display: flex + center
@include flex-between;       // display: flex + space-between
```

---

## 🧩 Créer un composant

### Structure requise

Pour créer un nouveau composant nommé `example`, créer dans `dev/components/example/` :

1. **`example.twig`** - Template du composant
2. **`example.json`** - Configuration des variants et contenu
3. **`_example.scss`** - Styles du composant (dans `dev/assets/scss/components/`)

### 1. Fichier JSON (`example.json`)

Le JSON définit les variants (options de style) et le contenu (textes, labels, etc.).

```json
{
  "name": "Example",
  "category": "Forms|Layout|Navigation",
  "description": "Description du composant",
  "variants": {
    "size": {
      "label": "Taille",
      "type": "select",
      "default": "normal",
      "options": ["small", "normal", "large"]
    },
    "variant": {
      "label": "Variante",
      "type": "select",
      "default": "primary",
      "options": ["primary", "secondary", "success", "danger"]
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
      "default": "Texte par défaut"
    }
  }
}
```

**Types de variants disponibles :**
- `select` : Liste déroulante (options multiples)
- `checkbox` : Case à cocher (true/false)
- `text` : Champ texte
- `textarea` : Champ texte multi-lignes
- `number` : Champ numérique

### 2. Fichier Twig (`example.twig`)

**Règles importantes :**
- Toujours définir les valeurs par défaut avec le filtre `|default()`
- Les variables correspondent aux clés du JSON
- Utiliser la convention BEM pour les classes CSS

```twig
{# Example Component #}
{% set size = size|default('normal') %}
{% set variant = variant|default('primary') %}
{% set disabled = disabled|default(false) %}
{% set text = text|default('Texte') %}

<div class="example example--{{ size }} example--{{ variant }}{% if disabled %} example--disabled{% endif %}">
  {{ text }}
</div>
```

**Structure des classes CSS (BEM) :**
- Bloc : `.example`
- Élément : `.example__element`
- Modificateur : `.example--modifier`

### 3. Fichier SCSS (`_example.scss`)

Créer dans `dev/assets/scss/components/_example.scss` :

```scss
// Example component
@use '../base/variables' as *;
@use '../base/mixins' as *;

.example {
  padding: $spacing-md;
  border-radius: $radius-md;
  transition: all $transition-fast;

  // Sizes
  &--small {
    padding: $spacing-sm;
    font-size: $font-size-sm;
  }

  &--normal {
    padding: $spacing-md;
    font-size: $font-size-base;
  }

  &--large {
    padding: $spacing-lg;
    font-size: $font-size-lg;
  }

  // Variants
  &--primary {
    background-color: $color-primary;
    color: $color-white;
  }

  &--secondary {
    background-color: $color-secondary;
    color: $color-white;
  }

  // States
  &--disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}
```

### Exemple complet : Button

**button.json :**
```json
{
  "name": "Button",
  "category": "Forms",
  "description": "Bouton interactif avec différentes variantes",
  "variants": {
    "size": {
      "label": "Taille",
      "type": "select",
      "default": "normal",
      "options": ["small", "normal", "large"]
    },
    "variant": {
      "label": "Variante",
      "type": "select",
      "default": "primary",
      "options": ["primary", "secondary", "success", "danger"]
    },
    "style": {
      "label": "Style",
      "type": "select",
      "default": "solid",
      "options": ["solid", "outline", "ghost"]
    },
    "disabled": {
      "label": "Désactivé",
      "type": "checkbox",
      "default": false
    }
  },
  "content": {
    "text": {
      "label": "Texte du bouton",
      "type": "text",
      "default": "Cliquez ici"
    }
  }
}
```

**button.twig :**
```twig
{# Button Component #}
{% set size = size|default('normal') %}
{% set variant = variant|default('primary') %}
{% set style = style|default('solid') %}
{% set disabled = disabled|default(false) %}
{% set text = text|default('Button') %}

<button
  class="btn btn--{{ size }} btn--{{ variant }}{% if style != 'solid' %} btn--{{ style }}{% endif %}"
  {% if disabled %}disabled{% endif %}
  type="button"
>
  {{ text }}
</button>
```

**_button.scss :**
```scss
@use '../base/variables' as *;

.btn {
  display: inline-flex;
  padding: $spacing-sm $spacing-md;
  border-radius: $radius-md;
  transition: all $transition-fast;

  &--small { padding: $spacing-xs $spacing-sm; }
  &--large { padding: $spacing-md $spacing-lg; }

  &--primary { background-color: $color-primary; color: $color-white; }
  &--secondary { background-color: $color-secondary; color: $color-white; }

  &--outline {
    background: transparent;
    border: 1px solid currentColor;
  }

  &:disabled { opacity: 0.5; cursor: not-allowed; }
}
```

---

## 📄 Créer une page

### Structure requise

Pour créer une page `example.html`, créer dans `dev/pages/` :

1. **`example.twig`** - Template de la page (REQUIS)
2. **`example.json`** - Configuration des variants (OPTIONNEL)
3. **`_example.scss`** - Styles spécifiques (OPTIONNEL, dans `dev/assets/scss/pages/`)

### 1. Fichier JSON pour page (`example.json`)

**Important :** Pour les pages, le JSON utilise une structure de **variants** différente des composants.

```json
{
  "name": "Example Page",
  "description": "Description de la page",
  "category": "Marketing|Documentation|Application",
  "variants": [
    {
      "id": "default",
      "name": "Défaut",
      "description": "Version par défaut",
      "data": {
        "theme": "light",
        "show_header": true,
        "show_footer": true
      }
    },
    {
      "id": "dark",
      "name": "Dark Mode",
      "description": "Version sombre",
      "data": {
        "theme": "dark",
        "show_header": true,
        "show_footer": false
      }
    }
  ]
}
```

**Structure :**
- `variants` est un **tableau d'objets** (pas un objet comme pour les composants)
- Chaque variant a un `id`, `name`, `description`, et `data`
- Le `data` contient les paramètres qui seront passés en URL (`?theme=dark&show_header=true`)

### 2. Fichier Twig pour page (`example.twig`)

**Règles importantes pour les pages :**
- Inclure le doctype HTML complet
- Définir les variables depuis les paramètres URL avec `|default()`
- Utiliser les variables pour afficher/masquer des sections
- Ajouter un script JS pour lire les paramètres URL

```twig
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Example Page - Design System</title>
  <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
  {% set theme = theme|default('light') %}
  {% set show_header = show_header|default(true) %}
  {% set show_footer = show_footer|default(true) %}

  <div class="page page--{{ theme }}">
    {% if show_header %}
    <header class="header">
      <h1>Header</h1>
    </header>
    {% endif %}

    <main class="main">
      <p>Contenu principal</p>
    </main>

    {% if show_footer %}
    <footer class="footer">
      <p>Footer</p>
    </footer>
    {% endif %}
  </div>

  <script>
    // Lire les paramètres URL et appliquer les variants
    const params = new URLSearchParams(window.location.search);

    // Exemple : masquer un élément selon un paramètre
    if (params.get('show_header') === 'false') {
      const header = document.querySelector('.header');
      if (header) header.style.display = 'none';
    }
  </script>
</body>
</html>
```

### Exemple complet : Landing Page

**landing.json :**
```json
{
  "name": "Landing Page",
  "description": "Page d'accueil avec hero et features",
  "category": "Marketing",
  "variants": [
    {
      "id": "default",
      "name": "Défaut",
      "data": {
        "hero_variant": "primary",
        "show_features": true,
        "show_cta": true
      }
    },
    {
      "id": "minimal",
      "name": "Minimal",
      "data": {
        "hero_variant": "minimal",
        "show_features": false,
        "show_cta": true
      }
    }
  ]
}
```

**landing.twig :**
```twig
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Landing Page</title>
  <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
  {% set hero_variant = hero_variant|default('primary') %}
  {% set show_features = show_features|default(true) %}
  {% set show_cta = show_cta|default(true) %}

  <section class="hero hero--{{ hero_variant }}">
    <h1>Titre Hero</h1>
    {% if show_cta %}
    <button class="btn btn--primary">CTA</button>
    {% endif %}
  </section>

  {% if show_features %}
  <section class="features">
    <h2>Features</h2>
  </section>
  {% endif %}

  <script>
    // Appliquer les variants depuis l'URL
    const params = new URLSearchParams(window.location.search);
    if (params.get('show_features') === 'false') {
      const features = document.querySelector('.features');
      if (features) features.style.display = 'none';
    }
  </script>
</body>
</html>
```

---

## ⚙️ Règles importantes du système

### 1. Convention de nommage BEM

**Structure des classes CSS :**
```scss
.block { }              // Bloc principal
.block__element { }     // Élément enfant
.block--modifier { }    // Variante/modificateur
```

**Exemple Button :**
```scss
.btn { }                // Bloc
.btn__icon { }          // Élément (si nécessaire)
.btn--large { }         // Modificateur de taille
.btn--primary { }       // Modificateur de couleur
.btn--outline { }       // Modificateur de style
```

### 2. Correspondance JSON ↔ CSS

**Pour les composants :**

Si le JSON contient :
```json
{
  "variants": {
    "size": {
      "type": "select",
      "options": ["small", "normal", "large"]
    }
  }
}
```

Le SCSS doit avoir :
```scss
.component--small { }
.component--normal { }
.component--large { }
```

### 3. Gestion des éléments conditionnels

**Pour les composants complexes (comme Input, Card, Navbar) :**

Certains variants contrôlent l'affichage/masquage d'éléments :

**Input :**
- `hasError` → Affiche `.input-group__error` et ajoute classe `.input-group--error`
- Le système showcase gère automatiquement l'affichage/masquage

**Card :**
- `hasHeader` → Affiche/masque `.card__header`
- `hasFooter` → Affiche/masque `.card__footer`

**Navbar :**
- `withSearch` → Affiche/masque l'élément avec `data-element="search"`
- `withButton` → Affiche/masque l'élément avec `data-element="button"`

**Important :** Pour que le système showcase fonctionne, utiliser les attributs `data-element` :
```twig
<div class="navbar__search" data-element="search">
  <!-- Contenu recherche -->
</div>
```

### 4. Structure HTML des composants complexes

**Input (structure wrapper) :**
```twig
<div class="input-group{% if hasError %} input-group--error{% endif %}">
  <label class="input-group__label">{{ label }}</label>
  <input class="input input--{{ size }}" type="{{ type }}" />
  {% if hasError %}
  <span class="input-group__error">{{ error }}</span>
  {% elseif helper %}
  <span class="input-group__helper">{{ helper }}</span>
  {% endif %}
</div>
```

**Card (avec sections conditionnelles) :**
```twig
<div class="card{% if variant != 'default' %} card--{{ variant }}{% endif %}">
  {% if hasHeader %}
  <div class="card__header">
    <h3 class="card__title">{{ title }}</h3>
  </div>
  {% endif %}

  <div class="card__body">{{ body }}</div>

  {% if hasFooter %}
  <div class="card__footer">Footer</div>
  {% endif %}
</div>
```

---

## ✅ Checklist de création

### Pour un composant :

- [ ] Créer le dossier `dev/components/[nom]/`
- [ ] Créer `[nom].json` avec variants et content
- [ ] Créer `[nom].twig` avec valeurs par défaut
- [ ] Créer `dev/assets/scss/components/_[nom].scss`
- [ ] Utiliser la convention BEM pour les classes
- [ ] Importer les variables : `@use '../base/variables' as *;`
- [ ] Importer les mixins si nécessaire : `@use '../base/mixins' as *;`
- [ ] Créer les classes pour chaque variant
- [ ] Tester dans le showcase

### Pour une page :

- [ ] Créer `dev/pages/[nom].twig` avec doctype HTML complet
- [ ] Créer `dev/pages/[nom].json` (optionnel, pour variants)
- [ ] Définir les variables avec `|default()`
- [ ] Ajouter le script JS pour les paramètres URL
- [ ] Créer les styles dans `dev/assets/scss/pages/_[nom].scss` (optionnel)
- [ ] Tester dans le showcase

---

## 📚 Exemples commentés

### Exemple 1 : Composant Badge simple

**badge.json :**
```json
{
  "name": "Badge",
  "category": "Display",
  "description": "Petit badge de statut ou catégorie",
  "variants": {
    "variant": {
      "label": "Variante",
      "type": "select",
      "default": "default",
      "options": ["default", "success", "warning", "danger"]
    },
    "size": {
      "label": "Taille",
      "type": "select",
      "default": "normal",
      "options": ["small", "normal", "large"]
    }
  },
  "content": {
    "text": {
      "label": "Texte",
      "type": "text",
      "default": "Badge"
    }
  }
}
```

**badge.twig :**
```twig
{# Badge Component #}
{% set variant = variant|default('default') %}
{% set size = size|default('normal') %}
{% set text = text|default('Badge') %}

<span class="badge badge--{{ variant }} badge--{{ size }}">
  {{ text }}
</span>
```

**_badge.scss :**
```scss
@use '../base/variables' as *;

.badge {
  display: inline-flex;
  align-items: center;
  padding: $spacing-xs $spacing-sm;
  border-radius: $radius-full;
  font-size: $font-size-sm;
  font-weight: $font-weight-medium;

  // Sizes
  &--small {
    padding: 2px $spacing-xs;
    font-size: $font-size-xs;
  }

  &--large {
    padding: $spacing-sm $spacing-md;
    font-size: $font-size-base;
  }

  // Variants
  &--default {
    background-color: $color-gray-100;
    color: $color-gray-700;
  }

  &--success {
    background-color: $color-success-light;
    color: $color-success-dark;
  }

  &--warning {
    background-color: $color-warning-light;
    color: $color-warning-dark;
  }

  &--danger {
    background-color: $color-danger-light;
    color: $color-danger-dark;
  }
}
```

---

## 🎯 Résumé des règles clés

1. **Toujours utiliser les design tokens** (variables SCSS) plutôt que des valeurs en dur
2. **Convention BEM stricte** : `.block`, `.block__element`, `.block--modifier`
3. **Valeurs par défaut obligatoires** dans Twig avec `|default()`
4. **Import SCSS** : Toujours `@use '../base/variables' as *;`
5. **Composants :** JSON avec `variants` et `content` (objets)
6. **Pages :** JSON avec `variants` (tableau d'objets avec `data`)
7. **Classes conditionnelles :** Utiliser `{% if condition %} class{% endif %}`
8. **Éléments conditionnels :** Marquer avec `data-element="nom"` pour le showcase
9. **Responsive :** Utiliser le mixin `@include respond-to('md')`
10. **Transitions :** Toujours utiliser les variables `$transition-fast|base|slow`

---

## 🚀 Commandes utiles

```bash
# Lancer le serveur de développement
npx gulp dev

# Compiler les assets
npx gulp build

# Nettoyer les fichiers compilés
npx gulp clean
```

---

**Ce document doit servir de prompt système complet pour toute IA créant des composants ou des pages dans ce design system.**
