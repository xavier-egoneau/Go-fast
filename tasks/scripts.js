import { src, dest, task } from 'gulp';
import plumber from 'gulp-plumber';

// Copie les scripts JS et JSON
function copyScripts() {
  return src('dev/assets/scripts/**/*.{js,json}')
    .pipe(plumber())
    .pipe(dest('public/assets/scripts'));
}

// Export des tâches
task('copy:js', copyScripts);

export default copyScripts;
