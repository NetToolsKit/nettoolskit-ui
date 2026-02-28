/**
 * Tests/unit/modules/cms/Design Token Contract spec module.
 */

import { describe, expect, it } from 'vitest'
import { APP_SHELL_DEFAULT_THEME } from '../../../../src/components/layout/app-shell.config'
import {
  createDefaultWhiteLabelSettings,
  mapWhiteLabelToShellSnapshot,
} from '../../../../src/modules/cms/white-label/config'

const TYPOGRAPHY_LAYOUT_TOKEN_PATTERN = /^(font|lineHeight|letterSpacing|spacing|radius)|^(searchWidth|searchControlHeight|menuSlotWidth|brandLogoSize|itemIconSize|workspaceMaxWidth|itemMinHeight|itemHoverTranslateX|groupCaption|drawerHeader|drawerScroll|miniItem)/i

/**
 * Builds deterministic token values by key for contract assertions.
 */
function buildTokenValue(key: string, index: number): string {
  return `calc(${index + 10}px + 0.01rem)`
}

describe('CMS design token contract', () => {
  it('propagates all typography/layout tokens from settings to shell snapshot theme', () => {
    const settings = createDefaultWhiteLabelSettings()
    const tokenKeys = Object.keys(APP_SHELL_DEFAULT_THEME)
      .filter(key => TYPOGRAPHY_LAYOUT_TOKEN_PATTERN.test(key))
      .sort()

    tokenKeys.forEach((key, index) => {
      settings.theme[key as keyof typeof settings.theme] = buildTokenValue(key, index)
    })

    const snapshot = mapWhiteLabelToShellSnapshot(settings, {
      activeItem: settings.items[0]?.id ?? '',
      searchValue: '',
    })

    tokenKeys.forEach((key, index) => {
      const expectedValue = buildTokenValue(key, index)
      expect(snapshot.shellConfig.theme[key as keyof typeof snapshot.shellConfig.theme]).toBe(expectedValue)
    })
  })
})