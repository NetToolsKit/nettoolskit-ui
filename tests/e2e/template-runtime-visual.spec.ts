import { expect, test, type Locator, type Page } from '@playwright/test'

const RUNTIME_BASE = '/?template-runtime=1'
const RUNTIME_LOGIN_URL = `${RUNTIME_BASE}#/auth/login`
const WIKI_CHAT_STORAGE_KEY = 'ntk_template_runtime_wiki_chat_v1'

const PRESET_CERTIFICATIONS = [
  { id: 'revolut', label: 'Revolut', dark: false },
  { id: 'claude', label: 'Claude', dark: false },
  { id: 'warp', label: 'Warp', dark: true },
  { id: 'resend', label: 'Resend', dark: true },
] as const

type PresetCertification = typeof PRESET_CERTIFICATIONS[number]
type RgbTriplet = [number, number, number]

interface SurfaceMetrics {
  backgroundColor: string
  textColor: string
  backgroundLuminance: number
  contrastRatio: number
}

interface ChatSnapshotSeed {
  version: 1
  selectedConversationId: string | null
  lastConversationNumber: number
  lastMessageNumber: number
  conversations: Array<{
    id: string
    title: string
    createdAt: string
    updatedAt: string
    messages: Array<{
      id: string
      role: 'user' | 'assistant'
      content: string
      createdAt: string
      fromCache?: boolean
      sources?: Array<{
        documentName: string
        chunkContent: string
        relevance: number
      }>
    }>
  }>
}

function createSeededChatSnapshot(): ChatSnapshotSeed {
  return {
    version: 1,
    selectedConversationId: 'conv-visual-1',
    lastConversationNumber: 1,
    lastMessageNumber: 2,
    conversations: [
      {
        id: 'conv-visual-1',
        title: 'Certificacao visual',
        createdAt: '2026-04-16T12:00:00.000Z',
        updatedAt: '2026-04-16T12:00:00.000Z',
        messages: [
          {
            id: 'msg-visual-1',
            role: 'user',
            content: 'Validar contraste do runtime',
            createdAt: '2026-04-16T12:00:00.000Z',
          },
          {
            id: 'msg-visual-2',
            role: 'assistant',
            content: 'Resumo local salvo para esta conversa: Validar contraste do runtime. Consulte Manual Operacional.md e confirme superficies criticas.',
            createdAt: '2026-04-16T12:00:00.000Z',
            fromCache: false,
            sources: [
              {
                documentName: 'Manual Operacional.md',
                chunkContent: 'Fluxo local de atendimento para clientes, pedidos e tarefas do workspace.',
                relevance: 0.96,
              },
            ],
          },
        ],
      },
    ],
  }
}

async function resetRuntimeState(page: Page, preset: PresetCertification): Promise<void> {
  await page.goto('/')
  await page.evaluate(({ themeId, chatStorageKey, chatSnapshot }) => {
    window.localStorage.clear()
    window.sessionStorage.clear()
    window.localStorage.setItem('ntk-theme', themeId)
    window.localStorage.setItem(chatStorageKey, JSON.stringify(chatSnapshot))
  }, {
    themeId: preset.id,
    chatStorageKey: WIKI_CHAT_STORAGE_KEY,
    chatSnapshot: createSeededChatSnapshot(),
  })
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

async function assertPresetContract(page: Page, preset: PresetCertification): Promise<void> {
  await expect.poll(async () => {
    return await page.evaluate(() => document.documentElement.dataset.theme ?? '')
  }).toBe(preset.id)

  await expect.poll(async () => {
    return await page.evaluate(() => document.body.classList.contains('body--dark'))
  }).toBe(preset.dark)

  await expect.poll(async () => {
    return await page.evaluate(() => document.body.classList.contains('body--light'))
  }).toBe(!preset.dark)

  await expect.poll(async () => {
    return await page.evaluate(() => {
      return window.getComputedStyle(document.documentElement).getPropertyValue('--ntk-dark-scheme').trim()
    })
  }).toBe(preset.dark ? '1' : '0')
}

async function assertNoHorizontalOverflow(page: Page, context: string): Promise<void> {
  const overflow = await page.evaluate(() => {
    const root = document.documentElement
    return root.scrollWidth - root.clientWidth
  })

  expect(overflow, `${context} should not introduce page-level horizontal overflow`).toBeLessThanOrEqual(2)
}

async function readResolvedSurfaceMetrics(surface: Locator, textSource: Locator = surface): Promise<SurfaceMetrics> {
  const backgroundColor = await surface.evaluate((element) => {
    type BrowserRgba = { red: number; green: number; blue: number; alpha: number }

    function parseBrowserColor(value: string): BrowserRgba | null {
      const normalized = value.trim().toLowerCase()

      if (!normalized || normalized === 'transparent') {
        return null
      }

      if (normalized.startsWith('color(srgb')) {
        const [channelPart = '', alphaPart] = normalized
          .replace('color(srgb', '')
          .replace(')', '')
          .split('/')
          .map(part => part.trim())
        const channels = channelPart.split(/\s+/).slice(0, 3)

        if (channels.length < 3) {
          return null
        }

        return {
          red: Number(channels[0]) * 255,
          green: Number(channels[1]) * 255,
          blue: Number(channels[2]) * 255,
          alpha: alphaPart ? Number(alphaPart) : 1,
        }
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

function expectReadableSurface(metrics: SurfaceMetrics, context: string): void {
  expect(
    metrics.contrastRatio,
    `${context} should keep readable text, got fg ${metrics.textColor} on bg ${metrics.backgroundColor}`
  ).toBeGreaterThan(4)
}

function expectPresetSurfaceFamily(metrics: SurfaceMetrics, preset: PresetCertification, context: string): void {
  if (preset.dark) {
    expect(
      metrics.backgroundLuminance,
      `${context} should stay in the dark surface family, got ${metrics.backgroundColor}`
    ).toBeLessThan(0.4)
    return
  }

  expect(
    metrics.backgroundLuminance,
    `${context} should stay in the light surface family, got ${metrics.backgroundColor}`
  ).toBeGreaterThan(0.55)
}

async function assertReadable(
  surface: Locator,
  textSource: Locator,
  preset: PresetCertification,
  context: string,
  options: { assertSurfaceFamily?: boolean } = {}
): Promise<void> {
  const metrics = await readResolvedSurfaceMetrics(surface, textSource)
  expectReadableSurface(metrics, `${preset.id} ${context}`)

  if (options.assertSurfaceFamily) {
    expectPresetSurfaceFamily(metrics, preset, `${preset.id} ${context}`)
  }
}

async function assertShellCertification(page: Page, preset: PresetCertification): Promise<void> {
  const header = page.locator('.ntk-template-main-layout__header')
  const headerTitle = page.locator('.ntk-template-main-layout__title')
  const drawer = page.locator('.ntk-template-main-layout__drawer')
  const firstMenuLink = drawer.locator('.ntk-template-menu-link').first()
  const firstMenuLinkText = firstMenuLink.locator('.q-item__label').first()

  await expect(header).toBeVisible()
  await expect(drawer).toBeVisible()
  await expect(firstMenuLink).toBeVisible()

  await assertReadable(header, headerTitle, preset, 'header chrome', { assertSurfaceFamily: true })
  await assertReadable(drawer, firstMenuLinkText, preset, 'drawer navigation', { assertSurfaceFamily: true })
}

async function assertDashboardCertification(page: Page, preset: PresetCertification): Promise<void> {
  await page.goto(`${RUNTIME_BASE}#/`)
  await expect(page.locator('.ntk-template-dashboard__title')).toBeVisible()

  const dashboardCard = page.locator('.ntk-template-dashboard__card').first()
  const dashboardCardTitle = dashboardCard.locator('.ntk-template-dashboard__section-title')
  const chartCard = page.locator('.ntk-reference-dashboard-charts__card').first()
  const chartTitle = chartCard.locator('h3')

  await expect(dashboardCard).toBeVisible()
  await expect(chartCard).toBeVisible()

  await assertReadable(dashboardCard, dashboardCardTitle, preset, 'dashboard card', { assertSurfaceFamily: true })
  await assertReadable(chartCard, chartTitle, preset, 'dashboard chart card', { assertSurfaceFamily: true })
}

async function assertClientsCertification(page: Page, preset: PresetCertification): Promise<void> {
  await page.goto(`${RUNTIME_BASE}#/clients`)
  await expect(page.getByRole('heading', { name: 'Clientes' })).toBeVisible()
  await page.getByRole('button', { name: 'Alternar para tabela de clientes' }).click()

  const searchSurface = page.locator('.ntk-template-crud-list__search')
  const searchInput = page.getByLabel('Buscar clientes')
  const tableWrap = page.locator('.ntk-template-crud-list__table-wrap')
  const tableHeader = page.locator('table[aria-label="Tabela de clientes"] thead th').first()

  await expect(searchSurface).toBeVisible()
  await expect(tableWrap).toBeVisible()

  await assertReadable(searchSurface, searchInput, preset, 'clients search', { assertSurfaceFamily: true })
  await assertReadable(tableWrap, tableHeader, preset, 'clients table', { assertSurfaceFamily: true })
}

async function assertSettingsCertification(page: Page, preset: PresetCertification): Promise<void> {
  await page.goto(`${RUNTIME_BASE}#/settings`)
  await expect(page.getByRole('heading', { name: 'Configurações' })).toBeVisible()

  const card = page.locator('.ntk-template-runtime-settings__card').first()
  const cardTitle = card.locator('h2')
  const input = page.locator('input[name="runtime-workspace-name"]')

  await expect(card).toBeVisible()
  await expect(input).toBeVisible()

  await assertReadable(card, cardTitle, preset, 'settings card', { assertSurfaceFamily: true })
  await assertReadable(input, input, preset, 'settings workspace input', { assertSurfaceFamily: true })
}

async function assertKnowledgeCertification(page: Page, preset: PresetCertification): Promise<void> {
  await page.goto(`${RUNTIME_BASE}#/knowledge`)
  await expect(page.getByRole('heading', { name: 'Base de conhecimento' })).toBeVisible()

  const sidebar = page.locator('.ntk-template-wiki__sidebar')
  const sidebarTitle = sidebar.locator('.ntk-template-wiki__sidebar-title')
  const firstTreeItem = page.locator('.ntk-template-wiki__tree-item').first()

  await expect(sidebar).toBeVisible()
  await firstTreeItem.click()

  const activeTreeItem = page.locator('.ntk-template-wiki__tree-item--active').first()
  const activeTreeLabel = activeTreeItem.locator('.ntk-template-wiki__tree-label')
  const fileName = page.locator('.ntk-template-wiki__file-name').first()

  await expect(activeTreeItem).toBeVisible()
  await expect(fileName).toBeVisible()

  await assertReadable(sidebar, sidebarTitle, preset, 'knowledge sidebar', { assertSurfaceFamily: true })
  await assertReadable(activeTreeItem, activeTreeLabel, preset, 'knowledge active tree item')
  await assertReadable(page.locator('.ntk-template-wiki__surface'), fileName, preset, 'knowledge document table', { assertSurfaceFamily: true })
}

async function assertProfileCertification(page: Page, preset: PresetCertification): Promise<void> {
  await page.goto(`${RUNTIME_BASE}#/profile`)
  await expect(page.getByRole('heading', { name: 'Admin NetToolsKit' })).toBeVisible()

  const card = page.locator('.ntk-template-profile__card').first()
  const rowValue = card.locator('.ntk-template-profile__row-value').first()
  const roleBadge = page.locator('.ntk-template-profile__role-badge').first()

  await expect(card).toBeVisible()
  await expect(roleBadge).toBeVisible()

  await assertReadable(card, rowValue, preset, 'profile card', { assertSurfaceFamily: true })
  await assertReadable(roleBadge, roleBadge, preset, 'profile role badge')
}

async function assertChatCertification(page: Page, preset: PresetCertification): Promise<void> {
  await page.goto(`${RUNTIME_BASE}#/knowledge/chat`)
  await expect(page.locator('.ntk-template-wiki-chat__chat-title')).toHaveText('Certificacao visual')

  const chatShell = page.locator('.ntk-template-wiki-chat__chat')
  const chatTitle = page.locator('.ntk-template-wiki-chat__chat-title')
  const messageBubble = page.locator('.ntk-template-wiki-chat__message-content').first()
  const sourceCard = page.locator('.ntk-template-wiki-chat__source').first()
  const sourceTitle = sourceCard.locator('strong').first()

  await expect(chatShell).toBeVisible()
  await expect(messageBubble).toBeVisible()
  await expect(sourceCard).toBeVisible()

  await assertReadable(chatShell, chatTitle, preset, 'knowledge chat shell', { assertSurfaceFamily: true })
  await assertReadable(messageBubble, messageBubble, preset, 'knowledge chat message')
  await assertReadable(sourceCard, sourceTitle, preset, 'knowledge chat source')
}

async function assertOverlayCertification(page: Page, preset: PresetCertification): Promise<void> {
  const userMenuTrigger = page.locator('.ntk-template-user-menu__avatar').first()

  await expect(userMenuTrigger).toBeVisible()
  await userMenuTrigger.click()

  const userMenu = page.locator('.ntk-template-user-menu').last()
  const userMenuName = userMenu.locator('.text-subtitle1').first()

  await expect(userMenu).toBeVisible()
  await expect(userMenuName).toBeVisible()

  await assertReadable(userMenu, userMenuName, preset, 'user menu overlay', { assertSurfaceFamily: true })

  await page.keyboard.press('Escape')
  await expect(userMenu).not.toBeVisible()
}

test.describe('template runtime visual preset certification', () => {
  for (const preset of PRESET_CERTIFICATIONS) {
    test(`certifies layout, contrast and theme contract in ${preset.label}`, async ({ page }) => {
      await resetRuntimeState(page, preset)
      await loginToRuntime(page)

      await assertPresetContract(page, preset)
      await assertShellCertification(page, preset)
      await assertDashboardCertification(page, preset)
      await assertClientsCertification(page, preset)
      await assertSettingsCertification(page, preset)
      await assertKnowledgeCertification(page, preset)
      await assertProfileCertification(page, preset)
      await assertChatCertification(page, preset)
      await assertOverlayCertification(page, preset)
      await assertNoHorizontalOverflow(page, preset.label)
    })
  }
})
