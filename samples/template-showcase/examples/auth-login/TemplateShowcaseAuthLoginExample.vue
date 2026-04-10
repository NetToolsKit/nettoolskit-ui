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
    <SampleActionStatus
      title="Authentication action"
      :message="loginMessage"
      tone="success"
    />
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import LoginTemplate from '../../../../src/templates/features/auth/LoginTemplate.vue'
import AuthLayoutTemplate from '../../../../src/templates/layouts/AuthLayoutTemplate.vue'
import SampleActionStatus from '../../../shared/SampleActionStatus.vue'
import { templateShowcaseLoginSample } from '../../template-showcase.sample-data'

const email = ref(templateShowcaseLoginSample.initialEmail)
const password = ref(templateShowcaseLoginSample.initialPassword)
const loginMessage = ref('Ready to submit the sign-in flow.')

function handleLoginSubmit(payload: { email: string }): void {
  loginMessage.value = `Submitted sign-in for ${payload.email}. The sample stays local and deterministic.`
}
</script>
