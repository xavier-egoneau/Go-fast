import { src, dest, task } from 'gulp';
import plumber from 'gulp-plumber';

// Copie les images
function copyImages() {
  return src('dev/assets/images/**/*')
    .pipe(plumber())
    .pipe(dest('public/assets/images'));
}

// Copie les fonts
function copyFonts() {
  return src('dev/assets/fonts/**/*')
    .pipe(plumber())
    .pipe(dest('public/assets/fonts'));
}

// Copie les icones
function copyIcons() {
  return src('dev/assets/icones/**/*')
    .pipe(plumber())
    .pipe(dest('public/assets/icones'));
}

// Export des tâches
task('copy:images', copyImages);
task('copy:fonts', copyFonts);
task('copy:icons', copyIcons);

export { copyImages, copyFonts, copyIcons };
export default { copyImages, copyFonts, copyIcons };
