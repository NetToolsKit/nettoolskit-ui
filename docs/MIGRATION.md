# Migration guide: `Ntk*`/`Base*` → `Ds*`

The legacy `Ntk*`/`Base*` component surface was **removed**. The only public
visual surface is now the governed `Ds*` design system. This guide maps every
removed component to its replacement.

> Version note: this lands on the `0.0.x` preview line, so it ships as a breaking
> change without a major bump. Pin a previous version if you are not ready to
> migrate.

## Automated codemod

A codemod rewrites the **1:1** import/usage mappings (Button, Card, Chip, Input,
Select, Section, Logo, Steps, Header, Footer, Sidebar, AppShell):

```bash
node scripts/codemod/ntk-to-ds.mjs "src/**/*.{vue,ts}"
# preview only, no writes:
node scripts/codemod/ntk-to-ds.mjs --dry "src/**/*.{vue,ts}"
```

The codemod renames components and import specifiers. It intentionally does **not**
touch the non-1:1 cases below (Textarea, MultiSelect, Date/Time pickers,
DataTable, MetricCard/StatCard, NotificationCenter) because their props/usage
differ — migrate those by hand using the table.

## 1:1 replacements (codemod-handled)

| Removed (`Ntk*` / `Base*`) | Replacement | Notes |
|---|---|---|
| `NtkButton` / `BaseButton` | `DsButton` | `variant`/`size`/`intent` contract props. |
| `NtkCard` / `BaseCard` | `DsCard` | `title`/`subtitle` + default slot. |
| `NtkChip` / `BaseChip` | `DsChip` | `clickable`/`removable`/`selected`. |
| `NtkInput` / `BaseInput` | `DsInput` | add `type` for email/password/number/date/time. |
| `NtkSelect` / `BaseSelect` | `DsSelect` | `options` is `{ label, value }[]`. |
| `NtkSection` / `BaseSection` | `DsSection` | |
| `NtkLogo` / `BaseLogo` | `DsLogo` | token-driven; `mark`/`text`/`tagline`, no color props. |
| `NtkSteps` / `BaseSteps` | `DsSteps` | `steps` + `current`. |
| `NtkHeader` / `BaseHeader` / `NtkLandingHeader` | `DsHeader` | `#brand`/default/`#actions` slots. |
| `NtkFooter` / `BaseFooter` | `DsFooter` | `#start`/default/`#end` slots. |
| `NtkSidebar` / `BaseSidebar` / `NtkAppSidebar` | `DsSidebar` | `collapsed`; default slot = nav. |
| `NtkAppShell` | `DsAppShell` | slot-driven shell; `v-model:drawerOpen`. |

## Manual replacements (props differ)

| Removed | Replacement | Migration |
|---|---|---|
| `NtkTextarea` / `BaseTextarea` | `DsInput` | use `multiline` (+ optional `rows`). |
| `NtkMultiSelect` / `BaseMultiSelect` | `DsSelect` | use `multiple`; model value is `string[]`. |
| `NtkDatePicker` / `BaseDatePicker` | `DsInput` | use `type="date"`. |
| `NtkTimePicker` / `BaseTimePicker` | `DsInput` | use `type="time"`. |
| `NtkDataTable` | `DsTable` / `DsCrudPage` | `DsTable` for presentation (columns/rows, sort, server pagination via `sort`/`pagination`); `DsCrudPage` + `defineResource` for full list+CRUD. |
| `NtkSectionHeader` | `DsPageHeader` | `title`/`description` + `#actions`. |
| `NtkMetricCard` / `MetricCard` / `NtkStatCard` | `DsMetricGrid` | pass a `metrics` array (`{ id, label, value, delta?, deltaDirection? }`). |
| `NtkMobileDrawer` | `DsDrawer` | `v-model` open; `side`; default slot rendered in a `<nav>`. |
| `NtkNotificationCenter` | `useNotification()` | the notification capability is the composable + `NotificationService` + `QuasarNotificationAdapter`; there is no standalone UI center component. |

## Removed without replacement (product/landing scope)

These were marketing/landing widgets, out of library scope (consistent with the
library-only-surface cleanup). Move them into your product app if still needed:

`NtkCTASection`, `NtkContactSection`, `NtkHero` / `BaseHero`, `NtkInfoCard`,
`NtkFeatureCard` / `BaseFeatureCard`, `NtkPricingCard` / `BasePricingCard`,
`NtkServiceGrid`, `NtkStatsSection`, `NtkTechStack`, `NtkTestimonialCard`,
`NtkCreditCard` / `BaseCreditCard`.

## Removed composables

| Removed | Replacement |
|---|---|
| `useNtkField` / `useBaseField` | Build forms with `DsForm` + `defineForm`, or compose `useFormRules` + the pure `core/schema` validators directly. |

## Optional peers: `quasar` and `vue-router` (0.0.1-preview.2)

`quasar` and `vue-router` are now **optional** peer dependencies
(`peerDependenciesMeta`). The modules that statically import them moved out of
the root entry into dedicated subpaths so apps without those peers keep
bundling (ADR-0006):

| Was on the root entry | Now import from |
|---|---|
| `QuasarNotificationAdapter`, `getQuasarNotificationService` | `@nettoolskit/ui/quasar` |
| `useDialogActions` | `@nettoolskit/ui/quasar` |
| `useResponsive` | `@nettoolskit/ui/quasar` |
| `useFilters` | `@nettoolskit/ui/router` |

Behavior note: `useNotification()` now resolves its backend through
`get/setNotificationService()` and defaults to the console-based base service.
Apps that want the Quasar Notify experience opt in once at install time:

```ts
import { installQuasarServices } from '@nettoolskit/ui/quasar'

installQuasarServices() // wires Notify notifications + the Quasar Dark bridge
```

The theme DOM sync no longer imports Quasar; `installQuasarServices()` also
registers the `Dark` bridge (`registerThemeDarkSync`). The `--q-*` CSS variable
aliases keep working unchanged — they are plain CSS.

## One-line install

Register the whole `Ds*` system and bootstrap theme/color-scheme in one call:

```ts
import { createApp } from 'vue'
import { createNetToolsKitUI } from '@nettoolskit/ui'

createApp(App).use(createNetToolsKitUI({ theme: 'revolut', colorScheme: 'auto' })).mount('#app')
```