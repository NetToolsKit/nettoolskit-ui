<template>
  <section id="themes" class="themes">
    <div class="container">
      <div class="section-header">
        <h2>Built-in Themes</h2>
        <p>Three production-ready themes with runtime switching support.</p>
      </div>

      <div class="theme-preview-image">
        <img src="../assets/theme-preview.png" alt="Theme Preview - Dark, Purple, Monochrome">
      </div>

      <div class="theme-grid">
        <div class="theme-card">
          <div class="theme-preview dark-theme">
            <img src="../assets/nuget-icon.png" alt="Dark Theme" style="width: 64px; height: 64px;">
          </div>
          <div class="theme-info">
            <h3>Dark</h3>
            <p>Modern dark theme with deep backgrounds and vibrant accents</p>
          </div>
        </div>
        <div class="theme-card">
          <div class="theme-preview purple-theme">
            <img src="../assets/positive-icon.png" alt="Purple Theme" style="width: 64px; height: 64px;">
          </div>
          <div class="theme-info">
            <h3>Purple</h3>
            <p>Vibrant purple theme with accessible contrast ratios</p>
          </div>
        </div>
        <div class="theme-card">
          <div class="theme-preview monochrome-theme">
            <img src="../assets/monochrome-icon.png" alt="Monochrome Theme" style="width: 64px; height: 64px;">
          </div>
          <div class="theme-info">
            <h3>Monochrome</h3>
            <p>Clean grayscale theme for minimal interfaces</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>