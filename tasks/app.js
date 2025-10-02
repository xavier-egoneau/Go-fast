const { src, dest, task } = require('gulp');

// Copier les fichiers HTML de l'application showcase
function copyAppFiles() {
  return src('dev/app/**/*.html')
    .pipe(dest('public'));
}

// Export des tâches
task('copyAppFiles', copyAppFiles);

module.exports = copyAppFiles;
