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
    let current: HTMLElement | null = element as HTMLElement

    while (current) {
      const style = window.getComputedStyle(current)
      const background = style.backgroundColor

      if (background && background !== 'rgba(0, 0, 0, 0)' && background !== 'transparent') {
        return background
      }

      current = current.parentElement
    }

    return 'rgb(255, 255, 255)'
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

  await expect(searchSurface).toBeVisible()
  await page.getByRole('button', { name: tableToggleLabel }).click()
  await expect(tableWrap).toBeVisible()
  await expect(tableHeader).toBeVisible()

  expectDarkReadableSurface(
    await readResolvedSurfaceMetrics(searchSurface, searchInput),
    `${themeId} ${route} search surface`
  )
  expectDarkReadableSurface(
    await readResolvedSurfaceMetrics(tableWrap, tableHeader),
    `${themeId} ${route} table surface`
  )
}

test.describe('template runtime dark theme guardrails', () => {
  for (const theme of DARK_THEMES) {
    test(`keeps dashboard cards dark and legible in ${theme.label}`, async ({ page }) => {
      await resetRuntimeState(page)
      await loginToRuntime(page)
      await activateTheme(page, theme)

      const cards = page.locator('.ntk-template-dashboard__card')

      await expect(cards).toHaveCount(2)

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
  }
})
