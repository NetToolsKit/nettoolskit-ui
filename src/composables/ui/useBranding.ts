/**
 * Src/composables/ui/use Branding module.
 */

import { computed } from 'vue';
import { useTheme } from './useTheme';
import type { LogoConfig } from '../../config/brand/identity.config';
import { getContent, type BrandContent, type ContactInfo, type FooterSection } from '../../config/brand/content.config';
import { getNavigation, type BrandNavigation, type CTAButton, type NavLink } from '../../config/brand/navigation.config';
import type { BrandName } from '../../config/brand/identity.config';

type ThemeLogo = LogoConfig;
const KNOWN_BRANDS: BrandName[] = ['sentinela', 'platea', 'nettoolskit'];

/**
 * Centralized composable for accessing branding data.
 * Includes logo, colors, app information, contacts, and navigation.
 *
 * @example
 * ```vue
 * <script setup>
 * import { useBranding } from '@nettoolskit/ui-vue'
 *
 * const { logo, appName, tagline, primaryColor } = useBranding()
 * </script>
 *
 * <template>
 *   <h1>{{ appName }}</h1>
 *   <p>{{ tagline }}</p>
 * </template>
 * ```
 */
export function useBranding() {
  const { theme, logo: themeLogo } = useTheme();
  const activeBrand = computed<BrandName>(() => {
    const identityName = String(theme.value.identity?.name || '').toLowerCase();
    if (KNOWN_BRANDS.includes(identityName as BrandName)) {
      return identityName as BrandName;
    }
    return 'nettoolskit';
  });
  const content = computed<BrandContent>(() => getContent(activeBrand.value));
  const navigation = computed<BrandNavigation>(() => getNavigation(activeBrand.value));

  /**
   * Logo configuration from active theme
   */
  const logo = computed<ThemeLogo>(() => themeLogo.value);

  /**
   * App name from theme
   */
  const appName = computed<string>(() => theme.value.identity.displayName || theme.value.name);

  /**
   * App description/tagline from theme
   */
  const tagline = computed<string>(() => theme.value.identity.tagline || '');

  /**
   * App URL from theme
   */
  const appUrl = computed<string>(() => theme.value.identity.url || '');

  /**
   * Primary brand color
   */
  const primaryColor = computed<string>(() => 'var(--ntk-primary)');

  /**
   * Secondary brand color
   */
  const secondaryColor = computed<string>(() => 'var(--ntk-secondary)');

  /**
   * Accent brand color
   */
  const accentColor = computed<string>(() => 'var(--ntk-accent)');

  /**
   * Contact information from brand content config
   */
  const contact = computed<ContactInfo>(() => content.value.contact || {});

  /**
   * Social media links as { [platform]: url } map
   */
  const social = computed<Record<string, string>>(() => {
    const entries = content.value.social || [];
    return entries.reduce<Record<string, string>>((acc, item) => {
      if (item?.platform && item?.url) {
        acc[item.platform.toLowerCase()] = item.url;
      }
      return acc;
    }, {});
  });

  /**
   * Header navigation links
   */
  const navLinks = computed<NavLink[]>(() => navigation.value.header || []);

  /**
   * Primary CTA button config
   */
  const primaryCTA = computed<CTAButton | undefined>(() => navigation.value.primaryCTA);

  /**
   * Secondary CTA button config
   */
  const secondaryCTA = computed<CTAButton | undefined>(() => navigation.value.secondaryCTA);

  /**
   * Footer link sections from content config
   */
  const footerSections = computed<FooterSection[]>(() => content.value.footerSections || []);

  return {
    // Logo
    logo,

    // App Info
    appName,
    tagline,
    appUrl,

    // Colors
    primaryColor,
    secondaryColor,
    accentColor,

    // Contact & Social
    contact,
    social,
    navLinks,
    primaryCTA,
    secondaryCTA,
    footerSections,
  };
}
