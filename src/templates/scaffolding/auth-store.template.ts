/**
 * Auth state scaffold helpers.
 * Provides a framework-agnostic auth state manager for template integration.
 * Mirrors the authStore + useAuth pattern from the reference project.
 */

import { computed, reactive, readonly } from 'vue'

export interface TemplateScaffoldAuthUser {
  id: string
  name: string
  email: string
  role?: string
  avatar?: string
}

export interface TemplateScaffoldAuthState {
  user: TemplateScaffoldAuthUser | null
  token: string | null
}

export interface TemplateScaffoldAuthStoreOptions {
  /** Called to persist auth data (e.g. LocalStorage.set). No-op by default. */
  persist?: (key: string, value: unknown) => void
  /** Called to remove persisted auth data. No-op by default. */
  remove?: (key: string) => void
  /** Called to read persisted auth data. Returns null by default. */
  read?: <T>(key: string) => T | null
  tokenKey?: string
  userKey?: string
}

export interface TemplateScaffoldAuthStore {
  state: Readonly<TemplateScaffoldAuthState>
  isAuthenticated: Readonly<{ value: boolean }>
  userName: Readonly<{ value: string }>
  userInitials: Readonly<{ value: string }>
  userRole: Readonly<{ value: string | null }>
  setAuth: (user: TemplateScaffoldAuthUser, token: string) => void
  updateUserName: (name: string) => void
  logout: () => void
  checkAuth: () => boolean
}

/**
 * Creates a template-level auth store with optional persistence.
 *
 * Usage in a Pinia project: wrap this store inside `defineStore` or delegate to it.
 * Usage standalone: use the returned object directly.
 */
export function createTemplateAuthStore(
  options: TemplateScaffoldAuthStoreOptions = {}
): TemplateScaffoldAuthStore {
  const tokenKey = options.tokenKey ?? 'auth_token'
  const userKey = options.userKey ?? 'auth_user'

  const persist = options.persist ?? (() => undefined)
  const remove = options.remove ?? (() => undefined)
  const read = options.read ?? (() => null)

  const state = reactive<TemplateScaffoldAuthState>({
    user: read<TemplateScaffoldAuthUser>(userKey),
    token: read<string>(tokenKey),
  })

  const isAuthenticated = computed(() => !!state.token && !!state.user)
  const userRole = computed(() => state.user?.role ?? null)

  const userName = computed(() => state.user?.name ?? '')

  const userInitials = computed(() => {
    const name = (state.user?.name ?? '').trim()
    if (!name) return ''
    const words = name.split(' ').filter((w) => w.length > 0)
    if (words.length === 0) return ''
    if (words.length === 1) return name.substring(0, 2).toUpperCase()
    return ((words[0]?.[0] ?? '') + (words[words.length - 1]?.[0] ?? '')).toUpperCase()
  })

  function setAuth(user: TemplateScaffoldAuthUser, token: string): void {
    state.user = user
    state.token = token
    persist(userKey, user)
    persist(tokenKey, token)
  }

  function updateUserName(name: string): void {
    if (state.user) {
      state.user = { ...state.user, name }
      persist(userKey, state.user)
    }
  }

  function logout(): void {
    state.user = null
    state.token = null
    remove(userKey)
    remove(tokenKey)
  }

  function checkAuth(): boolean {
    const token = read<string>(tokenKey)
    const user = read<TemplateScaffoldAuthUser>(userKey)
    if (token && user) {
      state.token = token
      state.user = user
      return true
    }
    return false
  }

  return {
    state: readonly(state),
    isAuthenticated,
    userName,
    userInitials,
    userRole,
    setAuth,
    updateUserName,
    logout,
    checkAuth,
  }
}

/**
 * Creates a composable that wraps the auth store, providing navigation on logout.
 * Pass a `navigate` callback (e.g. `() => router.push({ name: 'login' })`) to redirect after logout.
 */
export function createTemplateUseAuth(
  store: TemplateScaffoldAuthStore,
  navigate: () => Promise<void> | void
) {
  return {
    isAuthenticated: store.isAuthenticated,
    user: computed(() => store.state.user),
    userName: store.userName,
    userInitials: store.userInitials,
    async logout(): Promise<void> {
      store.logout()
      await navigate()
    },
  }
}