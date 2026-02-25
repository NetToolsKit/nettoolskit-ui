import { sentinelaLikePreset } from '../../src/components/layout/app-shell.config'
import type {
  AppShellAction,
  AppShellConfig,
  AppShellGroup,
  AppShellItem,
} from '../../src/components/layout/app-shell.types'

const groups: AppShellGroup[] = [
  { id: 'core', label: 'Core' },
  { id: 'content', label: 'Content' },
  { id: 'system', label: 'System' },
]

const items: AppShellItem[] = [
  {
    id: 'dashboard',
    group: 'core',
    label: 'Dashboard',
    icon: 'space_dashboard',
    caption: 'Overview',
    description: 'Operational summary for the admin area.',
  },
  {
    id: 'pages',
    group: 'content',
    label: 'Pages',
    icon: 'description',
    caption: 'Landing pages',
    description: 'Landing pages catalog and publication status.',
  },
  {
    id: 'blocks',
    group: 'content',
    label: 'Blocks',
    icon: 'widgets',
    caption: 'Components',
    description: 'Reusable block library for page composition.',
  },
  {
    id: 'media',
    group: 'content',
    label: 'Media',
    icon: 'perm_media',
    caption: 'Assets',
    description: 'Image and support file library.',
  },
  {
    id: 'users',
    group: 'system',
    label: 'Users',
    icon: 'group',
    caption: 'Access',
    description: 'Profile, roles and permissions management.',
  },
  {
    id: 'settings',
    group: 'system',
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

export function createCmsShellConfig(): AppShellConfig {
  return sentinelaLikePreset({
    appName: 'NetToolsKit',
    appSubtitle: 'NTK CMS',
    navGroups: groups,
    items,
    toolbarActions,
    activeItem: 'dashboard',
    searchPlaceholder: 'Search module',
  })
}
