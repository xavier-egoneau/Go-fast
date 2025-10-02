// Showcase unifié - Gestion de l'affichage des pages et composants avec variantes et preview responsive

class UnifiedShowcase {
  constructor() {
    this.currentItem = null; // Page ou composant en cours d'affichage
    this.currentVariant = null; // Variante actuelle (pour les pages)
    this.currentDevice = 'mobile'; // Device actuel (mobile/tablet/desktop)
    this.showcaseData = null; // Données chargées depuis showcase.json
    this.type = null; // Type d'élément : 'page' ou 'component'
    this.componentState = null; // État actuel du composant (variants + content)
    this.showingCode = false; // Mode affichage: false = rendu, true = code
    this.currentHTML = ''; // HTML actuel (pour copie et affichage code)
    this.init();
  }

  async init() {
    // Récupérer le type et l'ID depuis l'URL
    const urlParams = new URLSearchParams(window.location.search);
    this.type = urlParams.get('type') || 'page'; // Par défaut 'page' pour rétrocompatibilité
    const itemId = urlParams.get('id') || urlParams.get('page'); // Support ancien format

    if (!itemId) {
      this.showError('Aucun élément spécifié');
      return;
    }

    try {
      // Charger les données du showcase
      await this.loadShowcaseData();

      // Trouver l'élément (page ou composant)
      if (this.type === 'component') {
        this.currentItem = this.showcaseData.components.find(c => c.id === itemId);
      } else {
        this.currentItem = this.showcaseData.pages.find(p => p.id === itemId);
      }

      if (!this.currentItem) {
        this.showError(`${this.type === 'component' ? 'Composant' : 'Page'} "${itemId}" introuvable`);
        return;
      }

      // Initialiser l'interface
      this.setupUI();
      this.setupEventListeners();
      this.loadItem();
    } catch (error) {
      console.error('Error initializing showcase:', error);
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
    document.getElementById('page-title').textContent = this.currentItem.name;

    const metaText = [];
    if (this.currentItem.category) metaText.push(`Catégorie: ${this.currentItem.category}`);
    if (this.currentItem.description) metaText.push(this.currentItem.description);
    document.getElementById('page-meta').textContent = metaText.join(' • ');

    // Configurer les sélecteurs selon le type
    if (this.type === 'component') {
      this.setupComponentControls();
    } else {
      this.setupPageControls();
    }
  }

  setupComponentControls() {
    // Pour les composants, on affiche les contrôles de variantes/content
    const variantSelector = document.getElementById('variant-select').closest('.page-showcase__variant-selector');
    variantSelector.style.display = 'none'; // Masquer le sélecteur de variantes des pages

    // Initialiser l'état du composant avec les valeurs par défaut
    this.componentState = {
      variants: {},
      content: {}
    };

    if (this.currentItem.variants) {
      Object.entries(this.currentItem.variants).forEach(([key, config]) => {
        this.componentState.variants[key] = config.default;
      });
    }

    if (this.currentItem.content) {
      Object.entries(this.currentItem.content).forEach(([key, config]) => {
        this.componentState.content[key] = config.default;
      });
    }

    // Créer les contrôles personnalisés
    this.renderComponentControls();
  }

  setupPageControls() {
    // Pour les pages, utiliser le sélecteur de variantes
    const variantSelect = document.getElementById('variant-select');
    const controlsContainer = document.getElementById('component-controls');
    if (controlsContainer) controlsContainer.style.display = 'none';

    if (this.currentItem.variants && this.currentItem.variants.length > 0) {
      variantSelect.innerHTML = '';
      this.currentItem.variants.forEach((variant, index) => {
        const option = document.createElement('option');
        option.value = variant.id;
        option.textContent = variant.name;
        if (variant.description) {
          option.title = variant.description;
        }
        variantSelect.appendChild(option);

        if (index === 0) {
          this.currentVariant = variant;
        }
      });
    } else {
      variantSelect.closest('.page-showcase__variant-selector').style.display = 'none';
    }
  }

  renderComponentControls() {
    // Créer un conteneur pour les contrôles si il n'existe pas
    let controlsContainer = document.getElementById('component-controls');
    if (!controlsContainer) {
      controlsContainer = document.createElement('div');
      controlsContainer.id = 'component-controls';
      controlsContainer.style.cssText = 'display: flex; gap: 1rem; flex-wrap: wrap; margin-top: 1rem;';

      const variantSelector = document.getElementById('variant-select').closest('.page-showcase__variant-selector');
      variantSelector.parentNode.insertBefore(controlsContainer, variantSelector.nextSibling);
    }

    controlsContainer.innerHTML = '';

    // Créer les contrôles pour les variantes
    if (this.currentItem.variants) {
      Object.entries(this.currentItem.variants).forEach(([key, config]) => {
        const control = this.createControl(key, config, 'variant');
        controlsContainer.appendChild(control);
      });
    }

    // Créer les contrôles pour le contenu
    if (this.currentItem.content) {
      Object.entries(this.currentItem.content).forEach(([key, config]) => {
        const control = this.createControl(key, config, 'content');
        controlsContainer.appendChild(control);
      });
    }
  }

  createControl(key, config, category) {
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'display: flex; flex-direction: column; gap: 0.25rem; min-width: 150px;';

    const type = config.type || 'text';

    if (type === 'checkbox') {
      const label = document.createElement('label');
      label.style.cssText = 'display: flex; align-items: center; gap: 0.5rem; cursor: pointer;';

      const input = document.createElement('input');
      input.type = 'checkbox';
      input.checked = config.default;
      input.dataset.key = key;
      input.dataset.category = category;
      input.onchange = () => this.handleComponentChange();

      label.appendChild(input);
      label.appendChild(document.createTextNode(config.label));
      wrapper.appendChild(label);
    } else if (type === 'select') {
      const label = document.createElement('label');
      label.textContent = config.label;
      label.style.cssText = 'font-size: 0.875rem; font-weight: 500;';

      const select = document.createElement('select');
      select.style.cssText = 'padding: 0.5rem; border: 1px solid #e2e8f0; border-radius: 0.375rem;';
      select.dataset.key = key;
      select.dataset.category = category;

      config.options.forEach(option => {
        const opt = document.createElement('option');
        opt.value = option;
        opt.textContent = option;
        opt.selected = option === config.default;
        select.appendChild(opt);
      });

      select.onchange = () => this.handleComponentChange();

      wrapper.appendChild(label);
      wrapper.appendChild(select);
    } else {
      const label = document.createElement('label');
      label.textContent = config.label;
      label.style.cssText = 'font-size: 0.875rem; font-weight: 500;';

      const input = document.createElement('input');
      input.type = type;
      input.value = config.default || '';
      input.style.cssText = 'padding: 0.5rem; border: 1px solid #e2e8f0; border-radius: 0.375rem;';
      input.dataset.key = key;
      input.dataset.category = category;
      input.oninput = () => this.handleComponentChange();

      wrapper.appendChild(label);
      wrapper.appendChild(input);
    }

    return wrapper;
  }

  handleComponentChange() {
    // Mettre à jour l'état du composant
    const controls = document.querySelectorAll('#component-controls input, #component-controls select');
    controls.forEach(control => {
      const key = control.dataset.key;
      const category = control.dataset.category;
      const value = control.type === 'checkbox' ? control.checked : control.value;

      if (category === 'variant') {
        this.componentState.variants[key] = value;
      } else if (category === 'content') {
        this.componentState.content[key] = value;
      }
    });

    // Recharger le composant
    this.loadItem();
  }

  /**
   * Configure tous les event listeners
   */
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

    // Variant selector (pour les pages)
    const variantSelect = document.getElementById('variant-select');
    variantSelect.addEventListener('change', (e) => {
      const variantId = e.target.value;
      this.currentVariant = this.currentItem.variants.find(v => v.id === variantId);
      this.loadItem();
    });

    // Bouton toggle code/rendu
    const toggleCodeBtn = document.getElementById('toggle-code-btn');
    if (toggleCodeBtn) {
      toggleCodeBtn.addEventListener('click', () => this.toggleCodeView());
    }

    // Bouton copier le code
    const copyCodeBtn = document.getElementById('copy-code-btn');
    if (copyCodeBtn) {
      copyCodeBtn.addEventListener('click', () => this.copyHTML());
    }
  }

  updatePreviewSize() {
    const container = document.getElementById('preview-container');
    container.className = 'page-showcase__preview';
    container.classList.add(`page-showcase__preview--${this.currentDevice}`);
  }

  loadItem() {
    const iframe = document.getElementById('preview-iframe');

    if (this.type === 'component') {
      // Pour les composants, créer une page HTML avec le composant
      this.loadComponent(iframe);
    } else {
      // Pour les pages, charger directement la page HTML
      this.loadPage(iframe);
    }
  }

  async loadComponent(iframe) {
    // Charger le HTML du composant depuis le serveur
    try {
      const response = await fetch(`/components/${this.currentItem.id}/${this.currentItem.id}.html`);
      if (!response.ok) {
        throw new Error(`Component not found: ${this.currentItem.id}`);
      }
      const componentHTML = await response.text();

      // Créer une page HTML avec le composant intégré
      const html = this.generateComponentHTML(componentHTML);

      // Utiliser srcdoc pour injecter le HTML
      iframe.srcdoc = html;
    } catch (error) {
      console.error('Error loading component:', error);
      iframe.srcdoc = `<!DOCTYPE html>
<html><body style="padding: 2rem; color: red;">
  <p>❌ Erreur de chargement du composant "${this.currentItem.id}"</p>
  <p style="font-size: 0.875rem; color: #666;">${error.message}</p>
</body></html>`;
    }
  }

  generateComponentHTML(componentHTML) {
    // Créer une page HTML avec le composant déjà chargé
    return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${this.currentItem.name}</title>
  <link rel="stylesheet" href="/assets/css/style.css">
  <style>
    body {
      height: 100vh;
      margin: 0;
      display: flex;
      align-content: center;
      flex-wrap: wrap;
      justify-content: center;
      align-items: center;
      background: #f7fafc;
    }
  </style>
</head>
<body>
  <div id="component-preview">${componentHTML}</div>
  <script>
    // Appliquer les variantes au composant
    const container = document.getElementById('component-preview');
    const element = container.firstElementChild;
    if (element) {
      ${this.generateVariantScript()}
    }
  </script>
</body>
</html>`;
  }

  generateVariantScript() {
    let script = '';
    const state = this.componentState;
    const componentId = this.currentItem.id;

    // Déclarer les variables spécifiques selon le composant
    if (componentId === 'input') {
      script += `
      const inputEl = element.querySelector('input');
      const labelEl = element.querySelector('.input-group__label');
      `;
    } else if (componentId === 'card') {
      script += `
      const headerEl = element.querySelector('.card__header');
      const footerEl = element.querySelector('.card__footer');
      const titleEl = element.querySelector('.card__title');
      let subtitleEl = element.querySelector('.card__subtitle');
      const bodyEl = element.querySelector('.card__body');
      `;
    } else if (componentId === 'navbar') {
      script += `
      const searchEl = element.querySelector('[data-element="search"]');
      const buttonEl = element.querySelector('[data-element="button"]');
      const logoTextEl = element.querySelector('.navbar__logo-text');
      `;
    }

    // Appliquer les variantes selon le type de composant
    if (state.variants) {
      Object.entries(state.variants).forEach(([key, value]) => {
        const config = this.currentItem.variants[key];
        if (!config) return;

        if (config.type === 'checkbox') {
          // Cas spécial pour input component
          if (componentId === 'input') {
            if (key === 'disabled') {
              script += `
              if (inputEl) {
                if (${value}) {
                  inputEl.setAttribute('disabled', '');
                  inputEl.setAttribute('aria-disabled', 'true');
                } else {
                  inputEl.removeAttribute('disabled');
                  inputEl.removeAttribute('aria-disabled');
                }
              }
              `;
            } else if (key === 'hasError') {
              script += `
              if (${value}) {
                element.classList.add('input-group--error');
              } else {
                element.classList.remove('input-group--error');
              }
              `;
            }
          } else if (componentId === 'card') {
            if (key === 'hasHeader') {
              script += `
              if (headerEl) {
                headerEl.style.display = ${value} ? '' : 'none';
              }
              `;
            } else if (key === 'hasFooter') {
              script += `
              if (footerEl) {
                footerEl.style.display = ${value} ? '' : 'none';
              }
              `;
            } else {
              // interactive, compact
              const className = this.getClassNameForVariant(key);
              script += `
              if (${value}) {
                element.classList.add('${className}');
              } else {
                element.classList.remove('${className}');
              }
              `;
            }
          } else if (componentId === 'navbar') {
            if (key === 'withSearch') {
              script += `
              if (searchEl) {
                searchEl.style.display = ${value} ? '' : 'none';
              }
              `;
            } else if (key === 'withButton') {
              script += `
              if (buttonEl) {
                buttonEl.style.display = ${value} ? '' : 'none';
              }
              `;
            } else {
              // sticky, shadow
              const className = this.getClassNameForVariant(key);
              script += `
              if (${value}) {
                element.classList.add('${className}');
              } else {
                element.classList.remove('${className}');
              }
              `;
            }
          } else {
            // Comportement par défaut pour les autres composants
            const className = this.getClassNameForVariant(key);
            script += `
            if (${value}) {
              element.classList.add('${className}');
            } else {
              element.classList.remove('${className}');
            }
            `;

            if (key === 'disabled') {
              script += `
              if (${value}) {
                element.setAttribute('disabled', '');
                element.setAttribute('aria-disabled', 'true');
              } else {
                element.removeAttribute('disabled');
                element.removeAttribute('aria-disabled');
              }
              `;
            }
          }
        } else if (config.type === 'select') {
          // Cas spécial pour input component
          if (componentId === 'input') {
            if (key === 'type') {
              script += `
              if (inputEl) {
                inputEl.type = '${value}';
              }
              `;
            } else if (key === 'size') {
              script += `
              if (inputEl) {
                ${config.options.map(opt => `inputEl.classList.remove('input--${opt}');`).join('\n')}
                if ('${value}' !== 'normal') {
                  inputEl.classList.add('input--${value}');
                }
              }
              `;
            }
          } else {
            // Comportement par défaut pour les autres composants
            const baseClass = this.getBaseClassName();
            script += `
            ${config.options.map(opt => `element.classList.remove('${baseClass}--${opt}');`).join('\n')}
            element.classList.add('${baseClass}--${value}');
            `;
          }
        }
      });
    }

    // Appliquer le contenu
    if (state.content) {
      Object.entries(state.content).forEach(([key, value]) => {
        const config = this.currentItem.content[key];
        if (!config) return;

        // Cas spécial pour input component
        if (componentId === 'input') {
          if (key === 'label') {
            script += `
            if (labelEl) labelEl.textContent = '${this.escapeString(value)}';
            `;
          } else if (key === 'placeholder') {
            script += `
            if (inputEl) inputEl.placeholder = '${this.escapeString(value)}';
            `;
          } else if (key === 'helper') {
            script += `
            let helperEl = element.querySelector('.input-group__helper');
            if (!element.classList.contains('input-group--error')) {
              if (!helperEl && '${this.escapeString(value)}') {
                helperEl = document.createElement('span');
                helperEl.className = 'input-group__helper';
                element.appendChild(helperEl);
              }
              if (helperEl) helperEl.textContent = '${this.escapeString(value)}';
            }
            `;
          } else if (key === 'error') {
            script += `
            let errorEl = element.querySelector('.input-group__error');
            if (element.classList.contains('input-group--error')) {
              if (!errorEl) {
                errorEl = document.createElement('span');
                errorEl.className = 'input-group__error';
                element.appendChild(errorEl);
              }
              errorEl.textContent = '${this.escapeString(value)}';
            }
            `;
          }
        } else if (componentId === 'card') {
          if (key === 'title') {
            script += `
            if (titleEl) titleEl.textContent = '${this.escapeString(value)}';
            `;
          } else if (key === 'subtitle') {
            script += `
            if (!subtitleEl && headerEl) {
              subtitleEl = document.createElement('p');
              subtitleEl.className = 'card__subtitle';
              headerEl.appendChild(subtitleEl);
            }
            if (subtitleEl) subtitleEl.textContent = '${this.escapeString(value)}';
            `;
          } else if (key === 'body') {
            script += `
            if (bodyEl) bodyEl.textContent = '${this.escapeString(value)}';
            `;
          }
        } else if (componentId === 'navbar') {
          if (key === 'logo') {
            script += `
            if (logoTextEl) logoTextEl.textContent = '${this.escapeString(value)}';
            `;
          } else if (key === 'buttonText') {
            script += `
            if (buttonEl) buttonEl.textContent = '${this.escapeString(value)}';
            `;
          }
        } else {
          // Comportement par défaut : recherche et remplacement de texte
          script += `
          const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null);
          let node;
          while (node = walker.nextNode()) {
            if (node.textContent.trim() === '${this.escapeString(config.default)}') {
              node.textContent = '${this.escapeString(value)}';
            }
          }
          `;

          if (key === 'placeholder') {
            script += `
            const inputs = element.querySelectorAll('input, textarea');
            inputs.forEach(input => {
              input.placeholder = '${this.escapeString(value)}';
            });
            `;
          }
        }
      });
    }

    return script;
  }

  getBaseClassName() {
    const mapping = {
      'button': 'btn',
      'card': 'card',
      'input': 'input',
      'navbar': 'navbar'
    };
    return mapping[this.currentItem.id] || this.currentItem.id;
  }

  getClassNameForVariant(variantKey) {
    const baseClass = this.getBaseClassName();
    return `${baseClass}--${variantKey}`;
  }

  escapeString(str) {
    if (!str) return '';
    return String(str).replace(/'/g, "\\'").replace(/"/g, '\\"');
  }

  loadPage(iframe) {
    // Construire l'URL avec les paramètres de variante si nécessaire
    let pageUrl = `${this.currentItem.path}.html`;

    if (this.currentVariant && this.currentVariant.data) {
      const params = new URLSearchParams(this.currentVariant.data);
      pageUrl += `?${params.toString()}`;
    }

    iframe.src = pageUrl;
  }

  /**
   * Toggle entre la vue rendu et la vue code
   */
  toggleCodeView() {
    this.showingCode = !this.showingCode;

    const previewContainer = document.getElementById('preview-container');
    const codeView = document.getElementById('code-view');
    const toggleBtn = document.getElementById('toggle-code-btn');

    if (this.showingCode) {
      // Afficher le code
      previewContainer.style.display = 'none';
      codeView.classList.add('active');
      toggleBtn.textContent = '👁️ Voir le rendu';

      // Mettre à jour le HTML affiché
      this.updateCodeView();
    } else {
      // Afficher le rendu
      previewContainer.style.display = 'block';
      codeView.classList.remove('active');
      toggleBtn.textContent = '👁️ Voir le code';
    }
  }

  /**
   * Met à jour la vue code avec le HTML actuel
   */
  async updateCodeView() {
    try {
      await this.extractHTML();
      const codeContent = document.getElementById('code-content');

      // Formatter le HTML pour un meilleur affichage
      const formattedHTML = this.formatHTML(this.currentHTML);
      codeContent.textContent = formattedHTML;
    } catch (e) {
      console.error('Erreur lors de l\'extraction du HTML:', e);
      document.getElementById('code-content').textContent = 'Erreur lors de l\'extraction du HTML';
    }
  }

  /**
   * Extrait le HTML depuis l'iframe
   */
  async extractHTML() {
    return new Promise((resolve, reject) => {
      try {
        const iframe = document.getElementById('preview-iframe');

        // Attendre que l'iframe soit chargée
        const extractFromIframe = () => {
          try {
            if (this.type === 'component') {
              // Pour les composants, récupérer le HTML du composant uniquement
              if (iframe.contentDocument) {
                const preview = iframe.contentDocument.getElementById('component-preview');
                if (preview && preview.firstElementChild) {
                  this.currentHTML = preview.firstElementChild.outerHTML;
                } else {
                  this.currentHTML = '';
                }
              } else {
                // Fallback si contentDocument n'est pas accessible (CORS)
                this.currentHTML = 'Impossible d\'accéder au contenu (problème de CORS)';
              }
            } else {
              // Pour les pages, récupérer le HTML complet
              if (iframe.contentDocument) {
                this.currentHTML = iframe.contentDocument.documentElement.outerHTML;
              } else {
                this.currentHTML = 'Impossible d\'accéder au contenu (problème de CORS)';
              }
            }
            resolve();
          } catch (e) {
            reject(e);
          }
        };

        // Si l'iframe utilise srcdoc, extraire immédiatement
        if (iframe.srcdoc) {
          setTimeout(extractFromIframe, 100);
        } else if (iframe.contentDocument && iframe.contentDocument.readyState === 'complete') {
          extractFromIframe();
        } else {
          iframe.addEventListener('load', extractFromIframe, { once: true });
        }
      } catch (e) {
        reject(e);
      }
    });
  }

  /**
   * Formate le HTML pour un meilleur affichage
   */
  formatHTML(html) {
    if (!html) return '';

    // Indentation basique du HTML
    let formatted = html;
    let indent = 0;
    const tab = '  ';

    formatted = formatted
      .replace(/></g, '>\n<')
      .split('\n')
      .map(line => {
        line = line.trim();
        if (line.startsWith('</')) {
          indent = Math.max(0, indent - 1);
        }
        const result = tab.repeat(indent) + line;
        if (line.startsWith('<') && !line.startsWith('</') && !line.endsWith('/>')) {
          indent++;
        }
        return result;
      })
      .join('\n');

    return formatted;
  }

  /**
   * Copie le HTML dans le presse-papier
   */
  async copyHTML() {
    try {
      // Extraire le HTML si pas déjà fait
      if (!this.currentHTML) {
        await this.extractHTML();
      }

      // Copier dans le presse-papier
      await navigator.clipboard.writeText(this.currentHTML);

      // Feedback visuel
      const btn = document.getElementById('copy-code-btn');
      const originalText = btn.textContent;
      btn.textContent = '✅ Copié !';
      setTimeout(() => {
        btn.textContent = originalText;
      }, 2000);
    } catch (e) {
      console.error('Erreur lors de la copie:', e);
      alert('Erreur lors de la copie du HTML. Vérifiez que vous avez autorisé l\'accès au presse-papier.');
    }
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
  document.addEventListener('DOMContentLoaded', () => new UnifiedShowcase());
} else {
  new UnifiedShowcase();
}
