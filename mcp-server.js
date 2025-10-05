#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtenir __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Créer le serveur MCP
const server = new Server(
  {
    name: 'design-system-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Tool 1: Lister les outils disponibles
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'list_components',
        description: 'Liste tous les composants du design system avec leurs configurations',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'read_component',
        description: 'Lit tous les fichiers d\'un composant spécifique (JSON, Twig, SCSS)',
        inputSchema: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Nom du composant (ex: button, card, input)',
            },
          },
          required: ['name'],
        },
      },
      {
        name: 'create_component',
        description: 'Crée un nouveau composant avec ses fichiers JSON, Twig et SCSS',
        inputSchema: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Nom du composant (kebab-case)',
            },
            displayName: {
              type: 'string',
              description: 'Nom d\'affichage du composant',
            },
            category: {
              type: 'string',
              description: 'Catégorie du composant (Forms, Layout, Navigation, etc.)',
            },
            description: {
              type: 'string',
              description: 'Description du composant',
            },
            json: {
              type: 'string',
              description: 'Contenu complet du fichier JSON de configuration',
            },
            twig: {
              type: 'string',
              description: 'Contenu complet du template Twig',
            },
            scss: {
              type: 'string',
              description: 'Contenu complet du fichier SCSS',
            },
          },
          required: ['name', 'displayName', 'category', 'description', 'json', 'twig', 'scss'],
        },
      },
      {
        name: 'update_component',
        description: 'Met à jour un ou plusieurs fichiers d\'un composant existant',
        inputSchema: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Nom du composant à modifier',
            },
            json: {
              type: 'string',
              description: 'Nouveau contenu du fichier JSON (optionnel)',
            },
            twig: {
              type: 'string',
              description: 'Nouveau contenu du fichier Twig (optionnel)',
            },
            scss: {
              type: 'string',
              description: 'Nouveau contenu du fichier SCSS (optionnel)',
            },
          },
          required: ['name'],
        },
      },
      {
        name: 'get_design_tokens',
        description: 'Récupère toutes les variables du design system (couleurs, espacements, etc.)',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
    ],
  };
});

// Handler pour les appels de tools
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'list_components': {
        const showcasePath = path.join(__dirname, 'dev/data/showcase.json');
        
        if (!fs.existsSync(showcasePath)) {
          return {
            content: [
              {
                type: 'text',
                text: 'Aucun fichier showcase.json trouvé. Lancez `npm run dev` pour générer le showcase.',
              },
            ],
          };
        }

        const showcase = JSON.parse(fs.readFileSync(showcasePath, 'utf8'));
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(showcase, null, 2),
            },
          ],
        };
      }

      case 'read_component': {
        const componentName = args.name;
        const componentDir = path.join(__dirname, 'dev/components', componentName);

        if (!fs.existsSync(componentDir)) {
          return {
            content: [
              {
                type: 'text',
                text: `Composant "${componentName}" non trouvé.`,
              },
            ],
          };
        }

        const jsonPath = path.join(componentDir, `${componentName}.json`);
        const twigPath = path.join(componentDir, `${componentName}.twig`);
        const scssPath = path.join(__dirname, 'dev/assets/scss/components', `_${componentName}.scss`);

        const result = {
          name: componentName,
          files: {}
        };

        if (fs.existsSync(jsonPath)) {
          result.files.json = fs.readFileSync(jsonPath, 'utf8');
        }

        if (fs.existsSync(twigPath)) {
          result.files.twig = fs.readFileSync(twigPath, 'utf8');
        }

        if (fs.existsSync(scssPath)) {
          result.files.scss = fs.readFileSync(scssPath, 'utf8');
        }

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'create_component': {
        const { name: componentName, json, twig, scss } = args;
        
        // Créer le dossier du composant
        const componentDir = path.join(__dirname, 'dev/components', componentName);
        
        if (fs.existsSync(componentDir)) {
          return {
            content: [
              {
                type: 'text',
                text: `❌ Le composant "${componentName}" existe déjà.`,
              },
            ],
          };
        }

        fs.mkdirSync(componentDir, { recursive: true });

        // Créer les fichiers
        fs.writeFileSync(path.join(componentDir, `${componentName}.json`), json);
        fs.writeFileSync(path.join(componentDir, `${componentName}.twig`), twig);
        
        const scssDir = path.join(__dirname, 'dev/assets/scss/components');
        if (!fs.existsSync(scssDir)) {
          fs.mkdirSync(scssDir, { recursive: true });
        }
        fs.writeFileSync(path.join(scssDir, `_${componentName}.scss`), scss);

        // Ajouter l'import SCSS dans style.scss
        const stylePath = path.join(__dirname, 'dev/assets/scss/style.scss');
        if (fs.existsSync(stylePath)) {
          let styleContent = fs.readFileSync(stylePath, 'utf8');
          const importLine = `@import 'components/${componentName}';`;
          
          if (!styleContent.includes(importLine)) {
            // Ajouter après les autres imports de composants
            const lastComponentImport = styleContent.lastIndexOf("@import 'components/");
            if (lastComponentImport !== -1) {
              const lineEnd = styleContent.indexOf('\n', lastComponentImport);
              styleContent = 
                styleContent.slice(0, lineEnd + 1) + 
                importLine + '\n' + 
                styleContent.slice(lineEnd + 1);
            } else {
              styleContent += '\n' + importLine;
            }
            fs.writeFileSync(stylePath, styleContent);
          }
        }

        return {
          content: [
            {
              type: 'text',
              text: `✅ Composant "${componentName}" créé avec succès!

Fichiers créés:
- dev/components/${componentName}/${componentName}.json
- dev/components/${componentName}/${componentName}.twig
- dev/assets/scss/components/_${componentName}.scss

Import SCSS ajouté à style.scss

Lancez \`npm run dev\` pour voir le composant dans le showcase.`,
            },
          ],
        };
      }

      case 'update_component': {
        const { name: componentName, json, twig, scss } = args;
        const componentDir = path.join(__dirname, 'dev/components', componentName);

        if (!fs.existsSync(componentDir)) {
          return {
            content: [
              {
                type: 'text',
                text: `❌ Composant "${componentName}" non trouvé.`,
              },
            ],
          };
        }

        const updates = [];

        if (json) {
          fs.writeFileSync(path.join(componentDir, `${componentName}.json`), json);
          updates.push('JSON');
        }

        if (twig) {
          fs.writeFileSync(path.join(componentDir, `${componentName}.twig`), twig);
          updates.push('Twig');
        }

        if (scss) {
          const scssPath = path.join(__dirname, 'dev/assets/scss/components', `_${componentName}.scss`);
          fs.writeFileSync(scssPath, scss);
          updates.push('SCSS');
        }

        return {
          content: [
            {
              type: 'text',
              text: `✅ Composant "${componentName}" mis à jour!

Fichiers modifiés: ${updates.join(', ')}`,
            },
          ],
        };
      }

      case 'get_design_tokens': {
        const variablesPath = path.join(__dirname, 'dev/assets/scss/base/_variables.scss');
        
        if (!fs.existsSync(variablesPath)) {
          return {
            content: [
              {
                type: 'text',
                text: 'Fichier de variables SCSS non trouvé.',
              },
            ],
          };
        }

        const variables = fs.readFileSync(variablesPath, 'utf8');

        return {
          content: [
            {
              type: 'text',
              text: `Variables du design system:\n\n${variables}`,
            },
          ],
        };
      }

      default:
        return {
          content: [
            {
              type: 'text',
              text: `❌ Tool "${name}" inconnu.`,
            },
          ],
        };
    }
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `❌ Erreur: ${error.message}\n\nStack: ${error.stack}`,
        },
      ],
    };
  }
});

// Démarrer le serveur
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('✅ Design System MCP Server running on stdio');
}

main().catch((error) => {
  console.error('❌ Server error:', error);
  process.exit(1);
});