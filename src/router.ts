/**
 * Optional vue-router integration entry (`@nettoolskit/ui/router`).
 *
 * Composables that statically depend on the optional `vue-router` peer live
 * behind this subpath so the root entry stays resolvable in apps without a
 * router. Import from here only when the host app ships vue-router.
 */

export * from './composables/data/useFilters'