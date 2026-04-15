# Templates 100 Percent Functional And White Label — Execution Plan

Date: 2026-04-15
Branch: `feat/remove-cms-whitelabel-reference-2026-04-01`
Status: active

## Scope Summary

Levar o conjunto de templates e o `?template-runtime=1` para um estado em que:
- todas as rotas aprovadas do runtime entreguem fluxos locais funcionais, sem páginas `Em breve`
- auth, dashboard, clients, orders, settings e wiki/chat funcionem com dados locais persistidos e comportamento determinístico
- os estilos dos templates sejam 100% dirigidos por variáveis CSS e tokens de tema, sem ilhas relevantes de cor fixa ou semântica direta do Quasar
- a suíte automatizada impeça regressões funcionais e de white label

## Recommended Specialist

- Primary: `dev-frontend-vue-quasar-engineer`
- Tester: mandatory
- Reviewer: recomendado antes de merge
- Release closeout: obrigatório no encerramento do workstream

---

## Ordered Tasks

### Slice 1 — Guardrails And Baseline Audit

**Goal:** Transformar os gaps já identificados em verificações automatizadas antes da expansão funcional.

**Target paths:**
- `planning/active/templates-100-functional-whitelabel-plan-2026-04-15.md`
- `tests/unit/templates/TemplateRuntimeRouter.spec.ts`
- `tests/unit/templates/NavigationAndAuthTemplates.spec.ts`
- `tests/unit/templates/ReferenceSystemTemplates.spec.ts`
- `tests/unit/templates/TemplateWhiteLabelAudit.spec.ts` (novo)
- `tests/unit/templates/ThemeSwitcherTokens.spec.ts` (novo)
- `tests/unit/templates/TemplateRuntimeInteractions.spec.ts` (novo)

**Changes:**
- adicionar auditoria automatizada para hardcoded colors e inline styles proibidos em `src/templates/**`
- criar cobertura para `ThemeDotsSwitcher` e `useThemeSwitcher`
- ampliar a cobertura do runtime além de scaffold/menu, cobrindo header actions, user menu, auth redirect e chat FAB
- registrar exceções temporárias apenas quando estritamente necessárias e com plano de remoção

**Commands:**
- `npm test -- tests/unit/templates/TemplateRuntimeRouter.spec.ts tests/unit/templates/NavigationAndAuthTemplates.spec.ts tests/unit/templates/ReferenceSystemTemplates.spec.ts tests/unit/templates/TemplateWhiteLabelAudit.spec.ts tests/unit/templates/ThemeSwitcherTokens.spec.ts tests/unit/templates/TemplateRuntimeInteractions.spec.ts`

**Checkpoint:**
- a suíte falha quando um novo hardcode relevante entra em `src/templates/**`
- o runtime possui cobertura mínima para navegação, auth shell e theme switching

**Suggested commit:**
- `test(templates): add runtime and white-label guardrails`

---

### Slice 2 — Runtime Local Data And Persistence Contracts

**Goal:** Trocar o runtime de demonstração por fluxos locais realmente utilizáveis, com estado persistido.

**Target paths:**
- `src/templates/runtime/router.ts`
- `src/templates/runtime/index.ts`
- `src/templates/runtime/TemplateRuntimeApp.vue`
- `src/templates/runtime/runtime-data.template.ts` (novo)
- `src/templates/runtime/runtime-storage.template.ts` (novo)
- `src/templates/runtime/runtime-factories.template.ts` (novo)
- `src/templates/scaffolding/auth-service.template.ts`
- `src/templates/scaffolding/auth-store.template.ts`
- `src/templates/features/wiki/wiki-chat-service.template.ts`
- `src/templates/features/wiki/wiki-chat-store.template.ts`

**Changes:**
- substituir `fakeDashboard` e serviços puramente fake por contratos locais persistidos em `localStorage`
- tornar auth determinístico, com login, logout, restore session e estados de erro previsíveis
- tornar o chat/wiki funcional com histórico local, continuidade de conversa, exclusão e reabertura persistida
- separar fixtures, storage keys e fábricas de estado para facilitar evolução dos módulos

**Commands:**
- `npm run type-check`
- `npm test -- tests/unit/templates/ScaffoldingTemplates.spec.ts tests/unit/templates/WikiTemplates.spec.ts tests/unit/templates/TemplateRuntimeInteractions.spec.ts`

**Checkpoint:**
- refresh do browser preserva sessão e dados locais esperados
- wiki/chat não depende mais de respostas aleatórias

**Suggested commit:**
- `feat(templates/runtime): add persistent local runtime data contracts`

---

### Slice 3 — Replace Placeholder Routes With Functional Surfaces

**Goal:** Remover `PlaceholderTemplate` das rotas principais do runtime aprovado.

**Target paths:**
- `src/templates/runtime/router.ts`
- `src/templates/pages/crud/CrudListTemplate.vue`
- `src/templates/pages/dashboard/DashboardWorkspaceTemplate.vue`
- `src/templates/pages/account/ProfileTemplate.vue`
- `src/templates/features/enterprise/ApprovalQueueTemplate.vue`
- `src/templates/features/enterprise/AuditTimelineTemplate.vue`
- `src/templates/features/enterprise/EnterpriseCommandCenterTemplate.vue`
- `src/templates/runtime/pages/RuntimeClientsTemplate.vue` (novo, se necessário)
- `src/templates/runtime/pages/RuntimeOrdersTemplate.vue` (novo, se necessário)
- `src/templates/runtime/pages/RuntimeSettingsTemplate.vue` (novo, se necessário)

**Changes:**
- implementar `Clients`, `Orders` e `Settings` com templates reutilizáveis já existentes
- conectar filtros, seleção, ações locais e mensagens de estado com dados persistidos do runtime
- alinhar labels, breadcrumbs, empty states e UX de navegação com o shell aprovado
- manter o runtime como referência funcional do kit, não como coleção de placeholders

**Commands:**
- `npm run type-check`
- `npm test -- tests/unit/templates/CrudListTemplate.spec.ts tests/unit/templates/ProfileAndLayoutTemplates.spec.ts tests/unit/templates/EnterpriseFeatureTemplates.spec.ts tests/unit/templates/TemplateRuntimeInteractions.spec.ts`

**Checkpoint:**
- nenhuma rota principal do menu aprovado usa `PlaceholderTemplate`
- clients/orders/settings executam ações locais reais com feedback visual

**Suggested commit:**
- `feat(templates/runtime): replace placeholder routes with functional local flows`

---

### Slice 4 — Complete White Label Tokenization

**Goal:** Eliminar hardcodes residuais relevantes e fazer a UI responder integralmente ao tenant/theme.

**Target paths:**
- `src/composables/useThemeSwitcher.ts`
- `src/templates/navigation/ThemeDotsSwitcher.vue`
- `src/templates/styles/reference-app-bridge.scss`
- `src/templates/layouts/MainLayoutTemplate.vue`
- `src/templates/features/auth/LoginTemplate.vue`
- `src/templates/pages/system/PlaceholderTemplate.vue`
- `src/templates/pages/system/ErrorNotFoundTemplate.vue`
- `src/templates/pages/editor/EditorWorkbenchTemplate.vue`
- `src/templates/features/cms/authoring/CmsMediaAssetPicker.vue`
- `src/templates/features/reference-system/components/ReferenceReportStatusBadge.vue`
- `src/templates/features/reference-system/components/ReferenceContextRailPanel.vue`
- `src/templates/features/reference-system/components/ReferenceTopbarActions.vue`
- `src/templates/features/reference-system/components/ReferenceWhitelabelPresetCard.vue`
- `src/templates/runtime/router.ts`

**Changes:**
- mover cores, gradientes, opacidades e estilos inline para tokens `--ntk-*`/`--semantic-*`
- expor swatches dos temas por variável CSS em vez de hardcode em TypeScript
- neutralizar usos de `color="primary|negative|..."` quando ainda não estiverem garantidos pelo bridge/tokens
- reduzir a bridge para uma camada de aliases previsível, com defaults mínimos e não opinativos

**Commands:**
- `npm run type-check`
- `npm test -- tests/unit/templates/TemplateWhiteLabelAudit.spec.ts tests/unit/templates/ThemeSwitcherTokens.spec.ts tests/unit/templates/EditorWorkbenchTemplate.spec.ts tests/unit/templates/ReferenceSystemTemplates.spec.ts`

**Checkpoint:**
- troca de tema/tenant altera todos os componentes auditados sem ilhas visuais fixas relevantes
- `ThemeDotsSwitcher` e seus previews não dependem de hex hardcoded em TS

**Suggested commit:**
- `refactor(templates/theme): complete white-label tokenization`

---

### Slice 5 — Runtime Coverage And Visual Confidence

**Goal:** Garantir confiança automatizada para o runtime aprovado e para os templates mais sensíveis.

**Target paths:**
- `tests/unit/templates/TemplateRuntimeInteractions.spec.ts`
- `tests/unit/templates/ThemeSwitcherTokens.spec.ts`
- `tests/unit/templates/TemplateWhiteLabelAudit.spec.ts`
- `tests/e2e/template-runtime-flow.spec.ts` (novo)
- `tests/e2e/template-runtime-visual.spec.ts` (novo)
- `.build/playwright-report/**`
- `.build/test-results/**`

**Changes:**
- adicionar smoke E2E do runtime: login, logout, theme switcher, clients, orders, settings, wiki/chat
- adicionar regressão visual focada no runtime aprovado e nos temas suportados
- validar desktop e mobile nos pontos críticos do shell

**Commands:**
- `npm test -- tests/unit/templates/TemplateRuntimeInteractions.spec.ts tests/unit/templates/TemplateWhiteLabelAudit.spec.ts tests/unit/templates/ThemeSwitcherTokens.spec.ts`
- `npm run test:e2e -- --grep "template runtime"`

**Checkpoint:**
- o runtime aprovado possui cobertura de fluxo e visual mínima para impedir regressões óbvias

**Suggested commit:**
- `test(runtime): add flow and visual regression coverage`

---

### Slice 6 — Final Sweep, Documentation, And Closeout

**Goal:** Fechar o workstream com runtime aprovado, documentação alinhada e checkpoints de release claros.

**Target paths:**
- `planning/active/templates-100-functional-whitelabel-plan-2026-04-15.md`
- `planning/completed/templates-100-functional-whitelabel-plan-2026-04-15.md`
- `samples/README.md`
- `src/templates/README.md`
- `planning/reference/white-label-parameters-table.md` (se necessário atualizar)

**Changes:**
- registrar o estado final do runtime e os limites intencionais, se restarem
- atualizar documentação dos templates e do runtime aprovado
- mover o plano para `planning/completed/` ao encerrar

**Commands:**
- `npm run lint`
- `npm run type-check`
- `npm test`
- `npm run build:samples`

**Checkpoint:**
- nenhuma pendência crítica aberta para runtime funcional ou white label total
- plano encerrado com validações registradas

**Suggested commit:**
- `docs(templates): close 100 percent functional and white-label workstream`

---

## Validation Checklist

- `npm run lint`
- `npm run type-check`
- `npm test`
- `npm run build:samples`
- `npm run test:e2e -- --grep "template runtime"`
- browser smoke on:
  - `http://127.0.0.1:4173/?template-runtime=1`
  - `http://127.0.0.1:4173/?template-runtime=1#/clients`
  - `http://127.0.0.1:4173/?template-runtime=1#/orders`
  - `http://127.0.0.1:4173/?template-runtime=1#/settings`
  - `http://127.0.0.1:4173/?template-runtime=1#/knowledge`

## Risks And Mitigation

- Runtime “100% funcional” pode virar escopo infinito se tentarmos transformá-lo em produto completo.
  - Mitigation: tratar como runtime local completo de referência, com persistência local e fluxos aprovados, não integração backend real.
- Tokenização total pode quebrar contraste e consistência visual entre temas.
  - Mitigation: adicionar smoke visual por tema e focar primeiro nos componentes com maior impacto visual.
- Guardrails muito rígidos podem bloquear padrões válidos com `var(--token, fallback)`.
  - Mitigation: separar hardcode proibido de fallback aceitável e manter allowlist pequena e documentada.

## Delivery Slices

- POC:
  - Slice 1
  - início do Slice 4 nos hardcodes mais críticos
- Incremental:
  - Slice 2
  - Slice 3
  - restante do Slice 4
- Final:
  - Slice 5
  - Slice 6

## Closeout Expectations

- runtime aprovado sem rotas principais em placeholder
- auth, clients, orders, settings, wiki e chat funcionando com persistência local
- theme switching e branding respondendo por tokens, sem dependência relevante de hardcodes
- suíte automatizada cobrindo funcionalidade do runtime e auditoria de white label
