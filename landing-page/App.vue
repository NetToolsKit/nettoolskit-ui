<template>
  <div id="app">
    <!-- Header -->
    <header class="header">
      <div class="container">
        <div class="logo">
          <img src="./assets/nuget-icon.png" alt="NTK">
          <span class="logo-text">NetToolsKit UI</span>
        </div>
        <!-- Mobile Menu Button -->
        <button class="mobile-menu-btn" @click="openDrawer" aria-label="Open menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
        <nav class="nav">
          <a href="#features">Features</a>
          <a href="#components">Components</a>
          <a href="#themes">Themes</a>
          <a href="#installation">Installation</a>
          <button @click="toggleTheme" class="theme-toggle" title="Toggle dark mode">
            <svg v-show="!isDark" class="sun-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="5"/>
              <line x1="12" y1="1" x2="12" y2="3"/>
              <line x1="12" y1="21" x2="12" y2="23"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
              <line x1="1" y1="12" x2="3" y2="12"/>
              <line x1="21" y1="12" x2="23" y2="12"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
            <svg v-show="isDark" class="moon-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          </button>
          <a href="https://github.com/ThiagoGuislotti/nettoolskit-ui-vue" class="btn btn-primary">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            GitHub
          </a>
        </nav>
      </div>
    </header>

    <!-- Mobile Drawer -->
    <div class="mobile-drawer" :class="{ open: drawerOpen }">
      <div class="drawer-header">
        <button class="drawer-close-btn" @click="closeDrawer">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="13 17 18 12 13 7"/>
            <polyline points="6 17 11 12 6 7"/>
          </svg>
          <span>Comprimir</span>
        </button>
      </div>
      <nav class="drawer-nav">
        <a href="#features" class="drawer-link" @click="closeDrawer">Features</a>
        <a href="#components" class="drawer-link" @click="closeDrawer">Components</a>
        <a href="#themes" class="drawer-link" @click="closeDrawer">Themes</a>
        <a href="#installation" class="drawer-link" @click="closeDrawer">Installation</a>
        <a href="https://github.com/ThiagoGuislotti/nettoolskit-ui-vue" class="btn btn-primary drawer-cta">GitHub</a>
      </nav>
    </div>
    <div class="drawer-overlay" :class="{ open: drawerOpen }" @click="closeDrawer"></div>

    <!-- Hero -->
    <section class="hero">
      <div class="container">
        <div class="hero-content">
          <span class="hero-badge">Vue 3 + Quasar</span>
          <h1>Build Consistent UIs with <span>NetToolsKit</span></h1>
          <p>A comprehensive component library with theme system, composables, and design tokens for building enterprise Vue applications.</p>
          <div class="hero-actions">
            <a href="#installation" class="btn btn-primary">Get Started</a>
            <a href="https://github.com/ThiagoGuislotti/nettoolskit-ui-vue" class="btn btn-secondary">View on GitHub</a>
          </div>
          <div class="stats">
            <div class="stat">
              <div class="stat-value">22+</div>
              <div class="stat-label">Components</div>
            </div>
            <div class="stat">
              <div class="stat-value">11</div>
              <div class="stat-label">Composables</div>
            </div>
            <div class="stat">
              <div class="stat-value">3</div>
              <div class="stat-label">Themes</div>
            </div>
          </div>
        </div>
        <div class="hero-visual">
          <img src="./assets/hero-visual.png" alt="Vue Component Library - Floating UI Cards">
        </div>
      </div>
    </section>

    <!-- Features -->
    <section class="features" id="features">
      <div class="container">
        <div class="section-header">
          <h2>Why NetToolsKit UI?</h2>
          <p>Built for developers who need consistent, accessible, and themeable components.</p>
        </div>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <h3>Theme System</h3>
            <p>Runtime theme switching with CSS variables. Includes Dark, Purple, and Monochrome themes out of the box.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <path d="M3 9h18M9 21V9"/>
              </svg>
            </div>
            <h3>Form Components</h3>
            <p>Complete form toolkit with BaseInput, BaseSelect, BaseMultiSelect, BaseTextarea, and date/time pickers.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
              </svg>
            </div>
            <h3>Layout Components</h3>
            <p>Flexible layouts with BaseHeader, BaseSidebar, BaseHero, BaseSection, and BaseFooter components.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 6v6l4 2"/>
              </svg>
            </div>
            <h3>Composables</h3>
            <p>Reusable logic with useTheme, useNotification, useDialog, useFormRules, useDebounce, and more.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <h3>Accessibility</h3>
            <p>WCAG compliant components with keyboard navigation, ARIA labels, and focus management.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
            </div>
            <h3>Design Tokens</h3>
            <p>Consistent spacing, shadows, and transitions defined as CSS variables and SCSS mixins.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Components Showcase -->
    <section class="showcase" id="components">
      <div class="container">
        <div class="section-header">
          <h2>Component Library</h2>
          <p>22+ production-ready components organized by category.</p>
        </div>
        <div class="component-tabs">
          <button 
            v-for="tab in tabs" 
            :key="tab.id"
            class="tab-btn" 
            :class="{ active: activeTab === tab.id }"
            @click="activeTab = tab.id"
          >
            {{ tab.label }}
          </button>
        </div>
        
        <!-- Form Components -->
        <div v-show="activeTab === 'form'" class="component-grid">
          <div class="component-item">
            <code>BaseInput</code>
            <p>Text input with validation</p>
          </div>
          <div class="component-item">
            <code>BaseSelect</code>
            <p>Single select dropdown</p>
          </div>
          <div class="component-item">
            <code>BaseMultiSelect</code>
            <p>Multi-select with chips</p>
          </div>
          <div class="component-item">
            <code>BaseTextarea</code>
            <p>Multiline text input</p>
          </div>
          <div class="component-item">
            <code>BaseDatePicker</code>
            <p>Date selection</p>
          </div>
          <div class="component-item">
            <code>BaseTimePicker</code>
            <p>Time selection</p>
          </div>
        </div>
        
        <!-- Layout Components -->
        <div v-show="activeTab === 'layout'" class="component-grid">
          <div class="component-item">
            <code>BaseHeader</code>
            <p>Application header</p>
          </div>
          <div class="component-item">
            <code>BaseSidebar</code>
            <p>Navigation sidebar</p>
          </div>
          <div class="component-item">
            <code>BaseFooter</code>
            <p>Application footer</p>
          </div>
          <div class="component-item">
            <code>BaseHero</code>
            <p>Landing page hero section</p>
          </div>
          <div class="component-item">
            <code>BaseSection</code>
            <p>Content section wrapper</p>
          </div>
        </div>
        
        <!-- UI Components -->
        <div v-show="activeTab === 'ui'" class="component-grid">
          <div class="component-item">
            <code>BaseCard</code>
            <p>Content container</p>
          </div>
          <div class="component-item">
            <code>BaseButton</code>
            <p>Action button</p>
          </div>
          <div class="component-item">
            <code>BaseChip</code>
            <p>Tag/label chip</p>
          </div>
          <div class="component-item">
            <code>BaseLogo</code>
            <p>Brand logo display</p>
          </div>
          <div class="component-item">
            <code>MetricCard</code>
            <p>Dashboard metrics</p>
          </div>
          <div class="component-item">
            <code>InfoCard</code>
            <p>Information display</p>
          </div>
          <div class="component-item">
            <code>BaseFeatureCard</code>
            <p>Feature showcase</p>
          </div>
          <div class="component-item">
            <code>BasePricingCard</code>
            <p>Pricing plans</p>
          </div>
          <div class="component-item">
            <code>BaseCreditCard</code>
            <p>Payment card display</p>
          </div>
          <div class="component-item">
            <code>BaseSteps</code>
            <p>Step indicator</p>
          </div>
          <div class="component-item">
            <code>SectionHeader</code>
            <p>Section title</p>
          </div>
        </div>
        
        <!-- Composables -->
        <div v-show="activeTab === 'composables'" class="component-grid">
          <div class="component-item">
            <code>useTheme</code>
            <p>Theme management</p>
          </div>
          <div class="component-item">
            <code>useNotification</code>
            <p>Toast notifications</p>
          </div>
          <div class="component-item">
            <code>useDialog</code>
            <p>Modal state management</p>
          </div>
          <div class="component-item">
            <code>useFormRules</code>
            <p>Form validation rules</p>
          </div>
          <div class="component-item">
            <code>useResponsive</code>
            <p>Breakpoint detection</p>
          </div>
          <div class="component-item">
            <code>useDebounce</code>
            <p>Debounced values</p>
          </div>
          <div class="component-item">
            <code>useAsync</code>
            <p>Async operation handling</p>
          </div>
          <div class="component-item">
            <code>useFilters</code>
            <p>Data filtering</p>
          </div>
          <div class="component-item">
            <code>useTableColumns</code>
            <p>Table column config</p>
          </div>
          <div class="component-item">
            <code>useBaseField</code>
            <p>Form field base</p>
          </div>
          <div class="component-item">
            <code>useDialogActions</code>
            <p>Dialog action handlers</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Code Example -->
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
              <span class="code-dot red"></span>
              <span class="code-dot yellow"></span>
              <span class="code-dot green"></span>
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

    <!-- Form Components Visual -->
    <section class="form-visual-section">
      <div class="container">
        <div class="form-visual-container">
          <div class="form-visual-image">
            <img src="./assets/form-components.png" alt="Form Components">
          </div>
          <div class="form-visual-content">
            <h2>Complete Form Toolkit</h2>
            <p>Everything you need to build complex forms with validation, accessibility, and consistent styling.</p>
            <div class="form-features">
              <div class="form-feature">
                <div class="form-feature-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <span>Built-in validation with useFormRules</span>
              </div>
              <div class="form-feature">
                <div class="form-feature-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <span>Date and time pickers with localization</span>
              </div>
              <div class="form-feature">
                <div class="form-feature-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <span>Multi-select with chip display</span>
              </div>
              <div class="form-feature">
                <div class="form-feature-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <span>Consistent error states and messages</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Composables Visual -->
    <section class="composables-visual-section">
      <div class="container">
        <div class="composables-visual-container">
          <div class="composables-visual-content">
            <h2>Powerful Composables</h2>
            <p>Reusable Vue 3 composition functions that encapsulate common logic and state management.</p>
            <div class="composables-list">
              <div class="composable-item">
                <div class="composable-header">
                  <span class="composable-icon">🎨</span>
                  <code>useTheme</code>
                </div>
                <p>Runtime theme switching</p>
              </div>
              <div class="composable-item">
                <div class="composable-header">
                  <span class="composable-icon">🔔</span>
                  <code>useNotification</code>
                </div>
                <p>Toast notifications</p>
              </div>
              <div class="composable-item">
                <div class="composable-header">
                  <span class="composable-icon">💬</span>
                  <code>useDialog</code>
                </div>
                <p>Confirmation dialogs</p>
              </div>
              <div class="composable-item">
                <div class="composable-header">
                  <span class="composable-icon">✅</span>
                  <code>useFormRules</code>
                </div>
                <p>Validation rules</p>
              </div>
              <div class="composable-item">
                <div class="composable-header">
                  <span class="composable-icon">⏱️</span>
                  <code>useDebounce</code>
                </div>
                <p>Debounced values</p>
              </div>
              <div class="composable-item">
                <div class="composable-header">
                  <span class="composable-icon">⚡</span>
                  <code>useAsync</code>
                </div>
                <p>Async state handling</p>
              </div>
            </div>
          </div>
          <div class="composables-visual-image">
            <img src="./assets/composables-visual.png" alt="Composables Architecture">
          </div>
        </div>
      </div>
    </section>

    <!-- Dashboard Preview -->
    <section class="dashboard-preview">
      <div class="container">
        <div class="section-header">
          <h2>Dashboard Preview</h2>
          <p>See how NetToolsKit components look in a real dashboard application.</p>
        </div>
        <div class="dashboard-simple">
          <div class="metrics-grid-simple">
            <div class="metric-card-simple">
              <div class="metric-icon">👥</div>
              <div class="metric-info">
                <div class="metric-label">Total Users</div>
                <div class="metric-value">12,847</div>
              </div>
              <div class="metric-trend positive">↑ 12.5%</div>
            </div>
            <div class="metric-card-simple">
              <div class="metric-icon">💰</div>
              <div class="metric-info">
                <div class="metric-label">Revenue</div>
                <div class="metric-value">$48,290</div>
              </div>
              <div class="metric-trend positive">↑ 8.2%</div>
            </div>
            <div class="metric-card-simple">
              <div class="metric-icon">📦</div>
              <div class="metric-info">
                <div class="metric-label">Orders</div>
                <div class="metric-value">1,429</div>
              </div>
              <div class="metric-trend negative">↓ 3.1%</div>
            </div>
            <div class="metric-card-simple">
              <div class="metric-icon">📈</div>
              <div class="metric-info">
                <div class="metric-label">Conversion</div>
                <div class="metric-value">3.24%</div>
              </div>
              <div class="metric-trend positive">↑ 1.8%</div>
            </div>
          </div>
          <div class="chart-simple">
            <div class="chart-header">
              <span class="chart-title">Monthly Revenue</span>
              <span class="chart-period">Last 12 months</span>
            </div>
            <div class="chart-bars-simple">
              <div class="chart-bar-simple" style="height: 60%"><span>Jan</span></div>
              <div class="chart-bar-simple" style="height: 80%"><span>Feb</span></div>
              <div class="chart-bar-simple" style="height: 45%"><span>Mar</span></div>
              <div class="chart-bar-simple" style="height: 90%"><span>Apr</span></div>
              <div class="chart-bar-simple" style="height: 70%"><span>May</span></div>
              <div class="chart-bar-simple" style="height: 85%"><span>Jun</span></div>
              <div class="chart-bar-simple" style="height: 55%"><span>Jul</span></div>
              <div class="chart-bar-simple" style="height: 75%"><span>Aug</span></div>
              <div class="chart-bar-simple" style="height: 65%"><span>Sep</span></div>
              <div class="chart-bar-simple" style="height: 95%"><span>Oct</span></div>
              <div class="chart-bar-simple" style="height: 50%"><span>Nov</span></div>
              <div class="chart-bar-simple" style="height: 88%"><span>Dec</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Themes -->
    <section class="themes" id="themes">
      <div class="container">
        <div class="section-header">
          <h2>Built-in Themes</h2>
          <p>Three production-ready themes with runtime switching support.</p>
        </div>
        <div class="theme-preview-image">
          <img src="./assets/theme-preview.png" alt="Theme Preview - Dark, Purple, Monochrome">
        </div>
        <div class="theme-grid">
          <div class="theme-card">
            <div class="theme-preview dark-theme">
              <img src="./assets/nuget-icon.png" alt="Dark Theme" style="width: 64px; height: 64px;">
            </div>
            <div class="theme-info">
              <h3>Dark</h3>
              <p>Modern dark theme with deep backgrounds and vibrant accents</p>
            </div>
          </div>
          <div class="theme-card">
            <div class="theme-preview purple-theme">
              <img src="./assets/positive-icon.png" alt="Purple Theme" style="width: 64px; height: 64px;">
            </div>
            <div class="theme-info">
              <h3>Purple</h3>
              <p>Vibrant purple theme with accessible contrast ratios</p>
            </div>
          </div>
          <div class="theme-card">
            <div class="theme-preview monochrome-theme">
              <img src="./assets/monochrome-icon.png" alt="Monochrome Theme" style="width: 64px; height: 64px;">
            </div>
            <div class="theme-info">
              <h3>Monochrome</h3>
              <p>Clean grayscale theme for minimal interfaces</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Installation -->
    <section class="installation" id="installation">
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
            <code>@import '@/shared/ui/styles/design-system.scss';</code>
          </div>
          <div class="install-step">
            <div class="step-number">3</div>
            <h3>Use Components</h3>
            <code>import { BaseInput } from '@/shared/ui';</code>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-brand">
            <div class="footer-logo">
              <img src="./assets/nuget-icon.png" alt="NTK">
              <span>NetToolsKit UI Vue</span>
            </div>
            <p class="footer-description">A comprehensive Vue 3 + Quasar component library with theme system, composables, and design tokens for building consistent enterprise applications.</p>
            <div class="footer-social">
              <a href="https://github.com/ThiagoGuislotti" target="_blank" title="GitHub">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
              </a>
              <a href="https://linkedin.com/in/thiagoguislotti" target="_blank" title="LinkedIn">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>
          
          <div class="footer-links-grid">
            <div class="footer-column">
              <h4>Resources</h4>
              <a href="https://github.com/ThiagoGuislotti/nettoolskit-ui-vue/blob/main/README.md">Documentation</a>
              <a href="https://github.com/ThiagoGuislotti/nettoolskit-ui-vue/blob/main/samples/DemoPage.vue">Demo Page</a>
              <a href="https://github.com/ThiagoGuislotti/nettoolskit-ui-vue/tree/main/src/components">Components</a>
              <a href="https://github.com/ThiagoGuislotti/nettoolskit-ui-vue/tree/main/src/composables">Composables</a>
            </div>
            
            <div class="footer-column">
              <h4>Projects Using NTK</h4>
              <a href="https://github.com/ThiagoGuislotti/sentinela">Sentinela</a>
              <a href="https://github.com/ThiagoGuislotti/PlaTEA">PlaTEA</a>
            </div>
            
            <div class="footer-column">
              <h4>Related</h4>
              <a href="https://github.com/ThiagoGuislotti/copilot-instructions">Copilot Instructions</a>
              <a href="https://github.com/ThiagoGuislotti/nettoolskit-cli">NTK CLI (Rust)</a>
            </div>
          </div>
        </div>
        
        <div class="footer-bottom">
          <p>&copy; 2024 NetToolsKit. Built with Vue 3 + Quasar.</p>
          <p>Created by <a href="https://github.com/ThiagoGuislotti">Thiago Guislotti</a></p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'

const isDark = ref(false)
const drawerOpen = ref(false)
const activeTab = ref('form')

const tabs = [
  { id: 'form', label: 'Form' },
  { id: 'layout', label: 'Layout' },
  { id: 'ui', label: 'UI' },
  { id: 'composables', label: 'Composables' }
]

const toggleTheme = () => {
  isDark.value = !isDark.value
  localStorage.setItem('ntk-theme', isDark.value ? 'dark' : 'light')
}

const openDrawer = () => {
  drawerOpen.value = true
  document.body.style.overflow = 'hidden'
}

const closeDrawer = () => {
  drawerOpen.value = false
  document.body.style.overflow = ''
}

onMounted(() => {
  const savedTheme = localStorage.getItem('ntk-theme')
  if (savedTheme === 'dark') {
    isDark.value = true
  }
})

watch(isDark, (newValue) => {
  if (newValue) {
    document.body.classList.add('dark-mode')
  } else {
    document.body.classList.remove('dark-mode')
  }
})
</script>

<style>
:root {
  /* NTK Brand Colors */
  --ntk-purple: #512BD4;
  --ntk-purple-dark: #3B1FA2;
  --ntk-purple-light: #7A5AF8;
  --royal-blue: #4169E1;
  
  /* Grays */
  --gray-900: #111827;
  --gray-800: #1f2937;
  --gray-700: #374151;
  --gray-600: #4b5563;
  --gray-500: #6B7280;
  --gray-400: #9ca3af;
  --gray-300: #D1D5DB;
  --gray-200: #e5e7eb;
  --gray-100: #F3F4F6;
  --gray-50: #f9fafb;
  --white: #FFFFFF;
  
  /* Semantic */
  --success: #059669;
  --warning: #F59E0B;
  --error: #DC2626;
  --info: #4169E1;
  
  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  --spacing-2xl: 3rem;
  --spacing-3xl: 4rem;
  
  /* Shadows */
  --shadow-soft: 0 2px 8px rgba(0, 0, 0, 0.08);
  --shadow-medium: 0 4px 16px rgba(0, 0, 0, 0.12);
  --shadow-strong: 0 8px 32px rgba(0, 0, 0, 0.16);
  
  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-normal: 250ms ease;
  --transition-slow: 350ms ease;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  color: var(--gray-900);
  line-height: 1.6;
  background: var(--white);
  overflow-x: hidden;
}

code, pre {
  font-family: 'JetBrains Mono', monospace;
}

a {
  color: var(--ntk-purple);
  text-decoration: none;
  transition: color var(--transition-fast);
}

a:hover {
  color: var(--ntk-purple-dark);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
}

/* Header */
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  z-index: 100;
  padding: var(--spacing-md) 0;
}

.header .container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.logo img {
  width: 40px;
  height: 40px;
  border-radius: 8px;
}

.logo-text {
  font-weight: 800;
  font-size: 1.25rem;
  color: var(--gray-900);
}

.nav {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
}

.nav a {
  color: var(--gray-700);
  font-weight: 500;
  font-size: 0.875rem;
  line-height: 1;
  display: flex;
  align-items: center;
}

.nav a:hover {
  color: var(--ntk-purple);
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.85rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.8125rem;
  transition: all var(--transition-fast);
  cursor: pointer;
  border: none;
}

.btn-primary {
  background: var(--ntk-purple);
  color: var(--white) !important;
}

.btn-primary:hover {
  background: var(--ntk-purple-dark);
  color: var(--white) !important;
  transform: translateY(-1px);
  box-shadow: var(--shadow-medium);
}

.btn-secondary {
  background: transparent;
  color: var(--gray-700);
  border: 1px solid var(--gray-300);
}

.btn-secondary:hover {
  background: var(--gray-100);
  color: var(--gray-900);
}

/* Hero */
.hero {
  padding: 160px 0 100px;
  background: linear-gradient(135deg, var(--gray-100) 0%, var(--white) 50%, rgba(81, 43, 212, 0.05) 100%);
  position: relative;
  overflow: hidden;
}

.hero::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -20%;
  width: 800px;
  height: 800px;
  background: radial-gradient(circle, rgba(81, 43, 212, 0.08) 0%, transparent 70%);
  border-radius: 50%;
}

.hero .container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-3xl);
  align-items: center;
}

.hero-content {
  position: relative;
  z-index: 1;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-xs) var(--spacing-md);
  background: rgba(81, 43, 212, 0.1);
  color: var(--ntk-purple);
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: var(--spacing-lg);
}

.hero h1 {
  font-size: 3.5rem;
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: var(--spacing-lg);
  color: var(--gray-900);
}

.hero h1 span {
  background: linear-gradient(135deg, var(--ntk-purple) 0%, var(--royal-blue) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero p {
  font-size: 1.25rem;
  color: var(--gray-500);
  margin-bottom: var(--spacing-xl);
  max-width: 500px;
}

.hero-actions {
  display: flex;
  gap: var(--spacing-md);
}

.hero-visual {
  position: relative;
  z-index: 1;
}

.hero-visual img {
  width: 120%;
  max-width: 700px;
  border-radius: 16px;
  box-shadow: var(--shadow-strong);
  animation: ntk-float 3s ease-in-out infinite;
}

/* Float Animation */
@keyframes ntk-float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-15px);
  }
}

/* Stats */
.stats {
  display: flex;
  gap: var(--spacing-3xl);
  margin-top: var(--spacing-3xl);
  padding-top: var(--spacing-xl);
  border-top: 1px solid var(--gray-200);
}

.stat {
  text-align: left;
}

.stat-value {
  font-size: 2rem;
  font-weight: 800;
  color: var(--ntk-purple);
}

.stat-label {
  font-size: 0.875rem;
  color: var(--gray-500);
  font-weight: 500;
}

/* Features */
.features {
  padding: var(--spacing-3xl) 0;
  background: var(--white);
}

.section-header {
  text-align: center;
  max-width: 600px;
  margin: 0 auto var(--spacing-3xl);
}

.section-header h2 {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: var(--spacing-md);
  color: var(--gray-900);
}

.section-header p {
  font-size: 1.125rem;
  color: var(--gray-500);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-xl);
}

.feature-card {
  padding: var(--spacing-xl);
  background: var(--white);
  border: 1px solid var(--gray-100);
  border-radius: 16px;
  transition: all var(--transition-normal);
}

.feature-card:hover {
  border-color: var(--ntk-purple-light);
  box-shadow: var(--shadow-medium);
  transform: translateY(-4px);
}

.feature-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, var(--ntk-purple) 0%, var(--ntk-purple-light) 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--spacing-lg);
}

.feature-icon svg {
  width: 24px;
  height: 24px;
  color: var(--white);
}

.feature-card h3 {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: var(--spacing-sm);
  color: #111827;
}

.feature-card p {
  font-size: 0.9375rem;
  color: #4b5563;
  line-height: 1.6;
}

/* Components Showcase - ALWAYS dark background with white text */
.showcase {
  padding: var(--spacing-3xl) 0;
  background: #111827 !important;
  color: #ffffff !important;
}

.showcase h2,
.showcase .section-header h2 {
  color: #ffffff !important;
}

.showcase .section-header p {
  color: #d1d5db !important;
}

.btn-primary,
.btn-primary svg,
.btn-primary:hover,
.btn-primary:hover svg {
  color: var(--white) !important;
  fill: var(--white) !important;
}

.component-tabs {
  display: flex;
  justify-content: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-xl);
}

.tab-btn {
  padding: var(--spacing-sm) var(--spacing-lg);
  background: transparent;
  color: var(--gray-300);
  border: 1px solid var(--gray-700);
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.tab-btn:hover,
.tab-btn.active {
  background: var(--ntk-purple);
  border-color: var(--ntk-purple);
  color: var(--white);
}

.component-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--spacing-md);
}

.component-item {
  padding: var(--spacing-lg);
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  text-align: center;
  transition: all var(--transition-fast);
}

.component-item:hover {
  background: #f3f4f6;
  border-color: var(--ntk-purple);
}

.component-item code {
  font-size: 0.875rem;
  color: #512BD4;
}

.component-item p {
  font-size: 0.75rem;
  color: #4b5563;
  margin-top: var(--spacing-xs);
}

/* Code Example */
.code-section {
  padding: var(--spacing-3xl) 0;
  background: var(--gray-100);
}

.code-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-xl);
  align-items: start;
}

.code-block {
  background: var(--gray-900);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: var(--shadow-strong);
  animation: ntk-float 3s ease-in-out infinite;
  animation-delay: 0.2s;
}

.code-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md) var(--spacing-lg);
  background: rgba(0, 0, 0, 0.3);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.code-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.code-dot.red { background: #FF5F56; }
.code-dot.yellow { background: #FFBD2E; }
.code-dot.green { background: #27C93F; }

.code-content {
  padding: var(--spacing-lg);
  overflow-x: auto;
}

.code-content pre {
  font-size: 0.875rem;
  line-height: 1.7;
  color: var(--gray-300);
}

.code-content .keyword { color: #C678DD; }
.code-content .string { color: #98C379; }
.code-content .component { color: #61AFEF; }
.code-content .prop { color: #E5C07B; }
.code-content .comment { color: #5C6370; }

/* Form Components Visual Section */
.form-visual-section {
  padding: var(--spacing-3xl) 0;
  background: var(--white);
}

.form-visual-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-3xl);
  align-items: center;
}

.form-visual-image img {
  width: 100%;
  border-radius: 16px;
  box-shadow: var(--shadow-strong);
  animation: ntk-float 3s ease-in-out infinite;
  animation-delay: 0.3s;
}

.form-visual-content h2 {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: var(--spacing-md);
  color: var(--gray-900);
}

.form-visual-content p {
  font-size: 1.125rem;
  color: var(--gray-500);
  margin-bottom: var(--spacing-xl);
}

.form-features {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.form-feature {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.form-feature-icon {
  width: 32px;
  height: 32px;
  background: rgba(81, 43, 212, 0.1);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--ntk-purple);
}

/* Composables Visual Section */
.composables-visual-section {
  padding: var(--spacing-3xl) 0;
  background: var(--gray-100);
}

.composables-visual-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-3xl);
  align-items: start;
}

.composables-visual-image {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 120px;
}

.composables-visual-image img {
  width: 100%;
  max-width: 500px;
  border-radius: 16px;
  box-shadow: var(--shadow-strong);
  animation: ntk-float 3s ease-in-out infinite;
  animation-delay: 0.6s;
}

.composables-visual-content h2 {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: var(--spacing-md);
  color: var(--gray-900);
}

.composables-visual-content p {
  font-size: 1.125rem;
  color: var(--gray-500);
  margin-bottom: var(--spacing-xl);
}

.composables-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-md);
}

.composable-item {
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--white);
  border-radius: 8px;
  border: 1px solid var(--gray-200);
  text-align: left;
}

.composable-item .composable-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: var(--spacing-xs);
}

.composable-icon {
  font-size: 1.25rem;
}

.composable-item code {
  color: var(--ntk-purple);
  font-weight: 600;
}

.composable-item p {
  font-size: 0.75rem;
  color: var(--gray-500);
  margin: 0;
}

/* Theme Section */
.themes {
  padding: var(--spacing-3xl) 0;
  background: var(--white);
}

.theme-preview-image {
  text-align: center;
  margin-bottom: var(--spacing-xl);
}

.theme-preview-image img {
  width: 100%;
  border-radius: 16px;
  box-shadow: var(--shadow-strong);
  animation: ntk-float 3s ease-in-out infinite;
  animation-delay: 0.9s;
}

.theme-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-xl);
}

.theme-card {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: var(--shadow-medium);
  transition: all var(--transition-normal);
}

.theme-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-strong);
}

.theme-preview {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.theme-preview.dark-theme {
  background: linear-gradient(135deg, #111827 0%, #1f2937 100%);
}

.theme-preview.purple-theme {
  background: linear-gradient(135deg, #512BD4 0%, #7A5AF8 100%);
}

.theme-preview.monochrome-theme {
  background: linear-gradient(135deg, #374151 0%, #6B7280 100%);
}

.theme-preview img {
  width: 80px;
  height: 80px;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.theme-card {
  background: var(--white);
  border: 1px solid var(--gray-100);
}

.theme-info {
  padding: var(--spacing-lg);
  background: var(--white);
}

.theme-info h3 {
  font-size: 1.125rem;
  font-weight: 700;
  margin-bottom: var(--spacing-xs);
  color: var(--gray-900);
}

.theme-info p {
  font-size: 0.875rem;
  color: var(--gray-500);
}

/* Dashboard Preview */
.dashboard-preview {
  padding: var(--spacing-3xl) 0;
  background: var(--gray-50);
}

.dashboard-simple {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.metrics-grid-simple {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--spacing-lg);
}

.metric-card-simple {
  background: var(--white);
  border-radius: 12px;
  padding: var(--spacing-lg);
  border: 1px solid var(--gray-200);
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  box-shadow: var(--shadow-soft);
}

.metric-icon {
  font-size: 2rem;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--ntk-purple-light);
  border-radius: 12px;
}

.metric-info {
  flex: 1;
}

.metric-label {
  font-size: 0.875rem;
  color: var(--gray-500);
  margin-bottom: var(--spacing-xs);
}

.metric-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--gray-900);
}

.metric-trend {
  font-size: 0.875rem;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 6px;
}

.metric-trend.positive {
  color: #10b981;
  background: rgba(16, 185, 129, 0.1);
}

.metric-trend.negative {
  color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
}

.chart-simple {
  background: var(--white);
  border-radius: 12px;
  padding: var(--spacing-xl);
  border: 1px solid var(--gray-200);
  box-shadow: var(--shadow-soft);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
}

.chart-title {
  font-weight: 700;
  color: var(--gray-900);
}

.chart-period {
  font-size: 0.875rem;
  color: var(--gray-500);
}

.chart-bars-simple {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  height: 200px;
  gap: var(--spacing-sm);
}

.chart-bar-simple {
  flex: 1;
  background: linear-gradient(180deg, var(--ntk-purple), var(--ntk-purple-light));
  border-radius: 6px 6px 0 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  position: relative;
  transition: all 0.3s;
}

.chart-bar-simple:hover {
  opacity: 0.8;
}

.chart-bar-simple span {
  position: absolute;
  bottom: -24px;
  font-size: 0.75rem;
  color: var(--gray-500);
}

/* Dark mode for dashboard simple */
body.dark-mode .dashboard-preview {
  background: var(--gray-800);
}

body.dark-mode .metric-card-simple {
  background: var(--gray-900);
  border-color: var(--gray-700);
}

body.dark-mode .metric-value {
  color: var(--white);
}

body.dark-mode .chart-simple {
  background: var(--gray-900);
  border-color: var(--gray-700);
}

body.dark-mode .chart-title {
  color: var(--white);
}

/* Installation */
.installation {
  padding: var(--spacing-3xl) 0;
  background: var(--gray-900);
  color: var(--white);
}

.installation .section-header h2 {
  color: var(--white) !important;
}

.installation .section-header p {
  color: var(--gray-300) !important;
}

.install-steps {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-xl);
}

.install-step {
  text-align: center;
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: var(--spacing-xl);
}

.step-number {
  width: 48px;
  height: 48px;
  background: var(--ntk-purple);
  color: var(--white);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 1.25rem;
  margin: 0 auto var(--spacing-lg);
}

.install-step h3 {
  font-size: 1.125rem;
  font-weight: 700;
  margin-bottom: var(--spacing-sm);
  color: var(--white) !important;
}

.install-step code {
  display: block;
  padding: var(--spacing-md);
  background: rgba(15, 23, 42, 0.9);
  border-radius: 8px;
  font-size: 0.875rem;
  color: var(--ntk-purple-light);
  margin-top: var(--spacing-md);
  word-break: break-all;
  overflow-wrap: break-word;
  white-space: pre-wrap;
}

.install-step-content {
  overflow: hidden;
}

.install-step-content code {
  word-break: break-all;
  overflow-wrap: break-word;
  white-space: pre-wrap;
  font-size: 0.75rem;
}

/* Theme Toggle */
.theme-toggle {
  background: transparent;
  border: 1px solid var(--gray-300);
  border-radius: 8px;
  padding: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--gray-700);
  transition: all var(--transition-fast);
}

.theme-toggle:hover {
  background: var(--gray-100);
  color: var(--ntk-purple);
}

body.dark-mode .theme-toggle {
  border-color: rgba(255, 255, 255, 0.2);
  color: var(--gray-300);
}

body.dark-mode .theme-toggle:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--ntk-purple-light);
}

/* Dark Mode Styles */
body.dark-mode {
  background: var(--gray-900);
  color: var(--gray-100);
}

body.dark-mode .header {
  background: rgba(17, 24, 39, 0.95);
  border-bottom-color: rgba(255, 255, 255, 0.1);
}

body.dark-mode .logo-text {
  color: var(--white);
}

body.dark-mode .nav a {
  color: var(--gray-300);
}

body.dark-mode .nav a:hover {
  color: var(--ntk-purple-light);
}

body.dark-mode .hero {
  background: linear-gradient(135deg, var(--gray-900) 0%, #1a1a2e 50%, rgba(81, 43, 212, 0.15) 100%);
}

body.dark-mode .hero h1 {
  color: var(--white);
}

body.dark-mode .hero p {
  color: var(--gray-400);
}

body.dark-mode .btn-secondary {
  border-color: rgba(255, 255, 255, 0.2);
  color: var(--gray-300);
}

body.dark-mode .btn-secondary:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--white);
}

body.dark-mode .stat-number {
  color: var(--ntk-purple-light);
}

body.dark-mode .stat-label {
  color: var(--gray-400);
}

body.dark-mode section:not(.dark-section) {
  background: var(--gray-900);
}

body.dark-mode .section-header h2 {
  color: var(--white);
}

body.dark-mode .section-header p {
  color: var(--gray-400);
}

/* Feature cards - same style in both themes - FORCE colors */
body.dark-mode .feature-card {
  background: #ffffff !important;
  border-color: #e5e7eb !important;
}

body.dark-mode .feature-card h3 {
  color: #111827 !important;
}

body.dark-mode .feature-card p {
  color: #4b5563 !important;
}

body.dark-mode .code-content {
  background: #0d1117;
}

/* Theme cards - keep white bottom in both themes */
body.dark-mode .theme-card {
  background: var(--white);
  border: 1px solid var(--gray-200);
}

body.dark-mode .theme-info {
  background: var(--white);
}

body.dark-mode .theme-card h3,
body.dark-mode .theme-info h3 {
  color: var(--gray-900) !important;
}

body.dark-mode .theme-card p,
body.dark-mode .theme-info p {
  color: #4b5563 !important;
}

/* Dark mode: form-visual-section */
body.dark-mode .form-visual-section {
  background: var(--gray-900);
}

body.dark-mode .form-visual-content h2 {
  color: var(--white);
}

body.dark-mode .form-visual-content p {
  color: var(--gray-400);
}

body.dark-mode .form-feature span {
  color: var(--gray-300);
}

/* Dark mode: composables-visual-section */
body.dark-mode .composables-visual-section {
  background: var(--gray-900);
}

body.dark-mode .composables-visual-content h2 {
  color: var(--white);
}

body.dark-mode .composables-visual-content p {
  color: var(--gray-400);
}

/* Composable items - same style in both themes - FORCE colors */
body.dark-mode .composable-item {
  background: var(--white) !important;
  border-color: var(--gray-200) !important;
}

body.dark-mode .composable-item code {
  color: var(--ntk-purple) !important;
}

body.dark-mode .composable-item p {
  color: #4b5563 !important;
}

/* Component items - white cards with dark text in both themes */
.showcase .component-item {
  background: #ffffff !important;
  border: 1px solid #e5e7eb !important;
}

.showcase .component-item code {
  color: #512BD4 !important;
}

.showcase .component-item p {
  color: #4b5563 !important;
}

/* Light mode - ensure text visibility on dark backgrounds */
.dark-section h2,
.dark-section h3,
.dark-section p,
.dark-section code {
  color: var(--white);
}

.dark-section .section-header h2 {
  color: var(--white);
}

.dark-section .section-header p {
  color: var(--gray-300);
}

.dark-section .component-item code {
  color: var(--ntk-purple-light);
}

.dark-section .component-item p {
  color: var(--gray-400);
}

/* Footer always has white text (dark background) */
.footer,
.footer h4,
.footer p,
.footer a {
  color: var(--gray-300);
}

.footer h4 {
  color: var(--white) !important;
}

.footer .footer-logo {
  color: var(--white);
}

.footer-column a:hover {
  color: var(--white);
}

/* Footer */
.footer {
  padding: var(--spacing-3xl) 0 var(--spacing-xl);
  background: var(--gray-900);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.footer-content {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: var(--spacing-3xl);
  margin-bottom: var(--spacing-2xl);
}

.footer-brand {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  color: var(--white);
  font-weight: 700;
  font-size: 1.125rem;
}

.footer-logo img {
  width: 40px;
  height: 40px;
  border-radius: 8px;
}

.footer-description {
  color: var(--gray-400);
  font-size: 0.875rem;
  line-height: 1.6;
  max-width: 300px;
}

.footer-social {
  display: flex;
  gap: var(--spacing-md);
}

.footer-social a {
  color: var(--gray-400);
  transition: color var(--transition-fast);
}

.footer-social a:hover {
  color: var(--ntk-purple-light);
}

.footer-links-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-xl);
}

.footer-column {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.footer-column h4 {
  color: var(--white);
  font-weight: 600;
  font-size: 0.875rem;
  margin-bottom: var(--spacing-sm);
}

.footer-column a {
  color: var(--gray-400);
  font-size: 0.875rem;
  transition: color var(--transition-fast);
}

.footer-column a:hover {
  color: var(--ntk-purple-light);
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: var(--spacing-xl);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.footer-bottom p {
  color: var(--gray-500);
  font-size: 0.875rem;
}

.footer-bottom a {
  color: var(--ntk-purple-light);
}

.footer-bottom a:hover {
  color: var(--white);
}

/* Responsive */
@media (max-width: 1024px) {
  .hero .container {
    grid-template-columns: 1fr;
    text-align: center;
  }
  
  .hero-content {
    order: 1;
  }
  
  .hero-visual {
    order: 2;
    max-width: 600px;
    margin: 0 auto;
  }
  
  .hero p {
    margin: 0 auto var(--spacing-xl);
  }
  
  .hero-actions {
    justify-content: center;
  }
  
  .stats {
    justify-content: center;
  }
  
  .features-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .component-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .code-container {
    grid-template-columns: 1fr;
  }
  
  .theme-grid {
    grid-template-columns: 1fr;
    max-width: 400px;
    margin: 0 auto;
  }
  
  .install-steps {
    grid-template-columns: 1fr;
    max-width: 400px;
    margin: 0 auto;
  }
}

@media (max-width: 768px) {
  .hero h1 {
    font-size: 2rem;
  }
  
  .hero p {
    font-size: 1rem;
  }
  
  .hero-visual img {
    width: 100%;
    max-width: 100%;
  }
  
  .nav {
    display: none;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .component-grid {
    grid-template-columns: 1fr;
  }
  
  .form-visual-container {
    grid-template-columns: 1fr;
  }
  
  .form-visual-content h2 {
    font-size: 1.75rem;
  }
  
  .composables-visual-container {
    grid-template-columns: 1fr;
  }
  
  .composables-visual-image {
    padding-top: 0;
    order: 2;
  }
  
  .composables-visual-content {
    order: 1;
  }
  
  .composables-visual-content h2 {
    font-size: 1.75rem;
  }
  
  .composables-list {
    grid-template-columns: 1fr;
  }
  
  .code-block {
    overflow-x: auto;
  }
  
  .code-content pre {
    font-size: 0.75rem;
    white-space: pre-wrap;
    word-break: break-word;
  }
  
  .theme-section h2 {
    font-size: 1.75rem;
  }
  
  .footer-content {
    grid-template-columns: 1fr;
    text-align: center;
  }
  
  .footer-description {
    max-width: 100%;
  }
  
  .footer-social {
    justify-content: center;
  }
  
  .footer-links-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-xl);
  }
  
  .footer-bottom {
    flex-direction: column;
    gap: var(--spacing-sm);
    text-align: center;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 var(--spacing-md);
  }
  
  .hero {
    padding: 120px 0 60px;
  }
  
  .hero h1 {
    font-size: 1.75rem;
  }
  
  .hero-actions {
    flex-direction: column;
    width: 100%;
  }
  
  .hero-actions .btn {
    width: 100%;
    justify-content: center;
  }
  
  .stats {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    gap: var(--spacing-lg);
  }
  
  .stat {
    text-align: center;
    min-width: 80px;
  }
  
  .stat-value {
    font-size: 1.5rem;
  }
  
  .stat-label {
    font-size: 0.75rem;
  }
  
  .section-header h2 {
    font-size: 1.5rem;
  }
  
  .form-visual-content h2,
  .composables-visual-content h2,
  .theme-section h2 {
    font-size: 1.5rem;
  }
  
  .install-step-content code {
    font-size: 0.7rem;
    word-break: break-all;
  }
  
  .install-step {
    padding: var(--spacing-md);
  }
  
  .install-step code {
    font-size: 0.65rem;
    padding: var(--spacing-sm);
  }
  
  .install-step h3 {
    font-size: 1rem;
  }
}

/* Mobile Menu Button */
.mobile-menu-btn {
  display: none;
  background: transparent;
  border: none;
  padding: 8px;
  cursor: pointer;
  color: var(--gray-700);
}

@media (max-width: 768px) {
  .mobile-menu-btn {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

body.dark-mode .mobile-menu-btn {
  color: var(--gray-300);
}

/* Mobile Drawer */
.mobile-drawer {
  position: fixed;
  top: 0;
  right: -300px;
  width: 300px;
  height: 100vh;
  background: var(--white);
  z-index: 1000;
  transition: right 0.3s ease;
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.1);
}

.mobile-drawer.open {
  right: 0;
}

body.dark-mode .mobile-drawer {
  background: var(--gray-900);
}

.drawer-header {
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--gray-100);
}

body.dark-mode .drawer-header {
  border-bottom-color: rgba(255, 255, 255, 0.1);
}

.drawer-close-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  background: transparent;
  border: none;
  color: var(--gray-500);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  padding: var(--spacing-sm);
  border-radius: 8px;
  transition: all var(--transition-fast);
}

.drawer-close-btn:hover {
  background: var(--gray-100);
  color: var(--gray-700);
}

body.dark-mode .drawer-close-btn {
  color: var(--gray-400);
}

body.dark-mode .drawer-close-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--white);
}

.drawer-nav {
  display: flex;
  flex-direction: column;
  padding: var(--spacing-lg);
  gap: var(--spacing-sm);
}

.drawer-link {
  display: block;
  padding: var(--spacing-md);
  color: var(--gray-700);
  font-weight: 500;
  border-radius: 8px;
  transition: all var(--transition-fast);
}

.drawer-link:hover {
  background: var(--gray-100);
  color: var(--ntk-purple);
}

body.dark-mode .drawer-link {
  color: var(--gray-300);
}

body.dark-mode .drawer-link:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--ntk-purple-light);
}

.drawer-cta {
  margin-top: var(--spacing-md);
  justify-content: center;
}

.drawer-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}

.drawer-overlay.open {
  opacity: 1;
  visibility: visible;
}
</style>
