// Quality Tests - W3C & RGAA validation for Showcase
class QualityTests {
  constructor() {
    this.w3cBadge = document.getElementById('w3c-badge');
    this.rgaaBadge = document.getElementById('rgaa-badge');
    this.iframe = null;
    this.w3cResults = null;
    this.rgaaResults = null;
    this.w3cError = null;
    this.rgaaError = null;
    this.localePromise = null;
    this.cachedLocale = null;
    this.modal = new QualityModal();
    this.setupEventListeners();
  }

  /**
   * Configure les event listeners sur les badges
   */
  setupEventListeners() {
    if (this.w3cBadge) {
      this.w3cBadge.addEventListener('click', () => {
        if (this.w3cResults) {
          this.modal.showW3CDetails(this.w3cResults);
        } else if (this.w3cError) {
          this.modal.showError('Validation W3C', this.w3cError);
        }
      });
    }

    if (this.rgaaBadge) {
      this.rgaaBadge.addEventListener('click', () => {
        if (this.rgaaResults) {
          this.modal.showRGAADetails(this.rgaaResults);
        } else if (this.rgaaError) {
          this.modal.showError('Tests RGAA', this.rgaaError);
        }
      });
    }
  }

  /**
   * Lance tous les tests de qualité
   */
  async runAllTests(iframe) {
    this.iframe = iframe;

    // Attendre que l'iframe soit chargée
    await this.waitForIframeLoad();
    await this.waitForIframeContent();
    await this.delay(50);

    // Lancer les tests en parallèle
    await Promise.all([
      this.runW3CValidation(),
      this.runRGAAValidation()
    ]);
  }

  /**
   * Attend que l'iframe soit complètement chargée
   */
  waitForIframeLoad() {
    return new Promise((resolve) => {
      let resolved = false;
      const currentDoc = this.iframe.contentDocument || null;

      const finish = () => {
        if (resolved) {
          return;
        }
        resolved = true;
        this.iframe.removeEventListener('load', handleLoad);
        resolve();
      };

      const handleLoad = () => {
        finish();
      };

      this.iframe.addEventListener('load', handleLoad, { once: true });

      if (currentDoc && currentDoc.readyState === 'complete') {
        setTimeout(() => {
          if (!resolved && this.iframe.contentDocument === currentDoc) {
            finish();
          }
        }, 50);
      }
    });
  }

  /**
   * Attend que le contenu utile de l'iframe soit présent
   */
  async waitForIframeContent(maxAttempts = 20, delay = 100) {
    for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
      const doc = this.iframe && this.iframe.contentDocument;
      if (doc && doc.readyState === 'complete') {
        const preview = doc.getElementById('component-preview');
        const hasComponent = preview && preview.innerHTML && preview.innerHTML.trim().length > 0;
        const hasBodyContent = doc.body && doc.body.innerHTML && doc.body.innerHTML.trim().length > 0;
        if (hasComponent || hasBodyContent) {
          return;
        }
      }
      await this.delay(delay);
    }

    console.warn('QualityTests: iframe content still empty after wait');
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Validation W3C HTML
   */
  async runW3CValidation() {
    console.log('🔍 W3C Validation started');
    try {
      // Récupérer le HTML à tester
      const result = this.getIframeHTML();
      console.log('Result from getIframeHTML:', result);

      if (!result || !result.html) {
        console.error('❌ No HTML found');
        this.updateW3CBadge('error', '❌ Erreur', 'Impossible de récupérer le HTML');
        return;
      }

      // Déterminer le HTML à envoyer au validator
      let validHTML;

      if (result.isFullDocument) {
        // Page complète : envoyer tel quel
        validHTML = result.html;
        console.log('📄 Testing FULL DOCUMENT (page)');
      } else {
        // Composant : envelopper dans un document HTML minimal
        validHTML = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Component Test</title>
</head>
<body>
${result.html}
</body>
</html>`;
        console.log('🧩 Testing COMPONENT (wrapped in minimal HTML)');
      }

      //console.log('HTML envoyé au validator W3C:', validHTML);

      // Appeler l'API W3C Validator avec le bon Content-Type
      const response = await fetch('https://validator.w3.org/nu/?out=json', {
        method: 'POST',
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Accept': 'application/json'
        },
        body: validHTML
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('W3C API Error:', response.status, errorText);
        throw new Error(`API W3C error (${response.status}): ${errorText.substring(0, 100)}`);
      }

      const data = await response.json();

      // Stocker les résultats
      this.w3cResults = data;
      this.w3cError = null;

      console.log('W3C Response:', data); // Debug
      console.log('W3C Messages:', data.messages); // Debug détaillé

      // Compter les erreurs et warnings
      const errors = data.messages ? data.messages.filter(m => m.type === 'error').length : 0;
      const warnings = data.messages ? data.messages.filter(m => m.type === 'info' || m.type === 'warning').length : 0;

      if (errors === 0 && warnings === 0) {
        this.updateW3CBadge('success', '✅ 100%', 'Validation parfaite - Cliquer pour détails');
      } else if (errors === 0) {
        this.updateW3CBadge('warning', `⚠️ ${warnings} warning(s)`, `${warnings} avertissement(s) - Cliquer pour détails`);
      } else {
        this.updateW3CBadge('error', `❌ ${errors} erreur(s)`, `${errors} erreur(s), ${warnings} warning(s) - Cliquer pour détails`);
      }

    } catch (error) {
      console.error('W3C Validation error:', error);
      console.error('Error details:', error.message, error.stack);
      this.w3cError = error && error.message ? error.message : 'Erreur inconnue';
      this.updateW3CBadge('error', '❌ Erreur', `Test W3C échoué: ${this.w3cError}`);
      this.w3cResults = null; // Pas de résultats en cas d'erreur
    }
  }

  /**
   * Tests RGAA avec Axe-core
   */
  async runRGAAValidation() {
    try {
      const iframeWindow = this.iframe.contentWindow;
      const iframeDoc = this.iframe.contentDocument || (iframeWindow ? iframeWindow.document : null);

      if (!iframeDoc || !iframeWindow) {
        this.rgaaError = "Impossible d'accéder au document";
        this.updateRGAABadge('error', '❌ Erreur', this.rgaaError);
        return;
      }

      const axeInstance = await this.ensureIframeAxe();
      if (!axeInstance) {
        this.rgaaError = 'Axe-core non disponible dans l\'iframe';
        this.updateRGAABadge('error', '❌ Erreur', this.rgaaError);
        return;
      }

      // Déterminer le contexte à tester
      let axeContext = null;

      // Cas 1: Component (a un #component-preview)
      const componentPreview = iframeDoc.getElementById('component-preview');
      if (componentPreview && componentPreview.firstElementChild) {
        // Tester uniquement le composant (premier enfant de #component-preview)
        axeContext = componentPreview.firstElementChild;
        console.log('🔍 RGAA testing COMPONENT:', axeContext);
      } else {
        // Cas 2: Page complète (pas de #component-preview)
        // On teste le body entier car c'est une vraie page
        axeContext = iframeDoc.body;
        console.log('🔍 RGAA testing PAGE (body):', axeContext);
      }

      if (!axeContext) {
        this.rgaaError = 'Aucun contenu à analyser';
        this.updateRGAABadge('error', '❌ Erreur', this.rgaaError);
        return;
      }

      // Options Axe : désactiver les règles de structure de page pour les composants
      const isComponent = componentPreview !== null;
      const axeOptions = {
        rules: {
          'frame-title': { enabled: false },
          // Pour les composants, désactiver les règles de structure de page
          'html-has-lang': { enabled: !isComponent },
          'landmark-one-main': { enabled: !isComponent },
          'page-has-heading-one': { enabled: false }, // Toujours désactivé car optionnel
          'region': { enabled: !isComponent },
          'document-title': { enabled: !isComponent }
        }
      };

      const results = await axeInstance.run(axeContext, axeOptions);

      // Stocker les résultats
      this.rgaaResults = results;
      this.rgaaError = null;

      // Calculer le score
      const violations = results.violations.length;
      const passes = results.passes.length;
      const total = violations + passes;
      const score = total > 0 ? Math.round((passes / total) * 100) : 100;

      // Compter le nombre total d'alertes
      const totalAlerts = results.violations.reduce((sum, v) => sum + v.nodes.length, 0);

      if (violations === 0) {
        this.updateRGAABadge('success', `✅ ${score}%`, 'Aucune violation détectée - Cliquer pour détails');
      } else if (violations <= 3) {
        this.updateRGAABadge('warning', `⚠️ ${score}% (${totalAlerts} alerte${totalAlerts > 1 ? 's' : ''})`,
          `${violations} violation${violations > 1 ? 's' : ''}, ${totalAlerts} alerte${totalAlerts > 1 ? 's' : ''} - Cliquer pour détails`);
      } else {
        this.updateRGAABadge('error', `❌ ${score}% (${totalAlerts} alerte${totalAlerts > 1 ? 's' : ''})`,
          `${violations} violation${violations > 1 ? 's' : ''} - Cliquer pour détails`);
      }

      // Logger les détails pour debug
      if (violations > 0) {
        console.group('🔍 RGAA Violations détectées:');
        results.violations.forEach(violation => {
          console.log(`- ${violation.help} (${violation.nodes.length} occurrence${violation.nodes.length > 1 ? 's' : ''})`);
          console.log(`  Impact: ${violation.impact}`);
          console.log(`  Description: ${violation.description}`);
        });
        console.groupEnd();
      }

    } catch (error) {
      console.error("RGAA Validation error:", error);
      this.rgaaError = error && error.message ? error.message : "Test RGAA échoué";
      this.updateRGAABadge("error", "❌ Erreur", this.rgaaError);
    }
  }

  async getAxeLocale() {
    if (this.cachedLocale) {
      return this.cachedLocale;
    }

    if (window.__axeLocale) {
      this.cachedLocale = window.__axeLocale;
      return this.cachedLocale;
    }

    if (!this.localePromise) {
      const localeScript = document.getElementById("axe-locale-fr");
      if (localeScript && localeScript.src) {
        this.localePromise = fetch(localeScript.src)
          .then(res => (res.ok ? res.json() : null))
          .then(locale => {
            if (locale) {
              window.__axeLocale = locale;
            }
            return locale;
          })
          .catch(() => null);
      } else {
        this.localePromise = Promise.resolve(null);
      }
    }

    this.cachedLocale = await this.localePromise;
    return this.cachedLocale;
  }

  getAxeScriptSrc() {
    const script = document.querySelector("script[src*='axe']");
    return script ? script.getAttribute("src") : null;
  }

  async ensureIframeAxe() {
    if (!this.iframe) {
      return null;
    }

    const iframeWindow = this.iframe.contentWindow;
    const iframeDoc = this.iframe.contentDocument || (iframeWindow ? iframeWindow.document : null);

    if (!iframeWindow || !iframeDoc) {
      return null;
    }

    let axeInstance = iframeWindow.axe;

    if (!axeInstance) {
      const scriptSrc = this.getAxeScriptSrc();
      if (!scriptSrc) {
        console.warn("Script axe-core introuvable dans la page parente.");
        return null;
      }

      try {
        await new Promise((resolve, reject) => {
          const script = iframeDoc.createElement("script");
          script.src = scriptSrc;
          script.dataset.axeInjected = "true";
          script.onload = () => resolve();
          script.onerror = () => reject(new Error("Impossible de charger axe-core dans l'iframe"));
          (iframeDoc.head || iframeDoc.body).appendChild(script);
        });
      } catch (error) {
        console.error(error);
        return null;
      }

      axeInstance = iframeWindow.axe;
      if (!axeInstance) {
        return null;
      }
    }

    const locale = await this.getAxeLocale();
    if (locale && typeof axeInstance.configure === "function") {
      axeInstance.configure({ locale });
    }

    return axeInstance;
  }

  /**
   * Récupère le HTML à tester
   * @returns {Object} { html: string, isFullDocument: boolean }
   */
  getIframeHTML() {
    try {
      if (!this.iframe.contentDocument) {
        return null;
      }

      const doc = this.iframe.contentDocument;

      // Cas 1: Component (a un #component-preview)
      const componentPreview = doc.getElementById('component-preview');
      if (componentPreview && componentPreview.innerHTML && componentPreview.innerHTML.trim()) {
        // Retourner uniquement le composant (sera enveloppé dans un document HTML)
        const firstChild = componentPreview.firstElementChild;
        if (firstChild) {
          return {
            html: firstChild.outerHTML,
            isFullDocument: false
          };
        }
        return {
          html: componentPreview.innerHTML,
          isFullDocument: false
        };
      }

      // Cas 2: Page complète (pas de #component-preview)
      // Retourner le document HTML entier
      return {
        html: doc.documentElement.outerHTML,
        isFullDocument: true
      };

    } catch (e) {
      console.error('Error getting iframe HTML:', e);
      return null;
    }
  }

  /**
   * Met à jour le badge W3C
   */
  updateW3CBadge(status, text, title) {
    this.w3cBadge.className = `quality-badge quality-badge--${status}`;
    this.w3cBadge.querySelector('.quality-badge__status').textContent = text;
    this.w3cBadge.title = title;
  }

  /**
   * Met à jour le badge RGAA
   */
  updateRGAABadge(status, text, title) {
    this.rgaaBadge.className = `quality-badge quality-badge--${status}`;
    this.rgaaBadge.querySelector('.quality-badge__status').textContent = text;
    this.rgaaBadge.title = title;
  }
}

// Classe pour gérer la modale
class QualityModal {
  constructor() {
    this.modal = document.getElementById('quality-modal');
    this.backdrop = document.getElementById('modal-backdrop');
    this.closeBtn = document.getElementById('modal-close');
    this.title = document.getElementById('modal-title');
    this.body = document.getElementById('modal-body');

    this.setupEventListeners();
  }

  setupEventListeners() {
    this.closeBtn.addEventListener('click', () => this.close());
    this.backdrop.addEventListener('click', () => this.close());

    // Fermer avec Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal.classList.contains('active')) {
        this.close();
      }
    });
  }

  open(title, content) {
    this.title.textContent = title;
    this.body.innerHTML = content;
    this.modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  showError(title, message) {
    const content = `
      <div class="test-result__empty">
        <div class="test-result__empty-icon">⚠️</div>
        <p>${this.escapeHtml(message)}</p>
      </div>
    `;
    this.open(title, content);
  }

  showW3CDetails(data) {
    const errors = data.messages.filter(m => m.type === 'error');
    const warnings = data.messages.filter(m => m.type === 'info' || m.type === 'warning');
    const total = errors.length + warnings.length;

    let content = '';

    // Résumé
    const icon = errors.length === 0 ? '✅' : (errors.length <= 3 ? '⚠️' : '❌');
    content += `
      <div class="test-result__summary">
        <div class="test-result__summary-icon">${icon}</div>
        <div class="test-result__summary-text">
          <h3>Validation W3C HTML</h3>
          <p>${errors.length} erreur(s) et ${warnings.length} avertissement(s) détecté(s)</p>
        </div>
      </div>
    `;

    if (total === 0) {
      content += `
        <div class="test-result__empty">
          <div class="test-result__empty-icon">🎉</div>
          <p>Aucune erreur ou avertissement détecté !</p>
        </div>
      `;
    } else {
      content += '<ul class="test-result__list">';

      // Afficher les erreurs
      errors.forEach(error => {
        content += `
          <li class="test-result__item test-result__item--error">
            <div class="test-result__item-header">
              <span class="test-result__item-icon">❌</span>
              <h4 class="test-result__item-title">${this.escapeHtml(error.message)}</h4>
            </div>
            ${error.extract ? `<p class="test-result__item-description">Extrait: <code>${this.escapeHtml(error.extract)}</code></p>` : ''}
            ${error.lastLine ? `<div class="test-result__item-location">📍 Ligne ${error.lastLine}, colonne ${error.lastColumn || '?'}</div>` : ''}
          </li>
        `;
      });

      // Afficher les warnings
      warnings.forEach(warning => {
        content += `
          <li class="test-result__item test-result__item--warning">
            <div class="test-result__item-header">
              <span class="test-result__item-icon">⚠️</span>
              <h4 class="test-result__item-title">${this.escapeHtml(warning.message)}</h4>
            </div>
            ${warning.extract ? `<p class="test-result__item-description">Extrait: <code>${this.escapeHtml(warning.extract)}</code></p>` : ''}
            ${warning.lastLine ? `<div class="test-result__item-location">📍 Ligne ${warning.lastLine}, colonne ${warning.lastColumn || '?'}</div>` : ''}
          </li>
        `;
      });

      content += '</ul>';
    }

    this.open('Détails de validation W3C', content);
  }

  showRGAADetails(results) {
    const violations = results.violations;
    const passes = results.passes.length;
    const total = violations.length + passes;
    const score = total > 0 ? Math.round((passes / total) * 100) : 100;
    const totalAlerts = violations.reduce((sum, v) => sum + v.nodes.length, 0);

    let content = '';

    // Résumé
    const icon = violations.length === 0 ? '✅' : (violations.length <= 3 ? '⚠️' : '❌');
    content += `
      <div class="test-result__summary">
        <div class="test-result__summary-icon">${icon}</div>
        <div class="test-result__summary-text">
          <h3>Tests d'accessibilité RGAA (Axe-core)</h3>
          <p>Score: ${score}% • ${violations.length} violation(s) • ${totalAlerts} alerte(s) au total</p>
        </div>
      </div>
    `;

    if (violations.length === 0) {
      content += `
        <div class="test-result__empty">
          <div class="test-result__empty-icon">🎉</div>
          <p>Aucune violation d'accessibilité détectée !</p>
        </div>
      `;
    } else {
      content += '<ul class="test-result__list">';

      violations.forEach(violation => {
        const impactIcon = {
          critical: '🔴',
          serious: '🟠',
          moderate: '🟡',
          minor: '🔵'
        }[violation.impact] || '⚪';

        content += `
          <li class="test-result__item test-result__item--${violation.impact === 'critical' || violation.impact === 'serious' ? 'error' : 'warning'}">
            <div class="test-result__item-header">
              <span class="test-result__item-icon">${impactIcon}</span>
              <h4 class="test-result__item-title">${this.escapeHtml(violation.help)}</h4>
            </div>
            <p class="test-result__item-description">
              ${this.escapeHtml(violation.description)}<br>
              <strong>Impact :</strong> ${violation.impact} •
              <strong>Occurrences :</strong> ${violation.nodes.length}
            </p>
            ${violation.helpUrl ? `
              <div class="test-result__item-location">
                🔗 <a href="${violation.helpUrl}" target="_blank" rel="noopener">Plus d'informations</a>
              </div>
            ` : ''}

            ${violation.nodes.length > 0 ? `
              <details style="margin-top: 1rem;">
                <summary style="cursor: pointer; font-weight: 500; padding: 0.5rem; background: #f7fafc; border-radius: 0.25rem;">
                  📍 Voir les ${violation.nodes.length} élément(s) impacté(s)
                </summary>
                <div style="margin-top: 0.5rem; padding-left: 1rem;">
                  ${violation.nodes.map((node, index) => `
                    <div style="margin-bottom: 1rem; padding: 0.75rem; background: #fff; border-left: 3px solid #e53e3e; border-radius: 0.25rem;">
                      <div style="font-weight: 500; margin-bottom: 0.5rem;">Élément ${index + 1}</div>

                      ${node.target && node.target.length > 0 ? `
                        <div style="margin-bottom: 0.5rem;">
                          <strong>Sélecteur CSS :</strong>
                          <code style="display: block; background: #f7fafc; padding: 0.25rem 0.5rem; border-radius: 0.25rem; margin-top: 0.25rem; overflow-x: auto;">
                            ${this.escapeHtml(node.target.join(' '))}
                          </code>
                        </div>
                      ` : ''}

                      ${node.html ? `
                        <div style="margin-bottom: 0.5rem;">
                          <strong>Code HTML :</strong>
                          <code style="display: block; background: #f7fafc; padding: 0.25rem 0.5rem; border-radius: 0.25rem; margin-top: 0.25rem; overflow-x: auto; white-space: pre-wrap; word-break: break-all;">
                            ${this.escapeHtml(node.html)}
                          </code>
                        </div>
                      ` : ''}

                      ${node.failureSummary ? `
                        <div>
                          <strong>Problème détecté :</strong>
                          <div style="color: #e53e3e; margin-top: 0.25rem;">
                            ${this.escapeHtml(node.failureSummary)}
                          </div>
                        </div>
                      ` : ''}
                    </div>
                  `).join('')}
                </div>
              </details>
            ` : ''}
          </li>
        `;
      });

      content += '</ul>';
    }

    this.open('Détails des tests RGAA', content);
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Export pour utilisation dans page-showcase.js
window.QualityTests = QualityTests;
