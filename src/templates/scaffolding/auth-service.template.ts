/**
 * Auth service scaffold.
 * Provides a deterministic local-first auth service for template/runtime integration.
 * Mirrors the reference `authService.ts` pattern.
 */

import type { TemplateScaffoldAuthUser } from './auth-store.template'

interface TemplateLocalAuthAccount {
  password: string
  token: string
  user: TemplateScaffoldAuthUser
}

const LOCAL_AUTH_DELAY_MS = 250

const SEEDED_LOCAL_ACCOUNTS: ReadonlyArray<TemplateLocalAuthAccount> = [
  {
    password: 'demo-password',
    token: 'ntk-local-auth-runtime-ops',
    user: {
      id: 'runtime-ops',
      name: 'Admin NetToolsKit',
      email: 'ops@nettoolskit.dev',
      role: 'Operations Lead',
    },
  },
  {
    password: 'demo-password',
    token: 'ntk-local-auth-runtime-admin',
    user: {
      id: 'runtime-admin',
      name: 'Admin NetToolsKit',
      email: 'admin@nettoolskit.com',
      role: 'Admin',
    },
  },
  {
    password: 'support-password',
    token: 'ntk-local-auth-runtime-support',
    user: {
      id: 'runtime-support',
      name: 'Suporte NetToolsKit',
      email: 'support@nettoolskit.dev',
      role: 'Support',
    },
  },
]

export interface TemplateAuthServiceLoginResult {
  user: TemplateScaffoldAuthUser
  token: string
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

export const templateAuthService = {
  async login(email: string, password: string): Promise<TemplateAuthServiceLoginResult> {
    await new Promise(resolve => setTimeout(resolve, LOCAL_AUTH_DELAY_MS))

    const normalizedEmail = normalizeEmail(email)

    if (!normalizedEmail || !password) {
      throw new Error('E-mail e senha são obrigatórios')
    }

    const account = SEEDED_LOCAL_ACCOUNTS.find(candidate => candidate.user.email === normalizedEmail)

    if (!account || account.password !== password) {
      throw new Error('Credenciais locais inválidas. Use uma conta seeded do runtime.')
    }

    return {
      user: { ...account.user },
      token: account.token,
    }
  },
}
