<template>
  <section
    :id="id"
    class="section video-section"
  >
    <div class="video-section-bg">
      <img
        v-for="(image, index) in images"
        :key="image"
        class="scene-svg"
        :class="{ 'slide-active': index === 0 }"
        :src="image"
        :alt="imageAlts[index] ?? ''"
      >
    </div>
    <div class="video-section-overlay" />
    <div class="video-section-content reveal">
      <div class="section-eyebrow">
        {{ eyebrow }}
      </div>
      <h2 class="section-title">
        {{ title }}
      </h2>
      <p class="section-body">
        {{ body }}
      </p>
      <a
        :href="ctaHref"
        class="section-link"
      >
        {{ ctaText }}
        <LandingNewArrowIcon />
      </a>
    </div>
  </section>
</template>

<script setup lang="ts">
import LandingNewArrowIcon from './LandingNewArrowIcon.vue'

defineProps<{
  id: string
  eyebrow: string
  title: string
  body: string
  ctaText: string
  ctaHref: string
  images: string[]
  imageAlts: string[]
}>()
</script>