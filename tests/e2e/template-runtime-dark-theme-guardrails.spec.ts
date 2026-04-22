import { expect, test, type Locator, type Page } from '@playwright/test'

const RUNTIME_BASE = '/?template-runtime=1'
const RUNTIME_LOGIN_URL = `${RUNTIME_BASE}#/auth/login`
const WIKI_CHAT_STORAGE_KEY = 'ntk_template_runtime_wiki_chat_v1'

const DARK_THEMES = [
  { id: 'warp', label: 'Warp' },
  { id: 'resend', label: 'Resend' },
] as const

type RgbTriplet = [number, number, number]

interface ChatSourceSeed {
  documentName: string
  chunkContent: string
  relevance: number
}

interface ChatMessageSeed {
  id: string
  role: 'user' | 'assistant'
  content: string
  createdAt: string
  fromCache?: boolean
  sources?: ChatSourceSeed[]
}

interface ChatConversationSeed {
  id: string
  title: string
  createdAt: string
  updatedAt: string
  messages: ChatMessageSeed[]
}

interface ChatSnapshotSeed {
  version: 1
  selectedConversationId: string | null
  lastConversationNumber: number
  lastMessageNumber: number
  conversations: ChatConversationSeed[]
}

function createSeededChatSnapshot(): ChatSnapshotSeed {
  return {
    version: 1,
    selectedConversationId: 'conv-1',
    lastConversationNumber: 1,
    lastMessageNumber: 2,
    conversations: [
      {
        id: 'conv-1',
        title: 'Checklist seed',
        createdAt: '2026-04-16T12:00:00.000Z',
        updatedAt: '2026-04-16T12:00:00.000Z',
        messages: [
          {
            id: 'msg-1',
            role: 'user',
            content: 'Checklist seed?',
            createdAt: '2026-04-16T12:00:00.000Z',
          },
          {
            id: 'msg-2',
            role: 'assistant',
            content: 'Local summary saved for this conversation: Checklist seed. Review Operational Manual.md and confirm the next step before completing the action.',
            createdAt: '2026-04-16T12:00:00.000Z',
            fromCache: false,
            sources: [
              {
                documentName: 'Operational Manual.md',
                chunkContent: 'Local service flow for clients, orders, and workspace tasks.',
                relevance: 0.96,
              },
              {
                documentName: 'Settings Guide.md',
                chunkContent: 'Locally persisted preferences are reapplied when the runtime reloads.',
                relevance: 0.91,
              },
            ],
          },
        ],
      },
    ],
  }
}

async function resetRuntimeState(
  page: Page,
  options?: {
    themeId?: string
    chatSnapshot?: ChatSnapshotSeed
  }
): Promise<void> {
  await page.goto('/')
  await page.evaluate(({ themeId, storageKey, chatSnapshot }) => {
    window.localStorage.clear()
    window.sessionStorage.clear()

    if (themeId) {
      window.localStorage.setItem('ntk-theme', themeId)
    }

    if (chatSnapshot) {
      window.localStorage.setItem(storageKey, JSON.stringify(chatSnapshot))
    }
  }, {
    themeId: options?.themeId,
    storageKey: WIKI_CHAT_STORAGE_KEY,
    chatSnapshot: options?.chatSnapshot ?? null,
  })
}

async function loginToRuntime(page: Page): Promise<void> {
  await page.goto(RUNTIME_LOGIN_URL)
  await expect(page.locator('.ntk-template-login__form-shell')).toBeVisible()

  await page.locator('input[aria-label="Email input"]').fill('ops@nettoolskit.dev')
  await page.locator('input[aria-label="Password input"]').fill('demo-password')
  await page.getByRole('button', { name: 'Submit login form' }).click()

  await expect(page).toHaveURL(/template-runtime=1#\/?$/)
  await expect(page.locator('.ntk-template-dashboard__title')).toBeVisible()
}

async function activateTheme(page: Page, theme: typeof DARK_THEMES[number]): Promise<void> {
  await page.getByRole('button', { name: `Switch to ${theme.label} theme` }).click()

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

function expectDarkReadableSurface(
  metrics: Awaited<ReturnType<typeof readResolvedSurfaceMetrics>>,
  context: string
): void {
  expectReadableSurface(metrics, context)
  expect(
    metrics.backgroundLuminance,
    `${context} should stay on a dark surface, got ${metrics.backgroundColor}`
  ).toBeLessThan(0.35)
}

function expectReadableSurface(
  metrics: Awaited<ReturnType<typeof readResolvedSurfaceMetrics>>,
  context: string
): void {
  expect(
    metrics.contrastRatio,
    `${context} should keep readable text, got fg ${metrics.textColor} on bg ${metrics.backgroundColor}`
  ).toBeGreaterThan(4)
}

type SurfaceAssertion = (
  metrics: Awaited<ReturnType<typeof readResolvedSurfaceMetrics>>,
  context: string
) => void

async function expectAllVisibleSurfaces(
  surfaces: Locator,
  context: string,
  assertion: SurfaceAssertion
): Promise<number> {
  const surfaceCount = await surfaces.count()
  expect(surfaceCount, `${context} should render visible surfaces`).toBeGreaterThan(0)

  for (let surfaceIndex = 0; surfaceIndex < surfaceCount; surfaceIndex += 1) {
    const surface = surfaces.nth(surfaceIndex)
    await expect(surface).toBeVisible()
    assertion(
      await readResolvedSurfaceMetrics(surface),
      `${context} ${surfaceIndex + 1}`
    )
  }

  return surfaceCount
}

async function expectOptionalVisibleSurfaces(
  surfaces: Locator,
  context: string,
  assertion: SurfaceAssertion
): Promise<void> {
  const surfaceCount = await surfaces.count()

  for (let surfaceIndex = 0; surfaceIndex < surfaceCount; surfaceIndex += 1) {
    const surface = surfaces.nth(surfaceIndex)
    await expect(surface).toBeVisible()
    assertion(
      await readResolvedSurfaceMetrics(surface),
      `${context} ${surfaceIndex + 1}`
    )
  }
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
  const dataTable = tableWrap.locator('.ntk-data-table')
  const table = dataTable.locator('table').first()
  const tableHeaderCells = table.locator('thead th:visible')
  const tableBodyCells = table.locator('tbody td:visible')
  const tableStatusChips = dataTable.locator('.ntk-data-table__status:visible')
  const tableRowActions = dataTable.locator('.ntk-data-table__row-action:visible')
  const activeFilter = page.locator('.ntk-template-crud-list__filter--active').first()
  const visibleFilters = page.locator('.ntk-template-crud-list__filter:visible')
  const viewToggle = page.locator('.ntk-template-crud-list__view--active').first()
  const metrics = page.locator('.ntk-template-crud-list__metric:visible')
  const pagination = page.locator('.ntk-template-crud-list__pagination:visible, .q-pagination:visible')
  const paginationControls = page.locator(
    '.ntk-template-crud-list__pagination .q-btn:visible, .q-pagination .q-btn:visible, '
    + '.ntk-template-crud-list__pagination button:visible, .q-pagination button:visible'
  )
  const footer = page.locator('.ntk-template-crud-list__footer:visible, .q-table__bottom:visible')
  const footerControls = page.locator(
    '.ntk-template-crud-list__footer .q-btn:visible, .q-table__bottom .q-btn:visible, '
    + '.ntk-template-crud-list__footer button:visible, .q-table__bottom button:visible, '
    + '.ntk-template-crud-list__footer .q-field__control:visible, .q-table__bottom .q-field__control:visible, '
    + '.ntk-template-crud-list__footer .q-table__bottom-item:visible, .q-table__bottom .q-table__bottom-item:visible'
  )

  await expect(searchSurface).toBeVisible()
  await page.getByRole('button', { name: tableToggleLabel }).click()
  await expect(tableWrap).toBeVisible()
  await expect(dataTable).toHaveAttribute('aria-label', tableLabel)
  await expect(tableHeaderCells.first()).toBeVisible()
  await expect(tableBodyCells.first()).toBeVisible()
  await expect(activeFilter).toBeVisible()
  await expect(viewToggle).toBeVisible()

  expectDarkReadableSurface(
    await readResolvedSurfaceMetrics(searchSurface, searchInput),
    `${themeId} ${route} search surface`
  )
  expectDarkReadableSurface(
    await readResolvedSurfaceMetrics(tableWrap, tableHeaderCells.first()),
    `${themeId} ${route} table surface`
  )

  await expectAllVisibleSurfaces(
    tableHeaderCells,
    `${themeId} ${route} visible table header cell`,
    expectDarkReadableSurface
  )

  await expectAllVisibleSurfaces(
    tableBodyCells,
    `${themeId} ${route} visible table body cell`,
    expectDarkReadableSurface
  )

  const filterCount = await visibleFilters.count()
  expect(filterCount, `${themeId} ${route} should render filter controls`).toBeGreaterThan(0)

  for (let filterIndex = 0; filterIndex < filterCount; filterIndex += 1) {
    const filter = visibleFilters.nth(filterIndex)
    await expect(filter).toBeVisible()
    expectReadableSurface(
      await readResolvedSurfaceMetrics(filter),
      `${themeId} ${route} filter ${filterIndex + 1}`
    )
  }

  const metricCount = await metrics.count()
  expect(metricCount, `${themeId} ${route} should render metric chips`).toBeGreaterThan(0)

  for (let metricIndex = 0; metricIndex < metricCount; metricIndex += 1) {
    const metric = metrics.nth(metricIndex)
    await expect(metric).toBeVisible()
    expectReadableSurface(
      await readResolvedSurfaceMetrics(metric),
      `${themeId} ${route} metric chip ${metricIndex + 1}`
    )
  }

  const statusChipCount = await tableStatusChips.count()
  expect(statusChipCount, `${themeId} ${route} should render status chips`).toBeGreaterThan(0)

  for (let statusIndex = 0; statusIndex < statusChipCount; statusIndex += 1) {
    const statusChip = tableStatusChips.nth(statusIndex)
    await expect(statusChip).toBeVisible()
    expectReadableSurface(
      await readResolvedSurfaceMetrics(statusChip),
      `${themeId} ${route} status chip ${statusIndex + 1}`
    )
  }

  const rowActionCount = await tableRowActions.count()
  expect(rowActionCount, `${themeId} ${route} should render row actions`).toBeGreaterThan(0)

  for (let actionIndex = 0; actionIndex < rowActionCount; actionIndex += 1) {
    const rowAction = tableRowActions.nth(actionIndex)
    await expect(rowAction).toBeVisible()
    expectReadableSurface(
      await readResolvedSurfaceMetrics(rowAction),
      `${themeId} ${route} row action ${actionIndex + 1}`
    )
  }

  expectDarkReadableSurface(
    await readResolvedSurfaceMetrics(viewToggle),
    `${themeId} ${route} active view toggle`
  )

  if (await pagination.count() > 0) {
    await expectOptionalVisibleSurfaces(
      pagination,
      `${themeId} ${route} pagination surface`,
      expectDarkReadableSurface
    )
    await expectOptionalVisibleSurfaces(
      paginationControls,
      `${themeId} ${route} pagination control`,
      expectReadableSurface
    )
  }

  if (await footer.count() > 0) {
    await expectOptionalVisibleSurfaces(
      footer,
      `${themeId} ${route} table footer surface`,
      expectDarkReadableSurface
    )
    await expectOptionalVisibleSurfaces(
      footerControls,
      `${themeId} ${route} table footer control`,
      expectReadableSurface
    )
  }
}

async function assertOverlayDarkSurfaces(page: Page, themeId: string): Promise<void> {
  const userMenuTrigger = page.locator('.ntk-template-user-menu__trigger')

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

  const assistantTrigger = page.getByLabel(/open assistant/i)
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

async function assertSettingsDarkSurfaces(page: Page, themeId: string): Promise<void> {
  await page.goto(`${RUNTIME_BASE}#/settings`)
  await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible()

  const hero = page.locator('.ntk-template-runtime-settings__hero')
  const heroTitle = hero.locator('h1')
  const summaryCard = page.locator('.ntk-template-runtime-settings__summary-card').first()
  const summaryValue = summaryCard.locator('strong')
  const workspaceInput = page.locator('input[name="runtime-workspace-name"]')
  const firstToggle = page.locator('.ntk-template-runtime-settings__toggle').first()
  const firstToggleTitle = firstToggle.locator('strong')

  await expect(hero).toBeVisible()
  await expect(summaryCard).toBeVisible()
  await expect(workspaceInput).toBeVisible()
  await expect(firstToggle).toBeVisible()

  expectDarkReadableSurface(
    await readResolvedSurfaceMetrics(hero, heroTitle),
    `${themeId} settings hero`
  )
  expectDarkReadableSurface(
    await readResolvedSurfaceMetrics(summaryCard, summaryValue),
    `${themeId} settings summary card`
  )
  expectDarkReadableSurface(
    await readResolvedSurfaceMetrics(workspaceInput),
    `${themeId} settings workspace input`
  )
  expectDarkReadableSurface(
    await readResolvedSurfaceMetrics(firstToggle, firstToggleTitle),
    `${themeId} settings toggle row`
  )
}

async function assertProfileDarkSurfaces(page: Page, themeId: string): Promise<void> {
  await page.goto(`${RUNTIME_BASE}#/profile`)
  await expect(page.getByRole('heading', { name: 'Admin NetToolsKit' })).toBeVisible()

  const hero = page.locator('.ntk-template-profile__hero')
  const heroTitle = hero.locator('.ntk-template-profile__title')
  const roleBadge = page.locator('.ntk-template-profile__role-badge').first()
  const profileCard = page.locator('.ntk-template-profile__card').first()
  const rowValue = profileCard.locator('.ntk-template-profile__row-value').first()
  const logoutButton = page.locator('.ntk-template-profile__logout-btn').first()

  await expect(hero).toBeVisible()
  await expect(roleBadge).toBeVisible()
  await expect(profileCard).toBeVisible()

  expectDarkReadableSurface(
    await readResolvedSurfaceMetrics(hero, heroTitle),
    `${themeId} profile hero`
  )
  expectReadableSurface(
    await readResolvedSurfaceMetrics(roleBadge),
    `${themeId} profile role badge`
  )
  expectDarkReadableSurface(
    await readResolvedSurfaceMetrics(profileCard, rowValue),
    `${themeId} profile details card`
  )

  if (await logoutButton.isVisible()) {
    expectReadableSurface(
      await readResolvedSurfaceMetrics(logoutButton),
      `${themeId} profile logout action`
    )
  }
}

async function assertWikiDarkSurfaces(page: Page, themeId: string): Promise<void> {
  await page.goto(`${RUNTIME_BASE}#/knowledge`)
  await expect(page.getByRole('heading', { name: 'Knowledge base' })).toBeVisible()

  const hero = page.locator('.ntk-template-wiki__hero')
  const heroTitle = hero.locator('.ntk-template-wiki__hero-title')
  const heroChip = page.locator('.ntk-template-wiki__chip').first()
  const heroChipText = heroChip.locator('span').last()
  const sidebar = page.locator('.ntk-template-wiki__sidebar')
  const sidebarTitle = sidebar.locator('.ntk-template-wiki__sidebar-title')
  const sidebarSearch = page.locator('.ntk-template-wiki__sidebar-search')
  const sidebarSearchInput = page.locator('.ntk-template-wiki__sidebar .ntk-template-wiki__search-input').first()
  const contentSearch = page.locator('.ntk-template-wiki__toolbar .ntk-template-wiki__search')
  const contentSearchInput = page.locator('.ntk-template-wiki__toolbar .ntk-template-wiki__search-input').first()
  const firstTreeItem = page.locator('.ntk-template-wiki__tree-item').first()
  const wikiSurface = page.locator('.ntk-template-wiki__surface')
  const activeFilter = page.locator('.ntk-template-wiki__filter--active').first()
  const tableHeaderCells = page.locator('.ntk-template-wiki__table th:visible')
  const tableBodyCells = page.locator('.ntk-template-wiki__table tbody td:visible')

  await expect(hero).toBeVisible()
  await expect(sidebar).toBeVisible()
  await expect(sidebarSearch).toBeVisible()
  await expect(contentSearch).toBeVisible()
  await expect(wikiSurface).toBeVisible()
  await expect(tableHeaderCells.first()).toBeVisible()
  await expect(tableBodyCells.first()).toBeVisible()
  await firstTreeItem.click()

  const activeTreeItem = page.locator('.ntk-template-wiki__tree-item--active').first()
  const activeTreeLabel = activeTreeItem.locator('.ntk-template-wiki__tree-label')

  await expect(activeTreeItem).toBeVisible()
  await expect(activeFilter).toBeVisible()
  await expect(heroChip).toBeVisible()

  expectDarkReadableSurface(
    await readResolvedSurfaceMetrics(hero, heroTitle),
    `${themeId} knowledge hero`
  )
  expectReadableSurface(
    await readResolvedSurfaceMetrics(heroChip, heroChipText),
    `${themeId} knowledge hero chip`
  )
  expectDarkReadableSurface(
    await readResolvedSurfaceMetrics(sidebar, sidebarTitle),
    `${themeId} knowledge sidebar`
  )
  expectDarkReadableSurface(
    await readResolvedSurfaceMetrics(sidebarSearch, sidebarSearchInput),
    `${themeId} knowledge category search`
  )
  expectDarkReadableSurface(
    await readResolvedSurfaceMetrics(contentSearch, contentSearchInput),
    `${themeId} knowledge content search`
  )
  expectReadableSurface(
    await readResolvedSurfaceMetrics(activeTreeItem, activeTreeLabel),
    `${themeId} knowledge active tree item`
  )
  expectReadableSurface(
    await readResolvedSurfaceMetrics(activeFilter),
    `${themeId} knowledge active filter`
  )
  expectDarkReadableSurface(
    await readResolvedSurfaceMetrics(wikiSurface, tableHeaderCells.first()),
    `${themeId} knowledge content surface`
  )

  await expectAllVisibleSurfaces(
    tableHeaderCells,
    `${themeId} knowledge table header cell`,
    expectDarkReadableSurface
  )
  await expectAllVisibleSurfaces(
    tableBodyCells,
    `${themeId} knowledge table body cell`,
    expectDarkReadableSurface
  )
}

async function assertKnowledgeChatDarkSurfaces(page: Page, themeId: string): Promise<void> {
  await page.goto(`${RUNTIME_BASE}#/knowledge/chat`)

  const chatShell = page.locator('.ntk-template-wiki-chat__chat')
  const chatTitle = page.locator('.ntk-template-wiki-chat__chat-title')
  const sidebar = page.locator('.ntk-template-wiki-chat__sidebar')
  const sidebarTitle = page.locator('.ntk-template-wiki-chat__sidebar-title')
  const activeConversation = page.locator('.ntk-template-wiki-chat__conversation--active').first()
  const activeConversationTitle = activeConversation.locator('.ntk-template-wiki-chat__conversation-title')
  const messageBubble = page.locator('.ntk-template-wiki-chat__message-content').first()
  const sourceCard = page.locator('.ntk-template-wiki-chat__source').first()
  const sourceTitle = sourceCard.locator('strong').first()
  const inputWrap = page.locator('.ntk-template-wiki-chat__input-wrap')
  const input = page.locator('.ntk-template-wiki-chat__input')
  const startNewConversationButton = page.getByRole('button', { name: 'Start new conversation' }).first()

  await expect(page.locator('.ntk-template-wiki-chat__chat-subtitle')).toContainText('Chat with the local base')
  await expect(chatShell).toBeVisible()
  await expect(sidebar).toBeVisible()
  await expect(activeConversation).toBeVisible()
  await expect(messageBubble).toBeVisible()
  await expect(sourceCard).toBeVisible()
  await expect(inputWrap).toBeVisible()

  expectDarkReadableSurface(
    await readResolvedSurfaceMetrics(chatShell, chatTitle),
    `${themeId} knowledge chat shell`
  )
  expectDarkReadableSurface(
    await readResolvedSurfaceMetrics(sidebar, sidebarTitle),
    `${themeId} knowledge chat sidebar`
  )
  expectReadableSurface(
    await readResolvedSurfaceMetrics(activeConversation, activeConversationTitle),
    `${themeId} knowledge active conversation`
  )
  expectDarkReadableSurface(
    await readResolvedSurfaceMetrics(messageBubble),
    `${themeId} knowledge message bubble`
  )
  expectDarkReadableSurface(
    await readResolvedSurfaceMetrics(sourceCard, sourceTitle),
    `${themeId} knowledge source card`
  )
  expectDarkReadableSurface(
    await readResolvedSurfaceMetrics(inputWrap, input),
    `${themeId} knowledge chat input`
  )

  await startNewConversationButton.click()

  const emptyIcon = page.locator('.ntk-template-wiki-chat__empty-icon')
  const emptyTitle = page.locator('.ntk-template-wiki-chat__empty-title')
  const suggestion = page.locator('.ntk-template-wiki-chat__suggestion').first()
  const suggestionText = suggestion.locator('span').first()
  const disabledSendButton = page.locator('.ntk-template-wiki-chat__send')

  await expect(emptyIcon).toBeVisible()
  await expect(suggestion).toBeVisible()
  await expect(disabledSendButton).toBeDisabled()

  expectReadableSurface(
    await readResolvedSurfaceMetrics(emptyIcon),
    `${themeId} knowledge empty icon`
  )
  expectDarkReadableSurface(
    await readResolvedSurfaceMetrics(suggestion, suggestionText),
    `${themeId} knowledge suggestion card`
  )
  expectReadableSurface(
    await readResolvedSurfaceMetrics(disabledSendButton),
    `${themeId} knowledge disabled send action`
  )
  expect(
    await emptyTitle.textContent(),
    `${themeId} knowledge empty title should stay available after resetting the conversation`
  ).not.toBeNull()
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
      await resetRuntimeState(page, { themeId: theme.id })
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
        'Clients',
        'Search clients',
        'Switch to clients table',
        'Clients table',
        theme.id
      )
      await assertCrudDarkSurfaces(
        page,
        'orders',
        'Orders',
        'Search orders',
        'Switch to orders table',
        'Orders table',
        theme.id
      )
    })

    test(`keeps teleported Quasar overlays dark and legible in ${theme.label}`, async ({ page }) => {
      await resetRuntimeState(page)
      await loginToRuntime(page)
      await activateTheme(page, theme)

      await assertOverlayDarkSurfaces(page, theme.id)
    })

    test(`keeps settings, profile and knowledge surfaces dark and legible in ${theme.label}`, async ({ page }) => {
      await resetRuntimeState(page)
      await loginToRuntime(page)
      await activateTheme(page, theme)

      await assertSettingsDarkSurfaces(page, theme.id)
      await assertProfileDarkSurfaces(page, theme.id)
      await assertWikiDarkSurfaces(page, theme.id)
    })

    test(`keeps knowledge chat surfaces dark and legible in ${theme.label}`, async ({ page }) => {
      await resetRuntimeState(page, {
        chatSnapshot: createSeededChatSnapshot(),
      })
      await loginToRuntime(page)
      await activateTheme(page, theme)

      await assertKnowledgeChatDarkSurfaces(page, theme.id)
    })
  }
})
