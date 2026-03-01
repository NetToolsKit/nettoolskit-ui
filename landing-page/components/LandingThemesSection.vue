<template>
  <section id="themes" class="themes">
    <div class="container">
      <div class="section-header">
        <h2>Built-in Themes</h2>
        <p>Three production-ready themes with runtime switching support.</p>
      </div>

      <div class="theme-preview-image">
        <picture>
          <source srcset="../assets/theme-preview.webp" type="image/webp">
          <img
            src="../assets/theme-preview.png"
            alt="Theme Preview - Dark, Purple, Monochrome"
            loading="lazy"
            decoding="async"
            fetchpriority="low"
          >
        </picture>
      </div>

      <div class="theme-grid">
        <div class="theme-card">
          <div class="theme-preview dark-theme">
            <picture>
              <source srcset="../assets/nuget-icon.webp" type="image/webp">
              <img
                src="../assets/nuget-icon.png"
                alt="Dark Theme"
                style="width: 64px; height: 64px;"
                loading="lazy"
                decoding="async"
              >
            </picture>
          </div>
          <div class="theme-info">
            <h3>Dark</h3>
            <p>Modern dark theme with deep backgrounds and vibrant accents</p>
          </div>
        </div>
        <div class="theme-card">
          <div class="theme-preview purple-theme">
            <picture>
              <source srcset="../assets/positive-icon.webp" type="image/webp">
              <img
                src="../assets/positive-icon.png"
                alt="Purple Theme"
                style="width: 64px; height: 64px;"
                loading="lazy"
                decoding="async"
              >
            </picture>
          </div>
          <div class="theme-info">
            <h3>Purple</h3>
            <p>Vibrant purple theme with accessible contrast ratios</p>
          </div>
        </div>
        <div class="theme-card">
          <div class="theme-preview monochrome-theme">
            <picture>
              <source srcset="../assets/monochrome-icon.webp" type="image/webp">
              <img
                src="../assets/monochrome-icon.png"
                alt="Monochrome Theme"
                style="width: 64px; height: 64px;"
                loading="lazy"
                decoding="async"
              >
            </picture>
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