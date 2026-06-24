# Vue Quasar Enterprise Compliance Plan

Date: 2026-04-22
Status: active
Progress: 94%
Primary specialist: `dev-frontend-vue-quasar-engineer`
Tester: mandatory
Reviewer: mandatory before closeout
Release closeout: mandatory

## Scope Summary

Close the remaining frontend-only gaps that keep the shared Vue 3 + Quasar screens from being enterprise-grade across the full project surface. The work is limited to UI components, templates, theme tokens, tests, documentation, and visual evidence. Backend, API, database, CMS server behavior, and deployment changes are out of scope.

Reference standards:
- Vue official component contracts: props, emits, security, accessibility, and performance.
- Quasar official contracts: dynamic brand colors, dark mode, layout, table, avatar, input, menu, dialog, and notify surfaces.
- Existing white-label directive: every visible UI color must resolve through stable CSS variables, semantic tokens, or documented centralized theme sources.

## Current Findings

Overall compliance estimate: 94%.

Runtime reference surface estimate: 99%.

Open gaps:
- Explicit `pt-BR` locale payloads remain in CMS/i18n modules by design; default runtime/sample copy has been normalized to English.
- CMS color authoring still uses native color inputs in a few editor surfaces; a future slice should decide whether to wrap them with a token-safe `QColor` adapter.
- Automated a11y tooling such as axe is not yet part of the visual gate.
- `npm run build:samples` still reports the existing empty `cms-engine` Vite chunk warning.

## Evidence Update - 2026-04-22

Completed in the first implementation slice:
- Added `src/modules` to the white-label color guardrail scan.
- Removed direct Quasar palette aliases from `CmsLandingHeroBlock.vue`.
- Removed hardcoded CMS landing color fallbacks from hero/features blocks.
- Replaced wiki chat `v-html` with safe Vue-rendered markdown segments for bold, italic, code, and line breaks.
- Converted core theme/token comments and selected legacy component/composable comments to English.
- Updated public config copy found in the targeted scan to English while preserving explicit `pt-BR` locale payloads.

Validation results:
- `npm run test -- tests/unit/templates/TemplateWhiteLabelAudit.spec.ts tests/unit/templates/WikiTemplates.spec.ts`: 2 files passed, 36 tests passed.
- `rg -n 'color="(primary|secondary|accent|positive|negative|info|warning|dark|light)"' src`: no matches.
- `rg -n 'v-html|vue/no-v-html' src tests`: no matches.
- Targeted Portuguese-comment scan across `src/styles`, `src/config`, `src/composables`, `src/components/ui`, and `src/components/layout`: no matches for the tracked terms.
- `npm run type-check`: passed.
- `npm run lint`: passed with 0 errors and existing warnings.
- `npm run build:samples`: passed; existing empty `cms-engine` chunk warning remains.

Completed in the current implementation slice:
- Added `src/components/ui/NtkDataTable.vue` as the tokenized Quasar `QTable` adapter and exported it from `index.ts`.
- Migrated CRUD, Wiki, Enterprise command center, and Editor workbench list surfaces away from native tables.
- Preserved enterprise service health row tones through `NtkDataTable` row classes.
- Converted frontend default runtime/sample copy and shared utility validation messages to English.
- Converted selected remaining array-style component emits to typed `defineEmits` contracts.
- Tokenized CMS authoring design-baseline fallbacks and extended the white-label audit to keep those fallbacks on CSS variables/theme values.
- Tokenized visual effects gradients/shadows so legacy preset effects resolve through CSS variables instead of fixed hex/rgba fallbacks.
- Normalized remaining runtime-facing form/date/time/contact/auth defaults to English.
- Extended reference evidence with QLayout shell, QTable/list, avatar initials, overlays, dark contrast, and reference-resource parity.
- Updated screenshot baselines for Revolut, Claude, Warp, and Resend after the English/runtime table migration.

Current validation results:
- `npm run type-check`: passed.
- `npm run test -- tests/unit/components/ui/NtkDataTable.spec.ts tests/unit/templates/CrudListTemplate.spec.ts tests/unit/templates/TemplateWhiteLabelAudit.spec.ts tests/unit/templates/EnterpriseFeatureTemplates.spec.ts tests/unit/templates/WikiTemplates.spec.ts tests/unit/utils/formatters.spec.ts tests/unit/utils/validators.spec.ts tests/unit/services/FormValidationService.spec.ts tests/unit/composables/useFormRules.spec.ts tests/unit/composables/useDialogActions.spec.ts tests/unit/components/layout/NtkLayoutComponents.spec.ts tests/unit/components/layout/NtkLandingHeaderTechStackContact.spec.ts tests/unit/components/layout/NtkLandingComponents.spec.ts tests/unit/components/form/BaseDatePicker.spec.ts tests/unit/components/form/BaseTimePicker.spec.ts tests/unit/config/effects-config.spec.ts tests/unit/templates/DashboardTemplate.spec.ts tests/unit/templates/TemplateAuthService.spec.ts tests/unit/samples/OriginalReferenceApp.spec.ts tests/unit/landing/LandingTokenization.spec.ts tests/unit/templates/WikiChatRuntimePersistence.spec.ts`: 21 files passed, 416 tests passed.
- `npx playwright test tests/e2e/template-runtime-reference-evidence.spec.ts --workers=1 --output=.build/test-results/vue-quasar-reference-evidence`: 3 tests passed, evidence generated under `.build/evidence/reference-visual-comparison`.
- `npx playwright test tests/e2e/template-runtime-dark-theme-guardrails.spec.ts --workers=1 --output=.build/test-results/vue-quasar-dark-theme-guardrails`: 10 tests passed across Warp and Resend dark themes.
- `npx playwright test tests/e2e/template-runtime-visual.spec.ts --workers=1 --output=.build/test-results/runtime-template-visual-certification`: 4 tests passed across Revolut, Claude, Warp, and Resend.
- `npx playwright test tests/e2e/template-runtime-screenshots.spec.ts --workers=1 --output=.build/test-results/runtime-template-screenshots-baselines`: 4 tests passed after regenerating intentional baselines.
- `npx playwright test tests/e2e/template-runtime-auth.spec.ts tests/e2e/template-runtime-whitelabel.spec.ts tests/e2e/template-runtime-wiki-chat.spec.ts tests/e2e/template-runtime-layout.spec.ts --workers=1 --output=.build/test-results/runtime-template-core-english`: 9 tests passed.
- `npx playwright test tests/e2e/template-runtime-data-flows.spec.ts tests/e2e/template-runtime-flow.spec.ts --workers=1 --output=.build/test-results/runtime-template-flow-fixes`: 4 tests passed.
- `npm run build:samples`: passed, output under `.build/samples`; existing empty `cms-engine` chunk warning remains.
- Latest evidence matrix status: `themeTokenBridge`, `qLayoutShellParity`, `tableListSurface`, `userInitialsAvatar`, `overlays`, `darkContrastReadiness`, and `referenceResourceParity` are all `pass`.
- `rg -n '<table|<thead|<tbody' src\templates src\components`: no matches.
- `rg -n 'defineEmits\(\[' src\components src\templates`: no matches.
- Targeted English cleanup scan across runtime, samples, components, composables, services, utilities, and selected E2E specs: no Portuguese/default `pt-BR` matches outside explicit CMS/i18n locale support.
- `git diff --check`: passed with existing CRLF normalization warnings only.

## Ordered Tasks

### Task 1 - Expand White-Label Guardrails

Target paths:
- `tests/unit/templates/TemplateWhiteLabelAudit.spec.ts`
- `src/modules/cms/blocks/landing/CmsLandingHeroBlock.vue`

Work:
- Add `src/modules` to the color guardrail scan.
- Register only true centralized theme preset/config files as allowed color sources.
- Replace Quasar palette props with token aliases or token classes.
- Remove fixed color fallbacks from non-central component CSS.

Validation commands:
- `npm run test -- tests/unit/templates/TemplateWhiteLabelAudit.spec.ts`
- `rg -n 'color="(primary|secondary|accent|positive|negative|info|warning|dark|light)"' src`

Checkpoint:
- No direct Quasar palette props remain in scanned UI source.

Suggested commit:
- `test(whitelabel): extend color guardrails to cms modules`

### Task 2 - Remove Unsafe Rich HTML Rendering

Target paths:
- `src/templates/features/wiki/WikiChatDrawerTemplate.vue`
- `tests/unit/templates/WikiTemplates.spec.ts`

Work:
- Replace `v-html` with safe Vue-rendered markdown segments for bold, italic, code, and line breaks.
- Preserve existing escaping behavior for untrusted HTML.
- Keep the chat bubble styling unchanged.

Validation commands:
- `npm run test -- tests/unit/templates/WikiTemplates.spec.ts`
- `npm run lint`

Checkpoint:
- No `vue/no-v-html` warning remains for the wiki drawer.

Suggested commit:
- `fix(wiki): render chat markdown without v-html`

### Task 3 - English-Only Internal Docs And Comments

Target paths:
- `src/styles/themes.css`
- `src/styles/tokens.scss`
- `src/config/layout/structure.config.ts`
- `src/composables/ui/useTheme.ts`
- selected CMS authoring comments/docs

Work:
- Convert internal comments and documentation copy to English.
- Preserve explicit locale payloads such as `pt-BR` translations when they are part of i18n test coverage.
- Add a small grep/audit note that distinguishes runtime copy from locale data.

Validation commands:
- `rg -n 'Paletas|Sistema de variáveis|Cor principal|USO|Configurações padronizadas|Salvar preferência|Título do card|Descrição do card' src`
- `npm run type-check`

Checkpoint:
- Core theme/token documentation is English-only.

Suggested commit:
- `docs(theme): normalize token comments to english`

### Task 4 - Quasar Data Table Decision

Target paths:
- `src/templates/pages/crud/CrudListTemplate.vue`
- `src/templates/pages/README.md`
- possible new `src/components/ui/NtkDataTable.vue`
- `tests/unit/templates/CrudListTemplate.spec.ts`
- visual E2E specs under `tests/e2e`

Work:
- Decide whether enterprise list screens should migrate to `QTable` through a tokenized `NtkDataTable` adapter.
- If migrated, preserve existing props/emits and card/table view behavior.
- If native table remains, document the exception and add stronger semantic/a11y/contrast tests.

Validation commands:
- `npm run test -- tests/unit/templates/CrudListTemplate.spec.ts`
- `npx playwright test tests/e2e/template-runtime-visual.spec.ts tests/e2e/template-runtime-dark-theme-guardrails.spec.ts --workers=1 --output=.build/test-results/quasar-table-gate`

Checkpoint:
- Table strategy is explicit and evidence-backed.

Suggested commit:
- `refactor(tables): align crud list with quasar table strategy`

### Task 5 - Formal Visual Evidence Matrix

Target paths:
- `tests/e2e/template-runtime-reference-evidence.spec.ts`
- `.build/evidence/reference-visual-comparison/`
- `planning/active/2026-04-22-vue-quasar-enterprise-compliance-plan.md`

Work:
- Extend evidence with a matrix covering theme tokens, Quasar shell, table/list, avatar initials, overlays, dark contrast, and reference resource parity.
- Keep generated screenshots and reports under `.build`.
- Record exact validation outputs in this plan.

Validation commands:
- `npx playwright test tests/e2e/template-runtime-reference-evidence.spec.ts tests/e2e/template-runtime-screenshots.spec.ts tests/e2e/template-runtime-visual.spec.ts tests/e2e/template-runtime-dark-theme-guardrails.spec.ts --workers=1 --output=.build/test-results/vue-quasar-enterprise-gate`
- `npm run build:samples`

Checkpoint:
- Evidence supports a final enterprise percentage instead of a subjective estimate.

Suggested commit:
- `test(e2e): add vue quasar compliance evidence`

## Validation Checklist

- [x] `src/modules` included in white-label audit.
- [x] CMS landing hero has no Quasar palette leak.
- [x] Wiki drawer has no `v-html`.
- [x] Theme/token comments are English-only.
- [x] Table strategy is explicit and validated.
- [x] Visual evidence matrix exists under `.build`.
- [x] `npm run type-check` passes.
- [x] Targeted `npm run test` suites pass.
- [x] `npm run lint` has no new errors.
- [x] `npm run build:samples` passes.

## Risks

- Adding `src/modules` to the guardrail scan can expose many intentional centralized theme literals; only true theme preset/config files should be allowlisted.
- Replacing `v-html` must preserve existing markdown behavior without reintroducing HTML rendering.
- Migrating the CRUD table to `QTable` can disturb visual snapshots and interaction tests.
- Removing Portuguese blindly would break the intentional `pt-BR` locale surface; i18n data must remain separate from internal docs/comments.

## Closeout Expectations

- Keep generated logs, screenshots, and reports under `.build` or `.temp`.
- Move this plan to `planning/plans/completed/YYYY-MM` only after validation evidence is recorded.
- Commit implementation slices separately when practical.
- Final closeout should report updated percentage for runtime reference surface and whole-project enterprise compliance.