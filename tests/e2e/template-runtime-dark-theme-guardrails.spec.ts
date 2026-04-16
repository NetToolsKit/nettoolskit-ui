import { expect, test, type Locator, type Page } from '@playwright/test'

const RUNTIME_BASE = '/?template-runtime=1'
const RUNTIME_LOGIN_URL = `${RUNTIME_BASE}#/auth/login`

const DARK_THEMES = [
  { id: 'warp', label: 'Warp' },
  { id: 'resend', label: 'Resend' },
] as const

type RgbTriplet = [number, number, number]

async function resetRuntimeState(page: Page, themeId?: string): Promise<void> {
  await page.goto('/')
  await page.evaluate(({ themeId }) => {
    window.localStorage.clear()
    window.sessionStorage.clear()

    if (themeId) {
      window.localStorage.setItem('ntk-theme', themeId)
    }
  }, { themeId })
}

async function loginToRuntime(page: Page): Promise<void> {
  await page.goto(RUNTIME_LOGIN_URL)
  await expect(page.getByRole('heading', { name: 'Entrar no sistema' })).toBeVisible()

  await page.locator('input[aria-label="Email input"]').fill('ops@nettoolskit.dev')
  await page.locator('input[aria-label="Password input"]').fill('demo-password')
  await page.getByRole('button', { name: 'Submit login form' }).click()

  await expect(page).toHaveURL(/template-runtime=1#\/?$/)
  await expect(page.locator('.ntk-template-dashboard__title')).toBeVisible()
}

async function activateTheme(page: Page, theme: typeof DARK_THEMES[number]): Promise<void> {
  await page.locator(`.ntk-template-theme-dots__dot[title="${theme.label}"]`).click()

  await expect.poll(async () => {
    return await page.evaluate(() => document.documentElement.dataset.theme ?? '')
  }).toBe(theme.id)

  await expect.poll(async () => {
    return await page.evaluate(() => document.body.classList.contains('body--dark'))
  }).toBe(true)
}

async function readResolvedSurfaceMetrics(surface: Locator, textSource: Locator = surface): Promise<{
  backgroundColor: string
  textColor: string
  backgroundLuminance: number
  contrastRatio: number
}> {
  const backgroundColor = await surface.evaluate((element) => {
    type BrowserRgba = { red: number; green: number; blue: number; alpha: number }

    function parseBrowserColor(value: string): BrowserRgba | null {
      const normalized = value.trim().toLowerCase()

      if (!normalized || normalized === 'transparent') {
        return null
      }

      const channels = normalized.match(/[\d.]+/g)
      if (!channels || channels.length < 3) {
        return null
      }

      return {
        red: Number(channels[0]),
        green: Number(channels[1]),
        blue: Number(channels[2]),
        alpha: channels[3] ? Number(channels[3]) : 1,
      }
    }

    function composite(top: BrowserRgba, bottom: BrowserRgba): BrowserRgba {
      const alpha = top.alpha + bottom.alpha * (1 - top.alpha)

      if (alpha <= 0) {
        return { red: 255, green: 255, blue: 255, alpha: 0 }
      }

      return {
        red: ((top.red * top.alpha) + (bottom.red * bottom.alpha * (1 - top.alpha))) / alpha,
        green: ((top.green * top.alpha) + (bottom.green * bottom.alpha * (1 - top.alpha))) / alpha,
        blue: ((top.blue * top.alpha) + (bottom.blue * bottom.alpha * (1 - top.alpha))) / alpha,
        alpha,
      }
    }

    function toRgbString(color: BrowserRgba): string {
      return `rgb(${Math.round(color.red)}, ${Math.round(color.green)}, ${Math.round(color.blue)})`
    }

    let current: HTMLElement | null = element as HTMLElement
    const layers: BrowserRgba[] = []

    while (current) {
      const background = parseBrowserColor(window.getComputedStyle(current).backgroundColor)

      if (background && background.alpha > 0) {
        layers.push(background)
        if (background.alpha >= 1) {
          break
        }
      }

      current = current.parentElement
    }

    const bodyBackground = parseBrowserColor(window.getComputedStyle(document.body).backgroundColor)
      ?? { red: 255, green: 255, blue: 255, alpha: 1 }

    const compositeColor = layers
      .reverse()
      .reduce((accumulator, layer) => composite(layer, accumulator), bodyBackground)

    return toRgbString(compositeColor)
  })

  const textColor = await textSource.evaluate(element => window.getComputedStyle(element).color)
  const backgroundRgb = parseCssColor(backgroundColor)
  const textRgb = parseCssColor(textColor)

  return {
    backgroundColor,
    textColor,
    backgroundLuminance: relativeLuminance(backgroundRgb),
    contrastRatio: contrastRatio(textRgb, backgroundRgb),
  }
}

function parseCssColor(value: string): RgbTriplet {
  const normalized = value.trim().toLowerCase()

  if (normalized.startsWith('rgb')) {
    const channels = normalized.match(/[\d.]+/g)

    if (!channels || channels.length < 3) {
      throw new Error(`Unsupported rgb color: ${value}`)
    }

    return [
      Number(channels[0]),
      Number(channels[1]),
      Number(channels[2]),
    ]
  }

  if (normalized.startsWith('color(srgb')) {
    const channelSource = normalized
      .replace('color(srgb', '')
      .replace(')', '')
      .split('/')[0]
      .trim()
      .split(/\s+/)
      .slice(0, 3)

    if (channelSource.length < 3) {
      throw new Error(`Unsupported color(srgb) color: ${value}`)
    }

    return channelSource.map(channel => Math.round(Number(channel) * 255)) as RgbTriplet
  }

  throw new Error(`Unsupported CSS color format: ${value}`)
}

function relativeLuminance([red, green, blue]: RgbTriplet): number {
  const channels = [red, green, blue].map((value) => {
    const normalized = value / 255
    return normalized <= 0.03928
      ? normalized / 12.92
      : ((normalized + 0.055) / 1.055) ** 2.4
  })

  return 0.2126 * channels[0]! + 0.7152 * channels[1]! + 0.0722 * channels[2]!
}

function contrastRatio(foreground: RgbTriplet, background: RgbTriplet): number {
  const foregroundLuminance = relativeLuminance(foreground)
  const backgroundLuminance = relativeLuminance(background)
  const lighter = Math.max(foregroundLuminance, backgroundLuminance)
  const darker = Math.min(foregroundLuminance, backgroundLuminance)

  return (lighter + 0.05) / (darker + 0.05)
}

function expectDarkReadableSurface(
  metrics: Awaited<ReturnType<typeof readResolvedSurfaceMetrics>>,
  context: string
): void {
  expect(
    metrics.backgroundLuminance,
    `${context} should stay on a dark surface, got ${metrics.backgroundColor}`
  ).toBeLessThan(0.35)
  expect(
    metrics.contrastRatio,
    `${context} should keep readable text, got fg ${metrics.textColor} on bg ${metrics.backgroundColor}`
  ).toBeGreaterThan(4)
}

async function assertCrudDarkSurfaces(
  page: Page,
  route: string,
  heading: string,
  searchLabel: string,
  tableToggleLabel: string,
  tableLabel: string,
  themeId: string
): Promise<void> {
  await page.goto(`${RUNTIME_BASE}#/${route}`)
  await expect(page.getByRole('heading', { name: heading })).toBeVisible()

  const searchSurface = page.locator('.ntk-template-crud-list__search')
  const searchInput = page.getByLabel(searchLabel)
  const tableWrap = page.locator('.ntk-template-crud-list__table-wrap')
  const tableHeader = page.locator(`table[aria-label="${tableLabel}"] thead th`).first()
  const tableBodyCell = page.locator(`table[aria-label="${tableLabel}"] tbody tr`).first().locator('td').first()

  await expect(searchSurface).toBeVisible()
  await page.getByRole('button', { name: tableToggleLabel }).click()
  await expect(tableWrap).toBeVisible()
  await expect(tableHeader).toBeVisible()
  await expect(tableBodyCell).toBeVisible()

  expectDarkReadableSurface(
    await readResolvedSurfaceMetrics(searchSurface, searchInput),
    `${themeId} ${route} search surface`
  )
  expectDarkReadableSurface(
    await readResolvedSurfaceMetrics(tableWrap, tableHeader),
    `${themeId} ${route} table surface`
  )
  expectDarkReadableSurface(
    await readResolvedSurfaceMetrics(tableBodyCell),
    `${themeId} ${route} table body surface`
  )
}

async function assertOverlayDarkSurfaces(page: Page, themeId: string): Promise<void> {
  const userMenuTrigger = page.locator('.ntk-template-user-menu__avatar').first()

  await expect(userMenuTrigger).toBeVisible()
  await userMenuTrigger.click()

  const userMenu = page.locator('.ntk-template-user-menu').last()
  const userMenuProfileName = userMenu.locator('.text-subtitle1').first()

  await expect(userMenu).toBeVisible()
  await expect(userMenuProfileName).toBeVisible()

  expectDarkReadableSurface(
    await readResolvedSurfaceMetrics(userMenu, userMenuProfileName),
    `${themeId} user menu overlay`
  )

  await page.keyboard.press('Escape')
  await expect(userMenu).not.toBeVisible()

  const collapseDrawerButton = page.getByLabel('Collapse side menu')
  await expect(collapseDrawerButton).toBeVisible()
  await collapseDrawerButton.click()
  await expect(page.getByLabel('Expand side menu')).toBeVisible()

  const firstDrawerLink = page.locator('.ntk-template-main-layout__drawer .ntk-template-menu-link').first()
  await expect(firstDrawerLink).toBeVisible()
  await firstDrawerLink.hover()

  const drawerTooltip = page.locator('.q-tooltip').filter({ hasText: 'Dashboard' }).last()
  await expect(drawerTooltip).toBeVisible()

  expectDarkReadableSurface(
    await readResolvedSurfaceMetrics(drawerTooltip),
    `${themeId} drawer tooltip overlay`
  )

  const assistantTrigger = page.getByLabel(/abrir assistente/i)
  await expect(assistantTrigger).toBeVisible()
  await assistantTrigger.click()

  const assistantDrawer = page.getByRole('dialog', { name: /assistant drawer/i })
  const assistantDrawerTitle = assistantDrawer.locator('.ntk-template-wiki-chat-drawer__title')
  const assistantDrawerInput = assistantDrawer.locator('.ntk-template-wiki-chat-drawer__input')

  await expect(assistantDrawer).toBeVisible()
  await expect(assistantDrawerTitle).toBeVisible()
  await expect(assistantDrawerInput).toBeVisible()

  expectDarkReadableSurface(
    await readResolvedSurfaceMetrics(assistantDrawer, assistantDrawerTitle),
    `${themeId} assistant drawer dialog surface`
  )
  expectDarkReadableSurface(
    await readResolvedSurfaceMetrics(assistantDrawerInput),
    `${themeId} assistant drawer input surface`
  )

  await assistantDrawer.getByRole('button', { name: /close drawer/i }).click()
  await expect(assistantDrawer).not.toBeVisible()
}

test.describe('template runtime dark theme guardrails', () => {
  for (const theme of DARK_THEMES) {
    test(`keeps dashboard cards dark and legible in ${theme.label}`, async ({ page }) => {
      await resetRuntimeState(page)
      await loginToRuntime(page)
      await activateTheme(page, theme)

      const cards = page.locator('.ntk-template-dashboard__card')
      const dashboardChip = page.locator('.ntk-template-dashboard__chip').first()
      const dashboardChipText = dashboardChip.locator('span').last()

      await expect(cards).toHaveCount(2)
      await expect(dashboardChip).toBeVisible()
      await expect(dashboardChipText).toBeVisible()

      expectDarkReadableSurface(
        await readResolvedSurfaceMetrics(dashboardChip, dashboardChipText),
        `${theme.id} dashboard chip`
      )

      for (const cardIndex of [0, 1]) {
        const card = cards.nth(cardIndex)
        const title = card.locator('.ntk-template-dashboard__section-title')

        await expect(card).toBeVisible()
        await expect(title).toBeVisible()

        expectDarkReadableSurface(
          await readResolvedSurfaceMetrics(card, title),
          `${theme.id} dashboard card ${cardIndex + 1}`
        )
      }
    })

    test(`keeps login, search and table surfaces readable in ${theme.label}`, async ({ page }) => {
      await resetRuntimeState(page, theme.id)
      await page.goto(RUNTIME_LOGIN_URL)

      await expect.poll(async () => {
        return await page.evaluate(() => document.documentElement.dataset.theme ?? '')
      }).toBe(theme.id)
      await expect.poll(async () => {
        return await page.evaluate(() => document.body.classList.contains('body--dark'))
      }).toBe(true)

      const loginShell = page.locator('.ntk-template-login__form-shell')
      const loginTitle = page.locator('.ntk-template-login__form-title')
      const loginField = page.locator('.ntk-template-login .q-field__control').first()
      const loginInput = page.locator('input[aria-label="Email input"]')

      await expect(loginShell).toBeVisible()
      await expect(loginField).toBeVisible()
      await expect(loginInput).toBeVisible()

      expectDarkReadableSurface(
        await readResolvedSurfaceMetrics(loginShell, loginTitle),
        `${theme.id} login form shell`
      )
      expectDarkReadableSurface(
        await readResolvedSurfaceMetrics(loginField, loginInput),
        `${theme.id} login input`
      )

      await loginToRuntime(page)

      await assertCrudDarkSurfaces(
        page,
        'clients',
        'Clientes',
        'Buscar clientes',
        'Alternar para tabela de clientes',
        'Tabela de clientes',
        theme.id
      )
      await assertCrudDarkSurfaces(
        page,
        'orders',
        'Pedidos',
        'Buscar pedidos',
        'Alternar para tabela de pedidos',
        'Tabela de pedidos',
        theme.id
      )
    })

    test(`keeps teleported Quasar overlays dark and legible in ${theme.label}`, async ({ page }) => {
      await resetRuntimeState(page)
      await loginToRuntime(page)
      await activateTheme(page, theme)

      await assertOverlayDarkSurfaces(page, theme.id)
    })
  }
})
