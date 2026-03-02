<template>
  <section id="installation" class="installation">
    <div class="container">
      <div class="section-header">
        <h2>Get Started</h2>
        <p>Add NetToolsKit UI to your project in minutes.</p>
      </div>
      <div class="install-steps">
        <div class="install-step">
          <div class="step-number">1</div>
          <h3>Add as Submodule</h3>
          <code>git submodule add https://github.com/ThiagoGuislotti/nettoolskit-ui-vue.git src/shared/ui</code>
        </div>
        <div class="install-step">
          <div class="step-number">2</div>
          <h3>Import Styles</h3>
          <code>@import '@/shared/ui/styles/tokens.scss';</code>
        </div>
        <div class="install-step">
          <div class="step-number">3</div>
          <h3>Use Components</h3>
          <code>import { BaseInput } from '@/shared/ui';</code>
        </div>
      </div>
    </div>
  </section>
</template>