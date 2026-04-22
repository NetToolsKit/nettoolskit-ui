import { afterEach, describe, expect, it, vi } from 'vitest'

import { templateAuthService } from '../../../src/templates/scaffolding/auth-service.template'

async function settleLogin<T>(promise: Promise<T>): Promise<T> {
  await vi.advanceTimersByTimeAsync(250)
  return promise
}

describe('templateAuthService', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('authenticates a seeded runtime account with canonical local data', async () => {
    vi.useFakeTimers()

    const resultPromise = templateAuthService.login(' OPS@NetToolsKit.Dev ', 'demo-password')
    const result = await settleLogin(resultPromise)

    expect(result).toEqual({
      user: {
        id: 'runtime-ops',
        name: 'Admin NetToolsKit',
        email: 'ops@nettoolskit.dev',
        role: 'Operations Lead',
      },
      token: 'ntk-local-auth-runtime-ops',
    })
  })

  it('keeps the token deterministic for the same seeded account', async () => {
    vi.useFakeTimers()

    const firstLoginPromise = templateAuthService.login('admin@nettoolskit.com', 'demo-password')
    const firstResult = await settleLogin(firstLoginPromise)

    const secondLoginPromise = templateAuthService.login('admin@nettoolskit.com', 'demo-password')
    const secondResult = await settleLogin(secondLoginPromise)

    expect(firstResult.token).toBe('ntk-local-auth-runtime-admin')
    expect(secondResult.token).toBe(firstResult.token)
    expect(secondResult.user).toEqual(firstResult.user)
  })

  it('rejects unknown accounts even with a non-empty password', async () => {
    vi.useFakeTimers()

    const resultPromise = templateAuthService.login('unknown@nettoolskit.dev', 'demo-password')
    const assertion = expect(resultPromise).rejects.toThrow(
      'Invalid local credentials. Use a seeded runtime account.'
    )
    await vi.advanceTimersByTimeAsync(250)

    await assertion
  })

  it('rejects a wrong password for a seeded account', async () => {
    vi.useFakeTimers()

    const resultPromise = templateAuthService.login('ops@nettoolskit.dev', 'wrong-password')
    const assertion = expect(resultPromise).rejects.toThrow(
      'Invalid local credentials. Use a seeded runtime account.'
    )
    await vi.advanceTimersByTimeAsync(250)

    await assertion
  })
})
