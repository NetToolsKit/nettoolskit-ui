import { expect, test, type Locator, type Page, type TestInfo } from '@playwright/test'
import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'

const PROJECT_ROOT = process.cwd()
const REFERENCE_ROOT = path.join(PROJECT_ROOT, '.temp', 'reference', 'src')
const EVIDENCE_DIR = path.join(PROJECT_ROOT, '.build', 'evidence', 'reference-visual-comparison')
const RUNTIME_BASE = '/?template-runtime=1'
const RUNTIME_LOGIN_URL = `${RUNTIME_BASE}#/auth/login`
const EVIDENCE_SCHEMA_VERSION = '2026-04-22.vue-quasar-reference-evidence.v1'

const REFERENCE_LOGOS = [
  'assets/images/logo.png',
  'assets/images/smb-logo-full.png',
  'assets/images/smb-logo-white.png',
] as const

const REFERENCE_MENU_CONTRACT = [
  { text: 'Dashboard', icon: 'dashboard', referencePath: 'pipeline', sampleId: 'dashboard' },
  { text: 'Clients', icon: 'people', referencePath: 'clients', sampleId: 'clients' },
  { text: 'Orders', icon: 'shopping_cart', referencePath: 'orders', sampleId: 'orders' },
  { text: 'Settings', icon: 'settings', referencePath: 'configurations', sampleId: 'configurations' },
] as const

const RUNTIME_REFERENCE_ROUTES = [
  { path: '', name: 'TemplateRuntimeDashboard' },
  { path: 'clients', name: 'TemplateRuntimeClients' },
  { path: 'orders', name: 'TemplateRuntimeOrders' },
  { path: 'settings', name: 'TemplateRuntimeSettings' },
  { path: 'reports', name: 'TemplateRuntimeReports' },
  { path: 'profile', name: 'TemplateRuntimeProfile' },
] as const

const REFERENCE_PROJECT_PARITY = [
  {
    project: 'Directus',
    source: 'https://github.com/directus/directus',
    usefulPattern: 'Data-model-first admin shell and collection navigation polish',
    localSignal: 'QLayout shell, resource menu parity, table/list surface evidence',
    priority: 'P1',
  },
  {
    project: 'Strapi',
    source: 'https://github.com/strapi/strapi',
    usefulPattern: 'CMS/content-model admin separation and plugin-like extension surfaces',
    localSignal: 'Settings and CMS/runtime routes stay separated from backend concerns',
    priority: 'P1',
  },
  {
    project: 'Budibase',
    source: 'https://github.com/Budibase/budibase',
    usefulPattern: 'Internal-app builder preview and workflow authoring UX',
    localSignal: 'Template runtime route catalog can support future preview/inspector evidence',
    priority: 'P2',
  },
  {
    project: 'OpenBlocks',
    source: 'https://github.com/openblocks-dev/openblocks',
    usefulPattern: 'Retool-style component inspector, binding editor, and live preview',
    localSignal: 'Future builder backlog only; no backend dependency introduced by this evidence',
    priority: 'P2',
  },
  {
    project: 'Frappe',
    source: 'https://github.com/frappe/frappe',
    usefulPattern: 'Metadata-driven forms/lists and enterprise workflow state UX',
    localSignal: 'CRUD list and settings surfaces remain schema-friendly and tokenized',
    priority: 'P2',
  },
  {
    project: 'Corteza',
    source: 'https://github.com/cortezaproject/corteza',
    usefulPattern: 'Low-code modules, RBAC-aware pages, workflows, and governance UX',
    localSignal: 'Navigation and route matrix can be extended with permission-aware evidence',
    priority: 'P2',
  },
  {
    project: 'Appwrite',
    source: 'https://github.com/appwrite/appwrite',
    usefulPattern: 'Platform console resource cards and onboarding clarity',
    localSignal: 'Dashboard cards and settings cards provide resource-console evidence points',
    priority: 'P3',
  },
  {
    project: 'Skyve',
    source: 'https://github.com/skyvers/skyve',
    usefulPattern: 'Enterprise low-code validation, workflow, and audit concepts',
    localSignal: 'Governance concepts tracked as UI-only backlog, not backend work',
    priority: 'P3',
  },
] as const

interface ComplianceSignal {
  status: 'pass' | 'risk'
  evidence: string
  details: Record<string, unknown>
}

type ComplianceMatrix = Record<string, ComplianceSignal>

function ensureReferenceProject(): void {
  expect(
    existsSync(REFERENCE_ROOT),
    'The visual evidence suite needs the local reference project at .temp/reference/src'
  ).toBe(true)
}

function fileHash(filePath: string): string {
  return createHash('sha256').update(readFileSync(filePath)).digest('hex')
}

function readProjectFile(relativePath: string): string {
  return readFileSync(path.join(PROJECT_ROOT, relativePath), 'utf8')
}

function ensureEvidenceDir(): void {
  mkdirSync(EVIDENCE_DIR, { recursive: true })
}

async function attachFile(testInfo: TestInfo, name: string, filePath: string, contentType: string): Promise<void> {
  await testInfo.attach(name, {
    path: filePath,
    contentType,
  })
}

async function captureElement(locator: Locator, fileName: string, testInfo: TestInfo): Promise<string> {
  ensureEvidenceDir()
  const filePath = path.join(EVIDENCE_DIR, fileName)

  await expect(locator, `${fileName} target should be visible before capture`).toBeVisible()
  await locator.screenshot({
    path: filePath,
    animations: 'disabled',
    caret: 'hide',
  })
  await attachFile(testInfo, fileName, filePath, 'image/png')

  return filePath
}

function writeEvidenceManifest(fileName: string, data: unknown): string {
  ensureEvidenceDir()
  const filePath = path.join(EVIDENCE_DIR, fileName)
  writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8')
  return filePath
}

async function readElementContract(locator: Locator): Promise<Record<string, unknown>> {
  return await locator.evaluate((element) => {
    const styles = window.getComputedStyle(element)
    const rect = element.getBoundingClientRect()

    return {
      backgroundColor: styles.backgroundColor,
      color: styles.color,
      borderColor: styles.borderColor,
      width: Math.round(rect.width),
      height: Math.round(rect.height),
      role: element.getAttribute('role'),
      ariaLabel: element.getAttribute('aria-label'),
      className: element.className,
    }
  })
}

async function readThemeBridgeContract(page: Page): Promise<Record<string, unknown>> {
  return await page.evaluate(() => {
    const styles = window.getComputedStyle(document.documentElement)
    const tokenNames = [
      '--ntk-primary',
      '--ntk-bg-card',
      '--ntk-text',
      '--ntk-border',
      '--q-primary',
      '--q-secondary',
      '--q-accent',
    ]

    return {
      activeTheme: document.documentElement.dataset.theme ?? '',
      darkScheme: styles.getPropertyValue('--ntk-dark-scheme').trim(),
      bodyDark: document.body.classList.contains('body--dark'),
      bodyLight: document.body.classList.contains('body--light'),
      tokens: Object.fromEntries(tokenNames.map(tokenName => [
        tokenName,
        styles.getPropertyValue(tokenName).trim(),
      ])),
      colorScheme: styles.colorScheme,
    }
  })
}

async function readContrastContract(locator: Locator, textSource: Locator = locator): Promise<Record<string, unknown>> {
  return await locator.evaluate((surfaceElement, textElement) => {
    type RgbTriplet = [number, number, number]
    type RgbaColor = { red: number; green: number; blue: number; alpha: number }

    function parseBrowserColor(value: string): RgbaColor | null {
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

    function composite(top: RgbaColor, bottom: RgbaColor): RgbaColor {
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

    function toRgbTriplet(color: RgbaColor): RgbTriplet {
      return [
        Math.round(color.red),
        Math.round(color.green),
        Math.round(color.blue),
      ]
    }

    function toRgbString(color: RgbaColor): string {
      const [red, green, blue] = toRgbTriplet(color)
      return `rgb(${red}, ${green}, ${blue})`
    }

    function resolveBackgroundColor(element: Element): RgbaColor {
      const layers: RgbaColor[] = []
      let current: Element | null = element

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

      return layers
        .reverse()
        .reduce((accumulator, layer) => composite(layer, accumulator), bodyBackground)
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

    const surfaceStyles = window.getComputedStyle(surfaceElement)
    const textStyles = window.getComputedStyle(textElement as Element)
    const resolvedBackground = resolveBackgroundColor(surfaceElement)
    const color = textStyles.color
    const textColor = parseBrowserColor(color)

    if (!textColor) {
      throw new Error(`Unsupported CSS color format: ${color}`)
    }

    return {
      backgroundColor: surfaceStyles.backgroundColor,
      resolvedBackgroundColor: toRgbString(resolvedBackground),
      color,
      contrastRatio: Number(contrastRatio(toRgbTriplet(textColor), toRgbTriplet(resolvedBackground)).toFixed(2)),
    }
  }, await textSource.elementHandle())
}

async function resetBrowserState(page: Page, themeId = 'revolut'): Promise<void> {
  await page.goto('/')
  await page.evaluate((selectedThemeId) => {
    window.localStorage.clear()
    window.sessionStorage.clear()
    window.localStorage.setItem('ntk-theme', selectedThemeId)
  }, themeId)
}

async function loginToRuntime(page: Page): Promise<void> {
  await page.goto(RUNTIME_LOGIN_URL)
  await expect(page.locator('.ntk-template-login__form-shell')).toBeVisible()

  await page.locator('input[aria-label="Email input"]').fill('ops@nettoolskit.dev')
  await page.locator('input[aria-label="Password input"]').fill('demo-password')
  await page.getByRole('button', { name: 'Submit login form' }).click()

  await expect(page).toHaveURL(/template-runtime=1#\/?$/)
  await expect(page.locator('.ntk-template-dashboard')).toBeVisible()
}

async function expectMenuItem(page: Page, label: string | RegExp): Promise<Locator> {
  const menuItem = page.locator('.ntk-template-menu-link').filter({ hasText: label }).first()
  await expect(menuItem, `Menu item ${String(label)} should be visible`).toBeVisible()
  return menuItem
}

async function ensureClientsTableSurface(page: Page): Promise<Locator> {
  await page.goto(`${RUNTIME_BASE}#/clients`)
  await expect(page.getByRole('heading', { name: 'Clients' })).toBeVisible()

  const tableHost = page.locator('.ntk-data-table').first()
  const tableSurface = page.locator('.ntk-template-crud-list__surface').first()

  if (await tableHost.count() === 0) {
    await page.getByRole('button', { name: 'Switch to clients table' }).click()
  }

  await expect(tableHost).toHaveCount(1)
  await expect(tableSurface).toBeVisible()

  return tableSurface
}

function expectComplianceSignal(signal: boolean, evidence: string, details: Record<string, unknown>): ComplianceSignal {
  expect(signal, evidence).toBe(true)

  return recordComplianceSignal('pass', evidence, details)
}

function recordComplianceSignal(
  status: ComplianceSignal['status'],
  evidence: string,
  details: Record<string, unknown>
): ComplianceSignal {
  return {
    status,
    evidence,
    details,
  }
}

function expectContrastReady(contract: Record<string, unknown>, context: string): void {
  expect(
    Number(contract.contrastRatio),
    `${context} should keep WCAG-readable text contrast`
  ).toBeGreaterThanOrEqual(4)
}

test.describe('reference based visual evidence', () => {
  test('keeps samples aligned to the local reference assets and primary menu', async ({ page }, testInfo) => {
    ensureReferenceProject()
    await resetBrowserState(page)

    const referenceLogoHashes = REFERENCE_LOGOS.map(relativeAssetPath => ({
      referenceAsset: relativeAssetPath,
      hash: fileHash(path.join(REFERENCE_ROOT, relativeAssetPath)),
    }))
    const sampleLogoPath = path.join(PROJECT_ROOT, 'samples', 'assets', 'reference-header-logo.png')
    const sampleLogoHash = fileHash(sampleLogoPath)

    for (const referenceLogo of referenceLogoHashes) {
      expect(referenceLogo.hash, `${referenceLogo.referenceAsset} should match the sample header logo`).toBe(sampleLogoHash)
    }

    const referenceMenuSource = readProjectFile('.temp/reference/src/shared/constants/menu.constants.ts')
    const sampleAppSource = readProjectFile('samples/original-reference/OriginalReferenceApp.vue')

    for (const item of REFERENCE_MENU_CONTRACT) {
      expect(referenceMenuSource).toContain(`icon: '${item.icon}'`)
      expect(referenceMenuSource).toContain(`to: '${item.referencePath}'`)
      expect(sampleAppSource).toContain(`icon: '${item.icon}'`)
      expect(sampleAppSource).toContain(`id: '${item.sampleId}'`)
    }

    await page.goto('/')
    await expect(page.locator('.ntk-original-reference')).toBeVisible()
    await expect(page.locator('.ntk-template-dashboard')).toBeVisible()

    await captureElement(page.locator('.ntk-original-reference'), 'original-reference-dashboard.png', testInfo)

    for (const menuLabel of ['Dashboard', 'Clients', 'Orders']) {
      await expectMenuItem(page, menuLabel)
    }
    await expectMenuItem(page, /Settings/)

    await (await expectMenuItem(page, 'Clients')).click()
    await expect(page.locator('.ntk-template-placeholder')).toBeVisible()

    await (await expectMenuItem(page, 'Orders')).click()
    await expect(page.locator('.ntk-template-placeholder')).toBeVisible()

    await (await expectMenuItem(page, /Settings/)).click()
    await expect(page.locator('.ntk-template-placeholder')).toBeVisible()

    await (await expectMenuItem(page, 'Dashboard')).click()
    await expect(page.locator('.ntk-template-dashboard')).toBeVisible()

    const userMenuTrigger = page.locator('.ntk-template-user-menu__trigger').first()
    await expect(userMenuTrigger.locator('.ntk-template-user-menu__avatar')).toHaveText('AN')
    await userMenuTrigger.click()

    const userMenu = page.locator('.ntk-template-user-menu').last()
    await captureElement(userMenu, 'original-reference-user-menu.png', testInfo)

    const manifestPath = writeEvidenceManifest('original-reference-contract.json', {
      schemaVersion: EVIDENCE_SCHEMA_VERSION,
      referenceRoot: '.temp/reference/src',
      sampleApp: 'samples/original-reference/OriginalReferenceApp.vue',
      sampleLogo: 'samples/assets/reference-header-logo.png',
      referenceLogoHashes,
      sampleLogoHash,
      menuContract: REFERENCE_MENU_CONTRACT,
      screenshots: [
        'original-reference-dashboard.png',
        'original-reference-user-menu.png',
      ],
    })
    await attachFile(testInfo, 'original-reference-contract.json', manifestPath, 'application/json')
  })

  test('captures runtime evidence against reference-derived routes and surfaces', async ({ page }, testInfo) => {
    ensureReferenceProject()
    await resetBrowserState(page)
    await loginToRuntime(page)

    const runtimeRouterSource = readProjectFile('src/templates/runtime/router.ts')
    const referenceRoutesSource = readProjectFile('.temp/reference/src/router/routes.ts')

    for (const route of RUNTIME_REFERENCE_ROUTES) {
      expect(runtimeRouterSource).toContain(`path: '${route.path}'`)
      expect(runtimeRouterSource).toContain(`name: '${route.name}'`)
    }
    for (const referencePath of ['pipeline', 'clients', 'orders', 'configurations', 'reports', 'profile']) {
      expect(referenceRoutesSource).toContain(`path: '${referencePath}'`)
    }

    for (const menuLabel of ['Dashboard', 'Clients', 'Orders', 'Wiki', 'Assistant']) {
      await expectMenuItem(page, menuLabel)
    }
    await expectMenuItem(page, /Settings/)

    await page.goto(`${RUNTIME_BASE}#/`)
    await expect(page.locator('.ntk-template-dashboard')).toBeVisible()
    await expect(page.locator('.ntk-reference-dashboard-charts__chart--donut .highcharts-container')).toBeVisible()
    await expect(page.locator('.ntk-reference-dashboard-charts__chart--bars .highcharts-container')).toBeVisible()
    await expect(page.locator('.ntk-reference-dashboard-charts .highcharts-credits')).toHaveCount(0)
    await captureElement(page.locator('.ntk-reference-dashboard-charts'), 'template-runtime-reference-charts.png', testInfo)

    const userMenuTrigger = page.locator('.ntk-template-user-menu__trigger').first()
    await expect(userMenuTrigger.locator('.ntk-template-user-menu__avatar')).toHaveText('AN')
    await userMenuTrigger.click()
    await captureElement(page.locator('.ntk-template-user-menu').last(), 'template-runtime-user-menu.png', testInfo)
    await page.keyboard.press('Escape')

    await page.goto(`${RUNTIME_BASE}#/configurations`)
    await expect(page.locator('.ntk-template-runtime-settings__card').first()).toBeVisible()

    await page.goto(`${RUNTIME_BASE}#/reports`)
    await expect(page.locator('.ntk-template-placeholder')).toBeVisible()
    await captureElement(page.locator('.ntk-template-placeholder'), 'template-runtime-reports-route.png', testInfo)

    await page.getByRole('button', { name: 'Switch to Warp theme' }).click()
    await expect.poll(async () => {
      return await page.evaluate(() => document.documentElement.dataset.theme ?? '')
    }).toBe('warp')

    const clientsTableSurface = await ensureClientsTableSurface(page)
    await captureElement(clientsTableSurface, 'template-runtime-warp-clients-table.png', testInfo)

    const manifestPath = writeEvidenceManifest('template-runtime-reference-evidence.json', {
      schemaVersion: EVIDENCE_SCHEMA_VERSION,
      referenceRoot: '.temp/reference/src',
      runtimeRouter: 'src/templates/runtime/router.ts',
      routeContract: RUNTIME_REFERENCE_ROUTES,
      verifiedReferencePaths: ['pipeline', 'clients', 'orders', 'configurations', 'reports', 'profile'],
      verifiedRuntimeAdditions: ['knowledge', 'knowledge/chat'],
      screenshots: [
        'template-runtime-reference-charts.png',
        'template-runtime-user-menu.png',
        'template-runtime-reports-route.png',
        'template-runtime-warp-clients-table.png',
      ],
    })
    await attachFile(testInfo, 'template-runtime-reference-evidence.json', manifestPath, 'application/json')
  })

  test('writes a Vue Quasar compliance matrix for enterprise reference review', async ({ page }, testInfo) => {
    ensureReferenceProject()
    await resetBrowserState(page)
    await loginToRuntime(page)

    const complianceMatrix: ComplianceMatrix = {}

    const themeBridge = await readThemeBridgeContract(page)
    const themeTokens = themeBridge.tokens as Record<string, string>

    complianceMatrix.themeTokenBridge = expectComplianceSignal(
      themeBridge.activeTheme === 'revolut'
        && themeBridge.bodyLight === true
        && themeBridge.bodyDark === false
        && Boolean(themeTokens['--ntk-primary'])
        && Boolean(themeTokens['--ntk-bg-card'])
        && Boolean(themeTokens['--q-primary']),
      'Theme contract resolves both NetToolsKit tokens and Quasar brand variables.',
      themeBridge
    )

    const shell = page.locator('.q-layout').first()
    const header = page.locator('.ntk-template-main-layout__header')
    const drawer = page.locator('.ntk-template-main-layout__drawer')
    const pageContainer = page.locator('.q-page-container').first()

    await expect(shell).toBeVisible()
    await expect(header).toBeVisible()
    await expect(drawer).toBeVisible()
    await expect(pageContainer).toBeVisible()

    complianceMatrix.qLayoutShellParity = expectComplianceSignal(
      true,
      'Runtime shell uses the Quasar layout primitives expected for enterprise admin navigation.',
      {
        shell: await readElementContract(shell),
        header: await readElementContract(header),
        drawer: await readElementContract(drawer),
        pageContainer: await readElementContract(pageContainer),
      }
    )

    const tableSurface = await ensureClientsTableSurface(page)
    const tableHost = page.locator('.ntk-data-table').first()
    const renderedQuasarTable = page
      .locator('.ntk-data-table.q-table__container, .ntk-data-table .q-table__container, .ntk-data-table .q-table')
      .first()
    const tableContrast = await readContrastContract(tableSurface)

    await expect(tableHost).toHaveCount(1)
    expectContrastReady(tableContrast, 'Light theme clients table')
    await captureElement(tableSurface, 'vue-quasar-matrix-clients-table.png', testInfo)

    const renderedQuasarContainerCount = await renderedQuasarTable.count()

    complianceMatrix.tableListSurface = expectComplianceSignal(
      renderedQuasarContainerCount > 0,
      'Client list/table surface is tokenized, labeled, and readable in the light reference theme.',
      {
        tableSurface: await readElementContract(tableSurface),
        tableHost: await readElementContract(tableHost),
        renderedQuasarContainerCount,
        contrast: tableContrast,
        visibleReferenceHeaders: await tableSurface.getByText(/Client|Status|Segment/).count(),
      }
    )

    const userMenuTrigger = page.locator('.ntk-template-user-menu__trigger').first()
    const avatar = userMenuTrigger.locator('.ntk-template-user-menu__avatar')

    await expect(userMenuTrigger).toBeVisible()
    await expect(avatar).toHaveText('AN')

    complianceMatrix.userInitialsAvatar = expectComplianceSignal(
      true,
      'User identity follows the reference initials avatar contract instead of a generic icon.',
      {
        trigger: await readElementContract(userMenuTrigger),
        avatar: await readElementContract(avatar),
        text: await avatar.textContent(),
      }
    )

    await userMenuTrigger.click()

    const userMenu = page.locator('.ntk-template-user-menu').last()
    const userName = userMenu.locator('.text-subtitle1').first()
    const overlayContrast = await readContrastContract(userMenu, userName)

    await expect(userMenu).toBeVisible()
    expectContrastReady(overlayContrast, 'Light theme user menu overlay')
    await captureElement(userMenu, 'vue-quasar-matrix-user-menu-overlay.png', testInfo)

    complianceMatrix.overlays = expectComplianceSignal(
      Number(overlayContrast.contrastRatio) >= 4,
      'Quasar overlay/menu surface remains branded and readable.',
      {
        menu: await readElementContract(userMenu),
        contrast: overlayContrast,
      }
    )

    await page.keyboard.press('Escape')
    await expect(userMenu).not.toBeVisible()

    await page.getByRole('button', { name: 'Switch to Warp theme' }).click()
    await expect.poll(async () => {
      return await page.evaluate(() => document.documentElement.dataset.theme ?? '')
    }).toBe('warp')

    const darkThemeBridge = await readThemeBridgeContract(page)
    const darkTableContrast = await readContrastContract(tableSurface)

    expectContrastReady(darkTableContrast, 'Warp dark theme clients table')
    await captureElement(tableSurface, 'vue-quasar-matrix-warp-clients-table.png', testInfo)

    complianceMatrix.darkContrastReadiness = expectComplianceSignal(
      darkThemeBridge.bodyDark === true
        && darkThemeBridge.bodyLight === false
        && Number(darkTableContrast.contrastRatio) >= 4,
      'Dark theme switches through Quasar dark mode and keeps the table/list surface readable.',
      {
        themeBridge: darkThemeBridge,
        tableContrast: darkTableContrast,
      }
    )

    const referenceMenuSource = readProjectFile('.temp/reference/src/shared/constants/menu.constants.ts')
    const runtimeRouterSource = readProjectFile('src/templates/runtime/router.ts')
    const matchedReferenceResources = REFERENCE_MENU_CONTRACT.map(item => ({
      label: item.text,
      icon: item.icon,
      referencePath: item.referencePath,
      sampleId: item.sampleId,
      referenceMenuHasIcon: referenceMenuSource.includes(`icon: '${item.icon}'`),
      runtimeHasMappedRoute: item.sampleId === 'configurations'
        ? runtimeRouterSource.includes("path: 'settings'") || runtimeRouterSource.includes("path: 'configurations'")
        : runtimeRouterSource.includes(`path: '${item.sampleId}'`) || item.sampleId === 'dashboard',
    }))

    complianceMatrix.referenceResourceParity = expectComplianceSignal(
      matchedReferenceResources.every(resource => resource.referenceMenuHasIcon && resource.runtimeHasMappedRoute),
      'Reference project resources are mapped into the sample/runtime evidence without backend dependency.',
      {
        referenceRoot: '.temp/reference/src',
        referenceMenuContract: matchedReferenceResources,
        adoptionBacklog: REFERENCE_PROJECT_PARITY,
      }
    )

    const manifestPath = writeEvidenceManifest('vue-quasar-compliance-matrix.json', {
      schemaVersion: EVIDENCE_SCHEMA_VERSION,
      scope: 'frontend-only reference evidence',
      officialSignals: {
        vue: [
          'Component output is verified through public DOM and accessible roles instead of internal implementation details.',
          'No backend state is required; runtime state is seeded through browser storage only.',
        ],
        quasar: [
          'Theme bridge resolves NetToolsKit tokens into Quasar brand variables.',
          'QLayout shell, dark mode body classes, menu overlay, and table/list surfaces are verified in-browser.',
        ],
      },
      complianceMatrix,
      referenceProjectParity: REFERENCE_PROJECT_PARITY,
      screenshots: [
        'vue-quasar-matrix-clients-table.png',
        'vue-quasar-matrix-user-menu-overlay.png',
        'vue-quasar-matrix-warp-clients-table.png',
      ],
    })

    await attachFile(testInfo, 'vue-quasar-compliance-matrix.json', manifestPath, 'application/json')
  })
})
