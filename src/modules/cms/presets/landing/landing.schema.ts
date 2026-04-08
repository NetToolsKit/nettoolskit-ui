/**
 * Default landing-page schema consumed by the CMS page renderer.
 */
import { CMS_SCHEMA_VERSION, type CmsPageSchema } from '../../index'

/**
 * Canonical landing-page schema with sections, block props and metadata.
 */
export const landingPageSchema: CmsPageSchema = {
  version: CMS_SCHEMA_VERSION,
  id: 'landing-nettoolskit-cms',
  slug: '/',
  title: 'NetToolsKit UI Vue - CMS Landing',
  status: 'draft',
  sections: [
    {
      id: 'header',
      layout: 'single',
      blocks: [
        {
          id: 'header-main',
          type: 'landing.header',
          props: {
            logoText: 'NetToolsKit UI',
            sticky: true,
            navItems: [
              { label: 'Features', href: '#features' },
              { label: 'Installation', href: '#installation' },
              { label: 'GitHub', href: 'https://github.com/ThiagoGuislotti/nettoolskit-ui-vue', external: true },
            ],
            ctaText: 'View on GitHub',
            ctaLink: 'https://github.com/ThiagoGuislotti/nettoolskit-ui-vue',
            ctaVariant: 'primary',
          },
        },
      ],
    },
    {
      id: 'hero',
      layout: 'single',
      blocks: [
        {
          id: 'hero-main',
          type: 'landing.hero',
          props: {
            variant: 'gradient',
            layout: 'split',
            size: 'lg',
            badge: 'CMS + Vue 3 + Quasar',
            title: 'Build Landing Pages with a Schema-Driven CMS',
            subtitle:
              'This page is rendered by the CMS module using reusable Ntk components, dynamic configuration, and a block registry.',
            image: '/hero-visual.png',
            imageAlt: 'NetToolsKit UI landing hero',
            videoWebm: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm',
            videoMp4: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
            videoPoster: '/hero-visual.png',
            videoAutoplay: true,
            videoLoop: true,
            videoMuted: true,
            videoPlaysinline: true,
            videoControls: false,
            videoPreload: 'metadata',
            revealOnScroll: true,
            revealMask: true,
            revealOnce: false,
            parallaxEnabled: true,
            parallaxStrength: 18,
            primaryAction: {
              label: 'Get Started',
              href: '#features',
            },
            secondaryAction: {
              label: 'See Docs',
              href: 'https://github.com/ThiagoGuislotti/nettoolskit-ui-vue/blob/main/README.md',
              external: true,
            },
          },
        },
      ],
    },
    {
      id: 'stats',
      layout: 'single',
      blocks: [
        {
          id: 'stats-main',
          type: 'landing.stats',
          props: {
            title: 'CMS Runtime Metrics',
            subtitle: 'Live blocks rendered by schema and registry.',
            variant: 'light',
            size: 'md',
            cardVariant: 'gradient',
            items: [
              { id: 'components', value: 22, suffix: '+', label: 'Reusable Components', icon: '🧩' },
              { id: 'composables', value: 11, label: 'Composable Utilities', icon: '⚙️' },
              { id: 'themes', value: 3, label: 'Theme Profiles', icon: '🎨' },
              { id: 'schema', value: '1.0', label: 'Schema Version', icon: '📄' },
            ],
          },
        },
      ],
    },
    {
      id: 'features',
      layout: 'single',
      blocks: [
        {
          id: 'features-main',
          type: 'landing.features',
          props: {
            title: 'Why This CMS Approach',
            subtitle:
              'Open/closed block registration, schema validation, reusable tokens, and tenant-ready white-label architecture.',
            variant: 'default',
            size: 'lg',
            cardVariant: 'elevated',
            iconStyle: 'gradient',
            cinematicCardsEnabled: true,
            cinematicCardsTilt: 6,
            cinematicCardsGlow: 0.28,
            cinematicCardsPerspective: 920,
            items: [
              {
                id: 'solid',
                icon: '🧱',
                title: 'SOLID by Design',
                description: 'Registry, renderer, and schema validation are split by responsibility.',
              },
              {
                id: 'whitelabel',
                icon: '🏷️',
                title: 'White-Label Ready',
                description: 'Theme and branding configs are decoupled from page structure.',
              },
              {
                id: 'reuse',
                icon: '♻️',
                title: 'Component Reuse',
                description: 'Landing blocks compose existing Ntk components without duplication.',
              },
              {
                id: 'dynamic',
                icon: '🔌',
                title: 'Dynamic Composition',
                description: 'Sections and blocks can be reordered via schema without changing core.',
              },
              {
                id: 'validation',
                icon: '✅',
                title: 'Schema Validation',
                description: 'Page integrity is validated before runtime rendering.',
              },
              {
                id: 'fallback',
                icon: '🛟',
                title: 'Safe Fallback',
                description: 'Unknown blocks render a safe fallback instead of breaking the page.',
              },
            ],
          },
        },
      ],
    },
    {
      id: 'installation',
      layout: 'single',
      blocks: [
        {
          id: 'cta-install',
          type: 'landing.cta',
          props: {
            title: 'Ready to Build with CMS Blocks?',
            subtitle: 'Use the schema + registry flow to publish dynamic pages fast.',
            variant: 'gradient',
            layout: 'centered',
            size: 'md',
            primaryCTA: {
              text: 'Open Repository',
              link: 'https://github.com/ThiagoGuislotti/nettoolskit-ui-vue',
            },
            secondaryCTA: {
              text: 'Read Documentation',
              link: 'https://github.com/ThiagoGuislotti/nettoolskit-ui-vue/blob/main/README.md',
            },
          },
        },
      ],
    },
    {
      id: 'footer',
      layout: 'single',
      blocks: [
        {
          id: 'footer-main',
          type: 'landing.footer',
          props: {
            variant: 'dark',
            brandName: 'NetToolsKit UI Vue',
            brandDescription:
              'Schema-driven CMS landing built with reusable Vue 3 + Quasar components.',
            socialTitle: 'Related',
            linkSections: [
              {
                title: 'Resources',
                links: [
                  {
                    label: 'Documentation',
                    href: 'https://github.com/ThiagoGuislotti/nettoolskit-ui-vue/blob/main/README.md',
                    external: true,
                  },
                  {
                    label: 'Components',
                    href: 'https://github.com/ThiagoGuislotti/nettoolskit-ui-vue/tree/main/src/components',
                    external: true,
                  },
                  {
                    label: 'Composables',
                    href: 'https://github.com/ThiagoGuislotti/nettoolskit-ui-vue/tree/main/src/composables',
                    external: true,
                  },
                ],
              },
              {
                title: 'Related',
                links: [
                  {
                    label: 'Copilot Instructions',
                    href: 'https://github.com/ThiagoGuislotti/copilot-instructions',
                    external: true,
                  },
                  {
                    label: 'NTK CLI (Rust)',
                    href: 'https://github.com/ThiagoGuislotti/nettoolskit-cli',
                    external: true,
                  },
                ],
              },
            ],
            socialLinks: [
              {
                icon: 'code',
                href: 'https://github.com/ThiagoGuislotti/nettoolskit-ui-vue',
                label: 'GitHub',
              },
              {
                icon: 'link',
                href: 'https://linkedin.com/in/thiagoguislotti',
                label: 'LinkedIn',
              },
            ],
          },
        },
      ],
    },
  ],
  metadata: {
    createdAt: '2026-02-24T00:00:00.000Z',
    updatedAt: '2026-02-24T00:00:00.000Z',
    createdBy: 'codex',
    updatedBy: 'codex',
  },
}