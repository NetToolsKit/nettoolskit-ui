<template>
  <section class="ntk-samples-hub">
    <header class="ntk-samples-hub__header">
      <div class="ntk-samples-hub__header-copy">
        <p class="ntk-samples-hub__eyebrow">
          Samples home
        </p>
        <h1 class="ntk-samples-hub__title">
          Escolha o baseline aprovado ou uma das cinco familias visuais
        </h1>
        <p class="ntk-samples-hub__description">
          O host continua consumindo apenas componentes compartilhados de <code>src/**</code>. Aqui voce navega entre o baseline fiel da referencia local, os cinco packs inspirados no VoltAgent e os runtimes vivos do projeto.
        </p>
      </div>

      <div class="ntk-samples-hub__stats">
        <article class="ntk-samples-hub__stat">
          <span>Pacotes</span>
          <strong>{{ templateVisualFamilies.length }}</strong>
        </article>
        <article class="ntk-samples-hub__stat">
          <span>Previews</span>
          <strong>{{ templateVisualFamilies.length * 2 }}</strong>
        </article>
        <article class="ntk-samples-hub__stat">
          <span>Busca</span>
          <strong>{{ searchValue ? 'Ativa' : 'Livre' }}</strong>
        </article>
      </div>
    </header>

    <TemplateSampleSelector
      :families="filteredFamilies"
      @select-family="openFamily($event)"
    />

    <section class="ntk-samples-hub__section">
      <div class="ntk-samples-hub__section-head">
        <div>
          <p class="ntk-samples-hub__section-label">
            Runtime modes
          </p>
          <h2>Abrir os ambientes vivos</h2>
        </div>
      </div>

      <div class="ntk-samples-hub__runtime-grid">
        <article
          v-for="runtime in filteredRuntimeLinks"
          :key="runtime.id"
          class="ntk-samples-hub__runtime-card"
        >
          <div class="ntk-samples-hub__runtime-icon">
            <q-icon
              :name="runtime.icon"
              size="18px"
            />
          </div>
          <strong>{{ runtime.title }}</strong>
          <p>{{ runtime.description }}</p>
          <q-btn
            no-caps
            unelevated
            color="primary"
            :label="runtime.id === 'catalog-home' ? 'Abrir inicio' : 'Abrir runtime'"
            @click="navigateTo(runtime.href)"
          />
        </article>
      </div>
    </section>

    <section class="ntk-samples-hub__section">
      <div class="ntk-samples-hub__section-head">
        <div>
          <p class="ntk-samples-hub__section-label">
            Curated packs
          </p>
          <h2>Original fiel mais cinco variacoes de whitelabel</h2>
        </div>
      </div>

      <div class="ntk-samples-hub__family-grid">
        <article
          v-for="family in filteredFamilies"
          :key="family.id"
          class="ntk-samples-hub__family-card"
        >
          <div class="ntk-samples-hub__family-top">
            <span class="ntk-samples-hub__family-kind">
              {{ family.kind === 'original' ? 'Original' : 'Variacao' }}
            </span>
            <span class="ntk-samples-hub__family-meta">
              {{ family.variants.length }} temas
            </span>
          </div>
          <strong>{{ family.label }}</strong>
          <p>{{ family.description }}</p>
          <span class="ntk-samples-hub__family-surface">
            {{ family.example.surfaceTag }}
          </span>
          <q-btn
            no-caps
            outline
            color="primary"
            label="Abrir pack"
            @click="openFamily(family.id)"
          />
        </article>
      </div>
    </section>

    <section class="ntk-samples-hub__section">
      <div class="ntk-samples-hub__section-head">
        <div>
          <p class="ntk-samples-hub__section-label">
            Example selection
          </p>
          <h2>Abrir um exemplo especifico e comparar as duas variantes</h2>
        </div>
      </div>

      <div class="ntk-samples-hub__example-grid">
        <article
          v-for="example in filteredExamples"
          :key="example.id"
          class="ntk-samples-hub__example-card"
        >
          <div class="ntk-samples-hub__example-top">
            <span class="ntk-samples-hub__example-tag">
              {{ example.surfaceTag }}
            </span>
            <span class="ntk-samples-hub__example-area">
              {{ example.templateAreas.join(' / ') }}
            </span>
          </div>
          <strong>{{ example.label }}</strong>
          <p>{{ example.summary }}</p>
          <q-btn
            no-caps
            flat
            color="primary"
            label="Abrir exemplo"
            @click="navigateTo(`/?templates=1&example=${example.id}`)"
          />
        </article>
      </div>
    </section>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { referenceRuntimeLinks } from '../../src/templates/features/reference-system/reference-catalog.sample-data'
import TemplateSampleSelector from '../template-showcase/components/TemplateSampleSelector.vue'
import { templateVisualFamilies } from '../template-showcase/families/template-visual-families'

const props = withDefaults(defineProps<{
  searchValue?: string
}>(), {
  searchValue: '',
})

const runtimeLinks = [
  {
    id: 'catalog-home',
    title: 'Samples home',
    description: 'Retorna para a tela inicial de selecao dos runtimes e dos packs.',
    href: '/',
    icon: 'home',
  },
  ...referenceRuntimeLinks,
]

const normalizedSearch = computed(() => props.searchValue.trim().toLowerCase())

function includesSearch(chunks: Array<string | undefined>): boolean {
  const search = normalizedSearch.value
  if (!search) {
    return true
  }

  return chunks
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
    .includes(search)
}

const filteredRuntimeLinks = computed(() => {
  return runtimeLinks.filter(runtime => includesSearch([runtime.title, runtime.description]))
})

const filteredFamilies = computed(() => {
  return templateVisualFamilies.filter(family =>
    includesSearch([
      family.label,
      family.kicker,
      family.description,
      family.example.label,
      family.example.summary,
      ...family.notes.map(note => note.value),
      ...family.metrics.map(metric => metric.value),
    ])
  )
})

const filteredExamples = computed(() => {
  return Array.from(new Map(templateVisualFamilies
    .map(family => family.example)
    .map(example => [example.id, example])).values())
    .filter(example =>
      includesSearch([example.label, example.summary, example.surfaceTag, example.templateAreas.join(' ')])
    )
})

function navigateTo(href: string): void {
  if (typeof window !== 'undefined') {
    window.location.href = href
  }
}

function openFamily(familyId: string): void {
  if (familyId === 'approved-reference') {
    navigateTo('/?original=1')
    return
  }

  navigateTo(`/?templates=1&family=${familyId}`)
}
</script>

<style scoped lang="scss">
.ntk-samples-hub {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 12px;
}

.ntk-samples-hub__header,
.ntk-samples-hub__section {
  border: 1px solid var(--ntk-reference-border, #e2e8f0);
  border-radius: 12px;
  background: var(--ntk-reference-panel-bg, #ffffff);
  box-shadow: var(--ntk-shadow-soft, 0 1px 3px rgba(0, 0, 0, 0.05));
}

.ntk-samples-hub__header {
  display: grid;
  grid-template-columns: minmax(0, 1.5fr) minmax(260px, 0.7fr);
  gap: 16px;
  padding: 18px 20px;
}

.ntk-samples-hub__eyebrow,
.ntk-samples-hub__section-label {
  margin: 0 0 8px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--ntk-text-secondary, #64748b);
}

.ntk-samples-hub__title,
.ntk-samples-hub__section-head h2 {
  margin: 0;
  color: var(--ntk-text-primary, #1e293b);
  font-size: 22px;
  line-height: 1.2;
}

.ntk-samples-hub__description {
  margin: 10px 0 0;
  max-width: 760px;
  color: var(--ntk-text-secondary, #64748b);
  line-height: 1.6;
}

.ntk-samples-hub__description code {
  font-family: inherit;
  color: var(--ntk-text-primary, #1e293b);
  background: rgba(148, 163, 184, 0.12);
  padding: 1px 6px;
  border-radius: 999px;
}

.ntk-samples-hub__stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.ntk-samples-hub__stat {
  padding: 14px;
  border: 1px solid var(--ntk-reference-border, #e2e8f0);
  border-radius: 12px;
  background: var(--ntk-reference-panel-muted-bg, #f8fafc);
}

.ntk-samples-hub__stat span {
  display: block;
  font-size: 12px;
  color: var(--ntk-text-secondary, #64748b);
}

.ntk-samples-hub__stat strong {
  display: block;
  margin-top: 4px;
  font-size: 22px;
  color: var(--ntk-text-primary, #1e293b);
}

.ntk-samples-hub__section {
  padding: 18px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ntk-samples-hub__runtime-grid,
.ntk-samples-hub__family-grid,
.ntk-samples-hub__example-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px;
}

.ntk-samples-hub__runtime-card,
.ntk-samples-hub__family-card,
.ntk-samples-hub__example-card {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 100%;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid var(--ntk-reference-border, #e2e8f0);
  background: var(--ntk-template-page-card-bg, #ffffff);
}

.ntk-samples-hub__runtime-card strong,
.ntk-samples-hub__family-card strong,
.ntk-samples-hub__example-card strong {
  color: var(--ntk-text-primary, #1e293b);
  font-size: 17px;
}

.ntk-samples-hub__runtime-card p,
.ntk-samples-hub__family-card p,
.ntk-samples-hub__example-card p {
  margin: 0;
  color: var(--ntk-text-secondary, #64748b);
  line-height: 1.55;
}

.ntk-samples-hub__runtime-icon {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(15, 118, 110, 0.08);
  color: var(--ntk-primary, #0f766e);
}

.ntk-samples-hub__family-top,
.ntk-samples-hub__example-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.ntk-samples-hub__family-kind,
.ntk-samples-hub__family-meta,
.ntk-samples-hub__family-surface,
.ntk-samples-hub__example-tag,
.ntk-samples-hub__example-area {
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.ntk-samples-hub__family-kind,
.ntk-samples-hub__example-tag {
  color: var(--ntk-primary, #0f766e);
}

.ntk-samples-hub__family-meta,
.ntk-samples-hub__family-surface,
.ntk-samples-hub__example-area {
  color: var(--ntk-text-secondary, #64748b);
}

@media (max-width: 1100px) {
  .ntk-samples-hub__header {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .ntk-samples-hub {
    padding: 8px;
  }

  .ntk-samples-hub__header,
  .ntk-samples-hub__section {
    padding: 16px;
  }

  .ntk-samples-hub__stats {
    grid-template-columns: 1fr;
  }

  .ntk-samples-hub__family-top,
  .ntk-samples-hub__example-top {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
