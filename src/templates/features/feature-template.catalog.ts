import { createTemplateCatalogEntry, type TemplateCatalogEntry } from '../contracts'

export const featureTemplateCatalog: TemplateCatalogEntry[] = [
  createTemplateCatalogEntry({
    id: 'feature-auth-login',
    area: 'feature',
    title: 'Login Template',
    description: 'Authentication login screen template with branded split layout support.',
    targetPath: 'src/templates/features/auth/LoginTemplate.vue',
    status: 'in_progress',
    customizableScopes: ['theme', 'content', 'behavior', 'a11y', 'testing'],
    sourceReferencePath: '.temp/reference/src/modules/auth/pages/LoginPage.vue',
  }),
  createTemplateCatalogEntry({
    id: 'feature-wiki',
    area: 'feature',
    title: 'Wiki Template',
    description: 'Knowledge base template with categories, filters, list/grid modes and summary.',
    targetPath: 'src/templates/features/wiki/WikiTemplate.vue',
    status: 'in_progress',
    customizableScopes: ['theme', 'content', 'data', 'behavior', 'a11y', 'testing'],
    sourceReferencePath: '.temp/reference/src/modules/wiki/pages/WikiPage.vue',
  }),
  createTemplateCatalogEntry({
    id: 'feature-wiki-chat-page',
    area: 'feature',
    title: 'Wiki Chat Page Template',
    description: 'Full page chat experience template for assistant interactions.',
    targetPath: 'src/templates/features/wiki/WikiChatTemplate.vue',
    status: 'in_progress',
    customizableScopes: ['theme', 'content', 'data', 'behavior', 'a11y', 'testing'],
    sourceReferencePath: '.temp/reference/src/modules/wiki/pages/WikiChatPage.vue',
  }),
  createTemplateCatalogEntry({
    id: 'feature-wiki-chat-drawer',
    area: 'feature',
    title: 'Wiki Chat Drawer Template',
    description: 'Floating chat drawer template with contextual prompts and sources.',
    targetPath: 'src/templates/features/wiki/WikiChatDrawerTemplate.vue',
    status: 'in_progress',
    customizableScopes: ['theme', 'content', 'data', 'behavior', 'a11y', 'testing'],
    sourceReferencePath: '.temp/reference/src/modules/wiki/components/ChatDrawer.vue',
  }),
]