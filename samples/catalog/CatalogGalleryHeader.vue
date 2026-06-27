<template>
  <div class="cgh">
    <div class="cgh__row">
      <span class="cgh__num">{{ num }}</span>
      <h2 class="cgh__title">
        {{ title }}
      </h2>
    </div>
    <p class="cgh__desc">
      {{ desc }}
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps<{ num: string; title: string; desc: string }>()
</script>

<style scoped>
.cgh {
  display: flex;
  flex-direction: column;
  gap: 6px;
  border-bottom: var(--ds-border-width) solid var(--ds-color-border);
  padding-bottom: 14px;
}

.cgh__row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.cgh__num {
  font-family: var(--ds-font-mono);
  font-size: 12px;
  color: var(--ds-color-primary);
  font-weight: 600;
}

.cgh__title {
  margin: 0;
  font-size: 25px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--ds-color-text);
}

.cgh__desc {
  margin: 0;
  font-size: 14.5px;
  color: var(--ds-color-text-muted);
  max-width: 66ch;
  line-height: 1.55;
}
</style>