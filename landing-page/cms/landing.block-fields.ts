/**
 * Landing block field catalog used by CMS blocks editor forms.
 */

export type CmsBlockFieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'toggle'
  | 'select'
  | 'json'

export interface CmsBlockFieldOption {
  label: string
  value: string
}

export interface CmsBlockFieldDefinition {
  path: string
  label: string
  type: CmsBlockFieldType
  placeholder?: string
  options?: CmsBlockFieldOption[]
  rows?: number
  help?: string
}

const variantOptions = [
  { label: 'Default', value: 'default' },
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' },
  { label: 'Gradient', value: 'gradient' },
]

const sizeOptions = [
  { label: 'Small', value: 'sm' },
  { label: 'Medium', value: 'md' },
  { label: 'Large', value: 'lg' },
  { label: 'Extra Large', value: 'xl' },
]

const landingBlockFieldCatalog: Record<string, CmsBlockFieldDefinition[]> = {
  'landing.header': [
    { path: 'logoText', label: 'Logo text', type: 'text' },
    { path: 'sticky', label: 'Sticky header', type: 'toggle' },
    { path: 'ctaText', label: 'Header CTA text', type: 'text' },
    { path: 'ctaLink', label: 'Header CTA link', type: 'text' },
    {
      path: 'ctaVariant',
      label: 'Header CTA variant',
      type: 'select',
      options: [
        { label: 'Primary', value: 'primary' },
        { label: 'Secondary', value: 'secondary' },
        { label: 'Outline', value: 'outline' },
      ],
    },
    { path: 'maxWidth', label: 'Header max width', type: 'number' },
    {
      path: 'navItems',
      label: 'Navigation items (JSON)',
      type: 'json',
      rows: 5,
      help: 'Array of links [{ label, href, external? }].',
    },
  ],
  'landing.hero': [
    { path: 'badge', label: 'Badge', type: 'text' },
    { path: 'title', label: 'Title', type: 'text' },
    { path: 'subtitle', label: 'Subtitle', type: 'textarea', rows: 3 },
    { path: 'image', label: 'Image URL', type: 'text' },
    { path: 'imageAlt', label: 'Image alt', type: 'text' },
    {
      path: 'variant',
      label: 'Variant',
      type: 'select',
      options: variantOptions,
    },
    {
      path: 'layout',
      label: 'Layout',
      type: 'select',
      options: [
        { label: 'Centered', value: 'centered' },
        { label: 'Split', value: 'split' },
        { label: 'Split reverse', value: 'split-reverse' },
      ],
    },
    {
      path: 'size',
      label: 'Size',
      type: 'select',
      options: sizeOptions.slice(0, 3),
    },
    { path: 'primaryAction.label', label: 'Primary action label', type: 'text' },
    { path: 'primaryAction.href', label: 'Primary action href', type: 'text' },
    { path: 'primaryAction.external', label: 'Primary action external', type: 'toggle' },
    { path: 'secondaryAction.label', label: 'Secondary action label', type: 'text' },
    { path: 'secondaryAction.href', label: 'Secondary action href', type: 'text' },
    { path: 'secondaryAction.external', label: 'Secondary action external', type: 'toggle' },
  ],
  'landing.stats': [
    { path: 'title', label: 'Title', type: 'text' },
    { path: 'subtitle', label: 'Subtitle', type: 'textarea', rows: 3 },
    {
      path: 'variant',
      label: 'Variant',
      type: 'select',
      options: variantOptions,
    },
    {
      path: 'size',
      label: 'Size',
      type: 'select',
      options: sizeOptions,
    },
    {
      path: 'cardVariant',
      label: 'Card variant',
      type: 'select',
      options: [
        { label: 'Default', value: 'default' },
        { label: 'Outlined', value: 'outlined' },
        { label: 'Gradient', value: 'gradient' },
        { label: 'Minimal', value: 'minimal' },
      ],
    },
    {
      path: 'items',
      label: 'Stats items (JSON)',
      type: 'json',
      rows: 7,
      help: 'Array of stats [{ id, label, value, icon? }].',
    },
  ],
  'landing.features': [
    { path: 'title', label: 'Title', type: 'text' },
    { path: 'subtitle', label: 'Subtitle', type: 'textarea', rows: 3 },
    {
      path: 'variant',
      label: 'Variant',
      type: 'select',
      options: variantOptions,
    },
    {
      path: 'size',
      label: 'Size',
      type: 'select',
      options: sizeOptions,
    },
    {
      path: 'cardVariant',
      label: 'Card variant',
      type: 'select',
      options: [
        { label: 'Default', value: 'default' },
        { label: 'Outlined', value: 'outlined' },
        { label: 'Elevated', value: 'elevated' },
        { label: 'Accent Left', value: 'accent-left' },
        { label: 'Accent Top', value: 'accent-top' },
      ],
    },
    {
      path: 'iconStyle',
      label: 'Icon style',
      type: 'select',
      options: [
        { label: 'Default', value: 'default' },
        { label: 'Circle', value: 'circle' },
        { label: 'Square', value: 'square' },
        { label: 'Gradient', value: 'gradient' },
      ],
    },
    {
      path: 'items',
      label: 'Feature items (JSON)',
      type: 'json',
      rows: 8,
      help: 'Array of features [{ id, title, description, icon? }].',
    },
  ],
  'landing.cta': [
    { path: 'title', label: 'Title', type: 'text' },
    { path: 'subtitle', label: 'Subtitle', type: 'textarea', rows: 3 },
    {
      path: 'variant',
      label: 'Variant',
      type: 'select',
      options: variantOptions,
    },
    {
      path: 'layout',
      label: 'Layout',
      type: 'select',
      options: [
        { label: 'Centered', value: 'centered' },
        { label: 'Split', value: 'split' },
      ],
    },
    {
      path: 'size',
      label: 'Size',
      type: 'select',
      options: sizeOptions.slice(0, 3),
    },
    { path: 'maxWidth', label: 'Max width', type: 'number' },
    { path: 'primaryCTA.text', label: 'Primary CTA text', type: 'text' },
    { path: 'primaryCTA.link', label: 'Primary CTA link', type: 'text' },
    { path: 'secondaryCTA.text', label: 'Secondary CTA text', type: 'text' },
    { path: 'secondaryCTA.link', label: 'Secondary CTA link', type: 'text' },
  ],
  'landing.footer': [
    {
      path: 'variant',
      label: 'Variant',
      type: 'select',
      options: [
        { label: 'Dark', value: 'dark' },
        { label: 'Light', value: 'light' },
      ],
    },
    { path: 'brandName', label: 'Brand name', type: 'text' },
    { path: 'brandDescription', label: 'Brand description', type: 'textarea', rows: 3 },
    { path: 'socialTitle', label: 'Social title', type: 'text' },
    { path: 'copyrightText', label: 'Copyright text', type: 'text' },
    {
      path: 'linkSections',
      label: 'Link sections (JSON)',
      type: 'json',
      rows: 7,
      help: 'Array of sections [{ title, links[] }].',
    },
    {
      path: 'socialLinks',
      label: 'Social links (JSON)',
      type: 'json',
      rows: 5,
      help: 'Array of social links [{ icon, href, label }].',
    },
  ],
}

/**
 * Returns editable field definitions for a landing block type.
 */
export function getLandingBlockFieldDefinitions(type: string): CmsBlockFieldDefinition[] {
  return landingBlockFieldCatalog[type] ?? []
}