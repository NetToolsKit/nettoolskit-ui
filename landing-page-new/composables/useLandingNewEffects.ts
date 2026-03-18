import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

interface LandingNewAnimationBlueprint {
  selector: string
  type: 'fade-up' | 'fade-right' | 'fade-left' | 'zoom-in' | 'fade-in-blur' | 'reveal-center'
  delay?: number
  stagger?: number
}

export function useLandingNewEffects(sectionIds: string[]) {
  const isScrolled = ref(false)
  const isPanelOpen = ref(false)
  const activeSection = ref(sectionIds[0] ?? 'top')
  const reduceMotion = ref(false)
  const heroScrollProgress = ref(0)

  let sectionRafId: number | null = null
  let revealObserver: IntersectionObserver | null = null
  const slideshowTimers: number[] = []
  const createdDataPoints: HTMLDivElement[] = []

  const landingAnimationBlueprints: LandingNewAnimationBlueprint[] = [
    { selector: '.logo', type: 'fade-up', delay: 40 },
    { selector: '.hero-content .over-label', type: 'fade-up', delay: 90 },
    { selector: '.hero-content h1', type: 'fade-up', delay: 150 },
    { selector: '.hero-content p', type: 'fade-up', delay: 220 },
    { selector: '.hero-content .hero-cta', type: 'fade-up', delay: 290 },
    { selector: '.video-section-content .section-eyebrow', type: 'fade-left', delay: 40 },
    { selector: '.video-section-content .section-title', type: 'fade-left', delay: 90 },
    { selector: '.video-section-content .section-body', type: 'fade-left', delay: 140 },
    { selector: '.video-section-content .section-link', type: 'fade-left', delay: 190 },
    { selector: '.video-section-bg', type: 'reveal-center', delay: 120 },
    { selector: '.grand-content .section-eyebrow', type: 'fade-up', delay: 40 },
    { selector: '.grand-content h2', type: 'fade-up', delay: 90 },
    { selector: '.grand-content p', type: 'fade-up', delay: 145 },
    { selector: '.grand-content .hero-cta', type: 'fade-up', delay: 200 },
    { selector: '.section-text .section-eyebrow', type: 'fade-right', delay: 40 },
    { selector: '.section-text .section-title', type: 'fade-right', delay: 95 },
    { selector: '.section-text .section-body', type: 'fade-right', delay: 150 },
    { selector: '.section-text .section-link', type: 'fade-right', delay: 205, stagger: 50 },
    { selector: '.section-media', type: 'zoom-in', delay: 120 },
    { selector: '.footer-inner > *', type: 'fade-up', delay: 45, stagger: 80 },
  ]

  const updateScrollState = () => {
    isScrolled.value = window.scrollY > 40
  }

  const updateActiveSection = () => {
    const trigger = window.innerHeight * 0.38
    let currentActive = sectionIds[0] ?? 'top'

    for (const id of sectionIds) {
      const element = document.getElementById(id)
      if (element && element.getBoundingClientRect().top <= trigger) {
        currentActive = id
      }
    }

    activeSection.value = currentActive
  }

  const updateHeroScrollProgress = () => {
    const heroSection = document.getElementById('top')
    if (!heroSection) {
      heroScrollProgress.value = 1
      return
    }

    const totalScrollable = Math.max(heroSection.offsetHeight, 1)
    const rawProgress = window.scrollY / totalScrollable
    heroScrollProgress.value = Math.max(0, Math.min(1, rawProgress))
  }

  const scheduleSectionUpdate = () => {
    if (sectionRafId !== null) {
      return
    }

    sectionRafId = window.requestAnimationFrame(() => {
      sectionRafId = null
      updateActiveSection()
    })
  }

  const clearSlideshowTimers = () => {
    while (slideshowTimers.length > 0) {
      const timerId = slideshowTimers.pop()
      if (timerId !== undefined) {
        window.clearInterval(timerId)
        window.clearTimeout(timerId)
      }
    }
  }

  const startSlideshows = () => {
    const containers = document.querySelectorAll<HTMLElement>('.video-section-bg, .grand-bg, .section-media-inner')

    containers.forEach((container, index) => {
      const images = container.querySelectorAll<HTMLImageElement>('img')
      if (images.length < 2) {
        return
      }

      let current = 0
      const timeoutId = window.setTimeout(() => {
        const intervalId = window.setInterval(() => {
          images[current].classList.remove('slide-active')
          current = (current + 1) % images.length
          images[current].classList.add('slide-active')
        }, 6000)

        slideshowTimers.push(intervalId)
      }, index * 800)

      slideshowTimers.push(timeoutId)
    })
  }

  const setAnimatedState = (state: 'paused' | 'running') => {
    document.querySelectorAll<HTMLElement>('.holo-ring, .holo-scene, .scan-line, .data-point, .hero-body-silhouette').forEach(element => {
      element.style.animationPlayState = state
    })
  }

  const applyReduceMotion = (enabled: boolean) => {
    document.documentElement.style.setProperty('--anim-play', enabled ? 'paused' : 'running')

    if (enabled) {
      clearSlideshowTimers()
      setAnimatedState('paused')
      return
    }

    setAnimatedState('running')
    startSlideshows()
  }

  const prepareLandingAnimations = () => {
    for (const blueprint of landingAnimationBlueprints) {
      const elements = document.querySelectorAll<HTMLElement>(blueprint.selector)
      elements.forEach((element, index) => {
        element.dataset.animate = blueprint.type

        const baseDelay = blueprint.delay ?? 0
        const stagger = blueprint.stagger ?? 0
        const resolvedDelay = baseDelay + (index * stagger)
        element.style.setProperty('--animate-delay', `${resolvedDelay}ms`)
      })
    }
  }

  const setupRevealObserver = () => {
    revealObserver?.disconnect()

    revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
          entry.target.classList.add('in-view')
          return
        }

        entry.target.classList.remove('visible')
        entry.target.classList.remove('in-view')
      })
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' })

    document.querySelectorAll<HTMLElement>('.reveal, [data-animate]').forEach(element => {
      revealObserver?.observe(element)
    })
  }

  const createHeroDataPoints = () => {
    const heroCanvas = document.querySelector<HTMLElement>('.video-canvas')
    if (!heroCanvas) {
      return
    }

    for (let index = 0; index < 20; index += 1) {
      const dot = document.createElement('div')
      dot.className = 'data-point'
      dot.style.left = `${15 + (Math.random() * 70)}%`
      dot.style.top = `${10 + (Math.random() * 80)}%`
      dot.style.setProperty('--dx', `${(Math.random() * 80) - 40}px`)
      dot.style.setProperty('--dy', `${(Math.random() * 80) - 40}px`)
      dot.style.animationDuration = `${10 + (Math.random() * 10)}s`
      dot.style.animationDelay = `${-Math.random() * 14}s`

      const size = `${2 + (Math.random() * 3)}px`
      dot.style.width = size
      dot.style.height = size

      heroCanvas.appendChild(dot)
      createdDataPoints.push(dot)
    }
  }

  const openPanel = () => {
    isPanelOpen.value = true
  }

  const closePanel = () => {
    isPanelOpen.value = false
  }

  const togglePanel = () => {
    if (isPanelOpen.value) {
      closePanel()
      return
    }

    openPanel()
  }

  const onScroll = () => {
    updateScrollState()
    updateHeroScrollProgress()
    scheduleSectionUpdate()
  }

  const onResize = () => {
    updateHeroScrollProgress()
    scheduleSectionUpdate()
  }

  const onDocumentPointerDown = (event: Event) => {
    if (!isPanelOpen.value) {
      return
    }

    const target = event.target as HTMLElement | null
    if (!target) {
      return
    }

    const clickedInsidePanel = Boolean(target.closest('#sidePanel'))
    const clickedMenuButton = Boolean(target.closest('[aria-label="Menu"]'))

    if (!clickedInsidePanel && !clickedMenuButton) {
      closePanel()
    }
  }

  watch(reduceMotion, enabled => {
    applyReduceMotion(enabled)
  })

  onMounted(() => {
    updateScrollState()
    updateActiveSection()
    updateHeroScrollProgress()
    createHeroDataPoints()
    prepareLandingAnimations()
    setupRevealObserver()
    startSlideshows()

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize, { passive: true })
    document.addEventListener('pointerdown', onDocumentPointerDown)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', onResize)
    document.removeEventListener('pointerdown', onDocumentPointerDown)

    if (sectionRafId !== null) {
      window.cancelAnimationFrame(sectionRafId)
      sectionRafId = null
    }

    clearSlideshowTimers()
    revealObserver?.disconnect()
    revealObserver = null
    closePanel()

    createdDataPoints.forEach(point => point.remove())
    createdDataPoints.length = 0
  })

  return {
    activeSection,
    closePanel,
    heroScrollProgress,
    isPanelOpen,
    isScrolled,
    reduceMotion,
    togglePanel,
  }
}