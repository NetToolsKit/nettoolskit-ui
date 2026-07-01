# NetToolsKit UI DsDialog Invoker Commands (declarative open/close) - Spec

Generated: 2026-07-01 America/Sao_Paulo
LastUpdated: 2026-07-01 America/Sao_Paulo
Status: active
Priority: medium
Workstream ID: `nettoolskit-ui-dsdialog-invoker-commands`
Phase: platform-alignment

## Objective

Let a screen open/close a `DsDialog` with **zero JavaScript** using the native
HTML Invoker Commands API (`<button commandfor="<dialog id>"
command="show-modal|close">`), while keeping the existing `v-model` contract as
the source of truth. This is the "HTML commands" productivity goal from the
NTK-FE-STD evaluation: less per-screen wiring, and the browser (not the
library) performs the modal behavior.

## Background

`DsDialog` already renders a real `<dialog>` with an `id` prop and
`showModal()` (native focus trap, Esc, backdrop). Invoker Commands are Baseline
newly available (Chrome/Edge 135+, Firefox 144+, Safari 26+): the browser
dispatches a `command` event on the target and performs the built-in
show-modal/close. Without sync, a command-opened dialog would drift from
`v-model`.

## Scope

`src/design-system/vue/components/DsDialog.vue` only — no new props, no
breaking changes:

- `@command` handler: on `show-modal`, capture the invoker (`event.source`) as
  the focus-restore target, mirror `update:modelValue(true)`, emit `open`, run
  the initial-focus routine. Custom (`--*`) and unknown commands are ignored.
- `@close` handler: any native close (invoker `close`/`request-close`, `<form
  method="dialog">`, programmatic `close()`) mirrors `update:modelValue(false)`
  when the close originated outside the component. The component's own
  `closeDialog()` runs only after v-model is already false, so no double-emit.
- `openDialog()` early-returns when the element is already natively open, so
  v-model catching up after a command open never re-captures focus or
  double-emits `open`.
- Progressive enhancement: browsers without the API simply keep the existing
  v-model/composable flow; no feature detection required because the handlers
  only react to events the browser itself dispatches.
- `persistent` semantics unchanged: it blocks Esc/backdrop; an explicit `close`
  command behaves like the governed close button.

## Verification

- Targeted unit spec `tests/unit/design-system/components/ds-dialog-commands.spec.ts`
  (jsdom dispatches the events a supporting browser would fire): command open
  mirror, no duplicate open on v-model catch-up, custom-command ignore, native
  close mirror, no double-emit on own close.
- Gates: `lint --quiet`, `lint:css`, `type-check`, `layers:check`.

## Acceptance

- A `<DsButton>`-rendered or plain `<button commandfor="my-dialog"
  command="show-modal">` opens a `<DsDialog id="my-dialog" v-model="open">` in
  supporting browsers and `open` becomes `true` without any handler code.
- Native close paths flow back into `v-model`.
- No behavior change for existing v-model/`useDialog` consumers.

## Risks / Notes

- jsdom cannot exercise the real invoker plumbing; the e2e catalog gate (axe +
  dialog lifecycle) continues to prove the rendered behavior in a real browser.
- `request-close` arrives as a cancelable `cancel` → the existing
  `@cancel.prevent` + `persistent` logic already governs it.

## Progress Checklist

Progress: 100% (3/3 checked)

- [x] `@command`/`@close` mirror handlers + already-open guard in `DsDialog`
- [x] Targeted unit spec covering the sync matrix
- [x] Spec registered; recipes doc snippet for declarative usage