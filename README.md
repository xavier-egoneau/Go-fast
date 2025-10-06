# 🎨 Starter Kit Design System

Un starter kit moderne pour l'intégration HTML avec showcase de composants dynamique.

**Framework showcase permanent** + **Projet remplaçable** = Développement rapide et organisé.

---

## 📋 Table des matières

- [🎯 Qu'est-ce que c'est ?](#-quest-ce-que-cest-)
- [⚡ Installation](#-installation)
- [🚀 Utilisation](#-utilisation)
- [📁 Structure du projet](#-structure-du-projet)
- [🎨 Créer un composant](#-créer-un-composant)
- [📄 Créer une page](#-créer-une-page)
- [🛠️ Tâches disponibles](#️-tâches-disponibles)
- [🔄 Démarrer un nouveau projet](#-démarrer-un-nouveau-projet)
- [📦 Build et déploiement](#-build-et-déploiement)

---

## 🎯 Qu'est-ce que c'est ?

Un système complet pour créer des sites web avec :

- ✅ **Design System** avec composants réutilisables
- ✅ **Showcase interactif** pour visualiser et tester les composants
- ✅ **Templates Twig** pour générer le HTML
- ✅ **SCSS** pour les styles
- ✅ **Gulp** pour l'automatisation
- ✅ **Live reload** en développement

### Architecture en 2 parties

```
app/        → Framework showcase (permanent - ne pas toucher)
dev/        → Votre projet (remplaçable pour chaque nouveau projet)
```

---

## ⚡ Installation

### Prérequis

- Node.js v16+
- npm v8+

### Installation

```bash
# 1. Cloner le projet
git clone [url-du-repo]
cd starter-kit-design-system

# 2. Installer les dépendances
npm install

# 3. Lancer en développement
npm run dev
```

Le showcase s'ouvre sur `http://localhost:3000`

---

## 🚀 Utilisation

### Commandes principales

```bash
npm run dev              # Développement avec live reload (projet uniquement)
npm run build            # Build complet (app + projet)
npm run build:app        # Build app showcase uniquement
npm run build:project    # Build projet uniquement
npm run clean            # Nettoyer le dossier public/
```

### Workflow quotidien

1. **Développement** : `npm run dev` - Lance le serveur, surveille les modifications
2. **Création** : Ajoutez composants et pages dans `dev/`
3. **Prévisualisation** : Le showcase se met à jour automatiquement
4. **Build** : `npm run build` avant de déployer

---

## 📁 Structure du projet

```
starter-kit-design-system/
│
├── app/                          # ⚙️ Framework showcase (NE PAS MODIFIER)
│   ├── templates/                # Templates du showcase
│   │   ├── index.twig           # Page d'accueil showcase
│   │   └── page-showcase.twig   # Visualisation composants/pages
│   ├── scripts/                  # Scripts du showcase
│   │   ├── showcase.js          # Logique showcase
│   │   ├── page-showcase.js     # Visualisation interactive
│   │   └── quality-tests.js     # Tests qualité
│   └── styles/                   # Styles du showcase
│       └── showcase.scss        # Point d'entrée CSS showcase
│
├── dev/                          # 🎨 VOTRE PROJET (modifiable)
│   ├── components/               # Vos composants
│   │   ├── button/
│   │   │   ├── button.twig      # Template
│   │   │   ├── button.json      # Configuration
│   │   │   └── button.md        # Documentation (optionnel)
│   │   ├── card/
│   │   └── input/
│   │
│   ├── pages/                    # Vos pages
│   │   ├── landing.twig
│   │   ├── landing.json
│   │   └── portfolio.twig
│   │
│   ├── assets/
│   │   ├── scss/
│   │   │   ├── base/            # Reset, typography
│   │   │   ├── components/      # Styles des composants
│   │   │   ├── layout/          # Grid, container
│   │   │   ├── pages/           # Styles des pages
│   │   │   └── style.scss       # Point d'entrée CSS projet
│   │   ├── images/
│   │   ├── fonts/
│   │   └── icones/
│   │
│   └── data/                     # Données générées
│       └── showcase.json        # Auto-généré
│
├── public/                       # 📦 Sortie compilée
├── tasks/                        # ⚙️ Tâches Gulp
└── gulpfile.js
```

### Séparation App / Projet

| Dossier | Rôle | Fréquence de modification |
|---------|------|--------------------------|
| **app/** | Framework showcase permanent | Une fois (ou lors de mises à jour) |
| **dev/** | Votre projet actuel | Quotidienne |

---

## 🎨 Créer un composant

### 1. Créer le dossier

```bash
mkdir -p dev/components/alert
```

### 2. Créer le fichier JSON

**`dev/components/alert/alert.json`**

```json
{
  "name": "Alert",
  "category": "Feedback",
  "description": "Boîte d'alerte pour messages importants",
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
      "default": "Ceci est un message important."
    }
  }
}
```

### 3. Créer le template Twig

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

### 4. Créer les styles SCSS

**`dev/assets/scss/components/_alert.scss`**

```scss
@use '../base/variables' as *;

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

  &--warning {
    background: rgba($color-warning, 0.1);
    border-color: $color-warning;
  }

  &--error {
    background: rgba($color-danger, 0.1);
    border-color: $color-danger;
  }

  &__message {
    margin: 0;
  }

  &__close {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1.5rem;
  }
}
```

### 5. Le composant apparaît automatiquement !

Sauvegardez → Votre composant est maintenant visible dans le showcase avec tous ses contrôles.

---

## 📄 Créer une page

### 1. Créer le template

**`dev/pages/about.twig`**

```twig
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>À propos</title>
  <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
  <div class="container">
    <h1>À propos</h1>

    {# Utiliser un composant #}
    {% include 'components/card/card.twig' with {
      title: 'Notre équipe',
      content: 'Nous sommes une équipe passionnée...'
    } %}
  </div>
</body>
</html>
```

### 2. (Optionnel) Créer les données JSON

**`dev/pages/about.json`**

```json
{
  "name": "À propos",
  "category": "pages",
  "description": "Page de présentation de l'équipe"
}
```

### 3. Créer les styles de page

**`dev/assets/scss/pages/_about.scss`**

```scss
.about {
  padding: 2rem 0;

  &__title {
    font-size: 2.5rem;
    margin-bottom: 2rem;
  }
}
```

### 4. Importer dans style.scss

**`dev/assets/scss/style.scss`**

```scss
// Pages du projet
@use 'pages/about';
```

La page est compilée dans `public/about.html`

---

## 🛠️ Tâches disponibles

### Builds

| Commande | Description |
|----------|-------------|
| `npm run build` | Build complet (app + projet) |
| `npm run build:app` | Build app showcase uniquement |
| `npm run build:project` | Build projet uniquement |

### Développement

| Commande | Description |
|----------|-------------|
| `npm run dev` | Mode développement (watch projet uniquement) |
| `npm run clean` | Nettoyer le dossier public/ |

### Gulp (pour plus de contrôle)

```bash
gulp --tasks                    # Lister toutes les tâches
gulp make:css                   # Compiler SCSS → CSS
gulp make:html                  # Compiler Twig → HTML
gulp generate:showcase          # Générer showcase.json
gulp copy:images                # Copier images
gulp copy:fonts                 # Copier fonts
gulp copy:icons                 # Copier icônes
```

---

## 🔄 Démarrer un nouveau projet

Quand vous voulez commencer un nouveau projet :

### Option 1 : Nettoyer manuellement

```bash
# Supprimer les composants exemples
rm -rf dev/components/*

# Supprimer les pages exemples
rm -rf dev/pages/*

# Garder uniquement la structure de base
```

### Option 2 : Archive propre

1. Créer une archive du projet vierge
2. Extraire l'archive pour chaque nouveau projet
3. Le dossier `app/` reste intact (showcase)

### Structure minimale à garder

```
dev/
├── components/       # Vide (ou vos composants de base)
├── pages/           # Vide
└── assets/
    └── scss/
        ├── base/    # Variables, mixins (à adapter)
        └── style.scss
```

---

## 📦 Build et déploiement

### Build de production

```bash
npm run build
```

Compile tout dans `public/` :

```
public/
├── assets/
│   ├── css/
│   │   ├── showcase.css      # CSS du showcase
│   │   └── style.css         # CSS du projet
│   └── scripts/
│       └── ...
├── index.html                 # Page showcase
├── page-showcase.html        # Visualisation
├── landing.html              # Vos pages
└── portfolio.html
```

### Déploiement

1. **Build** : `npm run build`
2. **Déployer** : Uploader le dossier `public/` sur votre serveur
3. Le site est accessible !

### Déployer sans le showcase (projet uniquement)

Si vous ne voulez pas déployer le showcase :

1. `npm run build:project`
2. Supprimer `public/index.html` et `public/page-showcase.html`
3. Déployer `public/`

---

## 🎓 Configuration JSON des composants

### Types de contrôles disponibles

| Type | Description | Exemple |
|------|-------------|---------|
| `select` | Liste déroulante | `"options": ["small", "medium", "large"]` |
| `checkbox` | Case à cocher | `"default": false` |
| `text` | Champ texte | `"default": "Mon texte"` |
| `textarea` | Zone de texte | `"default": "Long texte..."` |
| `number` | Champ numérique | `"default": 5` |

### Structure JSON complète

```json
{
  "name": "Nom du composant",
  "category": "Catégorie",
  "description": "Description courte",
  "variants": {
    "nomVariante": {
      "label": "Label affiché",
      "type": "select|checkbox|text|textarea|number",
      "default": "valeur par défaut",
      "options": ["opt1", "opt2"]  // Pour select uniquement
    }
  },
  "content": {
    "nomContenu": {
      "label": "Label affiché",
      "type": "text|textarea|number",
      "default": "valeur par défaut"
    }
  }
}
```

---

## 🏆 Fonctionnalités

✅ Showcase interactif des composants
✅ Configuration JSON intuitive
✅ Prévisualisation temps réel
✅ Contrôles interactifs
✅ Génération code HTML/Twig
✅ Copie du code en un clic
✅ Live reload en développement
✅ Design System avec variables SCSS
✅ Système de grille responsive
✅ Composants pré-construits (Button, Card, Input, Badge, Modal)
✅ Builds séparés (app / projet)
✅ Tests qualité W3C & RGAA intégrés

---

## 💡 Conseils et bonnes pratiques

### Conventions de nommage

- **Classes CSS** : BEM (`component__element--modifier`)
- **Fichiers** : kebab-case (`mon-composant.twig`)
- **Variables Twig** : snake_case (`ma_variable`)

### Architecture des composants

- Toujours définir des valeurs par défaut dans Twig
- Utiliser les variables du design system (dans `dev/assets/scss/base/`)
- Rendre les composants accessibles (ARIA, sémantique)
- Un composant = 1 responsabilité

### Utiliser les composants dans les pages

```twig
{# Méthode 1 : Include simple #}
{% include 'components/button/button.twig' %}

{# Méthode 2 : Avec variables #}
{% include 'components/button/button.twig' with {
  text: 'Mon bouton',
  variant: 'primary',
  size: 'large'
} %}
```

---

## 📞 Support

Pour toute question, consultez cette documentation ou examinez les composants existants dans `dev/components/`.

---

## 📄 License

ISC

---

**Fait avec ❤️ pour simplifier l'intégration HTML**
