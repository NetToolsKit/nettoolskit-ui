<template>
  <NtkFooter
    :variant="variant"
    :brand-name="brandName"
    :brand-description="brandDescription"
    :link-sections="linkSections"
    :social-links="socialLinks"
    :social-title="socialTitle"
    :copyright-text="copyrightText"
  />
</template>

<script setup lang="ts">
import NtkFooter from '../../../../components/layout/NtkFooter.vue'

interface LinkItem {
  label: string
  href: string
  external?: boolean
}

interface LinkSection {
  title: string
  links: LinkItem[]
}

interface SocialLink {
  icon: string
  href: string
  label: string
}

interface Props {
  variant?: 'dark' | 'light'
  brandName?: string
  brandDescription?: string
  linkSections?: LinkSection[]
  socialLinks?: SocialLink[]
  socialTitle?: string
  copyrightText?: string
}

withDefaults(defineProps<Props>(), {
  variant: 'dark',
  brandName: '',
  brandDescription: '',
  linkSections: () => [],
  socialLinks: () => [],
  socialTitle: 'Related',
  copyrightText: '',
})
</script>