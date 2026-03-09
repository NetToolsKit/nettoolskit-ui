/**
 * Snapshot history helpers for CMS authoring flows.
 * Keeps a bounded undo/redo stack over immutable snapshots.
 */

export interface CmsSnapshotHistoryState<TSnapshot> {
  current: TSnapshot
  past: TSnapshot[]
  future: TSnapshot[]
  limit: number
}

export interface CmsSnapshotHistoryTransition<TSnapshot> {
  history: CmsSnapshotHistoryState<TSnapshot>
  snapshot: TSnapshot
}

export interface CmsSnapshotHistoryOptions<TSnapshot> {
  limit?: number
  equals?: (left: TSnapshot, right: TSnapshot) => boolean
}

/**
 * Clones one history snapshot defensively.
 */
function cloneSnapshot<TSnapshot>(value: TSnapshot): TSnapshot {
  if (typeof structuredClone === 'function') {
    try {
      return structuredClone(value)
    } catch {
      // Fall through to JSON clone.
    }
  }

  return JSON.parse(JSON.stringify(value)) as TSnapshot
}

/**
 * Resolves the configured equality strategy for two snapshots.
 */
function areSnapshotsEqual<TSnapshot>(
  left: TSnapshot,
  right: TSnapshot,
  equals?: (left: TSnapshot, right: TSnapshot) => boolean
): boolean {
  return typeof equals === 'function'
    ? equals(left, right)
    : Object.is(left, right)
}

/**
 * Creates a fresh undo/redo state from one current snapshot.
 */
export function createCmsSnapshotHistoryState<TSnapshot>(
  current: TSnapshot,
  limit = 40
): CmsSnapshotHistoryState<TSnapshot> {
  return {
    current: cloneSnapshot(current),
    past: [],
    future: [],
    limit: Math.max(1, Math.floor(limit) || 40),
  }
}

/**
 * Resets history around a new authoritative snapshot.
 */
export function resetCmsSnapshotHistoryState<TSnapshot>(
  current: TSnapshot,
  limit?: number
): CmsSnapshotHistoryState<TSnapshot> {
  return createCmsSnapshotHistoryState(current, limit)
}

/**
 * Records a new current snapshot and clears redo entries.
 */
export function recordCmsSnapshot<TSnapshot>(
  history: CmsSnapshotHistoryState<TSnapshot>,
  next: TSnapshot,
  options: CmsSnapshotHistoryOptions<TSnapshot> = {}
): CmsSnapshotHistoryState<TSnapshot> {
  if (areSnapshotsEqual(history.current, next, options.equals)) {
    return history
  }

  const nextPast = [...history.past, cloneSnapshot(history.current)]
  const effectiveLimit = Math.max(1, Math.floor(options.limit ?? history.limit) || history.limit)
  const boundedPast = nextPast.length > effectiveLimit
    ? nextPast.slice(nextPast.length - effectiveLimit)
    : nextPast

  return {
    current: cloneSnapshot(next),
    past: boundedPast,
    future: [],
    limit: effectiveLimit,
  }
}

/**
 * Restores the previous snapshot when available.
 */
export function undoCmsSnapshot<TSnapshot>(
  history: CmsSnapshotHistoryState<TSnapshot>
): CmsSnapshotHistoryTransition<TSnapshot> | null {
  const previousSnapshot = history.past[history.past.length - 1]
  if (!previousSnapshot) {
    return null
  }

  const nextFuture = [cloneSnapshot(history.current), ...history.future]
  return {
    snapshot: cloneSnapshot(previousSnapshot),
    history: {
      current: cloneSnapshot(previousSnapshot),
      past: history.past.slice(0, -1),
      future: nextFuture,
      limit: history.limit,
    },
  }
}

/**
 * Restores the next redo snapshot when available.
 */
export function redoCmsSnapshot<TSnapshot>(
  history: CmsSnapshotHistoryState<TSnapshot>
): CmsSnapshotHistoryTransition<TSnapshot> | null {
  const [nextSnapshot, ...remainingFuture] = history.future
  if (!nextSnapshot) {
    return null
  }

  const nextPast = [...history.past, cloneSnapshot(history.current)]
  const boundedPast = nextPast.length > history.limit
    ? nextPast.slice(nextPast.length - history.limit)
    : nextPast

  return {
    snapshot: cloneSnapshot(nextSnapshot),
    history: {
      current: cloneSnapshot(nextSnapshot),
      past: boundedPast,
      future: remainingFuture,
      limit: history.limit,
    },
  }
}