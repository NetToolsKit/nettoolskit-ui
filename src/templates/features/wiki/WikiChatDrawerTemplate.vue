
<template>
  <transition name="ntk-template-wiki-chat-drawer">
    <aside
      v-if="modelValue"
      class="ntk-template-wiki-chat-drawer"
      role="dialog"
      :aria-label="drawerAriaLabel"
    >
      <header class="ntk-template-wiki-chat-drawer__header">
        <div class="ntk-template-wiki-chat-drawer__header-main">
          <div class="ntk-template-wiki-chat-drawer__icon">
            <q-icon
              :name="headerIcon"
              size="16px"
            />
          </div>
          <div>
            <span class="ntk-template-wiki-chat-drawer__title">{{ title }}</span>
            <span
              v-if="contextHint"
              class="ntk-template-wiki-chat-drawer__context"
            >
              {{ contextHint }}
            </span>
          </div>
        </div>

        <div class="ntk-template-wiki-chat-drawer__header-actions">
          <button
            v-if="hasActiveConversation"
            type="button"
            class="ntk-template-wiki-chat-drawer__header-action"
            :aria-label="newConversationAriaLabel"
            @click="emit('start-new-conversation')"
          >
            <q-icon
              name="add_comment"
              size="16px"
            />
          </button>
          <button
            v-if="showFullscreenAction"
            type="button"
            class="ntk-template-wiki-chat-drawer__header-action"
            :aria-label="fullscreenAriaLabel"
            @click="emit('open-fullscreen')"
          >
            <q-icon
              name="open_in_full"
              size="16px"
            />
          </button>
          <button
            type="button"
            class="ntk-template-wiki-chat-drawer__header-action"
            :aria-label="closeAriaLabel"
            @click="closeDrawer"
          >
            <q-icon
              name="close"
              size="16px"
            />
          </button>
        </div>
      </header>

      <div
        ref="messagesContainer"
        class="ntk-template-wiki-chat-drawer__messages"
      >
        <div
          v-if="messages.length === 0 && !loading"
          class="ntk-template-wiki-chat-drawer__empty"
        >
          <q-icon
            :name="emptyIcon"
            size="34px"
          />
          <span class="ntk-template-wiki-chat-drawer__empty-title">{{ emptyTitle }}</span>
          <div class="ntk-template-wiki-chat-drawer__suggestions">
            <button
              v-for="suggestion in resolvedSuggestions"
              :key="suggestion.id"
              type="button"
              class="ntk-template-wiki-chat-drawer__suggestion"
              @click="sendQuestion(suggestion.text)"
            >
              {{ suggestion.text }}
            </button>
          </div>
        </div>

        <div
          v-if="loading"
          class="ntk-template-wiki-chat-drawer__loading"
        >
          <q-spinner-dots
            size="24px"
            color="primary"
          />
        </div>

        <article
          v-for="message in messages"
          :key="message.id"
          class="ntk-template-wiki-chat-drawer__message"
          :class="`ntk-template-wiki-chat-drawer__message--${message.role}`"
        >
          <div class="ntk-template-wiki-chat-drawer__avatar">
            <q-icon
              :name="message.role === 'user' ? userIcon : assistantIcon"
              size="14px"
            />
          </div>
          <div class="ntk-template-wiki-chat-drawer__bubble">
            {{ message.content }}
          </div>
        </article>

        <div
          v-if="sending"
          class="ntk-template-wiki-chat-drawer__typing"
        >
          <q-spinner-dots
            size="18px"
            color="primary"
          />
        </div>
      </div>

      <footer class="ntk-template-wiki-chat-drawer__input-area">
        <div class="ntk-template-wiki-chat-drawer__input-wrap">
          <textarea
            ref="inputElement"
            v-model="question"
            rows="1"
            :placeholder="inputPlaceholder"
            class="ntk-template-wiki-chat-drawer__input"
            :disabled="sending"
            @keydown.enter.exact.prevent="sendQuestion()"
            @input="autoResize"
          />
          <button
            type="button"
            class="ntk-template-wiki-chat-drawer__send"
            :aria-label="sendAriaLabel"
            :disabled="!question.trim() || sending"
            @click="sendQuestion()"
          >
            <q-icon
              name="send"
              size="16px"
            />
          </button>
        </div>
      </footer>
    </aside>
  </transition>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'

import type { TemplateWikiChatMessage, TemplateWikiSuggestion } from './wiki-template.types'

const props = withDefaults(defineProps<{
  modelValue: boolean
  title?: string
  contextHint?: string
  drawerAriaLabel?: string
  inputPlaceholder?: string
  sendAriaLabel?: string
  closeAriaLabel?: string
  fullscreenAriaLabel?: string
  newConversationAriaLabel?: string
  emptyTitle?: string
  emptyIcon?: string
  headerIcon?: string
  userIcon?: string
  assistantIcon?: string
  showFullscreenAction?: boolean
  hasActiveConversation?: boolean
  loading?: boolean
  sending?: boolean
  messages?: TemplateWikiChatMessage[]
  suggestions?: TemplateWikiSuggestion[]
}>(), {
  title: 'Assistant drawer',
  contextHint: '',
  drawerAriaLabel: 'Assistant drawer',
  inputPlaceholder: 'Ask something...',
  sendAriaLabel: 'Send question',
  closeAriaLabel: 'Close drawer',
  fullscreenAriaLabel: 'Open full screen',
  newConversationAriaLabel: 'Start new conversation',
  emptyTitle: 'Ask your first question',
  emptyIcon: 'chat',
  headerIcon: 'smart_toy',
  userIcon: 'person',
  assistantIcon: 'smart_toy',
  showFullscreenAction: true,
  hasActiveConversation: false,
  loading: false,
  sending: false,
  messages: () => [],
  suggestions: () => [],
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'open-fullscreen': []
  'start-new-conversation': []
  'send-question': [question: string]
}>()

const question = ref('')
const inputElement = ref<HTMLTextAreaElement>()
const messagesContainer = ref<HTMLElement>()

const resolvedSuggestions = computed<TemplateWikiSuggestion[]>(() => {
  if (props.suggestions.length > 0) {
    return props.suggestions
  }

  return [
    { id: 'd1', text: 'Show the top unresolved tasks.', icon: 'task' },
    { id: 'd2', text: 'Summarize recent incidents by severity.', icon: 'warning' },
  ]
})
function closeDrawer(): void {
  emit('update:modelValue', false)
}

function autoResize(): void {
  const element = inputElement.value
  if (!element) {
    return
  }

  element.style.height = 'auto'
  element.style.height = `${Math.min(element.scrollHeight, 120)}px`
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
.ntk-template-wiki-chat-drawer {
  position: fixed;
  right: 16px;
  bottom: 78px;
  width: 380px;
  height: min(620px, calc(100vh - 120px));
  border-radius: 14px;
  border: 1px solid var(--ntk-template-page-border, #e2e8f0);
  background: #ffffff;
  box-shadow: 0 18px 32px rgba(15, 23, 42, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 3000;
}

.ntk-template-wiki-chat-drawer__header {
  padding: 12px;
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.ntk-template-wiki-chat-drawer__header-main {
  display: flex;
  align-items: center;
  gap: 9px;
  min-width: 0;
}

.ntk-template-wiki-chat-drawer__icon {
  width: 28px;
  height: 28px;
  border-radius: 7px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.16);
}

.ntk-template-wiki-chat-drawer__title {
  display: block;
  font-size: 13px;
  font-weight: 700;
}

.ntk-template-wiki-chat-drawer__context {
  display: block;
  font-size: 11px;
  opacity: 0.74;
}

.ntk-template-wiki-chat-drawer__header-actions {
  display: inline-flex;
  gap: 4px;
}

.ntk-template-wiki-chat-drawer__header-action {
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 7px;
  background: rgba(255, 255, 255, 0.14);
  color: #ffffff;
  cursor: pointer;
}

.ntk-template-wiki-chat-drawer__messages {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.ntk-template-wiki-chat-drawer__empty {
  text-align: center;
  padding: 12px;
}

.ntk-template-wiki-chat-drawer__empty-title {
  display: block;
  margin-top: 6px;
  font-size: 13px;
  color: #334155;
}

.ntk-template-wiki-chat-drawer__suggestions {
  margin-top: 10px;
  display: grid;
  gap: 6px;
}

.ntk-template-wiki-chat-drawer__suggestion {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #ffffff;
  color: #334155;
  padding: 8px;
  cursor: pointer;
}

.ntk-template-wiki-chat-drawer__loading,
.ntk-template-wiki-chat-drawer__typing {
  display: flex;
  justify-content: center;
}
.ntk-template-wiki-chat-drawer__message {
  display: flex;
  gap: 8px;
}

.ntk-template-wiki-chat-drawer__avatar {
  width: 24px;
  height: 24px;
  border-radius: 7px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #e2e8f0;
  color: #334155;
}

.ntk-template-wiki-chat-drawer__message--user .ntk-template-wiki-chat-drawer__avatar {
  background: #0f766e;
  color: #ffffff;
}

.ntk-template-wiki-chat-drawer__bubble {
  flex: 1;
  border-radius: 9px;
  padding: 8px 10px;
  background: #f8fafc;
  color: #1e293b;
  font-size: 13px;
  white-space: pre-wrap;
}

.ntk-template-wiki-chat-drawer__input-area {
  border-top: 1px solid #f1f5f9;
  padding: 10px;
}

.ntk-template-wiki-chat-drawer__input-wrap {
  display: flex;
  align-items: flex-end;
  gap: 6px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 6px 8px;
}

.ntk-template-wiki-chat-drawer__input {
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  resize: none;
  color: #334155;
  font-size: 13px;
  max-height: 120px;
}

.ntk-template-wiki-chat-drawer__send {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 8px;
  background: #0f766e;
  color: #ffffff;
  cursor: pointer;
}

.ntk-template-wiki-chat-drawer__send:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.ntk-template-wiki-chat-drawer-enter-active,
.ntk-template-wiki-chat-drawer-leave-active {
  transition: all 0.22s ease;
}

.ntk-template-wiki-chat-drawer-enter-from,
.ntk-template-wiki-chat-drawer-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.98);
}

@media (max-width: 520px) {
  .ntk-template-wiki-chat-drawer {
    right: 10px;
    bottom: 72px;
    width: calc(100vw - 20px);
  }
}
</style>