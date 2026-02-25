import { sentinelaLikePreset } from '../../src/components/layout/app-shell.config'
import type {
  AppShellAction,
  AppShellConfig,
  AppShellGroup,
  AppShellItem,
} from '../../src/components/layout/app-shell.types'

const groups: AppShellGroup[] = [
  { id: 'core', label: 'Core' },
  { id: 'content', label: 'Conteudo' },
  { id: 'system', label: 'Sistema' },
]

const items: AppShellItem[] = [
  {
    id: 'dashboard',
    group: 'core',
    label: 'Dashboard',
    icon: 'space_dashboard',
    caption: 'Visao geral',
    description: 'Resumo operacional da area administrativa.',
  },
  {
    id: 'paginas',
    group: 'content',
    label: 'Paginas',
    icon: 'description',
    caption: 'Landing pages',
    description: 'Catalogo de paginas e status de publicacao.',
  },
  {
    id: 'blocos',
    group: 'content',
    label: 'Blocos',
    icon: 'widgets',
    caption: 'Componentes',
    description: 'Biblioteca de blocos reutilizaveis para composicao.',
  },
  {
    id: 'midia',
    group: 'content',
    label: 'Midia',
    icon: 'perm_media',
    caption: 'Assets',
    description: 'Biblioteca de imagens e arquivos de apoio.',
  },
  {
    id: 'usuarios',
    group: 'system',
    label: 'Usuarios',
    icon: 'group',
    caption: 'Acesso',
    description: 'Controle de perfil, papeis e permissoes.',
  },
  {
    id: 'configuracoes',
    group: 'system',
    label: 'Configuracoes',
    icon: 'settings',
    caption: 'White-label',
    description: 'Tokens de tema, branding e configuracoes por tenant.',
  },
]

const toolbarActions: AppShellAction[] = [
  {
    id: 'notifications',
    icon: 'notifications',
    tooltip: 'Notificacoes',
    color: 'grey-8',
    flat: true,
    dense: true,
    round: true,
    badge: 2,
    badgeColor: 'red',
    badgeTextColor: 'white',
  },
  {
    id: 'account',
    icon: 'account_circle',
    tooltip: 'Conta',
    color: 'grey-8',
    flat: true,
    dense: true,
    round: true,
  },
  {
    id: 'go-landing',
    icon: 'home',
    label: 'Landing',
    showLabel: true,
    color: 'grey-8',
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
    searchPlaceholder: 'Buscar modulo',
  })
}
