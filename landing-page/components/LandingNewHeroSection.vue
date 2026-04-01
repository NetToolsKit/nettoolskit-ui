<template>
  <section
    id="top"
    class="hero"
  >
    <div class="hero-video-bg">
      <div class="video-canvas">
        <div class="holo-scene">
          <div class="holo-ring" />
          <div class="holo-ring" />
          <div class="holo-ring" />
          <div class="holo-ring" />
          <div class="holo-ring" />
          <div class="holo-cross" />
          <div class="holo-cross" />
          <div class="holo-cross" />
          <div class="holo-cross" />
        </div>

        <svg
          class="hero-body-silhouette"
          viewBox="0 0 260 440"
          fill="none"
        >
          <defs>
            <linearGradient
              id="bodyGrad"
              x1="0.5"
              y1="0"
              x2="0.5"
              y2="1"
            >
              <stop
                offset="0%"
                stop-color="#f2f2f2"
                stop-opacity="0.35"
              />
              <stop
                offset="100%"
                stop-color="#f2f2f2"
                stop-opacity="0.05"
              />
            </linearGradient>
            <filter id="bodyGlow"><feGaussianBlur
              stdDeviation="3"
              result="blur"
            /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
          </defs>
          <g
            filter="url(#bodyGlow)"
            opacity="0.7"
          >
            <circle
              cx="130"
              cy="50"
              r="30"
              stroke="url(#bodyGrad)"
              stroke-width="1.5"
              fill="none"
            />
            <circle
              cx="130"
              cy="50"
              r="28"
              stroke="#f2f2f2"
              stroke-width="0.5"
              stroke-opacity="0.2"
              fill="none"
            />
            <line
              x1="130"
              y1="80"
              x2="130"
              y2="100"
              stroke="url(#bodyGrad)"
              stroke-width="1.5"
            />
            <line
              x1="130"
              y1="100"
              x2="65"
              y2="120"
              stroke="url(#bodyGrad)"
              stroke-width="1.5"
            />
            <line
              x1="130"
              y1="100"
              x2="195"
              y2="120"
              stroke="url(#bodyGrad)"
              stroke-width="1.5"
            />
            <path
              d="M65 120 L55 240 L130 260 L205 240 L195 120"
              stroke="url(#bodyGrad)"
              stroke-width="1.5"
              fill="none"
            />
            <path
              d="M65 120 L40 200 L50 260"
              stroke="url(#bodyGrad)"
              stroke-width="1.2"
              fill="none"
            />
            <path
              d="M195 120 L220 200 L210 260"
              stroke="url(#bodyGrad)"
              stroke-width="1.2"
              fill="none"
            />
            <line
              x1="55"
              y1="240"
              x2="205"
              y2="240"
              stroke="url(#bodyGrad)"
              stroke-width="1"
            />
            <path
              d="M90 260 L80 360 L75 430"
              stroke="url(#bodyGrad)"
              stroke-width="1.5"
              fill="none"
            />
            <path
              d="M170 260 L180 360 L185 430"
              stroke="url(#bodyGrad)"
              stroke-width="1.5"
              fill="none"
            />
            <circle
              cx="130"
              cy="100"
              r="4"
              fill="#f2f2f2"
              opacity="0.5"
            />
            <circle
              cx="65"
              cy="120"
              r="3"
              fill="#f2f2f2"
              opacity="0.4"
            />
            <circle
              cx="195"
              cy="120"
              r="3"
              fill="#f2f2f2"
              opacity="0.4"
            />
            <circle
              cx="90"
              cy="260"
              r="3"
              fill="#f2f2f2"
              opacity="0.4"
            />
            <circle
              cx="170"
              cy="260"
              r="3"
              fill="#f2f2f2"
              opacity="0.4"
            />
            <circle
              cx="80"
              cy="360"
              r="3"
              fill="#f2f2f2"
              opacity="0.3"
            />
            <circle
              cx="180"
              cy="360"
              r="3"
              fill="#f2f2f2"
              opacity="0.3"
            />
            <line
              x1="20"
              y1="50"
              x2="20"
              y2="430"
              stroke="#f2f2f2"
              stroke-width="0.5"
              stroke-opacity="0.2"
              stroke-dasharray="3 6"
            />
            <line
              x1="240"
              y1="50"
              x2="240"
              y2="430"
              stroke="#f2f2f2"
              stroke-width="0.5"
              stroke-opacity="0.2"
              stroke-dasharray="3 6"
            />
            <line
              x1="16"
              y1="50"
              x2="24"
              y2="50"
              stroke="#f2f2f2"
              stroke-opacity="0.3"
            />
            <line
              x1="16"
              y1="240"
              x2="24"
              y2="240"
              stroke="#f2f2f2"
              stroke-opacity="0.3"
            />
            <line
              x1="16"
              y1="430"
              x2="24"
              y2="430"
              stroke="#f2f2f2"
              stroke-opacity="0.3"
            />
          </g>
        </svg>

        <div class="scan-lines">
          <div class="scan-line" />
          <div class="scan-line" />
          <div class="scan-line" />
        </div>
      </div>
    </div>

    <div class="hero-gradient" />

    <div class="hero-content reveal">
      <div class="over-label">
        Vue 3 · Quasar · TypeScript · Design System
      </div>
      <h1>NetToolsKit UI Vue para acelerar interfaces enterprise.</h1>
      <p>Uma biblioteca completa de componentes e composables para criar produtos consistentes, acessiveis e escalaveis com padrao visual unificado.</p>
      <a
        href="#servicos"
        class="hero-cta"
      >
        Explorar biblioteca
        <LandingNewArrowIcon />
      </a>
    </div>
  </section>
</template>

<script setup lang="ts">
import LandingNewArrowIcon from './LandingNewArrowIcon.vue'
</script>