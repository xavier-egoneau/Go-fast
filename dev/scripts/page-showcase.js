// Page Showcase - Gestion de l'affichage des pages avec variantes et preview responsive

class PageShowcase {
  constructor() {
    this.currentPage = null;
    this.currentVariant = null;
    this.currentDevice = 'mobile';
    this.showcaseData = null;
    this.init();
  }

  async init() {
    // Récupérer l'ID de la page depuis l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const pageId = urlParams.get('page');

    if (!pageId) {
      this.showError('Aucune page spécifiée');
      return;
    }

    try {
      // Charger les données du showcase
      await this.loadShowcaseData();

      // Trouver la page
      this.currentPage = this.showcaseData.pages.find(p => p.id === pageId);

      if (!this.currentPage) {
        this.showError(`Page "${pageId}" introuvable`);
        return;
      }

      // Initialiser l'interface
      this.setupUI();
      this.setupEventListeners();
      this.loadPage();
    } catch (error) {
      console.error('Error initializing page showcase:', error);
      this.showError('Erreur lors du chargement');
    }
  }

  async loadShowcaseData() {
    const response = await fetch('data/showcase.json');
    if (!response.ok) {
      throw new Error('Failed to load showcase data');
    }
    this.showcaseData = await response.json();
  }

  setupUI() {
    // Mettre à jour le titre et les métadonnées
    document.getElementById('page-title').textContent = this.currentPage.name;

    const metaText = [];
    if (this.currentPage.category) metaText.push(`Catégorie: ${this.currentPage.category}`);
    if (this.currentPage.description) metaText.push(this.currentPage.description);
    document.getElementById('page-meta').textContent = metaText.join(' • ');

    // Configurer le sélecteur de variantes
    const variantSelect = document.getElementById('variant-select');

    if (this.currentPage.variants && this.currentPage.variants.length > 0) {
      variantSelect.innerHTML = '';
      this.currentPage.variants.forEach((variant, index) => {
        const option = document.createElement('option');
        option.value = variant.id;
        option.textContent = variant.name;
        if (variant.description) {
          option.title = variant.description;
        }
        variantSelect.appendChild(option);

        // Sélectionner la première variante par défaut
        if (index === 0) {
          this.currentVariant = variant;
        }
      });
    } else {
      // Pas de variantes, masquer le sélecteur
      variantSelect.closest('.page-showcase__variant-selector').style.display = 'none';
    }
  }

  setupEventListeners() {
    // Device selector
    document.querySelectorAll('.page-showcase__device-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.page-showcase__device-btn').forEach(b =>
          b.classList.remove('active')
        );
        e.target.classList.add('active');
        this.currentDevice = e.target.dataset.device;
        this.updatePreviewSize();
      });
    });

    // Variant selector
    const variantSelect = document.getElementById('variant-select');
    variantSelect.addEventListener('change', (e) => {
      const variantId = e.target.value;
      this.currentVariant = this.currentPage.variants.find(v => v.id === variantId);
      this.loadPage();
    });

    // Gérer le redimensionnement de l'iframe
    window.addEventListener('message', (event) => {
      if (event.data.type === 'resize') {
        const iframe = document.getElementById('preview-iframe');
        iframe.style.height = event.data.height + 'px';
      }
    });
  }

  updatePreviewSize() {
    const container = document.getElementById('preview-container');
    container.className = 'page-showcase__preview';
    container.classList.add(`page-showcase__preview--${this.currentDevice}`);
  }

  loadPage() {
    const iframe = document.getElementById('preview-iframe');

    // Construire l'URL avec les paramètres de variante si nécessaire
    let pageUrl = `${this.currentPage.path}.html`;

    if (this.currentVariant && this.currentVariant.data) {
      const params = new URLSearchParams(this.currentVariant.data);
      pageUrl += `?${params.toString()}`;
    }

    iframe.src = pageUrl;

    // Ajuster la hauteur de l'iframe après le chargement
    iframe.onload = () => {
      try {
        // Essayer d'obtenir la hauteur du contenu
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        const height = iframeDoc.documentElement.scrollHeight;
        iframe.style.height = height + 'px';
      } catch (e) {
        // En cas d'erreur (CORS), utiliser une hauteur par défaut
        iframe.style.height = '800px';
      }
    };
  }

  showError(message) {
    document.getElementById('page-title').textContent = 'Erreur';
    document.getElementById('page-meta').textContent = message;
    document.getElementById('preview-container').innerHTML = `
      <div style="padding: 4rem; text-align: center; color: #718096;">
        <p style="font-size: 1.5rem; margin-bottom: 1rem;">⚠️</p>
        <p>${message}</p>
      </div>
    `;
  }
}

// Initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new PageShowcase());
} else {
  new PageShowcase();
}
