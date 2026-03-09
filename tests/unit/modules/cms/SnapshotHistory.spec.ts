/**
 * Tests/unit/modules/cms/SnapshotHistory spec module.
 */

import { describe, expect, it } from 'vitest'
import {
  createCmsSnapshotHistoryState,
  recordCmsSnapshot,
  redoCmsSnapshot,
  resetCmsSnapshotHistoryState,
  undoCmsSnapshot,
} from '../../../../src/modules/cms/white-label/snapshot-history'

interface HistoryPayload {
  value: string
}

/**
 * Creates a small payload used by snapshot-history tests.
 */
function createPayload(value: string): HistoryPayload {
  return { value }
}

describe('white-label.snapshot-history', () => {
  it('records distinct snapshots and supports undo/redo transitions', () => {
    let history = createCmsSnapshotHistoryState(createPayload('initial'), 3)
    history = recordCmsSnapshot(history, createPayload('second'), {
      equals: (left, right) => left.value === right.value,
    })
    history = recordCmsSnapshot(history, createPayload('third'), {
      equals: (left, right) => left.value === right.value,
    })

    expect(history.current.value).toBe('third')
    expect(history.past.map(entry => entry.value)).toEqual(['initial', 'second'])

    const undone = undoCmsSnapshot(history)
    expect(undone?.snapshot.value).toBe('second')
    expect(undone?.history.future.map(entry => entry.value)).toEqual(['third'])

    const redone = redoCmsSnapshot(undone!.history)
    expect(redone?.snapshot.value).toBe('third')
    expect(redone?.history.past.map(entry => entry.value)).toEqual(['initial', 'second'])
  })

  it('ignores duplicate snapshots and enforces the configured limit', () => {
    let history = createCmsSnapshotHistoryState(createPayload('one'), 2)

    history = recordCmsSnapshot(history, createPayload('one'), {
      equals: (left, right) => left.value === right.value,
    })
    expect(history.past).toHaveLength(0)

    history = recordCmsSnapshot(history, createPayload('two'), {
      equals: (left, right) => left.value === right.value,
    })
    history = recordCmsSnapshot(history, createPayload('three'), {
      equals: (left, right) => left.value === right.value,
    })
    history = recordCmsSnapshot(history, createPayload('four'), {
      equals: (left, right) => left.value === right.value,
    })

    expect(history.current.value).toBe('four')
    expect(history.past.map(entry => entry.value)).toEqual(['two', 'three'])
  })

  it('resets history around a new authoritative snapshot', () => {
    let history = createCmsSnapshotHistoryState(createPayload('draft'))
    history = recordCmsSnapshot(history, createPayload('changed'), {
      equals: (left, right) => left.value === right.value,
    })

    history = resetCmsSnapshotHistoryState(createPayload('profile-b'))

    expect(history.current.value).toBe('profile-b')
    expect(history.past).toEqual([])
    expect(history.future).toEqual([])
  })
})