// Showcase.js - Version optimisée qui charge les HTML précompilés

class ShowcaseManager {
  constructor() {
    this.showcaseData = null;
    this.componentStates = new Map();
    this.init();
  }

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
      const showcaseItem = this.createComponentShowcase(component);
      container.appendChild(showcaseItem);
    });
  }

  renderPages() {
    const container = document.getElementById('pages-container');
    if (!container) return;
    
    if (!this.showcaseData.pages.length) {
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
    
    this.showcaseData.pages.forEach(page => {
      const pageCard = this.createPageCard(page);
      container.appendChild(pageCard);
    });
  }

  createComponentShowcase(component) {
    const article = document.createElement('article');
    article.className = 'component-showcase';
    article.id = `component-${component.id}`;
    
    // Support pour fullWidth
    if (component.fullWidth) {
      article.classList.add('component-showcase--full-width');
    }

    // Initialize state with default values
    const state = this.getDefaultState(component);
    this.componentStates.set(component.id, state);

    // Header
    const header = document.createElement('div');
    header.className = 'component-showcase__header';
    header.innerHTML = `
      <h3>${component.name}</h3>
      <p>${component.description || ''}</p>
    `;

    // Preview
    const preview = document.createElement('div');
    preview.className = 'component-showcase__preview';
    preview.id = `preview-${component.id}`;
    preview.innerHTML = '<div class="loading">Chargement...</div>';
    
    // Charger le composant précompilé
    this.loadPrecompiledComponent(component.id, preview);

    // Controls
    const controls = this.createControls(component);

    // Tabs and Code
    const codeSection = this.createCodeSection(component);

    article.appendChild(header);
    article.appendChild(preview);
    article.appendChild(controls);
    article.appendChild(codeSection);

    return article;
  }

  async loadPrecompiledComponent(componentId, container) {
    try {
      // Charger le fichier HTML précompilé depuis public/components
      const htmlPath = `components/${componentId}/${componentId}.html`;
      const response = await fetch(htmlPath);
      
      if (!response.ok) {
        throw new Error(`Component not found: ${htmlPath}`);
      }
      
      let html = await response.text();
      
      // Stocker le template de base
      const state = this.componentStates.get(componentId);
      state.baseHtml = html;
      
      // Appliquer les valeurs par défaut
      this.updateComponentPreview(componentId, container);
      
    } catch (error) {
      console.error(`Error loading component ${componentId}:`, error);
      const component = this.showcaseData.components.find(c => c.id === componentId);
      container.innerHTML = `
        <div style="padding: 2rem; text-align: center; color: #6b7280;">
          <p><strong>${component?.name || componentId}</strong></p>
          <p style="font-size: 0.875rem; margin-top: 0.5rem;">
            Composant : <code>components/${componentId}/${componentId}.html</code>
          </p>
          <p style="font-size: 0.875rem; color: #ef4444; margin-top: 0.5rem;">
            ${error.message}
          </p>
        </div>
      `;
    }
  }

  updateComponentPreview(componentId, container) {
    const state = this.componentStates.get(componentId);
    if (!state || !state.baseHtml) return;
    
    let html = state.baseHtml;
    
    // Créer un DOM temporaire pour manipuler le HTML
    const temp = document.createElement('div');
    temp.innerHTML = html;
    
    // Trouver l'élément racine du composant
    const root = temp.firstElementChild;
    if (!root) {
      container.innerHTML = html;
      return;
    }
    
    // Appliquer les variants aux classes
    const component = this.showcaseData.components.find(c => c.id === componentId);
    this.applyVariantsToElement(root, component, state);
    
    // Appliquer le contenu
    this.applyContentToElement(root, component, state);
    
    container.innerHTML = temp.innerHTML;
  }

  applyVariantsToElement(element, component, state) {
    if (!component.variants) return;
    
    // Pour chaque variant, modifier les classes
    Object.entries(state.variants).forEach(([key, value]) => {
      const variantConfig = component.variants[key];
      if (!variantConfig) return;
      
      if (variantConfig.type === 'checkbox') {
        // Pour les checkboxes, ajouter/retirer une classe
        const className = this.getClassNameForVariant(component.id, key);
        if (value) {
          element.classList.add(className);
        } else {
          element.classList.remove(className);
        }

        // Gérer disabled
        if (key === 'disabled') {
          if (value) {
            element.setAttribute('disabled', '');
            element.setAttribute('aria-disabled', 'true');
          } else {
            element.removeAttribute('disabled');
            element.removeAttribute('aria-disabled');
          }
        }

        // Gérer withSearch et withButton pour la navbar
        if (key === 'withSearch') {
          const searchElement = element.querySelector('[data-element="search"]');
          if (searchElement) {
            searchElement.style.display = value ? 'block' : 'none';
          }
        }

        if (key === 'withButton') {
          const buttonElement = element.querySelector('[data-element="button"]');
          if (buttonElement) {
            buttonElement.style.display = value ? 'inline-block' : 'none';
          }
        }
      } else if (variantConfig.type === 'select') {
        // Pour les selects, remplacer la classe de variant
        const baseClass = this.getBaseClassName(component.id);
        const newClassName = `${baseClass}--${value}`;

        // Supprimer uniquement les classes qui correspondent à ce variant spécifique
        // On cherche toutes les options possibles pour ce variant
        if (variantConfig.options) {
          variantConfig.options.forEach(option => {
            const optionClass = `${baseClass}--${option}`;
            element.classList.remove(optionClass);
          });
        }

        // Ajouter la nouvelle classe
        element.classList.add(newClassName);
      }
    });
  }

  applyContentToElement(element, component, state) {
    if (!component.content) return;
    
    Object.entries(state.content).forEach(([key, value]) => {
      // Chercher les éléments qui contiennent le contenu par défaut
      const walker = document.createTreeWalker(
        element,
        NodeFilter.SHOW_TEXT,
        null
      );
      
      let node;
      while (node = walker.nextNode()) {
        const contentConfig = component.content[key];
        if (node.textContent.includes(contentConfig.default)) {
          node.textContent = node.textContent.replace(contentConfig.default, value);
        }
      }
      
      // Pour les inputs et placeholders
      const inputs = element.querySelectorAll('input, textarea');
      inputs.forEach(input => {
        if (key === 'placeholder' && input.placeholder) {
          input.placeholder = value;
        }
        if (key === 'label') {
          const label = element.querySelector('label');
          if (label) label.textContent = value;
        }
      });
    });
  }

  getBaseClassName(componentId) {
    // Mapping des IDs de composants vers leurs classes de base
    const mapping = {
      'button': 'btn',
      'card': 'card',
      'input': 'input',
      'navbar': 'navbar'
    };
    return mapping[componentId] || componentId;
  }

  getClassNameForVariant(componentId, variantKey) {
    const baseClass = this.getBaseClassName(componentId);
    return `${baseClass}--${variantKey}`;
  }

  createControls(component) {
    const controls = document.createElement('div');
    controls.className = 'component-showcase__controls';

    let html = '<div class="component-showcase__controls-title">Personnalisation</div>';

    // Variants
    if (component.variants) {
      Object.entries(component.variants).forEach(([key, config]) => {
        html += this.createControlGroup(component.id, key, config, 'variant');
      });
    }

    // Content
    if (component.content) {
      Object.entries(component.content).forEach(([key, config]) => {
        html += this.createControlGroup(component.id, key, config, 'content');
      });
    }

    controls.innerHTML = html;

    // Add event listeners
    setTimeout(() => {
      controls.querySelectorAll('select, input, textarea').forEach(input => {
        const handler = () => this.handleControlChange(component.id, input);
        input.addEventListener('change', handler);
        input.addEventListener('input', handler);
      });
    }, 0);

    return controls;
  }

  createControlGroup(componentId, key, config, category) {
    const type = config.type || 'text';
    let inputHtml = '';

    switch (type) {
      case 'select':
        inputHtml = `
          <select data-key="${key}" data-category="${category}">
            ${config.options.map(option => `
              <option value="${option}" ${option === config.default ? 'selected' : ''}>
                ${option}
              </option>
            `).join('')}
          </select>
        `;
        break;

      case 'checkbox':
        inputHtml = `
          <label style="display: flex; align-items: center; cursor: pointer;">
            <input 
              type="checkbox" 
              data-key="${key}" 
              data-category="${category}"
              ${config.default ? 'checked' : ''}
              class="checkbox"
              style="margin-right: 0.5rem;"
            />
            <span>${config.label}</span>
          </label>
        `;
        return `<div class="component-showcase__controls-group">${inputHtml}</div>`;

      case 'textarea':
        inputHtml = `
          <textarea 
            data-key="${key}" 
            data-category="${category}"
            rows="3"
            style="width: 100%; padding: 0.5rem; font-size: 0.875rem; border: 1px solid #d1d5db; border-radius: 0.375rem; font-family: inherit;"
          >${this.escapeHtml(config.default || '')}</textarea>
        `;
        break;

      default:
        inputHtml = `
          <input 
            type="${type}" 
            data-key="${key}" 
            data-category="${category}"
            value="${this.escapeHtml(config.default || '')}"
          />
        `;
    }

    return `
      <div class="component-showcase__controls-group">
        <label>${config.label}</label>
        ${inputHtml}
      </div>
    `;
  }

  createCodeSection(component) {
    const section = document.createElement('div');
    
    const tabs = document.createElement('div');
    tabs.className = 'component-showcase__tabs';
    tabs.innerHTML = `
      <button class="active" data-tab="twig">Twig</button>
      <button data-tab="html">HTML</button>
    `;

    const codeContainer = document.createElement('div');
    codeContainer.className = 'component-showcase__code';
    codeContainer.id = `code-${component.id}`;
    this.updateCode(component.id, codeContainer, 'twig');

    // Tab switching
    tabs.querySelectorAll('button').forEach(button => {
      button.addEventListener('click', () => {
        tabs.querySelectorAll('button').forEach(b => b.classList.remove('active'));
        button.classList.add('active');
        this.updateCode(component.id, codeContainer, button.dataset.tab);
      });
    });

    section.appendChild(tabs);
    section.appendChild(codeContainer);

    return section;
  }

  createPageCard(page) {
    const card = document.createElement('div');
    card.className = 'card card--interactive';
    card.innerHTML = `
      <div class="card__header">
        <h3 class="card__title">${page.name}</h3>
        ${page.description ? `<p class="card__subtitle">${page.description}</p>` : ''}
      </div>
      <div class="card__body">
        <p>Catégorie: ${page.category || 'Non catégorisée'}</p>
      </div>
      <div class="card__footer">
        <a href="${page.path}.html" class="btn btn--primary btn--small" target="_blank">
          Voir la page
        </a>
      </div>
    `;
    return card;
  }

  handleControlChange(componentId, input) {
    const key = input.dataset.key;
    const category = input.dataset.category;
    const value = input.type === 'checkbox' ? input.checked : input.value;

    const state = this.componentStates.get(componentId);
    if (category === 'variant') {
      state.variants[key] = value;
    } else if (category === 'content') {
      state.content[key] = value;
    }

    const preview = document.getElementById(`preview-${componentId}`);
    this.updateComponentPreview(componentId, preview);

    const codeContainer = document.getElementById(`code-${componentId}`);
    const activeTab = codeContainer.closest('article').querySelector('.component-showcase__tabs button.active');
    this.updateCode(componentId, codeContainer, activeTab ? activeTab.dataset.tab : 'twig');
  }

  updateCode(componentId, container, type) {
    const component = this.showcaseData.components.find(c => c.id === componentId);
    const state = this.componentStates.get(componentId);

    let code = '';
    if (type === 'twig') {
      code = this.buildComponentTwig(component, state);
    } else if (type === 'html') {
      const preview = document.getElementById(`preview-${componentId}`);
      code = this.formatHtml(preview.innerHTML);
    }

    container.innerHTML = `
      <div class="component-showcase__code-header">
        <h4>Code ${type.toUpperCase()}</h4>
        <button onclick="navigator.clipboard.writeText(this.closest('.component-showcase__code').querySelector('code').textContent).then(() => { this.textContent = 'Copié !'; setTimeout(() => this.textContent = 'Copier', 2000); })">
          Copier
        </button>
      </div>
      <pre><code>${this.escapeHtml(code)}</code></pre>
    `;
  }

  formatHtml(html) {
    // Simple formatage du HTML pour l'affichage
    return html
      .replace(/></g, '>\n<')
      .replace(/\n\s*\n/g, '\n')
      .trim();
  }

  buildComponentTwig(component, state) {
    const { variants, content } = state;
    const allProps = { ...variants, ...content };
    
    const propsString = Object.entries(allProps)
      .map(([key, value]) => {
        if (typeof value === 'boolean') {
          return `${key}=${value}`;
        } else if (typeof value === 'string') {
          return `${key}="${value}"`;
        }
        return `${key}=${value}`;
      })
      .join(', ');

    return `{% include 'components/${component.id}/${component.id}.twig' with { ${propsString} } %}`;
  }

  getDefaultState(component) {
    const state = {
      variants: {},
      content: {},
      baseHtml: null
    };

    if (component.variants) {
      Object.entries(component.variants).forEach(([key, config]) => {
        state.variants[key] = config.default;
      });
    }

    if (component.content) {
      Object.entries(component.content).forEach(([key, config]) => {
        state.content[key] = config.default;
      });
    }

    return state;
  }

  escapeHtml(unsafe) {
    if (unsafe === null || unsafe === undefined) return '';
    return String(unsafe)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

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

// Initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new ShowcaseManager());
} else {
  new ShowcaseManager();
}