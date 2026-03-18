<template>
  <aside
    id="sidePanel"
    :class="['side-panel', { open: isOpen }]"
  >
    <button
      class="side-close"
      aria-label="Fechar"
      @click="$emit('toggle-panel')"
    >
      <svg viewBox="0 0 24 24">
        <line
          x1="6"
          y1="6"
          x2="18"
          y2="18"
        />
        <line
          x1="18"
          y1="6"
          x2="6"
          y2="18"
        />
      </svg>
    </button>

    <div class="nav-label">
      Navegacao
    </div>

    <nav class="side-nav">
      <a
        v-for="item in items"
        :key="item.id"
        :href="`#${item.id}`"
        :class="{ active: activeSection === item.id }"
        @click="$emit('close-panel')"
      >
        <span class="nav-num">{{ item.number }}</span>
        {{ item.label }}
      </a>
    </nav>

    <div class="nav-footer">
      <div class="nav-social">
        <a
          href="https://github.com/ThiagoGuislotti/nettoolskit-ui-vue"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
      </div>
      <a
        href="https://www.npmjs.com/package/@nettoolskit/ui-vue"
        target="_blank"
        rel="noopener noreferrer"
      >
        NPM Package
      </a>
    </div>
  </aside>
</template>

<script setup lang="ts">
interface NavigationItem {
  id: string
  number: string
  label: string
}

defineProps<{
  isOpen: boolean
  activeSection: string
  items: NavigationItem[]
}>()

defineEmits<{
  'close-panel': []
  'toggle-panel': []
}>()
</script>