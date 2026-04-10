<template>
  <section
    class="ntk-template-showcase__surface"
    data-template-surface="wiki"
  >
    <h2>Knowledge Base and Assistant Templates</h2>
    <WikiTemplate
      :categories="templateShowcaseKnowledgeSample.categories"
      :documents="templateShowcaseKnowledgeSample.documents"
      :stat-chips="templateShowcaseKnowledgeSample.statChips"
    />
    <WikiChatTemplate
      :conversations="templateShowcaseKnowledgeSample.conversations"
      :messages="templateShowcaseKnowledgeSample.messages"
      :active-conversation-id="activeConversationId"
      :show-delete-conversation-action="false"
      @update:active-conversation-id="activeConversationId = $event"
    />
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import WikiChatTemplate from '../../../../src/templates/features/wiki/WikiChatTemplate.vue'
import WikiTemplate from '../../../../src/templates/features/wiki/WikiTemplate.vue'
import { templateShowcaseKnowledgeSample } from '../../template-showcase.sample-data'

const activeConversationId = ref<string | null>(templateShowcaseKnowledgeSample.initialConversationId)
</script>
