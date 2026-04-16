<template>
  <q-page
    class="ntk-template-login"
    role="region"
    :aria-label="pageAriaLabel"
  >
    <div class="ntk-template-login__layout">
      <section
        v-if="showBrandPanel"
        class="ntk-template-login__brand"
        :aria-label="brandAriaLabel"
      >
        <slot name="brand-panel">
          <div class="ntk-template-login__brand-shell">
            <div class="ntk-template-login__brand-top">
              <img
                v-if="logoSrc"
                :src="logoSrc"
                :alt="logoAlt"
                class="ntk-template-login__logo"
              >
            </div>

            <div class="ntk-template-login__brand-content">
              <h1 class="ntk-template-login__brand-title">
                {{ brandTitle }}
              </h1>
              <p class="ntk-template-login__brand-subtitle">
                {{ brandSubtitle }}
              </p>

              <div class="ntk-template-login__features">
                <div
                  v-for="feature in resolvedFeatures"
                  :key="feature.id"
                  class="ntk-template-login__feature"
                >
                  <q-icon
                    :name="feature.icon || 'check_circle'"
                    size="20px"
                    class="ntk-template-login__feature-icon"
                  />
                  <span>{{ feature.text }}</span>
                </div>
              </div>
            </div>

            <div
              v-if="showLegalNotice"
              class="ntk-template-login__brand-bottom"
            >
              {{ resolvedLegalNotice }}
            </div>
          </div>
        </slot>
      </section>

      <section
        class="ntk-template-login__form-area"
        :aria-label="formAriaLabel"
      >
        <div class="ntk-template-login__form-shell">
          <img
            v-if="mobileLogoSrc"
            :src="mobileLogoSrc"
            :alt="logoAlt"
            class="ntk-template-login__mobile-logo"
          >

          <header class="ntk-template-login__form-header">
            <h2 class="ntk-template-login__form-title">
              {{ formTitle }}
            </h2>
            <p class="ntk-template-login__form-subtitle">
              {{ formSubtitle }}
            </p>
          </header>

          <q-form
            class="ntk-template-login__form"
            @submit.prevent="handleSubmit"
          >
            <q-input
              v-model="emailModel"
              :label="emailLabel"
              type="text"
              outlined
              dense
              stack-label
              autocomplete="off"
              :rules="[validateEmailRequired, validateEmailFormat]"
              :aria-label="emailAriaLabel"
            >
              <template #prepend>
                <q-icon
                  name="mail"
                  class="ntk-template-login__field-icon"
                />
              </template>
            </q-input>

            <q-input
              v-model="passwordModel"
              :label="passwordLabel"
              :type="showPassword ? 'text' : 'password'"
              outlined
              dense
              stack-label
              :rules="[validatePasswordRequired]"
              :aria-label="passwordAriaLabel"
            >
              <template #prepend>
                <q-icon
                  name="lock"
                  class="ntk-template-login__field-icon"
                />
              </template>
              <template #append>
                <q-icon
                  :name="showPassword ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  :aria-label="showPassword ? hidePasswordAriaLabel : showPasswordAriaLabel"
                  @click="showPassword = !showPassword"
                />
              </template>
            </q-input>

            <slot name="form-actions">
              <q-btn
                type="submit"
                :label="submitLabel"
                :class="resolveSubmitClass()"
                size="lg"
                unelevated
                no-caps
                :loading="loading"
                :disable="loading || disableSubmit"
                :aria-label="submitAriaLabel"
              >
                <template #loading>
                  <q-spinner
                    :thickness="3"
                    style="animation-duration: 0.6s"
                  />
                </template>
              </q-btn>
            </slot>
          </q-form>

          <div
            v-if="showVersion && versionLabel"
            class="ntk-template-login__version"
          >
            {{ versionLabel }}
          </div>
        </div>
      </section>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

interface TemplateLoginFeature {
  id: string
  text: string
  icon?: string
}

interface TemplateLoginSubmitPayload {
  email: string
  password: string
}

type TemplateLoginTone =
  | 'neutral'
  | 'primary'
  | 'info'
  | 'success'
  | 'warning'
  | 'danger'

const props = withDefaults(defineProps<{
  email?: string
  password?: string
  loading?: boolean
  disableSubmit?: boolean
  showBrandPanel?: boolean
  showVersion?: boolean
  showLegalNotice?: boolean
  logoSrc?: string
  mobileLogoSrc?: string
  logoAlt?: string
  brandTitle?: string
  brandSubtitle?: string
  features?: TemplateLoginFeature[]
  formTitle?: string
  formSubtitle?: string
  emailLabel?: string
  passwordLabel?: string
  submitLabel?: string
  submitColor?: string
  versionLabel?: string
  legalNotice?: string
  emailRequiredMessage?: string
  emailInvalidMessage?: string
  passwordRequiredMessage?: string
  pageAriaLabel?: string
  brandAriaLabel?: string
  formAriaLabel?: string
  emailAriaLabel?: string
  passwordAriaLabel?: string
  submitAriaLabel?: string
  showPasswordAriaLabel?: string
  hidePasswordAriaLabel?: string
}>(), {
  email: '',
  password: '',
  loading: false,
  disableSubmit: false,
  showBrandPanel: true,
  showVersion: false,
  showLegalNotice: true,
  logoSrc: '',
  mobileLogoSrc: '',
  logoAlt: 'Brand logo',
  brandTitle: 'Welcome to your workspace',
  brandSubtitle: 'Access your operations, dashboards and collaboration tools in one secure portal.',
  features: () => [],
  formTitle: 'Sign in',
  formSubtitle: 'Use your credentials to continue.',
  emailLabel: 'Email',
  passwordLabel: 'Password',
  submitLabel: 'Sign in',
  submitColor: 'primary',
  versionLabel: '',
  legalNotice: '',
  emailRequiredMessage: 'Email is required.',
  emailInvalidMessage: 'Enter a valid email.',
  passwordRequiredMessage: 'Password is required.',
  pageAriaLabel: 'Login page',
  brandAriaLabel: 'Brand panel',
  formAriaLabel: 'Authentication form',
  emailAriaLabel: 'Email input',
  passwordAriaLabel: 'Password input',
  submitAriaLabel: 'Submit login form',
  showPasswordAriaLabel: 'Show password',
  hidePasswordAriaLabel: 'Hide password',
})

const emit = defineEmits<{
  'update:email': [value: string]
  'update:password': [value: string]
  'submit': [payload: TemplateLoginSubmitPayload]
}>()

const showPassword = ref(false)

const resolvedFeatures = computed<TemplateLoginFeature[]>(() => {
  if (props.features.length > 0) {
    return props.features
  }

  return [
    { id: 'feature-1', text: 'Centralized team access', icon: 'groups' },
    { id: 'feature-2', text: 'Operational visibility in real time', icon: 'monitoring' },
    { id: 'feature-3', text: 'Role-based permissions and security', icon: 'admin_panel_settings' },
  ]
})

const emailModel = computed<string>({
  get: () => props.email,
  set: (value: string) => emit('update:email', value),
})

const passwordModel = computed<string>({
  get: () => props.password,
  set: (value: string) => emit('update:password', value),
})

const currentYear = computed<number>(() => new Date().getFullYear())

const resolvedLegalNotice = computed<string>(() => {
  if (props.legalNotice.trim()) {
    return props.legalNotice
  }
  return `© ${currentYear.value} All rights reserved`
})

function validateEmailRequired(value: string): true | string {
  return Boolean(value) || props.emailRequiredMessage
}

function validateEmailFormat(value: string): true | string {
  if (!value) {
    return true
  }
  return /.+@.+\..+/.test(value) || props.emailInvalidMessage
}

function validatePasswordRequired(value: string): true | string {
  return Boolean(value) || props.passwordRequiredMessage
}

function handleSubmit(): void {
  emit('submit', {
    email: emailModel.value.trim(),
    password: passwordModel.value,
  })
}

function resolveSubmitClass(): string[] {
  return [
    'ntk-template-login__submit',
    'ntk-template-tone-action',
    `ntk-template-tone-action--tone-${resolveSubmitTone(props.submitColor)}`,
    'ntk-template-tone-action--variant-solid',
  ]
}

function resolveSubmitTone(color: string | undefined): TemplateLoginTone {
  const value = color?.trim().toLowerCase() ?? ''

  if (!value) {
    return 'primary'
  }

  if (['primary', 'accent', 'brand', 'blue', 'indigo', 'violet'].includes(value)) {
    return 'primary'
  }

  if (['info', 'cyan', 'teal'].includes(value)) {
    return 'info'
  }

  if (['positive', 'success', 'green'].includes(value)) {
    return 'success'
  }

  if (['warning', 'amber', 'orange', 'yellow'].includes(value)) {
    return 'warning'
  }

  if (['negative', 'danger', 'error', 'red'].includes(value)) {
    return 'danger'
  }

  if (
    value.startsWith('grey')
    || value.startsWith('gray')
    || ['neutral', 'slate', 'dark', 'secondary'].includes(value)
  ) {
    return 'neutral'
  }

  return 'primary'
}
</script>

<style scoped lang="scss">
.ntk-template-login {
  --ntk-template-login-brand-subtitle: var(
    --ntk-login-brand-subtitle,
    color-mix(in srgb, var(--ntk-template-login-brand-text) 88%, transparent)
  );
  --ntk-template-login-brand-feature-text: var(
    --ntk-login-brand-feature-text,
    color-mix(in srgb, var(--ntk-template-login-brand-text) 96%, transparent)
  );
  --ntk-template-login-brand-feature-bg: var(
    --ntk-login-brand-feature-bg,
    color-mix(in srgb, var(--ntk-template-login-brand-text) 18%, transparent)
  );
  --ntk-template-login-brand-footer: var(
    --ntk-login-brand-footer,
    color-mix(in srgb, var(--ntk-template-login-brand-text) 74%, transparent)
  );
  --ntk-template-login-field-bg: var(
    --ntk-template-login-field-bg,
    color-mix(
      in srgb,
      var(--ntk-template-login-form-card-bg, var(--ntk-bg-card)) 88%,
      var(--ntk-template-login-form-bg, var(--ntk-bg-primary))
    )
  );
  --ntk-template-login-field-border: var(--ntk-template-login-form-border, var(--ntk-border-color));
  --ntk-template-login-field-text: var(--ntk-template-login-form-title, var(--ntk-text-primary));
  --ntk-template-login-field-label: var(--ntk-template-login-form-subtitle, var(--ntk-text-secondary));
  --ntk-template-login-field-placeholder: var(
    --ntk-login-field-placeholder,
    var(--ntk-input-placeholder, var(--ntk-template-login-version, var(--ntk-text-muted)))
  );

  min-height: 100%;
  background: var(--ntk-template-login-page-bg, var(--ntk-bg-secondary));
}

.ntk-template-login__layout {
  min-height: 100%;
  display: grid;
  grid-template-columns: minmax(380px, 1.2fr) minmax(340px, 1fr);
}

.ntk-template-login__brand {
  position: relative;
  overflow: hidden;
  background: var(--ntk-template-login-brand-bg, var(--ntk-primary-gradient, var(--ntk-accent)));
  color: var(--ntk-template-login-brand-text, var(--ntk-text-on-accent, var(--ntk-text-primary)));
}

.ntk-template-login__brand::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(
    --ntk-template-login-brand-overlay,
    radial-gradient(circle at 20% 20%, color-mix(in srgb, var(--semantic-info-primary, var(--ntk-info)) 16%, transparent) 0%, transparent 54%),
    radial-gradient(circle at 80% 76%, color-mix(in srgb, var(--ntk-accent) 18%, transparent) 0%, transparent 58%)
  );
}

.ntk-template-login__brand-shell {
  position: relative;
  z-index: 1;
  min-height: 100%;
  padding: 44px 38px;
  display: flex;
  flex-direction: column;
  gap: 26px;
}

.ntk-template-login__brand-top {
  min-height: 44px;
}

.ntk-template-login__logo {
  width: auto;
  max-width: 220px;
  max-height: 64px;
}

.ntk-template-login__brand-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.ntk-template-login__brand-title {
  margin: 0;
  font-size: clamp(28px, 3.2vw, 38px);
  line-height: 1.08;
  letter-spacing: -0.5px;
}

.ntk-template-login__brand-subtitle {
  margin: 14px 0 0;
  max-width: 560px;
  color: var(--ntk-template-login-brand-subtitle);
  font-size: 15px;
  line-height: 1.55;
}

.ntk-template-login__features {
  margin-top: 28px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ntk-template-login__feature {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: var(--ntk-template-login-brand-feature-text);
}

.ntk-template-login__feature-icon {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  padding: 6px;
  background: var(--ntk-template-login-brand-feature-bg);
}

.ntk-template-login__brand-bottom {
  font-size: 11px;
  letter-spacing: 0.3px;
  color: var(--ntk-template-login-brand-footer);
}

.ntk-template-login__form-area {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 18px;
  background: var(--ntk-template-login-form-bg, linear-gradient(180deg, var(--ntk-bg-secondary) 0%, var(--ntk-bg-primary) 100%));
}

.ntk-template-login__form-shell {
  width: min(560px, 100%);
  padding: 20px;
  border-radius: 14px;
  border: 1px solid var(--ntk-template-login-form-border, var(--ntk-border-color));
  background: var(--ntk-template-login-form-card-bg, var(--ntk-bg-card));
  box-shadow: 0 14px 28px var(--ntk-template-login-form-shadow, color-mix(in srgb, var(--ntk-text-primary) 6%, transparent));
  color: var(--ntk-template-login-field-text);
}

.ntk-template-login__mobile-logo {
  height: 34px;
  width: auto;
  margin-bottom: 14px;
}

.ntk-template-login__form-header {
  margin-bottom: 18px;
}

.ntk-template-login__form-title {
  margin: 0;
  font-size: 24px;
  line-height: 1.2;
  color: var(--ntk-template-login-form-title, var(--ntk-text-primary));
}

.ntk-template-login__form-subtitle {
  margin: 6px 0 0;
  color: var(--ntk-template-login-form-subtitle, var(--ntk-text-secondary));
}

.ntk-template-login__form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ntk-template-login__submit {
  margin-top: 10px;
  width: 100%;
}

.ntk-template-login__version {
  margin-top: 12px;
  font-size: 11px;
  text-align: center;
  color: var(--ntk-template-login-version, var(--ntk-text-muted));
}

.ntk-template-login__field-icon {
  color: var(--ntk-template-form-icon-color, var(--ntk-input-icon));
}

.ntk-template-login__form :deep(.q-field__control) {
  background: var(--ntk-template-login-field-bg);
  color: var(--ntk-template-login-field-text);
}

.ntk-template-login__form :deep(.q-field--outlined .q-field__control::before) {
  border-color: var(--ntk-template-login-field-border);
}

.ntk-template-login__form :deep(.q-field--outlined.q-field--focused .q-field__control::before),
.ntk-template-login__form :deep(.q-field--outlined.q-field--focused .q-field__control::after) {
  border-color: var(--ntk-accent, var(--ntk-primary));
}

.ntk-template-login__form :deep(.q-field__label),
.ntk-template-login__form :deep(.q-field__native),
.ntk-template-login__form :deep(.q-field__input),
.ntk-template-login__form :deep(.q-field__marginal) {
  color: var(--ntk-template-login-field-label);
}

.ntk-template-login__form :deep(.q-field__native),
.ntk-template-login__form :deep(.q-field__input) {
  color: var(--ntk-template-login-field-text);
}

.ntk-template-login__form :deep(input::placeholder) {
  color: var(--ntk-template-login-field-placeholder);
}

@media (max-width: 1024px) {
  .ntk-template-login__layout {
    grid-template-columns: 1fr;
  }

  .ntk-template-login__brand {
    display: none;
  }
}
</style>
