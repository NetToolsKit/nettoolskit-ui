/**
 * Catalog SHELL i18n dictionary (PT default / EN).
 *
 * Strings mirror the reference standalone catalog. This covers the shell only
 * (control bar, TOC, hero, banner, brand lockups and section stubs); full
 * per-component i18n is a later phase.
 */
import type { CatalogLocale } from './useCatalogShell'

export type CatalogStrings = Record<string, string>

const pt: CatalogStrings = {
  // brand / chrome
  brandName: 'NetToolsKit',
  brandCaption: 'Design System',
  // control-bar labels
  lblTheme: 'Tema',
  lblBrand: 'Marca',
  lblDensity: 'Densidade',
  lblLang: 'Idioma',
  lblFont: 'Fonte',
  tLight: 'Claro',
  tDark: 'Escuro',
  tHc: 'Alto contraste',
  dCompact: 'Compacto',
  dComfortable: 'Confortável',
  dSpacious: 'Espaçoso',
  colorBtn: 'Cor',
  brandColorLbl: 'Cor da marca',
  custom: 'Personalizada',
  reset: 'Redefinir',
  // TOC
  idxTitle: 'Índice',
  tocOverview: 'Visão geral',
  navExamples: 'Exemplos de telas',
  tocFoundations: 'Fundamentos',
  tocComponents: 'Componentes',
  tocExpandAll: 'Expandir tudo',
  tocCollapseAll: 'Recolher tudo',
  tocExpandOne: 'Expandir um nível',
  tocCollapseOne: 'Recolher um nível',
  // nav items
  navIntro: 'Introdução',
  navLogin: 'Login',
  navWeb: 'Web',
  navEcommerce: 'E-commerce',
  navDashboards: 'Dashboards',
  navFlow: 'Fluxo / BPM',
  nav3d: 'Visualizador 3D',
  navIndustrial: 'Industrial',
  navCores: 'Cores & temas',
  navTipografia: 'Tipografia',
  navEspaco: 'Espaçamento & raio',
  navBotoes: 'Botões',
  navInputs: 'Inputs & forms',
  navCards: 'Cards',
  navBadges: 'Badges',
  navModais: 'Modais',
  navTabela: 'Tabela & estados',
  navInterativos: 'Interativos',
  navFeedback: 'Feedback',
  // hero
  heroEyebrow: 'NTK-FE-STD-001 · v1.0',
  h1Title: 'Sistema de Design NetToolsKit',
  introLead:
    'Catálogo vivo dos tokens, temas e componentes Ds*. Engineering-first sobre Vue 3 + Quasar, tokens DTCG e contratos tipados. Cada peça abaixo lê das mesmas CSS Custom Properties do padrão.',
  introCalloutStrong: 'Use os controles no topo.',
  introCallout:
    'Tema, marca (cor), densidade e idioma re-resolvem os tokens e a interface em tempo real — inclusive as telas Web e Industrial logo abaixo.',
  // brand lockups
  brandApps: 'Aplicações da marca',
  lockPos: 'Positiva',
  lockNeg: 'Negativa',
  lockMono: 'Monocromática',
  lockPhoto: 'Foto',
  lockPhotoOverlay: 'overlay 60–80%',
  fullscreen: 'Tela cheia',
  // screen section badges/titles/descs
  loginBadge: 'TELA · LOGIN',
  loginTitle: 'Login',
  loginDesc:
    'Split — esquerda com marca e dados da empresa (mais larga), direita com o formulário (mais estreita).',
  webBadge: 'TELA · WEB',
  webTitle: 'Web',
  webDesc:
    'Página de produto montada 100% com DsPage · DsPageHeader · DsSection · DsInput · DsTable · DsBadge. Busca, ordenação, paginação e estados reagem aos controles.',
  ecomBadge: 'TELA · E-COMMERCE',
  ecomTitle: 'E-commerce',
  ecomDesc:
    'Shell de aplicação com menu superior fixo e menu lateral colapsável, sobre os tokens do design system.',
  dashBadge: 'TELA · DASHBOARD',
  dashTitle: 'Dashboards',
  dashDesc:
    'Painéis com gráficos, mapa de calor (na cor escolhida), mapa por região, matriz e KPIs — tudo sobre os tokens.',
  flowBadge: 'TELA · FLUXO / BPM',
  flowDesc: 'Editor de fluxo / BPM sobre os tokens do design system.',
  tdBadge: 'TELA · 3D / MOCAP',
  tdTitle: 'Visualizador 3D',
  tdDesc:
    'Player de animação 3D (FBX / mocap) com Three.js — figura animada; arraste no viewport para girar. A cor segue a marca.',
  indBadge: 'APP DESKTOP · EMBUTIDA',
  indTitle: 'Industrial',
  indDesc:
    'O workspace de engenharia (DesktopShell · Ribbon · DockLayout · TreeExplorer · Canvas · StatusBar) embutido aqui. Cor da marca, tema e densidade são centralizados e controlados pelo design system.',
  // foundations
  coresTitle: 'Cores & temas',
  coresDesc:
    'Papéis semânticos resolvidos em runtime via CSS Custom Properties — referenciados por nome de token. Os blocos reagem ao tema ativo.',
  tipoTitle: 'Tipografia',
  tipoDesc:
    'IBM Plex Sans para interface, IBM Plex Mono para tokens e dados técnicos. Base 15px, altura de linha 1.4–1.6, hierarquia semântica.',
  espacoTitle: 'Espaçamento & raio',
  espacoDesc:
    'Escala de espaço em múltiplos de 4px e raios de canto padronizados. Densidade ajusta alturas e paddings sem mudar a escala base.',
  // components
  botoesTitle: 'Botões',
  botoesDesc:
    'DsButton — props fechadas: tone × variant × size. Cores resolvidas por recipe a partir dos tokens.',
  inputsTitle: 'Inputs & formulários',
  inputsDesc:
    'DsInput — label sempre visível, hint e erro conectados por aria-describedby. Estados de foco, erro, desabilitado e carregando.',
  cardsTitle: 'Cards',
  cardsDesc: 'DsCard — variantes flat · outlined · elevated · soft com padding por densidade.',
  badgesTitle: 'Badges',
  badgesDesc:
    'DsBadge — tons semânticos em solid e soft. Nunca dependem só da cor: trazem texto e ponto.',
  modaisTitle: 'Modais',
  modaisDesc:
    'DsModal — cabeçalho com título e “X” de fechar à direita, corpo rolável e rodapé reservado. Vários tamanhos; fecha no overlay ou no X.',
  tabelaTitle: 'Tabela & estados',
  tabelaDesc:
    'DsTable exige estados explícitos: carregando, vazio e erro. Abaixo, um exemplo com scroll horizontal e vertical.',
  interTitle: 'Padrões interativos',
  interDesc:
    'Arrastar e soltar e entrada livre — Kanban, agenda e quadro de desenho, todos sobre os tokens do design system.',
  feedbackTitle: 'Feedback',
  feedbackDesc:
    'Notificações e banners acessados por serviço semântico — feedback.success / error / critical. Mensagens acionáveis, críticas persistentes.',
  sectionStub: 'Conteúdo desta seção chega em uma fase posterior.',
  // chips
  chipVue: 'Vue 3',
  chipTs: 'TypeScript',
  chipQuasar: 'Quasar',
  chipTokens: 'Tokens DTCG',
  chipLayers: 'CSS Cascade Layers',
  chipWcag: 'WCAG 2.2 AA',
}

const en: CatalogStrings = {
  brandName: 'NetToolsKit',
  brandCaption: 'Design System',
  lblTheme: 'Theme',
  lblBrand: 'Brand',
  lblDensity: 'Density',
  lblLang: 'Language',
  lblFont: 'Font',
  tLight: 'Light',
  tDark: 'Dark',
  tHc: 'High contrast',
  dCompact: 'Compact',
  dComfortable: 'Comfortable',
  dSpacious: 'Spacious',
  colorBtn: 'Color',
  brandColorLbl: 'Brand color',
  custom: 'Custom',
  reset: 'Reset',
  idxTitle: 'Index',
  tocOverview: 'Overview',
  navExamples: 'Screen examples',
  tocFoundations: 'Foundations',
  tocComponents: 'Components',
  tocExpandAll: 'Expand all',
  tocCollapseAll: 'Collapse all',
  tocExpandOne: 'Expand one level',
  tocCollapseOne: 'Collapse one level',
  navIntro: 'Introduction',
  navLogin: 'Login',
  navWeb: 'Web',
  navEcommerce: 'E-commerce',
  navDashboards: 'Dashboards',
  navFlow: 'Flow / BPM',
  nav3d: '3D Viewer',
  navIndustrial: 'Industrial',
  navCores: 'Colors & themes',
  navTipografia: 'Typography',
  navEspaco: 'Spacing & radius',
  navBotoes: 'Buttons',
  navInputs: 'Inputs & forms',
  navCards: 'Cards',
  navBadges: 'Badges',
  navModais: 'Modals',
  navTabela: 'Table & states',
  navInterativos: 'Interactive',
  navFeedback: 'Feedback',
  heroEyebrow: 'NTK-FE-STD-001 · v1.0',
  h1Title: 'NetToolsKit Design System',
  introLead:
    'Living catalog of Ds* tokens, themes and components. Engineering-first on Vue 3 + Quasar, DTCG tokens and typed contracts. Every piece below reads from the same CSS Custom Properties.',
  introCalloutStrong: 'Use the controls on top.',
  introCallout:
    'Theme, brand (color), density and language re-resolve the tokens and UI in real time — including the Web and Industrial screens right below.',
  brandApps: 'Brand applications',
  lockPos: 'Positive',
  lockNeg: 'Negative',
  lockMono: 'Monochrome',
  lockPhoto: 'Photo',
  lockPhotoOverlay: 'overlay 60–80%',
  fullscreen: 'Fullscreen',
  loginBadge: 'SCREEN · LOGIN',
  loginTitle: 'Login',
  loginDesc: 'Split — left with brand and company info (wider), right with the form (narrower).',
  webBadge: 'SCREEN · WEB',
  webTitle: 'Web',
  webDesc:
    'Product page built 100% with DsPage · DsPageHeader · DsSection · DsInput · DsTable · DsBadge. Search, sorting, pagination and states react to the controls.',
  ecomBadge: 'SCREEN · E-COMMERCE',
  ecomTitle: 'E-commerce',
  ecomDesc:
    'Application shell with a fixed top menu and a collapsible side menu, on the design-system tokens.',
  dashBadge: 'SCREEN · DASHBOARD',
  dashTitle: 'Dashboards',
  dashDesc: 'Panels with charts, heatmap (in the chosen color), map by region, matrix and KPIs — all on the tokens.',
  flowBadge: 'SCREEN · FLOW / BPM',
  flowDesc: 'Flow / BPM editor on the design-system tokens.',
  tdBadge: 'SCREEN · 3D / MOCAP',
  tdTitle: '3D Viewer',
  tdDesc:
    '3D animation player (FBX / mocap) with Three.js — animated figure; drag in the viewport to rotate. The color follows the brand.',
  indBadge: 'DESKTOP APP · EMBEDDED',
  indTitle: 'Industrial',
  indDesc:
    'The engineering workspace (DesktopShell · Ribbon · DockLayout · TreeExplorer · Canvas · StatusBar) embedded here. Brand color, theme and density are centralized and controlled by the design system.',
  coresTitle: 'Colors & themes',
  coresDesc:
    'Semantic roles resolved at runtime via CSS Custom Properties — referenced by token name. The blocks react to the active theme.',
  tipoTitle: 'Typography',
  tipoDesc:
    'IBM Plex Sans for UI, IBM Plex Mono for tokens and technical data. 15px base, 1.4–1.6 line height, semantic hierarchy.',
  espacoTitle: 'Spacing & radius',
  espacoDesc:
    'Spacing scale in multiples of 4px and standardized corner radii. Density adjusts heights and paddings without changing the base scale.',
  botoesTitle: 'Buttons',
  botoesDesc: 'DsButton — closed props: tone × variant × size. Colors resolved by recipe from the tokens.',
  inputsTitle: 'Inputs & forms',
  inputsDesc:
    'DsInput — label always visible, hint and error wired via aria-describedby. Focus, error, disabled and loading states.',
  cardsTitle: 'Cards',
  cardsDesc: 'DsCard — flat · outlined · elevated · soft variants with density-driven padding.',
  badgesTitle: 'Badges',
  badgesDesc: 'DsBadge — semantic tones in solid and soft. Never color-only: they carry text and a dot.',
  modaisTitle: 'Modals',
  modaisDesc:
    'DsModal — header with title and a close “X” on the right, scrollable body and a reserved footer. Several sizes; closes on overlay or X.',
  tabelaTitle: 'Table & states',
  tabelaDesc:
    'DsTable requires explicit states: loading, empty and error. Below, an example with horizontal and vertical scroll.',
  interTitle: 'Interactive patterns',
  interDesc: 'Drag-and-drop and free input — Kanban, agenda and drawing board, all on the design-system tokens.',
  feedbackTitle: 'Feedback',
  feedbackDesc:
    'Notifications and banners accessed via a semantic service — feedback.success / error / critical. Actionable messages, persistent criticals.',
  sectionStub: 'Content for this section arrives in a later phase.',
  chipVue: 'Vue 3',
  chipTs: 'TypeScript',
  chipQuasar: 'Quasar',
  chipTokens: 'DTCG Tokens',
  chipLayers: 'CSS Cascade Layers',
  chipWcag: 'WCAG 2.2 AA',
}

const dictionaries: Record<CatalogLocale, CatalogStrings> = { pt, en }

export function getCatalogStrings(locale: CatalogLocale): CatalogStrings {
  return dictionaries[locale] ?? pt
}