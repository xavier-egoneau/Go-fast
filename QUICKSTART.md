# 🚀 Guide de Démarrage Rapide

## Installation en 3 étapes

### 1️⃣ Installer les dépendances
```bash
npm install
```

### 2️⃣ Lancer le projet
```bash
npm run dev
```
Ou avec Gulp directement :
```bash
gulp dev
```

### 3️⃣ Ouvrir votre navigateur
Le projet s'ouvre automatiquement sur `http://localhost:3000`

---

## 📦 Ce qui est inclus

✅ **3 composants pré-construits** : Button, Card, Input
✅ **Page showcase interactive** avec contrôles en temps réel
✅ **Design System complet** avec variables SCSS
✅ **Live reload** automatique
✅ **Compilation Twig → HTML**
✅ **Compilation SCSS → CSS**

---

## 🎯 Créer votre premier composant

### 1. Créer le dossier
```bash
mkdir -p dev/components/alert
```

### 2. Créer le fichier JSON
Créez `dev/components/alert/alert.json` :
```json
{
  "name": "Alert",
  "category": "Feedback",
  "description": "Message d'alerte",
  "variants": {
    "type": {
      "label": "Type",
      "type": "select",
      "default": "info",
      "options": ["info", "success", "warning", "error"]
    }
  },
  "content": {
    "message": {
      "label": "Message",
      "type": "text",
      "default": "Ceci est une alerte"
    }
  }
}
```

### 3. Créer le template Twig
Créez `dev/components/alert/alert.twig` :
```twig
{% set type = type|default('info') %}
{% set message = message|default('Alert message') %}

<div class="alert alert--{{ type }}">
  {{ message }}
</div>
```

### 4. Créer le style SCSS
Créez `dev/assets/scss/components/_alert.scss` :
```scss
.alert {
  padding: $spacing-md;
  border-radius: $radius-md;
  
  &--info { background-color: $color-primary; color: white; }
  &--success { background-color: $color-success; color: white; }
  &--warning { background-color: $color-warning; color: white; }
  &--error { background-color: $color-danger; color: white; }
}
```

### 5. Importer le style
Dans `dev/assets/scss/style.scss`, ajoutez :
```scss
@import 'components/alert';
```

### 6. Voir le résultat !
Sauvegardez et votre composant apparaît automatiquement sur la page showcase ! 🎉

---

## 📝 Commandes utiles

```bash
# Mode développement avec live reload
npm run dev

# Build de production
npm run build

# Nettoyer le dossier public
npm run clean

# Voir toutes les tâches Gulp
gulp --tasks
```

---

## 🎨 Variables SCSS disponibles

### Couleurs
- `$color-primary`, `$color-success`, `$color-danger`, `$color-warning`
- `$color-gray-100` à `$color-gray-900`

### Espacements
- `$spacing-xs` (4px) à `$spacing-3xl` (64px)

### Typographie
- `$font-size-xs` (12px) à `$font-size-4xl` (36px)
- `$font-weight-normal` à `$font-weight-bold`

### Border Radius
- `$radius-sm` (4px) à `$radius-2xl` (16px)

### Ombres
- `$shadow-sm`, `$shadow-md`, `$shadow-lg`, `$shadow-xl`

---

## 🔧 Résolution des problèmes

### Le serveur ne démarre pas
```bash
# Vérifier que le port 3000 est libre
lsof -ti:3000 | xargs kill -9

# Relancer
npm run dev
```

### Les modifications ne s'affichent pas
- Vérifiez que `gulp dev` est en cours d'exécution
- Videz le cache du navigateur (Ctrl+Shift+R)

### Les composants n'apparaissent pas
- Vérifiez que les fichiers `.json` et `.twig` ont le même nom que le dossier
- Vérifiez la syntaxe JSON avec un validateur en ligne

---

## 📚 Documentation complète

Consultez le [README.md](./README.md) pour plus de détails !

---

**Bon développement ! 🚀**
