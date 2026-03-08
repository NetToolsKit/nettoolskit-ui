/**
 * Landing block field catalog used by CMS blocks editor forms.
 */
import type { CmsMediaAssetKind } from '../../src/modules/cms/white-label/types'

export type CmsBlockFieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'toggle'
  | 'select'
  | 'json'
  | 'media-asset'

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
  mediaKinds?: CmsMediaAssetKind[]
  mediaTargetPath?: string
  mediaAltTargetPath?: string
}

export interface CmsBlockMediaBindingDefinition {
  sourcePath: string
  targetPath: string
  altTargetPath?: string
  allowedKinds?: CmsMediaAssetKind[]
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
    {
      path: 'imageAssetId',
      label: 'Image asset',
      type: 'media-asset',
      mediaKinds: ['image', 'icon'],
      mediaTargetPath: 'image',
      mediaAltTargetPath: 'imageAlt',
      help: 'Select a media-library asset. The runtime resolves the asset URL automatically.',
    },
    { path: 'image', label: 'Image URL override', type: 'text' },
    { path: 'imageAlt', label: 'Image alt', type: 'text' },
    {
      path: 'videoWebmAssetId',
      label: 'Video WebM asset',
      type: 'media-asset',
      mediaKinds: ['video'],
      mediaTargetPath: 'videoWebm',
      help: 'Optional asset reference for the WebM source.',
    },
    { path: 'videoWebm', label: 'Video WebM URL override', type: 'text' },
    {
      path: 'videoMp4AssetId',
      label: 'Video MP4 asset',
      type: 'media-asset',
      mediaKinds: ['video'],
      mediaTargetPath: 'videoMp4',
      help: 'Optional asset reference for the MP4 source.',
    },
    { path: 'videoMp4', label: 'Video MP4 URL override', type: 'text' },
    {
      path: 'videoPosterAssetId',
      label: 'Video poster asset',
      type: 'media-asset',
      mediaKinds: ['image', 'icon'],
      mediaTargetPath: 'videoPoster',
      help: 'Optional asset reference for the poster image.',
    },
    { path: 'videoPoster', label: 'Video poster URL override', type: 'text' },
    { path: 'videoAutoplay', label: 'Video autoplay', type: 'toggle' },
    { path: 'videoLoop', label: 'Video loop', type: 'toggle' },
    { path: 'videoMuted', label: 'Video muted', type: 'toggle' },
    { path: 'videoPlaysinline', label: 'Video playsinline', type: 'toggle' },
    { path: 'videoControls', label: 'Video controls', type: 'toggle' },
    { path: 'revealOnScroll', label: 'Reveal on scroll', type: 'toggle' },
    { path: 'revealMask', label: 'Reveal mask', type: 'toggle' },
    { path: 'revealOnce', label: 'Reveal once', type: 'toggle' },
    { path: 'parallaxEnabled', label: 'Parallax enabled', type: 'toggle' },
    { path: 'parallaxStrength', label: 'Parallax strength (px)', type: 'number' },
    {
      path: 'videoPreload',
      label: 'Video preload',
      type: 'select',
      options: [
        { label: 'Metadata', value: 'metadata' },
        { label: 'Auto', value: 'auto' },
        { label: 'None', value: 'none' },
      ],
    },
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
    { path: 'cinematicCardsEnabled', label: 'Cinematic cards enabled', type: 'toggle' },
    { path: 'cinematicCardsTilt', label: 'Cinematic tilt strength', type: 'number' },
    { path: 'cinematicCardsGlow', label: 'Cinematic glow intensity (0-1)', type: 'number' },
    { path: 'cinematicCardsPerspective', label: 'Cinematic perspective (px)', type: 'number' },
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

/**
 * Returns media-binding definitions declared in landing block field schemas.
 */
export function getLandingBlockMediaBindingDefinitions(type: string): CmsBlockMediaBindingDefinition[] {
  return getLandingBlockFieldDefinitions(type)
    .filter(
      (field): field is CmsBlockFieldDefinition & Required<Pick<CmsBlockFieldDefinition, 'mediaTargetPath'>> =>
        field.type === 'media-asset' && typeof field.mediaTargetPath === 'string' && field.mediaTargetPath.length > 0
    )
    .map(field => ({
      sourcePath: field.path,
      targetPath: field.mediaTargetPath,
      altTargetPath: field.mediaAltTargetPath,
      allowedKinds: field.mediaKinds,
    }))
}