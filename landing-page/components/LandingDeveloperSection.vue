<template>
  <div>
    <section class="code-section">
      <div class="container">
        <div class="code-container">
          <div>
            <div class="section-header" style="text-align: left; margin-bottom: var(--spacing-xl);">
              <h2>Simple to Use</h2>
              <p>Import components and composables with a single entry point. Full TypeScript support included.</p>
            </div>
            <ul style="list-style: none; display: flex; flex-direction: column; gap: var(--spacing-md);">
              <li style="display: flex; align-items: flex-start; gap: var(--spacing-md);">
                <span style="color: var(--ntk-purple); font-weight: 700;">✓</span>
                <span>Single entry point export for all components</span>
              </li>
              <li style="display: flex; align-items: flex-start; gap: var(--spacing-md);">
                <span style="color: var(--ntk-purple); font-weight: 700;">✓</span>
                <span>Full TypeScript definitions included</span>
              </li>
              <li style="display: flex; align-items: flex-start; gap: var(--spacing-md);">
                <span style="color: var(--ntk-purple); font-weight: 700;">✓</span>
                <span>Quasar-first CSS with design tokens</span>
              </li>
              <li style="display: flex; align-items: flex-start; gap: var(--spacing-md);">
                <span style="color: var(--ntk-purple); font-weight: 700;">✓</span>
                <span>Runtime theme switching</span>
              </li>
            </ul>
          </div>
          <div class="code-block">
            <div class="code-header">
              <span class="code-dot red" />
              <span class="code-dot yellow" />
              <span class="code-dot green" />
            </div>
            <div class="code-content">
              <pre><span class="comment">// Import components</span>
<span class="keyword">import</span> {
  <span class="component">BaseInput</span>,
  <span class="component">BaseSelect</span>,
  <span class="component">MetricCard</span>
} <span class="keyword">from</span> <span class="string">'@nettoolskit/ui-vue'</span>

<span class="comment">// Import composables</span>
<span class="keyword">import</span> {
  <span class="component">useTheme</span>,
  <span class="component">useNotification</span>
} <span class="keyword">from</span> <span class="string">'@nettoolskit/ui-vue'</span>

<span class="comment">// Use in your component</span>
<span class="keyword">const</span> { currentTheme, setTheme } = <span class="component">useTheme</span>()
<span class="keyword">const</span> { notify } = <span class="component">useNotification</span>()

<span class="component">setTheme</span>(<span class="string">'dark'</span>)
<span class="component">notify</span>(<span class="string">'Theme changed!'</span>, <span class="string">'success'</span>)</pre>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="form-visual-section">
      <div class="container">
        <div class="form-visual-container">
          <div class="form-visual-image">
            <picture>
              <source srcset="../assets/form-components.webp" type="image/webp">
              <img
                src="../assets/form-components.png"
                alt="Form Components"
                loading="lazy"
                decoding="async"
                fetchpriority="low"
              >
            </picture>
          </div>
          <div class="form-visual-content">
            <h2>Complete Form Toolkit</h2>
            <p>Everything you need to build complex forms with validation, accessibility, and consistent styling.</p>
            <div class="form-features">
              <div class="form-feature">
                <div class="form-feature-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <span>Built-in validation with useFormRules</span>
              </div>
              <div class="form-feature">
                <div class="form-feature-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <span>Date and time pickers with localization</span>
              </div>
              <div class="form-feature">
                <div class="form-feature-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <span>Multi-select with chip display</span>
              </div>
              <div class="form-feature">
                <div class="form-feature-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <span>Consistent error states and messages</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="composables-visual-section">
      <div class="container">
        <div class="composables-visual-container">
          <div class="composables-visual-content">
            <h2>Powerful Composables</h2>
            <p>Reusable Vue 3 composition functions that encapsulate common logic and state management.</p>
            <div class="composables-list">
              <div class="composable-item">
                <div class="composable-header"><span class="composable-icon">🎨</span><code>useTheme</code></div>
                <p>Runtime theme switching</p>
              </div>
              <div class="composable-item">
                <div class="composable-header"><span class="composable-icon">🔔</span><code>useNotification</code></div>
                <p>Toast notifications</p>
              </div>
              <div class="composable-item">
                <div class="composable-header"><span class="composable-icon">💬</span><code>useDialog</code></div>
                <p>Confirmation dialogs</p>
              </div>
              <div class="composable-item">
                <div class="composable-header"><span class="composable-icon">✅</span><code>useFormRules</code></div>
                <p>Validation rules</p>
              </div>
              <div class="composable-item">
                <div class="composable-header"><span class="composable-icon">⏱️</span><code>useDebounce</code></div>
                <p>Debounced values</p>
              </div>
              <div class="composable-item">
                <div class="composable-header"><span class="composable-icon">⚡</span><code>useAsync</code></div>
                <p>Async state handling</p>
              </div>
            </div>
          </div>
          <div class="composables-visual-image">
            <picture>
              <source srcset="../assets/composables-visual.webp" type="image/webp">
              <img
                src="../assets/composables-visual.png"
                alt="Composables Architecture"
                loading="lazy"
                decoding="async"
                fetchpriority="low"
              >
            </picture>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>