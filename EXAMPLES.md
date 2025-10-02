# 📚 Exemples de Composants

Ce fichier contient des exemples supplémentaires pour vous aider à créer de nouveaux composants.

---

## 🏷️ Badge Component

### Fichier JSON
**`dev/components/badge/badge.json`**
```json
{
  "name": "Badge",
  "category": "Display",
  "description": "Étiquette pour afficher un statut ou un nombre",
  "variants": {
    "variant": {
      "label": "Variante",
      "type": "select",
      "default": "primary",
      "options": ["primary", "secondary", "success", "danger", "warning"]
    },
    "size": {
      "label": "Taille",
      "type": "select",
      "default": "normal",
      "options": ["small", "normal", "large"]
    },
    "rounded": {
      "label": "Arrondi",
      "type": "checkbox",
      "default": false
    }
  },
  "content": {
    "text": {
      "label": "Texte",
      "type": "text",
      "default": "New"
    }
  }
}
```

### Template Twig
**`dev/components/badge/badge.twig`**
```twig
{% set variant = variant|default('primary') %}
{% set size = size|default('normal') %}
{% set rounded = rounded|default(false) %}
{% set text = text|default('Badge') %}

<span class="badge badge--{{ size }} badge--{{ variant }}{% if rounded %} badge--rounded{% endif %}">
  {{ text }}
</span>
```

### Styles SCSS
**`dev/assets/scss/components/_badge.scss`**
```scss
.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: $font-weight-semibold;
  border-radius: $radius-md;
  
  // Sizes
  &--small {
    padding: $spacing-xs $spacing-sm;
    font-size: $font-size-xs;
  }
  
  &--normal {
    padding: $spacing-xs $spacing-md;
    font-size: $font-size-sm;
  }
  
  &--large {
    padding: $spacing-sm $spacing-md;
    font-size: $font-size-base;
  }
  
  // Variants
  &--primary {
    background-color: $color-primary;
    color: $color-white;
  }
  
  &--secondary {
    background-color: $color-gray-200;
    color: $color-gray-700;
  }
  
  &--success {
    background-color: $color-success;
    color: $color-white;
  }
  
  &--danger {
    background-color: $color-danger;
    color: $color-white;
  }
  
  &--warning {
    background-color: $color-warning;
    color: $color-white;
  }
  
  // Rounded
  &--rounded {
    border-radius: $radius-full;
  }
}
```

N'oubliez pas d'ajouter l'import dans `style.scss` :
```scss
@import 'components/badge';
```

---

## 🔔 Alert Component

### Fichier JSON
**`dev/components/alert/alert.json`**
```json
{
  "name": "Alert",
  "category": "Feedback",
  "description": "Boîte d'alerte pour afficher des messages importants",
  "variants": {
    "type": {
      "label": "Type",
      "type": "select",
      "default": "info",
      "options": ["info", "success", "warning", "error"]
    },
    "dismissible": {
      "label": "Peut être fermé",
      "type": "checkbox",
      "default": false
    }
  },
  "content": {
    "title": {
      "label": "Titre",
      "type": "text",
      "default": "Information"
    },
    "message": {
      "label": "Message",
      "type": "textarea",
      "default": "Ceci est un message d'information important."
    }
  }
}
```

### Template Twig
**`dev/components/alert/alert.twig`**
```twig
{% set type = type|default('info') %}
{% set dismissible = dismissible|default(false) %}
{% set title = title|default('Alert') %}
{% set message = message|default('This is an alert message.') %}

<div class="alert alert--{{ type }}{% if dismissible %} alert--dismissible{% endif %}">
  <div class="alert__content">
    <h4 class="alert__title">{{ title }}</h4>
    <p class="alert__message">{{ message }}</p>
  </div>
  {% if dismissible %}
  <button class="alert__close" aria-label="Fermer">×</button>
  {% endif %}
</div>
```

### Styles SCSS
**`dev/assets/scss/components/_alert.scss`**
```scss
.alert {
  padding: $spacing-md;
  border-radius: $radius-lg;
  border-left: 4px solid transparent;
  display: flex;
  align-items: flex-start;
  gap: $spacing-md;
  
  &__content {
    flex: 1;
  }
  
  &__title {
    font-size: $font-size-base;
    font-weight: $font-weight-semibold;
    margin: 0 0 $spacing-xs 0;
  }
  
  &__message {
    font-size: $font-size-sm;
    margin: 0;
    opacity: 0.9;
  }
  
  &__close {
    @include button-reset;
    font-size: $font-size-2xl;
    line-height: 1;
    opacity: 0.5;
    transition: opacity $transition-fast;
    
    &:hover {
      opacity: 1;
    }
  }
  
  // Types
  &--info {
    background-color: rgba($color-primary, 0.1);
    border-left-color: $color-primary;
    color: $color-primary-dark;
  }
  
  &--success {
    background-color: rgba($color-success, 0.1);
    border-left-color: $color-success;
    color: $color-success-dark;
  }
  
  &--warning {
    background-color: rgba($color-warning, 0.1);
    border-left-color: $color-warning;
    color: $color-warning-dark;
  }
  
  &--error {
    background-color: rgba($color-danger, 0.1);
    border-left-color: $color-danger;
    color: $color-danger-dark;
  }
}
```

---

## 🔘 Toggle Switch

### Fichier JSON
**`dev/components/toggle/toggle.json`**
```json
{
  "name": "Toggle",
  "category": "Forms",
  "description": "Interrupteur on/off",
  "variants": {
    "size": {
      "label": "Taille",
      "type": "select",
      "default": "normal",
      "options": ["small", "normal", "large"]
    },
    "checked": {
      "label": "Activé",
      "type": "checkbox",
      "default": false
    },
    "disabled": {
      "label": "Désactivé",
      "type": "checkbox",
      "default": false
    }
  },
  "content": {
    "label": {
      "label": "Label",
      "type": "text",
      "default": "Activer les notifications"
    }
  }
}
```

### Template Twig
**`dev/components/toggle/toggle.twig`**
```twig
{% set size = size|default('normal') %}
{% set checked = checked|default(false) %}
{% set disabled = disabled|default(false) %}
{% set label = label|default('Toggle') %}

<label class="toggle toggle--{{ size }}">
  <input 
    type="checkbox" 
    class="toggle__input"
    {% if checked %}checked{% endif %}
    {% if disabled %}disabled{% endif %}
  />
  <span class="toggle__slider"></span>
  <span class="toggle__label">{{ label }}</span>
</label>
```

### Styles SCSS
**`dev/assets/scss/components/_toggle.scss`**
```scss
.toggle {
  display: inline-flex;
  align-items: center;
  gap: $spacing-md;
  cursor: pointer;
  
  &__input {
    @include visually-hidden;
    
    &:checked + .toggle__slider {
      background-color: $color-primary;
      
      &::before {
        transform: translateX(100%);
      }
    }
    
    &:disabled + .toggle__slider {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    &:focus-visible + .toggle__slider {
      @include focus-visible;
    }
  }
  
  &__slider {
    position: relative;
    display: inline-block;
    width: 44px;
    height: 24px;
    background-color: $color-gray-300;
    border-radius: $radius-full;
    transition: background-color $transition-base;
    
    &::before {
      content: '';
      position: absolute;
      top: 2px;
      left: 2px;
      width: 20px;
      height: 20px;
      background-color: $color-white;
      border-radius: $radius-full;
      transition: transform $transition-base;
    }
  }
  
  &__label {
    font-size: $font-size-base;
    color: $color-gray-700;
  }
  
  // Sizes
  &--small {
    .toggle__slider {
      width: 36px;
      height: 20px;
      
      &::before {
        width: 16px;
        height: 16px;
      }
    }
    
    .toggle__label {
      font-size: $font-size-sm;
    }
  }
  
  &--large {
    .toggle__slider {
      width: 52px;
      height: 28px;
      
      &::before {
        width: 24px;
        height: 24px;
      }
    }
    
    .toggle__label {
      font-size: $font-size-lg;
    }
  }
}
```

---

## 💡 Conseils pour créer vos composants

### Structure recommandée
1. **JSON** : Définir toutes les variantes et le contenu
2. **Twig** : Template minimaliste et réutilisable
3. **SCSS** : Styles modulaires avec BEM

### Conventions de nommage
- Classes CSS : BEM (`component__element--modifier`)
- Variables SCSS : kebab-case (`$color-primary`)
- Fichiers : kebab-case (`mon-composant.twig`)

### Bonnes pratiques
- Toujours définir des valeurs par défaut
- Utiliser les variables du design system
- Rendre les composants accessibles (ARIA)
- Tester sur différents navigateurs
- Documenter les cas d'usage

### Types de contrôles JSON disponibles
- `select` : Liste déroulante
- `checkbox` : Case à cocher
- `text` : Champ texte
- `textarea` : Zone de texte
- `number` : Champ numérique
- `color` : Sélecteur de couleur (à implémenter)

---

Bonne création ! 🎨
