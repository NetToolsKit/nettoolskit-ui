import { inject, provide } from 'vue'
import type { InjectionKey } from 'vue'

import type { TemplateVisualFamilyDefinition } from './template-visual-families.types'

const templateVisualFamilyContextKey: InjectionKey<TemplateVisualFamilyDefinition> = Symbol('templateVisualFamilyContext')

export function provideTemplateVisualFamilyContext(family: TemplateVisualFamilyDefinition): void {
  provide(templateVisualFamilyContextKey, family)
}

export function useTemplateVisualFamilyContext(): TemplateVisualFamilyDefinition | null {
  return inject(templateVisualFamilyContextKey, null)
}
