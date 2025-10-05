import { src, dest, task, series } from 'gulp';
import * as sassCompiler from 'sass';
import gulpSass from 'gulp-sass';
const sass = gulpSass(sassCompiler);
import sourcemaps from 'gulp-sourcemaps';
import plumber from 'gulp-plumber';
import generateScssIndex from './generate-scss-index.js';

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

export default series(generateScssIndex, compileScss);