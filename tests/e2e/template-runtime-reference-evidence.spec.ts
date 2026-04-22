import { expect, test, type Locator, type Page, type TestInfo } from '@playwright/test'
import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'

const PROJECT_ROOT = process.cwd()
const REFERENCE_ROOT = path.join(PROJECT_ROOT, '.temp', 'reference', 'src')
const EVIDENCE_DIR = path.join(PROJECT_ROOT, '.build', 'evidence', 'reference-visual-comparison')
const RUNTIME_BASE = '/?template-runtime=1'
const RUNTIME_LOGIN_URL = `${RUNTIME_BASE}#/auth/login`

const REFERENCE_LOGOS = [
  'assets/images/logo.png',
  'assets/images/smb-logo-full.png',
  'assets/images/smb-logo-white.png',
] as const

const REFERENCE_MENU_CONTRACT = [
  { text: 'Dashboard', icon: 'dashboard', referencePath: 'pipeline', sampleId: 'dashboard' },
  { text: 'Clientes', icon: 'people', referencePath: 'clients', sampleId: 'clients' },
  { text: 'Pedidos', icon: 'shopping_cart', referencePath: 'orders', sampleId: 'orders' },
  { text: 'Configuracoes', icon: 'settings', referencePath: 'configurations', sampleId: 'configurations' },
] as const

const RUNTIME_REFERENCE_ROUTES = [
  { path: '', name: 'TemplateRuntimeDashboard' },
  { path: 'clients', name: 'TemplateRuntimeClients' },
  { path: 'orders', name: 'TemplateRuntimeOrders' },
  { path: 'settings', name: 'TemplateRuntimeSettings' },
  { path: 'reports', name: 'TemplateRuntimeReports' },
  { path: 'profile', name: 'TemplateRuntimeProfile' },
] as const

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

    for (const menuLabel of ['Dashboard', 'Clientes', 'Pedidos']) {
      await expectMenuItem(page, menuLabel)
    }
    await expectMenuItem(page, /Configura/)

    await (await expectMenuItem(page, 'Clientes')).click()
    await expect(page.locator('.ntk-template-placeholder')).toBeVisible()

    await (await expectMenuItem(page, 'Pedidos')).click()
    await expect(page.locator('.ntk-template-placeholder')).toBeVisible()

    await (await expectMenuItem(page, /Configura/)).click()
    await expect(page.locator('.ntk-template-placeholder')).toBeVisible()

    await (await expectMenuItem(page, 'Dashboard')).click()
    await expect(page.locator('.ntk-template-dashboard')).toBeVisible()

    const userMenuTrigger = page.locator('.ntk-template-user-menu__trigger').first()
    await expect(userMenuTrigger.locator('.ntk-template-user-menu__avatar')).toHaveText('AN')
    await userMenuTrigger.click()

    const userMenu = page.locator('.ntk-template-user-menu').last()
    await captureElement(userMenu, 'original-reference-user-menu.png', testInfo)

    const manifestPath = writeEvidenceManifest('original-reference-contract.json', {
      generatedAt: new Date().toISOString(),
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

    for (const menuLabel of ['Dashboard', 'Clientes', 'Pedidos', 'Wiki', 'Assistente']) {
      await expectMenuItem(page, menuLabel)
    }
    await expectMenuItem(page, /Configura/)

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

    await page.goto(`${RUNTIME_BASE}#/clients`)
    await expect(page.getByRole('heading', { name: 'Clientes' })).toBeVisible()
    await page.getByRole('button', { name: 'Alternar para tabela de clientes' }).click()
    await captureElement(page.locator('.ntk-template-crud-list__table-wrap'), 'template-runtime-warp-clients-table.png', testInfo)

    const manifestPath = writeEvidenceManifest('template-runtime-reference-evidence.json', {
      generatedAt: new Date().toISOString(),
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
})
