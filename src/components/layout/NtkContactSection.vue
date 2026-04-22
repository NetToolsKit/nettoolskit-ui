<template>
  <NtkSection
    :id="sectionId"
    :variant="variant"
    :size="size"
    :centered="false"
  >
    <template #header>
      <NtkSectionHeader
        :title="title"
        :subtitle="subtitle"
        spacing="lg"
      />
    </template>

    <div class="ntk-contact__grid">
      <q-form
        v-if="showForm"
        class="ntk-contact__form"
        @submit.prevent="submitForm"
      >
        <q-input
          v-for="field in fields"
          :key="field.id"
          v-model="formState[field.id]"
          :label="field.label"
          :placeholder="field.placeholder"
          :type="field.type === 'textarea' ? 'textarea' : field.type"
          :autogrow="field.type === 'textarea'"
          outlined
          dense
          :rules="field.required ? [requiredRule] : []"
        />

        <NtkButton
          type="submit"
          unelevated
          :label="submitLabel"
          class="ntk-contact__submit ntk-contact__action--primary"
        />
      </q-form>

      <div class="ntk-contact__channels">
        <article
          v-for="channel in channels"
          :key="channel.id"
          class="ntk-contact__channel"
        >
          <div class="ntk-contact__channel-icon">
            <q-icon :name="channel.icon || 'contact_support'" />
          </div>

          <div class="ntk-contact__channel-content">
            <strong>{{ channel.label }}</strong>
            <a
              v-if="channel.href"
              :href="channel.href"
              :target="channel.external ? '_blank' : undefined"
              :rel="channel.external ? 'noopener noreferrer' : undefined"
            >
              {{ channel.value }}
            </a>
            <span v-else>{{ channel.value }}</span>
          </div>
        </article>

        <article
          v-if="portalAction"
          class="ntk-contact__portal"
        >
          <div class="ntk-contact__portal-content">
            <strong>Ja e cliente?</strong>
            <p>{{ portalAction.description || 'Access the client area to track your projects.' }}</p>
          </div>
          <NtkButton
            :label="portalAction.label"
            unelevated
            class="ntk-contact__action--primary"
            :href="portalAction.href"
            :target="portalAction.external ? '_blank' : undefined"
          />
        </article>
      </div>
    </div>
  </NtkSection>
</template>

<script setup lang="ts">
/**
 * Src/components/layout/Ntk Contact Section module.
 */

import { reactive } from 'vue'
import NtkSection from './NtkSection.vue'
import NtkSectionHeader from '../ui/NtkSectionHeader.vue'
import NtkButton from '../ui/NtkButton.vue'

interface ContactField {
  id: string
  label: string
  placeholder?: string
  required?: boolean
  type?: 'text' | 'email' | 'tel' | 'textarea'
}

interface ContactChannel {
  id: string
  label: string
  value: string
  href?: string
  external?: boolean
  icon?: string
}

interface ContactPortalAction {
  label: string
  href: string
  external?: boolean
  description?: string
}

interface Props {
  sectionId?: string
  title: string
  subtitle?: string
  showForm?: boolean
  fields?: ContactField[]
  channels?: ContactChannel[]
  portalAction?: ContactPortalAction
  submitLabel?: string
  variant?: 'default' | 'light' | 'dark' | 'gradient'
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const props = withDefaults(defineProps<Props>(), {
  sectionId: 'contact',
  subtitle: '',
  showForm: true,
  fields: () => [],
  channels: () => [],
  portalAction: undefined,
  submitLabel: 'Send message',
  variant: 'default',
  size: 'md',
})

const emit = defineEmits<{
  (e: 'submit', payload: Record<string, string>): void
}>()

const formState = reactive<Record<string, string>>({})
for (const field of props.fields) {
  formState[field.id] = ''
}

/**
 * Handles required rule.
 */
function requiredRule(value: string): true | string {
  return Boolean(value && value.trim()) || 'Required field'
}

/**
 * Handles submit form.
 */
function submitForm(): void {
  emit('submit', { ...formState })
}
</script>

<style scoped>
.ntk-contact__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--ntk-spacing-xl);
}

.ntk-contact__form {
  display: flex;
  flex-direction: column;
  gap: var(--ntk-spacing-md);
}

.ntk-contact__submit {
  width: fit-content;
}

.ntk-contact__action--primary {
  background: var(--ntk-button-primary-bg, var(--ntk-primary)) !important;
  color: var(--ntk-button-primary-text, var(--ntk-text-on-accent, var(--ntk-text-on-primary, var(--ntk-text-inverse)))) !important;
}

.ntk-contact__channels {
  display: flex;
  flex-direction: column;
  gap: var(--ntk-spacing-md);
}

.ntk-contact__channel {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: var(--ntk-spacing-md);
  border: 1px solid var(--ntk-border-color);
  border-radius: var(--ntk-radius-lg, 12px);
  padding: var(--ntk-spacing-md);
  background: var(--ntk-bg-card);
}

.ntk-contact__channel-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--ntk-bg-secondary);
  color: var(--ntk-primary);
}

.ntk-contact__channel-content {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.ntk-contact__channel-content strong {
  color: var(--ntk-text-dark);
}

.ntk-contact__channel-content a,
.ntk-contact__channel-content span {
  color: var(--ntk-text-light);
  text-decoration: none;
}

.ntk-contact__channel-content a:hover {
  color: var(--ntk-primary);
  text-decoration: underline;
}

.ntk-contact__portal {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--ntk-spacing-md);
  border: 1px solid var(--ntk-border-color);
  border-radius: var(--ntk-radius-lg, 12px);
  padding: var(--ntk-spacing-md);
  background: var(--ntk-gradient-subtle);
}

.ntk-contact__portal-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.ntk-contact__portal-content strong {
  color: var(--ntk-text-dark);
}

.ntk-contact__portal-content p {
  margin: 0;
  color: var(--ntk-text-light);
  font-size: var(--ntk-font-size-sm);
}

@media (max-width: 900px) {
  .ntk-contact__grid {
    grid-template-columns: 1fr;
  }

  .ntk-contact__portal {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
