<template>
  <div
    id="top"
    class="ntk-landing-composer"
  >
    <NtkLandingHeader
      v-if="config.sections.header"
      :logo-text="config.header.logoText"
      :logo-letter="config.header.logoLetter"
      :logo-link="config.header.logoLink"
      :nav-items="config.header.navItems"
      :cta-text="config.header.ctaText"
      :cta-link="config.header.ctaLink"
      :cta-variant="config.header.ctaVariant"
      :sticky="true"
    />

    <main class="ntk-landing-composer__main">
      <NtkHero
        v-if="config.sections.hero"
        :variant="config.hero.variant"
        :layout="config.hero.layout"
        :size="config.hero.size"
        :badge="config.hero.badge"
        :title="config.hero.title"
        :subtitle="config.hero.subtitle"
        :image="heroImage"
        :image-alt="config.hero.imageAlt"
      >
        <template #actions>
          <NtkButton
            v-if="config.hero.primaryAction"
            :label="config.hero.primaryAction.label"
            color="primary"
            unelevated
            :href="config.hero.primaryAction.href"
            :target="config.hero.primaryAction.external ? '_blank' : undefined"
          />
          <NtkButton
            v-if="config.hero.secondaryAction"
            :label="config.hero.secondaryAction.label"
            outline
            color="primary"
            :href="config.hero.secondaryAction.href"
            :target="config.hero.secondaryAction.external ? '_blank' : undefined"
          />
        </template>

        <template #extra>
          <article
            v-if="config.hero.codeTitle || config.hero.codeSnippet"
            class="ntk-landing-composer__code"
          >
            <p
              v-if="config.hero.codeTitle"
              class="ntk-landing-composer__code-title"
            >
              {{ config.hero.codeTitle }}
            </p>
            <pre
              v-if="config.hero.codeSnippet"
              class="ntk-landing-composer__code-snippet"
            ><code>{{ config.hero.codeSnippet }}</code></pre>
          </article>
        </template>
      </NtkHero>

      <NtkStatsSection
        v-if="config.sections.stats"
        section-id="stats"
        :title="config.stats.title"
        :subtitle="config.stats.subtitle"
        :items="config.stats.items"
        :columns="config.stats.columns"
      />

      <NtkServiceGrid
        v-if="config.sections.services"
        section-id="services"
        :title="config.services.title"
        :subtitle="config.services.subtitle"
        :services="config.services.items"
        :columns="config.services.columns"
      />

      <NtkTechStack
        v-if="config.sections.stack"
        section-id="stack"
        :title="config.stack.title"
        :subtitle="config.stack.subtitle"
        :categories="config.stack.categories"
      />

      <NtkContactSection
        v-if="config.sections.contact"
        section-id="contact"
        :title="config.contact.title"
        :subtitle="config.contact.subtitle"
        :show-form="config.contact.showForm"
        :fields="config.contact.fields"
        :channels="config.contact.channels"
        :portal-action="config.contact.portalAction"
        :submit-label="config.contact.submitLabel"
        @submit="emit('contact-submit', $event)"
      />

      <NtkCTASection
        v-if="config.sections.cta"
        :title="config.cta.title"
        :subtitle="config.cta.subtitle"
        :primary-c-t-a="config.cta.primaryCTA"
        :secondary-c-t-a="config.cta.secondaryCTA"
      />
    </main>

    <NtkFooter
      v-if="config.sections.footer"
      :variant="config.footer.variant"
      :brand-name="config.footer.brandName"
      :brand-description="config.footer.brandDescription"
      :link-sections="config.footer.linkSections"
      :social-title="config.footer.socialTitle"
      :social-links="config.footer.socialLinks"
      :copyright-text="config.footer.copyrightText"
    />
  </div>
</template>

<script setup lang="ts">
/**
 * Src/components/layout/Ntk Landing Composer module.
 */

import { computed } from 'vue'
import type { LandingPageConfig } from '../../config/landing/landing-page.config'
import NtkButton from '../ui/NtkButton.vue'
import NtkCTASection from './NtkCTASection.vue'
import NtkContactSection from './NtkContactSection.vue'
import NtkFooter from './NtkFooter.vue'
import NtkHero from './NtkHero.vue'
import NtkLandingHeader from './NtkLandingHeader.vue'
import NtkServiceGrid from './NtkServiceGrid.vue'
import NtkStatsSection from './NtkStatsSection.vue'
import NtkTechStack from './NtkTechStack.vue'

interface Props {
  config: LandingPageConfig
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'contact-submit', payload: Record<string, string>): void
}>()

const heroImage = computed<string | undefined>(() => {
  const image = props.config.hero.image?.trim()
  return image ? image : undefined
})
</script>

<style scoped>
.ntk-landing-composer {
  min-height: 100vh;
  background: var(--ntk-bg-primary);
}

.ntk-landing-composer__main {
  width: 100%;
}

.ntk-landing-composer__code {
  margin-top: var(--ntk-spacing-lg);
  padding: var(--ntk-spacing-md);
  border-radius: var(--ntk-radius-lg, 14px);
  border: 1px solid var(--ntk-border-color);
  background: var(--ntk-bg-secondary);
}

.ntk-landing-composer__code-title {
  margin: 0 0 var(--ntk-spacing-xs);
  font-size: var(--ntk-text-sm, 0.875rem);
  font-weight: var(--ntk-font-semibold, 600);
  color: var(--ntk-text-secondary);
}

.ntk-landing-composer__code-snippet {
  margin: 0;
  padding: 0;
  font-size: var(--ntk-text-sm, 0.875rem);
  line-height: 1.55;
  color: var(--ntk-text-primary);
  white-space: pre-wrap;
  word-break: break-word;
}
</style>