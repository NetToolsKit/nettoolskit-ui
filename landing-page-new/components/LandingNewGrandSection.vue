<template>
  <section
    :id="id"
    :class="['section', 'section-grand', { 'section-grand-solid': !hasImages }]"
  >
    <div
      v-if="hasImages"
      class="grand-bg"
    >
      <img
        v-for="(image, index) in images"
        :key="image"
        class="scene-svg"
        :class="{ 'slide-active': index === 0 }"
        :src="image"
        :alt="imageAlts[index] ?? ''"
      >
    </div>
    <div
      v-if="hasImages"
      class="grand-overlay"
    />

    <div class="grand-content reveal">
      <div class="section-eyebrow">
        {{ eyebrow }}
      </div>
      <h2>{{ title }}</h2>
      <p>{{ body }}</p>
      <a
        :href="ctaHref"
        class="hero-cta"
        target="_blank"
        rel="noopener noreferrer"
      >
        {{ ctaText }}
      </a>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  id: string
  eyebrow: string
  title: string
  body: string
  ctaText: string
  ctaHref: string
  images: string[]
  imageAlts: string[]
}>()

const hasImages = computed(() => props.images.length > 0)
</script>