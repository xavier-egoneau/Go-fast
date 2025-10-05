# 🤖 Prompts & Instructions IA

Ce fichier contient des instructions détaillées pour guider l'IA dans les tâches courantes du projet.

---

## 📦 Créer un nouveau composant

### Prompt à utiliser :
```
Crée un composant [NOM_DU_COMPOSANT] pour le design system
```

### Checklist complète (5 étapes obligatoires) :

#### ✅ Étape 1 : Analyser les composants existants
- [ ] Lister les fichiers d'un composant existant similaire
- [ ] Identifier le pattern : `.twig`, `.scss`, `.json`
- [ ] Noter la structure du JSON (variants, content)

#### ✅ Étape 2 : Créer la structure de fichiers
- [ ] Créer le dossier `dev/components/[nom-composant]/`
- [ ] Créer `[nom-composant].twig`
- [ ] Créer `[nom-composant].json` ⚠️ **NE PAS OUBLIER**
- [ ] Créer `dev/assets/scss/components/_[nom-composant].scss`

#### ✅ Étape 3 : Fichier JSON (obligatoire pour le showcase)
```json
{
  "name": "NomComposant",
  "category": "CategoryName",  // Forms, UI Elements, Feedback, Display, Layout
  "description": "Description courte du composant",
  "variants": {
    "nomVariante": {
      "label": "Label affiché",
      "type": "select|checkbox|text|textarea|number",
      "default": "valeur_par_defaut",
      "options": ["option1", "option2"]  // Pour type: select uniquement
    }
  },
  "content": {
    "nomChamp": {
      "label": "Label du champ",
      "type": "text|textarea",
      "default": "Valeur par défaut"
    }
  }
}
```

#### ✅ Étape 4 : Fichier Twig
- [ ] Définir les valeurs par défaut avec `|default()`
- [ ] Utiliser la convention de nommage BEM pour les classes
- [ ] Structure : `composant composant--variant composant__element`

#### ✅ Étape 5 : Fichier SCSS + Import
- [ ] Créer les styles avec variables du design system (`$color-*`, `$spacing-*`, etc.)
- [ ] Utiliser BEM pour la structure CSS
- [ ] **Importer dans `dev/assets/scss/components/_index.scss`** (ordre alphabétique)

### ⚠️ Vérification finale :
```bash
# Le composant doit avoir exactement 3 fichiers :
ls dev/components/[nom-composant]/
# Résultat attendu :
# - [nom-composant].twig
# - [nom-composant].json  ← CRITIQUE
# - ../../assets/scss/components/_[nom-composant].scss
```

---

## 🎨 Modifier un composant existant

### Prompt à utiliser :
```
Modifie le composant [NOM] pour ajouter [FONCTIONNALITÉ]
```

### Checklist :
- [ ] Lire le fichier `.json` pour comprendre les variants actuels
- [ ] Lire le fichier `.twig` pour la structure
- [ ] Lire le fichier `.scss` pour les styles
- [ ] Modifier les 3 fichiers de manière cohérente
- [ ] Mettre à jour le JSON si nouvelles options ajoutées
- [ ] Tester dans le showcase (`npm run dev`)

---

## 📄 Créer une nouvelle page

### Prompt à utiliser :
```
Crée une page [NOM_PAGE] dans le design system
```

### Checklist :
- [ ] Créer `dev/pages/[nom-page].twig`
- [ ] (Optionnel) Créer `dev/pages/[nom-page].json` pour métadonnées
- [ ] Utiliser `{% include 'components/xxx/xxx.twig' with {...} %}` pour inclure des composants
- [ ] La page sera automatiquement disponible sur `/[nom-page].html`

### Structure JSON page (optionnel) :
```json
{
  "name": "Nom de la page",
  "category": "pages",
  "description": "Description de la page"
}
```

---

## 🔄 Convertir le projet en ES Modules

### Checklist (si `"type": "module"` dans package.json) :
- [ ] Remplacer `const x = require('...')` par `import x from '...'`
- [ ] Remplacer `module.exports = x` par `export default x`
- [ ] Pour imports multiples : `import { a, b } from '...'`
- [ ] Ajouter `import { fileURLToPath } from 'url'` si `__dirname` utilisé
- [ ] Remplacer `import sass from 'sass'` par `import * as sass from 'sass'`
- [ ] Pour `del` : utiliser `import del from 'del'` (pas `deleteAsync`)

---

## 🎯 Variables du Design System disponibles

### Couleurs
```scss
$color-primary, $color-primary-dark, $color-primary-light
$color-success, $color-success-dark, $color-success-light
$color-danger, $color-danger-dark, $color-danger-light
$color-warning, $color-warning-dark, $color-warning-light
$color-secondary, $color-secondary-dark, $color-secondary-light
$color-gray-50 à $color-gray-900
```

### Espacements
```scss
$spacing-xs: 4px
$spacing-sm: 8px
$spacing-md: 16px
$spacing-lg: 24px
$spacing-xl: 32px
$spacing-2xl: 48px
$spacing-3xl: 64px
```

### Typographie
```scss
$font-size-xs à $font-size-4xl
$font-weight-normal, medium, semibold, bold
$line-height-tight, normal, relaxed
```

### Border Radius
```scss
$radius-sm: 4px
$radius-md: 6px
$radius-lg: 8px
$radius-xl: 12px
$radius-2xl: 16px
$radius-full: 9999px
```

### Ombres
```scss
$shadow-sm, $shadow-md, $shadow-lg, $shadow-xl
```

### Transitions
```scss
$transition-fast: 150ms
$transition-base: 300ms
$transition-slow: 500ms
```

---

## 📋 Catégories de composants

Utiliser ces catégories dans le fichier JSON :

- **Forms** : Inputs, Buttons, Select, Checkbox, Radio, Toggle, etc.
- **UI Elements** : Badge, Tag, Avatar, Chip, etc.
- **Feedback** : Alert, Toast, Modal, Notification, etc.
- **Display** : Card, Table, List, Accordion, etc.
- **Layout** : Container, Grid, Stack, Divider, etc.
- **Navigation** : Navbar, Breadcrumb, Tabs, Pagination, etc.

---

## 🚀 Commandes essentielles

```bash
npm run dev      # Développement avec hot-reload
npm run build    # Build de production
npm run clean    # Nettoyer le dossier public
```

---

## ✨ TodoList Pattern pour l'IA

Quand tu crées un composant, utilise TOUJOURS cette structure de todos :

```javascript
[
  { content: "Analyser les composants existants", status: "in_progress", activeForm: "Analysing..." },
  { content: "Créer le dossier et la structure", status: "pending", activeForm: "Creating..." },
  { content: "Créer le fichier .twig", status: "pending", activeForm: "Creating..." },
  { content: "Créer le fichier .json", status: "pending", activeForm: "Creating..." },  // ⚠️ CRUCIAL
  { content: "Créer le fichier .scss", status: "pending", activeForm: "Creating..." },
  { content: "Importer dans _index.scss", status: "pending", activeForm: "Importing..." },
  { content: "Vérifier dans le showcase", status: "pending", activeForm: "Verifying..." }
]
```

---

## 🔍 Debugging

### Le composant n'apparaît pas dans le showcase :
1. ✅ Vérifier que le fichier `.json` existe
2. ✅ Vérifier que les 3 fichiers ont le même nom de base
3. ✅ Relancer `npm run dev`
4. ✅ Vérifier `public/data/showcase.json`

### Les styles ne s'appliquent pas :
1. ✅ Vérifier l'import dans `dev/assets/scss/components/_index.scss`
2. ✅ Vérifier la syntaxe SCSS
3. ✅ Vérifier que les classes CSS correspondent au template Twig

### Erreur ES Module :
1. ✅ Vérifier que tous les `require` sont convertis en `import`
2. ✅ Vérifier que tous les `module.exports` sont en `export default`
3. ✅ Vérifier les extensions `.js` dans les imports

---

**Note importante** : Ce fichier est un guide pour l'IA. Suivre ces instructions garantit la cohérence et évite les oublis.
