<template>
  <q-layout
    view="lHh Lpr lFf"
    class="ntk-template-auth-layout"
  >
    <q-page-container :class="['ntk-template-auth-layout__container', pageContainerClass]">
      <q-page :class="['ntk-template-auth-layout__page', pageClass]">
        <div
          v-if="centerContent"
          class="ntk-template-auth-layout__center"
        >
          <slot />
        </div>
        <slot v-else />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  centerContent?: boolean
  pageClass?: string
  pageContainerClass?: string
}>(), {
  centerContent: true,
  pageClass: '',
  pageContainerClass: '',
})
</script>

<style scoped lang="scss">
.ntk-template-auth-layout__container {
  min-height: 100vh;
  background: var(--ntk-template-auth-layout-bg, #f8fafc);
}

.ntk-template-auth-layout__page {
  min-height: 100vh;
}

.ntk-template-auth-layout__center {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}
</style>