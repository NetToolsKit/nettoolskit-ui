<template>
  <CatalogScreenFrame
    anchor="login"
    :badge="t.loginBadge"
    :title="t.loginTitle"
    :desc="t.loginDesc"
    :t="t"
  >
    <template #default="{ isFull }">
      <div
        class="lg-split"
        :class="{ 'lg-split--full': isFull }"
      >
        <!-- ESQUERDA: marca + empresa (mais larga) -->
        <div class="lg-brand">
          <span
            class="lg-blob lg-blob--a"
            aria-hidden="true"
          />
          <span
            class="lg-blob lg-blob--b"
            aria-hidden="true"
          />
          <div class="lg-lockup">
            <span class="lg-logo">N</span>
            <span class="lg-logo__name">NetToolsKit</span>
          </div>
          <div class="lg-pitch">
            <h3 class="lg-tagline">
              {{ t.brandTagline }}
            </h3>
            <div class="lg-feats">
              <div
                v-for="feat in feats"
                :key="feat"
                class="lg-feat"
              >
                <span class="lg-check">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="3"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </span>
                {{ feat }}
              </div>
            </div>
          </div>
          <span class="lg-foot">© NetToolsKit · NTK-FE-STD-001</span>
        </div>

        <!-- DIREITA: formulário (mais estreita) -->
        <div class="lg-form">
          <div class="lg-form__head">
            <h3 class="lg-welcome">
              {{ t.loginWelcome }}
            </h3>
            <p class="lg-sub">
              {{ t.loginSub }}
            </p>
          </div>
          <div class="lg-field">
            <label
              class="lg-label"
              for="lg-email"
            >{{ t.inEmail }}</label>
            <input
              id="lg-email"
              class="lg-input"
              value="contato@empresa.com.br"
            >
          </div>
          <div class="lg-field">
            <label
              class="lg-label"
              for="lg-pass"
            >{{ t.loginPass }}</label>
            <input
              id="lg-pass"
              class="lg-input"
              type="password"
              value="123456789"
            >
          </div>
          <div class="lg-row">
            <label class="lg-remember">
              <input
                type="checkbox"
                checked
                class="lg-checkbox"
              >
              {{ t.loginRemember }}
            </label>
            <a
              href="#login"
              class="lg-link"
            >{{ t.loginForgot }}</a>
          </div>
          <button
            type="button"
            class="lg-primary"
          >
            {{ t.loginBtn }}
          </button>
          <div class="lg-or">
            <span class="lg-hr" />
            {{ t.loginOr }}
            <span class="lg-hr" />
          </div>
          <button
            type="button"
            class="lg-outline"
          >
            {{ t.loginSso }}
          </button>
          <p class="lg-noacc">
            {{ t.loginNoAccount }} <a
              href="#login"
              class="lg-link"
            >{{ t.loginSignup }}</a>
          </p>
        </div>
      </div>
    </template>
  </CatalogScreenFrame>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import CatalogScreenFrame from './CatalogScreenFrame.vue'
import type { CatalogStrings } from './catalogI18n'

const props = defineProps<{ t: CatalogStrings; locale: 'pt' | 'en' }>()

const feats = computed(() => [props.t.feat1, props.t.feat2, props.t.feat3])
</script>

<style scoped>
.lg-split {
  height: 520px;
  border: var(--ds-border-width) solid var(--ds-color-border-strong);
  border-radius: var(--ds-radius-lg);
  box-shadow: var(--ds-shadow);
  background: var(--ds-color-surface);
  display: grid;
  grid-template-columns: 1.55fr 1fr;
  overflow: hidden;
}

.lg-split--full {
  height: calc(100vh - 48px);
}

/* Left brand panel */
.lg-brand {
  position: relative;
  overflow: hidden;
  padding: 36px;
  background: color-mix(in srgb, var(--ds-color-primary) 7%, var(--ds-color-surface));
  color: var(--ds-color-text);
  border-right: var(--ds-border-width) solid var(--ds-color-border);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 24px;
}

.lg-blob {
  position: absolute;
  border-radius: 999px;
}

.lg-blob--a {
  right: -60px;
  top: -60px;
  width: 240px;
  height: 240px;
  background: color-mix(in srgb, var(--ds-color-primary) 12%, transparent);
}

.lg-blob--b {
  right: 30px;
  bottom: -80px;
  width: 200px;
  height: 200px;
  background: color-mix(in srgb, var(--ds-color-primary) 8%, transparent);
}

.lg-lockup {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
}

.lg-logo {
  width: 34px;
  height: 34px;
  border-radius: 9px;
  background: var(--ds-color-primary);
  color: var(--ds-color-primary-contrast);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--ds-font-mono);
  font-weight: 700;
  font-size: 16px;
}

.lg-logo__name {
  font-weight: 700;
  font-size: 18px;
  letter-spacing: -0.01em;
}

.lg-pitch {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.lg-tagline {
  margin: 0;
  font-size: 30px;
  line-height: 1.15;
  font-weight: 700;
  letter-spacing: -0.02em;
  max-width: 16ch;
}

.lg-feats {
  display: flex;
  flex-direction: column;
  gap: 11px;
  font-size: 14px;
}

.lg-feat {
  display: flex;
  align-items: center;
  gap: 10px;
}

.lg-check {
  width: 20px;
  height: 20px;
  border-radius: 999px;
  background: var(--ds-color-primary-soft);
  color: var(--ntk-on-soft);
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
}

.lg-foot {
  position: relative;
  font-size: 11.5px;
  color: var(--ds-color-text-muted);
  font-family: var(--ds-font-mono);
}

/* Right form panel */
.lg-form {
  padding: 34px 30px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 15px;
  overflow: auto;
}

.lg-form__head {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.lg-welcome {
  margin: 0;
  font-size: 21px;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.lg-sub {
  margin: 0;
  font-size: 13.5px;
  color: var(--ds-color-text-muted);
}

.lg-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.lg-label {
  font-size: 13px;
  font-weight: 600;
}

.lg-input {
  height: 42px;
  padding: 0 13px;
  border: var(--ds-border-width) solid var(--ds-color-border);
  border-radius: var(--ds-radius-md);
  background: var(--ds-color-surface);
  color: var(--ds-color-text);
  font-size: 14px;
  font-family: var(--ds-font-sans);
  outline: none;
}

.lg-input:focus {
  border-color: var(--ds-color-primary);
  box-shadow: var(--ds-focus-ring);
}

.lg-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  font-size: 12.5px;
}

.lg-remember {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: var(--ds-color-text-muted);
  cursor: pointer;
}

.lg-checkbox {
  width: 15px;
  height: 15px;
  accent-color: var(--ds-color-primary);
}

.lg-link {
  color: var(--ds-color-primary);
  text-decoration: none;
  font-weight: 600;
}

.lg-primary {
  height: 44px;
  border-radius: var(--ds-radius-md);
  border: none;
  background: var(--ds-color-primary);
  color: var(--ds-color-primary-contrast);
  font-family: var(--ds-font-sans);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.lg-primary:hover {
  background: var(--ds-color-primary-hover);
}

.lg-or {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--ds-color-text-muted);
  font-size: 11.5px;
}

.lg-hr {
  flex: 1;
  height: 1px;
  background: var(--ds-color-border);
}

.lg-outline {
  height: 44px;
  border-radius: var(--ds-radius-md);
  border: var(--ds-border-width) solid var(--ds-color-border);
  background: var(--ds-color-surface);
  color: var(--ds-color-text);
  font-family: var(--ds-font-sans);
  font-size: 13.5px;
  font-weight: 600;
  cursor: pointer;
}

.lg-outline:hover {
  background: var(--ds-color-surface-muted);
}

.lg-noacc {
  margin: 2px 0 0;
  font-size: 12.5px;
  color: var(--ds-color-text-muted);
  text-align: center;
}
</style>