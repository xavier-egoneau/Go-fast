import { watch, series, parallel, task } from 'gulp';
import browserSync from 'browser-sync';
const bs = browserSync.create();

// Import des autres tâches
import compileScss, { compileTailwind } from './css.js';
import compileTwig from './html.js';
import { copyImages, copyFonts, copyIcons } from './assets.js';
import generateShowcaseData from './showcase.js';

// Démarre le serveur BrowserSync
function serve(done) {
  bs.init({
    server: {
      baseDir: ['./public', './'],  // Servir public ET la racine (pour accéder à dev/)
      routes: {
        '/dev': 'dev'  // Route /dev vers le dossier dev
      }
    },
    port: 3000,
    open: true,
    notify: false
  });
  done();
}

// Recharge le navigateur
function reload(done) {
  bs.reload();
  done();
}

// Surveille les fichiers et recompile (SCSS classique)
function watchFiles() {
  // SCSS (exclure _index.scss qui est généré automatiquement)
  watch(['dev/assets/scss/**/*.scss', '!dev/assets/scss/components/_index.scss'], series(compileScss, reload));

  // Twig (composants et pages)
  watch(['dev/pages/**/*.twig', 'dev/components/**/*.twig'],
    series(generateShowcaseData, compileTwig, reload));

  // JSON des composants
  watch('dev/components/**/*.json',
    series(generateShowcaseData, compileTwig, reload));

  // Images
  watch('dev/assets/images/**/*', series(copyImages, reload));

  // Icones
  watch('dev/assets/icones/**/*', series(copyIcons, reload));
}

// Surveille les fichiers et recompile (Tailwind)
function watchFilesTailwind() {
  // CSS Tailwind
  watch('dev/assets/scss/tailwind.css', series(compileTailwind, reload));

  // Twig (composants et pages) - Tailwind observe automatiquement via content config
  watch(['dev/pages/**/*.twig', 'dev/components/**/*.twig'],
    series(generateShowcaseData, compileTailwind, compileTwig, reload));

  // JSON des composants
  watch('dev/components/**/*.json',
    series(generateShowcaseData, compileTwig, reload));

  // Images
  watch('dev/assets/images/**/*', series(copyImages, reload));

  // Icones
  watch('dev/assets/icones/**/*', series(copyIcons, reload));
}

// Tâche de développement (projet uniquement)
const dev = series(
  generateShowcaseData,
  parallel(compileScss, compileTwig, copyImages, copyFonts, copyIcons),
  serve,
  watchFiles
);

// Tâche de développement avec Tailwind
const devTailwind = series(
  generateShowcaseData,
  parallel(compileTailwind, compileTwig, copyImages, copyFonts, copyIcons),
  serve,
  watchFilesTailwind
);

// Export des tâches
task('serve', serve);
task('watch', watchFiles);
task('watch:tailwind', watchFilesTailwind);
task('dev', dev);
task('dev:tailwind', devTailwind);

export { serve, watchFiles, watchFilesTailwind, dev, devTailwind };
export default { serve, watchFiles, watchFilesTailwind, dev, devTailwind };