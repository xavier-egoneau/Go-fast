const { task } = require('gulp');
const del = require('del');

// Nettoie le dossier public en préservant le dossier data (généré par le système)
function cleanPublic() {
  return del([
    'public/**',
    '!public',
    '!public/data',
    '!public/data/**'
  ]);
}

// Export des tâches
task('clean', cleanPublic);

module.exports = cleanPublic;
