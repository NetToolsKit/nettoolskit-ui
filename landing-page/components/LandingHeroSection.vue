<template>
  <section class="hero">
    <div class="container">
      <div class="hero-content">
        <span class="hero-badge" data-animate="fade-up">Vue 3 + Quasar</span>
        <h1 data-animate="fade-up">Build Consistent UIs with <span>NetToolsKit</span></h1>
        <p data-animate="fade-up">
          A comprehensive component library with theme system, composables, and design tokens for
          building enterprise Vue applications.
        </p>
        <div class="hero-actions" data-animate="fade-up">
          <a href="#installation" class="btn btn-primary">Get Started</a>
          <a href="https://github.com/ThiagoGuislotti/nettoolskit-ui-vue" class="btn btn-secondary">View on GitHub</a>
        </div>
        <div class="stats">
          <div class="stat" data-animate="fade-up">
            <div class="stat-value">22+</div>
            <div class="stat-label">Components</div>
          </div>
          <div class="stat" data-animate="fade-up">
            <div class="stat-value">11</div>
            <div class="stat-label">Composables</div>
          </div>
          <div class="stat" data-animate="fade-up">
            <div class="stat-value">3</div>
            <div class="stat-label">Themes</div>
          </div>
        </div>
      </div>
      <div class="hero-visual" data-animate="fade-left">
        <picture>
          <source srcset="../assets/hero-visual.webp" type="image/webp">
          <img
            src="../assets/hero-visual.png"
            alt="Vue Component Library - Floating UI Cards"
            loading="eager"
            decoding="async"
            fetchpriority="high"
          >
        </picture>
      </div>
    </div>
  </section>
</template>