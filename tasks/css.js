const { src, dest, task, series } = require('gulp');
const sassCompiler = require('sass');
const sass = require('gulp-sass')(sassCompiler);
const sourcemaps = require('gulp-sourcemaps');
const plumber = require('gulp-plumber');
const generateScssIndex = require('./generate-scss-index.js');

// Compile SCSS en CSS
function compileScss() {
  return src('dev/assets/scss/style.scss')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass.sync({
      outputStyle: 'expanded',
      silenceDeprecations: ['legacy-js-api']
    }).on('error', sass.logError))
    .pipe(sourcemaps.write('.'))
    .pipe(dest('public/assets/css'));
}

// Export des tâches
task('make:css', series(generateScssIndex, compileScss));

module.exports = series(generateScssIndex, compileScss);