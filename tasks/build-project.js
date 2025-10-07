import { task, series, parallel } from 'gulp';
import compileScss, { compileTailwind } from './css.js';
import compileTwig from './html.js';
import { copyImages, copyFonts, copyIcons } from './assets.js';
import generateShowcaseData from './showcase.js';

// Build complet du projet (SCSS classique)
const buildProject = series(
  generateShowcaseData,
  parallel(compileScss, compileTwig, copyImages, copyFonts, copyIcons)
);

// Build projet avec Tailwind
const buildProjectTailwind = series(
  generateShowcaseData,
  parallel(compileTailwind, compileTwig, copyImages, copyFonts, copyIcons)
);

// Export des tâches
task('build:project', buildProject);
task('build:project:tailwind', buildProjectTailwind);

export default buildProject;
export { buildProjectTailwind };
