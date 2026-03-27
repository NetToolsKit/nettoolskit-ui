/**
 * Template navigation contracts for reusable layout and menu rendering.
 */

export interface TemplateMenuChildItem {
  id?: string
  text: string
  icon?: string
  to?: string
  routeName?: string
  disabled?: boolean
}

export interface TemplateMenuItem {
  id: string
  text: string
  caption?: string
  icon: string
  groupId?: string
  groupLabel?: string
  to?: string
  routeName?: string
  disabled?: boolean
  badge?: string | number
  stickyBottom?: boolean
  children?: TemplateMenuChildItem[] | null
}

export interface TemplateBreadcrumbItem {
  name: string
  routeName?: string
  path?: string
}

export interface TemplateUserMenuProfile {
  name: string
  initials: string
}