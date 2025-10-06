import { task, series, parallel } from 'gulp';
import compileScss from './css.js';
import compileTwig from './html.js';
import { copyImages, copyFonts, copyIcons } from './assets.js';
import generateShowcaseData from './showcase.js';

// Build complet du projet
const buildProject = series(
  generateShowcaseData,
  parallel(compileScss, compileTwig, copyImages, copyFonts, copyIcons)
);

// Export des tâches
task('build:project', buildProject);

export default buildProject;
