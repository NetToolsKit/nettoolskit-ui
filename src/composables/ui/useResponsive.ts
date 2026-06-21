/**
 * Src/composables/ui/use Responsive module.
 */

import { computed } from 'vue'
import { useQuasar } from 'quasar'

export interface ResponsiveBreakpoints {
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  isLargeDesktop: boolean
  xs: boolean
  sm: boolean
  md: boolean
  lg: boolean
  xl: boolean
}

/**
 * Composable for managing responsiveness
 * Provides reactive breakpoints without directly depending on $q.screen in all components
 */
export function useResponsive() {
  const $q = useQuasar()

  // Reactive breakpoints
  const isMobile = computed(() => $q.screen.xs)
  const isTablet = computed(() => $q.screen.sm)
  const isDesktop = computed(() => $q.screen.md || $q.screen.lg)
  const isLargeDesktop = computed(() => $q.screen.xl)

  // Quasar-specific breakpoints
  const xs = computed(() => $q.screen.xs)
  const sm = computed(() => $q.screen.sm)
  const md = computed(() => $q.screen.md)
  const lg = computed(() => $q.screen.lg)
  const xl = computed(() => $q.screen.xl)

  // Orientation
  const isPortrait = computed(() => $q.screen.height > $q.screen.width)
  const isLandscape = computed(() => $q.screen.width > $q.screen.height)

  // Screen width
  const screenWidth = computed(() => $q.screen.width)
  const screenHeight = computed(() => $q.screen.height)

  // Current breakpoint name
  const currentBreakpoint = computed(() => {
    if (xs.value) return 'xs'
    if (sm.value) return 'sm'
    if (md.value) return 'md'
    if (lg.value) return 'lg'
    if (xl.value) return 'xl'
    return 'unknown'
  })

  // Helpers for conditional layout
  const shouldShowDrawer = computed(() => !isMobile.value)
  const drawerBehavior = computed(() => isMobile.value ? 'mobile' : 'desktop')
  const tableMode = computed(() => isMobile.value ? 'list' : 'table')

  return {
    // Main breakpoints
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop,

    // Quasar breakpoints
    xs,
    sm,
    md,
    lg,
    xl,

    // Orientation
    isPortrait,
    isLandscape,

    // Dimensions
    screenWidth,
    screenHeight,

    // Helpers
    currentBreakpoint,
    shouldShowDrawer,
    drawerBehavior,
    tableMode
  }
}