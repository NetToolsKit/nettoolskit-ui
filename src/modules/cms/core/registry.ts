/**
 * Src/modules/cms/core/registry module.
 */

import type { CmsBlockCategory, CmsBlockDefinition, CmsBlockFactoryInput } from './block'
import type { CmsBlockNode, CmsRecord } from './types'

/**
 * Checks whether is non empty string.
 */
function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

export class CmsBlockRegistry {
  private readonly blocks = new Map<string, CmsBlockDefinition>()

  constructor(initialDefinitions: CmsBlockDefinition[] = []) {
    this.registerMany(initialDefinitions)
  }

  register(definition: CmsBlockDefinition): void {
    this.assertDefinition(definition)

    if (this.blocks.has(definition.type)) {
      throw new Error(`Block type "${definition.type}" is already registered.`)
    }

    this.blocks.set(definition.type, definition)
  }

  registerMany(definitions: CmsBlockDefinition[]): void {
    for (const definition of definitions) {
      this.register(definition)
    }
  }

  remove(type: string): boolean {
    return this.blocks.delete(type)
  }

  has(type: string): boolean {
    return this.blocks.has(type)
  }

  get<TProps extends CmsRecord = CmsRecord>(type: string): CmsBlockDefinition<TProps> | undefined {
    return this.blocks.get(type) as CmsBlockDefinition<TProps> | undefined
  }

  list(category?: CmsBlockCategory): CmsBlockDefinition[] {
    const values = [...this.blocks.values()]
    if (!category) {
      return values
    }

    return values.filter(block => block.category === category)
  }

  createBlockInstance<TProps extends CmsRecord = CmsRecord>(
    type: string,
    input: CmsBlockFactoryInput<TProps>
  ): CmsBlockNode<TProps> {
    const definition = this.get<TProps>(type)
    if (!definition) {
      throw new Error(`Block type "${type}" is not registered.`)
    }

    if (!isNonEmptyString(input.id)) {
      throw new Error('Block id is required to create an instance.')
    }

    if (input.children?.length && !definition.acceptsChildren) {
      throw new Error(`Block type "${type}" does not accept children.`)
    }

    const mergedProps = {
      ...(definition.defaults ?? {}),
      ...(input.props ?? {}),
    } as CmsRecord

    if (definition.validateProps && !definition.validateProps(mergedProps)) {
      throw new Error(`Invalid props for block type "${type}".`)
    }

    const instance: CmsBlockNode<TProps> = {
      id: input.id,
      type,
      props: mergedProps as TProps,
    }

    if (input.children?.length) {
      instance.children = input.children
    }

    return instance
  }

  private assertDefinition(definition: CmsBlockDefinition): void {
    if (!isNonEmptyString(definition.type)) {
      throw new Error('Block definition requires a non-empty type.')
    }

    if (!isNonEmptyString(definition.displayName)) {
      throw new Error(`Block "${definition.type}" requires a non-empty displayName.`)
    }
  }
}