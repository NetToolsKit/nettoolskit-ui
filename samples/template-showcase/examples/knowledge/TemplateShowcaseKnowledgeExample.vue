<template>
  <section
    class="ntk-template-showcase__surface"
    data-template-surface="wiki"
  >
    <h2>Knowledge Base and Assistant Templates</h2>
    <WikiTemplate
      :categories="templateShowcaseKnowledgeSample.categories"
      :documents="documents"
      :stat-chips="templateShowcaseKnowledgeSample.statChips"
      @export-click="knowledgeMessage = 'Knowledge export action triggered.'"
      @view-document="handleViewDocument"
      @download-document="handleDownloadDocument"
      @ask-document="handleAskDocument"
      @selection-change="knowledgeMessage = `${$event.length} document(s) selected.`"
      @category-change="knowledgeMessage = `Category changed to ${$event.categoryId ?? 'all'} / ${$event.subCategoryId ?? 'all'}.`"
      @view-mode-change="knowledgeMessage = `Knowledge view mode changed to ${$event}.`"
      @bulk-download="knowledgeMessage = `Bulk download prepared for ${$event.length} document(s).`"
    />
    <WikiChatTemplate
      :conversations="conversations"
      :messages="messages"
      :active-conversation-id="activeConversationId"
      :show-delete-conversation-action="true"
      @update:active-conversation-id="activeConversationId = $event"
      @start-new-conversation="handleStartConversation"
      @delete-conversation="handleDeleteConversation"
      @send-question="handleSendQuestion"
      @select-conversation="knowledgeMessage = `Conversation selected: ${$event}.`"
    />
    <SampleActionStatus
      title="Knowledge action"
      :message="knowledgeMessage"
      tone="success"
    />
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import WikiChatTemplate from '../../../../src/templates/features/wiki/WikiChatTemplate.vue'
import WikiTemplate from '../../../../src/templates/features/wiki/WikiTemplate.vue'
import type {
  TemplateWikiChatMessage,
  TemplateWikiConversation,
  TemplateWikiDocument,
} from '../../../../src/templates/features/wiki/wiki-template.types'
import SampleActionStatus from '../../../shared/SampleActionStatus.vue'
import { templateShowcaseKnowledgeSample } from '../../template-showcase.sample-data'

const activeConversationId = ref<string | null>(templateShowcaseKnowledgeSample.initialConversationId)
const documents = ref<TemplateWikiDocument[]>(templateShowcaseKnowledgeSample.documents.map(document => ({
  ...document,
  tags: [...document.tags],
})))
const conversations = ref<TemplateWikiConversation[]>(templateShowcaseKnowledgeSample.conversations.map(conversation => ({ ...conversation })))
const messages = ref<TemplateWikiChatMessage[]>(templateShowcaseKnowledgeSample.messages.map(message => ({
  ...message,
  sources: message.sources ? message.sources.map(source => ({ ...source })) : undefined,
})))
const knowledgeMessage = ref('Search documents, ask the assistant, or create conversations to test the knowledge flows.')

function handleViewDocument(document: TemplateWikiDocument): void {
  knowledgeMessage.value = `Opened document preview: ${document.name}.`
}

function handleDownloadDocument(document: TemplateWikiDocument): void {
  knowledgeMessage.value = `Downloaded document: ${document.name}.`
}

function handleAskDocument(document: TemplateWikiDocument): void {
  handleSendQuestion(`Summarize ${document.name}.`)
}

function handleStartConversation(): void {
  const id = `conversation-${Date.now()}`
  conversations.value = [
    {
      id,
      title: 'New template discussion',
      updatedAt: 'now',
      messageCount: 0,
    },
    ...conversations.value,
  ]
  activeConversationId.value = id
  messages.value = []
  knowledgeMessage.value = 'Started a new assistant conversation.'
}

function handleDeleteConversation(conversationId: string): void {
  conversations.value = conversations.value.filter(conversation => conversation.id !== conversationId)
  if (activeConversationId.value === conversationId) {
    activeConversationId.value = conversations.value[0]?.id ?? null
  }
  knowledgeMessage.value = `Deleted conversation: ${conversationId}.`
}

function handleSendQuestion(question: string): void {
  const timestampSeed = Date.now()
  messages.value = [
    ...messages.value,
    {
      id: `user-${timestampSeed}`,
      role: 'user' as const,
      content: question,
      sources: undefined,
    },
    {
      id: `assistant-${timestampSeed}`,
      role: 'assistant' as const,
      content: `Sample assistant reply for "${question}". This keeps the interaction local to the showcase.`,
      sources: undefined,
    },
  ]
  knowledgeMessage.value = `Sent assistant question: ${question}`

  conversations.value = conversations.value.map(conversation => {
    if (conversation.id !== activeConversationId.value) {
      return conversation
    }

    return {
      ...conversation,
      updatedAt: 'now',
      messageCount: (conversation.messageCount ?? 0) + 2,
    }
  })
}
</script>
