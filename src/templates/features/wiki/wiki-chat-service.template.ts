/**
 * Wiki chat service scaffold.
 * Provides a fake chat service for template/demo integration.
 * Mirrors the reference `chatService.ts` pattern with local-only behavior.
 */

import type {
  TemplateWikiChatMessage,
  TemplateWikiConversation,
  TemplateWikiSourceReference,
} from './wiki-template.types'

export interface TemplateWikiChatRequest {
  question: string
}

export interface TemplateWikiChatResponse {
  conversationId: string
  answer: string
  sources: TemplateWikiSourceReference[]
  fromCache: boolean
}

export interface TemplateWikiConversationDetail {
  id: string
  title: string
  createdAt: string
  updatedAt: string
  messages: TemplateWikiChatMessage[]
}

const FAKE_SOURCES: TemplateWikiSourceReference[] = [
  { documentName: 'Manual de Operações.pdf', chunkContent: 'Seção 4.2 — Procedimentos de atendimento...', relevance: 0.92 },
  { documentName: 'FAQ Interno.docx', chunkContent: 'Perguntas frequentes sobre o sistema...', relevance: 0.85 },
]

const FAKE_ANSWERS = [
  'Com base na documentação disponível, o procedimento correto envolve os seguintes passos: primeiro, acesse o módulo de configurações e verifique as permissões do usuário.',
  'De acordo com o Manual de Operações, essa funcionalidade está disponível no módulo de relatórios. Acesse pelo menu lateral.',
  'O sistema permite essa operação através do painel administrativo. Consulte a seção 3.1 do manual para mais detalhes.',
]

let conversationCounter = 0

function generateId(): string {
  return `conv-${Date.now()}-${++conversationCounter}`
}

export const templateWikiChatService = {
  async ask(request: TemplateWikiChatRequest): Promise<TemplateWikiChatResponse> {
    await new Promise(resolve => setTimeout(resolve, 1200))

    return {
      conversationId: generateId(),
      answer: FAKE_ANSWERS[Math.floor(Math.random() * FAKE_ANSWERS.length)] ?? FAKE_ANSWERS[0]!,
      sources: FAKE_SOURCES,
      fromCache: false,
    }
  },

  async continueConversation(
    conversationId: string,
    request: TemplateWikiChatRequest
  ): Promise<TemplateWikiChatResponse> {
    await new Promise(resolve => setTimeout(resolve, 1000))

    return {
      conversationId,
      answer: FAKE_ANSWERS[Math.floor(Math.random() * FAKE_ANSWERS.length)] ?? FAKE_ANSWERS[0]!,
      sources: FAKE_SOURCES,
      fromCache: Math.random() > 0.7,
    }
  },

  async listConversations(): Promise<TemplateWikiConversation[]> {
    await new Promise(resolve => setTimeout(resolve, 300))

    return [
      { id: 'conv-demo-1', title: 'Dúvida sobre procedimentos', updatedAt: new Date().toISOString(), messageCount: 4 },
      { id: 'conv-demo-2', title: 'Configuração de relatórios', updatedAt: new Date(Date.now() - 86400000).toISOString(), messageCount: 2 },
    ]
  },

  async getConversation(conversationId: string): Promise<TemplateWikiConversationDetail> {
    await new Promise(resolve => setTimeout(resolve, 500))

    return {
      id: conversationId,
      title: 'Conversa de demonstração',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [
        { id: '1', role: 'user', content: 'Como faço para acessar os relatórios?', createdAt: new Date(Date.now() - 3600000).toISOString() },
        { id: '2', role: 'assistant', content: FAKE_ANSWERS[1]!, sources: FAKE_SOURCES, fromCache: false, createdAt: new Date(Date.now() - 3500000).toISOString() },
      ],
    }
  },

  async deleteConversation(_conversationId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300))
  },
}
