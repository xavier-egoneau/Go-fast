import { src, dest, task, series } from 'gulp';
import twig from 'gulp-twig';
import plumber from 'gulp-plumber';
import beautify from 'gulp-jsbeautifier';
import fs from 'fs';
import path from 'path';
import compileAppFiles from './app.js';

// Fonction pour charger les données JSON des composants
function loadComponentsData() {
  const componentsDir = 'dev/components';
  const components = {};
  
  if (!fs.existsSync(componentsDir)) {
    return components;
  }
  
  const folders = fs.readdirSync(componentsDir);
  
  folders.forEach(folder => {
    const jsonPath = path.join(componentsDir, folder, `${folder}.json`);
    if (fs.existsSync(jsonPath)) {
      try {
        components[folder] = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
      } catch (e) {
        console.error(`Erreur lors du chargement de ${jsonPath}:`, e.message);
      }
    }
  });
  
  return components;
}

// Compile les pages Twig en HTML
function compilePages() {
  const componentsData = loadComponentsData();

  return src(['dev/pages/**/*.twig'])
    .pipe(plumber())
    .pipe(twig({
      data: {
        components: componentsData
      }
    }))
    .pipe(beautify({
      indent_size: 2,
      indent_char: ' ',
      max_preserve_newlines: 1,
      preserve_newlines: true,
      end_with_newline: true
    }))
    .pipe(dest('public/pages'));
}

// Compile les composants individuels en HTML
function compileComponents() {
  const componentsDir = 'dev/components';

  if (!fs.existsSync(componentsDir)) {
    return Promise.resolve();
  }

  return src('dev/components/**/*.twig')
    .pipe(plumber())
    .pipe(twig({
      data: {} // Les composants utilisent leurs propres données par défaut définies dans le Twig
    }))
    .pipe(beautify({
      indent_size: 2,
      indent_char: ' ',
      max_preserve_newlines: 1,
      preserve_newlines: true,
      end_with_newline: true
    }))
    .pipe(dest('public/components'));
}

// Compiler tout (pages + composants + app)
const compileAll = series(compileComponents, compilePages, compileAppFiles);

// Export des tâches
task('make:html', compileAll);
task('make:html:pages', compilePages);
task('make:html:components', compileComponents);

export default compileAll;