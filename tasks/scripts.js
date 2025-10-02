const { src, dest, task } = require('gulp');
const plumber = require('gulp-plumber');

// Copie les scripts JS
function copyScripts() {
  return src('dev/assets/scripts/**/*.js')
    .pipe(plumber())
    .pipe(dest('public/assets/scripts'));
}

// Export des tâches
task('copy:js', copyScripts);

module.exports = copyScripts;
