# NetToolsKit UI Vue

A comprehensive Vue 3 + Quasar component library and design system for building consistent, accessible, and beautiful web applications across the NetToolsKit ecosystem.

[![Vue 3](https://img.shields.io/badge/Vue-3.x-4FC08D?logo=vue.js)](https://vuejs.org/)
[![Quasar](https://img.shields.io/badge/Quasar-2.x-1976D2?logo=quasar)](https://quasar.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## Features

- ✅ 22 reusable Vue 3 components (form, layout, UI)
- ✅ 12 composables for reactive logic and state management
- ✅ **Centralized branding system** with `useBranding()` composable
- ✅ Multi-theme support with CSS variables and design tokens
- ✅ SCSS design system with comprehensive utility classes
- ✅ TypeScript-first with full type definitions
- ✅ Quasar Framework integration
- ✅ Clean Architecture patterns
- ✅ Accessibility-focused (WCAG AA compliant)
- ✅ **Complete customization guides** and project templates
- ✅ NPM package ready (CJS + ESM + CSS)

---

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Usage Examples](#usage-examples)
  - [Components](#components)
  - [Composables](#composables)
  - [Branding System](#branding-system)
- [API Reference](#api-reference)
  - [Components](#components-api)
  - [Composables](#composables-api)
  - [Theme Configuration](#theme-configuration)
- [Documentation](#documentation)
- [Design System](#design-system)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [Dependencies](#dependencies)
- [References](#references)
- [License](#license)

---

## Installation

### NPM Package (Recommended)

```bash
npm install @nettoolskit/ui-vue
```

### From Source

Clone the repository and copy the `nettoolskit-ui-vue` folder to your project's `shared` directory:

```bash
git clone https://github.com/ThiagoGuislotti/nettoolskit-ui-vue.git
cp -r nettoolskit-ui-vue your-project/src/shared/
```

Or add as a Git submodule:

```bash
git submodule add https://github.com/ThiagoGuislotti/nettoolskit-ui-vue.git src/shared/nettoolskit-ui-vue
```

### Peer Dependencies

Ensure your project has the following dependencies:

```json
{
  "dependencies": {
    "vue": "^3.4.0",
    "quasar": "^2.14.0",
    "pinia": "^2.1.0"
  },
  "devDependencies": {
    "sass": "^1.69.0",
    "typescript": "^5.3.0"
  }
}
```

---

## Quick Start

### 1. Setup (main.ts)

```ts
import { createApp } from 'vue'
import { Quasar } from 'quasar'
import { NtkThemePlugin, nettoolskitTheme } from '@nettoolskit/ui-vue'

// Import styles
import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/dist/quasar.css'
import '@nettoolskit/ui-vue/dist/index.css'

const app = createApp(App)
app.use(Quasar)
app.use(themePlugin, themeConfig)
app.mount('#app')
```

### 2. Configure Theme (theme.config.ts)

```ts
import { ThemeConfig } from '@nettoolskit/ui-vue'

export const themeConfig: ThemeConfig = {
  logo: { letter: 'M', text: 'MyApp' },
  appName: 'My Application',
  tagline: 'Build amazing things',
  colors: { primary: '#1976d2', secondary: '#424242' }
}
```

### 3. Use Components

```vue
<template>
  <BaseInput v-model="email" label="Email" type="email" :rules="[required]" />
  <BaseButton label="Submit" color="primary" @click="handleSubmit" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { BaseInput, BaseButton, useFormRules } from '@nettoolskit/ui-vue'

const email = ref('')
const { required } = useFormRules()
const handleSubmit = () => console.log('Submitted:', email.value)
</script>
```

### 4. Access Branding

```vue
<script setup lang="ts">
import { useBranding } from '@nettoolskit/ui-vue'

const { logo, appName, primaryColor, contact, social } = useBranding()
</script>
```

> 📚 **Detailed Setup**: [templates/new-project-setup.md](./templates/new-project-setup.md)
> 🎨 **Customization Guide**: [docs/CUSTOMIZATION.md](./docs/CUSTOMIZATION.md)

---

## Usage Examples

### Components

#### Form Components

```vue
<template>
  <q-form @submit="onSubmit">
    <!-- Text Input with validation -->
    <BaseInput
      v-model="form.name"
      label="Full Name"
      :rules="[rules.required]"
      hint="Enter your full name"
    />

    <!-- Select dropdown -->
    <BaseSelect
      v-model="form.country"
      label="Country"
      :options="countries"
      option-label="name"
      option-value="code"
    />

    <!-- Multi-select -->
    <BaseMultiSelect
      v-model="form.skills"
      label="Skills"
      :options="skillOptions"
      use-chips
    />

    <!-- Date picker -->
    <BaseDatePicker
      v-model="form.birthDate"
      label="Birth Date"
      mask="DD/MM/YYYY"
    />

    <!-- Textarea -->
    <BaseTextarea
      v-model="form.bio"
      label="Biography"
      :max-length="500"
      autogrow
    />

    <BaseButton type="submit" label="Save" color="primary" />
  </q-form>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import {
  BaseInput,
  BaseSelect,
  BaseMultiSelect,
  BaseDatePicker,
  BaseTextarea,
  BaseButton,
  useFormRules,
} from '@/shared/nettoolskit-ui-vue';

const { rules } = useFormRules();
const form = reactive({
  name: '',
  country: null,
  skills: [],
  birthDate: '',
  bio: '',
});

const countries = [
  { name: 'Brazil', code: 'BR' },
  { name: 'United States', code: 'US' },
];

const skillOptions = ['Vue.js', 'TypeScript', 'Node.js', 'Python'];

const onSubmit = () => console.log('Form:', form);
</script>
```

#### Layout Components

```vue
<template>
  <!-- Hero section for landing pages -->
  <BaseHero
    title="Welcome to Our Platform"
    subtitle="Build amazing applications with our tools"
    :cta-primary="{ label: 'Get Started', action: () => router.push('/signup') }"
    :cta-secondary="{ label: 'Learn More', action: () => router.push('/docs') }"
  />

  <!-- Section wrapper with consistent spacing -->
  <BaseSection title="Features" subtitle="What we offer">
    <div class="row q-gutter-md">
      <BaseFeatureCard
        v-for="feature in features"
        :key="feature.title"
        :icon="feature.icon"
        :title="feature.title"
        :description="feature.description"
      />
    </div>
  </BaseSection>

  <!-- Footer with links -->
  <BaseFooter
    :links="footerLinks"
    copyright="© 2024 NetToolsKit. All rights reserved."
  />
</template>
```

#### UI Components

```vue
<template>
  <!-- Logo with theme support -->
  <BaseLogo size="lg" :show-tagline="true" />

  <!-- Metric cards for dashboards -->
  <div class="row q-gutter-md">
    <MetricCard
      title="Total Users"
      :value="1234"
      icon="people"
      color="primary"
      :trend="{ value: 12, direction: 'up' }"
    />
    <MetricCard
      title="Revenue"
      :value="'$45,678'"
      icon="attach_money"
      color="positive"
    />
  </div>

  <!-- Pricing cards -->
  <BasePricingCard
    title="Pro Plan"
    :price="29"
    period="month"
    :features="['Unlimited projects', '24/7 Support', 'API Access']"
    :highlighted="true"
    cta-label="Subscribe"
    @select="handleSubscribe"
  />

  <!-- Credit-based pricing -->
  <BaseCreditCard
    title="100 Credits"
    :credits="100"
    :price="9.90"
    :features="['No expiration', 'All features']"
    @select="handleBuyCredits"
  />

  <!-- Steps/Process indicator -->
  <BaseSteps
    :steps="[
      { number: 1, title: 'Sign Up', description: 'Create your account' },
      { number: 2, title: 'Configure', description: 'Set up your preferences' },
      { number: 3, title: 'Start', description: 'Begin using the platform' },
    ]"
  />
</template>
```

---

### Composables

#### useBranding - Centralized Branding Access

```ts
import { useBranding } from '@nettoolskit/ui-vue'

const {
  logo,           // { letter, text, url } - Logo configuration
  appName,        // Application name
  tagline,        // Application tagline/subtitle
  appUrl,         // Application URL
  primaryColor,   // Primary brand color
  secondaryColor, // Secondary brand color
  contact,        // { email, phone, address, whatsapp }
  social          // { github, linkedin, twitter, instagram, facebook }
} = useBranding()

// Use in templates
<template>
  <div :style="{ color: primaryColor }">{{ appName }}</div>
  <a :href="social.github">GitHub</a>
</template>
```

#### useTheme - Dynamic Theme Management

```ts
import { useTheme } from '@nettoolskit/ui-vue'

const {
  theme,           // Current theme config (readonly)
  themeName,       // Current theme name (readonly)
  primaryColor,    // Computed primary color
  logo,            // Computed logo config
  isDark,          // Computed: is dark theme?
  availableThemes, // List of available themes
  setTheme,        // Change theme by name
  setCustomTheme,  // Apply custom theme config
  loadSavedTheme,  // Load from localStorage
} = useTheme()

// Switch themes programmatically
setTheme('dark')  // Dark mode
```

#### useFormRules - Form Validation

```ts
import { useFormRules } from '@nettoolskit/ui-vue'

const { required, email, minLength, maxLength, numeric, cpf, cnpj, phone } = useFormRules()

// Use in components
<BaseInput :rules="[required, email]" />
<BaseInput :rules="[required, minLength(8)]" />
```

#### useNotification - Toast Notifications

```ts
import { useNotification } from '@/shared/nettoolskit-ui-vue';

const { notify, success, error, warning, info } = useNotification();

// Quick methods
success('Operation completed!');
error('Something went wrong');
warning('Please review your data');
info('New update available');

// Custom notification
notify({
  message: 'Custom message',
  type: 'positive',
  position: 'top-right',
  timeout: 3000,
  actions: [{ label: 'Undo', color: 'white', handler: () => {} }],
});
```

#### useDialog - Modal Dialogs

```ts
import { useDialog } from '@/shared/nettoolskit-ui-vue';

const { confirm, alert, prompt } = useDialog();

// Confirmation dialog
const confirmed = await confirm({
  title: 'Delete Item',
  message: 'Are you sure you want to delete this item?',
  confirmLabel: 'Delete',
  cancelLabel: 'Cancel',
  confirmColor: 'negative',
});

if (confirmed) {
  // Proceed with deletion
}

// Alert dialog
await alert({
  title: 'Success',
  message: 'Your changes have been saved.',
});

// Prompt dialog
const name = await prompt({
  title: 'Rename',
  message: 'Enter new name:',
  defaultValue: 'Current Name',
});
```

#### useResponsive - Breakpoint Detection

```ts
import { useResponsive } from '@/shared/nettoolskit-ui-vue';

const { isMobile, isTablet, isDesktop, breakpoint } = useResponsive();

// Use in templates
// <div v-if="isMobile">Mobile view</div>
// <div v-else>Desktop view</div>
```

#### useDebounce - Debounced Values

```ts
import { useDebounce } from '@/shared/nettoolskit-ui-vue';

const searchQuery = ref('');
const debouncedQuery = useDebounce(searchQuery, 300);

// debouncedQuery updates 300ms after searchQuery stops changing
watch(debouncedQuery, (query) => {
  fetchSearchResults(query);
});
```

#### useAsync - Async Operation Handler

```ts
import { useAsync } from '@/shared/nettoolskit-ui-vue';

const { execute, loading, error, data } = useAsync(async (id: string) => {
  const response = await api.get(`/users/${id}`);
  return response.data;
});

// Execute the async function
await execute('user-123');

// Use in template
// <q-spinner v-if="loading" />
// <div v-else-if="error">{{ error.message }}</div>
// <UserCard v-else :user="data" />
```

---

### Theme System

#### Available Themes

| Theme | Primary Color | Use Case |
|-------|--------------|----------|
| `sentinela` | Blue (#1976d2) | Monitoring, search, corporate apps |
| `platea` | Teal (#4A9B7F) | Accessibility, organization, calm UX |
| `dark` | Indigo (#6366f1) | Dark mode, developer tools |

#### Creating Custom Themes

```ts
import type { ThemeConfig } from '@/shared/nettoolskit-ui-vue';
import { useTheme } from '@/shared/nettoolskit-ui-vue';

const customTheme: ThemeConfig = {
  name: 'MyBrand',
  colors: {
    primary: '#ff6b6b',
    primaryDark: '#ee5a5a',
    primaryLight: '#ff8787',
    secondary: '#f8f9fa',
    accent: '#ff6b6b',
    background: '#ffffff',
    backgroundLight: '#f8f9fa',
    text: '#212529',
    textLight: '#6c757d',
    textMuted: '#adb5bd',
    border: '#dee2e6',
    success: '#28a745',
    warning: '#ffc107',
    error: '#dc3545',
    info: '#17a2b8',
  },
  fonts: {
    display: 'Montserrat',
    body: 'Open Sans',
  },
  logo: {
    letter: 'M',
    text: 'MyBrand',
    tagline: 'Your tagline here',
  },
  gradients: {
    hero: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
    primary: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a5a 100%)',
    loading: 'linear-gradient(90deg, #f8f9fa 0%, #e9ecef 50%, #f8f9fa 100%)',
  },
};

const { setCustomTheme } = useTheme();
setCustomTheme(customTheme);
```

#### CSS Variables

The theme system automatically sets these CSS variables:

```css
:root {
  /* Colors */
  --theme-primary: #1976d2;
  --theme-primary-dark: #1565c0;
  --theme-primary-light: #42a5f5;
  --theme-secondary: #f5f5f5;
  --theme-accent: #1976d2;
  --theme-background: #ffffff;
  --theme-background-light: #f5f7fa;
  --theme-text: #424242;
  --theme-text-light: #757575;
  --theme-text-muted: #9e9e9e;
  --theme-border: #e0e0e0;
  --theme-success: #28a745;
  --theme-warning: #ffc107;
  --theme-error: #dc3545;
  --theme-info: #17a2b8;

  /* Gradients */
  --theme-gradient-hero: linear-gradient(...);
  --theme-gradient-primary: linear-gradient(...);
  --theme-gradient-loading: linear-gradient(...);

  /* Fonts */
  --theme-font-display: 'Poppins';
  --theme-font-body: 'Inter';
}
```

---

## API Reference

### Components API

#### Form Components

| Component | Props | Events | Description |
|-----------|-------|--------|-------------|
| `BaseInput` | `modelValue`, `label`, `type`, `rules`, `hint`, `disable` | `update:modelValue` | Text input with validation |
| `BaseSelect` | `modelValue`, `label`, `options`, `optionLabel`, `optionValue`, `rules` | `update:modelValue` | Single select dropdown |
| `BaseMultiSelect` | `modelValue`, `label`, `options`, `useChips`, `rules` | `update:modelValue` | Multi-select with chips |
| `BaseTextarea` | `modelValue`, `label`, `maxLength`, `autogrow`, `rules` | `update:modelValue` | Multiline text input |
| `BaseDatePicker` | `modelValue`, `label`, `mask`, `rules` | `update:modelValue` | Date selection |
| `BaseTimePicker` | `modelValue`, `label`, `format24h`, `rules` | `update:modelValue` | Time selection |

#### Layout Components

| Component | Props | Slots | Description |
|-----------|-------|-------|-------------|
| `BaseHeader` | `title`, `logo`, `navItems` | `left`, `right` | Application header |
| `BaseSidebar` | `items`, `collapsed` | `header`, `footer` | Navigation sidebar |
| `BaseFooter` | `links`, `copyright`, `social` | `default` | Page footer |
| `BaseSection` | `title`, `subtitle`, `padding` | `default` | Content section wrapper |
| `BaseHero` | `title`, `subtitle`, `ctaPrimary`, `ctaSecondary`, `backgroundImage` | `default` | Hero/banner section |

#### UI Components

| Component | Props | Events | Description |
|-----------|-------|--------|-------------|
| `BaseButton` | `label`, `color`, `icon`, `loading`, `disable` | `click` | Styled button |
| `BaseCard` | `title`, `subtitle`, `flat`, `bordered` | - | Content card |
| `BaseChip` | `label`, `color`, `removable`, `icon` | `remove` | Tag/chip element |
| `BaseLogo` | `size`, `showTagline`, `clickable` | `click` | Brand logo |
| `MetricCard` | `title`, `value`, `icon`, `color`, `trend` | - | Dashboard metric |
| `InfoCard` | `title`, `description`, `icon`, `color` | - | Information card |
| `BasePricingCard` | `title`, `price`, `period`, `features`, `highlighted`, `ctaLabel` | `select` | Pricing plan card |
| `BaseCreditCard` | `title`, `credits`, `price`, `features` | `select` | Credit package card |
| `BaseFeatureCard` | `icon`, `title`, `description` | - | Feature highlight |
| `BaseSteps` | `steps`, `orientation` | - | Process steps |
| `SectionHeader` | `title`, `subtitle`, `align` | - | Section title |

### Composables API

| Composable | Returns | Description |
|------------|---------|-------------|
| `useTheme` | `theme`, `setTheme`, `primaryColor`, `isDark`, etc. | Theme management |
| `useFormRules` | `rules`, `emailRules`, `cpfRules`, etc. | Form validation rules |
| `useNotification` | `notify`, `success`, `error`, `warning`, `info` | Toast notifications |
| `useDialog` | `confirm`, `alert`, `prompt` | Modal dialogs |
| `useResponsive` | `isMobile`, `isTablet`, `isDesktop`, `breakpoint` | Responsive breakpoints |
| `useDebounce` | `debouncedValue` | Debounced ref |
| `useAsync` | `execute`, `loading`, `error`, `data` | Async operation handler |
| `useFilters` | `filters`, `applyFilters`, `resetFilters` | Data filtering |
| `useTableColumns` | `columns`, `visibleColumns`, `toggleColumn` | Table column management |
| `useBaseField` | `fieldProps`, `fieldEvents` | Base field composition |

### Theme Configuration

```ts
interface ThemeConfig {
  name: string;
  colors: ThemeColors;
  fonts: ThemeFonts;
  logo: ThemeLogo;
  gradients: ThemeGradients;
}

interface ThemeColors {
  primary: string;
  primaryDark: string;
  primaryLight: string;
  secondary: string;
  accent: string;
  background: string;
  backgroundLight: string;
  text: string;
  textLight: string;
  textMuted: string;
  border: string;
  success: string;
  warning: string;
  error: string;
  info: string;
}

interface ThemeFonts {
  display: string;
  body: string;
}

interface ThemeLogo {
  letter: string;
  text: string;
  tagline?: string;
}

interface ThemeGradients {
  hero: string;
  primary: string;
  loading: string;
}
```

---

## Documentation

### Guides

- 📘 **[New Project Setup](./templates/new-project-setup.md)** - Complete setup guide for new projects
- 🎨 **[Customization Guide](./docs/CUSTOMIZATION.md)** - Theme and branding customization
- 📝 **[Visual Identity Manual](./docs/nettoolskit-visual-identity-manual.md)** - Brand guidelines

### Templates

- **[custom-theme-template.ts](./templates/custom-theme-template.ts)** - TypeScript theme configuration template
- **[custom-branding.scss](./templates/custom-branding.scss)** - SCSS design tokens template

### API References

- Components API (see sections above)
- Composables API (see sections above)
- Theme Configuration (see CUSTOMIZATION.md)

---

## Design System

### Typography

| Element | Font | Weight | Size |
|---------|------|--------|------|
| Display/Titles | Poppins | Bold (700) | 24-48px |
| Body Text | Inter | Regular (400) | 14-16px |
| Captions | Inter | Regular (400) | 12px |

### Spacing Scale

| Token | Value | Usage |
|-------|-------|-------|
| `--spacing-xs` | 4px | Dense elements |
| `--spacing-sm` | 8px | Tight spacing |
| `--spacing-md` | 16px | Default spacing |
| `--spacing-lg` | 24px | Section padding |
| `--spacing-xl` | 32px | Large gaps |
| `--spacing-2xl` | 48px | Section margins |
| `--spacing-3xl` | 64px | Page sections |

### Shadows

| Level | Opacity | Usage |
|-------|---------|-------|
| Soft | 0.05 | Cards, subtle elevation |
| Medium | 0.08 | Dropdowns, popovers |
| Strong | 0.1 | Modals, dialogs |

### Transitions

| Duration | Easing | Usage |
|----------|--------|-------|
| 200ms | ease-in-out | Hover states |
| 300ms | ease-in-out | Expand/collapse |
| 500ms | ease-in-out | Page transitions |

---

## Project Structure

```
nettoolskit-ui-vue/
├── adapters/                    # Infrastructure adapters
│   └── QuasarNotificationAdapter.ts
├── components/                  # Vue components
│   ├── form/                    # Form inputs
│   │   ├── BaseInput.vue
│   │   ├── BaseSelect.vue
│   │   ├── BaseMultiSelect.vue
│   │   ├── BaseTextarea.vue
│   │   ├── BaseDatePicker.vue
│   │   └── BaseTimePicker.vue
│   ├── layout/                  # Layout components
│   │   ├── BaseHeader.vue
│   │   ├── BaseSidebar.vue
│   │   ├── BaseFooter.vue
│   │   ├── BaseSection.vue
│   │   └── BaseHero.vue
│   └── ui/                      # UI components
│       ├── BaseButton.vue
│       ├── BaseCard.vue
│       ├── BaseChip.vue
│       ├── BaseLogo.vue
│       ├── MetricCard.vue
│       ├── InfoCard.vue
│       ├── BasePricingCard.vue
│       ├── BaseCreditCard.vue
│       ├── BaseFeatureCard.vue
│       ├── BaseSteps.vue
│       └── SectionHeader.vue
├── composables/                 # Vue composables
│   ├── data/
│   │   ├── useFilters.ts
│   │   └── useTableColumns.ts
│   ├── forms/
│   │   ├── useFormRules.ts
│   │   └── useBaseField.ts
│   ├── services/
│   │   └── useNotification.ts
│   ├── ui/
│   │   ├── useDialog.ts
│   │   ├── useDialogActions.ts
│   │   ├── useResponsive.ts
│   │   └── useTheme.ts
│   └── utils/
│       ├── useDebounce.ts
│       └── useAsync.ts
├── config/                      # Configuration
│   └── theme.config.ts          # Theme definitions
├── services/                    # Business services
│   ├── NotificationService.ts
│   ├── FilterService.ts
│   └── FormValidationService.ts
├── styles/                      # SCSS styles
│   ├── design-system.scss       # CSS variables & tokens
│   ├── global.scss              # Global styles
│   ├── quasar-variables.scss    # Quasar customization
│   └── index.ts                 # Style exports
├── utils/                       # Utility functions
│   ├── validators.ts            # Validation helpers
│   └── async.ts                 # Async utilities
├── index.ts                     # Main entry point
├── LICENSE                      # MIT License
└── README.md                    # This file
```

---

## Contributing

### Git Flow

1. Create a feature branch from `main`:
   ```bash
   git checkout -b feature/component-name
   ```

2. Make your changes following the code style guidelines

3. Commit using semantic commits:
   ```bash
   git commit -m "feat(component): add new BaseAlert component"
   git commit -m "fix(useTheme): resolve dark mode detection"
   git commit -m "docs(readme): update API reference"
   ```

4. Push and create a Pull Request

### Code Style Guidelines

- **Components**: PascalCase naming (`BaseButton.vue`)
- **Composables**: camelCase with `use` prefix (`useTheme.ts`)
- **CSS classes**: kebab-case (`search-container`)
- **TypeScript**: Strict mode, explicit types
- **No default exports**: Use named exports only

### Commit Types

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation |
| `style` | Code style (formatting) |
| `refactor` | Code refactoring |
| `test` | Adding tests |
| `chore` | Maintenance |

---

## Dependencies

### Runtime

| Package | Version | Purpose |
|---------|---------|---------|
| Vue | ^3.4.0 | Core framework |
| Quasar | ^2.14.0 | UI framework |
| Pinia | ^2.1.0 | State management |

### Development

| Package | Version | Purpose |
|---------|---------|---------|
| TypeScript | ^5.3.0 | Type checking |
| Sass | ^1.69.0 | SCSS compilation |
| ESLint | ^8.56.0 | Code linting |
| Prettier | ^3.2.0 | Code formatting |

---

## References

- [Vue 3 Documentation](https://vuejs.org/)
- [Quasar Framework](https://quasar.dev/)
- [Pinia State Management](https://pinia.vuejs.org/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [WCAG Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

### Related Projects

- [Sentinela](https://github.com/ThiagoGuislotti/sentinela) - Search monitoring system
- [PlaTEA](https://github.com/ThiagoGuislotti/PlaTEA) - Visual agenda for neurodivergent users

### Changelog

See [CHANGELOG.md](./CHANGELOG.md) for version history.

---

## License

MIT License - see [LICENSE](./LICENSE) for details.

---

**NetToolsKit** - Building consistent, accessible, and beautiful web applications.
