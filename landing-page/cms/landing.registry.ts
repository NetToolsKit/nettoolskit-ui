import { markRaw } from 'vue'
import { CmsBlockRegistry, type CmsBlockDefinition } from '../../src/modules/cms'
import {
  CmsLandingHeaderBlock,
  CmsLandingHeroBlock,
  CmsLandingStatsBlock,
  CmsLandingFeaturesBlock,
  CmsLandingCtaBlock,
  CmsLandingFooterBlock,
} from '../../src/modules/cms/blocks'

function createLandingDefinitions(): CmsBlockDefinition[] {
  return [
    {
      type: 'landing.header',
      displayName: 'Landing Header',
      category: 'layout',
      component: markRaw(CmsLandingHeaderBlock),
    },
    {
      type: 'landing.hero',
      displayName: 'Landing Hero',
      category: 'layout',
      component: markRaw(CmsLandingHeroBlock),
    },
    {
      type: 'landing.stats',
      displayName: 'Landing Stats',
      category: 'content',
      component: markRaw(CmsLandingStatsBlock),
    },
    {
      type: 'landing.features',
      displayName: 'Landing Features',
      category: 'content',
      component: markRaw(CmsLandingFeaturesBlock),
    },
    {
      type: 'landing.cta',
      displayName: 'Landing CTA',
      category: 'conversion',
      component: markRaw(CmsLandingCtaBlock),
    },
    {
      type: 'landing.footer',
      displayName: 'Landing Footer',
      category: 'layout',
      component: markRaw(CmsLandingFooterBlock),
    },
  ]
}

export function createLandingRegistry(): CmsBlockRegistry {
  return new CmsBlockRegistry(createLandingDefinitions())
}