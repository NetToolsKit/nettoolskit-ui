import { inject, provide } from 'vue'
import type { InjectionKey } from 'vue'

import type { TemplateVisualFamilyVariantDefinition } from './template-visual-families.types'

const templateVisualFamilyContextKey: InjectionKey<TemplateVisualFamilyVariantDefinition> = Symbol('templateVisualFamilyContext')

export function provideTemplateVisualThemeContext(variant: TemplateVisualFamilyVariantDefinition): void {
  provide(templateVisualFamilyContextKey, variant)
}

export function useTemplateVisualThemeContext(): TemplateVisualFamilyVariantDefinition | null {
  return inject(templateVisualFamilyContextKey, null)
}
