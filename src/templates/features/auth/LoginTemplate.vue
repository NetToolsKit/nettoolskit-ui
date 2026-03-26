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
                  color="grey-7"
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
                  color="grey-7"
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
                :color="submitColor"
                class="ntk-template-login__submit"
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
</script>

<style scoped lang="scss">
.ntk-template-login {
  min-height: 100%;
  background: var(--ntk-template-login-page-bg, #f8fafc);
}

.ntk-template-login__layout {
  min-height: 100%;
  display: grid;
  grid-template-columns: minmax(380px, 1.2fr) minmax(340px, 1fr);
}

.ntk-template-login__brand {
  position: relative;
  overflow: hidden;
  background: var(
    --ntk-template-login-brand-bg,
    linear-gradient(160deg, #0f172a 0%, #1e293b 45%, #164e63 100%)
  );
  color: var(--ntk-template-login-brand-text, #ffffff);
}

.ntk-template-login__brand::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 20% 20%, rgba(14, 165, 233, 0.16) 0%, rgba(14, 165, 233, 0) 54%),
    radial-gradient(circle at 80% 76%, rgba(20, 184, 166, 0.18) 0%, rgba(20, 184, 166, 0) 58%);
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
  color: var(--ntk-template-login-brand-subtitle, rgba(255, 255, 255, 0.78));
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
  color: var(--ntk-template-login-brand-feature-text, rgba(255, 255, 255, 0.92));
}

.ntk-template-login__feature-icon {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  padding: 6px;
  background: var(--ntk-template-login-brand-feature-bg, rgba(20, 184, 166, 0.2));
}

.ntk-template-login__brand-bottom {
  font-size: 11px;
  letter-spacing: 0.3px;
  color: var(--ntk-template-login-brand-footer, rgba(255, 255, 255, 0.6));
}

.ntk-template-login__form-area {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 18px;
  background: var(
    --ntk-template-login-form-bg,
    linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)
  );
}

.ntk-template-login__form-shell {
  width: min(560px, 100%);
  padding: 20px;
  border-radius: 14px;
  border: 1px solid var(--ntk-template-login-form-border, #e2e8f0);
  background: var(--ntk-template-login-form-card-bg, #ffffff);
  box-shadow: 0 14px 28px var(--ntk-template-login-form-shadow, rgba(15, 23, 42, 0.06));
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
  color: var(--ntk-template-login-form-title, #1e293b);
}

.ntk-template-login__form-subtitle {
  margin: 6px 0 0;
  color: var(--ntk-template-login-form-subtitle, #64748b);
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
  color: var(--ntk-template-login-version, #94a3b8);
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