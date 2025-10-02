const { src, dest, task } = require('gulp');
const twig = require('gulp-twig');
const plumber = require('gulp-plumber');
const beautify = require('gulp-jsbeautifier');

// Compiler les fichiers Twig de l'application showcase
function compileAppFiles() {
  return src('dev/app/**/*.twig')
    .pipe(plumber())
    .pipe(twig({
      data: {} // Pas de données spécifiques nécessaires pour les fichiers app
    }))
    .pipe(beautify({
      indent_size: 2,
      indent_char: ' ',
      max_preserve_newlines: 1,
      preserve_newlines: true,
      end_with_newline: true
    }))
    .pipe(dest('public'));
}

// Export des tâches
task('compileAppFiles', compileAppFiles);

module.exports = compileAppFiles;
