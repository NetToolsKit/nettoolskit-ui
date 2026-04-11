import type { TemplateVisualFamilyConfig } from '../families/template-visual-families.types'

import { approvedReferencePackConfig } from './approved-reference/pack.config'
import { builderStudioPackConfig } from './builder-studio/pack.config'
import { operationsWorkspacePackConfig } from './operations-workspace/pack.config'
import { referenceOrchestratorPackConfig } from './reference-orchestrator/pack.config'
import { registryControlPackConfig } from './registry-control/pack.config'

export const templateVisualFamilyConfigs: TemplateVisualFamilyConfig[] = [
  approvedReferencePackConfig,
  operationsWorkspacePackConfig,
  referenceOrchestratorPackConfig,
  builderStudioPackConfig,
  registryControlPackConfig,
]
