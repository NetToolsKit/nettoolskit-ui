import { computed } from 'vue';
import { useTheme } from './useTheme';
import type { LogoConfig } from '../../config/brand/identity.config';

type ThemeLogo = LogoConfig;

/**
 * Composable centralizado para acessar informações de branding
 * (logo, cores, app info, contatos, etc.)
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
  const primaryColor = computed<string>(() => theme.value.colors.primary);

  /**
   * Secondary brand color
   */
  const secondaryColor = computed<string>(() => theme.value.colors.secondary);

  /**
   * Accent brand color
   */
  const accentColor = computed<string>(() => theme.value.colors.accent);

  /**
   * Contact information from theme (deprecated - use content.config)
   */
  const contact = computed(() => ({}));

  /**
   * Social media links from theme (deprecated - use content.config)
   */
  const social = computed(() => ({}));

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
  };
}
