<template>
  <NtkLandingHeader
    :logo-text="logoText"
    :nav-items="navItems"
    :cta-text="ctaText"
    :cta-link="ctaLink"
    :sticky="sticky"
    :cta-variant="ctaVariant"
    :max-width="maxWidth"
  />
</template>

<script setup lang="ts">
import NtkLandingHeader from '../../../../components/layout/NtkLandingHeader.vue'
import type { NavLink } from '../../../../config/brand/navigation.config'

interface Props {
  logoText?: string
  navItems?: NavLink[]
  ctaText?: string
  ctaLink?: string
  ctaVariant?: 'primary' | 'secondary' | 'outline'
  sticky?: boolean
  maxWidth?: number
}

withDefaults(defineProps<Props>(), {
  logoText: '',
  navItems: () => [],
  ctaText: '',
  ctaLink: '#',
  ctaVariant: 'primary',
  sticky: false,
  maxWidth: 1200,
})
</script>
