import { task } from 'gulp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Génère automatiquement un fichier _index.scss pour les composants
function generateScssIndex(done) {
  const componentsDir = path.join(__dirname, '../dev/assets/scss/components');
  const indexFile = path.join(componentsDir, '_index.scss');

  // Lire tous les fichiers .scss du dossier components
  fs.readdir(componentsDir, (err, files) => {
    if (err) {
      console.error('Erreur lors de la lecture du dossier components:', err);
      return done(err);
    }

    // Filtrer uniquement les fichiers .scss (sauf _index.scss lui-même)
    const scssFiles = files
      .filter(file => file.endsWith('.scss') && file !== '_index.scss')
      .map(file => file.replace(/^_/, '').replace(/\.scss$/, '')) // Retirer _ et .scss
      .sort();

    // Générer le contenu du fichier _index.scss
    const content = [
      '// Fichier généré automatiquement - NE PAS MODIFIER',
      '// Pour ajouter un composant, créez un fichier .scss dans ce dossier',
      '',
      ...scssFiles.map(file => `@use '${file}';`)
    ].join('\n') + '\n';

    // Écrire le fichier _index.scss
    fs.writeFileSync(indexFile, content, 'utf8');
    console.log(`✓ _index.scss généré avec ${scssFiles.length} composant(s)`);

    done();
  });
}

// Export des tâches
task('generate:scss-index', generateScssIndex);

export default generateScssIndex;
