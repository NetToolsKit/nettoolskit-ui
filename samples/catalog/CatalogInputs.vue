<template>
  <section
    id="inputs"
    class="cg-section"
  >
    <CatalogGalleryHeader
      num="05"
      :title="t.inputsTitle"
      :desc="t.inputsDesc"
    />
    <div class="cg-grid">
      <!-- Nome (default) -->
      <DsInput
        id="cg-in-nome"
        class="cg-field"
        :label="t.inNome"
        :model-value="'Mariana Alves'"
        :hint="t.inHintNome"
      />

      <!-- E-mail (focus) — bespoke label so "(foco)" can carry the primary color -->
      <div class="cg-field cg-loadingfield">
        <span class="cg-loadingfield__label">
          {{ t.inEmail }} <span class="cg-focustag">{{ t.inFocus }}</span>
        </span>
        <input
          class="cg-emailinput"
          value="contato@empresa.com.br"
          readonly
        >
        <span class="cg-loadingfield__hint">{{ t.inHintEmail }}</span>
      </div>

      <!-- CPF (error) -->
      <DsInput
        id="cg-in-cpf"
        class="cg-field"
        label="CPF"
        :model-value="'000.000.000-00'"
        invalid
        :error-message="t.inErrCpf"
      />

      <!-- Plano (disabled) -->
      <DsInput
        id="cg-in-plano"
        class="cg-field cg-field--muted-label"
        :label="t.inPlano"
        :model-value="'Enterprise'"
        disabled
        :hint="t.inHintPlano"
      />

      <!-- Status (select) -->
      <DsSelect
        id="cg-in-status"
        class="cg-field"
        :label="t.inStatus"
        :model-value="'ativo'"
        :options="statusOptions"
        :hint="t.inHintStatus"
      />

      <!-- Buscando (loading) -->
      <div class="cg-field cg-loadingfield">
        <span class="cg-loadingfield__label">{{ t.inBuscando }}</span>
        <div class="cg-loadingfield__control">
          <input
            :value="locale === 'en' ? 'searching…' : 'consultando…'"
            readonly
          >
          <span class="cg-loadingfield__spinner" />
        </div>
        <span class="cg-loadingfield__hint">{{ t.inHintLoading }}</span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { DsInput, DsSelect } from '../../index'
import CatalogGalleryHeader from './CatalogGalleryHeader.vue'
import type { CatalogStrings } from './catalogI18n'

const props = defineProps<{ t: CatalogStrings; locale: 'pt' | 'en' }>()

const statusOptions = computed(() => [
  { value: 'ativo', label: props.locale === 'en' ? 'Active' : 'Ativo' },
  { value: 'pendente', label: props.locale === 'en' ? 'Pending' : 'Pendente' },
  { value: 'inativo', label: props.locale === 'en' ? 'Inactive' : 'Inativo' },
  { value: 'bloqueado', label: props.locale === 'en' ? 'Blocked' : 'Bloqueado' },
])
</script>

<style scoped>
.cg-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
  scroll-margin-top: 92px;
}

.cg-grid {
  border: var(--ds-border-width) solid var(--ds-color-border);
  border-radius: var(--ds-radius-lg);
  background: var(--ds-color-surface);
  padding: var(--ds-card-padding);
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 18px;
}

/* Re-skin DsInput / DsSelect to the exact reference field metrics. */
.cg-field {
  gap: 6px;
}

.cg-field :deep(.ntk-field__label) {
  font-size: 13px;
  font-weight: 600;
  color: var(--ds-color-text);
}

.cg-field--muted-label :deep(.ntk-field__label) {
  color: var(--ds-color-text-muted);
}

.cg-field :deep(.ntk-field__control) {
  height: var(--ds-control-height);
  padding: 0 13px;
  border: var(--ds-border-width) solid var(--ds-color-border);
  border-radius: var(--ds-radius-md);
  background: var(--ds-color-surface);
  color: var(--ds-color-text);
  font-size: 14px;
  font-family: var(--ds-font-sans);
  line-height: var(--ds-control-height);
}

.cg-field :deep(select.ntk-field__control) {
  padding: 0 36px 0 13px;
}

.cg-field :deep(.ntk-field__control:focus) {
  outline: none;
  border-color: var(--ds-color-primary);
  box-shadow: var(--ds-focus-ring);
}

.cg-field :deep(.ntk-field__message) {
  font-size: 12px;
  color: var(--ds-color-text-muted);
}

/* Focus state demo (e-mail) — render the field as if focused. */
.cg-field--focus :deep(.ntk-field__control) {
  border-color: var(--ds-color-primary);
  box-shadow: var(--ds-focus-ring);
}

/* Error state */
.cg-field :deep(.ntk-field--is-invalid .ntk-field__control),
.cg-field :deep(.ntk-field__control[aria-invalid='true']) {
  border-color: var(--ds-color-danger);
  box-shadow: 0 0 0 3px var(--ds-color-danger-soft);
}

.cg-field :deep(.ntk-field--is-invalid .ntk-field__message) {
  color: var(--ds-color-danger);
  font-weight: 500;
}

/* Disabled */
.cg-field :deep(.ntk-field__control:disabled) {
  background: var(--ds-color-surface-muted);
  color: var(--ds-color-text-muted);
  opacity: 1;
  cursor: not-allowed;
}

/* Loading field (bespoke — no Ds spinner-in-field primitive) */
.cg-loadingfield {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.cg-loadingfield__label {
  font-size: 13px;
  font-weight: 600;
  color: var(--ds-color-text);
}

.cg-loadingfield__control {
  position: relative;
}

.cg-loadingfield__control input {
  width: 100%;
  height: var(--ds-control-height);
  padding: 0 38px 0 13px;
  border: var(--ds-border-width) solid var(--ds-color-border);
  border-radius: var(--ds-radius-md);
  background: var(--ds-color-surface);
  color: var(--ds-color-text-muted);
  font-size: 14px;
  font-family: var(--ds-font-sans);
  outline: none;
}

.cg-loadingfield__spinner {
  position: absolute;
  right: 13px;
  top: 50%;
  transform: translateY(-50%);
  width: 14px;
  height: 14px;
  border-radius: 999px;
  border: 2px solid var(--ds-color-border);
  border-top-color: var(--ds-color-primary);
  display: inline-block;
  animation: cg-spin 0.7s linear infinite;
}

.cg-loadingfield__hint {
  font-size: 12px;
  color: var(--ds-color-text-muted);
}

.cg-focustag {
  color: var(--ds-color-primary);
}

.cg-emailinput {
  height: var(--ds-control-height);
  padding: 0 13px;
  border: var(--ds-border-width) solid var(--ds-color-primary);
  border-radius: var(--ds-radius-md);
  background: var(--ds-color-surface);
  color: var(--ds-color-text);
  font-size: 14px;
  font-family: var(--ds-font-sans);
  outline: none;
  box-shadow: var(--ds-focus-ring);
}

@keyframes cg-spin {
  to {
    transform: translateY(-50%) rotate(360deg);
  }
}
</style>