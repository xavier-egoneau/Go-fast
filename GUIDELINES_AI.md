# Guidelines IA - Starter Kit Design System

Documentation complète pour l'IA afin de créer des composants et des pages conformes aux standards du projet.

---

## 🎯 Contexte du projet

### Philosophie

Ce starter kit permet de créer des sites web avec :
- **Design System modulaire** : Composants réutilisables
- **Showcase interactif** : Visualisation et test en temps réel
- **Architecture app/dev** : Framework permanent + Projet remplaçable

### Architecture

```
app/        → Framework showcase (PERMANENT - NE PAS MODIFIER)
dev/        → Projet utilisateur (MODIFIABLE - remplaçable)
```

---

## 📁 Structure des fichiers

### Composant (dans `dev/components/[nom]/`)

```
button/
├── button.twig      # Template Twig
├── button.json      # Configuration variants
└── button.md        # Documentation (optionnel)
```

SCSS séparé : `dev/assets/scss/components/_button.scss`

### Page (dans `dev/pages/`)

```
landing.twig         # Template Twig
landing.json         # Configuration variants (optionnel)
```

SCSS séparé : `dev/assets/scss/pages/_landing.scss` (optionnel)

---

## 🎨 Design Tokens

### Couleurs

```scss
$color-primary, $color-success, $color-danger, $color-warning, $color-secondary
$color-primary-dark, $color-primary-light (idem pour autres couleurs)
$color-white, $color-black
$color-gray-50 à $color-gray-900
```

### Typographie

```scss
// Tailles
$font-size-xs à $font-size-4xl

// Poids
$font-weight-normal, medium, semibold, bold
```

### Espacements

```scss
$spacing-xs à $spacing-3xl
```

### Border Radius

```scss
$radius-sm à $radius-2xl, $radius-full
```

### Ombres

```scss
$shadow-sm, md, lg, xl
```

### Transitions

```scss
$transition-fast, base, slow
```

### Breakpoints

```scss
$breakpoint-sm: 640px
$breakpoint-md: 768px
$breakpoint-lg: 1024px
$breakpoint-xl: 1280px
```

---

## 🧩 Créer un composant

### 1. Fichier JSON

**`dev/components/alert/alert.json`**

```json
{
  "name": "Alert",
  "category": "Feedback",
  "description": "Boîte d'alerte",
  "variants": {
    "type": {
      "label": "Type",
      "type": "select",
      "default": "info",
      "options": ["info", "success", "warning", "error"]
    },
    "dismissible": {
      "label": "Fermable",
      "type": "checkbox",
      "default": false
    }
  },
  "content": {
    "message": {
      "label": "Message",
      "type": "textarea",
      "default": "Message important"
    }
  }
}
```

**Types disponibles** : `select`, `checkbox`, `text`, `textarea`, `number`

### 2. Fichier Twig

**`dev/components/alert/alert.twig`**

```twig
{% set type = type|default('info') %}
{% set dismissible = dismissible|default(false) %}
{% set message = message|default('Message') %}

<div class="alert alert--{{ type }}">
  <p class="alert__message">{{ message }}</p>
  {% if dismissible %}
  <button class="alert__close" aria-label="Fermer">×</button>
  {% endif %}
</div>
```

**Règles** :
- ✅ Toujours `|default()` pour les variables
- ✅ Convention BEM : `.block`, `.block__element`, `.block--modifier`
- ✅ Variables = clés du JSON

### 3. Fichier SCSS

**`dev/assets/scss/components/_alert.scss`**

```scss
@use '../base/variables' as *;
@use '../base/mixins' as *;

.alert {
  padding: $spacing-md;
  border-radius: $radius-lg;
  border-left: 4px solid;

  &--info {
    background: rgba($color-primary, 0.1);
    border-color: $color-primary;
  }

  &--success {
    background: rgba($color-success, 0.1);
    border-color: $color-success;
  }

  &__message {
    margin: 0;
  }

  &__close {
    background: none;
    border: none;
    cursor: pointer;
  }
}
```

**Règles** :
- ✅ Toujours importer variables : `@use '../base/variables' as *;`
- ✅ Utiliser les design tokens (pas de valeurs en dur)
- ✅ Une classe par variant

---

## 📄 Créer une page

### 1. Fichier JSON (optionnel)

**`dev/pages/landing.json`**

```json
{
  "name": "Landing Page",
  "category": "Marketing",
  "description": "Page d'accueil"
}
```

### 2. Fichier Twig

**`dev/pages/landing.twig`**

```twig
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Landing Page</title>
  <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
  {% set hero_variant = hero_variant|default('primary') %}

  <section class="hero hero--{{ hero_variant }}">
    <h1>Titre Hero</h1>
    {% include 'components/button/button.twig' with {
      text: 'CTA',
      variant: 'primary',
      size: 'large'
    } %}
  </section>
</body>
</html>
```

**Règles** :
- ✅ Doctype HTML complet
- ✅ Link vers `assets/css/style.css`
- ✅ Utiliser `{% include %}` pour les composants

### 3. Fichier SCSS (optionnel)

**`dev/assets/scss/pages/_landing.scss`**

```scss
@use '../base/variables' as *;

.hero {
  padding: 4rem 0;
  text-align: center;

  &--primary {
    background: linear-gradient(135deg, $color-primary 0%, $color-primary-dark 100%);
    color: $color-white;
  }
}
```

**Importer dans** `dev/assets/scss/style.scss` :

```scss
@use 'pages/landing';
```

---

## 🎯 Conventions de nommage

### Classes CSS (BEM)

```scss
.block { }                // Bloc
.block__element { }       // Élément enfant
.block--modifier { }      // Variante
```

**Exemple** :

```scss
.btn { }                  // Bouton
.btn__icon { }            // Icône du bouton
.btn--large { }           // Taille
.btn--primary { }         // Couleur
```

### Fichiers

- **Composants** : `kebab-case` → `mon-composant.twig`
- **SCSS** : `_kebab-case` → `_mon-composant.scss`
- **Variables Twig** : `snake_case` → `ma_variable`

---

## 🛠️ Mixins disponibles

```scss
// Media queries
@include respond-to('sm') { ... }
@include respond-to('md') { ... }

// Utilitaires
@include truncate;           // Texte tronqué
@include visually-hidden;    // Masquer visuellement
@include focus-visible;      // Style de focus
@include button-reset;       // Reset bouton

// Flexbox
@include flex-center;        // Center
@include flex-between;       // Space-between
```

---

## ✅ Checklist création composant

- [ ] Créer `dev/components/[nom]/[nom].json`
- [ ] Créer `dev/components/[nom]/[nom].twig`
- [ ] Créer `dev/assets/scss/components/_[nom].scss`
- [ ] Importer dans le fichier parent si nécessaire
- [ ] Utiliser BEM pour classes CSS
- [ ] Importer variables : `@use '../base/variables' as *;`
- [ ] Valeurs par défaut Twig avec `|default()`
- [ ] Tester dans showcase

---

## ✅ Checklist création page

- [ ] Créer `dev/pages/[nom].twig`
- [ ] Créer `dev/pages/[nom].json` (optionnel)
- [ ] Doctype HTML complet
- [ ] Link CSS : `href="assets/css/style.css"`
- [ ] Utiliser `{% include %}` pour composants
- [ ] Créer `dev/assets/scss/pages/_[nom].scss` (optionnel)
- [ ] Importer dans `dev/assets/scss/style.scss`

---

## 🚫 Ce qu'il ne faut PAS faire

❌ **Modifier `app/`** → Framework showcase (permanent)
❌ **Valeurs en dur** → Utiliser les design tokens
❌ **Oublier `|default()`** → Toujours définir valeurs par défaut
❌ **Classes CSS non-BEM** → Respecter la convention
❌ **Ne pas importer variables** → Toujours `@use '../base/variables' as *;`
❌ **Créer SCSS dans dossier composant** → SCSS va dans `dev/assets/scss/components/`

---

## 💡 Bonnes pratiques

### Architecture des composants

✅ **1 responsabilité par composant**
✅ **Composants réutilisables** → Ne pas lier au contexte
✅ **Accessibilité** → ARIA, sémantique HTML
✅ **Responsive** → Utiliser mixins `@include respond-to()`

### Utiliser les composants dans pages

```twig
{# Include simple #}
{% include 'components/button/button.twig' %}

{# Avec variables #}
{% include 'components/button/button.twig' with {
  text: 'Mon bouton',
  variant: 'primary',
  size: 'large'
} %}
```

### Organisation SCSS

```scss
@use '../base/variables' as *;
@use '../base/mixins' as *;

.component {
  // Styles de base
  padding: $spacing-md;

  // Éléments
  &__element { }

  // Tailles
  &--small { }
  &--large { }

  // Variantes
  &--primary { }
  &--secondary { }

  // États
  &:hover { }
  &:disabled { }

  // Responsive
  @include respond-to('md') {
    // Styles tablette+
  }
}
```

---

## 🔧 Tâches Gulp

### Builds

```bash
npm run build              # Build complet (app + projet)
npm run build:app          # Build app showcase uniquement
npm run build:project      # Build projet uniquement
```

### Développement

```bash
npm run dev                # Watch projet (live reload)
npm run clean              # Nettoyer public/
```

### Détail des tâches

| Tâche | Rôle |
|-------|------|
| `generateShowcaseData` | Génère `showcase.json` (liste composants/pages) |
| `compileScss` | Compile SCSS → CSS projet |
| `compileShowcaseCSS` | Compile SCSS → CSS showcase |
| `compileTwig` | Compile Twig → HTML projet |
| `compileShowcaseTemplates` | Compile Twig → HTML showcase |
| `copyImages/Fonts/Icons` | Copie assets |
| `copyShowcaseScripts` | Copie scripts showcase |

---

## 📦 Exemples

### Composant Button complet

**button.json**

```json
{
  "name": "Button",
  "category": "Forms",
  "description": "Bouton interactif",
  "variants": {
    "size": {
      "label": "Taille",
      "type": "select",
      "default": "normal",
      "options": ["small", "normal", "large"]
    },
    "variant": {
      "label": "Couleur",
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
      "default": "Cliquez ici"
    }
  }
}
```

**button.twig**

```twig
{% set size = size|default('normal') %}
{% set variant = variant|default('primary') %}
{% set disabled = disabled|default(false) %}
{% set text = text|default('Button') %}

<button
  class="btn btn--{{ size }} btn--{{ variant }}"
  {% if disabled %}disabled{% endif %}
>
  {{ text }}
</button>
```

**_button.scss**

```scss
@use '../base/variables' as *;

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: $spacing-sm $spacing-md;
  border: none;
  border-radius: $radius-md;
  font-weight: $font-weight-medium;
  cursor: pointer;
  transition: all $transition-fast;

  // Sizes
  &--small {
    padding: $spacing-xs $spacing-sm;
    font-size: $font-size-sm;
  }

  &--large {
    padding: $spacing-md $spacing-lg;
    font-size: $font-size-lg;
  }

  // Variants
  &--primary {
    background-color: $color-primary;
    color: $color-white;

    &:hover {
      background-color: $color-primary-dark;
    }
  }

  &--secondary {
    background-color: $color-secondary;
    color: $color-white;
  }

  &--success {
    background-color: $color-success;
    color: $color-white;
  }

  &--danger {
    background-color: $color-danger;
    color: $color-white;
  }

  // States
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}
```

---

## 🎯 Résumé des règles clés

| Règle | Détail |
|-------|--------|
| **Design tokens** | Toujours utiliser variables SCSS |
| **BEM** | `.block__element--modifier` |
| **Defaults Twig** | `{% set var = var\|default('value') %}` |
| **Import SCSS** | `@use '../base/variables' as *;` |
| **Composant JSON** | `variants` + `content` (objets) |
| **Page JSON** | Optionnel, structure simple |
| **Responsive** | `@include respond-to('md')` |
| **Transitions** | `$transition-fast\|base\|slow` |
| **Accessibilité** | ARIA, sémantique HTML |
| **Architecture** | app/ = permanent, dev/ = projet |

---

## 🔍 Flux de travail

### Créer un composant

1. Créer dossier `dev/components/[nom]/`
2. Créer `[nom].json` (configuration)
3. Créer `[nom].twig` (template)
4. Créer `dev/assets/scss/components/_[nom].scss`
5. Sauvegarder → Apparaît dans showcase
6. Tester variants dans showcase

### Créer une page

1. Créer `dev/pages/[nom].twig`
2. Optionnel : Créer `[nom].json`
3. Optionnel : Créer `dev/assets/scss/pages/_[nom].scss`
4. Importer dans `style.scss` si nécessaire
5. Build → `public/[nom].html`

---

**Ce document contient toutes les informations nécessaires pour qu'une IA puisse créer des composants et pages conformes au design system.**
