<template>
  <div class="cms-shell-page__grid">
    <CmsShellCard
      :title="releaseOrchestrationTitle"
      body-class="cms-releases__editor"
    >
      <template #header-actions>
        <q-chip
          dense
          square
          :style="statusChipStyle"
        >
          {{ releaseCountLabel }}
        </q-chip>
      </template>

      <div class="cms-form-grid">
        <NtkSelect
          :model-value="activeReleaseEnvironment"
          variant="outlined"
          size="sm"
          emit-value
          map-options
          :options="releaseEnvironmentSelectOptions"
          :label="t('Environment', 'Ambiente')"
          popup-content-class="cms-releases-module-surface__popup"
          @update:model-value="emit('update:activeReleaseEnvironment', normalizeReleaseEnvironment($event))"
        />
        <NtkSelect
          :model-value="selectedReleaseId"
          variant="outlined"
          size="sm"
          emit-value
          map-options
          :options="releaseSelectOptions"
          :label="t('Active release', 'Release ativo')"
          popup-content-class="cms-releases-module-surface__popup"
          @update:model-value="emit('update:selectedReleaseId', normalizeSelectValue($event))"
        />
        <NtkInput
          :model-value="releaseScheduleAt"
          variant="outlined"
          size="sm"
          type="datetime-local"
          :label="t('Schedule publish at', 'Agendar publicação para')"
          @update:model-value="emit('update:releaseScheduleAt', normalizeSelectValue($event))"
        />
        <NtkSelect
          :model-value="releaseRollbackTargetId"
          variant="outlined"
          size="sm"
          emit-value
          map-options
          :options="rollbackTargetSelectOptions"
          :label="t('Rollback target', 'Alvo do rollback')"
          popup-content-class="cms-releases-module-surface__popup"
          @update:model-value="emit('update:releaseRollbackTargetId', normalizeSelectValue($event))"
        />
        <NtkSelect
          :model-value="releasePromotionTargetEnvironment"
          variant="outlined"
          size="sm"
          emit-value
          map-options
          :options="promotionTargetEnvironmentSelectOptions"
          :label="t('Promote to environment', 'Promover para ambiente')"
          popup-content-class="cms-releases-module-surface__popup"
          @update:model-value="emit('update:releasePromotionTargetEnvironment', normalizePromotionTargetEnvironment($event))"
        />
      </div>

      <div class="cms-releases__actions">
        <DsButton
          variant="solid"
          intent="primary"
          icon="add"
          :label="t('New draft', 'Novo rascunho')"
          @click="emit('createDraft')"
        />
        <DsButton
          variant="ghost"
          size="sm"
          intent="neutral"
          icon="fact_check"
          :label="t('Validate', 'Validar')"
          :disabled="!selectedReleaseId"
          @click="emit('validateSelected')"
        />
        <DsButton
          variant="ghost"
          size="sm"
          intent="neutral"
          icon="schedule"
          :label="t('Schedule', 'Agendar')"
          :disabled="!selectedReleaseId || !releaseScheduleAt"
          @click="emit('scheduleSelected')"
        />
        <DsButton
          variant="ghost"
          size="sm"
          intent="neutral"
          icon="publish"
          :label="t('Publish now', 'Publicar agora')"
          :disabled="!selectedReleaseId"
          @click="emit('publishSelected')"
        />
        <DsButton
          variant="ghost"
          size="sm"
          intent="neutral"
          icon="event_available"
          :label="t('Run scheduled', 'Executar agendados')"
          :disabled="!hasScheduledReleases"
          @click="emit('runScheduled')"
        />
        <DsButton
          variant="ghost"
          size="sm"
          intent="neutral"
          icon="north_east"
          :label="t('Promote', 'Promover')"
          :disabled="!selectedReleaseId || !releasePromotionTargetEnvironment || releasePromotionTargetEnvironment === activeReleaseEnvironment"
          @click="emit('promoteSelected')"
        />
        <DsButton
          variant="ghost"
          size="sm"
          intent="danger"
          icon="restore"
          :label="t('Rollback', 'Rollback')"
          :disabled="!selectedReleaseId || !releaseRollbackTargetId"
          @click="emit('rollbackSelected')"
        />
        <DsButton
          variant="ghost"
          size="sm"
          intent="neutral"
          icon="download"
          :label="t('Export review package', 'Exportar pacote de revisão')"
          :disabled="!canExportReviewPackage"
          @click="emit('exportReviewPackage')"
        />
      </div>

      <q-banner
        rounded
        class="cms-banner"
        :style="bannerStyle"
      >
        <template v-if="selectedRelease">
          {{ selectedRelease.name }} · {{ t('status', 'status') }} {{ selectedRelease.status }} · {{ selectedRelease.validation.errorCount }} {{ t('errors', 'erros') }} · {{ selectedRelease.validation.warningCount }} {{ t('warnings', 'avisos') }} · {{ selectedRelease.environment }}
        </template>
        <template v-else>
          {{ t('Create a draft release to validate, schedule and publish tenant snapshots.', 'Crie um rascunho de release para validar, agendar e publicar snapshots do tenant.') }}
        </template>
      </q-banner>

      <div
        v-if="selectedReleaseReviewHub"
        class="cms-release-review-hub"
        data-cms-release-review-hub
      >
        <CmsSectionHeaderSummary
          :title="t('Unified release review', 'Revisão unificada da release')"
          :description="t('Review changes, locale readiness and publish checklist in one place.', 'Revise mudanças, cobertura de locale e checklist de publicação em um único lugar.')"
          container-class="cms-release-review-hub__header"
          copy-class="cms-release-review-hub__copy"
          summary-class="cms-release-review-hub__summary"
        >
          <template #summary>
            <q-chip
              dense
              square
              :style="getReleaseChecklistStatusStyle(selectedReleaseReviewHub.status)"
            >
              {{ getReleaseChecklistStatusLabel(selectedReleaseReviewHub.status) }}
            </q-chip>
            <q-chip
              dense
              square
              :style="getReleaseChecklistStatusStyle(selectedReleaseReviewHub.diff.status)"
            >
              {{ selectedReleaseReviewHub.diff.changedPages + selectedReleaseReviewHub.diff.changedSections + selectedReleaseReviewHub.diff.changedBlocks }}
              {{ t('change signals', 'sinais de mudança') }}
            </q-chip>
            <q-chip
              dense
              square
              :style="getReleaseChecklistStatusStyle(selectedReleaseReviewHub.locales.status)"
            >
              {{ selectedReleaseReviewHub.locales.missingEntries }}
              {{ t('locale gaps', 'lacunas de locale') }}
            </q-chip>
          </template>
        </CmsSectionHeaderSummary>

        <CmsStatusMetricCardGrid
          :items="selectedReleaseReviewHubCardItems"
          grid-class="cms-release-review-hub__cards"
          card-class="cms-release-review-hub__card"
          header-class="cms-release-review-hub__card-header"
          copy-class="cms-release-review-hub__card-copy"
          metrics-class="cms-release-review-hub__metrics"
          metric-class="cms-release-review-hub__metric"
          card-data-attr-name="data-cms-review-card"
          status-data-attr-name="data-cms-review-status"
        />
      </div>

      <div
        v-if="releaseReviewPackageHistoryEntries.length > 0"
        class="cms-release-history"
        data-cms-release-history
      >
        <CmsSectionHeaderSummary
          :title="t('Review package history', 'Histórico de pacotes de revisão')"
          :description="t('Recent review exports for this environment, with quick recall metadata.', 'Exportações recentes de revisão deste ambiente, com metadados para consulta rápida.')"
          container-class="cms-release-history__header"
          copy-class="cms-release-history__copy"
        >
          <template #summary>
            <q-chip
              dense
              square
              :style="bannerStyle"
            >
              {{ releaseReviewPackageHistoryEntries.length }}
              {{ t('recent exports', 'exports recentes') }}
            </q-chip>
          </template>
        </CmsSectionHeaderSummary>

        <div class="cms-release-history__items">
          <article
            v-for="entry in releaseReviewPackageHistoryEntries"
            :key="entry.id"
            class="cms-release-history__item"
            :data-cms-review-history-item="entry.id"
          >
            <div class="cms-release-history__item-header">
              <div class="cms-release-history__item-copy">
                <strong>{{ entry.fileName }}</strong>
                <small>{{ getReviewPackageHistoryDescription(entry) }}</small>
              </div>
              <div class="cms-release-history__item-summary">
                <q-chip
                  dense
                  square
                  :style="getReleaseChecklistStatusStyle(getReviewPackageHistoryStatus(entry))"
                >
                  {{ getReleaseChecklistStatusLabel(getReviewPackageHistoryStatus(entry)) }}
                </q-chip>
                <q-chip
                  v-if="selectedRelease && entry.releaseId === selectedRelease.id"
                  dense
                  square
                  :style="primaryActionStyle"
                >
                  {{ t('Current release', 'Release atual') }}
                </q-chip>
              </div>
            </div>

            <div class="cms-release-history__metrics">
              <span class="cms-release-history__metric"><strong>{{ entry.changedPages }}</strong><small>{{ t('Pages', 'Páginas') }}</small></span>
              <span class="cms-release-history__metric"><strong>{{ entry.changedSections }}</strong><small>{{ t('Sections', 'Seções') }}</small></span>
              <span class="cms-release-history__metric"><strong>{{ entry.changedBlocks }}</strong><small>{{ t('Blocks', 'Blocos') }}</small></span>
              <span class="cms-release-history__metric"><strong>{{ entry.localeCoverage.reduce((sum, locale) => sum + locale.missing, 0) }}</strong><small>{{ t('Locale gaps', 'Lacunas de locale') }}</small></span>
            </div>
          </article>
        </div>
      </div>

      <div
        class="cms-governance-hub"
        data-cms-governance-hub
      >
        <CmsSectionHeaderSummary
          :title="t('Governance workflow and audit', 'Workflow de governanca e auditoria')"
          :description="t('Track workflow state, revision cadence, audit activity and role-policy readiness for this tenant.', 'Acompanhe estado do workflow, cadencia de revisoes, auditoria e prontidao das politicas de papel deste tenant.')"
          container-class="cms-governance-hub__header"
          copy-class="cms-governance-hub__copy"
          summary-class="cms-governance-hub__summary"
        >
          <template #summary>
            <q-chip
              dense
              square
              :style="getReleaseChecklistStatusStyle(cmsGovernanceHubSummary.status)"
            >
              {{ getReleaseChecklistStatusLabel(cmsGovernanceHubSummary.status) }}
            </q-chip>
            <q-chip
              dense
              square
              :style="bannerStyle"
            >
              v{{ cmsGovernanceHubSummary.workflow.version }}
              {{ t('draft version', 'versão draft') }}
            </q-chip>
            <q-chip
              dense
              square
              :style="bannerStyle"
            >
              {{ cmsGovernanceHubSummary.audit.count }}
              {{ t('audit entries', 'entradas de auditoria') }}
            </q-chip>
          </template>
        </CmsSectionHeaderSummary>

        <CmsStatusMetricCardGrid
          :items="cmsGovernanceHubCardItems"
          grid-class="cms-governance-hub__cards"
          card-class="cms-governance-hub__card"
          header-class="cms-governance-hub__card-header"
          copy-class="cms-governance-hub__card-copy"
          metrics-class="cms-governance-hub__metrics"
          metric-class="cms-governance-hub__metric"
          card-data-attr-name="data-cms-governance-card"
          status-data-attr-name="data-cms-governance-status"
        />

        <div class="cms-governance-hub__lists">
          <CmsPanelListSection
            :title="t('Recent revisions', 'Revisoes recentes')"
            :summary-label="`${cmsGovernanceHubSummary.revisions.count} ${t('total', 'total')}`"
            :items="cmsGovernanceRevisionPanelItems"
            :chip-style="bannerStyle"
            section-class="cms-governance-hub__list"
            header-class="cms-governance-hub__list-header"
            items-class="cms-governance-hub__items"
            item-class="cms-governance-hub__item"
            item-header-class="cms-governance-hub__item-header"
            item-data-attr-name="data-cms-governance-revision"
          />
          <CmsPanelListSection
            :title="t('Recent audit entries', 'Entradas recentes de auditoria')"
            :summary-label="`${cmsGovernanceHubSummary.audit.topActions.length} ${t('top actions', 'ações principais')}`"
            :items="cmsGovernanceAuditPanelItems"
            :chip-style="bannerStyle"
            section-class="cms-governance-hub__list"
            header-class="cms-governance-hub__list-header"
            items-class="cms-governance-hub__items"
            item-class="cms-governance-hub__item"
            item-header-class="cms-governance-hub__item-header"
            item-data-attr-name="data-cms-governance-audit"
          />
          <CmsPanelListSection
            :title="t('Role policies', 'Politicas de papel')"
            :summary-label="`${cmsGovernanceHubSummary.roles.count} ${t('roles', 'papeis')}`"
            :items="cmsGovernanceRolePolicyPanelItems"
            :chip-style="bannerStyle"
            section-class="cms-governance-hub__list"
            header-class="cms-governance-hub__list-header"
            items-class="cms-governance-hub__items"
            item-class="cms-governance-hub__item"
            item-header-class="cms-governance-hub__item-header"
            item-data-attr-name="data-cms-governance-role"
          />
        </div>
      </div>

      <div
        v-if="selectedRelease"
        class="cms-release-acknowledgements"
        data-cms-release-acks
      >
        <CmsSectionHeaderSummary
          :title="t('Review acknowledgements', 'Reconhecimentos de revisão')"
          :description="t('Capture lightweight sign-off notes for the current release candidate without requiring backend workflow execution.', 'Capture notas leves de aprovação para o candidato atual sem exigir execução de workflow no backend.')"
          container-class="cms-release-acknowledgements__header"
          copy-class="cms-release-acknowledgements__copy"
          summary-class="cms-release-acknowledgements__summary"
        >
          <template #summary>
            <q-chip
              dense
              square
              :style="getReleaseAcknowledgementDecisionStyle('approved')"
            >
              {{ selectedReleaseAcknowledgementSummary.approvedCount }} {{ t('approved', 'aprovados') }}
            </q-chip>
            <q-chip
              dense
              square
              :style="getReleaseAcknowledgementDecisionStyle('noted')"
            >
              {{ selectedReleaseAcknowledgementSummary.notedCount }} {{ t('noted', 'registrados') }}
            </q-chip>
            <q-chip
              dense
              square
              :style="getReleaseAcknowledgementDecisionStyle('changes_requested')"
            >
              {{ selectedReleaseAcknowledgementSummary.changesRequestedCount }} {{ t('changes requested', 'mudanças solicitadas') }}
            </q-chip>
          </template>
        </CmsSectionHeaderSummary>

        <div class="cms-release-acknowledgements__form">
          <NtkSelect
            :model-value="releaseAcknowledgementDecision"
            variant="outlined"
            size="sm"
            emit-value
            map-options
            :options="releaseAcknowledgementDecisionSelectOptions"
            :label="t('Decision', 'Decisão')"
            :aria-label="t('Review acknowledgement decision', 'Decisão do reconhecimento de revisão')"
            popup-content-class="cms-releases-module-surface__popup"
            @update:model-value="emit('update:releaseAcknowledgementDecision', normalizeDecision($event))"
          />
          <NtkInput
            :model-value="releaseAcknowledgementNote"
            variant="outlined"
            size="sm"
            autogrow
            type="textarea"
            :label="t('Acknowledgement note', 'Nota do reconhecimento')"
            :aria-label="t('Review acknowledgement note', 'Nota do reconhecimento de revisão')"
            :placeholder="t('Optional context for the review decision.', 'Contexto opcional para a decisão de revisão.')"
            @update:model-value="emit('update:releaseAcknowledgementNote', normalizeSelectValue($event))"
          />
          <DsButton
            variant="solid"
            intent="primary"
            icon="fact_check"
            :label="t('Add acknowledgement', 'Adicionar reconhecimento')"
            @click="emit('addAcknowledgement')"
          />
        </div>

        <div
          v-if="selectedReleaseAcknowledgements.length > 0"
          class="cms-release-acknowledgements__items"
        >
          <article
            v-for="entry in selectedReleaseAcknowledgements"
            :key="entry.id"
            class="cms-release-acknowledgements__item"
            :data-cms-release-ack-item="entry.id"
            :data-cms-release-ack-decision="entry.decision"
          >
            <div class="cms-release-acknowledgements__item-header">
              <div class="cms-release-acknowledgements__item-copy">
                <strong>{{ getReleaseAcknowledgementDecisionLabel(entry.decision) }}</strong>
                <small>{{ getReleaseAcknowledgementDescription(entry) }}</small>
              </div>
              <q-chip
                dense
                square
                :style="getReleaseAcknowledgementDecisionStyle(entry.decision)"
              >
                {{ getReleaseAcknowledgementDecisionLabel(entry.decision) }}
              </q-chip>
            </div>
            <p
              v-if="entry.note"
              class="cms-release-acknowledgements__note"
            >
              {{ entry.note }}
            </p>
          </article>
        </div>

        <q-banner
          v-else
          rounded
          class="cms-banner"
          :style="bannerStyle"
        >
          {{ t('No acknowledgements recorded yet for this release and environment.', 'Nenhum reconhecimento foi registrado ainda para este release e ambiente.') }}
        </q-banner>
      </div>

      <div
        v-if="selectedReleaseCandidateChecklist"
        class="cms-release-checklist"
      >
        <CmsSectionHeaderSummary
          :title="t('Release candidate checklist', 'Checklist do candidato a release')"
          :description="t('Review publish readiness before scheduling or publishing this snapshot.', 'Revise a prontidao para publicar antes de agendar ou publicar este snapshot.')"
          container-class="cms-release-checklist__header"
          copy-class="cms-release-checklist__copy"
          summary-class="cms-release-checklist__summary"
        >
          <template #summary>
            <q-chip
              dense
              square
              :style="getReleaseChecklistStatusStyle('ready')"
            >
              {{ selectedReleaseCandidateChecklist.summary.readyCount }} {{ t('ready', 'prontos') }}
            </q-chip>
            <q-chip
              dense
              square
              :style="getReleaseChecklistStatusStyle('warning')"
            >
              {{ selectedReleaseCandidateChecklist.summary.warningCount }} {{ t('review', 'revisar') }}
            </q-chip>
            <q-chip
              dense
              square
              :style="getReleaseChecklistStatusStyle('blocking')"
            >
              {{ selectedReleaseCandidateChecklist.summary.blockingCount }} {{ t('blocking', 'bloqueando') }}
            </q-chip>
          </template>
        </CmsSectionHeaderSummary>

        <div class="cms-release-checklist__items">
          <article
            v-for="item in selectedReleaseCandidateChecklist.items"
            :key="item.id"
            class="cms-release-checklist__item"
            :data-cms-checklist-item="item.id"
            :data-cms-checklist-status="item.status"
          >
            <div class="cms-release-checklist__item-header">
              <div class="cms-release-checklist__item-copy">
                <strong>{{ getReleaseChecklistItemLabel(item.id) }}</strong>
                <small>{{ getReleaseChecklistItemDescription(item) }}</small>
              </div>
              <q-chip
                dense
                square
                :style="getReleaseChecklistStatusStyle(item.status)"
              >
                {{ getReleaseChecklistStatusLabel(item.status) }}
              </q-chip>
            </div>

            <ul
              v-if="item.issues.length > 0"
              class="cms-release-checklist__issues"
            >
              <li
                v-for="issue in item.issues"
                :key="`${item.id}-${issue.code}-${issue.path}`"
              >
                <strong>[{{ issue.severity }}]</strong> {{ issue.message }}
              </li>
            </ul>

            <div
              v-if="getReleaseChecklistDrilldownActions(item).length > 0 || hasReleaseChecklistValidationShortcut(item)"
              class="cms-release-checklist__actions"
            >
              <DsButton
                v-if="hasReleaseChecklistValidationShortcut(item)"
                variant="ghost"
                size="sm"
                intent="neutral"
                icon="fact_check"
                :label="t('Run Validate', 'Executar validar')"
                @click="emit('runChecklistValidationShortcut', item)"
              />
              <DsButton
                v-for="action in getReleaseChecklistDrilldownActions(item)"
                :key="action.id"
                variant="ghost"
                size="sm"
                intent="neutral"
                icon="open_in_new"
                :label="getReleaseChecklistDrilldownLabel(action)"
                :aria-label="getReleaseChecklistDrilldownLabel(action)"
                :data-cms-checklist-action="action.target"
                @click="emit('runChecklistDrilldown', action)"
              />
            </div>
          </article>
        </div>
      </div>

      <ul
        v-if="selectedReleaseGateIssues.length > 0"
        class="cms-release-diagnostics"
      >
        <li
          v-for="issue in selectedReleaseGateIssues"
          :key="`${issue.code}-${issue.path}`"
        >
          <strong>[{{ issue.severity }}]</strong> {{ issue.message }}
        </li>
      </ul>
    </CmsShellCard>

    <CmsShellCard
      :title="releaseTimelineTitle"
      body-class="cms-releases__timeline"
    >
      <article
        v-for="release in releaseTimelineEntries"
        :key="release.id"
        class="cms-release-item"
        :class="{ 'cms-release-item--active': release.id === selectedReleaseId }"
      >
        <div class="cms-release-item__header">
          <strong>{{ release.name }}</strong>
          <q-chip
            dense
            square
            :style="getReleaseStatusStyle(release.status)"
          >
            {{ release.status }}
          </q-chip>
        </div>
        <small class="cms-release-item__meta">
          {{ release.id }} · {{ t('workflow', 'workflow') }} v{{ release.sourceVersion }} · {{ release.environment }}
        </small>
        <p class="cms-release-item__summary">
          {{ release.summary || t('No summary provided.', 'Nenhum resumo informado.') }}
        </p>
        <div class="cms-release-item__metrics">
          <q-chip
            dense
            square
            :style="release.validation.errorCount > 0 ? getReleaseStatusStyle('rolled_back') : getReleaseStatusStyle('validated')"
          >
            {{ t('Errors', 'Erros') }}: {{ release.validation.errorCount }}
          </q-chip>
          <q-chip
            dense
            square
            :style="getReleaseStatusStyle('draft')"
          >
            {{ t('Warnings', 'Avisos') }}: {{ release.validation.warningCount }}
          </q-chip>
        </div>
        <div class="cms-release-item__dates">
          <span>{{ t('Created', 'Criado') }}: {{ formatReleaseTimestamp(release.createdAt) }}</span>
          <span>{{ t('Scheduled', 'Agendado') }}: {{ formatReleaseTimestamp(release.scheduledAt) }}</span>
          <span>{{ t('Published', 'Publicado') }}: {{ formatReleaseTimestamp(release.publishedAt) }}</span>
          <span>{{ t('Rolled back', 'Revertido') }}: {{ formatReleaseTimestamp(release.rolledBackAt) }}</span>
        </div>
      </article>

      <p
        v-if="releaseTimelineEntries.length === 0"
        class="cms-release-item__empty"
      >
        {{ noReleasesYetMessage }}
      </p>
    </CmsShellCard>

    <CmsShellCard
      :title="releaseCalendarTitle"
      body-class="cms-releases__calendar"
    >
      <template #header-actions>
        <q-chip
          dense
          square
          :style="statusChipStyle"
        >
          {{ t(`${scheduledReleaseCalendarEntries.length} scheduled`, `${scheduledReleaseCalendarEntries.length} agendados`) }}
        </q-chip>
      </template>

      <article
        v-for="entry in scheduledReleaseCalendarEntries"
        :key="entry.id"
        class="cms-release-calendar-item"
      >
        <strong>{{ entry.name }}</strong>
        <small>{{ formatReleaseTimestamp(entry.scheduledAt) }} · {{ entry.environment }}</small>
      </article>
      <p
        v-if="scheduledReleaseCalendarEntries.length === 0"
        class="cms-release-item__empty"
      >
        {{ noScheduledReleasesMessage }}
      </p>

      <q-separator spaced />

      <article
        v-for="conflict in releaseCalendarConflicts"
        :key="conflict.id"
        class="cms-release-calendar-conflict"
      >
        <q-chip
          dense
          square
          :style="conflict.severity === 'error' ? getReleaseStatusStyle('rolled_back') : getReleaseStatusStyle('draft')"
        >
          {{ conflict.type }}
        </q-chip>
        <p>{{ conflict.message }}</p>
      </article>
      <p
        v-if="releaseCalendarConflicts.length === 0"
        class="cms-release-item__empty"
      >
        {{ noCalendarConflictsMessage }}
      </p>
    </CmsShellCard>
  </div>
</template>

<script setup lang="ts">
import { computed, type CSSProperties } from 'vue'
import type { CmsReleaseCandidateChecklist, CmsReleaseCandidateChecklistItem, CmsReleaseCandidateChecklistItemId, CmsReleaseCandidateChecklistStatus } from '../../../../../modules/cms/releases/orchestration'
import type { CmsGovernanceHubSummary } from '../../../../../modules/cms/white-label/governance-hub'
import type { CmsReleaseChecklistDrilldownAction } from '../../../../../modules/cms/white-label/release-drilldown'
import type { CmsReleaseReviewAcknowledgementSummary } from '../../../../../modules/cms/white-label/review-acknowledgements'
import type { CmsReleaseReviewHubSummary } from '../../../../../modules/cms/white-label/review-hub'
import type { CmsReleaseCalendarConflict, CmsReleaseEntry, CmsReleaseEnvironment, CmsReleaseReviewAcknowledgementDecision, CmsReleaseReviewAcknowledgementEntry, CmsReleaseStatus, CmsReleaseValidationIssue, CmsReviewPackageHistoryEntry } from '../../../../../modules/cms/white-label/types'
import type { CmsPanelListSectionItem } from '../CmsPanelListSection.vue'
import CmsPanelListSection from '../CmsPanelListSection.vue'
import CmsSectionHeaderSummary from '../CmsSectionHeaderSummary.vue'
import CmsShellCard from '../CmsShellCard.vue'
import type { CmsStatusMetricCardItem } from '../CmsStatusMetricCardGrid.vue'
import CmsStatusMetricCardGrid from '../CmsStatusMetricCardGrid.vue'
import NtkInput from '../../../../../components/form/NtkInput.vue'
import NtkSelect from '../../../../../components/form/NtkSelect.vue'
import { DsButton } from '../../../../../design-system/vue'

interface CmsSelectOption {
  label: string
  value: string
}

const props = defineProps<{
  releaseOrchestrationTitle: string
  releaseTimelineTitle: string
  releaseCalendarTitle: string
  noReleasesYetMessage: string
  noScheduledReleasesMessage: string
  noCalendarConflictsMessage: string
  releaseCountLabel: string
  activeReleaseEnvironment: CmsReleaseEnvironment
  releaseEnvironmentOptions: CmsSelectOption[]
  selectedReleaseId: string
  releaseOptions: CmsSelectOption[]
  releaseScheduleAt: string
  releaseRollbackTargetId: string
  rollbackTargetOptions: CmsSelectOption[]
  releasePromotionTargetEnvironment: string
  promotionTargetEnvironmentOptions: CmsSelectOption[]
  hasScheduledReleases: boolean
  canExportReviewPackage: boolean
  selectedRelease: CmsReleaseEntry | null
  selectedReleaseReviewHub: CmsReleaseReviewHubSummary | null
  selectedReleaseReviewHubCardItems: CmsStatusMetricCardItem[]
  releaseReviewPackageHistoryEntries: CmsReviewPackageHistoryEntry[]
  cmsGovernanceHubSummary: CmsGovernanceHubSummary
  cmsGovernanceHubCardItems: CmsStatusMetricCardItem[]
  cmsGovernanceRevisionPanelItems: CmsPanelListSectionItem[]
  cmsGovernanceAuditPanelItems: CmsPanelListSectionItem[]
  cmsGovernanceRolePolicyPanelItems: CmsPanelListSectionItem[]
  selectedReleaseAcknowledgementSummary: CmsReleaseReviewAcknowledgementSummary
  releaseAcknowledgementDecision: CmsReleaseReviewAcknowledgementDecision
  releaseAcknowledgementDecisionOptions: CmsSelectOption[]
  releaseAcknowledgementNote: string
  selectedReleaseAcknowledgements: CmsReleaseReviewAcknowledgementEntry[]
  selectedReleaseCandidateChecklist: CmsReleaseCandidateChecklist | null
  selectedReleaseGateIssues: CmsReleaseValidationIssue[]
  releaseTimelineEntries: CmsReleaseEntry[]
  scheduledReleaseCalendarEntries: CmsReleaseEntry[]
  releaseCalendarConflicts: CmsReleaseCalendarConflict[]
  statusChipStyle: CSSProperties
  bannerStyle: CSSProperties
  primaryActionStyle: CSSProperties
  dangerActionStyle: CSSProperties
  t: (en: string, pt: string) => string
  getReleaseChecklistStatusStyle: (status: CmsReleaseCandidateChecklistStatus) => CSSProperties
  getReleaseChecklistStatusLabel: (status: CmsReleaseCandidateChecklistStatus) => string
  getReviewPackageHistoryDescription: (entry: CmsReviewPackageHistoryEntry) => string
  getReviewPackageHistoryStatus: (entry: CmsReviewPackageHistoryEntry) => CmsReleaseCandidateChecklistStatus
  getReleaseAcknowledgementDecisionStyle: (decision: CmsReleaseReviewAcknowledgementDecision) => CSSProperties
  getReleaseAcknowledgementDecisionLabel: (decision: CmsReleaseReviewAcknowledgementDecision) => string
  getReleaseAcknowledgementDescription: (entry: CmsReleaseReviewAcknowledgementEntry) => string
  getReleaseChecklistItemLabel: (itemId: CmsReleaseCandidateChecklistItemId) => string
  getReleaseChecklistItemDescription: (item: CmsReleaseCandidateChecklistItem) => string
  getReleaseChecklistDrilldownActions: (item: Pick<CmsReleaseCandidateChecklistItem, 'id' | 'issues'>) => CmsReleaseChecklistDrilldownAction[]
  hasReleaseChecklistValidationShortcut: (item: Pick<CmsReleaseCandidateChecklistItem, 'id' | 'issues'>) => boolean
  getReleaseChecklistDrilldownLabel: (action: CmsReleaseChecklistDrilldownAction) => string
  getReleaseStatusStyle: (status: CmsReleaseStatus) => CSSProperties
  formatReleaseTimestamp: (value: string | null) => string
}>()

const emit = defineEmits<{
  'update:activeReleaseEnvironment': [value: CmsReleaseEnvironment]
  'update:selectedReleaseId': [value: string]
  'update:releaseScheduleAt': [value: string]
  'update:releaseRollbackTargetId': [value: string]
  'update:releasePromotionTargetEnvironment': [value: CmsReleaseEnvironment | '']
  createDraft: []
  validateSelected: []
  scheduleSelected: []
  publishSelected: []
  runScheduled: []
  promoteSelected: []
  rollbackSelected: []
  exportReviewPackage: []
  'update:releaseAcknowledgementDecision': [value: CmsReleaseReviewAcknowledgementDecision]
  'update:releaseAcknowledgementNote': [value: string]
  addAcknowledgement: []
  runChecklistValidationShortcut: [item: Pick<CmsReleaseCandidateChecklistItem, 'id' | 'issues'>]
  runChecklistDrilldown: [action: CmsReleaseChecklistDrilldownAction]
}>()

const releaseEnvironmentSelectOptions = computed(() => [...props.releaseEnvironmentOptions])
const releaseSelectOptions = computed(() => [...props.releaseOptions])
const rollbackTargetSelectOptions = computed(() => [...props.rollbackTargetOptions])
const promotionTargetEnvironmentSelectOptions = computed(() => [...props.promotionTargetEnvironmentOptions])
const releaseAcknowledgementDecisionSelectOptions = computed(() => [...props.releaseAcknowledgementDecisionOptions])

function normalizeSelectValue(value: unknown): string {
  return String(value ?? '')
}

function normalizeReleaseEnvironment(value: unknown): CmsReleaseEnvironment {
  return value === 'staging' || value === 'production'
    ? value
    : 'dev'
}

function normalizePromotionTargetEnvironment(value: unknown): CmsReleaseEnvironment | '' {
  if (value === '' || value == null) {
    return ''
  }

  return normalizeReleaseEnvironment(value)
}

function normalizeDecision(value: unknown): CmsReleaseReviewAcknowledgementDecision {
  return value === 'approved' || value === 'changes_requested'
    ? value
    : 'noted'
}
</script>