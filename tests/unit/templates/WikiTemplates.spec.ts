import { describe, expect, it } from 'vitest'
import { shallowMount } from '@vue/test-utils'

import WikiTemplate from '../../../src/templates/features/wiki/WikiTemplate.vue'
import WikiChatDrawerTemplate from '../../../src/templates/features/wiki/WikiChatDrawerTemplate.vue'
import WikiChatTemplate from '../../../src/templates/features/wiki/WikiChatTemplate.vue'

const wikiGlobal = {
  global: {
    renderStubDefaultSlot: true,
    stubs: {
      'q-page': { template: '<div><slot /></div>' },
      'q-btn': { template: '<button><slot /></button>' },
      'q-icon': { template: '<span />' },
      'q-checkbox': { template: '<span />' },
      NtkDataTable: {
        props: ['rows', 'rowActions'],
        emits: ['row-click', 'row-action-click'],
        template: `
          <div class="ntk-data-table-test">
            <div
              v-for="row in rows"
              :key="row.id"
              class="ntk-data-table-test-row"
              @click="$emit('row-click', row.id)"
            >
              <span
                v-for="(value, key) in row.cells"
                :key="key"
              >{{ value }}</span>
              <button
                v-for="action in rowActions"
                :key="action.id"
                type="button"
                class="ntk-data-table__row-action"
                :aria-label="action.ariaLabel || action.label || action.id"
                @click.stop="$emit('row-action-click', { actionId: action.id, rowId: row.id })"
              >
                {{ action.id }}
              </button>
            </div>
          </div>
        `,
      },
      transition: false,
    },
  },
}

const sampleDocuments = [
  { id: 'd1', name: 'Invoice Q1', status: 'processed' as const, categoryId: 'finance', category: 'Finance' },
  { id: 'd2', name: 'Contract Alpha', status: 'pending' as const, categoryId: 'legal', category: 'Legal' },
  { id: 'd3', name: 'Report Annual', status: 'error' as const, categoryId: 'finance', category: 'Finance' },
]

describe('WikiTemplate', () => {
  it('renders title, subtitle, and auto-computed stat chips', () => {
    const wrapper = shallowMount(WikiTemplate, {
      ...wikiGlobal,
      props: {
        title: 'Company Wiki',
        subtitle: 'All company documents',
        documents: sampleDocuments,
      },
    })

    expect(wrapper.text()).toContain('Company Wiki')
    expect(wrapper.text()).toContain('All company documents')
    // auto-derived chips: 3 total, 1 processed, 1 pending, 1 error
    expect(wrapper.text()).toContain('3')
    const chips = wrapper.findAll('.ntk-template-wiki__chip')
    expect(chips.length).toBeGreaterThanOrEqual(4)
  })

  it('renders all documents as table rows in list view', () => {
    const wrapper = shallowMount(WikiTemplate, {
      ...wikiGlobal,
      props: { documents: sampleDocuments },
    })

    const rows = wrapper.findAll('.ntk-data-table-test-row')
    expect(rows).toHaveLength(3)
    expect(wrapper.text()).toContain('Invoice Q1')
    expect(wrapper.text()).toContain('Contract Alpha')
    expect(wrapper.text()).toContain('Report Annual')
  })

  it('filters documents by status filter button', async () => {
    const wrapper = shallowMount(WikiTemplate, {
      ...wikiGlobal,
      props: { documents: sampleDocuments },
    })

    const filterBtns = wrapper.findAll('.ntk-template-wiki__filter')
    const pendingBtn = filterBtns.find(b => b.text() === 'Pending')
    await pendingBtn?.trigger('click')

    const rows = wrapper.findAll('.ntk-data-table-test-row')
    expect(rows).toHaveLength(1)
    expect(wrapper.text()).toContain('Contract Alpha')
    expect(wrapper.text()).not.toContain('Invoice Q1')
  })

  it('filters documents by text search', async () => {
    const wrapper = shallowMount(WikiTemplate, {
      ...wikiGlobal,
      props: { documents: sampleDocuments },
    })

    const searchInputs = wrapper.findAll('.ntk-template-wiki__search-input')
    // The document search is the second input (sidebar search is first)
    const docSearch = searchInputs[1]
    await docSearch?.setValue('invoice')

    const rows = wrapper.findAll('.ntk-data-table-test-row')
    expect(rows).toHaveLength(1)
    expect(wrapper.text()).toContain('Invoice Q1')
    expect(wrapper.text()).not.toContain('Contract Alpha')
  })

  it('renders grid cards when initialViewMode is grid', () => {
    const wrapper = shallowMount(WikiTemplate, {
      ...wikiGlobal,
      props: { documents: sampleDocuments, initialViewMode: 'grid' },
    })

    expect(wrapper.find('.ntk-template-wiki__table').exists()).toBe(false)
    const cards = wrapper.findAll('.ntk-template-wiki__card')
    expect(cards).toHaveLength(3)
  })

  it('filters documents by category when tree item is clicked', async () => {
    const wrapper = shallowMount(WikiTemplate, {
      ...wikiGlobal,
      props: {
        documents: sampleDocuments,
        categories: [
          { id: 'finance', name: 'Finance', count: 2 },
          { id: 'legal', name: 'Legal', count: 1 },
        ],
      },
    })

    const categoryBtns = wrapper.findAll('.ntk-template-wiki__tree-item')
    // Click the first category (Finance)
    await categoryBtns[0]?.trigger('click')

    const rows = wrapper.findAll('.ntk-data-table-test-row')
    expect(rows).toHaveLength(2)
    expect(wrapper.text()).toContain('Invoice Q1')
    expect(wrapper.text()).toContain('Report Annual')
    expect(wrapper.text()).not.toContain('Contract Alpha')
  })

  it('emits view-document when view action is clicked', async () => {
    const wrapper = shallowMount(WikiTemplate, {
      ...wikiGlobal,
      props: { documents: sampleDocuments },
    })

    const viewBtns = wrapper.findAll(`button[aria-label="View item"]`)
    await viewBtns[0]?.trigger('click')

    const emitted = wrapper.emitted('view-document') as [unknown][]
    expect(emitted).toHaveLength(1)
    expect((emitted[0]?.[0] as { id: string }).id).toBe('d1')
  })
})

describe('WikiChatDrawerTemplate', () => {
  const drawerGlobal = {
    global: {
      stubs: {
        'q-icon': { template: '<span />' },
        'q-spinner-dots': { template: '<span />' },
      },
    },
  }

  it('renders title and messages with correct role classes', () => {
    const wrapper = shallowMount(WikiChatDrawerTemplate, {
      ...drawerGlobal,
      props: {
        modelValue: true,
        title: 'AI Assistant',
        messages: [
          { id: '1', role: 'user' as const, content: 'Hello' },
          { id: '2', role: 'assistant' as const, content: 'World' },
        ],
      },
    })

    expect(wrapper.text()).toContain('AI Assistant')
    const messages = wrapper.findAll('.ntk-template-wiki-chat-drawer__message')
    expect(messages).toHaveLength(2)
    expect(messages[0]?.classes()).toContain('ntk-template-wiki-chat-drawer__message--user')
    expect(messages[1]?.classes()).toContain('ntk-template-wiki-chat-drawer__message--assistant')
  })

  it('formats message content: bold, italic, code, and newlines', () => {
    const wrapper = shallowMount(WikiChatDrawerTemplate, {
      ...drawerGlobal,
      props: {
        modelValue: true,
        messages: [
          { id: '1', role: 'assistant' as const, content: '**bold** *italic* `code`\nline2' },
        ],
      },
    })

    const bubble = wrapper.find('.ntk-template-wiki-chat-drawer__bubble')
    expect(bubble.find('strong').text()).toBe('bold')
    expect(bubble.find('em').text()).toBe('italic')
    expect(bubble.find('code').text()).toBe('code')
    expect(bubble.find('br').exists()).toBe(true)
  })

  it('escapes HTML in message content before applying markdown', () => {
    const wrapper = shallowMount(WikiChatDrawerTemplate, {
      ...drawerGlobal,
      props: {
        modelValue: true,
        messages: [
          { id: '1', role: 'user' as const, content: '<script>alert(1)</script>' },
        ],
      },
    })

    const bubble = wrapper.find('.ntk-template-wiki-chat-drawer__bubble')
    expect(bubble?.html()).not.toContain('<script>')
    expect(bubble?.html()).toContain('&lt;script&gt;')
  })

  it('shows empty state and suggestions when no messages', () => {
    const wrapper = shallowMount(WikiChatDrawerTemplate, {
      ...drawerGlobal,
      props: {
        modelValue: true,
        suggestions: [
          { id: 's1', text: 'Show top unresolved tasks.' },
          { id: 's2', text: 'Summarize recent incidents.' },
        ],
      },
    })

    expect(wrapper.find('.ntk-template-wiki-chat-drawer__empty').exists()).toBe(true)
    const suggestions = wrapper.findAll('.ntk-template-wiki-chat-drawer__suggestion')
    expect(suggestions).toHaveLength(2)
    expect(suggestions[0]?.text()).toBe('Show top unresolved tasks.')
  })

  it('emits update:modelValue false when close button is clicked', async () => {
    const wrapper = shallowMount(WikiChatDrawerTemplate, {
      ...drawerGlobal,
      props: { modelValue: true },
    })

    const closeBtn = wrapper.find('button[aria-label="Close drawer"]')
    await closeBtn.trigger('click')

    expect(wrapper.emitted('update:modelValue')).toEqual([[false]])
  })

  it('emits send-question when a suggestion is clicked', async () => {
    const wrapper = shallowMount(WikiChatDrawerTemplate, {
      ...drawerGlobal,
      props: {
        modelValue: true,
        suggestions: [{ id: 's1', text: 'What is the status?' }],
      },
    })

    const suggestion = wrapper.find('.ntk-template-wiki-chat-drawer__suggestion')
    await suggestion.trigger('click')

    expect(wrapper.emitted('send-question')).toEqual([['What is the status?']])
  })

  it('does not render drawer content when modelValue is false', () => {
    const wrapper = shallowMount(WikiChatDrawerTemplate, {
      ...drawerGlobal,
      props: { modelValue: false },
    })

    expect(wrapper.find('.ntk-template-wiki-chat-drawer').exists()).toBe(false)
  })

  it('renders source citations on assistant messages', () => {
    const wrapper = shallowMount(WikiChatDrawerTemplate, {
      ...drawerGlobal,
      props: {
        modelValue: true,
        sourcesLabel: 'Fontes',
        messages: [
          {
            id: 'm1',
            role: 'assistant',
            content: 'Here is the answer.',
            sources: [
              { documentName: 'Manual de Operações', chunkContent: 'Section 3.1...', relevance: 0.9 },
              { documentName: 'FAQ Geral', chunkContent: 'Question about...', relevance: 0.7 },
            ],
          },
        ],
      },
    })

    expect(wrapper.find('.ntk-template-wiki-chat-drawer__sources').exists()).toBe(true)
    expect(wrapper.find('.ntk-template-wiki-chat-drawer__sources-label').text()).toBe('Fontes')
    const sources = wrapper.findAll('.ntk-template-wiki-chat-drawer__source')
    expect(sources).toHaveLength(2)
    expect(sources[0]?.text()).toContain('Manual de Operações')
    expect(sources[1]?.text()).toContain('FAQ Geral')
  })

  it('does not render sources section when message has no sources', () => {
    const wrapper = shallowMount(WikiChatDrawerTemplate, {
      ...drawerGlobal,
      props: {
        modelValue: true,
        messages: [{ id: 'm1', role: 'user', content: 'Hello' }],
      },
    })

    expect(wrapper.find('.ntk-template-wiki-chat-drawer__sources').exists()).toBe(false)
  })
})

describe('WikiChatTemplate', () => {
  const chatGlobal = {
    global: {
      renderStubDefaultSlot: true,
      stubs: {
        'q-page': { template: '<div><slot /></div>' },
        'q-icon': { template: '<span />' },
        'q-spinner-dots': { template: '<span />' },
      },
    },
  }

  const sampleConversations = [
    { id: 'c1', title: 'Release planning', updatedAt: '09:00', messageCount: 3 },
    { id: 'c2', title: 'Incident review', updatedAt: '08:30', messageCount: 1 },
  ]

  it('renders conversations list and marks the active one', () => {
    const wrapper = shallowMount(WikiChatTemplate, {
      ...chatGlobal,
      props: {
        conversations: sampleConversations,
        activeConversationId: 'c1',
      },
    })

    const conversations = wrapper.findAll('.ntk-template-wiki-chat__conversation')
    expect(conversations).toHaveLength(2)
    expect(conversations[0]?.classes()).toContain('ntk-template-wiki-chat__conversation--active')
    expect(conversations[1]?.classes()).not.toContain('ntk-template-wiki-chat__conversation--active')
  })

  it('filters conversations by search input', async () => {
    const wrapper = shallowMount(WikiChatTemplate, {
      ...chatGlobal,
      props: { conversations: sampleConversations },
    })

    await wrapper.find('.ntk-template-wiki-chat__search-input').setValue('incident')

    const conversations = wrapper.findAll('.ntk-template-wiki-chat__conversation')
    expect(conversations).toHaveLength(1)
    expect(wrapper.text()).toContain('Incident review')
    expect(wrapper.text()).not.toContain('Release planning')
  })

  it('emits select-conversation and update:activeConversationId when a conversation is clicked', async () => {
    const wrapper = shallowMount(WikiChatTemplate, {
      ...chatGlobal,
      props: { conversations: sampleConversations },
    })

    await wrapper.findAll('.ntk-template-wiki-chat__conversation')[1]?.trigger('click')

    expect(wrapper.emitted('select-conversation')).toEqual([['c2']])
    expect(wrapper.emitted('update:activeConversationId')).toEqual([['c2']])
  })

  it('shows active conversation title in the chat header', () => {
    const wrapper = shallowMount(WikiChatTemplate, {
      ...chatGlobal,
      props: {
        title: 'Default title',
        conversations: sampleConversations,
        activeConversationId: 'c2',
      },
    })

    expect(wrapper.find('.ntk-template-wiki-chat__chat-title').text()).toBe('Incident review')
  })

  it('shows default title when no active conversation is selected', () => {
    const wrapper = shallowMount(WikiChatTemplate, {
      ...chatGlobal,
      props: {
        title: 'My Chat',
        conversations: sampleConversations,
        activeConversationId: null,
      },
    })

    expect(wrapper.find('.ntk-template-wiki-chat__chat-title').text()).toBe('My Chat')
  })

  it('hides the conversation sidebar when showConversationPanel is false', () => {
    const wrapper = shallowMount(WikiChatTemplate, {
      ...chatGlobal,
      props: { showConversationPanel: false },
    })

    expect(wrapper.find('.ntk-template-wiki-chat__sidebar').exists()).toBe(false)
  })

  it('emits send-question when a suggestion is clicked in empty state', async () => {
    const wrapper = shallowMount(WikiChatTemplate, {
      ...chatGlobal,
      props: {
        suggestions: [{ id: 's1', text: 'Show top incidents.' }],
        messages: [],
      },
    })

    const suggestion = wrapper.find('.ntk-template-wiki-chat__suggestion')
    await suggestion.trigger('click')

    expect(wrapper.emitted('send-question')).toEqual([['Show top incidents.']])
  })

  it('emits delete-conversation when delete button is clicked', async () => {
    const wrapper = shallowMount(WikiChatTemplate, {
      ...chatGlobal,
      props: {
        conversations: sampleConversations,
        showDeleteConversationAction: true,
      },
    })

    const deleteBtn = wrapper.find('.ntk-template-wiki-chat__conversation-delete')
    await deleteBtn.trigger('click')

    expect(wrapper.emitted('delete-conversation')).toEqual([['c1']])
  })
})
