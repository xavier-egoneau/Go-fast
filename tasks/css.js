import { src, dest, task, series } from 'gulp';
import * as sassCompiler from 'sass';
import gulpSass from 'gulp-sass';
const sass = gulpSass(sassCompiler);
import sourcemaps from 'gulp-sourcemaps';
import plumber from 'gulp-plumber';
import postcss from 'gulp-postcss';
import tailwindcss from '@tailwindcss/postcss';
import autoprefixer from 'autoprefixer';
import generateScssIndex from './generate-scss-index.js';

// Compile SCSS en CSS (version classique)
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

// Compile Tailwind CSS (alternative)
// Tailwind v4 utilise directement PostCSS sans passer par Sass
function compileTailwind() {
  return src('dev/assets/scss/tailwind.css')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(postcss([
      tailwindcss(),
      autoprefixer()
    ]))
    .pipe(sourcemaps.write('.'))
    .pipe(dest('public/assets/css'));
}

// Export des tâches
task('make:css', series(generateScssIndex, compileScss));
task('make:css:tailwind', compileTailwind);

export default series(generateScssIndex, compileScss);
export { compileTailwind };