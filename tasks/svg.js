import { src, dest, task } from 'gulp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Traite les SVG unitaires pour :
 * - Remplacer fill="#..." par fill="currentColor"
 * - Optimiser les SVG
 * - Générer un sprite SVG
 * - Générer une page de documentation HTML
 */

// Configuration
const config = {
  source: 'dev/assets/icones/unitaires/**/*.svg',
  dest: 'dev/assets/icones',
  publicDest: 'public/assets/icones',
  spriteName: 'sprite.svg',
  docName: 'doc.html'
};

/**
 * Nettoie et optimise un SVG
 * - Remplace fill="#..." par fill="currentColor"
 * - Supprime les attributs inutiles
 */
function cleanSVG(content, filename) {
  let cleaned = content;

  // Supprimer les commentaires XML
  cleaned = cleaned.replace(/<!--[\s\S]*?-->/g, '');

  // Supprimer les déclarations XML et DOCTYPE
  cleaned = cleaned.replace(/<\?xml[^>]*\?>/g, '');
  cleaned = cleaned.replace(/<!DOCTYPE[^>]*>/g, '');

  // Remplacer fill="#..." ou fill="rgb(...)" par fill="currentColor"
  // Sauf fill="none" qu'on garde
  cleaned = cleaned.replace(/fill="(?!none"|currentColor")[^"]*"/g, 'fill="currentColor"');

  // Remplacer stroke="#..." par stroke="currentColor" (optionnel)
  cleaned = cleaned.replace(/stroke="(?!none"|currentColor")[^"]*"/g, 'stroke="currentColor"');

  // Supprimer les attributs inutiles
  cleaned = cleaned.replace(/\s*(xmlns:.*?="[^"]*")/g, '');
  cleaned = cleaned.replace(/\s*xml:space="preserve"/g, '');

  // Nettoyer les espaces multiples
  cleaned = cleaned.replace(/\s+/g, ' ');
  cleaned = cleaned.trim();

  return cleaned;
}

/**
 * Extrait le viewBox d'un SVG
 */
function extractViewBox(content) {
  const match = content.match(/viewBox=["']([^"']+)["']/);
  return match ? match[1] : '0 0 24 24';
}

/**
 * Extrait le contenu interne d'un SVG (sans la balise <svg>)
 */
function extractSVGContent(content) {
  const match = content.match(/<svg[^>]*>([\s\S]*)<\/svg>/);
  let innerContent = match ? match[1].trim() : '';

  // Ajouter fill="currentColor" aux éléments qui n'ont pas d'attribut fill
  innerContent = innerContent.replace(/<(path|circle|rect|polygon|ellipse|line|polyline)(?![^>]*fill=)/g, '<$1 fill="currentColor"');

  return innerContent;
}

/**
 * Génère le sprite SVG
 */
function generateSprite(icons) {
  let sprite = `<svg xmlns="http://www.w3.org/2000/svg" style="display: none;">\n`;

  icons.forEach(icon => {
    sprite += `  <symbol id="${icon.id}" viewBox="${icon.viewBox}">\n`;
    sprite += `    ${icon.content}\n`;
    sprite += `  </symbol>\n`;
  });

  sprite += `</svg>`;

  return sprite;
}

/**
 * Génère la page de documentation HTML
 */
function generateDoc(icons) {
  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Documentation Icônes - Design System</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      padding: 2rem;
      background: #f7fafc;
    }

    .header {
      max-width: 1200px;
      margin: 0 auto 3rem;
    }

    h1 {
      font-size: 2.5rem;
      color: #1a202c;
      margin-bottom: 0.5rem;
    }

    .subtitle {
      color: #718096;
      font-size: 1.125rem;
    }

    .stats {
      display: flex;
      gap: 2rem;
      margin-top: 1.5rem;
    }

    .stat {
      background: white;
      padding: 1rem 1.5rem;
      border-radius: 0.5rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    .stat-value {
      font-size: 2rem;
      font-weight: bold;
      color: #667eea;
    }

    .stat-label {
      font-size: 0.875rem;
      color: #718096;
      margin-top: 0.25rem;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 1.5rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .icon-card {
      background: white;
      padding: 2rem;
      border-radius: 0.75rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      transition: all 0.2s;
      text-align: center;
      cursor: pointer;
      position: relative;
    }

    .icon-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 6px rgba(0,0,0,0.15);
    }

    .icon-card:active {
      transform: translateY(0);
    }

    .icon-container {
      width: 64px;
      height: 64px;
      margin: 0 auto 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .icon {
      width: 48px;
      height: 48px;
      color: #667eea;
      transition: color 0.2s;
    }

    .icon-card:hover .icon {
      color: #5568d3;
    }

    .icon-name {
      font-weight: 600;
      color: #1a202c;
      font-size: 0.875rem;
      margin-bottom: 0.5rem;
      word-break: break-word;
    }

    .icon-id {
      font-family: 'Courier New', monospace;
      font-size: 0.75rem;
      color: #a0aec0;
      background: #f7fafc;
      padding: 0.25rem 0.5rem;
      border-radius: 0.25rem;
      display: inline-block;
    }

    .copy-notification {
      position: fixed;
      top: 2rem;
      right: 2rem;
      background: #48bb78;
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 0.5rem;
      box-shadow: 0 4px 6px rgba(0,0,0,0.15);
      opacity: 0;
      transform: translateY(-1rem);
      transition: all 0.3s;
      pointer-events: none;
      z-index: 1000;
    }

    .copy-notification.show {
      opacity: 1;
      transform: translateY(0);
    }

    .usage {
      max-width: 1200px;
      margin: 3rem auto;
      background: white;
      padding: 2rem;
      border-radius: 0.75rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    .usage h2 {
      color: #1a202c;
      margin-bottom: 1rem;
      font-size: 1.5rem;
    }

    .usage-code {
      background: #1a202c;
      color: #e2e8f0;
      padding: 1.5rem;
      border-radius: 0.5rem;
      overflow-x: auto;
      margin-top: 1rem;
      font-family: 'Courier New', monospace;
      font-size: 0.875rem;
      line-height: 1.8;
      white-space: pre-wrap;
    }

    .usage-code .comment {
      color: #718096;
    }

    .usage-code .tag {
      color: #fc8181;
    }

    .usage-code .attr {
      color: #63b3ed;
    }

    .usage-code .string {
      color: #68d391;
    }

    .toggle-button {
      background: #667eea;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 0.5rem;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }

    .toggle-button:hover {
      background: #5568d3;
    }

    .toggle-button:active {
      transform: scale(0.98);
    }

    .toggle-icon {
      transition: transform 0.3s;
      display: inline-block;
    }

    .toggle-icon.open {
      transform: rotate(180deg);
    }

    .collapsible-content {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.3s ease-out;
    }

    .collapsible-content.open {
      max-height: 3000px;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>📦 Icônes du Design System</h1>
    <p class="subtitle">Sprite SVG généré automatiquement</p>
    <div class="stats">
      <div class="stat">
        <div class="stat-value">${icons.length}</div>
        <div class="stat-label">Icônes disponibles</div>
      </div>
      <div class="stat">
        <div class="stat-value">SVG</div>
        <div class="stat-label">Format sprite</div>
      </div>
    </div>
  </div>

  <div class="usage">
    <h2>💡 Comment utiliser</h2>
    <p style="color: #718096; margin-bottom: 1rem;">Cliquez sur une icône pour copier le code d'utilisation dans votre presse-papier.</p>

    <button class="toggle-button" onclick="toggleExamples()">
      <span id="toggle-text">Voir les exemples d'intégration</span>
      <span class="toggle-icon" id="toggle-icon">▼</span>
    </button>

    <div class="collapsible-content" id="examples">
      <div class="usage-code">
<span class="comment">&lt;!-- 1. Inclure le sprite dans votre page (une seule fois) --&gt;</span>
&lt;<span class="tag">svg</span>
  <span class="attr">style</span>=<span class="string">"display: none;"</span>
  <span class="attr">aria-hidden</span>=<span class="string">"true"</span>&gt;
  &lt;<span class="tag">use</span> <span class="attr">href</span>=<span class="string">"assets/icones/sprite.svg"</span>&gt;&lt;/<span class="tag">use</span>&gt;
&lt;/<span class="tag">svg</span>&gt;

<span class="comment">&lt;!-- 2. Icône décorative (sans sens pour les lecteurs d'écran) --&gt;</span>
&lt;<span class="tag">svg</span>
  <span class="attr">class</span>=<span class="string">"icon"</span>
  <span class="attr">width</span>=<span class="string">"24"</span>
  <span class="attr">height</span>=<span class="string">"24"</span>
  <span class="attr">aria-hidden</span>=<span class="string">"true"</span>
  <span class="attr">focusable</span>=<span class="string">"false"</span>&gt;
  &lt;<span class="tag">use</span> <span class="attr">href</span>=<span class="string">"assets/icones/sprite.svg#icon-nom"</span>&gt;&lt;/<span class="tag">use</span>&gt;
&lt;/<span class="tag">svg</span>&gt;

<span class="comment">&lt;!-- 3. Icône informative (avec alternative textuelle) --&gt;</span>
&lt;<span class="tag">svg</span>
  <span class="attr">class</span>=<span class="string">"icon"</span>
  <span class="attr">width</span>=<span class="string">"24"</span>
  <span class="attr">height</span>=<span class="string">"24"</span>
  <span class="attr">role</span>=<span class="string">"img"</span>
  <span class="attr">aria-label</span>=<span class="string">"Description de l'icône"</span>&gt;
  &lt;<span class="tag">use</span> <span class="attr">href</span>=<span class="string">"assets/icones/sprite.svg#icon-nom"</span>&gt;&lt;/<span class="tag">use</span>&gt;
&lt;/<span class="tag">svg</span>&gt;

<span class="comment">&lt;!-- 4. Bouton avec icône (label visible) --&gt;</span>
&lt;<span class="tag">button</span> <span class="attr">type</span>=<span class="string">"button"</span>&gt;
  &lt;<span class="tag">svg</span>
    <span class="attr">class</span>=<span class="string">"icon"</span>
    <span class="attr">width</span>=<span class="string">"24"</span>
    <span class="attr">height</span>=<span class="string">"24"</span>
    <span class="attr">aria-hidden</span>=<span class="string">"true"</span>
    <span class="attr">focusable</span>=<span class="string">"false"</span>&gt;
    &lt;<span class="tag">use</span> <span class="attr">href</span>=<span class="string">"assets/icones/sprite.svg#icon-search"</span>&gt;&lt;/<span class="tag">use</span>&gt;
  &lt;/<span class="tag">svg</span>&gt;
  Rechercher
&lt;/<span class="tag">button</span>&gt;

<span class="comment">&lt;!-- 5. Bouton avec icône seule (aria-label obligatoire) --&gt;</span>
&lt;<span class="tag">button</span>
  <span class="attr">type</span>=<span class="string">"button"</span>
  <span class="attr">aria-label</span>=<span class="string">"Fermer"</span>&gt;
  &lt;<span class="tag">svg</span>
    <span class="attr">class</span>=<span class="string">"icon"</span>
    <span class="attr">width</span>=<span class="string">"24"</span>
    <span class="attr">height</span>=<span class="string">"24"</span>
    <span class="attr">aria-hidden</span>=<span class="string">"true"</span>
    <span class="attr">focusable</span>=<span class="string">"false"</span>&gt;
    &lt;<span class="tag">use</span> <span class="attr">href</span>=<span class="string">"assets/icones/sprite.svg#icon-close"</span>&gt;&lt;/<span class="tag">use</span>&gt;
  &lt;/<span class="tag">svg</span>&gt;
&lt;/<span class="tag">button</span>&gt;
      </div>
    </div>
  </div>

  <div class="grid">
${icons.map(icon => `    <div class="icon-card" onclick="copyIconCode('${icon.id}')">
      <div class="icon-container">
        <svg class="icon" viewBox="${icon.viewBox}">
          ${icon.content}
        </svg>
      </div>
      <div class="icon-name">${icon.name}</div>
      <code class="icon-id">${icon.id}</code>
    </div>`).join('\n')}
  </div>

  <div class="copy-notification" id="notification">
    ✅ Code copié dans le presse-papier !
  </div>

  <script>
    function copyIconCode(iconId) {
      const code = \`<svg class="icon" width="24" height="24" aria-hidden="true" focusable="false">
  <use href="assets/icones/sprite.svg#\${iconId}"></use>
</svg>\`;

      navigator.clipboard.writeText(code).then(() => {
        const notification = document.getElementById('notification');
        notification.classList.add('show');
        setTimeout(() => {
          notification.classList.remove('show');
        }, 2000);
      });
    }

    function toggleExamples() {
      const examples = document.getElementById('examples');
      const toggleIcon = document.getElementById('toggle-icon');
      const toggleText = document.getElementById('toggle-text');
      
      examples.classList.toggle('open');
      toggleIcon.classList.toggle('open');
      
      if (examples.classList.contains('open')) {
        toggleText.textContent = 'Masquer les exemples d’intégration';
      } else {
        toggleText.textContent = 'Voir les exemples d’intégration';
      }
    }
  </script>
</body>
</html>`;

  return html;
}

/**
 * Tâche principale : traiter les SVG
 */
function processSVG(done) {
  const sourceDir = 'dev/assets/icones/unitaires';

  // Vérifier si le dossier source existe
  if (!fs.existsSync(sourceDir)) {
    console.log('⚠️  Aucun dossier unitaires/ trouvé. Création...');
    fs.mkdirSync(sourceDir, { recursive: true });
    console.log('✅ Dossier créé : dev/assets/icones/unitaires/');
    console.log('📝 Ajoutez vos fichiers SVG dans ce dossier et relancez la tâche.');
    done();
    return;
  }

  // Lire tous les fichiers SVG
  const files = fs.readdirSync(sourceDir).filter(file => file.endsWith('.svg'));

  if (files.length === 0) {
    console.log('⚠️  Aucun fichier SVG trouvé dans dev/assets/icones/unitaires/');
    console.log('📝 Ajoutez des fichiers .svg et relancez la tâche.');
    done();
    return;
  }

  console.log(`🎨 Traitement de ${files.length} icône(s)...`);

  const icons = [];

  // Traiter chaque fichier SVG
  files.forEach(file => {
    const filePath = path.join(sourceDir, file);
    const content = fs.readFileSync(filePath, 'utf8');

    // Nettoyer le SVG
    const cleaned = cleanSVG(content, file);

    // Extraire les infos
    const name = path.basename(file, '.svg');
    const id = `icon-${name}`;
    const viewBox = extractViewBox(cleaned);
    const svgContent = extractSVGContent(cleaned);

    icons.push({
      id,
      name,
      viewBox,
      content: svgContent
    });

    console.log(`  ✓ ${file} → ${id}`);
  });

  // Générer le sprite
  const sprite = generateSprite(icons);
  const spritePath = path.join(config.dest, config.spriteName);
  fs.writeFileSync(spritePath, sprite);
  console.log(`\n📦 Sprite généré : ${spritePath}`);

  // Copier le sprite dans public
  const publicSpritePath = path.join(config.publicDest, config.spriteName);
  if (!fs.existsSync(config.publicDest)) {
    fs.mkdirSync(config.publicDest, { recursive: true });
  }
  fs.writeFileSync(publicSpritePath, sprite);

  // Générer la documentation
  const doc = generateDoc(icons);
  const docPath = path.join(config.dest, config.docName);
  fs.writeFileSync(docPath, doc);
  console.log(`📄 Documentation générée : ${docPath}`);

  console.log(`\n✅ ${icons.length} icône(s) traitée(s) avec succès !`);
  console.log(`\n💡 Ouvrez dev/assets/icones/doc.html pour voir toutes les icônes.`);

  done();
}

// Export des tâches
task('svg', processSVG);
task('process:svg', processSVG);

export default processSVG;
