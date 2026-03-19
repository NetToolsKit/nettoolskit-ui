<template>
  <footer class="footer">
    <div class="footer-inner">
      <a
        href="#top"
        class="footer-logo"
      >NetToolsKit</a>

      <div class="footer-social">
        <a
          href="https://github.com/ThiagoGuislotti/nettoolskit-ui-vue"
          target="_blank"
          rel="noopener noreferrer"
        >GitHub</a>
        <a
          href="https://www.npmjs.com/package/@nettoolskit/ui-vue"
          target="_blank"
          rel="noopener noreferrer"
        >NPM</a>
      </div>

      <div class="footer-links">
        <a href="#servicos">Componentes</a>
        <a href="#expo">Composables</a>
        <a href="#contato">Contato</a>
      </div>

      <div class="footer-reduce-motion">
        <input
          id="reduceMotion"
          :checked="reduceMotion"
          type="checkbox"
          @change="onMotionChange"
        >
        <label for="reduceMotion">Reduzir movimento</label>
      </div>

      <p class="footer-copy">
        &copy; 2026 NetToolsKit UI Vue. Design system para produtos Vue com foco em consistencia, escala e qualidade.
      </p>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  reduceMotion: boolean
}>()

const emit = defineEmits<{
  'update:reduceMotion': [value: boolean]
}>()

const reduceMotion = computed(() => props.reduceMotion)

const onMotionChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:reduceMotion', target.checked)
}
</script>