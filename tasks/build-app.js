import { src, dest, task, parallel } from 'gulp';
import * as sassCompiler from 'sass';
import gulpSass from 'gulp-sass';
const sass = gulpSass(sassCompiler);
import sourcemaps from 'gulp-sourcemaps';
import plumber from 'gulp-plumber';
import twig from 'gulp-twig';
import beautify from 'gulp-jsbeautifier';

// Compile le CSS du showcase
function compileShowcaseCSS() {
  return src('app/styles/showcase.scss')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass.sync({
      outputStyle: 'expanded',
      silenceDeprecations: ['legacy-js-api']
    }).on('error', sass.logError))
    .pipe(sourcemaps.write('.'))
    .pipe(dest('public/assets/css'));
}

// Copie les scripts du showcase
function copyShowcaseScripts() {
  return src('app/scripts/**/*.{js,json}')
    .pipe(plumber())
    .pipe(dest('public/assets/scripts'));
}

// Compile les templates du showcase
function compileShowcaseTemplates() {
  return src('app/templates/**/*.twig')
    .pipe(plumber())
    .pipe(twig({
      data: {}
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

// Build complet de l'app showcase
const buildApp = parallel(
  compileShowcaseCSS,
  copyShowcaseScripts,
  compileShowcaseTemplates
);

// Export des tâches
task('build:app:css', compileShowcaseCSS);
task('build:app:scripts', copyShowcaseScripts);
task('build:app:templates', compileShowcaseTemplates);
task('build:app', buildApp);

export default buildApp;
export { compileShowcaseCSS, copyShowcaseScripts, compileShowcaseTemplates };
