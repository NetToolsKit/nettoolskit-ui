
<template>
  <q-page
    class="ntk-template-wiki-chat"
    role="region"
    :aria-label="pageAriaLabel"
  >
    <div class="ntk-template-wiki-chat__layout">
      <aside
        v-if="showConversationPanel"
        class="ntk-template-wiki-chat__sidebar"
      >
        <div class="ntk-template-wiki-chat__sidebar-header">
          <span class="ntk-template-wiki-chat__sidebar-title">{{ conversationsLabel }}</span>
          <button
            type="button"
            class="ntk-template-wiki-chat__new-conversation"
            :aria-label="newConversationAriaLabel"
            @click="emit('start-new-conversation')"
          >
            <q-icon
              name="add"
              size="18px"
            />
          </button>
        </div>

        <div class="ntk-template-wiki-chat__search">
          <q-icon
            name="search"
            size="16px"
          />
          <input
            v-model="conversationSearch"
            type="text"
            :placeholder="conversationSearchPlaceholder"
            class="ntk-template-wiki-chat__search-input"
          >
        </div>

        <div class="ntk-template-wiki-chat__conversation-list">
          <div
            v-if="loading && conversations.length === 0"
            class="ntk-template-wiki-chat__loading"
          >
            <q-spinner-dots
              size="24px"
              color="primary"
            />
          </div>

          <div
            v-for="conversation in filteredConversations"
            :key="conversation.id"
            class="ntk-template-wiki-chat__conversation"
            :class="{ 'ntk-template-wiki-chat__conversation--active': activeConversationId === conversation.id }"
            role="button"
            tabindex="0"
            @click="handleSelectConversation(conversation.id)"
            @keyup.enter.prevent="handleSelectConversation(conversation.id)"
            @keyup.space.prevent="handleSelectConversation(conversation.id)"
          >
            <div class="ntk-template-wiki-chat__conversation-main">
              <span class="ntk-template-wiki-chat__conversation-title">{{ conversation.title }}</span>
              <span class="ntk-template-wiki-chat__conversation-meta">{{ conversation.updatedAt }}</span>
            </div>
            <span class="ntk-template-wiki-chat__conversation-count">{{ conversation.messageCount || 0 }}</span>
            <button
              v-if="showDeleteConversationAction"
              type="button"
              class="ntk-template-wiki-chat__conversation-delete"
              :aria-label="deleteConversationAriaLabel"
              @click.stop="emit('delete-conversation', conversation.id)"
            >
              <q-icon
                name="delete_outline"
                size="14px"
              />
            </button>
          </div>

          <div
            v-if="!loading && filteredConversations.length === 0"
            class="ntk-template-wiki-chat__empty-conversations"
          >
            {{ noConversationsLabel }}
          </div>
        </div>
      </aside>

      <section class="ntk-template-wiki-chat__chat">
        <header class="ntk-template-wiki-chat__chat-header">
          <div class="ntk-template-wiki-chat__chat-brand">
            <div class="ntk-template-wiki-chat__chat-icon">
              <q-icon
                :name="headerIcon"
                size="18px"
              />
            </div>
            <div>
              <h1 class="ntk-template-wiki-chat__chat-title">
                {{ activeConversationTitle }}
              </h1>
              <p class="ntk-template-wiki-chat__chat-subtitle">
                {{ subtitle }}
              </p>
            </div>
          </div>
        </header>

        <div
          ref="messagesContainer"
          class="ntk-template-wiki-chat__messages"
        >
          <div
            v-if="messages.length === 0 && !loading"
            class="ntk-template-wiki-chat__empty"
          >
            <div class="ntk-template-wiki-chat__empty-icon">
              <q-icon
                :name="emptyIcon"
                size="42px"
              />
            </div>
            <h2 class="ntk-template-wiki-chat__empty-title">
              {{ emptyTitle }}
            </h2>
            <p class="ntk-template-wiki-chat__empty-subtitle">
              {{ emptySubtitle }}
            </p>
            <div class="ntk-template-wiki-chat__suggestions">
              <button
                v-for="suggestion in resolvedSuggestions"
                :key="suggestion.id"
                type="button"
                class="ntk-template-wiki-chat__suggestion"
                @click="sendQuestion(suggestion.text)"
              >
                <q-icon
                  :name="suggestion.icon || 'lightbulb'"
                  size="16px"
                />
                <span>{{ suggestion.text }}</span>
              </button>
            </div>
          </div>

          <template
            v-for="message in messages"
            :key="message.id"
          >
            <article
              class="ntk-template-wiki-chat__message"
              :class="`ntk-template-wiki-chat__message--${message.role}`"
            >
              <div class="ntk-template-wiki-chat__message-avatar">
                <q-icon
                  :name="message.role === 'user' ? userIcon : assistantIcon"
                  size="16px"
                />
              </div>
              <div class="ntk-template-wiki-chat__message-body">
                <div class="ntk-template-wiki-chat__message-content">
                  {{ message.content }}
                </div>
                <div
                  v-if="message.sources && message.sources.length > 0"
                  class="ntk-template-wiki-chat__sources"
                >
                  <span class="ntk-template-wiki-chat__sources-label">{{ sourcesLabel }}</span>
                  <div
                    v-for="(source, index) in message.sources.slice(0, maxSources)"
                    :key="`${message.id}-${index}`"
                    class="ntk-template-wiki-chat__source"
                  >
                    <strong>{{ source.documentName }}</strong>
                    <p>{{ source.chunkContent }}</p>
                  </div>
                </div>
              </div>
            </article>
          </template>

          <div
            v-if="sending"
            class="ntk-template-wiki-chat__typing"
          >
            <q-spinner-dots
              size="20px"
              color="primary"
            />
          </div>
        </div>
        <footer class="ntk-template-wiki-chat__input-area">
          <div class="ntk-template-wiki-chat__input-wrap">
            <textarea
              ref="inputElement"
              v-model="question"
              rows="1"
              :placeholder="inputPlaceholder"
              class="ntk-template-wiki-chat__input"
              :disabled="sending"
              @keydown.enter.exact.prevent="sendQuestion()"
              @input="autoResize"
            />
            <button
              type="button"
              class="ntk-template-wiki-chat__send"
              :aria-label="sendAriaLabel"
              :disabled="!question.trim() || sending"
              @click="sendQuestion()"
            >
              <q-icon
                name="send"
                size="18px"
              />
            </button>
          </div>
          <small class="ntk-template-wiki-chat__hint">{{ hintText }}</small>
        </footer>
      </section>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'

import type {
  TemplateWikiChatMessage,
  TemplateWikiConversation,
  TemplateWikiSuggestion,
} from './wiki-template.types'

const props = withDefaults(defineProps<{
  title?: string
  subtitle?: string
  conversationsLabel?: string
  noConversationsLabel?: string
  conversationSearchPlaceholder?: string
  newConversationAriaLabel?: string
  deleteConversationAriaLabel?: string
  pageAriaLabel?: string
  headerIcon?: string
  emptyIcon?: string
  emptyTitle?: string
  emptySubtitle?: string
  inputPlaceholder?: string
  sendAriaLabel?: string
  hintText?: string
  sourcesLabel?: string
  maxSources?: number
  userIcon?: string
  assistantIcon?: string
  showConversationPanel?: boolean
  showDeleteConversationAction?: boolean
  loading?: boolean
  sending?: boolean
  activeConversationId?: string | null
  conversations?: TemplateWikiConversation[]
  messages?: TemplateWikiChatMessage[]
  suggestions?: TemplateWikiSuggestion[]
}>(), {
  title: 'Assistant chat',
  subtitle: 'Ask questions about your content and workflows.',
  conversationsLabel: 'Conversations',
  noConversationsLabel: 'No conversations available.',
  conversationSearchPlaceholder: 'Search conversation...',
  newConversationAriaLabel: 'Start new conversation',
  deleteConversationAriaLabel: 'Delete conversation',
  pageAriaLabel: 'Assistant chat page',
  headerIcon: 'smart_toy',
  emptyIcon: 'forum',
  emptyTitle: 'Start a new conversation',
  emptySubtitle: 'Use quick prompts or type your own question.',
  inputPlaceholder: 'Ask a question...',
  sendAriaLabel: 'Send question',
  hintText: 'Responses should be validated before critical decisions.',
  sourcesLabel: 'Sources',
  maxSources: 3,
  userIcon: 'person',
  assistantIcon: 'smart_toy',
  showConversationPanel: true,
  showDeleteConversationAction: true,
  loading: false,
  sending: false,
  activeConversationId: null,
  conversations: () => [],
  messages: () => [],
  suggestions: () => [],
})

const emit = defineEmits<{
  'start-new-conversation': []
  'select-conversation': [id: string]
  'delete-conversation': [id: string]
  'send-question': [question: string]
  'update:activeConversationId': [id: string | null]
}>()

const question = ref('')
const conversationSearch = ref('')
const inputElement = ref<HTMLTextAreaElement>()
const messagesContainer = ref<HTMLElement>()

const resolvedSuggestions = computed<TemplateWikiSuggestion[]>(() => {
  if (props.suggestions.length > 0) {
    return props.suggestions
  }

  return [
    { id: 's1', text: 'Summarize key metrics from the latest report.', icon: 'insights' },
    { id: 's2', text: 'List pending operational tasks for this week.', icon: 'task' },
    { id: 's3', text: 'What are the top support incidents today?', icon: 'support_agent' },
  ]
})

const filteredConversations = computed<TemplateWikiConversation[]>(() => {
  const search = conversationSearch.value.toLowerCase().trim()
  if (!search) {
    return props.conversations
  }

  return props.conversations.filter(conversation => conversation.title.toLowerCase().includes(search))
})

const activeConversationTitle = computed<string>(() => {
  if (!props.activeConversationId) {
    return props.title
  }

  return props.conversations.find(conversation => conversation.id === props.activeConversationId)?.title || props.title
})
function handleSelectConversation(id: string): void {
  emit('update:activeConversationId', id)
  emit('select-conversation', id)
}

function autoResize(): void {
  const element = inputElement.value
  if (!element) {
    return
  }

  element.style.height = 'auto'
  element.style.height = `${Math.min(element.scrollHeight, 180)}px`
}

async function scrollToBottom(): Promise<void> {
  await nextTick()
  const container = messagesContainer.value
  if (container) {
    container.scrollTop = container.scrollHeight
  }
}

watch(
  () => props.messages.length,
  () => {
    void scrollToBottom()
  }
)

function sendQuestion(text?: string): void {
  const candidate = (text || question.value).trim()
  if (!candidate) {
    return
  }

  question.value = ''
  if (inputElement.value) {
    inputElement.value.style.height = 'auto'
  }

  emit('send-question', candidate)
}
</script>

<style scoped lang="scss">
.ntk-template-wiki-chat {
  background: var(--ntk-template-wiki-chat-bg, #f8fafc);
  padding: 12px;
}

.ntk-template-wiki-chat__layout {
  display: flex;
  gap: 10px;
  min-height: 100%;
}

.ntk-template-wiki-chat__sidebar {
  width: 290px;
  border-radius: 12px;
  border: 1px solid var(--ntk-template-page-border, #e2e8f0);
  background: #ffffff;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.ntk-template-wiki-chat__sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
}

.ntk-template-wiki-chat__sidebar-title {
  font-size: 13px;
  font-weight: 700;
  color: #1e293b;
}

.ntk-template-wiki-chat__new-conversation {
  width: 30px;
  height: 30px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #ffffff;
  color: #64748b;
  cursor: pointer;
}

.ntk-template-wiki-chat__search {
  margin: 0 12px 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 0 10px;
  height: 34px;
  color: #64748b;
}

.ntk-template-wiki-chat__search-input {
  width: 100%;
  border: none;
  background: transparent;
  outline: none;
  color: #334155;
  font-size: 12px;
}

.ntk-template-wiki-chat__conversation-list {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 0 8px 8px;
}

.ntk-template-wiki-chat__loading,
.ntk-template-wiki-chat__empty-conversations {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80px;
  color: #64748b;
  font-size: 12px;
}

.ntk-template-wiki-chat__conversation {
  width: 100%;
  border: none;
  background: transparent;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;
  text-align: left;
}

.ntk-template-wiki-chat__conversation:hover {
  background: #f8fafc;
}

.ntk-template-wiki-chat__conversation:focus-visible {
  outline: 2px solid #0f766e;
  outline-offset: -2px;
}

.ntk-template-wiki-chat__conversation--active {
  background: rgba(15, 118, 110, 0.1);
}
.ntk-template-wiki-chat__conversation-main {
  flex: 1;
  min-width: 0;
}

.ntk-template-wiki-chat__conversation-title {
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: #1e293b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ntk-template-wiki-chat__conversation-meta,
.ntk-template-wiki-chat__conversation-count {
  font-size: 11px;
  color: #64748b;
}

.ntk-template-wiki-chat__conversation-delete {
  width: 24px;
  height: 24px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: #64748b;
  cursor: pointer;
}

.ntk-template-wiki-chat__conversation-delete:hover {
  color: #b91c1c;
  background: rgba(239, 68, 68, 0.14);
}

.ntk-template-wiki-chat__chat {
  flex: 1;
  min-width: 0;
  border-radius: 12px;
  border: 1px solid var(--ntk-template-page-border, #e2e8f0);
  background: #ffffff;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.ntk-template-wiki-chat__chat-header {
  padding: 12px 14px;
  border-bottom: 1px solid #f1f5f9;
}

.ntk-template-wiki-chat__chat-brand {
  display: flex;
  align-items: center;
  gap: 10px;
}

.ntk-template-wiki-chat__chat-icon {
  width: 34px;
  height: 34px;
  border-radius: 9px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #1e293b;
  color: #ffffff;
}

.ntk-template-wiki-chat__chat-title {
  margin: 0;
  font-size: 15px;
  color: #1e293b;
}

.ntk-template-wiki-chat__chat-subtitle {
  margin: 2px 0 0;
  font-size: 12px;
  color: #64748b;
}

.ntk-template-wiki-chat__messages {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ntk-template-wiki-chat__empty {
  text-align: center;
  padding: 22px;
}

.ntk-template-wiki-chat__empty-icon {
  width: 72px;
  height: 72px;
  border-radius: 18px;
  margin: 0 auto 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0f766e;
  background: rgba(15, 118, 110, 0.12);
}

.ntk-template-wiki-chat__empty-title {
  margin: 0;
  font-size: 20px;
  color: #1e293b;
}

.ntk-template-wiki-chat__empty-subtitle {
  margin: 8px auto 0;
  max-width: 460px;
  color: #64748b;
}

.ntk-template-wiki-chat__suggestions {
  margin-top: 14px;
  display: grid;
  gap: 8px;
}

.ntk-template-wiki-chat__suggestion {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #ffffff;
  color: #334155;
  padding: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.ntk-template-wiki-chat__message {
  display: flex;
  gap: 8px;
}

.ntk-template-wiki-chat__message-avatar {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #e2e8f0;
  color: #334155;
}

.ntk-template-wiki-chat__message--user .ntk-template-wiki-chat__message-avatar {
  background: #0f766e;
  color: #ffffff;
}

.ntk-template-wiki-chat__message-body {
  flex: 1;
  min-width: 0;
}

.ntk-template-wiki-chat__message-content {
  border-radius: 10px;
  padding: 10px 12px;
  color: #1e293b;
  background: #f8fafc;
  white-space: pre-wrap;
}

.ntk-template-wiki-chat__sources {
  margin-top: 6px;
}

.ntk-template-wiki-chat__sources-label {
  display: block;
  margin-bottom: 4px;
  font-size: 11px;
  font-weight: 600;
  color: #64748b;
}

.ntk-template-wiki-chat__source {
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  padding: 8px;
  margin-top: 4px;
}

.ntk-template-wiki-chat__source p {
  margin: 4px 0 0;
  font-size: 11px;
  color: #64748b;
}

.ntk-template-wiki-chat__typing {
  display: flex;
  justify-content: center;
  padding: 8px;
}

.ntk-template-wiki-chat__input-area {
  border-top: 1px solid #f1f5f9;
  padding: 12px;
}

.ntk-template-wiki-chat__input-wrap {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 8px 10px;
}

.ntk-template-wiki-chat__input {
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  resize: none;
  color: #334155;
  font-size: 13px;
  max-height: 180px;
}

.ntk-template-wiki-chat__send {
  width: 34px;
  height: 34px;
  border: none;
  border-radius: 9px;
  background: #0f766e;
  color: #ffffff;
  cursor: pointer;
}

.ntk-template-wiki-chat__send:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.ntk-template-wiki-chat__hint {
  display: block;
  margin-top: 6px;
  color: #64748b;
}

@media (max-width: 900px) {
  .ntk-template-wiki-chat__layout {
    flex-direction: column;
  }

  .ntk-template-wiki-chat__sidebar {
    width: 100%;
    max-height: 220px;
  }
}
</style>