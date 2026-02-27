/**
 * Src/components/layout/app shell theme module.
 */

import { semanticColors } from '../../config/colors/semantic.config'
import type { AppShellTheme } from './app-shell.types'

const DEFAULT_NOTIFICATION_TEXT = 'var(--ntk-text-inverse)'
const DEFAULT_WARNING_TEXT = 'var(--ntk-text-primary)'

/**
 * Handles pick theme value.
 */
function pickThemeValue(...values: Array<string | undefined>): string | undefined {
  for (const value of values) {
    if (typeof value === 'string' && value.trim().length > 0) {
      return value
    }
  }
  return undefined
}

/**
 * Resolves app shell theme.
 */
export function resolveAppShellTheme(theme: AppShellTheme = {}, baseTheme: AppShellTheme = {}): AppShellTheme {
  const sourceTheme: AppShellTheme = {
    ...baseTheme,
    ...theme,
  }

  const accentColor = pickThemeValue(sourceTheme.itemActiveColor, baseTheme.itemActiveColor)
  const drawerTextColor = pickThemeValue(sourceTheme.drawerTextColor, baseTheme.drawerTextColor)
  const drawerBackground = pickThemeValue(sourceTheme.drawerBackground, baseTheme.drawerBackground)
  const headerTextColor = pickThemeValue(sourceTheme.headerTextColor, baseTheme.headerTextColor)
  const dividerColor = pickThemeValue(sourceTheme.dividerColor, baseTheme.dividerColor)

  const notificationSuccessColor = pickThemeValue(sourceTheme.notificationSuccessColor, semanticColors.successPrimary)
  const notificationWarningColor = pickThemeValue(sourceTheme.notificationWarningColor, semanticColors.warningPrimary)
  const notificationErrorColor = pickThemeValue(sourceTheme.notificationErrorColor, semanticColors.errorPrimary)
  const notificationInfoColor = pickThemeValue(sourceTheme.notificationInfoColor, semanticColors.infoPrimary)
  const notificationBadgeColor = pickThemeValue(sourceTheme.notificationBadgeColor, notificationErrorColor)
  const notificationBadgeTextColor = pickThemeValue(sourceTheme.notificationBadgeTextColor, DEFAULT_NOTIFICATION_TEXT)
  const notificationIconColor = pickThemeValue(sourceTheme.notificationIconColor, sourceTheme.toolbarButtonColor, headerTextColor)

  return {
    ...sourceTheme,
    fontFamilyDisplay: pickThemeValue(sourceTheme.fontFamilyDisplay, sourceTheme.fontFamily),
    fontStyleBase: pickThemeValue(sourceTheme.fontStyleBase, 'normal'),
    fontWeightRegular: pickThemeValue(sourceTheme.fontWeightRegular, '400'),
    fontWeightMedium: pickThemeValue(sourceTheme.fontWeightMedium, sourceTheme.fontWeightRegular, '500'),
    fontWeightSemibold: pickThemeValue(sourceTheme.fontWeightSemibold, sourceTheme.fontWeightMedium, '600'),
    fontWeightBold: pickThemeValue(sourceTheme.fontWeightBold, sourceTheme.fontWeightSemibold, '700'),
    fontSizeBase: pickThemeValue(sourceTheme.fontSizeBase, '0.925rem'),
    fontSizeTitle: pickThemeValue(sourceTheme.fontSizeTitle, sourceTheme.fontSizeBase, '0.925rem'),
    fontSizeTitleApp: pickThemeValue(sourceTheme.fontSizeTitleApp, sourceTheme.fontSizeTitle, '1.05rem'),
    fontSizeBrandTitle: pickThemeValue(sourceTheme.fontSizeBrandTitle, sourceTheme.fontSizeBase, '0.9rem'),
    fontSizeBrandSubtitle: pickThemeValue(sourceTheme.fontSizeBrandSubtitle, '0.72rem'),
    fontSizeItemLabel: pickThemeValue(sourceTheme.fontSizeItemLabel, '13px'),
    fontSizeItemCaption: pickThemeValue(sourceTheme.fontSizeItemCaption, '11px'),
    fontSizeGroupCaption: pickThemeValue(sourceTheme.fontSizeGroupCaption, '0.68rem'),
    fontSizeGroupCaptionMini: pickThemeValue(sourceTheme.fontSizeGroupCaptionMini, '0.62rem'),
    letterSpacingGroupCaption: pickThemeValue(sourceTheme.letterSpacingGroupCaption, '0.08em'),
    letterSpacingGroupCaptionMini: pickThemeValue(sourceTheme.letterSpacingGroupCaptionMini, '0.06em'),
    lineHeightBrandText: pickThemeValue(sourceTheme.lineHeightBrandText, '1.1'),
    lineHeightItemLabel: pickThemeValue(sourceTheme.lineHeightItemLabel, '1.25'),
    lineHeightItemCaption: pickThemeValue(sourceTheme.lineHeightItemCaption, '1.2'),
    menuSlotWidth: pickThemeValue(sourceTheme.menuSlotWidth, '30px'),
    searchWidth: pickThemeValue(sourceTheme.searchWidth, '320px'),
    searchControlHeight: pickThemeValue(sourceTheme.searchControlHeight, '36px'),
    searchPrependPaddingRight: pickThemeValue(sourceTheme.searchPrependPaddingRight, '12px'),
    drawerHeaderMinHeight: pickThemeValue(sourceTheme.drawerHeaderMinHeight, '64px'),
    brandLogoSize: pickThemeValue(sourceTheme.brandLogoSize, '34px'),
    groupCaptionMinHeight: pickThemeValue(sourceTheme.groupCaptionMinHeight, '24px'),
    groupCaptionPadding: pickThemeValue(sourceTheme.groupCaptionPadding, '0.45rem 1rem 0.25rem'),
    groupCaptionMiniPadding: pickThemeValue(sourceTheme.groupCaptionMiniPadding, '0.45rem 0'),
    groupCaptionMiniMinWidth: pickThemeValue(sourceTheme.groupCaptionMiniMinWidth, '34px'),
    groupCaptionMiniHeight: pickThemeValue(sourceTheme.groupCaptionMiniHeight, '18px'),
    groupCaptionMiniHorizontalPadding: pickThemeValue(sourceTheme.groupCaptionMiniHorizontalPadding, '0.35rem'),
    itemMinHeight: pickThemeValue(sourceTheme.itemMinHeight, '52px'),
    itemIconSize: pickThemeValue(sourceTheme.itemIconSize, '22px'),
    itemHoverTranslateX: pickThemeValue(sourceTheme.itemHoverTranslateX, '4px'),
    itemActiveBorderWidth: pickThemeValue(sourceTheme.itemActiveBorderWidth, '4px'),
    drawerScrollPaddingBottom: pickThemeValue(sourceTheme.drawerScrollPaddingBottom, '80px'),
    workspaceMaxWidth: pickThemeValue(sourceTheme.workspaceMaxWidth, '1280px'),
    miniItemMarginRight: pickThemeValue(sourceTheme.miniItemMarginRight, '12px'),
    miniItemAvatarMinWidth: pickThemeValue(sourceTheme.miniItemAvatarMinWidth, '28px'),
    radiusSm: pickThemeValue(sourceTheme.radiusSm, '6px'),
    radiusMd: pickThemeValue(sourceTheme.radiusMd, '8px'),
    radiusLg: pickThemeValue(sourceTheme.radiusLg, '10px'),
    radiusItem: pickThemeValue(sourceTheme.radiusItem, '0 28px 28px 0'),
    spacingXs: pickThemeValue(sourceTheme.spacingXs, '0.25rem'),
    spacingSm: pickThemeValue(sourceTheme.spacingSm, '0.5rem'),
    spacingMd: pickThemeValue(sourceTheme.spacingMd, '0.75rem'),
    spacingLg: pickThemeValue(sourceTheme.spacingLg, '1rem'),
    toolbarButtonColor: pickThemeValue(sourceTheme.toolbarButtonColor, headerTextColor),
    titleTextColor: pickThemeValue(sourceTheme.titleTextColor, headerTextColor),
    searchIconColor: pickThemeValue(sourceTheme.searchIconColor, headerTextColor),
    titleAppColor: pickThemeValue(sourceTheme.titleAppColor, accentColor, headerTextColor),
    brandTitleColor: pickThemeValue(sourceTheme.brandTitleColor, accentColor, headerTextColor),
    brandSubtitleColor: pickThemeValue(sourceTheme.brandSubtitleColor, drawerTextColor, headerTextColor),
    itemTextColor: pickThemeValue(sourceTheme.itemTextColor, drawerTextColor),
    itemIconColor: pickThemeValue(sourceTheme.itemIconColor, drawerTextColor),
    itemHoverColor: pickThemeValue(sourceTheme.itemHoverColor, accentColor),
    itemIconHoverColor: pickThemeValue(sourceTheme.itemIconHoverColor, accentColor),
    groupCaptionColor: pickThemeValue(sourceTheme.groupCaptionColor, drawerTextColor),
    titleSeparatorColor: pickThemeValue(sourceTheme.titleSeparatorColor, dividerColor),
    focusColor: pickThemeValue(sourceTheme.focusColor, accentColor),
    actionHoverBackground: pickThemeValue(sourceTheme.actionHoverBackground, baseTheme.actionHoverBackground, 'var(--ntk-bg-hover)'),
    notificationBadgeColor,
    notificationSuccessColor,
    notificationWarningColor,
    notificationErrorColor,
    notificationInfoColor,
    notificationBadgeTextColor,
    notificationIconColor,
    notificationSuccessTextColor: pickThemeValue(sourceTheme.notificationSuccessTextColor, notificationBadgeTextColor),
    notificationWarningTextColor: pickThemeValue(sourceTheme.notificationWarningTextColor, DEFAULT_WARNING_TEXT),
    notificationErrorTextColor: pickThemeValue(sourceTheme.notificationErrorTextColor, notificationBadgeTextColor),
    notificationInfoTextColor: pickThemeValue(sourceTheme.notificationInfoTextColor, notificationBadgeTextColor),
    drawerFooterBackground: pickThemeValue(sourceTheme.drawerFooterBackground, drawerBackground),
    searchBackground: pickThemeValue(sourceTheme.searchBackground, baseTheme.searchBackground, 'var(--ntk-bg-hover)'),
    searchTextColor: pickThemeValue(sourceTheme.searchTextColor, baseTheme.searchTextColor, drawerTextColor),
  }
}

/**
 * Handles sanitize shell link.
 */
export function sanitizeShellLink(href?: string): string | undefined {
  const normalized = (href ?? '').trim()
  if (!normalized) {
    return undefined
  }

  if (/^(javascript|data|vbscript):/i.test(normalized)) {
    return undefined
  }

  return normalized
}