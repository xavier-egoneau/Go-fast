const { watch, series, parallel, task } = require('gulp');
const browserSync = require('browser-sync').create();

// Import des autres tâches
const compileScss = require('./css.js');
const compileTwig = require('./html.js');
const copyScripts = require('./scripts.js');
const { copyImages, copyFonts, copyIcons } = require('./assets.js');
const generateShowcaseData = require('./showcase.js');
const copyAppFiles = require('./app.js');

// Démarre le serveur BrowserSync
function serve(done) {
  browserSync.init({
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
  browserSync.reload();
  done();
}

// Surveille les fichiers et recompile
function watchFiles() {
  // SCSS (exclure _index.scss qui est généré automatiquement)
  watch(['dev/assets/scss/**/*.scss', '!dev/assets/scss/components/_index.scss'], series(compileScss, reload));

  // Twig (composants et pages)
  watch(['dev/pages/**/*.twig', 'dev/components/**/*.twig'],
    series(generateShowcaseData, compileTwig, reload));

  // JSON des composants
  watch('dev/components/**/*.json',
    series(generateShowcaseData, compileTwig, reload));

  // Fichiers de l'app (index.html, page-showcase.html)
  watch('dev/app/**/*.html', series(copyAppFiles, reload));

  // Scripts
  watch('dev/assets/scripts/**/*.js', series(copyScripts, reload));

  // Images
  watch('dev/assets/images/**/*', series(copyImages, reload));

  // Icones
  watch('dev/assets/icones/**/*', series(copyIcons, reload));
}

// Tâche de développement
const dev = series(
  generateShowcaseData,
  parallel(compileScss, compileTwig, copyScripts, copyImages, copyFonts, copyIcons),
  serve,
  watchFiles
);

// Export des tâches
task('serve', serve);
task('watch', watchFiles);
task('dev', dev);

module.exports = { serve, watchFiles, dev };