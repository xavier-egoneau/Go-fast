// Showcase principal - Affichage de la liste des composants et pages

class ShowcaseManager {
  constructor() {
    this.showcaseData = null;
    this.init();
  }

  /**
   * Initialise le showcase en chargeant les données et en affichant les composants/pages
   */
  async init() {
    try {
      await this.loadShowcaseData();
      this.renderComponents();
      this.renderPages();
    } catch (error) {
      console.error('Error initializing showcase:', error);
      this.showError();
    }
  }

  /**
   * Charge les données du showcase depuis le fichier JSON
   */
  async loadShowcaseData() {
    try {
      const response = await fetch('data/showcase.json');
      if (!response.ok) {
        throw new Error(`Failed to load showcase data: ${response.status}`);
      }
      this.showcaseData = await response.json();

      if (!this.showcaseData.components) this.showcaseData.components = [];
      if (!this.showcaseData.pages) this.showcaseData.pages = [];
    } catch (error) {
      console.error('Error loading showcase.json:', error);
      this.showcaseData = { components: [], pages: [] };
    }
  }

  /**
   * Affiche la liste des composants sous forme de cards
   */
  renderComponents() {
    const container = document.getElementById('components-container');
    if (!container) return;

    if (!this.showcaseData.components.length) {
      container.innerHTML = `
        <div class="empty-state">
          <p>Aucun composant disponible</p>
          <p style="font-size: 0.875rem; color: #6b7280; margin-top: 0.5rem;">
            Créez votre premier composant dans <code>dev/components/</code>
          </p>
        </div>
      `;
      return;
    }

    container.innerHTML = '';

    this.showcaseData.components.forEach(component => {
      const componentCard = this.createComponentCard(component);
      container.appendChild(componentCard);
    });
  }

  /**
   * Affiche la liste des pages sous forme de cards (exclut les pages système)
   */
  renderPages() {
    const container = document.getElementById('pages-container');
    if (!container) return;

    // Filtrer les pages pour exclure index.html, page-showcase.html et landing-variant
    const filteredPages = this.showcaseData.pages.filter(page =>
      page.id !== 'index' &&
      page.id !== 'page-showcase' &&
      page.id !== 'landing-variant' &&
      !page.path.endsWith('/index') &&
      page.path !== 'index'
    );

    if (!filteredPages.length) {
      container.innerHTML = `
        <div class="empty-state">
          <p>Aucune page disponible</p>
          <p style="font-size: 0.875rem; color: #6b7280; margin-top: 0.5rem;">
            Créez vos pages dans <code>dev/pages/</code>
          </p>
        </div>
      `;
      return;
    }

    container.innerHTML = '';

    filteredPages.forEach(page => {
      const pageCard = this.createPageCard(page);
      container.appendChild(pageCard);
    });
  }

  /**
   * Crée une card pour un composant
   * @param {Object} component - Les données du composant
   * @returns {HTMLElement} - L'élément card
   */
  createComponentCard(component) {
    const card = document.createElement('div');
    card.className = 'card card--interactive';

    // Compter le nombre total d'options de variantes et de contenu
    const variantsCount = component.variants ? Object.keys(component.variants).length : 0;
    const contentCount = component.content ? Object.keys(component.content).length : 0;
    const totalOptions = variantsCount + contentCount;

    const optionsInfo = totalOptions > 0
      ? `<p style="font-size: 0.875rem; color: #667eea; margin-top: 0.5rem;">${totalOptions} option(s) personnalisable(s)</p>`
      : '';

    card.innerHTML = `
      <div class="card__header">
        <h3 class="card__title">${component.name}</h3>
        ${component.description ? `<p class="card__subtitle">${component.description}</p>` : ''}
      </div>
      <div class="card__body">
        <p>Catégorie: ${component.category || 'Non catégorisée'}</p>
        ${optionsInfo}
      </div>
      <div class="card__footer">
        <a href="page-showcase.html?type=component&id=${component.id}" class="btn btn--primary btn--small">
          Voir le composant
        </a>
      </div>
    `;
    return card;
  }

  /**
   * Crée une card pour une page
   * @param {Object} page - Les données de la page
   * @returns {HTMLElement} - L'élément card
   */
  createPageCard(page) {
    const card = document.createElement('div');
    card.className = 'card card--interactive';

    // Afficher le nombre de variantes si disponible
    const variantsInfo = page.variants && page.variants.length > 0
      ? `<p style="font-size: 0.875rem; color: #667eea; margin-top: 0.5rem;">${page.variants.length} variante(s) disponible(s)</p>`
      : '';

    card.innerHTML = `
      <div class="card__header">
        <h3 class="card__title">${page.name}</h3>
        ${page.description ? `<p class="card__subtitle">${page.description}</p>` : ''}
      </div>
      <div class="card__body">
        <p>Catégorie: ${page.category || 'Non catégorisée'}</p>
        ${variantsInfo}
      </div>
      <div class="card__footer">
        <a href="page-showcase.html?type=page&id=${page.id}" class="btn btn--primary btn--small">
          Voir la page
        </a>
      </div>
    `;
    return card;
  }

  /**
   * Affiche un message d'erreur générique
   */
  showError() {
    const containers = ['components-container', 'pages-container'];
    containers.forEach(id => {
      const container = document.getElementById(id);
      if (container) {
        container.innerHTML = `
          <div class="empty-state">
            <p>❌ Erreur lors du chargement des données</p>
          </div>
        `;
      }
    });
  }
}

// Initialiser le showcase au chargement de la page
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new ShowcaseManager());
} else {
  new ShowcaseManager();
}
