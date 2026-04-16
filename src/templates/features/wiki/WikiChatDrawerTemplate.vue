
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
            class="ntk-template-wiki-chat-drawer__spinner"
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
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div
            class="ntk-template-wiki-chat-drawer__bubble"
            v-html="formatContent(message.content)"
          />
          <div
            v-if="message.sources && message.sources.length > 0"
            class="ntk-template-wiki-chat-drawer__sources"
          >
            <span class="ntk-template-wiki-chat-drawer__sources-label">{{ sourcesLabel }}</span>
            <div
              v-for="(source, index) in message.sources.slice(0, maxSources)"
              :key="index"
              class="ntk-template-wiki-chat-drawer__source"
            >
              <q-icon
                name="description"
                size="12px"
              />
              <div class="ntk-template-wiki-chat-drawer__source-info">
                <strong>{{ source.documentName }}</strong>
                <p>{{ source.chunkContent }}</p>
              </div>
            </div>
          </div>
        </article>

        <div
          v-if="sending"
          class="ntk-template-wiki-chat-drawer__typing"
        >
          <q-spinner-dots
            size="18px"
            class="ntk-template-wiki-chat-drawer__spinner"
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
  sourcesLabel?: string
  maxSources?: number
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
  sourcesLabel: 'Sources',
  maxSources: 3,
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

function formatContent(raw: string): string {
  return raw
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\n/g, '<br>')
}

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
  --ntk-template-wiki-chat-drawer-surface-bg: var(
    --ntk-template-wiki-chat-drawer-surface-bg,
    var(--ntk-template-page-card-bg, var(--ntk-bg-card))
  );
  --ntk-template-wiki-chat-drawer-surface-border: var(
    --ntk-template-wiki-chat-drawer-surface-border,
    var(--ntk-template-page-border, var(--ntk-border-color))
  );
  --ntk-template-wiki-chat-drawer-surface-shadow: var(
    --ntk-template-wiki-chat-drawer-surface-shadow,
    0 18px 32px color-mix(in srgb, var(--ntk-text-primary) 15%, transparent)
  );
  --ntk-template-wiki-chat-drawer-header-bg: var(
    --ntk-template-wiki-chat-drawer-header-bg,
    linear-gradient(
      135deg,
      color-mix(in srgb, var(--ntk-accent, var(--ntk-primary)) 16%, var(--ntk-template-page-card-bg, var(--ntk-bg-card))) 0%,
      color-mix(in srgb, var(--ntk-accent, var(--ntk-primary)) 8%, var(--ntk-template-page-row-bg, var(--ntk-bg-tertiary))) 100%
    )
  );
  --ntk-template-wiki-chat-drawer-header-text: var(
    --ntk-template-wiki-chat-drawer-header-text,
    var(--ntk-template-page-title, var(--ntk-text-primary))
  );
  --ntk-template-wiki-chat-drawer-header-action-bg: var(
    --ntk-template-wiki-chat-drawer-header-action-bg,
    color-mix(in srgb, var(--ntk-template-page-title, var(--ntk-text-primary)) 12%, transparent)
  );
  --ntk-template-wiki-chat-drawer-header-action-bg-hover: var(
    --ntk-template-wiki-chat-drawer-header-action-bg-hover,
    color-mix(in srgb, var(--ntk-template-page-title, var(--ntk-text-primary)) 20%, transparent)
  );
  --ntk-template-wiki-chat-drawer-icon-bg: var(
    --ntk-template-wiki-chat-drawer-icon-bg,
    color-mix(in srgb, var(--ntk-accent, var(--ntk-primary)) 18%, transparent)
  );
  --ntk-template-wiki-chat-drawer-title-color: var(
    --ntk-template-wiki-chat-drawer-title-color,
    var(--ntk-template-page-title, var(--ntk-text-primary))
  );
  --ntk-template-wiki-chat-drawer-context-color: var(
    --ntk-template-wiki-chat-drawer-context-color,
    color-mix(in srgb, var(--ntk-template-page-subtitle, var(--ntk-text-secondary)) 82%, transparent)
  );
  --ntk-template-wiki-chat-drawer-empty-title-color: var(
    --ntk-template-wiki-chat-drawer-empty-title-color,
    var(--ntk-template-page-title, var(--ntk-text-primary))
  );
  --ntk-template-wiki-chat-drawer-suggestion-border: var(
    --ntk-template-wiki-chat-drawer-suggestion-border,
    var(--ntk-template-page-border, var(--ntk-border-color))
  );
  --ntk-template-wiki-chat-drawer-suggestion-bg: var(
    --ntk-template-wiki-chat-drawer-suggestion-bg,
    var(--ntk-template-page-card-bg, var(--ntk-bg-card))
  );
  --ntk-template-wiki-chat-drawer-suggestion-text: var(
    --ntk-template-wiki-chat-drawer-suggestion-text,
    var(--ntk-template-page-title, var(--ntk-text-primary))
  );
  --ntk-template-wiki-chat-drawer-avatar-bg: var(
    --ntk-template-wiki-chat-drawer-avatar-bg,
    var(--ntk-template-page-row-bg, var(--ntk-bg-tertiary))
  );
  --ntk-template-wiki-chat-drawer-avatar-text: var(
    --ntk-template-wiki-chat-drawer-avatar-text,
    var(--ntk-template-page-title, var(--ntk-text-primary))
  );
  --ntk-template-wiki-chat-drawer-avatar-user-bg: var(
    --ntk-template-wiki-chat-drawer-avatar-user-bg,
    var(--ntk-accent, var(--ntk-primary))
  );
  --ntk-template-wiki-chat-drawer-avatar-user-text: var(
    --ntk-template-wiki-chat-drawer-avatar-user-text,
    var(--ntk-text-on-accent, var(--ntk-text-primary))
  );
  --ntk-template-wiki-chat-drawer-bubble-bg: var(
    --ntk-template-wiki-chat-drawer-bubble-bg,
    var(--ntk-template-page-row-bg, var(--ntk-bg-tertiary))
  );
  --ntk-template-wiki-chat-drawer-bubble-text: var(
    --ntk-template-wiki-chat-drawer-bubble-text,
    var(--ntk-template-page-title, var(--ntk-text-primary))
  );
  --ntk-template-wiki-chat-drawer-code-bg: var(
    --ntk-template-wiki-chat-drawer-code-bg,
    color-mix(in srgb, var(--ntk-template-page-border, var(--ntk-border-color)) 90%, transparent)
  );
  --ntk-template-wiki-chat-drawer-input-area-border: var(
    --ntk-template-wiki-chat-drawer-input-area-border,
    color-mix(in srgb, var(--ntk-template-page-border, var(--ntk-border-color)) 72%, transparent)
  );
  --ntk-template-wiki-chat-drawer-input-wrap-border: var(
    --ntk-template-wiki-chat-drawer-input-wrap-border,
    var(--ntk-template-page-border, var(--ntk-border-color))
  );
  --ntk-template-wiki-chat-drawer-input-wrap-bg: var(
    --ntk-template-wiki-chat-drawer-input-wrap-bg,
    color-mix(in srgb, var(--ntk-template-page-row-bg, var(--ntk-bg-tertiary)) 84%, var(--ntk-template-page-card-bg, var(--ntk-bg-card)))
  );
  --ntk-template-wiki-chat-drawer-input-text: var(
    --ntk-template-wiki-chat-drawer-input-text,
    var(--ntk-template-page-title, var(--ntk-text-primary))
  );
  --ntk-template-wiki-chat-drawer-input-placeholder: var(
    --ntk-template-wiki-chat-drawer-input-placeholder,
    var(--ntk-template-page-subtitle, var(--ntk-text-secondary))
  );
  --ntk-template-wiki-chat-drawer-send-bg: var(
    --ntk-template-wiki-chat-drawer-send-bg,
    var(--ntk-accent, var(--ntk-primary))
  );
  --ntk-template-wiki-chat-drawer-send-text: var(
    --ntk-template-wiki-chat-drawer-send-text,
    var(--ntk-text-on-accent, var(--ntk-text-primary))
  );
  --ntk-template-wiki-chat-drawer-meta-color: var(
    --ntk-template-wiki-chat-drawer-meta-color,
    var(--ntk-template-page-subtitle, var(--ntk-text-secondary))
  );
  --ntk-template-wiki-chat-drawer-source-bg: var(
    --ntk-template-wiki-chat-drawer-source-bg,
    color-mix(in srgb, var(--ntk-template-page-row-bg, var(--ntk-bg-tertiary)) 54%, transparent)
  );
  --ntk-template-wiki-chat-drawer-source-name-color: var(
    --ntk-template-wiki-chat-drawer-source-name-color,
    var(--ntk-template-page-title, var(--ntk-text-primary))
  );
  --ntk-template-wiki-chat-drawer-source-chunk-color: var(
    --ntk-template-wiki-chat-drawer-source-chunk-color,
    var(--ntk-template-page-subtitle, var(--ntk-text-secondary))
  );

  position: fixed;
  right: 16px;
  bottom: 78px;
  width: 380px;
  height: min(620px, calc(100vh - 120px));
  border-radius: 14px;
  border: 1px solid var(--ntk-template-wiki-chat-drawer-surface-border);
  background: var(--ntk-template-wiki-chat-drawer-surface-bg);
  box-shadow: var(--ntk-template-wiki-chat-drawer-surface-shadow);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 3000;
}

.ntk-template-wiki-chat-drawer__header {
  padding: 12px;
  background: var(--ntk-template-wiki-chat-drawer-header-bg);
  color: var(--ntk-template-wiki-chat-drawer-header-text);
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
  background: var(--ntk-template-wiki-chat-drawer-icon-bg);
}

.ntk-template-wiki-chat-drawer__title {
  display: block;
  font-size: 13px;
  font-weight: 700;
  color: var(--ntk-template-wiki-chat-drawer-title-color);
}

.ntk-template-wiki-chat-drawer__context {
  display: block;
  font-size: 11px;
  color: var(--ntk-template-wiki-chat-drawer-context-color);
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
  background: var(--ntk-template-wiki-chat-drawer-header-action-bg);
  color: var(--ntk-template-wiki-chat-drawer-header-text);
  cursor: pointer;

  &:hover {
    background: var(--ntk-template-wiki-chat-drawer-header-action-bg-hover);
  }
}

.ntk-template-wiki-chat-drawer__messages {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: var(--ntk-template-wiki-chat-drawer-surface-bg);
}

.ntk-template-wiki-chat-drawer__empty {
  text-align: center;
  padding: 12px;
}

.ntk-template-wiki-chat-drawer__empty-title {
  display: block;
  margin-top: 6px;
  font-size: 13px;
  color: var(--ntk-template-wiki-chat-drawer-empty-title-color);
}

.ntk-template-wiki-chat-drawer__suggestions {
  margin-top: 10px;
  display: grid;
  gap: 6px;
}

.ntk-template-wiki-chat-drawer__suggestion {
  border: 1px solid var(--ntk-template-wiki-chat-drawer-suggestion-border);
  border-radius: 8px;
  background: var(--ntk-template-wiki-chat-drawer-suggestion-bg);
  color: var(--ntk-template-wiki-chat-drawer-suggestion-text);
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
  background: var(--ntk-template-wiki-chat-drawer-avatar-bg);
  color: var(--ntk-template-wiki-chat-drawer-avatar-text);
}

.ntk-template-wiki-chat-drawer__message--user .ntk-template-wiki-chat-drawer__avatar {
  background: var(--ntk-template-wiki-chat-drawer-avatar-user-bg);
  color: var(--ntk-template-wiki-chat-drawer-avatar-user-text);
}

.ntk-template-wiki-chat-drawer__bubble {
  flex: 1;
  border-radius: 9px;
  padding: 8px 10px;
  background: var(--ntk-template-wiki-chat-drawer-bubble-bg);
  color: var(--ntk-template-wiki-chat-drawer-bubble-text);
  font-size: 13px;
  line-height: 1.5;

  :deep(code) {
    font-size: 12px;
    background: var(--ntk-template-wiki-chat-drawer-code-bg);
    border-radius: 3px;
    padding: 1px 4px;
    font-family: ui-monospace, monospace;
  }
}

.ntk-template-wiki-chat-drawer__input-area {
  border-top: 1px solid var(--ntk-template-wiki-chat-drawer-input-area-border);
  padding: 10px;
  background: var(--ntk-template-wiki-chat-drawer-surface-bg);
}

.ntk-template-wiki-chat-drawer__input-wrap {
  display: flex;
  align-items: flex-end;
  gap: 6px;
  border: 1px solid var(--ntk-template-wiki-chat-drawer-input-wrap-border);
  border-radius: 10px;
  padding: 6px 8px;
  background: var(--ntk-template-wiki-chat-drawer-input-wrap-bg);
}

.ntk-template-wiki-chat-drawer__input {
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  resize: none;
  color: var(--ntk-template-wiki-chat-drawer-input-text);
  font-size: 13px;
  max-height: 120px;
}

.ntk-template-wiki-chat-drawer__input::placeholder {
  color: var(--ntk-template-wiki-chat-drawer-input-placeholder);
}

.ntk-template-wiki-chat-drawer__send {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 8px;
  background: var(--ntk-template-wiki-chat-drawer-send-bg);
  color: var(--ntk-template-wiki-chat-drawer-send-text);
  cursor: pointer;
}

.ntk-template-wiki-chat-drawer__spinner {
  color: var(--ntk-template-wiki-chat-drawer-send-bg);
}

.ntk-template-wiki-chat-drawer__send:disabled {
  opacity: 1;
  background: color-mix(in srgb, var(--ntk-template-wiki-chat-drawer-input-wrap-border) 88%, var(--ntk-template-wiki-chat-drawer-surface-bg));
  color: color-mix(in srgb, var(--ntk-template-wiki-chat-drawer-meta-color) 88%, transparent);
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

.ntk-template-wiki-chat-drawer__sources {
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.ntk-template-wiki-chat-drawer__sources-label {
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  color: var(--ntk-template-wiki-chat-drawer-meta-color);
}

.ntk-template-wiki-chat-drawer__source {
  display: flex;
  align-items: flex-start;
  gap: 5px;
  padding: 5px 8px;
  border-radius: 6px;
  background: var(--ntk-template-wiki-chat-drawer-source-bg);
  border: 1px solid color-mix(in srgb, var(--ntk-template-wiki-chat-drawer-input-wrap-border) 68%, transparent);
  font-size: 11px;
}

.ntk-template-wiki-chat-drawer__source-info {
  display: flex;
  flex-direction: column;
  gap: 2px;

  strong {
    font-weight: 600;
    color: var(--ntk-template-wiki-chat-drawer-source-name-color);
    font-size: 11px;
  }

  p {
    margin: 0;
    color: var(--ntk-template-wiki-chat-drawer-source-chunk-color);
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}
</style>
