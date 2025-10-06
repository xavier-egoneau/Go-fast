// Starter Kit Design System Gulpfile

// ----------------------------------------------------------------------------
// Pour connaître l'ensemble des tâches disponibles :
//
// $ gulp --tasks
//
// ----------------------------------------------------------------------------

// Import des taches du repertoire tasks
import { task, parallel } from 'gulp';
import clean from './tasks/clean.js';
import buildApp from './tasks/build-app.js';
import buildProject from './tasks/build-project.js';
import { dev } from './tasks/watch.js';

// Tâche de build complète (app + projet)
const build = parallel(buildApp, buildProject);

// Tâche par défaut
task('default', build);

export default build;
