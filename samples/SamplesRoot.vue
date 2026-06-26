<template>
  <!-- Root switch for the samples host. The Design System showcase is the
       default landing surface; the existing PlaTEA-shell demo apps stay one
       click away via the "Aplicações de exemplo" control in the showcase top
       bar. Each view owns its own chrome (the showcase is standalone; the apps
       live inside DsAppShell), so this wrapper only toggles between them. -->
  <DesignSystemShowcase
    v-if="view === 'showcase'"
    @open-apps="view = 'apps'"
  />
  <LibrarySampleApp
    v-else
    @back-to-showcase="view = 'showcase'"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DesignSystemShowcase from './DesignSystemShowcase.vue'
import LibrarySampleApp from './LibrarySampleApp.vue'

type SamplesView = 'showcase' | 'apps'

// Showcase is the default landing surface.
const view = ref<SamplesView>('showcase')
</script>