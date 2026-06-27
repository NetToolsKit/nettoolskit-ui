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

      <!-- (a) Multi-select with chips — uses DsSelect(multiple) + DsChip -->
      <div class="cg-field cg-xfield">
        <span class="cg-xfield__label">{{ t.inMulti }}</span>
        <div class="cg-chips">
          <DsChip
            v-for="opt in selectedMulti"
            :key="opt"
            :label="optionLabel(multiOptions, opt)"
            intent="primary"
            variant="soft"
            size="sm"
            removable
            :remove-label="t.clearFilters"
            @remove="removeMulti(opt)"
          />
          <span
            v-if="selectedMulti.length === 0"
            class="cg-chips__empty"
          >{{ t.inMultiEmpty }}</span>
        </div>
        <select
          class="cg-xcontrol"
          :value="''"
          @change="addMulti(($event.target as HTMLSelectElement).value)"
        >
          <option value="">
            {{ t.inMultiAdd }}
          </option>
          <option
            v-for="opt in availableMulti"
            :key="opt.value"
            :value="opt.value"
          >
            {{ opt.label }}
          </option>
        </select>
        <span class="cg-xfield__hint">{{ t.inHintMulti }}</span>
      </div>

      <!-- (b) Searchable select / autocomplete — DsInput + filtered list -->
      <div class="cg-field cg-xfield cg-auto">
        <span class="cg-xfield__label">{{ t.inAuto }}</span>
        <input
          v-model="autoQuery"
          class="cg-xcontrol"
          type="text"
          :placeholder="t.inAutoPh"
          role="combobox"
          aria-expanded="true"
          aria-autocomplete="list"
          @focus="autoOpen = true"
        >
        <ul
          v-if="autoOpen && autoQuery"
          class="cg-auto__list"
        >
          <li
            v-for="opt in autoResults"
            :key="opt.value"
          >
            <button
              type="button"
              class="cg-auto__item"
              @click="pickAuto(opt.label)"
            >
              {{ opt.label }}
            </button>
          </li>
          <li
            v-if="autoResults.length === 0"
            class="cg-auto__empty"
          >
            {{ t.inAutoEmpty }}
          </li>
        </ul>
        <span class="cg-xfield__hint">{{ t.inHintAuto }}</span>
      </div>

      <!-- (c) Required single-choice — DsSelect with required + validation -->
      <DsSelect
        id="cg-in-dept"
        class="cg-field cg-field--required"
        :label="t.inRequired"
        :model-value="requiredDept"
        :options="deptOptions"
        :placeholder="t.inRequiredPh"
        required
        :invalid="requiredDept === ''"
        :error-message="requiredDept === '' ? t.inRequiredErr : t.inHintRequired"
        @update:model-value="onRequired"
      />

      <!-- (d) Radio group -->
      <fieldset class="cg-field cg-xfield cg-group">
        <legend class="cg-xfield__label">
          {{ t.inRadio }}
        </legend>
        <label
          v-for="opt in radioOptions"
          :key="opt.value"
          class="cg-option"
        >
          <input
            type="radio"
            name="cg-priority"
            :value="opt.value"
            :checked="radioValue === opt.value"
            @change="radioValue = opt.value"
          >
          <span class="cg-option__mark cg-option__mark--radio" />
          <span class="cg-option__text">{{ opt.label }}</span>
        </label>
        <span class="cg-xfield__hint">{{ t.inHintRadio }}</span>
      </fieldset>

      <!-- (e) Checkbox group -->
      <fieldset class="cg-field cg-xfield cg-group">
        <legend class="cg-xfield__label">
          {{ t.inCheck }}
        </legend>
        <label
          v-for="opt in checkOptions"
          :key="opt.value"
          class="cg-option"
        >
          <input
            type="checkbox"
            :value="opt.value"
            :checked="checkValues.includes(opt.value)"
            @change="toggleCheck(opt.value)"
          >
          <span class="cg-option__mark cg-option__mark--check" />
          <span class="cg-option__text">{{ opt.label }}</span>
        </label>
        <span class="cg-xfield__hint">{{ t.inHintCheck }}</span>
      </fieldset>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { DsChip, DsInput, DsSelect } from '../../index'
import CatalogGalleryHeader from './CatalogGalleryHeader.vue'
import type { CatalogStrings } from './catalogI18n'

interface Option { value: string; label: string }

const props = defineProps<{ t: CatalogStrings; locale: 'pt' | 'en' }>()

const statusOptions = computed(() => [
  { value: 'ativo', label: props.locale === 'en' ? 'Active' : 'Ativo' },
  { value: 'pendente', label: props.locale === 'en' ? 'Pending' : 'Pendente' },
  { value: 'inativo', label: props.locale === 'en' ? 'Inactive' : 'Inativo' },
  { value: 'bloqueado', label: props.locale === 'en' ? 'Blocked' : 'Bloqueado' },
])

function optionLabel(opts: readonly Option[], value: string): string {
  return opts.find((o) => o.value === value)?.label ?? value
}

/* (a) multi-select with chips */
const multiOptions = computed<Option[]>(() => [
  { value: 'vue', label: props.t.optVue },
  { value: 'ts', label: props.t.optTs },
  { value: 'quasar', label: props.t.optQuasar },
  { value: 'rust', label: props.t.optRust },
  { value: 'dotnet', label: props.t.optDotnet },
  { value: 'docker', label: props.t.optDocker },
])
const selectedMulti = ref<string[]>(['vue', 'ts'])
const availableMulti = computed(() => multiOptions.value.filter((o) => !selectedMulti.value.includes(o.value)))
function addMulti(value: string): void {
  if (value && !selectedMulti.value.includes(value)) selectedMulti.value.push(value)
}
function removeMulti(value: string): void {
  selectedMulti.value = selectedMulti.value.filter((v) => v !== value)
}

/* (b) searchable select / autocomplete */
const cityOptions = computed<Option[]>(() => [
  { value: 'recife', label: props.t.cityRecife },
  { value: 'sp', label: props.t.citySaoPaulo },
  { value: 'rio', label: props.t.cityRio },
  { value: 'cwb', label: props.t.cityCuritiba },
  { value: 'ssa', label: props.t.citySalvador },
  { value: 'poa', label: props.t.cityPortoAlegre },
])
const autoQuery = ref('')
const autoOpen = ref(false)
const autoResults = computed(() =>
  cityOptions.value.filter((o) => o.label.toLowerCase().includes(autoQuery.value.trim().toLowerCase())),
)
function pickAuto(label: string): void {
  autoQuery.value = label
  autoOpen.value = false
}

/* (c) required single-choice */
const deptOptions = computed<Option[]>(() => [
  { value: 'eng', label: props.t.deptEng },
  { value: 'ops', label: props.t.deptOps },
  { value: 'sales', label: props.t.deptSales },
  { value: 'support', label: props.t.deptSupport },
])
const requiredDept = ref('')
function onRequired(value: string | string[]): void {
  requiredDept.value = Array.isArray(value) ? (value[0] ?? '') : value
}

/* (d) radio group */
const radioOptions = computed<Option[]>(() => [
  { value: 'low', label: props.t.inRadioLow },
  { value: 'med', label: props.t.inRadioMed },
  { value: 'high', label: props.t.inRadioHigh },
])
const radioValue = ref('med')

/* (e) checkbox group */
const checkOptions = computed<Option[]>(() => [
  { value: 'email', label: props.t.inCheckEmail },
  { value: 'sms', label: props.t.inCheckSms },
  { value: 'push', label: props.t.inCheckPush },
])
const checkValues = ref<string[]>(['email'])
function toggleCheck(value: string): void {
  checkValues.value = checkValues.value.includes(value)
    ? checkValues.value.filter((v) => v !== value)
    : [...checkValues.value, value]
}
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

/* ---- extended input types (multi-select, autocomplete, required, groups) --- */
.cg-xfield {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
  border: none;
  margin: 0;
  padding: 0;
}

.cg-xfield__label {
  font-size: 13px;
  font-weight: 600;
  color: var(--ds-color-text);
  padding: 0;
}

.cg-xfield__hint {
  font-size: 12px;
  color: var(--ds-color-text-muted);
}

.cg-xcontrol {
  height: var(--ds-control-height);
  padding: 0 13px;
  border: var(--ds-border-width) solid var(--ds-color-border);
  border-radius: var(--ds-radius-md);
  background: var(--ds-color-surface);
  color: var(--ds-color-text);
  font-size: 14px;
  font-family: var(--ds-font-sans);
  outline: none;
  width: 100%;
}

.cg-xcontrol:focus {
  border-color: var(--ds-color-primary);
  box-shadow: var(--ds-focus-ring);
}

/* multi-select chips */
.cg-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  min-height: 24px;
  align-items: center;
}

.cg-chips__empty {
  font-size: 12px;
  font-style: italic;
  color: var(--ds-color-text-muted);
}

/* autocomplete dropdown */
.cg-auto {
  position: relative;
}

.cg-auto__list {
  position: absolute;
  z-index: 5;
  top: calc(var(--ds-control-height) + 46px);
  left: 0;
  right: 0;
  margin: 0;
  padding: 4px;
  list-style: none;
  background: var(--ds-color-surface);
  border: var(--ds-border-width) solid var(--ds-color-border);
  border-radius: var(--ds-radius-md);
  box-shadow: var(--ds-shadow);
  max-height: 180px;
  overflow-y: auto;
}

.cg-auto__item {
  appearance: none;
  display: block;
  width: 100%;
  text-align: left;
  border: none;
  background: transparent;
  color: var(--ds-color-text);
  font-family: var(--ds-font-sans);
  font-size: 13.5px;
  padding: 7px 10px;
  border-radius: var(--ds-radius-sm);
  cursor: pointer;
}

.cg-auto__item:hover {
  background: var(--ds-color-surface-muted);
}

.cg-auto__empty {
  padding: 8px 10px;
  font-size: 13px;
  color: var(--ds-color-text-muted);
}

/* required indicator (asterisk) on DsSelect label */
.cg-field--required :deep(.ntk-field__label)::after {
  content: ' *';
  color: var(--ds-color-danger);
  font-weight: 700;
}

/* radio / checkbox groups */
.cg-group {
  gap: 8px;
}

.cg-option {
  display: flex;
  align-items: center;
  gap: 9px;
  cursor: pointer;
  font-size: 13.5px;
  color: var(--ds-color-text);
}

.cg-option input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.cg-option__mark {
  inline-size: 18px;
  block-size: 18px;
  flex: 0 0 auto;
  border: var(--ds-border-width) solid var(--ds-color-border-strong);
  background: var(--ds-color-surface);
  position: relative;
  transition: border-color 0.15s, background 0.15s;
}

.cg-option__mark--radio {
  border-radius: 999px;
}

.cg-option__mark--check {
  border-radius: 5px;
}

.cg-option input:focus-visible + .cg-option__mark {
  box-shadow: var(--ds-focus-ring);
}

.cg-option input:checked + .cg-option__mark {
  border-color: var(--ds-color-primary);
  background: var(--ds-color-primary);
}

.cg-option input:checked + .cg-option__mark--radio::after {
  content: '';
  position: absolute;
  inset: 4px;
  border-radius: 999px;
  background: var(--ds-color-primary-contrast);
}

.cg-option input:checked + .cg-option__mark--check::after {
  content: '';
  position: absolute;
  left: 5px;
  top: 1px;
  width: 5px;
  height: 10px;
  border: solid var(--ds-color-primary-contrast);
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}
</style>