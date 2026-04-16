<template>
  <div class="ntk-reference-catalog-template">
    <section class="ntk-reference-catalog-template__hero">
      <div class="ntk-reference-catalog-template__hero-copy">
        <p class="ntk-reference-catalog-template__eyebrow">
          {{ selectedPreset.brand.kicker }}
        </p>
        <h1>{{ selectedPreset.brand.name }}</h1>
        <p class="ntk-reference-catalog-template__hero-description">
          {{ selectedPreset.brand.description }}
        </p>

        <div class="ntk-reference-catalog-template__search">
          <q-icon
            name="search"
            size="18px"
          />
          <input
            id="reference-catalog-search"
            name="reference-catalog-search"
            :value="searchValue"
            type="text"
            placeholder="Search systems, templates or surfaces..."
            class="ntk-reference-catalog-template__search-input"
            @input="emit('update:searchValue', ($event.target as HTMLInputElement).value)"
          >
        </div>
      </div>

      <div class="ntk-reference-catalog-template__hero-side">
        <div class="ntk-reference-catalog-template__stats">
          <article
            v-for="stat in heroStats"
            :key="stat.id"
            class="ntk-reference-catalog-template__stat"
          >
            <strong>{{ stat.value }}</strong>
            <span>{{ stat.label }}</span>
          </article>
        </div>

        <div class="ntk-reference-catalog-template__callouts">
          <span
            v-for="callout in presetCallouts"
            :key="callout.id"
            class="ntk-reference-catalog-template__callout"
          >
            <strong>{{ callout.title }}</strong>
            <small>{{ callout.badge }}</small>
          </span>
        </div>
      </div>
    </section>

    <section class="ntk-reference-catalog-template__catalog">
      <div class="ntk-reference-catalog-template__catalog-list">
        <header class="ntk-reference-catalog-template__section-header">
          <div>
            <p class="ntk-reference-catalog-template__section-label">
              {{ sectionLabel }}
            </p>
            <h2>{{ sectionTitle }}</h2>
          </div>
          <span class="ntk-reference-catalog-template__section-count">
            {{ surfaces.length }} surfaces
          </span>
        </header>

        <div
          v-if="surfaces.length === 0"
          class="ntk-reference-catalog-template__empty"
        >
          <q-icon
            name="filter_alt_off"
            size="28px"
          />
          <span>No reusable surfaces match the current search.</span>
        </div>

        <div
          v-else
          class="ntk-reference-catalog-template__surface-grid"
        >
          <ReferenceCatalogSurfaceCard
            v-for="surface in surfaces"
            :key="surface.id"
            :surface="surface"
            :active="surface.id === selectedSurfaceId"
            @select="emit('selectSurface', $event)"
          />
        </div>
      </div>

      <div class="ntk-reference-catalog-template__catalog-preview">
        <ReferenceCatalogPreviewSurface
          :surface="selectedSurface"
          :selected-preset="selectedPreset"
          :whitelabel-style-vars="whitelabelStyleVars"
        />

        <section class="ntk-reference-catalog-template__runtime-links">
          <header class="ntk-reference-catalog-template__section-header ntk-reference-catalog-template__section-header--compact">
            <div>
              <p class="ntk-reference-catalog-template__section-label">
                Runtime Modes
              </p>
              <h3>Open the connected demos</h3>
            </div>
          </header>

          <div class="ntk-reference-catalog-template__runtime-grid">
            <button
              v-for="runtimeLink in runtimeLinks"
              :key="runtimeLink.id"
              type="button"
              class="ntk-reference-catalog-template__runtime-link"
              @click="emit('openRuntime', runtimeLink)"
            >
              <div class="ntk-reference-catalog-template__runtime-link-head">
                <q-icon
                  :name="runtimeLink.icon"
                  size="18px"
                />
                <strong>{{ runtimeLink.title }}</strong>
              </div>
              <p>{{ runtimeLink.description }}</p>
            </button>
          </div>
        </section>
      </div>
    </section>

    <section
      v-if="showPresets"
      class="ntk-reference-catalog-template__presets"
    >
      <header class="ntk-reference-catalog-template__section-header">
        <div>
          <p class="ntk-reference-catalog-template__section-label">
            Whitelabel Runtime
          </p>
          <h2>Same templates, different branded tokens</h2>
        </div>
      </header>

      <div class="ntk-reference-catalog-template__preset-grid">
        <ReferenceWhitelabelPresetCard
          v-for="preset in presets"
          :key="preset.id"
          :preset="preset"
        />
      </div>
    </section>

    <section
      v-if="showArchitecture"
      class="ntk-reference-catalog-template__architecture"
    >
      <header class="ntk-reference-catalog-template__section-header">
        <div>
          <p class="ntk-reference-catalog-template__section-label">
            Architecture
          </p>
          <h2>Whitelabel is the parameterization layer, not a fork</h2>
        </div>
      </header>

      <div class="ntk-reference-catalog-template__architecture-grid">
        <article
          v-for="card in architectureCards"
          :key="card.id"
          class="ntk-reference-catalog-template__architecture-card"
        >
          <div class="ntk-reference-catalog-template__architecture-icon">
            <q-icon
              :name="card.icon"
              size="20px"
            />
          </div>
          <h3>{{ card.title }}</h3>
          <p>{{ card.description }}</p>

          <ul class="ntk-reference-catalog-template__architecture-list">
            <li
              v-for="bullet in card.bullets"
              :key="bullet"
            >
              {{ bullet }}
            </li>
          </ul>
        </article>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { CSSProperties } from 'vue'

import type { ReferenceSampleSurface, ReferenceWhitelabelPreset } from '../../../whitelabel'
import type {
  ReferenceCatalogArchitectureCard,
  ReferenceCatalogRuntimeLink,
  ReferenceCatalogStat,
} from './reference-system.types'
import ReferenceCatalogPreviewSurface from './components/ReferenceCatalogPreviewSurface.vue'
import ReferenceCatalogSurfaceCard from './components/ReferenceCatalogSurfaceCard.vue'
import ReferenceWhitelabelPresetCard from './components/ReferenceWhitelabelPresetCard.vue'

interface PresetCallout {
  id: string
  title: string
  description: string
  badge: string
}

const props = withDefaults(defineProps<{
  activeSectionMode: 'overview' | 'samples' | 'presets' | 'screen'
  selectedPreset: ReferenceWhitelabelPreset
  selectedSurfaceId: string
  selectedSurface?: ReferenceSampleSurface | null
  surfaces?: ReferenceSampleSurface[]
  presets?: ReferenceWhitelabelPreset[]
  heroStats?: ReferenceCatalogStat[]
  presetCallouts?: PresetCallout[]
  architectureCards?: ReferenceCatalogArchitectureCard[]
  runtimeLinks?: ReferenceCatalogRuntimeLink[]
  searchValue?: string
  whitelabelStyleVars?: CSSProperties
}>(), {
  selectedSurface: null,
  surfaces: () => [],
  presets: () => [],
  heroStats: () => [],
  presetCallouts: () => [],
  architectureCards: () => [],
  runtimeLinks: () => [],
  searchValue: '',
  whitelabelStyleVars: () => ({}),
})

const emit = defineEmits<{
  'update:searchValue': [value: string]
  selectSurface: [surfaceId: string]
  openRuntime: [runtimeLink: ReferenceCatalogRuntimeLink]
}>()

const sectionLabel = computed(() => {
  if (props.activeSectionMode === 'presets') {
    return 'Parameterized system catalog'
  }

  if (props.activeSectionMode === 'screen') {
    return 'Screen focus'
  }

  if (props.activeSectionMode === 'samples') {
    return 'Approved screen library'
  }

  return 'Reference systems catalog'
})

const sectionTitle = computed(() => {
  if (props.activeSectionMode === 'presets') {
    return 'Inspect the surfaces that inherit the current preset'
  }

  if (props.activeSectionMode === 'screen') {
    return props.selectedSurface?.title ?? 'Selected surface'
  }

  if (props.activeSectionMode === 'samples') {
    return 'Browse reusable systems and screens'
  }

  return 'Approved systems built from our shared templates'
})

const showPresets = computed(() => {
  return props.activeSectionMode === 'overview' || props.activeSectionMode === 'presets'
})

const showArchitecture = computed(() => {
  return props.activeSectionMode === 'overview' || props.activeSectionMode === 'presets'
})
</script>

<style scoped lang="scss">
.ntk-reference-catalog-template {
  display: flex;
  flex-direction: column;
  gap: 28px;
  padding: 24px;
  background:
    radial-gradient(circle at top right, color-mix(in srgb, var(--ntk-reference-accent) 16%, transparent) 0%, transparent 34%),
    radial-gradient(circle at 6% 16%, color-mix(in srgb, var(--ntk-primary-light) 10%, transparent) 0%, transparent 22%),
    var(--ntk-reference-page-bg);
}

.ntk-reference-catalog-template__hero {
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(320px, 0.9fr);
  gap: 20px;
  padding: 28px;
  border: 1px solid var(--ntk-reference-shell-chrome-border);
  border-radius: 32px;
  background: var(--ntk-reference-shell-chrome-bg);
  box-shadow: var(--ntk-reference-shell-glow);
}

.ntk-reference-catalog-template__eyebrow,
.ntk-reference-catalog-template__section-label {
  margin: 0 0 8px;
  font-family: var(--ntk-font-family-mono, 'IBM Plex Mono', ui-monospace, monospace);
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--ntk-text-secondary);
}

.ntk-reference-catalog-template__hero h1,
.ntk-reference-catalog-template__section-header h2,
.ntk-reference-catalog-template__section-header h3 {
  margin: 0;
  color: var(--ntk-text-primary);
}

.ntk-reference-catalog-template__hero-description {
  margin: 12px 0 0;
  max-width: 680px;
  color: var(--ntk-text-secondary);
  line-height: 1.7;
  font-size: 15px;
}

.ntk-reference-catalog-template__search {
  margin-top: 22px;
  min-height: 48px;
  border: 1px solid var(--ntk-reference-border);
  border-radius: 18px;
  background: color-mix(in srgb, var(--ntk-reference-panel-muted-bg) 84%, transparent);
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 16px;
  color: var(--ntk-text-secondary);
}

.ntk-reference-catalog-template__search-input {
  width: 100%;
  border: 0;
  background: transparent;
  outline: 0;
  color: var(--ntk-text-primary);
  font-size: 14px;
}

.ntk-reference-catalog-template__hero-side,
.ntk-reference-catalog-template__stats,
.ntk-reference-catalog-template__callouts,
.ntk-reference-catalog-template__surface-grid,
.ntk-reference-catalog-template__preset-grid,
.ntk-reference-catalog-template__architecture-grid,
.ntk-reference-catalog-template__runtime-grid {
  display: grid;
  gap: 14px;
}

.ntk-reference-catalog-template__stats {
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
}

.ntk-reference-catalog-template__stat {
  border: 1px solid var(--ntk-reference-border);
  border-radius: 18px;
  padding: 16px;
  background: var(--ntk-reference-panel-muted-bg);
}

.ntk-reference-catalog-template__stat strong {
  display: block;
  font-size: 26px;
  line-height: 1.1;
  color: var(--ntk-text-primary);
  font-family: var(--ntk-font-family-display, 'Space Grotesk', Inter, system-ui, sans-serif);
}

.ntk-reference-catalog-template__stat span {
  display: block;
  margin-top: 4px;
  color: var(--ntk-text-secondary);
  font-size: 13px;
}

.ntk-reference-catalog-template__callout {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  border: 1px solid var(--ntk-reference-border);
  border-radius: 16px;
  padding: 12px 14px;
  background: var(--ntk-reference-panel-muted-bg);
}

.ntk-reference-catalog-template__callout strong {
  font-size: 13px;
  color: var(--ntk-text-primary);
}

.ntk-reference-catalog-template__callout small {
  min-height: 22px;
  border-radius: 999px;
  padding: 0 8px;
  display: inline-flex;
  align-items: center;
  background: var(--ntk-reference-badge-bg);
  color: var(--ntk-reference-badge-text);
  font-family: var(--ntk-font-family-mono, 'IBM Plex Mono', ui-monospace, monospace);
  text-transform: uppercase;
  letter-spacing: 0.12em;
}

.ntk-reference-catalog-template__catalog {
  display: grid;
  grid-template-columns: minmax(320px, 0.9fr) minmax(0, 1.2fr);
  gap: 22px;
  align-items: start;
}

.ntk-reference-catalog-template__catalog-list,
.ntk-reference-catalog-template__catalog-preview,
.ntk-reference-catalog-template__presets,
.ntk-reference-catalog-template__architecture {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.ntk-reference-catalog-template__catalog-list,
.ntk-reference-catalog-template__runtime-links,
.ntk-reference-catalog-template__presets,
.ntk-reference-catalog-template__architecture {
  border: 1px solid var(--ntk-reference-shell-chrome-border);
  border-radius: 30px;
  padding: 22px;
  background: var(--ntk-reference-shell-chrome-bg);
  box-shadow: var(--ntk-reference-shell-glow);
}

.ntk-reference-catalog-template__section-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.ntk-reference-catalog-template__section-header--compact {
  margin-bottom: 4px;
}

.ntk-reference-catalog-template__section-count {
  min-height: 28px;
  border-radius: 999px;
  padding: 0 12px;
  display: inline-flex;
  align-items: center;
  background: var(--ntk-reference-panel-muted-bg);
  color: var(--ntk-text-secondary);
  font-family: var(--ntk-font-family-mono, 'IBM Plex Mono', ui-monospace, monospace);
  font-size: 12px;
  font-weight: 500;
}

.ntk-reference-catalog-template__empty {
  min-height: 220px;
  border: 1px dashed var(--ntk-reference-border);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: var(--ntk-text-secondary);
}

.ntk-reference-catalog-template__surface-grid,
.ntk-reference-catalog-template__preset-grid,
.ntk-reference-catalog-template__architecture-grid {
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
}

.ntk-reference-catalog-template__runtime-grid {
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}

.ntk-reference-catalog-template__runtime-link,
.ntk-reference-catalog-template__architecture-card {
  border: 1px solid var(--ntk-reference-border);
  border-radius: 22px;
  background: var(--ntk-reference-panel-muted-bg);
  padding: 18px;
  text-align: left;
}

.ntk-reference-catalog-template__runtime-link {
  cursor: pointer;
  transition:
    transform 160ms ease,
    border-color 160ms ease;
}

.ntk-reference-catalog-template__runtime-link:hover {
  transform: translateY(-2px);
  border-color: color-mix(in srgb, var(--ntk-reference-accent) 44%, var(--ntk-reference-border));
}

.ntk-reference-catalog-template__runtime-link-head,
.ntk-reference-catalog-template__architecture-icon {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: var(--ntk-reference-accent);
}

.ntk-reference-catalog-template__runtime-link p,
.ntk-reference-catalog-template__architecture-card p {
  margin: 12px 0 0;
  color: var(--ntk-text-secondary);
  line-height: 1.6;
}

.ntk-reference-catalog-template__architecture-card h3 {
  margin: 14px 0 0;
  color: var(--ntk-text-primary);
}

.ntk-reference-catalog-template__architecture-list {
  margin: 16px 0 0;
  padding-left: 18px;
  display: grid;
  gap: 8px;
  color: var(--ntk-text-primary);
}

@media (max-width: 1240px) {
  .ntk-reference-catalog-template__catalog {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 980px) {
  .ntk-reference-catalog-template {
    padding: 16px;
  }

  .ntk-reference-catalog-template__hero {
    grid-template-columns: 1fr;
    padding: 20px;
  }

  .ntk-reference-catalog-template__catalog-list,
  .ntk-reference-catalog-template__runtime-links,
  .ntk-reference-catalog-template__presets,
  .ntk-reference-catalog-template__architecture {
    padding: 18px;
    border-radius: 22px;
  }

  .ntk-reference-catalog-template__section-header {
    flex-direction: column;
  }
}
</style>
