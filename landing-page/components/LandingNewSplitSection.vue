<template>
  <section
    :id="id"
    :class="['section', 'section-fullwidth', { reverse, 'section-no-media': !hasImages }]"
  >
    <div
      v-if="hasImages"
      :class="['section-media', { 'section-media-soft': softEdges }]"
    >
      <div class="section-media-inner">
        <img
          v-for="(image, index) in images"
          :key="image"
          class="scene-svg"
          :class="{ 'slide-active': index === 0 }"
          :src="image"
          :alt="imageAlts[index] ?? ''"
        >
      </div>
    </div>

    <div :class="['section-text', 'reveal', { 'section-text-full': !hasImages }]">
      <div class="section-eyebrow">
        {{ eyebrow }}
      </div>
      <h2 class="section-title">
        {{ title }}
      </h2>
      <p class="section-body">
        {{ body }}
      </p>

      <div style="display:flex; flex-direction:column; gap:12px;">
        <a
          v-for="link in links"
          :key="`${id}-${link.text}`"
          class="section-link"
          :href="link.href"
          :target="link.external ? '_blank' : undefined"
          :rel="link.external ? 'noopener noreferrer' : undefined"
        >
          {{ link.text }}
          <LandingNewArrowIcon />
        </a>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import LandingNewArrowIcon from './LandingNewArrowIcon.vue'

interface SectionLink {
  text: string
  href: string
  external?: boolean
}

const props = defineProps<{
  id: string
  reverse?: boolean
  softEdges?: boolean
  eyebrow: string
  title: string
  body: string
  images: string[]
  imageAlts: string[]
  links: SectionLink[]
}>()

const hasImages = computed(() => props.images.length > 0)
</script>