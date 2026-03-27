/**
 * Landing-page block registry for CMS runtime rendering.
 */
import { markRaw } from 'vue'
import { CmsBlockRegistry, type CmsBlockDefinition } from '../../index'
import {
  resolveCmsMediaBindingProps,
  type CmsMediaAssetSettings,
} from '../../white-label/index'
import {
  CmsLandingHeaderBlock,
  CmsLandingHeroBlock,
  CmsLandingStatsBlock,
  CmsLandingFeaturesBlock,
  CmsLandingCtaBlock,
  CmsLandingFooterBlock,
} from '../../blocks/index'
import { getLandingBlockMediaBindingDefinitions } from './landing.block-fields'

function createLandingMediaPropsResolver(type: string): CmsBlockDefinition['resolveProps'] {
  const bindings = getLandingBlockMediaBindingDefinitions(type)
  if (bindings.length === 0) {
    return undefined
  }

  return ({ props, context }) => {
    const mediaAssets = Array.isArray(context?.mediaAssets)
      ? context.mediaAssets as CmsMediaAssetSettings[]
      : []

    return resolveCmsMediaBindingProps({
      props,
      bindings,
      mediaAssets,
    })
  }
}

/**
 * Declares all landing block definitions available in the CMS registry.
 */
function createLandingDefinitions(): CmsBlockDefinition[] {
  return [
    {
      type: 'landing.header',
      displayName: 'Landing Header',
      category: 'layout',
      component: markRaw(CmsLandingHeaderBlock),
      resolveProps: createLandingMediaPropsResolver('landing.header'),
    },
    {
      type: 'landing.hero',
      displayName: 'Landing Hero',
      category: 'layout',
      component: markRaw(CmsLandingHeroBlock),
      resolveProps: createLandingMediaPropsResolver('landing.hero'),
    },
    {
      type: 'landing.stats',
      displayName: 'Landing Stats',
      category: 'content',
      component: markRaw(CmsLandingStatsBlock),
      resolveProps: createLandingMediaPropsResolver('landing.stats'),
    },
    {
      type: 'landing.features',
      displayName: 'Landing Features',
      category: 'content',
      component: markRaw(CmsLandingFeaturesBlock),
      resolveProps: createLandingMediaPropsResolver('landing.features'),
    },
    {
      type: 'landing.cta',
      displayName: 'Landing CTA',
      category: 'conversion',
      component: markRaw(CmsLandingCtaBlock),
      resolveProps: createLandingMediaPropsResolver('landing.cta'),
    },
    {
      type: 'landing.footer',
      displayName: 'Landing Footer',
      category: 'layout',
      component: markRaw(CmsLandingFooterBlock),
      resolveProps: createLandingMediaPropsResolver('landing.footer'),
    },
  ]
}

/**
 * Creates a CMS block registry preloaded with landing-page block definitions.
 */
export function createLandingRegistry(): CmsBlockRegistry {
  return new CmsBlockRegistry(createLandingDefinitions())
}