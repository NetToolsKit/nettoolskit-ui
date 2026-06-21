# Layout de Area de Edicao para CMS

## Objetivo

A area de edicao nao deve ficar centralizada com grandes espacos vazios nas laterais.
O editor deve ocupar integralmente a area disponivel do workspace, mantendo uma estrutura semelhante a ferramentas de autoria visual.

---

## Estrutura Geral

```text
AppShell
├── Topbar global
└── MainArea
    ├── NavigationSidebar
    ├── EditorWorkspace
    └── ContextRail opcional
```

---

## Regioes do Layout

### 1. Topbar global

Responsavel por navegacao principal, busca, identidade do produto e acoes globais.

### 2. NavigationSidebar

Responsavel por navegacao entre modulos, paginas, blocos, midia e demais areas do CMS.

### 3. EditorWorkspace

Responsavel por toda a experiencia de edicao.

O `EditorWorkspace` deve ocupar todo o espaco horizontal e vertical restante do shell.
Ele nao deve centralizar um card menor no meio da tela.

### 4. ContextRail

Painel lateral de apoio para propriedades, contexto, historico, recovery, acoes auxiliares ou detalhes do item selecionado.

Esse painel pode existir fixo a direita, mas sem criar area morta entre ele e o editor.

---

## Regra principal de ocupacao

O editor deve seguir a regra:

- a navegacao ocupa uma largura fixa a esquerda
- o rail contextual ocupa uma largura fixa a direita, quando existir
- a area entre esses dois paineis pertence integralmente ao editor
- o conteudo interno do editor deve expandir para preencher essa largura
- nao deve existir centralizacao de um container principal com margens grandes laterais

---

## Estrutura interna do EditorWorkspace

```text
EditorWorkspace
├── EditorTopbar
├── EditorBody
│   ├── EditorNavigator
│   ├── EditorCanvasRegion
│   └── DesignerRail
└── BottomPanels opcionais
```

---

## 1. EditorTopbar

Barra superior do editor.

Responsabilidades:

- acoes principais do contexto atual
- salvar
- desfazer e refazer
- importar e exportar
- alternancia de modo
- preview
- controles de zoom e grade

Essa barra deve ficar vinculada ao editor, nao ao shell global.

---

## 2. EditorBody

Area principal da edicao.

Ela deve ocupar toda a altura restante apos a `EditorTopbar`.

Estrutura:

```text
EditorBody
├── EditorNavigator
├── EditorCanvasRegion
└── DesignerRail
```

---

## 3. EditorNavigator

Painel lateral interno do editor.

Responsavel por:

- secoes editaveis
- navegacao entre partes do documento
- grupos de edicao
- categorias como branding, typography, layout e content

Esse painel e interno ao editor e nao deve empurrar o canvas para um bloco central pequeno.
Ele faz parte da malha do editor.

---

## 4. EditorCanvasRegion

Essa e a area central real de edicao.

Ela deve:

- ocupar todo o espaco restante entre `EditorNavigator` e `DesignerRail`
- crescer horizontalmente de forma fluida
- crescer verticalmente ate a base do editor
- permitir scroll quando necessario
- conter regua, grade e superficie de edicao

Estrutura:

```text
EditorCanvasRegion
├── CanvasToolbar opcional
├── RulerTop
├── RulerLeft
└── CanvasViewport
    └── CanvasSurface
        └── EditableDocument
```

---

## 5. CanvasViewport

Responsavel por rolagem e viewport da edicao.

Deve preencher integralmente a regiao central do editor.
Nao deve ser tratado como um card centralizado.
A viewport e a area viva do trabalho.

---

## 6. CanvasSurface

Responsavel pela superficie expandida onde o documento e exibido e manipulado.

Ela pode conter:

- grid
- snapping
- linhas-guia
- areas editaveis
- blocos arrastaveis
- overlays de selecao

---

## 7. EditableDocument

Representa o documento em edicao.

Estrutura sugerida:

```text
EditableDocument
├── HeaderRegion
├── ContentRegion
└── FooterRegion
```

O documento pode ter largura logica definida, mas a viewport precisa continuar ocupando toda a area do editor.
Ou seja: o documento pode ter sua propria medida, porem o sistema de edicao nao pode ficar visualmente comprimido em um bloco pequeno com sobras laterais.

---

## Regra para eliminar area morta

A area marcada em vermelho no exemplo nao deve existir como espaco sem funcao.

Para evitar isso, o layout deve seguir estas regras:

- o `EditorWorkspace` ocupa 100% do espaco restante do shell
- o `EditorBody` ocupa 100% da largura disponivel
- o `EditorCanvasRegion` usa toda a largura livre entre os paineis internos
- qualquer espaco adicional deve pertencer ao viewport do editor
- a grade deve continuar ate os limites visiveis da viewport
- o documento editavel pode ficar posicionado dentro da viewport, mas a viewport continua sendo area ativa

Isso significa que, mesmo quando o documento tiver largura menor que a regiao visivel, o restante continua sendo area util de edicao, navegacao visual, drag and drop, selecao ou preview de estrutura.

---

## Comportamento esperado do Preview

O botao `Preview` nao deve apenas trocar estado local dentro do mesmo bloco.
Ele deve abrir uma nova regiao de trabalho.

### Regra de funcionamento

Ao acionar `Preview`, o sistema deve abrir uma nova guia no workspace.

Exemplo:

```text
WorkspaceTabs
├── Branding
├── Layout
└── Preview
```

### Comportamento da guia Preview

A guia `Preview` deve:

- abrir dentro do mesmo workspace
- coexistir com a guia de edicao
- permitir alternancia rapida entre edicao e visualizacao
- renderizar a composicao atual sem controles de edicao
- refletir o estado atual do documento
- permitir atualizacao a partir do estado salvo ou do estado em memoria, conforme a estrategia adotada

---

## Estrutura sugerida para multiplas guias

```text
EditorWorkspace
├── EditorTabBar
│   ├── Tab: Editor
│   ├── Tab: Preview
│   └── outras guias futuras
└── ActiveTabContent
    ├── EditorView
    └── PreviewView
```

---

## EditorView

Modo de edicao completo.

Contem:

- topbar do editor
- navigator interno
- canvas com regua
- rail contextual
- elementos manipulaveis

---

## PreviewView

Modo de visualizacao.

Contem:

- renderizacao do documento
- comportamento proximo ao resultado final
- sem handles de selecao
- sem guias de resize
- sem toolbox de edicao

Pode manter apenas:

- zoom
- troca de viewport
- atualizacao
- abrir em nova janela, se necessario futuramente

---

## Regra de navegacao entre Editor e Preview

A mudanca entre edicao e preview deve ocorrer por guia, nao por substituicao destrutiva da tela.

Motivos:

- preserva o contexto da edicao
- evita perda de posicao no canvas
- permite comparar edicao e resultado
- deixa a experiencia mais proxima de ferramentas profissionais

---

## Organizacao final recomendada

```text
AppShell
├── Topbar global
└── MainArea
    ├── NavigationSidebar
    └── Workspace
        ├── TabBar
        └── ActiveView
            ├── EditorView
            │   ├── EditorTopbar
            │   └── EditorBody
            │       ├── EditorNavigator
            │       ├── EditorCanvasRegion
            │       └── DesignerRail
            └── PreviewView
                └── PreviewCanvas
```

---

## Principios obrigatorios

### Ocupacao da area

A area de edicao deve preencher integralmente o espaco disponivel do workspace.

### Sem area morta

Espacos laterais sem funcao nao devem existir.

### Preview em nova guia

O preview deve abrir em uma nova guia interna do workspace.

### Continuidade de contexto

Ao voltar do preview para edicao, o estado da edicao deve ser mantido.

### Separacao de modos

Editar e visualizar sao modos distintos, mas convivem no mesmo workspace por meio de guias.

---

## Resumo

O editor ideal para esse CMS deve funcionar como um shell de autoria:

- sidebar global para navegacao
- workspace ocupando toda a area restante
- editor interno sem centralizacao artificial
- canvas expandido e sempre util
- preview aberto em nova guia
- alternancia entre edicao e preview sem perder contexto