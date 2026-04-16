# NetToolsKit UI Vue

A comprehensive Vue 3 + Quasar component library and design system for building consistent, accessible, and beautiful web applications across the NetToolsKit ecosystem.

[![Vue 3](https://img.shields.io/badge/Vue-3.x-4FC08D?logo=vue.js)](https://vuejs.org/)
[![Quasar](https://img.shields.io/badge/Quasar-2.x-1976D2?logo=quasar)](https://quasar.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## README Standard Compliance

This README follows the repository documentation and frontend quality standard:
- [docs/standards/readme-frontend-super-agent-standard.md](./docs/standards/readme-frontend-super-agent-standard.md)

Minimum contract covered in this file:
- scope and platform purpose
- architecture and structure
- quality gates and contribution rules
- validation and references

## Frontend Quality Gate

For frontend changes, use this mandatory baseline:

```bash
npm run lint
npm run type-check
npm run test
```

For visual/template and CMS slices, also run:

```bash
npm run test:e2e -- --project=chromium
```

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
- [White-Label Theme Parameters](#white-label-theme-parameters)
- [API Reference](#api-reference)
  - [Components](#components-api)
  - [Composables](#composables-api)
  - [Theme Configuration](#theme-configuration)
- [Documentation](#documentation)
  - [Official Vue + Quasar UI References](#official-vue--quasar-ui-references)
- [Design System](#design-system)
- [Project Structure](#project-structure)
  - [Architecture Layers](#architecture-layers)
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

## White-Label Theme Parameters

This table documents all white-label theme parameters used by the CMS settings panel.

- Source of truth: landing-page/CmsApp.vue (colorFields)
- Total parameters: **113**
- Basic mode visible by default: **69**
- Advanced mode (optional): **44**

| Parameter | Category | Simple description | Mode | Unified with |
|---|---|---|---|---|
| <code>fontFamily</code> | Typography | Font family | Basic | - |
| <code>fontFamilyDisplay</code> | Typography | Display font family | Basic | - |
| <code>fontStyleBase</code> | Typography | Base font style (normal/italic) | Basic | - |
| <code>fontWeightRegular</code> | Typography | Weight regular | Basic | - |
| <code>fontWeightMedium</code> | Typography | Weight medium | Basic | - |
| <code>fontWeightSemibold</code> | Typography | Weight semibold | Basic | - |
| <code>fontWeightBold</code> | Typography | Weight bold | Basic | - |
| <code>fontSizeBase</code> | Typography | Base font size | Basic | - |
| <code>fontSizeTitle</code> | Typography | Title font size | Basic | - |
| <code>fontSizeTitleApp</code> | Typography | App title size | Basic | - |
| <code>fontSizeBrandTitle</code> | Typography | Brand title size | Basic | - |
| <code>fontSizeBrandSubtitle</code> | Typography | Brand subtitle size | Basic | - |
| <code>fontSizeItemLabel</code> | Typography | Menu label size | Basic | - |
| <code>fontSizeItemCaption</code> | Typography | Menu caption size | Basic | - |
| <code>fontSizeGroupCaption</code> | Typography | Group caption size | Basic | - |
| <code>fontSizeGroupCaptionMini</code> | Typography | Group mini caption size | Basic | - |
| <code>letterSpacingGroupCaption</code> | Typography | Group caption letter spacing | Basic | - |
| <code>letterSpacingGroupCaptionMini</code> | Typography | Group mini letter spacing | Basic | - |
| <code>lineHeightBrandText</code> | Typography | Brand block line height | Basic | - |
| <code>lineHeightItemLabel</code> | Typography | Item label line height | Basic | - |
| <code>lineHeightItemCaption</code> | Typography | Item caption line height | Basic | - |
| <code>borderWidth</code> | Layout | Border width | Basic | - |
| <code>radiusSm</code> | Layout | Radius small | Basic | - |
| <code>radiusMd</code> | Layout | Radius medium | Basic | - |
| <code>radiusLg</code> | Layout | Radius large | Basic | - |
| <code>radiusItem</code> | Layout | Menu item radius | Basic | - |
| <code>spacingXs</code> | Layout | Spacing XS | Basic | - |
| <code>spacingSm</code> | Layout | Spacing SM | Basic | - |
| <code>spacingMd</code> | Layout | Spacing MD | Basic | - |
| <code>spacingLg</code> | Layout | Spacing LG | Basic | - |
| <code>transitionFast</code> | Layout | Transition | Basic | - |
| <code>itemCaptionOffset</code> | Layout | Item caption offset | Advanced | - |
| <code>menuSlotWidth</code> | Layout | Menu slot width | Advanced | - |
| <code>searchWidth</code> | Layout | Search width | Advanced | - |
| <code>searchControlHeight</code> | Layout | Search control height | Advanced | - |
| <code>searchPrependPaddingRight</code> | Layout | Search icon right padding | Advanced | - |
| <code>drawerHeaderMinHeight</code> | Layout | Drawer header min height | Advanced | - |
| <code>brandLogoSize</code> | Layout | Brand logo size | Advanced | - |
| <code>groupCaptionMinHeight</code> | Layout | Group caption min height | Advanced | - |
| <code>groupCaptionPadding</code> | Layout | Group caption padding | Advanced | - |
| <code>groupCaptionMiniPadding</code> | Layout | Group mini padding | Advanced | - |
| <code>groupCaptionMiniMinWidth</code> | Layout | Group mini min width | Advanced | - |
| <code>groupCaptionMiniHeight</code> | Layout | Group mini height | Advanced | - |
| <code>groupCaptionMiniHorizontalPadding</code> | Layout | Group mini horizontal padding | Advanced | - |
| <code>groupCaptionMiniRadius</code> | Layout | Group mini radius | Advanced | - |
| <code>itemMinHeight</code> | Layout | Item min height | Advanced | - |
| <code>itemIconSize</code> | Layout | Item icon size | Advanced | - |
| <code>itemHoverTranslateX</code> | Layout | Item hover translate X | Advanced | - |
| <code>itemActiveBorderWidth</code> | Layout | Item active border width | Advanced | - |
| <code>drawerScrollPaddingBottom</code> | Layout | Drawer scroll padding bottom | Advanced | - |
| <code>workspaceMaxWidth</code> | Layout | Workspace max width | Basic | - |
| <code>viewportHeight</code> | Layout | Viewport height | Basic | - |
| <code>compactBreakpoint</code> | Layout | Compact breakpoint | Basic | - |
| <code>compactPagePadding</code> | Layout | Compact page padding | Advanced | - |
| <code>compactWorkspaceCardPadding</code> | Layout | Compact workspace card padding | Advanced | - |
| <code>cmsLayoutBreakpointLg</code> | Layout | CMS layout breakpoint LG | Advanced | - |
| <code>cmsLayoutBreakpointMd</code> | Layout | CMS layout breakpoint MD | Advanced | - |
| <code>miniItemMarginRight</code> | Layout | Mini item margin right | Advanced | - |
| <code>miniItemAvatarMinWidth</code> | Layout | Mini item avatar min width | Advanced | - |
| <code>shellBackground</code> | Foundation | Shell background | Basic | - |
| <code>pageBackground</code> | Foundation | Page background (outside card) | Basic | - |
| <code>pageTextColor</code> | Foundation | Page text color | Basic | <code>searchTextColor</code> |
| <code>drawerBackground</code> | Foundation | Sidebar background (and cards) | Basic | <code>drawerFooterBackground</code> |
| <code>drawerFooterBackground</code> | Foundation | Surface footer background (override) | Advanced | - |
| <code>drawerTextColor</code> | Foundation | Sidebar text color | Basic | <code>itemTextColor</code>, <code>itemIconColor</code>, <code>brandSubtitleColor</code>, <code>groupCaptionColor</code> |
| <code>dividerColor</code> | Foundation | Divider color | Basic | <code>titleSeparatorColor</code> |
| <code>itemActiveColor</code> | Navigation | Primary accent | Basic | <code>itemHoverColor</code>, <code>itemIconHoverColor</code>, <code>focusColor</code>, <code>titleAppColor</code>, <code>brandTitleColor</code> |
| <code>itemTextColor</code> | Navigation | Item text color (override) | Advanced | - |
| <code>itemIconColor</code> | Navigation | Item icon color (override) | Advanced | - |
| <code>itemHoverBackground</code> | Navigation | Sidebar item hover background | Basic | - |
| <code>itemHoverColor</code> | Navigation | Item hover text color (override) | Advanced | - |
| <code>itemIconHoverColor</code> | Navigation | Item hover icon color (override) | Advanced | - |
| <code>itemActiveBackground</code> | Navigation | Active background | Basic | - |
| <code>focusColor</code> | Navigation | Focus ring color (override) | Advanced | - |
| <code>brandTitleColor</code> | Navigation | Brand title color (override) | Advanced | - |
| <code>brandSubtitleColor</code> | Navigation | Brand subtitle color (override) | Advanced | - |
| <code>groupCaptionColor</code> | Navigation | Group caption color (override) | Advanced | - |
| <code>groupSeparatorOpacity</code> | Navigation | Group separator opacity | Advanced | - |
| <code>groupCaptionMiniBackground</code> | Navigation | Group mini background | Basic | - |
| <code>headerBackground</code> | Header | Header background | Basic | - |
| <code>headerTextColor</code> | Header | Header text color | Basic | <code>toolbarButtonColor</code>, <code>titleTextColor</code>, <code>searchIconColor</code> |
| <code>toolbarButtonColor</code> | Header | Toolbar icon color (override) | Advanced | - |
| <code>titleAppColor</code> | Header | App title color (override) | Advanced | - |
| <code>titleTextColor</code> | Header | Module title color (override) | Advanced | - |
| <code>titleSeparatorColor</code> | Header | Title separator color (override) | Advanced | - |
| <code>titleSeparatorSize</code> | Header | Title separator size | Basic | - |
| <code>searchBackground</code> | Header | Search background | Basic | - |
| <code>searchTextColor</code> | Header | Search text color (override) | Advanced | - |
| <code>searchIconColor</code> | Header | Search icon color (override) | Advanced | - |
| <code>searchBorder</code> | Header | Search border | Basic | - |
| <code>searchBorderHover</code> | Header | Search border hover | Basic | - |
| <code>headerShadow</code> | Header | Header shadow | Basic | - |
| <code>headerZIndex</code> | Header | Header z-index | Advanced | - |
| <code>headerBlur</code> | Header | Header blur | Basic | - |
| <code>drawerShadow</code> | Header | Drawer shadow | Basic | - |
| <code>drawerZIndex</code> | Header | Drawer z-index | Advanced | - |
| <code>drawerFooterShadow</code> | Header | Drawer footer shadow | Basic | - |
| <code>actionBackground</code> | Header | Header actions background | Basic | - |
| <code>actionHoverBackground</code> | Header | Header actions hover background (hover only) | Basic | - |
| <code>actionHoverTranslateY</code> | Header | Header actions hover translate Y | Basic | - |
| <code>userAvatarSize</code> | Header | User avatar size | Basic | - |
| <code>notificationSuccessColor</code> | Notifications | Success color | Basic | - |
| <code>notificationSuccessTextColor</code> | Notifications | Success text color | Basic | - |
| <code>notificationWarningColor</code> | Notifications | Warning color | Basic | - |
| <code>notificationWarningTextColor</code> | Notifications | Warning text color | Basic | - |
| <code>notificationErrorColor</code> | Notifications | Error color | Basic | - |
| <code>notificationErrorTextColor</code> | Notifications | Error text color | Basic | - |
| <code>notificationInfoColor</code> | Notifications | Info color | Basic | - |
| <code>notificationInfoTextColor</code> | Notifications | Info text color | Basic | - |
| <code>notificationBadgeColor</code> | Notifications | Notification badge color | Basic | - |
| <code>notificationBadgeTextColor</code> | Notifications | Notification badge text color | Basic | - |
| <code>notificationIconColor</code> | Notifications | Notification bell icon color | Basic | - |
| <code>badgePulseScale</code> | Notifications | Badge pulse scale | Advanced | - |



### Unification Notes (Alias-based)

These base parameters can propagate values to related tokens:

| Base parameter | Propagates to |
|---|---|
| `pageTextColor` | `searchTextColor` |
| `drawerBackground` | `drawerFooterBackground` |
| `drawerTextColor` | `itemTextColor`, `itemIconColor`, `brandSubtitleColor`, `groupCaptionColor` |
| `dividerColor` | `titleSeparatorColor` |
| `itemActiveColor` | `itemHoverColor`, `itemIconHoverColor`, `focusColor`, `titleAppColor`, `brandTitleColor` |
| `headerTextColor` | `toolbarButtonColor`, `titleTextColor`, `searchIconColor` |

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
- 🧱 **[Template Catalog](./src/templates/README.md)** - Canonical template-first architecture, contracts, and reusable visual packs
- 🧩 **[CMS Backend Integration Handbook](./docs/cms-backend-integration-handbook.md)** - How backend-oriented teams should persist, validate and publish CMS engine payloads
- 🔌 **[CMS Provider Hydration](./docs/cms-provider-hydration.md)** - Async provider examples for content, assets and releases
- 📦 **[CMS Review Package](./docs/cms-review-package.md)** - Export draft-vs-published review artifacts for release analysis and approvals

### Templates

- **[custom-theme-template.ts](./templates/custom-theme-template.ts)** - TypeScript theme configuration template
- **[custom-branding.scss](./templates/custom-branding.scss)** - SCSS design tokens template

### Template Runtime Preview

- `samples/` is the canonical runtime host that consumes the reusable libraries in `src/**`.
- `/` renders the single public sample derived from the approved reference in `.temp/reference`.
- `/?template-runtime=1` renders the router-enabled template runtime (layout/navigation/page/feature templates composed via scaffolded routes).
- `/internal-cms.html` renders the internal CMS authoring runtime outside the public sample flow.
- `/?landing=1` keeps the legacy marketing landing reachable while the samples-first runtime stabilizes.
- Local preview command:

```bash
npm run dev:samples
```

### Official Vue + Quasar UI References

Use the official documentation below as the source of truth for theme, dark mode, popup, portal, and layout decisions before adding local overrides:

- [Quasar Dark Mode](https://quasar.dev/style/dark-mode)
- [Quasar Dark Plugin](https://quasar.dev/quasar-plugins/dark/)
- [Quasar Body Classes](https://quasar.dev/style/body-classes/)
- [Quasar Color Palette And Brand Colors](https://quasar.dev/style/color-palette/)
- [Quasar Sass And SCSS Variables](https://quasar.dev/style/sass-scss-variables/)
- [Quasar QMenu](https://quasar.dev/vue-components/menu/)
- [Quasar QDialog](https://quasar.dev/vue-components/dialog/)
- [Quasar QSelect](https://quasar.dev/vue-components/select/)
- [Quasar QDrawer](https://quasar.dev/layout/drawer/)
- [Quasar QPage And QPageContainer](https://quasar.dev/layout/page/)
- [Vue SFC CSS Features](https://vuejs.org/api/sfc-css-features)
- [Vue Teleport](https://vuejs.org/guide/built-ins/teleport.html)

### Template-First Delivery

All visual slices must start from reusable contracts in `src/templates/**`.

Minimum release expectation for template-based frontend work:
1. typed layout/page/feature contracts
2. reusable state or scaffolding contracts
3. token-driven styles
4. unit coverage for critical behavior
5. visual regression baseline when template surfaces change

Template release checks:

```bash
npm run test -- tests/unit/templates/TemplateAcceptance.spec.ts
npm run test:e2e -- tests/e2e/template-visual-regression.spec.ts --project=chromium
```

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

### Architecture Layers

NetToolsKit UI Vue is intentionally layered so the project stays simple to consume, especially for teams coming from backend-heavy stacks:

1. **Quasar Base**
   - Provides the foundation: layout primitives, responsive utilities, dialogs, inputs, drawers, tables, and ecosystem integration.
   - NetToolsKit does **not** replace Quasar and should not reimplement generic framework features without a product-specific reason.

2. **NTK UI**
   - Adds opinionated product-facing components, design tokens, branding, reference catalog surfaces, and the shared app shell.
   - This is the layer that standardizes how NetToolsKit applications look and behave on top of Quasar.

3. **NTK CMS Engine**
   - Adds schema-driven authoring, page/section/block composition, reusable presets, drag-and-drop builder flows, preview, validation, and release orchestration.
   - This layer stays frontend-first and backend-agnostic.

4. **Application / Backend Contracts**
     - Persistence providers, auth, permissions, media storage, audit workflows, and business rules should plug into the CMS engine through contracts.
     - These concerns should live outside the core engine so the builder remains reusable and simple.
     - For async provider examples, see [docs/cms-provider-hydration.md](docs/cms-provider-hydration.md).
     - For the backend-oriented integration flow, see [docs/cms-backend-integration-handbook.md](docs/cms-backend-integration-handbook.md).
     - For offline release review exports, see [docs/cms-review-package.md](docs/cms-review-package.md).

**Practical rule:** use Quasar directly for generic UI needs, and only encapsulate behavior in NetToolsKit when it creates product-level consistency, faster implementation, or CMS/editor reuse.

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
