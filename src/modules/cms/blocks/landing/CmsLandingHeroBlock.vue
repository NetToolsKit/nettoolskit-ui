<template>
  <NtkHero
    :variant="variant"
    :layout="layout"
    :size="size"
    :badge="badge"
    :title="title"
    :subtitle="subtitle"
    :image="image"
    :image-alt="imageAlt"
  >
    <template #actions>
      <NtkButton
        v-if="primaryAction"
        :label="primaryAction.label"
        color="primary"
        unelevated
        :href="primaryAction.href"
        :target="primaryAction.external ? '_blank' : undefined"
      />
      <NtkButton
        v-if="secondaryAction"
        :label="secondaryAction.label"
        outline
        color="primary"
        :href="secondaryAction.href"
        :target="secondaryAction.external ? '_blank' : undefined"
      />
    </template>
  </NtkHero>
</template>

<script setup lang="ts">
/**
 * Src/modules/cms/blocks/landing/Cms Landing Hero Block module.
 */

import NtkHero from '../../../../components/layout/NtkHero.vue'
import NtkButton from '../../../../components/ui/NtkButton.vue'

interface HeroAction {
  label: string
  href: string
  external?: boolean
}

interface Props {
  variant?: 'default' | 'light' | 'dark' | 'gradient'
  layout?: 'centered' | 'split' | 'split-reverse'
  size?: 'sm' | 'md' | 'lg'
  badge?: string
  title: string
  subtitle: string
  image?: string
  imageAlt?: string
  primaryAction?: HeroAction
  secondaryAction?: HeroAction
}

withDefaults(defineProps<Props>(), {
  variant: 'gradient',
  layout: 'split',
  size: 'lg',
  badge: '',
  image: '',
  imageAlt: 'Hero image',
  primaryAction: undefined,
  secondaryAction: undefined,
})
</script>