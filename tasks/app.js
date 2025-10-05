import { src, dest, task } from 'gulp';
import twig from 'gulp-twig';
import plumber from 'gulp-plumber';
import beautify from 'gulp-jsbeautifier';

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

export default compileAppFiles;
