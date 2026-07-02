/**
 * Built-in message dictionaries for the governed component strings.
 *
 * Pure and framework-free: dictionaries plus a module-level locale registry
 * (the same registry pattern as the notification service). The Vue binding
 * layers reactivity on top (`useNtkI18n`); other bindings can consume these
 * dictionaries directly. Per-component label props always override the
 * dictionary — this only replaces the hardcoded defaults.
 *
 * Default locale is `pt-BR` per NTK-FE-STD-002; `en` is the fallback source
 * of truth for key coverage.
 */

export const ntkLocales = ['pt-BR', 'en'] as const
export type NtkLocale = (typeof ntkLocales)[number]

export const DEFAULT_NTK_LOCALE: NtkLocale = 'pt-BR'

const EN = {
  'crud.new': 'New',
  'crud.edit': 'Edit',
  'crud.delete': 'Delete',
  'crud.save': 'Save',
  'crud.cancel': 'Cancel',
  'crud.editTitle': 'Edit record',
  'crud.search': 'Search',
  'crud.searchPlaceholder': 'Search...',
  'crud.loading': 'Loading...',
  'crud.errorTitle': 'Could not load',
  'crud.emptyTitle': 'No records',
  'crud.emptyDescription': 'There is no data to display.',
  'form.submit': 'Save',
  'form.reset': 'Clear',
  'table.empty': 'No records found',
  'table.loading': 'Loading...',
  'table.ariaLabel': 'Data table',
  'table.selectAll': 'Select all rows',
  'table.selectRow': 'Select row',
  'table.pagination': 'Pagination',
  'table.previousPage': 'Previous',
  'table.nextPage': 'Next',
  'table.yes': 'Yes',
  'table.no': 'No',
  'dialog.close': 'Close',
  'filterBar.apply': 'Apply',
  'filterBar.reset': 'Reset',
  'select.empty': 'No options',
  'a11y.remove': 'Remove',
  'a11y.dismiss': 'Dismiss',
  'a11y.breadcrumb': 'Breadcrumb',
  'a11y.sidebar': 'Sidebar',
  'a11y.navigationDrawer': 'Navigation drawer',
  'a11y.drawerNav': 'Drawer',
  'a11y.workspaceLayout': 'Workspace layout',
  'a11y.openMenu': 'Open menu',
  'a11y.ribbon': 'Ribbon',
  'a11y.openCalendar': 'Open calendar',
  'a11y.openTimeList': 'Open time list',
  'a11y.tabs': 'Tabs',
  'a11y.statusBar': 'Status bar',
  'a11y.quickAccessToolbar': 'Quick access toolbar',
  'a11y.notifications': 'Notifications',
  'a11y.progress': 'Progress',
  'a11y.tree': 'Tree',
  'a11y.workspace': 'Workspace',
  'a11y.chooseDate': 'Choose date',
  'a11y.calendarFor': '{label} calendar',
  'a11y.previousMonth': 'Previous month',
  'a11y.nextMonth': 'Next month',
  'validation.required': 'Fill in this field',
  'validation.email': 'Enter a valid e-mail',
  'validation.minLength': 'Use at least {min} characters',
  'validation.maxLength': 'Use at most {max} characters',
  'validation.minValue': 'Minimum value: {min}',
  'validation.maxValue': 'Maximum value: {max}',
  'validation.pattern': 'Invalid format',
} as const

export type NtkMessageKey = keyof typeof EN

const PT_BR: Record<NtkMessageKey, string> = {
  'crud.new': 'Novo',
  'crud.edit': 'Editar',
  'crud.delete': 'Excluir',
  'crud.save': 'Salvar',
  'crud.cancel': 'Cancelar',
  'crud.editTitle': 'Editar registro',
  'crud.search': 'Buscar',
  'crud.searchPlaceholder': 'Buscar...',
  'crud.loading': 'Carregando...',
  'crud.errorTitle': 'Não foi possível carregar',
  'crud.emptyTitle': 'Nenhum registro',
  'crud.emptyDescription': 'Não há dados para exibir.',
  'form.submit': 'Salvar',
  'form.reset': 'Limpar',
  'table.empty': 'Nenhum registro encontrado',
  'table.loading': 'Carregando...',
  'table.ariaLabel': 'Tabela de dados',
  'table.selectAll': 'Selecionar todas as linhas',
  'table.selectRow': 'Selecionar linha',
  'table.pagination': 'Paginação',
  'table.previousPage': 'Anterior',
  'table.nextPage': 'Próxima',
  'table.yes': 'Sim',
  'table.no': 'Não',
  'dialog.close': 'Fechar',
  'filterBar.apply': 'Aplicar',
  'filterBar.reset': 'Limpar',
  'select.empty': 'Sem opções',
  'a11y.remove': 'Remover',
  'a11y.dismiss': 'Dispensar',
  'a11y.breadcrumb': 'Trilha de navegação',
  'a11y.sidebar': 'Barra lateral',
  'a11y.navigationDrawer': 'Gaveta de navegação',
  'a11y.drawerNav': 'Menu',
  'a11y.workspaceLayout': 'Layout do espaço de trabalho',
  'a11y.openMenu': 'Abrir menu',
  'a11y.ribbon': 'Faixa de comandos',
  'a11y.openCalendar': 'Abrir calendário',
  'a11y.openTimeList': 'Abrir lista de horários',
  'a11y.tabs': 'Abas',
  'a11y.statusBar': 'Barra de status',
  'a11y.quickAccessToolbar': 'Barra de acesso rápido',
  'a11y.notifications': 'Notificações',
  'a11y.progress': 'Progresso',
  'a11y.tree': 'Árvore',
  'a11y.workspace': 'Espaço de trabalho',
  'a11y.chooseDate': 'Escolher data',
  'a11y.calendarFor': 'Calendário de {label}',
  'a11y.previousMonth': 'Mês anterior',
  'a11y.nextMonth': 'Próximo mês',
  'validation.required': 'Preencha este campo',
  'validation.email': 'Informe um e-mail válido',
  'validation.minLength': 'Use ao menos {min} caracteres',
  'validation.maxLength': 'Use no máximo {max} caracteres',
  'validation.minValue': 'Valor mínimo: {min}',
  'validation.maxValue': 'Valor máximo: {max}',
  'validation.pattern': 'Formato inválido',
}

export const ntkMessages: Record<NtkLocale, Record<NtkMessageKey, string>> = {
  en: EN,
  'pt-BR': PT_BR,
}

/** Replace `{name}` placeholders with the given params. */
export function formatNtkMessage(
  template: string,
  params: Record<string, string | number> = {},
): string {
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    (name in params ? String(params[name]) : match))
}

/** Resolve a message for a locale, falling back to `en` for key coverage. */
export function resolveNtkMessage(
  locale: NtkLocale,
  key: NtkMessageKey,
  params?: Record<string, string | number>,
): string {
  const template = ntkMessages[locale]?.[key] ?? ntkMessages.en[key]
  return params ? formatNtkMessage(template, params) : template
}

// Module-level locale registry so pure call sites (e.g. validation message
// defaults) honor the app locale without a framework dependency. The Vue
// binding keeps a reactive mirror in `useNtkI18n` and writes through here.
let activeNtkLocale: NtkLocale = DEFAULT_NTK_LOCALE

export function setNtkCoreLocale(locale: NtkLocale): void {
  activeNtkLocale = locale
}

export function getNtkCoreLocale(): NtkLocale {
  return activeNtkLocale
}

/** Resolve a message in the currently registered locale. */
export function ntkMessage(key: NtkMessageKey, params?: Record<string, string | number>): string {
  return resolveNtkMessage(activeNtkLocale, key, params)
}