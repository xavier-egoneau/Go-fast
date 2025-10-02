#!/usr/bin/env node

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

console.log('\n' + colors.cyan + colors.bright);
console.log('╔═══════════════════════════════════════════════════════╗');
console.log('║                                                       ║');
console.log('║     🎨 Starter Kit Design System v1.0.0              ║');
console.log('║                                                       ║');
console.log('║     Installation terminée avec succès !              ║');
console.log('║                                                       ║');
console.log('╚═══════════════════════════════════════════════════════╝');
console.log(colors.reset + '\n');

console.log(colors.bright + '🚀 Démarrage rapide:' + colors.reset);
console.log('  ' + colors.green + 'npm run dev' + colors.reset + '  →  Lancer le projet en mode développement\n');

console.log(colors.bright + '📚 Documentation:' + colors.reset);
console.log('  • QUICKSTART.md  - Guide de démarrage');
console.log('  • README.md      - Documentation complète');
console.log('  • EXAMPLES.md    - Exemples de composants\n');

console.log(colors.bright + '✨ Composants inclus:' + colors.reset);
console.log('  Button, Card, Input\n');

console.log(colors.cyan + '→ Lancez "npm run dev" pour commencer !' + colors.reset + '\n');
