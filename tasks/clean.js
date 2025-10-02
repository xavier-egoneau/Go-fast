const { task } = require('gulp');
const del = require('del');

// Nettoie le dossier public
function cleanPublic() {
  return del(['public/**', '!public']);
}

// Export des tâches
task('clean', cleanPublic);

module.exports = cleanPublic;
