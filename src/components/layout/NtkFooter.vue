<template>
  <footer
    class="ntk-footer base-footer"
    :class="footerClasses"
  >
    <div class="ntk-footer__container base-footer__container">
      <!-- Main Content -->
      <div class="ntk-footer__content base-footer__content">
        <!-- Brand Section -->
        <div class="ntk-footer__brand base-footer__brand">
          <slot name="brand">
            <h3 class="ntk-footer__logo base-footer__logo">
              {{ brandName }}
            </h3>
            <p
              v-if="brandDescription"
              class="ntk-footer__description base-footer__description"
            >
              {{ brandDescription }}
            </p>
          </slot>
        </div>

        <!-- Links Sections -->
        <div class="ntk-footer__links base-footer__links">
          <slot name="links">
            <div
              v-for="(section, index) in linkSections"
              :key="index"
              class="ntk-footer__link-section base-footer__link-section"
            >
              <h4 class="ntk-footer__link-title base-footer__link-title">
                {{ section.title }}
              </h4>
              <ul class="ntk-footer__link-list base-footer__link-list">
                <li
                  v-for="(link, linkIndex) in section.links"
                  :key="linkIndex"
                >
                  <a
                    :href="link.href"
                    class="ntk-footer__link base-footer__link"
                    :target="link.external ? '_blank' : undefined"
                    :rel="link.external ? 'noopener noreferrer' : undefined"
                  >
                    {{ link.label }}
                  </a>
                </li>
              </ul>
            </div>
          </slot>
        </div>

        <!-- Social Section -->
        <div
          v-if="$slots.social || finalSocialLinks.length > 0"
          class="ntk-footer__social base-footer__social"
        >
          <slot name="social">
            <h4 class="ntk-footer__link-title base-footer__link-title">
              {{ socialTitle }}
            </h4>
            <div class="ntk-footer__social-links base-footer__social-links">
              <a
                v-for="(socialLink, index) in finalSocialLinks"
                :key="index"
                :href="socialLink.href"
                class="ntk-footer__social-link base-footer__social-link"
                target="_blank"
                rel="noopener noreferrer"
                :aria-label="socialLink.label"
              >
                <q-icon
                  :name="socialLink.icon"
                  size="20px"
                />
              </a>
            </div>
          </slot>
        </div>
      </div>

      <!-- Divider -->
      <div class="ntk-footer__divider base-footer__divider" />

      <!-- Copyright -->
      <div class="ntk-footer__copyright base-footer__copyright">
        <slot name="copyright">
          <p>{{ copyrightText }}</p>
        </slot>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { QIcon } from 'quasar'
import { useBranding } from '../../composables/ui/useBranding'

// ✅ NUNCA usar default export (frontend.instructions.md)
// ✅ TypeScript interface para props

interface LinkItem {
  label: string
  href: string
  external?: boolean
}

interface LinkSection {
  title: string
  links: LinkItem[]
}

interface SocialLink {
  icon: string
  href: string
  label: string
}

interface Props {
  variant?: 'dark' | 'light'
  brandName?: string
  brandDescription?: string
  linkSections?: LinkSection[]
  socialLinks?: SocialLink[]
  socialTitle?: string
  copyrightText?: string
  minimal?: boolean
  useBrandingData?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'dark',
  linkSections: () => [],
  socialLinks: () => [],
  socialTitle: 'Redes Sociais',
  minimal: false,
  useBrandingData: false,
})

const branding = useBranding()

// Valores computados com fallback para props ou tema
const brandName = computed(() => props.brandName || branding.appName?.value || '')
const brandDescription = computed(() => props.brandDescription || branding.tagline?.value || '')
const copyrightText = computed(() =>
  props.copyrightText || `© ${new Date().getFullYear()} ${brandName.value}. Todos os direitos reservados.`
)

// Mapeia redes sociais do tema para o formato do componente
const themeSocialLinks = computed<SocialLink[]>(() => {
  const socialLinks = branding.social?.value
  if (!socialLinks) return []

  const iconMap: Record<string, string> = {
    facebook: 'fab fa-facebook',
    instagram: 'fab fa-instagram',
    linkedin: 'fab fa-linkedin',
    twitter: 'fab fa-twitter',
    github: 'fab fa-github',
    youtube: 'fab fa-youtube',
  }

  return Object.entries(socialLinks)
    .filter(([_, url]) => url)
    .map(([platform, url]) => ({
      icon: iconMap[platform] || 'link',
      href: url as string,
      label: platform.charAt(0).toUpperCase() + platform.slice(1),
    }))
})

// Usa socialLinks das props ou do tema
const finalSocialLinks = computed(() =>
  props.socialLinks.length > 0 ? props.socialLinks : themeSocialLinks.value
)

const footerClasses = computed(() => ({
  [`ntk-footer--${props.variant}`]: true,
  [`base-footer--${props.variant}`]: true,
  'ntk-footer--minimal': props.minimal,
  'base-footer--minimal': props.minimal,
}))
</script>

<style lang="scss" scoped>
.ntk-footer {
  font-family: var(--ntk-font-body);

  &--dark {
    background-color: var(--color-footer-bg);
    color: var(--color-footer-text);
  }

  &--light {
    background-color: var(--color-bg-light);
    color: var(--color-text-dark);
  }

  &__container {
    max-width: 1200px;
    margin: 0 auto;
    padding: var(--space-2xl) var(--space-md);
  }

  &__content {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--space-xl);

    @media (min-width: 600px) {
      grid-template-columns: 1fr 1fr;
    }

    @media (min-width: 1024px) {
      grid-template-columns: 2fr 3fr 1fr;
    }
  }

  &__brand {
    max-width: 300px;
  }

  &__logo {
    font-family: var(--ntk-font-display);
    font-size: var(--ntk-text-xl);
    font-weight: var(--ntk-font-bold);
    margin: 0 0 var(--space-sm) 0;

    .ntk-footer--dark & {
      color: var(--color-text-inverse);
    }
  }

  &__description {
    font-size: var(--ntk-text-sm);
    line-height: var(--line-height-relaxed);
    margin: 0;

    .ntk-footer--dark & {
      color: var(--color-footer-text-muted);
    }
  }

  &__links {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: var(--space-lg);
  }

  &__link-section {
    min-width: 140px;
  }

  &__link-title {
    font-size: var(--ntk-text-sm);
    font-weight: var(--ntk-font-semibold);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin: 0 0 var(--space-md) 0;

    .ntk-footer--dark & {
      color: var(--color-text-inverse);
    }
  }

  &__link-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
  }

  &__link {
    font-size: var(--ntk-text-sm);
    text-decoration: none;
    transition: color var(--transition-fast);

    .ntk-footer--dark & {
      color: var(--color-footer-text-muted);

      &:hover {
        color: var(--color-footer-link-hover);
        text-decoration: none;
      }
    }

    .ntk-footer--light & {
      color: var(--color-text-secondary);

      &:hover {
        color: var(--color-action-primary);
        text-decoration: none;
      }
    }
  }

  &__social {
    @media (min-width: 1024px) {
      text-align: right;
    }
  }

  &__social-links {
    display: flex;
    gap: var(--space-md);

    @media (min-width: 1024px) {
      justify-content: flex-end;
    }
  }

  &__social-link {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    text-decoration: none;
    transition: all var(--transition-fast);

    .ntk-footer--dark & {
      background-color: var(--color-footer-border);
      color: var(--color-footer-text);

      &:hover {
        background-color: var(--color-footer-link);
        color: var(--color-text-inverse);
        text-decoration: none;
      }
    }

    .ntk-footer--light & {
      background-color: var(--color-bg-light);
      color: var(--color-text-secondary);

      &:hover {
        background-color: var(--color-action-primary);
        color: var(--color-text-inverse);
        text-decoration: none;
      }
    }
  }

  &__divider {
    height: 1px;
    margin: var(--space-xl) 0;

    .ntk-footer--dark & {
      background-color: var(--color-footer-border);
    }

    .ntk-footer--light & {
      background-color: var(--color-border);
    }
  }

  &__copyright {
    text-align: center;

    p {
      font-size: var(--ntk-text-sm);
      margin: 0;

      .ntk-footer--dark & {
        color: var(--color-footer-text-muted);
      }

      .ntk-footer--light & {
        color: var(--color-text-muted);
      }
    }
  }
}
</style>
