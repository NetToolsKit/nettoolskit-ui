<template>
  <NtkCTASection
    :title="title"
    :subtitle="subtitle"
    :primary-c-t-a="primaryCTA"
    :secondary-c-t-a="secondaryCTA"
    :variant="variant"
    :layout="layout"
    :size="size"
    :max-width="maxWidth"
  />
</template>

<script setup lang="ts">
import NtkCTASection from '../../../../components/layout/NtkCTASection.vue'

interface CTAButton {
  text: string
  link: string
}

interface Props {
  title: string
  subtitle?: string
  primaryCTA: CTAButton
  secondaryCTA?: CTAButton
  variant?: 'default' | 'gradient' | 'dark' | 'light'
  size?: 'sm' | 'md' | 'lg'
  layout?: 'centered' | 'split'
  maxWidth?: number
}

withDefaults(defineProps<Props>(), {
  subtitle: '',
  secondaryCTA: undefined,
  variant: 'gradient',
  size: 'md',
  layout: 'centered',
  maxWidth: 960,
})
</script>