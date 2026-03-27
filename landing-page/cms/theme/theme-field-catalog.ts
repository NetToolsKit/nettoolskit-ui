import { createDefaultWhiteLabelSettings } from '../../../src/modules/cms/white-label/config'

export type ThemeFieldKey = keyof ReturnType<typeof createDefaultWhiteLabelSettings>['theme']
export type ThemeFieldGroup = 'foundation' | 'typography' | 'layout' | 'navigation' | 'header' | 'notifications' | 'landing'
export type ThemeFieldSectionId =
  | 'default'
  | 'core'
  | 'landingTypography'
  | 'layoutSpacing'
  | 'layoutDimensions'
  | 'radius'
  | 'shadows'
  | 'motion'
  | 'grayscale'
  | 'sections'
  | 'githubDark'
  | 'sharedDark'
  | 'syntax'
  | 'effects'

export interface ThemeField {
  key: ThemeFieldKey
  group: ThemeFieldGroup
  label: string
  isColor?: boolean
  placeholder?: string
  aliases?: ThemeFieldKey[]
  advanced?: boolean
}

export interface ThemeFieldGroupDefinition {
  id: ThemeFieldGroup
  label: string
  description: string
}

export interface ThemeFieldSectionDefinition {
  id: ThemeFieldSectionId
  label: string
  description: string
}

export interface ThemeFieldSection {
  id: ThemeFieldSectionId
  label: string
  description: string
  fields: ThemeField[]
}

export const typographyFieldGroupsDefinition: ThemeFieldGroupDefinition[] = [
  {
    id: 'typography',
    label: 'Typography',
    description: 'Font family, weights, sizes and base style.',
  },
]

export const layoutFieldGroupsDefinition: ThemeFieldGroupDefinition[] = [
  {
    id: 'layout',
    label: 'Layout and Motion',
    description: 'Radii, spacing and motion tokens for shell structure.',
  },
]

export const colorFieldGroupsDefinition: ThemeFieldGroupDefinition[] = [
  {
    id: 'foundation',
    label: 'Foundation',
    description: 'Base colors reused by page, cards and default text.',
  },
  {
    id: 'navigation',
    label: 'Navigation',
    description: 'Sidebar states, active item and menu emphasis.',
  },
  {
    id: 'header',
    label: 'Header and Search',
    description: 'Topbar tone, search borders and shell shadows.',
  },
  {
    id: 'notifications',
    label: 'Notifications and Actions',
    description: 'Badges and action highlights.',
  },
  {
    id: 'landing',
    label: 'Landing Colors',
    description: 'Public landing palette, GitHub-like dark tones and code syntax colors.',
  },
]

export const landingColorSectionsDefinition: ThemeFieldSectionDefinition[] = [
  {
    id: 'core',
    label: 'Brand Core',
    description: 'Primary/secondary brand anchors and absolute neutral values.',
  },
  {
    id: 'landingTypography',
    label: 'Landing Typography Scale',
    description: 'Public landing text scale used by hero, sections, cards and footer.',
  },
  {
    id: 'layoutSpacing',
    label: 'Layout Spacing',
    description: 'Base spacing scale reused by sections, cards and component blocks.',
  },
  {
    id: 'layoutDimensions',
    label: 'Layout Dimensions',
    description: 'Sizing, clamps and positional offsets used by hero, cards, drawer and CTA button.',
  },
  {
    id: 'radius',
    label: 'Radius Scale',
    description: 'Rounded corner controls for cards, chips and section surfaces.',
  },
  {
    id: 'shadows',
    label: 'Shadows',
    description: 'Primary elevation values used by header, cards and code frame.',
  },
  {
    id: 'motion',
    label: 'Motion and Interaction',
    description: 'Durations, easing and hover/reveal behavior for landing animations.',
  },
  {
    id: 'grayscale',
    label: 'Neutral Scale',
    description: 'Gray ramp consumed by borders, muted text and overlays.',
  },
  {
    id: 'sections',
    label: 'Section Backgrounds',
    description: 'Main light/dark section surfaces used across the landing flow.',
  },
  {
    id: 'githubDark',
    label: 'GitHub Dark Palette',
    description: 'GitHub-style dark tokens used in dark-mode and CTA/footer surfaces.',
  },
  {
    id: 'sharedDark',
    label: 'Shared Dark Surfaces',
    description: 'Unified dark card background, border and text tokens.',
  },
  {
    id: 'syntax',
    label: 'Code Syntax Colors',
    description: 'Code snippet highlighting palette for the landing developer section.',
  },
  {
    id: 'effects',
    label: 'Gradients and Highlights',
    description: 'Theme cards gradient and metallic hero highlight stops.',
  },
]


export function createThemeFields(
  defaultTheme: ReturnType<typeof createDefaultWhiteLabelSettings>['theme'] = createDefaultWhiteLabelSettings().theme
): ThemeField[] {
  const themePlaceholder = (key: ThemeFieldKey): string => {
    const value = defaultTheme[key]
    return value ? String(value) : ''
  }

  return [
  {
    key: 'fontFamily',
    group: 'typography',
    label: 'Font family',
    placeholder: themePlaceholder('fontFamily'),
  },
  {
    key: 'fontFamilyDisplay',
    group: 'typography',
    label: 'Display font family',
    placeholder: themePlaceholder('fontFamilyDisplay'),
  },
  {
    key: 'fontStyleBase',
    group: 'typography',
    label: 'Base font style (normal/italic)',
    placeholder: themePlaceholder('fontStyleBase'),
  },
  {
    key: 'fontWeightRegular',
    group: 'typography',
    label: 'Weight regular',
    placeholder: themePlaceholder('fontWeightRegular'),
  },
  {
    key: 'fontWeightMedium',
    group: 'typography',
    label: 'Weight medium',
    placeholder: themePlaceholder('fontWeightMedium'),
  },
  {
    key: 'fontWeightSemibold',
    group: 'typography',
    label: 'Weight semibold',
    placeholder: themePlaceholder('fontWeightSemibold'),
  },
  {
    key: 'fontWeightBold',
    group: 'typography',
    label: 'Weight bold',
    placeholder: themePlaceholder('fontWeightBold'),
  },
  {
    key: 'fontSizeBase',
    group: 'typography',
    label: 'Base font size',
    placeholder: themePlaceholder('fontSizeBase'),
  },
  {
    key: 'fontSizeTitle',
    group: 'typography',
    label: 'Title font size',
    placeholder: themePlaceholder('fontSizeTitle'),
  },
  {
    key: 'fontSizeTitleApp',
    group: 'typography',
    label: 'App title size',
    placeholder: themePlaceholder('fontSizeTitleApp'),
  },
  {
    key: 'fontSizeBrandTitle',
    group: 'typography',
    label: 'Brand title size',
    placeholder: themePlaceholder('fontSizeBrandTitle'),
  },
  {
    key: 'fontSizeBrandSubtitle',
    group: 'typography',
    label: 'Brand subtitle size',
    placeholder: themePlaceholder('fontSizeBrandSubtitle'),
  },
  {
    key: 'fontSizeItemLabel',
    group: 'typography',
    label: 'Menu label size',
    placeholder: themePlaceholder('fontSizeItemLabel'),
  },
  {
    key: 'fontSizeItemCaption',
    group: 'typography',
    label: 'Menu caption size',
    placeholder: themePlaceholder('fontSizeItemCaption'),
  },
  {
    key: 'fontSizeGroupCaption',
    group: 'typography',
    label: 'Group caption size',
    placeholder: themePlaceholder('fontSizeGroupCaption'),
  },
  {
    key: 'fontSizeGroupCaptionMini',
    group: 'typography',
    label: 'Group mini caption size',
    placeholder: themePlaceholder('fontSizeGroupCaptionMini'),
  },
  {
    key: 'letterSpacingGroupCaption',
    group: 'typography',
    label: 'Group caption letter spacing',
    placeholder: themePlaceholder('letterSpacingGroupCaption'),
  },
  {
    key: 'letterSpacingGroupCaptionMini',
    group: 'typography',
    label: 'Group mini letter spacing',
    placeholder: themePlaceholder('letterSpacingGroupCaptionMini'),
  },
  {
    key: 'lineHeightBrandText',
    group: 'typography',
    label: 'Brand block line height',
    placeholder: themePlaceholder('lineHeightBrandText'),
  },
  {
    key: 'lineHeightItemLabel',
    group: 'typography',
    label: 'Item label line height',
    placeholder: themePlaceholder('lineHeightItemLabel'),
  },
  {
    key: 'lineHeightItemCaption',
    group: 'typography',
    label: 'Item caption line height',
    placeholder: themePlaceholder('lineHeightItemCaption'),
  },
  {
    key: 'borderWidth',
    group: 'layout',
    label: 'Border width',
    placeholder: themePlaceholder('borderWidth'),
  },
  {
    key: 'radiusSm',
    group: 'layout',
    label: 'Radius small',
    placeholder: themePlaceholder('radiusSm'),
  },
  {
    key: 'radiusMd',
    group: 'layout',
    label: 'Radius medium',
    placeholder: themePlaceholder('radiusMd'),
  },
  {
    key: 'radiusLg',
    group: 'layout',
    label: 'Radius large',
    placeholder: themePlaceholder('radiusLg'),
  },
  {
    key: 'radiusItem',
    group: 'layout',
    label: 'Menu item radius',
    placeholder: themePlaceholder('radiusItem'),
  },
  {
    key: 'spacingXs',
    group: 'layout',
    label: 'Spacing XS',
    placeholder: themePlaceholder('spacingXs'),
  },
  {
    key: 'spacingSm',
    group: 'layout',
    label: 'Spacing SM',
    placeholder: themePlaceholder('spacingSm'),
  },
  {
    key: 'spacingMd',
    group: 'layout',
    label: 'Spacing MD',
    placeholder: themePlaceholder('spacingMd'),
  },
  {
    key: 'spacingLg',
    group: 'layout',
    label: 'Spacing LG',
    placeholder: themePlaceholder('spacingLg'),
  },
  {
    key: 'transitionFast',
    group: 'layout',
    label: 'Transition',
    placeholder: themePlaceholder('transitionFast'),
  },
  {
    key: 'itemCaptionOffset',
    group: 'layout',
    label: 'Item caption offset',
    placeholder: themePlaceholder('itemCaptionOffset'),
    advanced: true,
  },
  {
    key: 'menuSlotWidth',
    group: 'layout',
    label: 'Menu slot width',
    placeholder: themePlaceholder('menuSlotWidth'),
    advanced: true,
  },
  {
    key: 'searchWidth',
    group: 'layout',
    label: 'Search width',
    placeholder: themePlaceholder('searchWidth'),
    advanced: true,
  },
  {
    key: 'searchControlHeight',
    group: 'layout',
    label: 'Search control height',
    placeholder: themePlaceholder('searchControlHeight'),
    advanced: true,
  },
  {
    key: 'searchPrependPaddingRight',
    group: 'layout',
    label: 'Search icon right padding',
    placeholder: themePlaceholder('searchPrependPaddingRight'),
    advanced: true,
  },
  {
    key: 'drawerHeaderMinHeight',
    group: 'layout',
    label: 'Drawer header min height',
    placeholder: themePlaceholder('drawerHeaderMinHeight'),
    advanced: true,
  },
  {
    key: 'brandLogoSize',
    group: 'layout',
    label: 'Brand logo size',
    placeholder: themePlaceholder('brandLogoSize'),
    advanced: true,
  },
  {
    key: 'groupCaptionMinHeight',
    group: 'layout',
    label: 'Group caption min height',
    placeholder: themePlaceholder('groupCaptionMinHeight'),
    advanced: true,
  },
  {
    key: 'groupCaptionPadding',
    group: 'layout',
    label: 'Group caption padding',
    placeholder: themePlaceholder('groupCaptionPadding'),
    advanced: true,
  },
  {
    key: 'groupCaptionMiniPadding',
    group: 'layout',
    label: 'Group mini padding',
    placeholder: themePlaceholder('groupCaptionMiniPadding'),
    advanced: true,
  },
  {
    key: 'groupCaptionMiniMinWidth',
    group: 'layout',
    label: 'Group mini min width',
    placeholder: themePlaceholder('groupCaptionMiniMinWidth'),
    advanced: true,
  },
  {
    key: 'groupCaptionMiniHeight',
    group: 'layout',
    label: 'Group mini height',
    placeholder: themePlaceholder('groupCaptionMiniHeight'),
    advanced: true,
  },
  {
    key: 'groupCaptionMiniHorizontalPadding',
    group: 'layout',
    label: 'Group mini horizontal padding',
    placeholder: themePlaceholder('groupCaptionMiniHorizontalPadding'),
    advanced: true,
  },
  {
    key: 'groupCaptionMiniRadius',
    group: 'layout',
    label: 'Group mini radius',
    placeholder: themePlaceholder('groupCaptionMiniRadius'),
    advanced: true,
  },
  {
    key: 'itemMinHeight',
    group: 'layout',
    label: 'Item min height',
    placeholder: themePlaceholder('itemMinHeight'),
    advanced: true,
  },
  {
    key: 'itemIconSize',
    group: 'layout',
    label: 'Item icon size',
    placeholder: themePlaceholder('itemIconSize'),
    advanced: true,
  },
  {
    key: 'itemHoverTranslateX',
    group: 'layout',
    label: 'Item hover translate X',
    placeholder: themePlaceholder('itemHoverTranslateX'),
    advanced: true,
  },
  {
    key: 'itemActiveBorderWidth',
    group: 'layout',
    label: 'Item active border width',
    placeholder: themePlaceholder('itemActiveBorderWidth'),
    advanced: true,
  },
  {
    key: 'drawerScrollPaddingBottom',
    group: 'layout',
    label: 'Drawer scroll padding bottom',
    placeholder: themePlaceholder('drawerScrollPaddingBottom'),
    advanced: true,
  },
  {
    key: 'workspaceMaxWidth',
    group: 'layout',
    label: 'Workspace max width',
    placeholder: themePlaceholder('workspaceMaxWidth'),
  },
  {
    key: 'viewportHeight',
    group: 'layout',
    label: 'Viewport height',
    placeholder: themePlaceholder('viewportHeight'),
  },
  {
    key: 'compactBreakpoint',
    group: 'layout',
    label: 'Compact breakpoint',
    placeholder: themePlaceholder('compactBreakpoint'),
  },
  {
    key: 'compactPagePadding',
    group: 'layout',
    label: 'Compact page padding',
    placeholder: themePlaceholder('compactPagePadding'),
    advanced: true,
  },
  {
    key: 'compactWorkspaceCardPadding',
    group: 'layout',
    label: 'Compact workspace card padding',
    placeholder: themePlaceholder('compactWorkspaceCardPadding'),
    advanced: true,
  },
  {
    key: 'cmsLayoutBreakpointLg',
    group: 'layout',
    label: 'CMS layout breakpoint LG',
    placeholder: themePlaceholder('cmsLayoutBreakpointLg'),
    advanced: true,
  },
  {
    key: 'cmsLayoutBreakpointMd',
    group: 'layout',
    label: 'CMS layout breakpoint MD',
    placeholder: themePlaceholder('cmsLayoutBreakpointMd'),
    advanced: true,
  },
  {
    key: 'miniItemMarginRight',
    group: 'layout',
    label: 'Mini item margin right',
    placeholder: themePlaceholder('miniItemMarginRight'),
    advanced: true,
  },
  {
    key: 'miniItemAvatarMinWidth',
    group: 'layout',
    label: 'Mini item avatar min width',
    placeholder: themePlaceholder('miniItemAvatarMinWidth'),
    advanced: true,
  },
  {
    key: 'shellBackground',
    group: 'foundation',
    label: 'Shell background',
    isColor: true,
    placeholder: themePlaceholder('shellBackground'),
  },
  {
    key: 'pageBackground',
    group: 'foundation',
    label: 'Page background (outside card)',
    isColor: true,
    placeholder: themePlaceholder('pageBackground'),
  },
  {
    key: 'pageTextColor',
    group: 'foundation',
    label: 'Page text color',
    isColor: true,
    placeholder: themePlaceholder('pageTextColor'),
    aliases: ['searchTextColor'],
  },
  {
    key: 'drawerBackground',
    group: 'foundation',
    label: 'Sidebar background (and cards)',
    isColor: true,
    placeholder: themePlaceholder('drawerBackground'),
    aliases: ['drawerFooterBackground'],
  },
  {
    key: 'drawerFooterBackground',
    group: 'foundation',
    label: 'Surface footer background (override)',
    isColor: true,
    placeholder: themePlaceholder('drawerFooterBackground'),
    advanced: true,
  },
  {
    key: 'drawerTextColor',
    group: 'foundation',
    label: 'Sidebar text color',
    isColor: true,
    placeholder: themePlaceholder('drawerTextColor'),
    aliases: ['itemTextColor', 'itemIconColor', 'brandSubtitleColor', 'groupCaptionColor'],
  },
  {
    key: 'dividerColor',
    group: 'foundation',
    label: 'Divider color',
    isColor: true,
    placeholder: themePlaceholder('dividerColor'),
    aliases: ['titleSeparatorColor'],
  },
  {
    key: 'itemActiveColor',
    group: 'navigation',
    label: 'Primary accent',
    isColor: true,
    placeholder: themePlaceholder('itemActiveColor'),
    aliases: ['itemHoverColor', 'itemIconHoverColor', 'focusColor', 'titleAppColor', 'brandTitleColor'],
  },
  {
    key: 'itemTextColor',
    group: 'navigation',
    label: 'Item text color (override)',
    isColor: true,
    placeholder: themePlaceholder('itemTextColor'),
    advanced: true,
  },
  {
    key: 'itemIconColor',
    group: 'navigation',
    label: 'Item icon color (override)',
    isColor: true,
    placeholder: themePlaceholder('itemIconColor'),
    advanced: true,
  },
  {
    key: 'itemHoverBackground',
    group: 'navigation',
    label: 'Sidebar item hover background',
    isColor: true,
    placeholder: themePlaceholder('itemHoverBackground'),
  },
  {
    key: 'itemHoverColor',
    group: 'navigation',
    label: 'Item hover text color (override)',
    isColor: true,
    placeholder: themePlaceholder('itemHoverColor'),
    advanced: true,
  },
  {
    key: 'itemIconHoverColor',
    group: 'navigation',
    label: 'Item hover icon color (override)',
    isColor: true,
    placeholder: themePlaceholder('itemIconHoverColor'),
    advanced: true,
  },
  {
    key: 'itemActiveBackground',
    group: 'navigation',
    label: 'Active background',
    isColor: true,
    placeholder: themePlaceholder('itemActiveBackground'),
  },
  {
    key: 'focusColor',
    group: 'navigation',
    label: 'Focus ring color (override)',
    isColor: true,
    placeholder: themePlaceholder('focusColor'),
    advanced: true,
  },
  {
    key: 'brandTitleColor',
    group: 'navigation',
    label: 'Brand title color (override)',
    isColor: true,
    placeholder: themePlaceholder('brandTitleColor'),
    advanced: true,
  },
  {
    key: 'brandSubtitleColor',
    group: 'navigation',
    label: 'Brand subtitle color (override)',
    isColor: true,
    placeholder: themePlaceholder('brandSubtitleColor'),
    advanced: true,
  },
  {
    key: 'groupCaptionColor',
    group: 'navigation',
    label: 'Group caption color (override)',
    isColor: true,
    placeholder: themePlaceholder('groupCaptionColor'),
    advanced: true,
  },
  {
    key: 'groupSeparatorOpacity',
    group: 'navigation',
    label: 'Group separator opacity',
    placeholder: themePlaceholder('groupSeparatorOpacity'),
    advanced: true,
  },
  {
    key: 'groupCaptionMiniBackground',
    group: 'navigation',
    label: 'Group mini background',
    isColor: true,
    placeholder: themePlaceholder('groupCaptionMiniBackground'),
  },
  {
    key: 'headerBackground',
    group: 'header',
    label: 'Header background',
    isColor: true,
    placeholder: themePlaceholder('headerBackground'),
  },
  {
    key: 'headerTextColor',
    group: 'header',
    label: 'Header text color',
    isColor: true,
    placeholder: themePlaceholder('headerTextColor'),
    aliases: ['toolbarButtonColor', 'titleTextColor', 'searchIconColor'],
  },
  {
    key: 'toolbarButtonColor',
    group: 'header',
    label: 'Toolbar icon color (override)',
    isColor: true,
    placeholder: themePlaceholder('toolbarButtonColor'),
    advanced: true,
  },
  {
    key: 'titleAppColor',
    group: 'header',
    label: 'App title color (override)',
    isColor: true,
    placeholder: themePlaceholder('titleAppColor'),
    advanced: true,
  },
  {
    key: 'titleTextColor',
    group: 'header',
    label: 'Module title color (override)',
    isColor: true,
    placeholder: themePlaceholder('titleTextColor'),
    advanced: true,
  },
  {
    key: 'titleSeparatorColor',
    group: 'header',
    label: 'Title separator color (override)',
    isColor: true,
    placeholder: themePlaceholder('titleSeparatorColor'),
    advanced: true,
  },
  {
    key: 'titleSeparatorSize',
    group: 'header',
    label: 'Title separator size',
    placeholder: themePlaceholder('titleSeparatorSize'),
  },
  {
    key: 'searchBackground',
    group: 'header',
    label: 'Search background',
    isColor: true,
    placeholder: themePlaceholder('searchBackground'),
  },
  {
    key: 'searchTextColor',
    group: 'header',
    label: 'Search text color (override)',
    isColor: true,
    placeholder: themePlaceholder('searchTextColor'),
    advanced: true,
  },
  {
    key: 'searchIconColor',
    group: 'header',
    label: 'Search icon color (override)',
    isColor: true,
    placeholder: themePlaceholder('searchIconColor'),
    advanced: true,
  },
  {
    key: 'searchBorder',
    group: 'header',
    label: 'Search border',
    isColor: true,
    placeholder: themePlaceholder('searchBorder'),
  },
  {
    key: 'searchBorderHover',
    group: 'header',
    label: 'Search border hover',
    isColor: true,
    placeholder: themePlaceholder('searchBorderHover'),
  },
  {
    key: 'headerShadow',
    group: 'header',
    label: 'Header shadow',
    placeholder: themePlaceholder('headerShadow'),
  },
  {
    key: 'headerZIndex',
    group: 'header',
    label: 'Header z-index',
    placeholder: themePlaceholder('headerZIndex'),
    advanced: true,
  },
  {
    key: 'headerBlur',
    group: 'header',
    label: 'Header blur',
    placeholder: themePlaceholder('headerBlur'),
  },
  {
    key: 'drawerShadow',
    group: 'header',
    label: 'Drawer shadow',
    placeholder: themePlaceholder('drawerShadow'),
  },
  {
    key: 'drawerZIndex',
    group: 'header',
    label: 'Drawer z-index',
    placeholder: themePlaceholder('drawerZIndex'),
    advanced: true,
  },
  {
    key: 'drawerFooterShadow',
    group: 'header',
    label: 'Drawer footer shadow',
    placeholder: themePlaceholder('drawerFooterShadow'),
  },
  {
    key: 'actionBackground',
    group: 'header',
    label: 'Header actions background',
    isColor: true,
    placeholder: themePlaceholder('actionBackground'),
  },
  {
    key: 'actionHoverBackground',
    group: 'header',
    label: 'Header actions hover background (hover only)',
    isColor: true,
    placeholder: themePlaceholder('actionHoverBackground'),
  },
  {
    key: 'actionHoverTranslateY',
    group: 'header',
    label: 'Header actions hover translate Y',
    placeholder: themePlaceholder('actionHoverTranslateY'),
  },
  {
    key: 'userAvatarSize',
    group: 'header',
    label: 'User avatar size',
    placeholder: themePlaceholder('userAvatarSize'),
  },
  {
    key: 'notificationSuccessColor',
    group: 'notifications',
    label: 'Success color',
    isColor: true,
    placeholder: themePlaceholder('notificationSuccessColor'),
  },
  {
    key: 'notificationSuccessTextColor',
    group: 'notifications',
    label: 'Success text color',
    isColor: true,
    placeholder: themePlaceholder('notificationSuccessTextColor'),
  },
  {
    key: 'notificationWarningColor',
    group: 'notifications',
    label: 'Warning color',
    isColor: true,
    placeholder: themePlaceholder('notificationWarningColor'),
  },
  {
    key: 'notificationWarningTextColor',
    group: 'notifications',
    label: 'Warning text color',
    isColor: true,
    placeholder: themePlaceholder('notificationWarningTextColor'),
  },
  {
    key: 'notificationErrorColor',
    group: 'notifications',
    label: 'Error color',
    isColor: true,
    placeholder: themePlaceholder('notificationErrorColor'),
  },
  {
    key: 'notificationErrorTextColor',
    group: 'notifications',
    label: 'Error text color',
    isColor: true,
    placeholder: themePlaceholder('notificationErrorTextColor'),
  },
  {
    key: 'notificationInfoColor',
    group: 'notifications',
    label: 'Info color',
    isColor: true,
    placeholder: themePlaceholder('notificationInfoColor'),
  },
  {
    key: 'notificationInfoTextColor',
    group: 'notifications',
    label: 'Info text color',
    isColor: true,
    placeholder: themePlaceholder('notificationInfoTextColor'),
  },
  {
    key: 'notificationBadgeColor',
    group: 'notifications',
    label: 'Notification badge color',
    isColor: true,
    placeholder: themePlaceholder('notificationBadgeColor'),
  },
  {
    key: 'notificationBadgeTextColor',
    group: 'notifications',
    label: 'Notification badge text color',
    isColor: true,
    placeholder: themePlaceholder('notificationBadgeTextColor'),
  },
  {
    key: 'notificationIconColor',
    group: 'notifications',
    label: 'Notification bell icon color',
    isColor: true,
    placeholder: themePlaceholder('notificationIconColor'),
  },
  {
    key: 'badgePulseScale',
    group: 'notifications',
    label: 'Badge pulse scale',
    placeholder: themePlaceholder('badgePulseScale'),
    advanced: true,
  },
  {
    key: 'landingFontSize2xs',
    group: 'landing',
    label: 'Font size 2xs',
    placeholder: themePlaceholder('landingFontSize2xs'),
  },
  {
    key: 'landingFontSizeXsTight',
    group: 'landing',
    label: 'Font size xs tight',
    placeholder: themePlaceholder('landingFontSizeXsTight'),
  },
  {
    key: 'landingFontSizeSmTight',
    group: 'landing',
    label: 'Font size sm tight',
    placeholder: themePlaceholder('landingFontSizeSmTight'),
  },
  {
    key: 'landingFontSizeSmPlus',
    group: 'landing',
    label: 'Font size sm plus',
    placeholder: themePlaceholder('landingFontSizeSmPlus'),
  },
  {
    key: 'landingFontSizeMdPlus',
    group: 'landing',
    label: 'Font size md plus',
    placeholder: themePlaceholder('landingFontSizeMdPlus'),
  },
  {
    key: 'landingFontSizeLgPlus',
    group: 'landing',
    label: 'Font size lg plus',
    placeholder: themePlaceholder('landingFontSizeLgPlus'),
  },
  {
    key: 'landingFontSizeXlPlus',
    group: 'landing',
    label: 'Font size xl plus',
    placeholder: themePlaceholder('landingFontSizeXlPlus'),
  },
  {
    key: 'landingFontSizeDisplaySm',
    group: 'landing',
    label: 'Display font size sm',
    placeholder: themePlaceholder('landingFontSizeDisplaySm'),
  },
  {
    key: 'landingFontSizeDisplayMd',
    group: 'landing',
    label: 'Display font size md',
    placeholder: themePlaceholder('landingFontSizeDisplayMd'),
  },
  {
    key: 'landingFontSizeDisplayLg',
    group: 'landing',
    label: 'Display font size lg',
    placeholder: themePlaceholder('landingFontSizeDisplayLg'),
  },
  {
    key: 'landingFontSizeDisplayXl',
    group: 'landing',
    label: 'Display font size xl',
    placeholder: themePlaceholder('landingFontSizeDisplayXl'),
  },
  {
    key: 'landingFontSizeDisplay2xl',
    group: 'landing',
    label: 'Display font size 2xl',
    placeholder: themePlaceholder('landingFontSizeDisplay2xl'),
  },
  {
    key: 'landingFontSizeDisplay3xl',
    group: 'landing',
    label: 'Display font size 3xl',
    placeholder: themePlaceholder('landingFontSizeDisplay3xl'),
  },
  {
    key: 'landingSpaceXs',
    group: 'landing',
    label: 'Spacing xs',
    placeholder: themePlaceholder('landingSpaceXs'),
  },
  {
    key: 'landingSpaceSm',
    group: 'landing',
    label: 'Spacing sm',
    placeholder: themePlaceholder('landingSpaceSm'),
  },
  {
    key: 'landingSpaceMd',
    group: 'landing',
    label: 'Spacing md',
    placeholder: themePlaceholder('landingSpaceMd'),
  },
  {
    key: 'landingSpaceLg',
    group: 'landing',
    label: 'Spacing lg',
    placeholder: themePlaceholder('landingSpaceLg'),
  },
  {
    key: 'landingSpaceXl',
    group: 'landing',
    label: 'Spacing xl',
    placeholder: themePlaceholder('landingSpaceXl'),
  },
  {
    key: 'landingSpace2xl',
    group: 'landing',
    label: 'Spacing 2xl',
    placeholder: themePlaceholder('landingSpace2xl'),
  },
  {
    key: 'landingSpace3xl',
    group: 'landing',
    label: 'Spacing 3xl',
    placeholder: themePlaceholder('landingSpace3xl'),
  },
  {
    key: 'landingRadiusXs',
    group: 'landing',
    label: 'Radius xs',
    placeholder: themePlaceholder('landingRadiusXs'),
  },
  {
    key: 'landingRadiusSm',
    group: 'landing',
    label: 'Radius sm',
    placeholder: themePlaceholder('landingRadiusSm'),
  },
  {
    key: 'landingRadiusMd',
    group: 'landing',
    label: 'Radius md',
    placeholder: themePlaceholder('landingRadiusMd'),
  },
  {
    key: 'landingRadiusLg',
    group: 'landing',
    label: 'Radius lg',
    placeholder: themePlaceholder('landingRadiusLg'),
  },
  {
    key: 'landingRadiusXl',
    group: 'landing',
    label: 'Radius xl',
    placeholder: themePlaceholder('landingRadiusXl'),
    advanced: true,
  },
  {
    key: 'landingRadiusRound',
    group: 'landing',
    label: 'Radius round',
    placeholder: themePlaceholder('landingRadiusRound'),
    advanced: true,
  },
  {
    key: 'landingRadiusPill',
    group: 'landing',
    label: 'Radius pill',
    placeholder: themePlaceholder('landingRadiusPill'),
  },
  {
    key: 'landingShadowHeader',
    group: 'landing',
    label: 'Shadow header',
    placeholder: themePlaceholder('landingShadowHeader'),
  },
  {
    key: 'landingShadowEmphasis',
    group: 'landing',
    label: 'Shadow emphasis',
    placeholder: themePlaceholder('landingShadowEmphasis'),
  },
  {
    key: 'landingShadowTopbarScrolled',
    group: 'landing',
    label: 'Shadow topbar scrolled',
    placeholder: themePlaceholder('landingShadowTopbarScrolled'),
  },
  {
    key: 'landingShadowCodeFrame',
    group: 'landing',
    label: 'Shadow code frame',
    placeholder: themePlaceholder('landingShadowCodeFrame'),
  },
  {
    key: 'landingShadowCodeFrameHover',
    group: 'landing',
    label: 'Shadow code frame hover',
    placeholder: themePlaceholder('landingShadowCodeFrameHover'),
  },
  {
    key: 'landingEasingStandard',
    group: 'landing',
    label: 'Easing standard',
    placeholder: themePlaceholder('landingEasingStandard'),
  },
  {
    key: 'landingTransitionFast',
    group: 'landing',
    label: 'Transition fast',
    placeholder: themePlaceholder('landingTransitionFast'),
  },
  {
    key: 'landingTransitionNormal',
    group: 'landing',
    label: 'Transition normal',
    placeholder: themePlaceholder('landingTransitionNormal'),
  },
  {
    key: 'landingTransitionSlow',
    group: 'landing',
    label: 'Transition slow',
    placeholder: themePlaceholder('landingTransitionSlow'),
  },
  {
    key: 'landingRevealDistance',
    group: 'landing',
    label: 'Reveal distance',
    placeholder: themePlaceholder('landingRevealDistance'),
  },
  {
    key: 'landingRevealDuration',
    group: 'landing',
    label: 'Reveal duration',
    placeholder: themePlaceholder('landingRevealDuration'),
  },
  {
    key: 'landingRevealThreshold',
    group: 'landing',
    label: 'Reveal threshold',
    placeholder: themePlaceholder('landingRevealThreshold'),
    advanced: true,
  },
  {
    key: 'landingRevealRootMargin',
    group: 'landing',
    label: 'Reveal root margin',
    placeholder: themePlaceholder('landingRevealRootMargin'),
    advanced: true,
  },
  {
    key: 'landingImageHoverZoomScale',
    group: 'landing',
    label: 'Image hover zoom scale',
    placeholder: themePlaceholder('landingImageHoverZoomScale'),
  },
  {
    key: 'landingImageHoverZoomDuration',
    group: 'landing',
    label: 'Image hover zoom duration',
    placeholder: themePlaceholder('landingImageHoverZoomDuration'),
  },
  {
    key: 'landingImageHoverZoomEasing',
    group: 'landing',
    label: 'Image hover zoom easing',
    placeholder: themePlaceholder('landingImageHoverZoomEasing'),
    advanced: true,
  },
  {
    key: 'landingComponentCardHoverScale',
    group: 'landing',
    label: 'Card hover scale',
    placeholder: themePlaceholder('landingComponentCardHoverScale'),
  },
  {
    key: 'landingComponentCardHoverLift',
    group: 'landing',
    label: 'Card hover lift',
    placeholder: themePlaceholder('landingComponentCardHoverLift'),
  },
  {
    key: 'landingComponentCardAccentWidth',
    group: 'landing',
    label: 'Card accent width',
    placeholder: themePlaceholder('landingComponentCardAccentWidth'),
  },
  {
    key: 'landingComponentCardAccentOpacity',
    group: 'landing',
    label: 'Card accent opacity',
    placeholder: themePlaceholder('landingComponentCardAccentOpacity'),
  },
  {
    key: 'landingComponentCardAccentEasing',
    group: 'landing',
    label: 'Card accent easing',
    placeholder: themePlaceholder('landingComponentCardAccentEasing'),
    advanced: true,
  },
  {
    key: 'landingCodeBlockHoverScale',
    group: 'landing',
    label: 'Code block hover scale',
    placeholder: themePlaceholder('landingCodeBlockHoverScale'),
  },
  {
    key: 'landingTopbarEnterDuration',
    group: 'landing',
    label: 'Topbar enter duration',
    placeholder: themePlaceholder('landingTopbarEnterDuration'),
  },
  {
    key: 'landingTopbarEnterOffset',
    group: 'landing',
    label: 'Topbar enter offset',
    placeholder: themePlaceholder('landingTopbarEnterOffset'),
  },
  {
    key: 'landingPulseDotDuration',
    group: 'landing',
    label: 'Pulse dot duration',
    placeholder: themePlaceholder('landingPulseDotDuration'),
  },
  {
    key: 'landingPulseDotEasing',
    group: 'landing',
    label: 'Pulse dot easing',
    placeholder: themePlaceholder('landingPulseDotEasing'),
    advanced: true,
  },
  {
    key: 'landingFloatDuration',
    group: 'landing',
    label: 'Float duration',
    placeholder: themePlaceholder('landingFloatDuration'),
  },
  {
    key: 'landingFloatEasing',
    group: 'landing',
    label: 'Float easing',
    placeholder: themePlaceholder('landingFloatEasing'),
    advanced: true,
  },
  {
    key: 'landingFloatDelaySm',
    group: 'landing',
    label: 'Float delay sm',
    placeholder: themePlaceholder('landingFloatDelaySm'),
  },
  {
    key: 'landingFloatDelayMd',
    group: 'landing',
    label: 'Float delay md',
    placeholder: themePlaceholder('landingFloatDelayMd'),
  },
  {
    key: 'landingFloatDelayLg',
    group: 'landing',
    label: 'Float delay lg',
    placeholder: themePlaceholder('landingFloatDelayLg'),
  },
  {
    key: 'landingFloatDelayXl',
    group: 'landing',
    label: 'Float delay xl',
    placeholder: themePlaceholder('landingFloatDelayXl'),
  },
  {
    key: 'landingLayoutContainIntrinsicSize',
    group: 'landing',
    label: 'Contain intrinsic size',
    placeholder: themePlaceholder('landingLayoutContainIntrinsicSize'),
    advanced: true,
  },
  {
    key: 'landingLayoutContainerMaxWidth',
    group: 'landing',
    label: 'Container max width',
    placeholder: themePlaceholder('landingLayoutContainerMaxWidth'),
  },
  {
    key: 'landingLayoutTopbarBackdropBlur',
    group: 'landing',
    label: 'Topbar backdrop blur',
    placeholder: themePlaceholder('landingLayoutTopbarBackdropBlur'),
  },
  {
    key: 'landingLayoutTopbarActionSize',
    group: 'landing',
    label: 'Topbar action size',
    placeholder: themePlaceholder('landingLayoutTopbarActionSize'),
  },
  {
    key: 'landingLayoutTopbarIndicatorOffset',
    group: 'landing',
    label: 'Topbar indicator offset',
    placeholder: themePlaceholder('landingLayoutTopbarIndicatorOffset'),
    advanced: true,
  },
  {
    key: 'landingLayoutTopbarIndicatorHeight',
    group: 'landing',
    label: 'Topbar indicator height',
    placeholder: themePlaceholder('landingLayoutTopbarIndicatorHeight'),
    advanced: true,
  },
  {
    key: 'landingLayoutButtonGap',
    group: 'landing',
    label: 'Button gap',
    placeholder: themePlaceholder('landingLayoutButtonGap'),
  },
  {
    key: 'landingLayoutButtonPadding',
    group: 'landing',
    label: 'Button padding',
    placeholder: themePlaceholder('landingLayoutButtonPadding'),
  },
  {
    key: 'landingLayoutButtonHoverLift',
    group: 'landing',
    label: 'Button hover lift',
    placeholder: themePlaceholder('landingLayoutButtonHoverLift'),
    advanced: true,
  },
  {
    key: 'landingLayoutHeroPaddingTop',
    group: 'landing',
    label: 'Hero padding top',
    placeholder: themePlaceholder('landingLayoutHeroPaddingTop'),
  },
  {
    key: 'landingLayoutHeroPaddingBottom',
    group: 'landing',
    label: 'Hero padding bottom',
    placeholder: themePlaceholder('landingLayoutHeroPaddingBottom'),
  },
  {
    key: 'landingLayoutHeroPaddingTopMobile',
    group: 'landing',
    label: 'Hero padding top mobile',
    placeholder: themePlaceholder('landingLayoutHeroPaddingTopMobile'),
    advanced: true,
  },
  {
    key: 'landingLayoutHeroPaddingBottomMobile',
    group: 'landing',
    label: 'Hero padding bottom mobile',
    placeholder: themePlaceholder('landingLayoutHeroPaddingBottomMobile'),
    advanced: true,
  },
  {
    key: 'landingLayoutHeroOrbSize',
    group: 'landing',
    label: 'Hero orb size',
    placeholder: themePlaceholder('landingLayoutHeroOrbSize'),
    advanced: true,
  },
  {
    key: 'landingLayoutHeroTitleClamp',
    group: 'landing',
    label: 'Hero title clamp',
    placeholder: themePlaceholder('landingLayoutHeroTitleClamp'),
    advanced: true,
  },
  {
    key: 'landingLayoutSectionTitleClamp',
    group: 'landing',
    label: 'Section title clamp',
    placeholder: themePlaceholder('landingLayoutSectionTitleClamp'),
    advanced: true,
  },
  {
    key: 'landingLayoutHeroTextMaxWidth',
    group: 'landing',
    label: 'Hero text max width',
    placeholder: themePlaceholder('landingLayoutHeroTextMaxWidth'),
    advanced: true,
  },
  {
    key: 'landingLayoutHeroVisualMaxWidth',
    group: 'landing',
    label: 'Hero visual max width',
    placeholder: themePlaceholder('landingLayoutHeroVisualMaxWidth'),
    advanced: true,
  },
  {
    key: 'landingLayoutSectionHeaderMaxWidth',
    group: 'landing',
    label: 'Section header max width',
    placeholder: themePlaceholder('landingLayoutSectionHeaderMaxWidth'),
    advanced: true,
  },
  {
    key: 'landingLayoutMediaMaxWidth',
    group: 'landing',
    label: 'Media max width',
    placeholder: themePlaceholder('landingLayoutMediaMaxWidth'),
    advanced: true,
  },
  {
    key: 'landingLayoutComposablesVisualPaddingTop',
    group: 'landing',
    label: 'Composables visual top padding',
    placeholder: themePlaceholder('landingLayoutComposablesVisualPaddingTop'),
    advanced: true,
  },
  {
    key: 'landingLayoutChartHeight',
    group: 'landing',
    label: 'Chart height',
    placeholder: themePlaceholder('landingLayoutChartHeight'),
    advanced: true,
  },
  {
    key: 'landingLayoutChartLabelOffset',
    group: 'landing',
    label: 'Chart label offset',
    placeholder: themePlaceholder('landingLayoutChartLabelOffset'),
    advanced: true,
  },
  {
    key: 'landingLayoutDrawerWidth',
    group: 'landing',
    label: 'Drawer width',
    placeholder: themePlaceholder('landingLayoutDrawerWidth'),
  },
  {
    key: 'landingLayoutFooterDescriptionMaxWidth',
    group: 'landing',
    label: 'Footer description max width',
    placeholder: themePlaceholder('landingLayoutFooterDescriptionMaxWidth'),
    advanced: true,
  },
  {
    key: 'landingLayoutHeroVisualTabletMaxWidth',
    group: 'landing',
    label: 'Hero visual tablet max width',
    placeholder: themePlaceholder('landingLayoutHeroVisualTabletMaxWidth'),
    advanced: true,
  },
  {
    key: 'landingLayoutCompactGridMaxWidth',
    group: 'landing',
    label: 'Compact grid max width',
    placeholder: themePlaceholder('landingLayoutCompactGridMaxWidth'),
    advanced: true,
  },
  {
    key: 'landingLayoutStatMinWidthMobile',
    group: 'landing',
    label: 'Stat min width mobile',
    placeholder: themePlaceholder('landingLayoutStatMinWidthMobile'),
    advanced: true,
  },
  {
    key: 'landingLayoutMobileMenuButtonPadding',
    group: 'landing',
    label: 'Mobile menu button padding',
    placeholder: themePlaceholder('landingLayoutMobileMenuButtonPadding'),
    advanced: true,
  },
  {
    key: 'landingLayoutFloatingButtonRight',
    group: 'landing',
    label: 'Floating button right',
    placeholder: themePlaceholder('landingLayoutFloatingButtonRight'),
    advanced: true,
  },
  {
    key: 'landingLayoutFloatingButtonBottom',
    group: 'landing',
    label: 'Floating button bottom',
    placeholder: themePlaceholder('landingLayoutFloatingButtonBottom'),
    advanced: true,
  },
  {
    key: 'landingLayoutFloatingButtonPaddingY',
    group: 'landing',
    label: 'Floating button padding Y',
    placeholder: themePlaceholder('landingLayoutFloatingButtonPaddingY'),
    advanced: true,
  },
  {
    key: 'landingLayoutFloatingButtonPaddingX',
    group: 'landing',
    label: 'Floating button padding X',
    placeholder: themePlaceholder('landingLayoutFloatingButtonPaddingX'),
    advanced: true,
  },
  {
    key: 'landingLayoutPulseDotSize',
    group: 'landing',
    label: 'Pulse dot size',
    placeholder: themePlaceholder('landingLayoutPulseDotSize'),
    advanced: true,
  },
  {
    key: 'landingLayoutCodeDotSize',
    group: 'landing',
    label: 'Code dot size',
    placeholder: themePlaceholder('landingLayoutCodeDotSize'),
    advanced: true,
  },
  {
    key: 'landingLayoutMetricIconSize',
    group: 'landing',
    label: 'Metric icon size',
    placeholder: themePlaceholder('landingLayoutMetricIconSize'),
    advanced: true,
  },
  {
    key: 'landingLayoutMiniIconSize',
    group: 'landing',
    label: 'Mini icon size',
    placeholder: themePlaceholder('landingLayoutMiniIconSize'),
    advanced: true,
  },
  {
    key: 'landingLayoutThemeBadgeSize',
    group: 'landing',
    label: 'Theme badge size',
    placeholder: themePlaceholder('landingLayoutThemeBadgeSize'),
    advanced: true,
  },
  {
    key: 'landingLayoutFloatAmplitude',
    group: 'landing',
    label: 'Float amplitude',
    placeholder: themePlaceholder('landingLayoutFloatAmplitude'),
    advanced: true,
  },
  {
    key: 'landingLayoutBodyLineHeight',
    group: 'landing',
    label: 'Body line height',
    placeholder: themePlaceholder('landingLayoutBodyLineHeight'),
    advanced: true,
  },
  {
    key: 'landingLayoutBorderThin',
    group: 'landing',
    label: 'Thin border width',
    placeholder: themePlaceholder('landingLayoutBorderThin'),
    advanced: true,
  },
  {
    key: 'landingLayoutHeaderZIndex',
    group: 'landing',
    label: 'Header z-index',
    placeholder: themePlaceholder('landingLayoutHeaderZIndex'),
    advanced: true,
  },
  {
    key: 'landingLayoutDrawerZIndex',
    group: 'landing',
    label: 'Drawer z-index',
    placeholder: themePlaceholder('landingLayoutDrawerZIndex'),
    advanced: true,
  },
  {
    key: 'landingLayoutOverlayZIndex',
    group: 'landing',
    label: 'Drawer overlay z-index',
    placeholder: themePlaceholder('landingLayoutOverlayZIndex'),
    advanced: true,
  },
  {
    key: 'landingLayoutFloatingButtonZIndex',
    group: 'landing',
    label: 'Floating button z-index',
    placeholder: themePlaceholder('landingLayoutFloatingButtonZIndex'),
    advanced: true,
  },
  {
    key: 'landingLayoutHeroOrbTop',
    group: 'landing',
    label: 'Hero orb top offset',
    placeholder: themePlaceholder('landingLayoutHeroOrbTop'),
    advanced: true,
  },
  {
    key: 'landingLayoutHeroOrbRight',
    group: 'landing',
    label: 'Hero orb right offset',
    placeholder: themePlaceholder('landingLayoutHeroOrbRight'),
    advanced: true,
  },
  {
    key: 'landingLayoutHeroBadgeLetterSpacing',
    group: 'landing',
    label: 'Hero badge letter spacing',
    placeholder: themePlaceholder('landingLayoutHeroBadgeLetterSpacing'),
    advanced: true,
  },
  {
    key: 'landingLayoutSectionBadgeLetterSpacing',
    group: 'landing',
    label: 'Section badge letter spacing',
    placeholder: themePlaceholder('landingLayoutSectionBadgeLetterSpacing'),
    advanced: true,
  },
  {
    key: 'landingLayoutNavLineHeight',
    group: 'landing',
    label: 'Navigation line height',
    placeholder: themePlaceholder('landingLayoutNavLineHeight'),
    advanced: true,
  },
  {
    key: 'landingLayoutHeroTitleLineHeight',
    group: 'landing',
    label: 'Hero title line height',
    placeholder: themePlaceholder('landingLayoutHeroTitleLineHeight'),
    advanced: true,
  },
  {
    key: 'landingLayoutFeatureTextLineHeight',
    group: 'landing',
    label: 'Feature text line height',
    placeholder: themePlaceholder('landingLayoutFeatureTextLineHeight'),
    advanced: true,
  },
  {
    key: 'landingLayoutCtaSubtitleLineHeight',
    group: 'landing',
    label: 'CTA subtitle line height',
    placeholder: themePlaceholder('landingLayoutCtaSubtitleLineHeight'),
    advanced: true,
  },
  {
    key: 'landingLayoutCodeLineHeight',
    group: 'landing',
    label: 'Code block line height',
    placeholder: themePlaceholder('landingLayoutCodeLineHeight'),
    advanced: true,
  },
  {
    key: 'landingLayoutFooterDescriptionLineHeight',
    group: 'landing',
    label: 'Footer description line height',
    placeholder: themePlaceholder('landingLayoutFooterDescriptionLineHeight'),
    advanced: true,
  },
  {
    key: 'landingLayoutFooterHeadingLineHeight',
    group: 'landing',
    label: 'Footer heading line height',
    placeholder: themePlaceholder('landingLayoutFooterHeadingLineHeight'),
    advanced: true,
  },
  {
    key: 'landingLayoutFooterLinkLineHeight',
    group: 'landing',
    label: 'Footer link line height',
    placeholder: themePlaceholder('landingLayoutFooterLinkLineHeight'),
    advanced: true,
  },
  {
    key: 'landingLayoutFooterLinkTitleLetterSpacing',
    group: 'landing',
    label: 'Footer link title letter spacing',
    placeholder: themePlaceholder('landingLayoutFooterLinkTitleLetterSpacing'),
    advanced: true,
  },
  {
    key: 'landingLayoutFloatingButtonLetterSpacing',
    group: 'landing',
    label: 'Floating button letter spacing',
    placeholder: themePlaceholder('landingLayoutFloatingButtonLetterSpacing'),
    advanced: true,
  },
  {
    key: 'landingLayoutThemeBadgeHoverScale',
    group: 'landing',
    label: 'Theme badge hover scale',
    placeholder: themePlaceholder('landingLayoutThemeBadgeHoverScale'),
    advanced: true,
  },
  {
    key: 'landingLayoutChartBarHoverOpacity',
    group: 'landing',
    label: 'Chart bar hover opacity',
    placeholder: themePlaceholder('landingLayoutChartBarHoverOpacity'),
    advanced: true,
  },
  {
    key: 'landingLayoutDrawerShadow',
    group: 'landing',
    label: 'Drawer shadow',
    placeholder: themePlaceholder('landingLayoutDrawerShadow'),
    advanced: true,
  },
  {
    key: 'landingBreakpointLg',
    group: 'landing',
    label: 'Breakpoint large (px)',
    placeholder: themePlaceholder('landingBreakpointLg'),
    advanced: true,
  },
  {
    key: 'landingBreakpointMd',
    group: 'landing',
    label: 'Breakpoint medium (px)',
    placeholder: themePlaceholder('landingBreakpointMd'),
    advanced: true,
  },
  {
    key: 'landingBreakpointSm',
    group: 'landing',
    label: 'Breakpoint small (px)',
    placeholder: themePlaceholder('landingBreakpointSm'),
    advanced: true,
  },
  {
    key: 'landingBrandPrimary',
    group: 'landing',
    label: 'Landing brand primary',
    isColor: true,
    placeholder: themePlaceholder('landingBrandPrimary'),
  },
  {
    key: 'landingBrandPrimaryDark',
    group: 'landing',
    label: 'Landing brand primary dark',
    isColor: true,
    placeholder: themePlaceholder('landingBrandPrimaryDark'),
  },
  {
    key: 'landingBrandPrimaryLight',
    group: 'landing',
    label: 'Landing brand primary light',
    isColor: true,
    placeholder: themePlaceholder('landingBrandPrimaryLight'),
  },
  {
    key: 'landingBrandSecondary',
    group: 'landing',
    label: 'Landing brand secondary',
    isColor: true,
    placeholder: themePlaceholder('landingBrandSecondary'),
  },
  {
    key: 'landingGray900',
    group: 'landing',
    label: 'Landing gray 900',
    isColor: true,
    placeholder: themePlaceholder('landingGray900'),
  },
  {
    key: 'landingGray800',
    group: 'landing',
    label: 'Landing gray 800',
    isColor: true,
    placeholder: themePlaceholder('landingGray800'),
  },
  {
    key: 'landingGray700',
    group: 'landing',
    label: 'Landing gray 700',
    isColor: true,
    placeholder: themePlaceholder('landingGray700'),
  },
  {
    key: 'landingGray600',
    group: 'landing',
    label: 'Landing gray 600',
    isColor: true,
    placeholder: themePlaceholder('landingGray600'),
  },
  {
    key: 'landingGray500',
    group: 'landing',
    label: 'Landing gray 500',
    isColor: true,
    placeholder: themePlaceholder('landingGray500'),
  },
  {
    key: 'landingGray400',
    group: 'landing',
    label: 'Landing gray 400',
    isColor: true,
    placeholder: themePlaceholder('landingGray400'),
  },
  {
    key: 'landingGray300',
    group: 'landing',
    label: 'Landing gray 300',
    isColor: true,
    placeholder: themePlaceholder('landingGray300'),
  },
  {
    key: 'landingGray200',
    group: 'landing',
    label: 'Landing gray 200',
    isColor: true,
    placeholder: themePlaceholder('landingGray200'),
  },
  {
    key: 'landingGray100',
    group: 'landing',
    label: 'Landing gray 100',
    isColor: true,
    placeholder: themePlaceholder('landingGray100'),
  },
  {
    key: 'landingGray50',
    group: 'landing',
    label: 'Landing gray 50',
    isColor: true,
    placeholder: themePlaceholder('landingGray50'),
  },
  {
    key: 'landingWhite',
    group: 'landing',
    label: 'Landing white',
    isColor: true,
    placeholder: themePlaceholder('landingWhite'),
  },
  {
    key: 'landingAbsoluteWhite',
    group: 'landing',
    label: 'Landing absolute white',
    isColor: true,
    placeholder: themePlaceholder('landingAbsoluteWhite'),
    advanced: true,
  },
  {
    key: 'landingBlack',
    group: 'landing',
    label: 'Landing black',
    isColor: true,
    placeholder: themePlaceholder('landingBlack'),
    advanced: true,
  },
  {
    key: 'landingSectionBgPrimary',
    group: 'landing',
    label: 'Section background primary',
    isColor: true,
    placeholder: themePlaceholder('landingSectionBgPrimary'),
  },
  {
    key: 'landingSectionBgSecondary',
    group: 'landing',
    label: 'Section background secondary',
    isColor: true,
    placeholder: themePlaceholder('landingSectionBgSecondary'),
  },
  {
    key: 'landingSectionBgDark',
    group: 'landing',
    label: 'Section background dark',
    isColor: true,
    placeholder: themePlaceholder('landingSectionBgDark'),
  },
  {
    key: 'landingSectionBgPrimaryDark',
    group: 'landing',
    label: 'Section background primary dark',
    isColor: true,
    placeholder: themePlaceholder('landingSectionBgPrimaryDark'),
    advanced: true,
  },
  {
    key: 'landingSectionBgSecondaryDark',
    group: 'landing',
    label: 'Section background secondary dark',
    isColor: true,
    placeholder: themePlaceholder('landingSectionBgSecondaryDark'),
    advanced: true,
  },
  {
    key: 'landingSectionBgDarkDark',
    group: 'landing',
    label: 'Section background deep dark',
    isColor: true,
    placeholder: themePlaceholder('landingSectionBgDarkDark'),
    advanced: true,
  },
  {
    key: 'landingGhBgCanvas',
    group: 'landing',
    label: 'GitHub canvas background',
    isColor: true,
    placeholder: themePlaceholder('landingGhBgCanvas'),
  },
  {
    key: 'landingGhBgSubtle',
    group: 'landing',
    label: 'GitHub subtle background',
    isColor: true,
    placeholder: themePlaceholder('landingGhBgSubtle'),
  },
  {
    key: 'landingGhBgMuted',
    group: 'landing',
    label: 'GitHub muted background',
    isColor: true,
    placeholder: themePlaceholder('landingGhBgMuted'),
  },
  {
    key: 'landingGhBorderDefault',
    group: 'landing',
    label: 'GitHub default border',
    isColor: true,
    placeholder: themePlaceholder('landingGhBorderDefault'),
  },
  {
    key: 'landingGhFgDefault',
    group: 'landing',
    label: 'GitHub default text',
    isColor: true,
    placeholder: themePlaceholder('landingGhFgDefault'),
  },
  {
    key: 'landingGhFgMuted',
    group: 'landing',
    label: 'GitHub muted text',
    isColor: true,
    placeholder: themePlaceholder('landingGhFgMuted'),
  },
  {
    key: 'landingGhFgSubtle',
    group: 'landing',
    label: 'GitHub subtle text',
    isColor: true,
    placeholder: themePlaceholder('landingGhFgSubtle'),
    advanced: true,
  },
  {
    key: 'landingGhAccent',
    group: 'landing',
    label: 'GitHub accent',
    isColor: true,
    placeholder: themePlaceholder('landingGhAccent'),
  },
  {
    key: 'landingGhAccentEmphasis',
    group: 'landing',
    label: 'GitHub accent emphasis',
    isColor: true,
    placeholder: themePlaceholder('landingGhAccentEmphasis'),
  },
  {
    key: 'landingGhAccentHover',
    group: 'landing',
    label: 'GitHub accent hover',
    isColor: true,
    placeholder: themePlaceholder('landingGhAccentHover'),
    advanced: true,
  },
  {
    key: 'landingGhAccentSubtle',
    group: 'landing',
    label: 'GitHub accent subtle',
    isColor: true,
    placeholder: themePlaceholder('landingGhAccentSubtle'),
    advanced: true,
  },
  {
    key: 'landingSharedDarkBg',
    group: 'landing',
    label: 'Shared dark background',
    isColor: true,
    placeholder: themePlaceholder('landingSharedDarkBg'),
  },
  {
    key: 'landingSharedDarkSurface',
    group: 'landing',
    label: 'Shared dark surface',
    isColor: true,
    placeholder: themePlaceholder('landingSharedDarkSurface'),
  },
  {
    key: 'landingSharedDarkSurfaceMuted',
    group: 'landing',
    label: 'Shared dark surface muted',
    isColor: true,
    placeholder: themePlaceholder('landingSharedDarkSurfaceMuted'),
    advanced: true,
  },
  {
    key: 'landingSharedDarkBorder',
    group: 'landing',
    label: 'Shared dark border',
    isColor: true,
    placeholder: themePlaceholder('landingSharedDarkBorder'),
  },
  {
    key: 'landingSharedDarkText',
    group: 'landing',
    label: 'Shared dark text',
    isColor: true,
    placeholder: themePlaceholder('landingSharedDarkText'),
  },
  {
    key: 'landingSharedDarkTextMuted',
    group: 'landing',
    label: 'Shared dark text muted',
    isColor: true,
    placeholder: themePlaceholder('landingSharedDarkTextMuted'),
  },
  {
    key: 'landingSharedDarkAccent',
    group: 'landing',
    label: 'Shared dark accent',
    isColor: true,
    placeholder: themePlaceholder('landingSharedDarkAccent'),
    advanced: true,
  },
  {
    key: 'landingCodeKeyword',
    group: 'landing',
    label: 'Code keyword color',
    isColor: true,
    placeholder: themePlaceholder('landingCodeKeyword'),
  },
  {
    key: 'landingCodeString',
    group: 'landing',
    label: 'Code string color',
    isColor: true,
    placeholder: themePlaceholder('landingCodeString'),
  },
  {
    key: 'landingCodeComponent',
    group: 'landing',
    label: 'Code component color',
    isColor: true,
    placeholder: themePlaceholder('landingCodeComponent'),
  },
  {
    key: 'landingCodeProp',
    group: 'landing',
    label: 'Code property color',
    isColor: true,
    placeholder: themePlaceholder('landingCodeProp'),
  },
  {
    key: 'landingCodeComment',
    group: 'landing',
    label: 'Code comment color',
    isColor: true,
    placeholder: themePlaceholder('landingCodeComment'),
  },
  {
    key: 'landingThemeGradientStart',
    group: 'landing',
    label: 'Theme card gradient start',
    isColor: true,
    placeholder: themePlaceholder('landingThemeGradientStart'),
  },
  {
    key: 'landingThemeGradientEnd',
    group: 'landing',
    label: 'Theme card gradient end',
    isColor: true,
    placeholder: themePlaceholder('landingThemeGradientEnd'),
  },
  {
    key: 'landingHeroHighlight1',
    group: 'landing',
    label: 'Hero metallic highlight 1',
    isColor: true,
    placeholder: themePlaceholder('landingHeroHighlight1'),
    advanced: true,
  },
  {
    key: 'landingHeroHighlight2',
    group: 'landing',
    label: 'Hero metallic highlight 2',
    isColor: true,
    placeholder: themePlaceholder('landingHeroHighlight2'),
    advanced: true,
  },
  {
    key: 'landingHeroHighlight3',
    group: 'landing',
    label: 'Hero metallic highlight 3',
    isColor: true,
    placeholder: themePlaceholder('landingHeroHighlight3'),
    advanced: true,
  },
  {
    key: 'landingHeroHighlight4',
    group: 'landing',
    label: 'Hero metallic highlight 4',
    isColor: true,
    placeholder: themePlaceholder('landingHeroHighlight4'),
    advanced: true,
  },
  {
    key: 'landingHeroHighlight5',
    group: 'landing',
    label: 'Hero metallic highlight 5',
    isColor: true,
    placeholder: themePlaceholder('landingHeroHighlight5'),
    advanced: true,
  },
  ]
}

export function getThemeFieldsByGroup(
  fields: ThemeField[],
  groupId: ThemeFieldGroup,
  includeAdvanced: boolean
): ThemeField[] {
  return fields.filter(field => field.group === groupId && (includeAdvanced || !field.advanced))
}

const landingColorSectionById = new Map<ThemeFieldSectionId, ThemeFieldSectionDefinition>(
  landingColorSectionsDefinition.map(section => [section.id, section])
)

export function resolveLandingColorSectionId(key: ThemeFieldKey): ThemeFieldSectionId {
  if (key.startsWith('landingFontSize')) {
    return 'landingTypography'
  }

  if (key.startsWith('landingLayout')) {
    return 'layoutDimensions'
  }

  if (key.startsWith('landingSpace')) {
    return 'layoutSpacing'
  }

  if (key.startsWith('landingRadius')) {
    return 'radius'
  }

  if (key.startsWith('landingShadow')) {
    return 'shadows'
  }

  if (
    key.startsWith('landingEasing')
    || key.startsWith('landingTransition')
    || key.startsWith('landingReveal')
    || key.startsWith('landingImageHover')
    || key.startsWith('landingComponentCard')
    || key.startsWith('landingCodeBlock')
    || key.startsWith('landingTopbar')
    || key.startsWith('landingPulse')
    || key.startsWith('landingFloat')
  ) {
    return 'motion'
  }

  if (key.startsWith('landingGray')) {
    return 'grayscale'
  }

  if (key.startsWith('landingSectionBg')) {
    return 'sections'
  }

  if (key.startsWith('landingGh')) {
    return 'githubDark'
  }

  if (key.startsWith('landingSharedDark')) {
    return 'sharedDark'
  }

  if (key.startsWith('landingCode')) {
    return 'syntax'
  }

  if (key.startsWith('landingThemeGradient') || key.startsWith('landingHeroHighlight')) {
    return 'effects'
  }

  return 'core'
}

export function getThemeFieldSections(
  groupId: ThemeFieldGroup,
  fields: ThemeField[]
): ThemeFieldSection[] {
  if (groupId !== 'landing') {
    return [
      {
        id: 'default',
        label: '',
        description: '',
        fields,
      },
    ]
  }

  const grouped = new Map<ThemeFieldSectionId, ThemeField[]>()
  for (const field of fields) {
    const sectionId = resolveLandingColorSectionId(field.key)
    const bucket = grouped.get(sectionId) ?? []
    bucket.push(field)
    grouped.set(sectionId, bucket)
  }

  return landingColorSectionsDefinition
    .map(section => ({
      ...landingColorSectionById.get(section.id)!,
      fields: grouped.get(section.id) ?? [],
    }))
    .filter(section => section.fields.length > 0)
}