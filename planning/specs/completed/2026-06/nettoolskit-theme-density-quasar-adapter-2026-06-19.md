# NetToolsKit Theme Density Quasar Adapter - Spec

Date: 2026-06-19
Status: completed - archived
Priority: P0
Sequence: 03
Source Standard: `.temp/NETTOOLSKIT_FRONTEND_DESIGN_SYSTEM_STANDARD.md`

## Design Intent

Build a controlled theme, density, multi-tenant, dark mode, and Quasar adapter layer so Quasar remains the UI engine while frontend features consume NetToolsKit contracts.

## Current Evidence

Existing useful files:

- `src/config/theme/theme-dom.ts`
- `src/config/theme/theme.plugin.ts`
- `src/composables/ui/useTheme.ts`
- `src/composables/ui/useResponsive.ts`
- `src/adapters/QuasarNotificationAdapter.ts`

These files should be folded into the new adapter model or documented as compatibility shims.

## Decisions

1. External tenant/theme input must be validated before becoming CSS variables.
2. Theme application must write only approved token variables.
3. Density must be a first-class context with compact, comfortable, and spacious modes.
4. Quasar brand variables must be derived from NetToolsKit tokens.
5. Direct escape hatches such as unrestricted `setVar(name, value)` must be replaced or restricted.
6. Notification, dialog, menu, table, input, and dark mode behavior must route through adapters.

## Target Paths

- future `src/design-system/theme/**`
- future `src/design-system/adapters/quasar/**`
- existing `src/config/theme/theme-dom.ts`
- existing `src/config/theme/theme.plugin.ts`
- existing `src/composables/ui/useTheme.ts`
- existing `src/adapters/QuasarNotificationAdapter.ts`
- existing `tests/unit/config/**`

## Design Slice Matrix

| Slice | Target | Validation |
|---|---|---|
| Theme manager | theme selection and persistence | unit tests with DOM state |
| Density manager | density token application | unit tests across all densities |
| Tenant validation | external theme config | schema and rejection tests |
| Quasar brand adapter | primary, status, dark variables | Quasar variable tests |
| Feedback adapter | Notify/Dialog/Menu mapping | adapter tests and token checks |

## Acceptance Criteria

1. Theme manager exists and applies tokens through approved APIs.
2. Density manager exists and updates token context without page-specific CSS.
3. Quasar variables are derived from NetToolsKit tokens.
4. Tenant input validation rejects unsafe CSS and unknown token keys.
5. Legacy theme APIs either call the new manager or are deprecated with tests.

## Implementation Evidence

### 2026-06-19 22:09 - Density Assignment And Known Token Validation Slice

- Added `src/design-system/theme/density.ts`.
- `createDensityCssVariableAssignments()` and `createDensityCssVariableAssignmentMap()` expose compact, comfortable, and spacious assignments using generated token CSS variable names.
- Theme validation now rejects unknown tenant token keys that are not present in `designTokensByCssVariable`.
- Theme tests now reject `--ntk-control-height` until it exists in the generated resolver and validate deterministic density assignment output.
- Quasar adapter tests now verify assignments sourced from generated token values.
- Remaining gaps: full DOM theme manager, legacy `setVar(name, value)` restriction/deprecation path, dark-mode plugin sync, and Notification/Dialog/Menu/Table/Input adapter routing.

## Risks

- Runtime theme changes can affect samples and visual snapshots.
- Dark mode and Quasar `Dark` plugin sync can diverge if DOM and plugin state are not tested together.
- Over-restricting tenant input can break existing CMS authoring flows.

## Planning Readiness

Ready for planning after token resolver outputs exist.

## Recommended Specialist

- Primary: `dev-frontend-vue-quasar-engineer`
- Support: `privacy-compliance-engineer` for tenant-input safety review