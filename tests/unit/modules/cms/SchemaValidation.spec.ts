import { describe, it, expect } from 'vitest'
import {
  CMS_SCHEMA_VERSION,
  validateCmsPageSchema,
  isCmsPageSchema,
  CmsBlockRegistry,
} from '../../../../src/modules/cms'

describe('validateCmsPageSchema', () => {
  it('should validate a well-formed schema', () => {
    const schema = {
      version: CMS_SCHEMA_VERSION,
      id: 'landing-home',
      slug: '/home',
      title: 'Home',
      status: 'draft',
      sections: [
        {
          id: 'section-hero',
          blocks: [
            {
              id: 'block-hero',
              type: 'layout.hero',
              props: {
                title: 'Hello',
              },
            },
          ],
        },
      ],
    }

    const result = validateCmsPageSchema(schema)
    expect(result.valid).toBe(true)
    expect(result.issues).toHaveLength(0)
    expect(isCmsPageSchema(schema)).toBe(true)
  })

  it('should fail when mandatory page attributes are missing', () => {
    const schema = {
      version: CMS_SCHEMA_VERSION,
      id: '',
      slug: '',
      title: '',
      status: 'invalid-status',
      sections: [],
    }

    const result = validateCmsPageSchema(schema)

    expect(result.valid).toBe(false)
    expect(result.issues.some(issue => issue.path === 'id')).toBe(true)
    expect(result.issues.some(issue => issue.path === 'slug')).toBe(true)
    expect(result.issues.some(issue => issue.path === 'title')).toBe(true)
    expect(result.issues.some(issue => issue.path === 'status')).toBe(true)
    expect(result.issues.some(issue => issue.path === 'sections')).toBe(true)
  })

  it('should validate blocks against a registry when provided', () => {
    const registry = new CmsBlockRegistry([
      {
        type: 'layout.hero',
        displayName: 'Hero',
        category: 'layout',
      },
    ])

    const schema = {
      version: CMS_SCHEMA_VERSION,
      id: 'landing-home',
      slug: '/home',
      title: 'Home',
      status: 'published',
      sections: [
        {
          id: 'section-hero',
          blocks: [
            {
              id: 'block-unknown',
              type: 'layout.unknown',
              props: {},
            },
          ],
        },
      ],
    }

    const result = validateCmsPageSchema(schema, { registry })

    expect(result.valid).toBe(false)
    expect(
      result.issues.some(
        issue =>
          issue.path === 'sections[0].blocks[0].type' &&
          issue.message.includes('not registered')
      )
    ).toBe(true)
  })

  it('should fail on unsupported schema versions', () => {
    const schema = {
      version: '2.0',
      id: 'landing-home',
      slug: '/home',
      title: 'Home',
      status: 'draft',
      sections: [
        {
          id: 'section-hero',
          blocks: [],
        },
      ],
    }

    const result = validateCmsPageSchema(schema)

    expect(result.valid).toBe(false)
    expect(result.issues.some(issue => issue.path === 'version')).toBe(true)
  })
})