const { task } = require('gulp');
const fs = require('fs');
const path = require('path');

// Génère le fichier JSON listant tous les composants et pages
function generateShowcaseData() {
  const componentsDir = 'dev/components';
  const pagesDir = 'dev/pages';
  const outputPath = 'dev/data/showcase.json';
  const publicOutputPath = 'public/data/showcase.json';
  
  const showcaseData = {
    components: [],
    pages: []
  };
  
  // Scan des composants
  if (fs.existsSync(componentsDir)) {
    const componentFolders = fs.readdirSync(componentsDir);
    
    componentFolders.forEach(folder => {
      const jsonPath = path.join(componentsDir, folder, `${folder}.json`);
      const twigPath = path.join(componentsDir, folder, `${folder}.twig`);
      
      if (fs.existsSync(jsonPath) && fs.existsSync(twigPath)) {
        try {
          const componentData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
          showcaseData.components.push({
            id: folder,
            path: `components/${folder}/${folder}`,
            ...componentData
          });
        } catch (e) {
          console.error(`Erreur lors du chargement de ${jsonPath}:`, e.message);
        }
      }
    });
  }
  
  // Scan des pages
  if (fs.existsSync(pagesDir)) {
    const scanPages = (dir, basePath = '') => {
      const items = fs.readdirSync(dir);
      
      items.forEach(item => {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          scanPages(fullPath, path.join(basePath, item));
        } else if (item.endsWith('.twig') && !item.startsWith('_')) {
          const pageName = item.replace('.twig', '');
          const jsonPath = path.join(dir, `${pageName}.json`);
          
          let pageData = {
            name: pageName,
            category: 'pages'
          };
          
          if (fs.existsSync(jsonPath)) {
            try {
              const jsonContent = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
              pageData = { ...pageData, ...jsonContent };
            } catch (e) {
              console.error(`Erreur lors du chargement de ${jsonPath}:`, e.message);
            }
          }
          
          showcaseData.pages.push({
            id: pageName,
            path: path.join(basePath, pageName).replace(/\\/g, '/'),
            ...pageData
          });
        }
      });
    };
    
    scanPages(pagesDir);
  }
  
  // Créer le dossier data s'il n'existe pas
  const dataDir = path.dirname(outputPath);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  // Créer le dossier public/data s'il n'existe pas
  const publicDataDir = path.dirname(publicOutputPath);
  if (!fs.existsSync(publicDataDir)) {
    fs.mkdirSync(publicDataDir, { recursive: true });
  }
  
  // Écrire le fichier JSON dans dev/data
  fs.writeFileSync(outputPath, JSON.stringify(showcaseData, null, 2));
  
  // Écrire aussi dans public/data pour que le navigateur puisse le charger
  fs.writeFileSync(publicOutputPath, JSON.stringify(showcaseData, null, 2));
  
  console.log(`✓ Showcase data generated: ${showcaseData.components.length} components, ${showcaseData.pages.length} pages`);
  
  return Promise.resolve();
}

// Export des tâches
task('generate:showcase', generateShowcaseData);

module.exports = generateShowcaseData;