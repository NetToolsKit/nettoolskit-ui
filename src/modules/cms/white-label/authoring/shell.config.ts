/**
 * CMS app-shell defaults used by the white-label settings workspace.
 */
import { sentinelaLikePreset } from '../../../../components/layout/app-shell.config'
import type {
  AppShellAction,
  AppShellConfig,
  AppShellGroup,
  AppShellItem,
} from '../../../../components/layout/app-shell.types'

const groups: AppShellGroup[] = [
  { id: 'configuration', label: 'Configuration' },
]

const items: AppShellItem[] = [
  {
    id: 'settings',
    group: 'configuration',
    label: 'Settings',
    icon: 'settings',
    caption: 'White-label',
    description: 'Theme tokens, branding and tenant configuration.',
  },
]

const toolbarActions: AppShellAction[] = [
  {
    id: 'notifications',
    icon: 'notifications',
    tooltip: 'Notifications',
    flat: true,
    dense: true,
    round: true,
    badge: 2,
  },
  {
    id: 'account',
    icon: 'account_circle',
    tooltip: 'Account',
    flat: true,
    dense: true,
    round: true,
  },
  {
    id: 'go-landing',
    icon: 'home',
    label: 'Landing',
    showLabel: true,
    flat: true,
    dense: true,
    href: '/',
  },
]

/**
 * Creates the baseline shell configuration used by CMS settings pages.
 */
export function createCmsShellConfig(): AppShellConfig {
  return sentinelaLikePreset({
    appName: 'NetToolsKit',
    appSubtitle: 'NTK CMS',
    navGroups: groups,
    items,
    toolbarActions,
    activeItem: 'settings',
    searchPlaceholder: 'Search module',
  })
}