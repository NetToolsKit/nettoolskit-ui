import { useNtkField, ntkFieldPropsDefaults, type NtkFieldProps, type NtkFieldPropsExtracted } from './useNtkField'

export type BaseFieldProps = NtkFieldProps
export type BaseFieldPropsExtracted = NtkFieldPropsExtracted

export const baseFieldPropsDefaults = ntkFieldPropsDefaults

export function useBaseField<T = any>(
  props: BaseFieldProps,
  emit: (event: 'update:modelValue', value: T) => void
) {
  return useNtkField<T>(props, emit)
}

