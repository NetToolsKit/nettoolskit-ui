/**
 * Auth service scaffold.
 * Provides a fake auth service for template/demo integration.
 * Mirrors the reference `authService.ts` pattern.
 */

import type { TemplateScaffoldAuthUser } from './auth-store.template'

const FAKE_USER: TemplateScaffoldAuthUser = {
  id: '1',
  name: 'Admin NetToolsKit',
  email: 'admin@nettoolskit.com',
  role: 'Admin',
}

const FAKE_TOKEN = 'fake-jwt-token-nettoolskit-template'

export interface TemplateAuthServiceLoginResult {
  user: TemplateScaffoldAuthUser
  token: string
}

export const templateAuthService = {
  async login(email: string, password: string): Promise<TemplateAuthServiceLoginResult> {
    await new Promise(resolve => setTimeout(resolve, 800))

    if (!email || !password) {
      throw new Error('E-mail e senha são obrigatórios')
    }

    return {
      user: { ...FAKE_USER, email },
      token: FAKE_TOKEN,
    }
  },
}
