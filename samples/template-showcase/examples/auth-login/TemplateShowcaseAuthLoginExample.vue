<template>
  <section
    class="ntk-template-showcase__surface"
    data-template-surface="auth-login"
  >
    <h2>Authentication Template</h2>
    <AuthLayoutTemplate class="ntk-template-showcase__auth-shell">
      <LoginTemplate
        v-model:email="email"
        v-model:password="password"
        :show-version="true"
        :version-label="templateShowcaseLoginSample.versionLabel"
        :features="templateShowcaseLoginSample.features"
        @submit="handleLoginSubmit"
      />
    </AuthLayoutTemplate>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import LoginTemplate from '../../../../src/templates/features/auth/LoginTemplate.vue'
import AuthLayoutTemplate from '../../../../src/templates/layouts/AuthLayoutTemplate.vue'
import { templateShowcaseLoginSample } from '../../template-showcase.sample-data'

const email = ref(templateShowcaseLoginSample.initialEmail)
const password = ref(templateShowcaseLoginSample.initialPassword)

function handleLoginSubmit(): void {
  // Showcase mode keeps auth actions no-op to preserve deterministic visual baselines.
}
</script>
