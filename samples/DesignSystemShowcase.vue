<template>
  <!-- Standalone Design System showcase. Self-contained layout (top control bar
       + sticky TOC sidebar + content). It is NOT nested in the PlaTEA app shell.
       Everything below uses only Ds* components and var(--ntk-*) tokens; the page
       re-resolves live when the theme / brand / density controls change. -->
  <div class="dss" :data-density="density">
    <!-- ============ TOP CONTROL BAR (sticky) ============ -->
    <header class="dss-topbar">
      <div class="dss-topbar__brand">
        <DsLogo mark="N" text="NetToolsKit" tagline="DESIGN SYSTEM" :show-tagline="true" size="sm" />
      </div>

      <div class="dss-topbar__controls">
        <div class="dss-control">
          <span class="dss-control__label">Tema</span>
          <div class="dss-segmented" role="group" aria-label="Tema de cor">
            <button
              v-for="opt in schemeControls"
              :key="opt.value"
              type="button"
              class="dss-segmented__btn"
              :class="{ 'dss-segmented__btn--active': scheme === opt.value }"
              :aria-pressed="scheme === opt.value"
              @click="onScheme(opt.value)"
            >
              {{ opt.label }}
            </button>
          </div>
        </div>

        <div class="dss-control">
          <span class="dss-control__label">Marca</span>
          <div class="dss-segmented" role="group" aria-label="Marca">
            <button
              v-for="opt in brandControls"
              :key="opt.value"
              type="button"
              class="dss-segmented__btn"
              :class="{ 'dss-segmented__btn--active': theme === opt.value }"
              :aria-pressed="theme === opt.value"
              @click="setTheme(opt.value)"
            >
              {{ opt.label }}
            </button>
          </div>
        </div>

        <div class="dss-control">
          <span class="dss-control__label">Densidade</span>
          <div class="dss-segmented" role="group" aria-label="Densidade">
            <button
              v-for="opt in densityControls"
              :key="opt.value"
              type="button"
              class="dss-segmented__btn"
              :class="{ 'dss-segmented__btn--active': density === opt.value }"
              :aria-pressed="density === opt.value"
              @click="density = opt.value"
            >
              {{ opt.label }}
            </button>
          </div>
        </div>

        <DsButton
          class="dss-topbar__apps"
          label="Aplicações de exemplo"
          variant="outline"
          intent="primary"
          size="sm"
          icon-right="→"
          @click="emit('open-apps')"
        />
      </div>
    </header>

    <div class="dss-layout">
      <!-- ============ LEFT TOC SIDEBAR (sticky) ============ -->
      <aside class="dss-toc">
        <nav class="dss-toc__nav" aria-label="Sumário">
          <div v-for="group in toc" :key="group.title" class="dss-toc__group">
            <p class="dss-toc__title">{{ group.title }}</p>
            <a
              v-for="item in group.items"
              :key="item.id"
              class="dss-toc__link"
              :class="{ 'dss-toc__link--active': activeSection === item.id }"
              :href="`#${item.id}`"
              :aria-current="activeSection === item.id ? 'true' : undefined"
            >
              <span v-if="activeSection === item.id" class="dss-toc__dot" aria-hidden="true" />
              {{ item.label }}
            </a>
          </div>
        </nav>
      </aside>

      <!-- ============ MAIN CONTENT ============ -->
      <main class="dss-main">
        <!-- 1. HERO -->
        <section id="introducao" class="dss-section dss-hero">
          <p class="dss-eyebrow dss-eyebrow--primary">NTK-FE-STD-001 · v1.0</p>
          <h1 class="dss-hero__title">Sistema de Design NetToolsKit</h1>
          <p class="dss-hero__lead">
            Catálogo vivo dos tokens, temas e componentes <code>Ds*</code>. Engineering-first sobre
            Vue 3 + Quasar, tokens DTCG e contratos tipados. Cada peça abaixo lê das mesmas
            CSS Custom Properties do padrão.
          </p>
          <div class="dss-hero__chips">
            <DsChip
              v-for="tech in techChips"
              :key="tech"
              :label="tech"
              variant="outline"
              intent="neutral"
              size="sm"
            />
          </div>
        </section>

        <!-- 2. INFO BANNER -->
        <DsBanner
          class="dss-section"
          intent="info"
          variant="soft"
          icon="↗"
          title="Use os controles no topo."
          message="Tema (claro / escuro), marca e densidade re-resolvem os tokens em tempo real — inclusive a tela de Clientes logo abaixo. É a prova de que o tema é trocável sem tocar nas features."
        />

        <!-- 3. APLICAÇÕES DA MARCA -->
        <section class="dss-section">
          <p class="dss-eyebrow">Aplicações da marca</p>
          <div class="dss-lockups">
            <div class="dss-lockup">
              <div class="dss-lockup__surface dss-lockup__surface--positive">
                <DsLogo mark="N" text="NetToolsKit" size="sm" />
              </div>
              <p class="dss-lockup__caption">Positiva</p>
            </div>
            <div class="dss-lockup">
              <div class="dss-lockup__surface dss-lockup__surface--negative">
                <DsLogo mark="N" text="NetToolsKit" size="sm" />
              </div>
              <p class="dss-lockup__caption">Negativa</p>
            </div>
            <div class="dss-lockup">
              <div class="dss-lockup__surface dss-lockup__surface--mono">
                <DsLogo mark="N" text="NetToolsKit" size="sm" />
              </div>
              <p class="dss-lockup__caption">Monocromática</p>
            </div>
            <div class="dss-lockup">
              <div class="dss-lockup__surface dss-lockup__surface--photo">
                <DsLogo mark="N" text="NetToolsKit" size="sm" />
                <span class="dss-lockup__overlay">overlay 60–80%</span>
              </div>
              <p class="dss-lockup__caption">Foto</p>
            </div>
          </div>
        </section>

        <!-- 4. TELA REAL · CLIENTES -->
        <section id="clientes" class="dss-section">
          <div class="dss-proof">
            <DsBadge label="PROVA · TELA REAL" intent="primary" variant="solid" size="sm" />
            <h2 class="dss-proof__title">Tela real · Clientes</h2>
          </div>
          <p class="dss-section__lead">
            Página de produto montada 100% com <code>DsPage</code> · <code>DsPageHeader</code> ·
            <code>DsSection</code> · <code>DsInput</code> · <code>DsTable</code> · <code>DsBadge</code>.
            Busca, ordenação, paginação e estados reagem aos controles de tema, marca e densidade.
          </p>

          <div class="dss-clients">
            <DsSection variant="surface">
              <template #header>
                <div class="dss-clients__head">
                  <div>
                    <h2 class="dss-clients__title">Clientes</h2>
                    <p class="dss-clients__subtitle">Gerencie contas, planos e situação de cobrança.</p>
                  </div>
                  <DsButton label="Novo cliente" intent="primary" icon="+" :density="density" />
                </div>
              </template>

              <div class="dss-clients__toolbar">
                <DsInput
                  id="dss-client-search"
                  class="dss-clients__search"
                  name="dss-client-search"
                  type="search"
                  placeholder="Buscar por nome, e-mail ou documento"
                  :model-value="search"
                  :density="density"
                  @update:model-value="onSearch"
                />
                <span class="dss-clients__count">{{ filteredClients.length }} resultado(s)</span>
              </div>

              <div class="dss-clients__filters" role="group" aria-label="Filtrar por situação">
                <button
                  v-for="f in statusFilters"
                  :key="f.value"
                  type="button"
                  class="dss-pill"
                  :class="{ 'dss-pill--active': statusFilter === f.value }"
                  :aria-pressed="statusFilter === f.value"
                  @click="setStatusFilter(f.value)"
                >
                  {{ f.label }}
                  <span class="dss-pill__count">{{ f.count }}</span>
                </button>
              </div>

              <DsTable
                aria-label="Clientes"
                :columns="clientColumns"
                :rows="clientRows"
                :sort="clientSort"
                :pagination="clientPagination"
                :density="density"
                variant="striped"
                empty-label="Nenhum cliente encontrado"
                pagination-label="Paginação de clientes"
                previous-page-label="‹ Anterior"
                next-page-label="Próxima ›"
                @update:sort="onClientSort"
                @update:page="onClientPage"
              >
                <template #cell-client="{ row }">
                  <div class="dss-cell-client">
                    <span class="dss-cell-client__name">{{ row.cells.client }}</span>
                    <span class="dss-cell-client__email">{{ row.cells.email }}</span>
                  </div>
                </template>
                <template #cell-document="{ row }">
                  <div class="dss-cell-doc">
                    <span class="dss-cell-doc__value">{{ row.cells.document }}</span>
                    <span class="dss-cell-doc__type">{{ row.cells.documentType }}</span>
                  </div>
                </template>
                <template #cell-status="{ row }">
                  <DsBadge
                    :label="statusMeta[row.cells.status as ClientStatus].label"
                    :intent="statusMeta[row.cells.status as ClientStatus].intent"
                    variant="soft"
                    size="sm"
                  />
                </template>
                <template #cell-actions="{ row }">
                  <div class="dss-cell-actions">
                    <DsButton label="Ver" variant="outline" intent="neutral" size="sm" @click="noop(row.id)" />
                    <DsButton label="Editar" variant="ghost" intent="primary" size="sm" @click="noop(row.id)" />
                  </div>
                </template>
              </DsTable>
            </DsSection>
          </div>
        </section>

        <!-- 5. 01 CORES & TEMAS -->
        <section id="cores" class="dss-section">
          <h2 class="dss-numbered"><span class="dss-numbered__no">01</span> Cores &amp; temas</h2>
          <p class="dss-section__lead">
            Papéis semânticos resolvidos em runtime via CSS Custom Properties — referenciados por
            nome de token. Os blocos reagem ao tema ativo.
          </p>

          <p class="dss-eyebrow">Superfícies &amp; texto</p>
          <div class="dss-swatches">
            <div v-for="s in surfaceSwatches" :key="s.token" class="dss-swatch">
              <div class="dss-swatch__chip" :style="{ background: `var(${s.token})`, borderColor: s.border ? `var(${s.border})` : 'transparent' }" />
              <p class="dss-swatch__name">{{ s.label }}</p>
              <code class="dss-swatch__token">{{ s.token }}</code>
            </div>
          </div>

          <p class="dss-eyebrow">Tons semânticos</p>
          <div class="dss-swatches">
            <div v-for="s in semanticSwatches" :key="s.token" class="dss-swatch">
              <div class="dss-swatch__chip dss-swatch__chip--label" :style="{ background: `var(${s.token})`, color: s.text }">Aa</div>
              <p class="dss-swatch__name">{{ s.label }}</p>
              <code class="dss-swatch__token">{{ s.token }}</code>
            </div>
          </div>

          <div class="dss-brands">
            <DsCard
              v-for="brand in brandCards"
              :key="brand.id"
              variant="outlined"
              :class="{ 'dss-brand-card--active': brand.id === theme }"
            >
              <template #header>
                <div class="dss-brand-card__head">
                  <div>
                    <h3 class="dss-brand-card__name">{{ brand.name }}</h3>
                    <code class="dss-brand-card__hex">{{ brand.hex }}</code>
                  </div>
                  <DsBadge v-if="brand.id === theme" label="ativo" intent="primary" variant="soft" size="sm" />
                </div>
              </template>
              <div class="dss-brand-card__cols">
                <div v-for="col in brand.columns" :key="col.label" class="dss-brand-card__col">
                  <div class="dss-brand-card__col-chip" :style="{ background: col.value, borderColor: col.border ?? 'transparent' }" />
                  <span class="dss-brand-card__col-label">{{ col.label }}</span>
                </div>
              </div>
              <template #footer>
                <DsButton
                  label="Usar esta marca"
                  variant="outline"
                  intent="primary"
                  :density="density"
                  class="dss-brand-card__cta"
                  @click="setTheme(brand.id)"
                />
              </template>
            </DsCard>
          </div>
        </section>

        <!-- 6. 02 TIPOGRAFIA -->
        <section id="tipografia" class="dss-section">
          <h2 class="dss-numbered"><span class="dss-numbered__no">02</span> Tipografia</h2>
          <p class="dss-section__lead">
            Família de display para títulos, sans para interface e mono para tokens e dados
            técnicos. Hierarquia semântica com altura de linha confortável.
          </p>

          <DsCard variant="outlined">
            <ul class="dss-type">
              <li v-for="row in typeScale" :key="row.label" class="dss-type__row">
                <div class="dss-type__meta">
                  <span class="dss-type__name">{{ row.label }}</span>
                  <code class="dss-type__spec">{{ row.spec }}</code>
                </div>
                <div class="dss-type__sample" :class="row.sampleClass">{{ row.sample }}</div>
              </li>
            </ul>
          </DsCard>
        </section>

        <!-- 7. 03 ESPAÇAMENTO & RAIO -->
        <section id="espacamento" class="dss-section">
          <h2 class="dss-numbered"><span class="dss-numbered__no">03</span> Espaçamento &amp; raio</h2>
          <p class="dss-section__lead">
            Escala de espaçamento e raios padronizados. A densidade ajusta alturas e paddings dos
            componentes sem alterar a escala base.
          </p>

          <div class="dss-scale-grid">
            <DsCard variant="outlined">
              <template #header><p class="dss-eyebrow">Espaço</p></template>
              <ul class="dss-spacing">
                <li v-for="sp in spacingScale" :key="sp.token" class="dss-spacing__row">
                  <code class="dss-spacing__token">{{ sp.token }}</code>
                  <span class="dss-spacing__bar" :style="{ inlineSize: `var(${sp.token})` }" />
                  <span class="dss-spacing__value">{{ sp.value }}</span>
                </li>
              </ul>
            </DsCard>

            <DsCard variant="outlined">
              <template #header><p class="dss-eyebrow">Raio</p></template>
              <div class="dss-radii">
                <div v-for="r in radiusScale" :key="r.token" class="dss-radius">
                  <div class="dss-radius__chip" :style="{ borderRadius: `var(${r.token})` }" />
                  <code class="dss-radius__label">{{ r.label }}</code>
                </div>
              </div>
            </DsCard>
          </div>
        </section>

        <!-- 8. 04 BOTÕES -->
        <section id="botoes" class="dss-section">
          <h2 class="dss-numbered"><span class="dss-numbered__no">04</span> Botões</h2>
          <p class="dss-section__lead">
            <code>DsButton</code> — props fechadas: <code>intent × variant × size</code>. Cores
            resolvidas por recipe a partir dos tokens.
          </p>

          <DsCard variant="outlined">
            <div class="dss-btn-matrix">
              <div v-for="row in buttonRows" :key="row.label" class="dss-btn-row">
                <span class="dss-btn-row__label">{{ row.label }}</span>
                <div class="dss-btn-row__cells">
                  <DsButton
                    v-for="intent in buttonIntents"
                    :key="intent.value"
                    :label="intent.label"
                    :variant="row.variant"
                    :intent="intent.value"
                    :class="row.soft ? 'dss-btn-soft' : undefined"
                    :density="density"
                  />
                </div>
              </div>
            </div>

            <template #footer>
              <div class="dss-btn-extra">
                <div class="dss-btn-row">
                  <span class="dss-btn-row__label">Tamanhos</span>
                  <div class="dss-btn-row__cells">
                    <DsButton label="SM" size="sm" intent="primary" />
                    <DsButton label="MD · densidade" size="md" intent="primary" :density="density" />
                    <DsButton label="LG" size="lg" intent="primary" />
                  </div>
                </div>
                <div class="dss-btn-row">
                  <span class="dss-btn-row__label">Estados</span>
                  <div class="dss-btn-row__cells">
                    <DsButton label="Padrão" intent="primary" :density="density" />
                    <DsButton label="Foco" intent="primary" class="dss-focus-demo" :density="density" />
                    <DsButton label="Desabilitado" intent="primary" disabled :density="density" />
                    <DsButton label="Salvando..." intent="primary" loading :density="density" />
                  </div>
                </div>
              </div>
            </template>
          </DsCard>
        </section>

        <!-- 9. 05 INPUTS & FORMS -->
        <section id="inputs" class="dss-section">
          <h2 class="dss-numbered"><span class="dss-numbered__no">05</span> Inputs &amp; forms</h2>
          <p class="dss-section__lead">
            <code>DsInput</code> e <code>DsSelect</code> com label, dica, foco, erro, desabilitado e
            estado de carregamento — contraste AA garantido.
          </p>

          <DsCard variant="outlined">
            <div class="dss-form-grid">
              <DsInput
                id="dss-form-name"
                name="name"
                label="Nome"
                model-value="Mariana Alves"
                hint="Como aparece nos documentos."
                :density="density"
              />
              <DsInput
                id="dss-form-email"
                name="email"
                label="E-mail (foco)"
                type="email"
                model-value="contato@empresa.com.br"
                hint="Anel de foco com 2px de offset."
                class="dss-focus-demo"
                :density="density"
              />
              <DsInput
                id="dss-form-cpf"
                name="cpf"
                label="CPF"
                model-value="000.000.000-00"
                invalid
                error-message="Corrija o CPF informado."
                :density="density"
              />
              <DsInput
                id="dss-form-plan"
                name="plan"
                label="Plano (desabilitado)"
                model-value="Enterprise"
                hint="Definido pelo contrato."
                disabled
                :density="density"
              />
              <DsSelect
                id="dss-form-status"
                name="status"
                label="Status"
                :model-value="'ativo'"
                :options="formStatusOptions"
                hint="Select estilizado, contraste AA."
                :density="density"
              />
              <label class="ntk-field dss-loading-field" :class="`ntk-field--density-${density}`">
                <span class="ntk-field__label">Buscando</span>
                <span class="dss-loading-field__control">
                  <span class="dss-loading-field__text">consultando...</span>
                  <span class="dss-loading-field__spinner" aria-hidden="true" />
                </span>
                <span class="ntk-field__message">Estado loading com spinner.</span>
              </label>
            </div>
          </DsCard>
        </section>

        <!-- 10. 06 CARDS -->
        <section id="cards" class="dss-section">
          <h2 class="dss-numbered"><span class="dss-numbered__no">06</span> Cards</h2>
          <p class="dss-section__lead">
            <code>DsCard</code> — variantes <code>default</code> · <code>outlined</code> ·
            <code>elevated</code> · <code>accent-top</code> com padding por densidade.
          </p>

          <div class="dss-cards-grid">
            <DsCard v-for="card in cardVariants" :key="card.variant" :variant="card.variant">
              <template #header>
                <p class="dss-eyebrow">{{ card.eyebrow }}</p>
                <h3 class="dss-card-demo__title">{{ card.title }}</h3>
              </template>
              {{ card.body }}
            </DsCard>
          </div>
        </section>

        <!-- 11. 07 BADGES -->
        <section id="badges" class="dss-section">
          <h2 class="dss-numbered"><span class="dss-numbered__no">07</span> Badges</h2>
          <p class="dss-section__lead">
            <code>DsBadge</code> — tons semânticos em <code>solid</code> e <code>soft</code>. Nunca
            dependem só da cor: trazem texto e ponto.
          </p>

          <DsCard variant="outlined">
            <div class="dss-badge-matrix">
              <div v-for="intent in badgeIntents" :key="intent.value" class="dss-badge-row">
                <code class="dss-badge-row__label">{{ intent.value }}</code>
                <div class="dss-badge-row__cells">
                  <DsBadge :label="intent.label" :intent="intent.value" variant="solid" size="sm" />
                  <DsBadge :label="intent.label" :intent="intent.value" variant="soft" size="sm" />
                </div>
              </div>
            </div>
          </DsCard>
        </section>

        <!-- 12. 08 TABELA & ESTADOS -->
        <section id="estados" class="dss-section">
          <h2 class="dss-numbered"><span class="dss-numbered__no">08</span> Tabela &amp; estados</h2>
          <p class="dss-section__lead">
            <code>DsTable</code> exige estados explícitos. A tabela populada está na seção Clientes;
            aqui os estados de carregando, vazio e erro.
          </p>

          <div class="dss-states-grid">
            <DsCard variant="outlined">
              <template #header><p class="dss-eyebrow">Carregando</p></template>
              <DsStateBlock state="skeleton" :skeleton-lines="4" aria-label="Carregando clientes" />
            </DsCard>

            <DsCard variant="outlined">
              <template #header><p class="dss-eyebrow">Vazio</p></template>
              <DsEmptyState
                icon="∅"
                title="Sem registros"
                description="Empty state orientado à ação, não um vazio mudo."
                variant="ghost"
              />
            </DsCard>

            <DsCard variant="outlined">
              <template #header><p class="dss-eyebrow">Erro</p></template>
              <DsStateBlock
                state="error"
                title="Falha ao carregar clientes"
                description="Código de suporte: 9f2c-41a"
              >
                <template #actions>
                  <DsButton label="Tentar novamente" variant="outline" intent="neutral" size="sm" />
                </template>
              </DsStateBlock>
            </DsCard>
          </div>
        </section>

        <!-- 13. 09 FEEDBACK -->
        <section id="feedback" class="dss-section">
          <h2 class="dss-numbered"><span class="dss-numbered__no">09</span> Feedback</h2>
          <p class="dss-section__lead">
            Notificações e banners acessados por serviço semântico — mensagens acionáveis, críticas
            persistentes.
          </p>

          <div class="dss-feedback">
            <DsBanner
              v-if="banners.success"
              intent="success"
              variant="outline"
              icon="✓"
              title="Cliente salvo"
              message="As alterações foram aplicadas."
              dismissible
              dismiss-label="Dispensar"
              @dismiss="banners.success = false"
            />
            <DsBanner
              v-if="banners.error"
              intent="danger"
              variant="outline"
              icon="!"
              title="Não foi possível salvar"
              message="Tente novamente. Código de suporte: 9f2c-41a."
              dismissible
              dismiss-label="Dispensar"
              @dismiss="banners.error = false"
            />
            <DsBanner
              v-if="banners.warning"
              intent="warning"
              variant="soft"
              icon="⚠"
              title="Sessão expira em 5 minutos"
              message="Salve seu trabalho para não perder alterações."
              dismissible
              dismiss-label="Dispensar"
              @dismiss="banners.warning = false"
            >
              <template #actions>
                <DsButton label="Renovar" intent="warning" size="sm" @click="resetBanners" />
              </template>
            </DsBanner>

            <div class="dss-feedback__actions">
              <DsButton label="Disparar toast" intent="primary" :density="density" @click="onToast" />
              <DsButton label="Restaurar banners" variant="ghost" intent="neutral" :density="density" @click="resetBanners" />
            </div>
          </div>
        </section>
      </main>
    </div>

    <DsToastHost />
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import {
  DsBadge,
  DsBanner,
  DsButton,
  DsCard,
  DsChip,
  DsEmptyState,
  DsInput,
  DsLogo,
  DsSection,
  DsSelect,
  DsStateBlock,
  DsTable,
  DsToastHost,
  setColorScheme,
  useColorScheme,
  useToast,
  type ColorSchemeMode,
  type NtkComponentDensity,
  type NtkComponentIntent,
  type NtkTableColumn,
  type NtkTableRow,
  type NtkTableSort,
  type NtkCardVariant,
} from '../index'
import { useThemeSwitcher, type ThemeId } from '../src/composables/useThemeSwitcher'

const emit = defineEmits<{ 'open-apps': [] }>()

// --- Top-bar controls -------------------------------------------------------
const { mode } = useColorScheme()
const scheme = computed<ColorSchemeMode>(() => mode.value)
const schemeControls: ReadonlyArray<{ label: string; value: ColorSchemeMode }> = [
  { label: 'Claro', value: 'light' },
  { label: 'Escuro', value: 'dark' },
]
const onScheme = (value: ColorSchemeMode): void => setColorScheme(value)

const { activeTheme, themeOptions, setTheme: applyTheme } = useThemeSwitcher()
const theme = computed<ThemeId>(() => activeTheme.value)
// MARCA: first two brand themes wired live.
const brandControls = themeOptions.slice(0, 2).map((opt) => ({ label: opt.label, value: opt.id }))
const setTheme = (value: ThemeId): void => applyTheme(value)

const density = ref<NtkComponentDensity>('comfortable')
const densityControls: ReadonlyArray<{ label: string; value: NtkComponentDensity }> = [
  { label: 'Compacto', value: 'compact' },
  { label: 'Confortável', value: 'comfortable' },
  { label: 'Espaçoso', value: 'spacious' },
]

// --- TOC + scroll spy -------------------------------------------------------
interface TocItem { id: string; label: string }
const toc: ReadonlyArray<{ title: string; items: TocItem[] }> = [
  {
    title: 'Visão geral',
    items: [
      { id: 'introducao', label: 'Introdução' },
      { id: 'clientes', label: 'Tela real · Clientes' },
    ],
  },
  {
    title: 'Fundamentos',
    items: [
      { id: 'cores', label: 'Cores & temas' },
      { id: 'tipografia', label: 'Tipografia' },
      { id: 'espacamento', label: 'Espaçamento & raio' },
    ],
  },
  {
    title: 'Componentes',
    items: [
      { id: 'botoes', label: 'Botões' },
      { id: 'inputs', label: 'Inputs & forms' },
      { id: 'cards', label: 'Cards' },
      { id: 'badges', label: 'Badges' },
      { id: 'estados', label: 'Tabela & estados' },
      { id: 'feedback', label: 'Feedback' },
    ],
  },
]
const sectionIds = toc.flatMap((g) => g.items.map((i) => i.id))
const activeSection = ref<string>('introducao')
let observer: IntersectionObserver | undefined

onMounted(() => {
  if (typeof IntersectionObserver === 'undefined') return
  observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
      if (visible[0]?.target.id) {
        activeSection.value = visible[0].target.id
      }
    },
    { rootMargin: '-30% 0px -60% 0px', threshold: [0, 0.25, 0.5, 1] },
  )
  for (const id of sectionIds) {
    const el = document.getElementById(id)
    if (el) observer.observe(el)
  }
})
onBeforeUnmount(() => observer?.disconnect())

// --- Hero tech chips --------------------------------------------------------
const techChips = ['Vue 3', 'TypeScript', 'Quasar', 'Tokens DTCG', 'CSS Cascade Layers', 'WCAG 2.2 AA']

// --- 01 Cores & temas: swatches --------------------------------------------
const surfaceSwatches: ReadonlyArray<{ label: string; token: string; border?: string }> = [
  { label: 'Fundo', token: '--ntk-bg-secondary', border: '--ntk-border-color' },
  { label: 'Superfície', token: '--ntk-bg-card', border: '--ntk-border-color' },
  { label: 'Superfície sutil', token: '--ntk-bg-tertiary', border: '--ntk-border-color' },
  { label: 'Texto', token: '--ntk-text-primary' },
  { label: 'Texto sutil', token: '--ntk-text-secondary' },
  { label: 'Borda', token: '--ntk-border-color' },
]
const semanticSwatches: ReadonlyArray<{ label: string; token: string; text: string }> = [
  { label: 'Primária', token: '--ntk-primary-dark', text: 'var(--ntk-text-inverse)' },
  { label: 'Neutra', token: '--ntk-text-secondary', text: 'var(--ntk-text-inverse)' },
  { label: 'Sucesso', token: '--ntk-success-dark', text: 'var(--ntk-text-inverse)' },
  { label: 'Atenção', token: '--ntk-warning-dark', text: 'var(--ntk-text-inverse)' },
  { label: 'Perigo', token: '--ntk-error-dark', text: 'var(--ntk-text-inverse)' },
  { label: 'Info', token: '--ntk-info-dark', text: 'var(--ntk-text-inverse)' },
]

// Brand cards: the two wired MARCA themes shown side by side.
interface BrandColumn { label: string; value: string; border?: string }
interface BrandCard { id: ThemeId; name: string; hex: string; columns: BrandColumn[] }
const brandCards: ReadonlyArray<BrandCard> = [
  {
    id: brandControls[0]?.value ?? 'revolut',
    name: `${brandControls[0]?.label ?? 'Revolut'} (marca)`,
    hex: 'primary · hover · soft · contrast',
    columns: [
      { label: 'primary', value: 'var(--ntk-primary)' },
      { label: 'hover', value: 'var(--ntk-primary-dark)' },
      { label: 'soft', value: 'var(--ntk-bg-active)' },
      { label: 'contrast', value: 'var(--ntk-bg-card)', border: 'var(--ntk-border-color)' },
    ],
  },
  {
    id: brandControls[1]?.value ?? 'claude',
    name: `${brandControls[1]?.label ?? 'Claude'} (marca)`,
    hex: 'primary · hover · soft · contrast',
    columns: [
      { label: 'primary', value: 'var(--ntk-primary)' },
      { label: 'hover', value: 'var(--ntk-primary-dark)' },
      { label: 'soft', value: 'var(--ntk-bg-active)' },
      { label: 'contrast', value: 'var(--ntk-bg-card)', border: 'var(--ntk-border-color)' },
    ],
  },
]

// --- 02 Tipografia ----------------------------------------------------------
const typeScale: ReadonlyArray<{ label: string; spec: string; sample: string; sampleClass: string }> = [
  { label: 'Display', spec: '2.25rem · 1.15 · 700', sample: 'NetToolsKit', sampleClass: 'dss-type__sample--display' },
  { label: 'Título H1', spec: '1.875rem · 1.2 · 700', sample: 'Gerencie sua base de clientes', sampleClass: 'dss-type__sample--h1' },
  { label: 'Título H2', spec: '1.5rem · 1.3 · 700', sample: 'Seção de conteúdo', sampleClass: 'dss-type__sample--h2' },
  { label: 'Título H3', spec: '1.125rem · 1.4 · 600', sample: 'Cartão de informação', sampleClass: 'dss-type__sample--h3' },
  { label: 'Corpo', spec: '1rem · 1.6 · 400', sample: 'Texto base para leitura contínua, com altura de linha confortável.', sampleClass: 'dss-type__sample--body' },
  { label: 'Corpo forte', spec: '1rem · 1.6 · 600', sample: 'Ênfase dentro do corpo de texto.', sampleClass: 'dss-type__sample--strong' },
  { label: 'Pequeno', spec: '0.875rem · 1.5 · 400', sample: 'Texto auxiliar, dicas e legendas de apoio.', sampleClass: 'dss-type__sample--small' },
  { label: 'Mono', spec: '0.875rem · 1.5 · 500', sample: '--ntk-primary: var(--ntk-primary);', sampleClass: 'dss-type__sample--mono' },
]

// --- 03 Espaçamento & raio --------------------------------------------------
const spacingScale: ReadonlyArray<{ token: string; value: string }> = [
  { token: '--ntk-spacing-xs', value: '4px' },
  { token: '--ntk-spacing-sm', value: '8px' },
  { token: '--ntk-spacing-md', value: '16px' },
  { token: '--ntk-spacing-lg', value: '24px' },
  { token: '--ntk-spacing-xl', value: '32px' },
  { token: '--ntk-spacing-2xl', value: '48px' },
  { token: '--ntk-spacing-3xl', value: '64px' },
]
const radiusScale: ReadonlyArray<{ token: string; label: string }> = [
  { token: '--ntk-radius-sm', label: 'sm' },
  { token: '--ntk-radius-md', label: 'md' },
  { token: '--ntk-radius-lg', label: 'lg' },
  { token: '--ntk-radius-2xl', label: '2xl' },
  { token: '--ntk-radius-full', label: 'full' },
]

// --- 04 Botões --------------------------------------------------------------
// DsButton variants: solid/outline/ghost/link. There is no native `soft`
// variant, so the reference "soft" row renders a `ghost` button carrying a
// token-only soft-fill modifier class (samples allow local CSS).
type DsButtonVariant = 'solid' | 'outline' | 'ghost' | 'link'
const buttonRows: ReadonlyArray<{ label: string; variant: DsButtonVariant; soft?: boolean }> = [
  { label: 'solid', variant: 'solid' },
  { label: 'soft', variant: 'ghost', soft: true },
  { label: 'outline', variant: 'outline' },
  { label: 'ghost', variant: 'ghost' },
  { label: 'link', variant: 'link' },
]
const buttonIntents: ReadonlyArray<{ value: NtkComponentIntent; label: string }> = [
  { value: 'primary', label: 'Primária' },
  { value: 'neutral', label: 'Neutra' },
  { value: 'success', label: 'Sucesso' },
  { value: 'warning', label: 'Atenção' },
  { value: 'danger', label: 'Perigo' },
  { value: 'info', label: 'Info' },
]

// --- 05 Inputs --------------------------------------------------------------
const formStatusOptions = [
  { label: 'Ativo', value: 'ativo' },
  { label: 'Pendente', value: 'pendente' },
  { label: 'Inativo', value: 'inativo' },
  { label: 'Bloqueado', value: 'bloqueado' },
]

// --- 06 Cards ---------------------------------------------------------------
const cardVariants: ReadonlyArray<{ variant: NtkCardVariant; eyebrow: string; title: string; body: string }> = [
  { variant: 'default', eyebrow: 'DEFAULT', title: 'Padrão', body: 'Superfície com sombra sutil por token.' },
  { variant: 'outlined', eyebrow: 'OUTLINED', title: 'Com borda', body: 'Delimitação por borda de baixa especificidade.' },
  { variant: 'elevated', eyebrow: 'ELEVATED', title: 'Elevado', body: 'Sombra por token, sutil no escuro.' },
  { variant: 'accent-top', eyebrow: 'ACCENT', title: 'Acento', body: 'Faixa de acento no topo via intent.' },
]

// --- 07 Badges --------------------------------------------------------------
const badgeIntents = buttonIntents

// --- 09 Feedback ------------------------------------------------------------
const banners = reactive({ success: true, error: true, warning: true })
const resetBanners = (): void => {
  banners.success = true
  banners.error = true
  banners.warning = true
}
const { pushToast } = useToast()
const onToast = (): void => {
  pushToast({ title: 'Cliente salvo', message: 'As alterações foram aplicadas.', intent: 'success' })
}

// --- Clientes (tela real) ---------------------------------------------------
type ClientStatus = 'ativo' | 'pendente' | 'inativo' | 'bloqueado'
const statusMeta: Record<ClientStatus, { label: string; intent: NtkComponentIntent }> = {
  ativo: { label: 'Ativo', intent: 'success' },
  pendente: { label: 'Pendente', intent: 'warning' },
  inativo: { label: 'Inativo', intent: 'neutral' },
  bloqueado: { label: 'Bloqueado', intent: 'danger' },
}

interface Client {
  id: string
  name: string
  email: string
  document: string
  documentType: string
  plan: string
  fee: string
  status: ClientStatus
  created: string
}

// Deterministic mocked store (no backend).
const clientStore: ReadonlyArray<Client> = [
  { id: '1', name: 'André Tavares', email: 'andre.tavares@empresa.com', document: '751.224.063-92', documentType: 'CPF', plan: 'Pro', fee: 'R$ 149,90', status: 'bloqueado', created: '28/01/2026' },
  { id: '2', name: 'Bianca Souza', email: 'bianca.souza@gmail.com', document: '305.118.762-44', documentType: 'CPF', plan: 'Starter', fee: 'R$ 49,90', status: 'pendente', created: '12/01/2026' },
  { id: '3', name: 'Camila Nunes', email: 'camila.nunes@empresa.com', document: '677.903.215-88', documentType: 'CPF', plan: 'Pro', fee: 'R$ 149,90', status: 'ativo', created: '02/02/2026' },
  { id: '4', name: 'Diego Fontes', email: 'diego@fonteslog.com', document: '12.345.678/0001-90', documentType: 'CNPJ', plan: 'Enterprise', fee: 'R$ 1.290,00', status: 'ativo', created: '21/09/2025' },
  { id: '5', name: 'Felipe Cardoso', email: 'felipe.cardoso@gmail.com', document: '520.337.114-06', documentType: 'CPF', plan: 'Pro', fee: 'R$ 149,90', status: 'ativo', created: '30/11/2025' },
  { id: '6', name: 'Gustavo Reis', email: 'gustavo.reis@gmail.com', document: '412.665.998-30', documentType: 'CPF', plan: 'Free', fee: '—', status: 'inativo', created: '22/05/2025' },
  { id: '7', name: 'Helena Prado', email: 'helena.prado@empresa.com', document: '889.114.220-71', documentType: 'CPF', plan: 'Starter', fee: 'R$ 49,90', status: 'ativo', created: '10/03/2026' },
  { id: '8', name: 'Igor Belmonte', email: 'igor@belmonte.dev', document: '23.901.554/0001-12', documentType: 'CNPJ', plan: 'Enterprise', fee: 'R$ 1.290,00', status: 'pendente', created: '04/12/2025' },
  { id: '9', name: 'Júlia Moraes', email: 'julia.moraes@gmail.com', document: '110.448.339-25', documentType: 'CPF', plan: 'Pro', fee: 'R$ 149,90', status: 'ativo', created: '17/02/2026' },
  { id: '10', name: 'Kelvin Araújo', email: 'kelvin.araujo@empresa.com', document: '634.220.881-09', documentType: 'CPF', plan: 'Starter', fee: 'R$ 49,90', status: 'bloqueado', created: '08/10/2025' },
  { id: '11', name: 'Larissa Pinho', email: 'larissa.pinho@gmail.com', document: '457.119.662-83', documentType: 'CPF', plan: 'Pro', fee: 'R$ 149,90', status: 'ativo', created: '25/01/2026' },
  { id: '12', name: 'Marcos Vidal', email: 'marcos@vidalco.com', document: '34.778.221/0001-55', documentType: 'CNPJ', plan: 'Enterprise', fee: 'R$ 1.290,00', status: 'inativo', created: '14/07/2025' },
  { id: '13', name: 'Natália Brito', email: 'natalia.brito@empresa.com', document: '208.553.741-60', documentType: 'CPF', plan: 'Starter', fee: 'R$ 49,90', status: 'ativo', created: '03/03/2026' },
  { id: '14', name: 'Otávio Lemos', email: 'otavio.lemos@gmail.com', document: '991.226.503-17', documentType: 'CPF', plan: 'Free', fee: '—', status: 'pendente', created: '29/11/2025' },
]

const clientColumns: NtkTableColumn[] = [
  { id: 'client', label: 'Cliente', sortable: true },
  { id: 'document', label: 'Documento' },
  { id: 'plan', label: 'Plano' },
  { id: 'fee', label: 'Mensalidade', align: 'right', sortable: true },
  { id: 'status', label: 'Status' },
  { id: 'created', label: 'Criado', sortable: true },
  { id: 'actions', label: 'Ações', align: 'right' },
]

const search = ref('')
const statusFilter = ref<'todos' | ClientStatus>('todos')
const clientSort = ref<NtkTableSort | null>({ field: 'client', direction: 'asc' })
const clientPage = ref(1)
const CLIENT_PAGE_SIZE = 6

const onSearch = (value: string): void => {
  search.value = value
  clientPage.value = 1
}
const setStatusFilter = (value: 'todos' | ClientStatus): void => {
  statusFilter.value = value
  clientPage.value = 1
}

const statusFilters = computed(() => {
  const count = (s: ClientStatus): number => clientStore.filter((c) => c.status === s).length
  return [
    { label: 'Todos', value: 'todos' as const, count: clientStore.length },
    { label: 'Ativos', value: 'ativo' as const, count: count('ativo') },
    { label: 'Pendentes', value: 'pendente' as const, count: count('pendente') },
    { label: 'Inativos', value: 'inativo' as const, count: count('inativo') },
    { label: 'Bloqueados', value: 'bloqueado' as const, count: count('bloqueado') },
  ]
})

const filteredClients = computed<Client[]>(() => {
  const term = search.value.trim().toLowerCase()
  return clientStore.filter((c) => {
    const matchesStatus = statusFilter.value === 'todos' || c.status === statusFilter.value
    const matchesTerm = !term
      || c.name.toLowerCase().includes(term)
      || c.email.toLowerCase().includes(term)
      || c.document.toLowerCase().includes(term)
    return matchesStatus && matchesTerm
  })
})

const feeValue = (fee: string): number => {
  const numeric = fee.replace(/[^\d,]/g, '').replace(/\./g, '').replace(',', '.')
  const parsed = Number.parseFloat(numeric)
  return Number.isNaN(parsed) ? 0 : parsed
}

const sortedClients = computed<Client[]>(() => {
  const s = clientSort.value
  if (!s) return [...filteredClients.value]
  const factor = s.direction === 'asc' ? 1 : -1
  return [...filteredClients.value].sort((a, b) => {
    if (s.field === 'client') return a.name.localeCompare(b.name) * factor
    if (s.field === 'fee') return (feeValue(a.fee) - feeValue(b.fee)) * factor
    if (s.field === 'created') return a.created.localeCompare(b.created) * factor
    return 0
  })
})

const clientPagination = computed(() => ({
  page: clientPage.value,
  pageSize: CLIENT_PAGE_SIZE,
  total: filteredClients.value.length,
}))

const clientRows = computed<NtkTableRow[]>(() => {
  const start = (clientPage.value - 1) * CLIENT_PAGE_SIZE
  return sortedClients.value.slice(start, start + CLIENT_PAGE_SIZE).map((c) => ({
    id: c.id,
    cells: {
      client: c.name,
      email: c.email,
      document: c.document,
      documentType: c.documentType,
      plan: c.plan,
      fee: c.fee,
      status: c.status,
      created: c.created,
    },
  }))
})

const onClientSort = (next: NtkTableSort | null): void => {
  clientSort.value = next
  clientPage.value = 1
}
const onClientPage = (next: number): void => {
  clientPage.value = next
}

const noop = (id: string): void => {
  void id
}
</script>

<style scoped>
/* ====================================================================
   Standalone showcase chrome. Token-only colors (var(--ntk-*)); samples
   are not governed but stay clean. No raw hex except the brand-lockup
   demo surfaces, which intentionally illustrate fixed lockup backgrounds.
   ==================================================================== */
.dss {
  min-block-size: 100vh;
  background: var(--ntk-bg-secondary);
  color: var(--ntk-text-primary);
  font-family: var(--ntk-font-family);
}

/* Dark TEMA live-resolve. The named brand themes ship their own LIGHT surface
   palette scoped to `html[data-theme] body`, which out-specifies the generic
   `html[data-color-scheme='dark']` token swap. So when Escuro is active we
   re-apply the dark surface/text/border tokens scoped to the showcase root —
   higher specificity than the brand's body-scoped light tokens — while keeping
   each brand's own `--ntk-primary*` hue. Token-only; samples allow local CSS. */
html[data-color-scheme='dark'] .dss {
  --ntk-bg-primary: #0f172a;
  --ntk-bg-secondary: #111c30;
  --ntk-bg-tertiary: #1e293b;
  --ntk-bg-card: #1a2436;
  --ntk-bg-elevated: #22304a;
  --ntk-bg-hover: rgba(148, 163, 184, 0.14);
  --ntk-bg-active: rgba(var(--ntk-primary-rgb), 0.28);
  --ntk-text-primary: #f1f5f9;
  --ntk-text-secondary: #cbd5e1;
  --ntk-text-muted: #94a3b8;
  --ntk-text-inverse: #0f172a;
  --ntk-text-on-primary: #ffffff;
  --ntk-border-color: #2b3a52;
  --ntk-border-light: #1e293b;
  --ntk-border-dark: #3b4a63;
  --ntk-border-input: rgba(226, 232, 240, 0.28);
  --ntk-border-input-hover: rgba(226, 232, 240, 0.5);
  --ntk-success-light: rgba(52, 211, 153, 0.18);
  --ntk-success-dark: #6ee7b7;
  --ntk-warning-light: rgba(251, 191, 36, 0.18);
  --ntk-warning-dark: #fcd34d;
  --ntk-error-light: rgba(248, 113, 113, 0.18);
  --ntk-error-dark: #fca5a5;
  --ntk-info-light: rgba(45, 212, 191, 0.18);
  --ntk-info-dark: #5eead4;
}

/* --- Top control bar (sticky) --- */
.dss-topbar {
  position: sticky;
  inset-block-start: 0;
  z-index: 20;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--ntk-spacing-lg);
  padding: var(--ntk-spacing-md) var(--ntk-spacing-xl);
  border-block-end: 1px solid var(--ntk-border-color);
  background: var(--ntk-bg-card);
}

.dss-topbar__controls {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: var(--ntk-spacing-lg);
}

.dss-control {
  display: flex;
  flex-direction: column;
  gap: var(--ntk-spacing-xs);
}

.dss-control__label {
  font-size: var(--ntk-font-size-xs);
  font-weight: var(--ntk-font-weight-bold);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ntk-text-muted);
}

.dss-segmented {
  display: inline-flex;
  gap: 2px;
  padding: 3px;
  border-radius: var(--ntk-radius-full);
  background: var(--ntk-bg-tertiary);
}

.dss-segmented__btn {
  padding: var(--ntk-spacing-xs) var(--ntk-spacing-md);
  border: 0;
  border-radius: var(--ntk-radius-full);
  background: transparent;
  color: var(--ntk-text-secondary);
  font: inherit;
  font-size: var(--ntk-font-size-sm);
  font-weight: var(--ntk-font-weight-medium);
  cursor: pointer;
  transition: background-color var(--ntk-transition-fast), color var(--ntk-transition-fast);
}

.dss-segmented__btn:hover {
  color: var(--ntk-text-primary);
}

.dss-segmented__btn--active {
  background: var(--ntk-primary-dark);
  color: var(--ntk-text-on-primary);
  font-weight: var(--ntk-font-weight-semibold);
}

.dss-segmented__btn:focus-visible {
  outline: 2px solid var(--ntk-border-focus);
  outline-offset: 2px;
}

/* --- Layout: TOC + main --- */
.dss-layout {
  display: grid;
  grid-template-columns: 240px minmax(0, 1fr);
  gap: var(--ntk-spacing-2xl);
  max-inline-size: 1280px;
  margin-inline: auto;
  padding: var(--ntk-spacing-2xl) var(--ntk-spacing-xl);
}

/* --- Left TOC sidebar (sticky) --- */
.dss-toc {
  position: sticky;
  inset-block-start: 96px;
  align-self: start;
  block-size: fit-content;
}

.dss-toc__group {
  margin-block-end: var(--ntk-spacing-lg);
}

.dss-toc__title {
  margin: 0 0 var(--ntk-spacing-sm);
  font-size: var(--ntk-font-size-xs);
  font-weight: var(--ntk-font-weight-bold);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ntk-text-muted);
}

.dss-toc__link {
  display: flex;
  align-items: center;
  gap: var(--ntk-spacing-xs);
  padding: var(--ntk-spacing-xs) 0;
  color: var(--ntk-text-secondary);
  font-size: var(--ntk-font-size-sm);
  text-decoration: none;
  transition: color var(--ntk-transition-fast);
}

.dss-toc__link:hover {
  color: var(--ntk-text-primary);
}

.dss-toc__link--active {
  color: var(--ntk-primary-dark);
  font-weight: var(--ntk-font-weight-semibold);
}

.dss-toc__dot {
  inline-size: 6px;
  block-size: 6px;
  border-radius: var(--ntk-radius-full);
  background: var(--ntk-primary-dark);
}

.dss-toc__link:focus-visible {
  outline: 2px solid var(--ntk-border-focus);
  outline-offset: 2px;
}

/* --- Main + sections --- */
.dss-main {
  min-inline-size: 0;
  display: flex;
  flex-direction: column;
  gap: var(--ntk-spacing-3xl);
}

.dss-section {
  scroll-margin-block-start: 110px;
}

.dss-eyebrow {
  margin: 0 0 var(--ntk-spacing-md);
  font-size: var(--ntk-font-size-xs);
  font-weight: var(--ntk-font-weight-bold);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ntk-text-muted);
}

.dss-eyebrow--primary {
  color: var(--ntk-primary-dark);
}

/* Numbered section heading: "01 Título" inline-left, matching the reference. */
.dss-numbered {
  display: flex;
  align-items: baseline;
  gap: var(--ntk-spacing-sm);
  margin: 0 0 var(--ntk-spacing-md);
  font-family: var(--ntk-font-family-display);
  font-size: var(--ntk-font-size-2xl);
  font-weight: var(--ntk-font-weight-bold);
  line-height: var(--ntk-line-height-tight);
  color: var(--ntk-text-primary);
}

.dss-numbered__no {
  font-family: var(--ntk-font-family-mono);
  font-size: var(--ntk-font-size-sm);
  font-weight: var(--ntk-font-weight-bold);
  color: var(--ntk-primary-dark);
}

.dss-section__lead {
  max-inline-size: 70ch;
  margin: 0 0 var(--ntk-spacing-lg);
  color: var(--ntk-text-secondary);
  line-height: var(--ntk-line-height-normal);
}

.dss-section__lead code,
.dss-hero__lead code {
  font-family: var(--ntk-font-family-mono);
  font-size: 0.92em;
  color: var(--ntk-text-primary);
}

/* --- Hero --- */
.dss-hero__title {
  margin: 0 0 var(--ntk-spacing-md);
  font-family: var(--ntk-font-family-display);
  font-size: clamp(2rem, 4vw, 3.25rem);
  font-weight: var(--ntk-font-weight-extrabold);
  line-height: 1.05;
  color: var(--ntk-text-primary);
}

.dss-hero__lead {
  max-inline-size: 68ch;
  margin: 0 0 var(--ntk-spacing-lg);
  font-size: var(--ntk-font-size-lg);
  color: var(--ntk-text-secondary);
  line-height: var(--ntk-line-height-normal);
}

.dss-hero__chips {
  display: flex;
  flex-wrap: wrap;
  gap: var(--ntk-spacing-sm);
}

/* --- Brand lockups --- */
.dss-lockups {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: var(--ntk-spacing-md);
}

.dss-lockup__surface {
  display: flex;
  align-items: center;
  position: relative;
  block-size: 96px;
  padding: var(--ntk-spacing-lg);
  border-radius: var(--ntk-radius-lg);
  overflow: hidden;
}

.dss-lockup__surface--positive {
  border: 1px solid var(--ntk-border-color);
  background: var(--ntk-bg-card);
}

.dss-lockup__surface--negative {
  background: var(--ntk-primary-dark);
}

.dss-lockup__surface--mono {
  background: var(--ntk-dark);
}

.dss-lockup__surface--photo {
  background:
    repeating-linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0 12px, transparent 12px 24px),
    linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
}

/* Logo wordmark/mark recolor for dark lockups (decorative demo surfaces). */
.dss-lockup__surface--negative :deep(.ntk-logo__text),
.dss-lockup__surface--mono :deep(.ntk-logo__text),
.dss-lockup__surface--photo :deep(.ntk-logo__text) {
  color: #ffffff;
}

.dss-lockup__surface--negative :deep(.ntk-logo__mark) {
  background: #ffffff;
  color: var(--ntk-primary-dark);
}

.dss-lockup__overlay {
  position: absolute;
  inset-block-end: var(--ntk-spacing-sm);
  inset-inline-end: var(--ntk-spacing-md);
  font-family: var(--ntk-font-family-mono);
  font-size: var(--ntk-font-size-xs);
  color: rgba(255, 255, 255, 0.75);
}

.dss-lockup__caption {
  margin: var(--ntk-spacing-sm) 0 0;
  font-size: var(--ntk-font-size-sm);
  color: var(--ntk-text-secondary);
}

/* --- Clientes (tela real) --- */
.dss-proof {
  display: flex;
  align-items: center;
  gap: var(--ntk-spacing-md);
  margin-block-end: var(--ntk-spacing-sm);
}

.dss-proof__title {
  margin: 0;
  font-family: var(--ntk-font-family-display);
  font-size: var(--ntk-font-size-2xl);
  font-weight: var(--ntk-font-weight-bold);
  color: var(--ntk-text-primary);
}

.dss-clients__head {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--ntk-spacing-md);
  inline-size: 100%;
}

.dss-clients__title {
  margin: 0;
  font-family: var(--ntk-font-family-display);
  font-size: var(--ntk-font-size-xl);
  font-weight: var(--ntk-font-weight-bold);
  color: var(--ntk-text-primary);
}

.dss-clients__subtitle {
  margin: var(--ntk-spacing-xs) 0 0;
  font-size: var(--ntk-font-size-sm);
  color: var(--ntk-text-secondary);
}

.dss-clients__toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--ntk-spacing-md);
}

.dss-clients__search {
  flex: 1 1 280px;
}

.dss-clients__count {
  font-family: var(--ntk-font-family-mono);
  font-size: var(--ntk-font-size-sm);
  color: var(--ntk-text-secondary);
}

.dss-clients__filters {
  display: flex;
  flex-wrap: wrap;
  gap: var(--ntk-spacing-sm);
}

.dss-pill {
  display: inline-flex;
  align-items: center;
  gap: var(--ntk-spacing-xs);
  padding: var(--ntk-spacing-xs) var(--ntk-spacing-md);
  border: 1px solid var(--ntk-border-color);
  border-radius: var(--ntk-radius-full);
  background: var(--ntk-bg-card);
  color: var(--ntk-text-secondary);
  font: inherit;
  font-size: var(--ntk-font-size-sm);
  cursor: pointer;
  transition: background-color var(--ntk-transition-fast), color var(--ntk-transition-fast);
}

.dss-pill:hover {
  background: var(--ntk-bg-hover);
  color: var(--ntk-text-primary);
}

.dss-pill--active {
  border-color: transparent;
  background: var(--ntk-primary-dark);
  color: var(--ntk-text-on-primary);
  font-weight: var(--ntk-font-weight-semibold);
}

.dss-pill__count {
  font-family: var(--ntk-font-family-mono);
  font-size: var(--ntk-font-size-xs);
  opacity: 0.85;
}

.dss-pill:focus-visible {
  outline: 2px solid var(--ntk-border-focus);
  outline-offset: 2px;
}

.dss-cell-client {
  display: flex;
  flex-direction: column;
}

.dss-cell-client__name {
  font-weight: var(--ntk-font-weight-semibold);
  color: var(--ntk-text-primary);
}

.dss-cell-client__email {
  font-size: var(--ntk-font-size-xs);
  color: var(--ntk-text-muted);
}

.dss-cell-doc {
  display: flex;
  flex-direction: column;
}

.dss-cell-doc__value {
  font-family: var(--ntk-font-family-mono);
  font-size: var(--ntk-font-size-xs);
  color: var(--ntk-text-primary);
}

.dss-cell-doc__type {
  font-family: var(--ntk-font-family-mono);
  font-size: var(--ntk-font-size-xs);
  color: var(--ntk-text-muted);
}

.dss-cell-actions {
  display: inline-flex;
  gap: var(--ntk-spacing-xs);
  justify-content: flex-end;
}

/* --- 01 Cores: swatches --- */
.dss-swatches {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: var(--ntk-spacing-md);
  margin-block-end: var(--ntk-spacing-xl);
}

.dss-swatch__chip {
  block-size: 64px;
  border: 1px solid transparent;
  border-radius: var(--ntk-radius-md);
}

.dss-swatch__chip--label {
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--ntk-font-family-display);
  font-size: var(--ntk-font-size-lg);
  font-weight: var(--ntk-font-weight-bold);
}

.dss-swatch__name {
  margin: var(--ntk-spacing-sm) 0 2px;
  font-size: var(--ntk-font-size-sm);
  font-weight: var(--ntk-font-weight-semibold);
  color: var(--ntk-text-primary);
}

.dss-swatch__token {
  display: block;
  font-family: var(--ntk-font-family-mono);
  font-size: var(--ntk-font-size-xs);
  color: var(--ntk-text-muted);
  word-break: break-all;
}

/* --- Brand cards --- */
.dss-brands {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--ntk-spacing-lg);
}

.dss-brand-card--active {
  border-color: var(--ntk-primary);
  box-shadow: var(--ntk-shadow-focus);
}

.dss-brand-card__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--ntk-spacing-md);
}

.dss-brand-card__name {
  margin: 0;
  font-size: var(--ntk-font-size-lg);
  font-weight: var(--ntk-font-weight-bold);
  color: var(--ntk-text-primary);
}

.dss-brand-card__hex {
  font-family: var(--ntk-font-family-mono);
  font-size: var(--ntk-font-size-xs);
  color: var(--ntk-text-muted);
}

.dss-brand-card__cols {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: var(--ntk-spacing-sm);
}

.dss-brand-card__col {
  display: flex;
  flex-direction: column;
  gap: var(--ntk-spacing-xs);
  align-items: center;
}

.dss-brand-card__col-chip {
  inline-size: 100%;
  block-size: 44px;
  border: 1px solid transparent;
  border-radius: var(--ntk-radius-md);
}

.dss-brand-card__col-label {
  font-family: var(--ntk-font-family-mono);
  font-size: var(--ntk-font-size-xs);
  color: var(--ntk-text-muted);
}

.dss-brand-card__cta {
  inline-size: 100%;
  justify-content: center;
}

/* --- 02 Tipografia --- */
.dss-type {
  list-style: none;
  margin: 0;
  padding: 0;
}

.dss-type__row {
  display: grid;
  grid-template-columns: 180px minmax(0, 1fr);
  gap: var(--ntk-spacing-lg);
  align-items: center;
  padding-block: var(--ntk-spacing-md);
  border-block-end: 1px solid var(--ntk-border-light);
}

.dss-type__row:last-child {
  border-block-end: 0;
}

.dss-type__name {
  display: block;
  font-weight: var(--ntk-font-weight-bold);
  color: var(--ntk-text-primary);
}

.dss-type__spec {
  font-family: var(--ntk-font-family-mono);
  font-size: var(--ntk-font-size-xs);
  color: var(--ntk-text-muted);
}

.dss-type__sample {
  color: var(--ntk-text-primary);
  min-inline-size: 0;
}

.dss-type__sample--display {
  font-family: var(--ntk-font-family-display);
  font-size: var(--ntk-font-size-4xl);
  font-weight: var(--ntk-font-weight-bold);
}

.dss-type__sample--h1 {
  font-family: var(--ntk-font-family-display);
  font-size: var(--ntk-font-size-3xl);
  font-weight: var(--ntk-font-weight-bold);
}

.dss-type__sample--h2 {
  font-family: var(--ntk-font-family-display);
  font-size: var(--ntk-font-size-2xl);
  font-weight: var(--ntk-font-weight-bold);
}

.dss-type__sample--h3 {
  font-size: var(--ntk-font-size-lg);
  font-weight: var(--ntk-font-weight-semibold);
}

.dss-type__sample--body {
  font-size: var(--ntk-font-size-base);
}

.dss-type__sample--strong {
  font-size: var(--ntk-font-size-base);
  font-weight: var(--ntk-font-weight-semibold);
}

.dss-type__sample--small {
  font-size: var(--ntk-font-size-sm);
  color: var(--ntk-text-secondary);
}

.dss-type__sample--mono {
  font-family: var(--ntk-font-family-mono);
  font-size: var(--ntk-font-size-sm);
  color: var(--ntk-text-secondary);
}

/* --- 03 Espaçamento & raio --- */
.dss-scale-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--ntk-spacing-lg);
}

.dss-spacing {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--ntk-spacing-sm);
}

.dss-spacing__row {
  display: grid;
  grid-template-columns: 150px 1fr auto;
  gap: var(--ntk-spacing-md);
  align-items: center;
}

.dss-spacing__token {
  font-family: var(--ntk-font-family-mono);
  font-size: var(--ntk-font-size-xs);
  color: var(--ntk-text-secondary);
}

.dss-spacing__bar {
  display: inline-block;
  block-size: 14px;
  border-radius: var(--ntk-radius-sm);
  background: var(--ntk-primary-dark);
}

.dss-spacing__value {
  font-family: var(--ntk-font-family-mono);
  font-size: var(--ntk-font-size-xs);
  color: var(--ntk-text-muted);
}

.dss-radii {
  display: flex;
  flex-wrap: wrap;
  gap: var(--ntk-spacing-lg);
}

.dss-radius {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--ntk-spacing-xs);
}

.dss-radius__chip {
  inline-size: 56px;
  block-size: 56px;
  border: 1px solid var(--ntk-primary);
  background: var(--ntk-bg-active);
}

.dss-radius__label {
  font-family: var(--ntk-font-family-mono);
  font-size: var(--ntk-font-size-xs);
  color: var(--ntk-text-muted);
}

/* --- 04 Botões --- */
.dss-btn-matrix,
.dss-btn-extra {
  display: flex;
  flex-direction: column;
  gap: var(--ntk-spacing-md);
}

.dss-btn-extra {
  inline-size: 100%;
}

.dss-btn-row {
  display: grid;
  grid-template-columns: 84px minmax(0, 1fr);
  gap: var(--ntk-spacing-md);
  align-items: center;
}

.dss-btn-row__label {
  font-family: var(--ntk-font-family-mono);
  font-size: var(--ntk-font-size-xs);
  color: var(--ntk-text-muted);
}

.dss-btn-row__cells {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--ntk-spacing-sm);
}

/* Soft button row: token-only soft fill on a ghost-like button. */
.dss-btn-soft.ntk-button {
  background: var(--ntk-bg-active);
  color: var(--ntk-primary-dark);
}

.dss-btn-soft.ntk-button.ntk-button--intent-success {
  background: var(--ntk-success-light);
  color: var(--ntk-success-dark);
}

.dss-btn-soft.ntk-button.ntk-button--intent-warning {
  background: var(--ntk-warning-light);
  color: var(--ntk-warning-dark);
}

.dss-btn-soft.ntk-button.ntk-button--intent-danger {
  background: var(--ntk-error-light);
  color: var(--ntk-error-dark);
}

.dss-btn-soft.ntk-button.ntk-button--intent-info {
  background: var(--ntk-info-light);
  color: var(--ntk-info-dark);
}

.dss-btn-soft.ntk-button.ntk-button--intent-neutral {
  background: var(--ntk-bg-hover);
  color: var(--ntk-text-primary);
}

/* DsInput renders its invalid hint in `--ntk-error`, which at 12px on the white
   card surface lands at ~3.8:1 (below AA 4.5:1). Without touching the governed
   component, deepen the showcase's field error text to the AA-safe dark shade. */
.dss :deep(.ntk-field--is-invalid .ntk-field__message) {
  color: var(--ntk-error-dark);
}

/* Persistent focus ring demo (visualizes the :focus-visible look). */
.dss-focus-demo :deep(.ntk-field__control) {
  border-color: var(--ntk-border-focus);
  outline: 2px solid var(--ntk-border-focus);
  outline-offset: 2px;
}

.dss-focus-demo.ntk-button {
  outline: 2px solid var(--ntk-border-focus);
  outline-offset: 2px;
}

/* --- 05 Inputs --- */
.dss-form-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--ntk-spacing-lg);
}

.dss-loading-field__control {
  display: flex;
  align-items: center;
  justify-content: space-between;
  inline-size: 100%;
  box-sizing: border-box;
  padding-block: var(--ntk-spacing-sm);
  padding-inline: var(--ntk-spacing-md);
  border: 1px solid var(--ntk-border-input);
  border-radius: var(--ntk-radius-md);
  background: var(--ntk-bg-card);
}

.dss-loading-field__text {
  color: var(--ntk-text-muted);
}

.dss-loading-field__spinner {
  inline-size: 1.1rem;
  block-size: 1.1rem;
  border: 2px solid var(--ntk-border-color);
  border-block-start-color: var(--ntk-primary);
  border-radius: var(--ntk-radius-full);
  animation: dss-spin 0.8s linear infinite;
}

@keyframes dss-spin {
  to { transform: rotate(360deg); }
}

@media (prefers-reduced-motion: reduce) {
  .dss-loading-field__spinner { animation-duration: 0.01ms; }
}

/* --- 06 Cards --- */
.dss-cards-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: var(--ntk-spacing-lg);
}

.dss-card-demo__title {
  margin: var(--ntk-spacing-xs) 0 0;
  font-size: var(--ntk-font-size-lg);
  font-weight: var(--ntk-font-weight-bold);
  color: var(--ntk-text-primary);
}

/* --- 07 Badges --- */
.dss-badge-matrix {
  display: flex;
  flex-direction: column;
  gap: var(--ntk-spacing-sm);
}

.dss-badge-row {
  display: grid;
  grid-template-columns: 84px minmax(0, 1fr);
  gap: var(--ntk-spacing-md);
  align-items: center;
}

.dss-badge-row__label {
  font-family: var(--ntk-font-family-mono);
  font-size: var(--ntk-font-size-xs);
  color: var(--ntk-text-muted);
}

.dss-badge-row__cells {
  display: flex;
  gap: var(--ntk-spacing-md);
}

/* --- 08 Estados --- */
.dss-states-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--ntk-spacing-lg);
}

/* --- 09 Feedback --- */
.dss-feedback {
  display: flex;
  flex-direction: column;
  gap: var(--ntk-spacing-md);
}

.dss-feedback__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--ntk-spacing-sm);
  margin-block-start: var(--ntk-spacing-sm);
}

/* --- Responsive --- */
@media (max-width: 1024px) {
  .dss-layout {
    grid-template-columns: 1fr;
  }
  .dss-toc {
    position: static;
  }
  .dss-swatches { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .dss-form-grid,
  .dss-states-grid,
  .dss-cards-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .dss-lockups { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .dss-brands,
  .dss-scale-grid { grid-template-columns: 1fr; }
}

@media (max-width: 640px) {
  .dss-swatches,
  .dss-form-grid,
  .dss-states-grid,
  .dss-cards-grid,
  .dss-lockups { grid-template-columns: 1fr; }
}
</style>