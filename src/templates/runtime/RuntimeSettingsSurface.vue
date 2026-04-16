<template>
  <q-page class="ntk-template-runtime-settings" role="region" aria-label="Configurações do runtime">
    <section class="ntk-template-runtime-settings__hero">
      <div>
        <h1>Configurações</h1>
        <p>Preferências locais do runtime, branding do workspace e atalhos operacionais.</p>
      </div>

      <div class="ntk-template-runtime-settings__hero-actions">
        <q-btn
          no-caps
          unelevated
          icon="save"
          label="Salvar alterações"
          class="ntk-template-runtime-settings__action ntk-template-runtime-settings__action--primary"
          @click="submitForm"
        />
        <q-btn
          no-caps
          unelevated
          icon="restart_alt"
          label="Resetar runtime"
          class="ntk-template-runtime-settings__action ntk-template-runtime-settings__action--secondary"
          @click="$emit('reset-runtime-data')"
        />
      </div>
    </section>

    <section class="ntk-template-runtime-settings__summary">
      <article class="ntk-template-runtime-settings__summary-card">
        <span>Workspace ativo</span>
        <strong>{{ localModel.workspaceName }}</strong>
      </article>
      <article class="ntk-template-runtime-settings__summary-card">
        <span>Clientes</span>
        <strong>{{ clientCount }}</strong>
      </article>
      <article class="ntk-template-runtime-settings__summary-card">
        <span>Pedidos</span>
        <strong>{{ orderCount }}</strong>
      </article>
      <article class="ntk-template-runtime-settings__summary-card">
        <span>Tema atual</span>
        <strong>{{ activeThemeLabel }}</strong>
      </article>
    </section>

    <form class="ntk-template-runtime-settings__grid" @submit.prevent="submitForm">
      <q-card class="ntk-template-runtime-settings__card">
        <q-card-section>
          <header class="ntk-template-runtime-settings__section-header">
            <h2>Branding e operação</h2>
            <p>Ajusta o nome do workspace e os dados exibidos no shell principal.</p>
          </header>

          <label class="ntk-template-runtime-settings__field">
            <span>Nome do workspace</span>
            <input v-model="localModel.workspaceName" type="text" name="runtime-workspace-name">
          </label>

          <label class="ntk-template-runtime-settings__field">
            <span>Nome do operador</span>
            <input v-model="localModel.operatorName" type="text" name="runtime-operator-name">
          </label>

          <label class="ntk-template-runtime-settings__field">
            <span>E-mail de suporte</span>
            <input v-model="localModel.supportEmail" type="email" name="runtime-support-email">
          </label>
        </q-card-section>
      </q-card>

      <q-card class="ntk-template-runtime-settings__card">
        <q-card-section>
          <header class="ntk-template-runtime-settings__section-header">
            <h2>Preferências locais</h2>
            <p>Define idioma, timezone e o comportamento padrão das superfícies do runtime.</p>
          </header>

          <div class="ntk-template-runtime-settings__field-row">
            <label class="ntk-template-runtime-settings__field">
              <span>Locale</span>
              <input v-model="localModel.locale" type="text" name="runtime-locale">
            </label>

            <label class="ntk-template-runtime-settings__field">
              <span>Timezone</span>
              <input v-model="localModel.timezone" type="text" name="runtime-timezone">
            </label>
          </div>

          <label class="ntk-template-runtime-settings__toggle">
            <input v-model="localModel.notificationsEnabled" type="checkbox" name="runtime-notifications-enabled">
            <div>
              <strong>Notificações habilitadas</strong>
              <p>Exibe alertas e confirmações nas jornadas locais do runtime.</p>
            </div>
          </label>

          <label class="ntk-template-runtime-settings__toggle">
            <input v-model="localModel.compactTables" type="checkbox" name="runtime-compact-tables">
            <div>
              <strong>Tabelas compactas por padrão</strong>
              <p>Faz listas de clientes e pedidos abrirem em visualização de tabela.</p>
            </div>
          </label>

          <label class="ntk-template-runtime-settings__toggle">
            <input v-model="localModel.autoCreateFollowUp" type="checkbox" name="runtime-auto-follow-up">
            <div>
              <strong>Criar follow-up automático</strong>
              <p>Usado pelas ações rápidas de pedidos e pelo fluxo operacional local.</p>
            </div>
          </label>
        </q-card-section>
      </q-card>
    </form>
  </q-page>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'

import type { TemplateRuntimeSettings } from './runtime-data.template'

const props = defineProps<{
  settings: TemplateRuntimeSettings
  clientCount: number
  orderCount: number
  activeThemeLabel: string
}>()

const emit = defineEmits<{
  save: [settings: TemplateRuntimeSettings]
  'reset-runtime-data': []
}>()

const localModel = reactive<TemplateRuntimeSettings>({ ...props.settings })

watch(
  () => props.settings,
  (value) => {
    Object.assign(localModel, value)
  },
  { deep: true }
)

function submitForm(): void {
  emit('save', { ...localModel })
}
</script>

<style scoped lang="scss">
.ntk-template-runtime-settings {
  --ntk-template-runtime-settings-bg: var(--ntk-template-page-bg, var(--ntk-bg-secondary));
  --ntk-template-runtime-settings-surface: var(--ntk-template-page-card-bg, var(--ntk-bg-card));
  --ntk-template-runtime-settings-border: var(--ntk-template-page-border, var(--ntk-border-color));
  --ntk-template-runtime-settings-title: var(--ntk-template-page-title, var(--ntk-text-primary));
  --ntk-template-runtime-settings-subtitle: var(--ntk-template-page-subtitle, var(--ntk-text-secondary));
  --ntk-template-runtime-settings-text: var(--ntk-template-page-text, var(--ntk-text-body, var(--ntk-text-primary)));
  --ntk-template-runtime-settings-row: var(--ntk-template-page-row-bg, var(--ntk-bg-tertiary));
  --ntk-template-runtime-settings-accent: var(--ntk-primary, var(--ntk-accent));
  --ntk-template-runtime-settings-accent-contrast: var(--ntk-text-on-accent, var(--ntk-text-primary));
  --ntk-template-runtime-settings-accent-soft: color-mix(in srgb, var(--ntk-template-runtime-settings-accent) 12%, transparent);
  --ntk-template-runtime-settings-focus: var(--ntk-border-focus, var(--ntk-template-runtime-settings-accent));

  padding: 12px;
  background: var(--ntk-template-runtime-settings-bg);
}

.ntk-template-runtime-settings__hero {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
  padding: 18px 20px;
  border: 1px solid var(--ntk-template-runtime-settings-border);
  border-radius: 12px;
  background: var(--ntk-template-runtime-settings-surface);
}

.ntk-template-runtime-settings__hero h1,
.ntk-template-runtime-settings__section-header h2 {
  margin: 0;
  font-size: 20px;
  color: var(--ntk-template-runtime-settings-title);
}

.ntk-template-runtime-settings__hero p,
.ntk-template-runtime-settings__section-header p {
  margin: 6px 0 0;
  color: var(--ntk-template-runtime-settings-subtitle);
}

.ntk-template-runtime-settings__hero-actions {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  flex-wrap: wrap;
}

.ntk-template-runtime-settings__action {
  border-radius: 10px;
  font-weight: 600;
}

.ntk-template-runtime-settings__action--primary {
  background: var(--ntk-template-runtime-settings-accent);
  color: var(--ntk-template-runtime-settings-accent-contrast);
}

.ntk-template-runtime-settings__action--secondary {
  border: 1px solid var(--ntk-template-runtime-settings-border);
  background: var(--ntk-template-runtime-settings-surface);
  color: var(--ntk-template-runtime-settings-title);
}

.ntk-template-runtime-settings__action:focus-visible {
  outline: 2px solid var(--ntk-template-runtime-settings-focus);
  outline-offset: 2px;
}

.ntk-template-runtime-settings__summary {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 16px;
}

.ntk-template-runtime-settings__summary-card,
.ntk-template-runtime-settings__card {
  border: 1px solid var(--ntk-template-runtime-settings-border);
  border-radius: 12px;
  background: var(--ntk-template-runtime-settings-surface);
}

.ntk-template-runtime-settings__summary-card {
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.ntk-template-runtime-settings__summary-card span {
  color: var(--ntk-template-runtime-settings-subtitle);
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.ntk-template-runtime-settings__summary-card strong {
  color: var(--ntk-template-runtime-settings-title);
  font-size: 18px;
}

.ntk-template-runtime-settings__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.ntk-template-runtime-settings__section-header {
  margin-bottom: 16px;
}

.ntk-template-runtime-settings__field-row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.ntk-template-runtime-settings__field {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 14px;
}

.ntk-template-runtime-settings__field span {
  font-size: 12px;
  font-weight: 600;
  color: var(--ntk-template-runtime-settings-text);
}

.ntk-template-runtime-settings__field input {
  min-height: 42px;
  border: 1px solid var(--ntk-template-runtime-settings-border);
  border-radius: 10px;
  padding: 0 12px;
  background: var(--ntk-template-runtime-settings-row);
  color: var(--ntk-template-runtime-settings-title);
}

.ntk-template-runtime-settings__field input::placeholder {
  color: var(--ntk-template-runtime-settings-subtitle);
}

.ntk-template-runtime-settings__field input:focus-visible {
  outline: 2px solid var(--ntk-template-runtime-settings-focus);
  outline-offset: 2px;
}

.ntk-template-runtime-settings__toggle {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 12px;
  align-items: start;
  padding: 12px;
  border-radius: 10px;
  background: var(--ntk-template-runtime-settings-row);
  margin-bottom: 10px;
}

.ntk-template-runtime-settings__toggle input {
  margin-top: 2px;
  accent-color: var(--ntk-template-runtime-settings-accent);
}

.ntk-template-runtime-settings__toggle strong {
  display: block;
  color: var(--ntk-template-runtime-settings-title);
}

.ntk-template-runtime-settings__toggle p {
  margin: 4px 0 0;
  color: var(--ntk-template-runtime-settings-subtitle);
  font-size: 13px;
}

@media (max-width: 980px) {
  .ntk-template-runtime-settings__summary,
  .ntk-template-runtime-settings__grid,
  .ntk-template-runtime-settings__field-row {
    grid-template-columns: 1fr;
  }

  .ntk-template-runtime-settings__hero {
    flex-direction: column;
  }
}
</style>
