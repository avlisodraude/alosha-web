<script setup lang="ts">
// "How we build" — three split image/text panels telling the
// open-source → trust → product arc. Design handoff from Claude Design:
// a self-contained editorial band with its own type scale and palette.
// Hover styling is pure CSS; only the scroll-reveal (per-panel fade + slide)
// needs JS, so it lives in the onMounted listener below.
import openSourceImg from '~/assets/images/how-we-build/open-source.webp'
import trustImg from '~/assets/images/how-we-build/trust.webp'
import productImg from '~/assets/images/how-we-build/product.webp'

interface Panel {
  n: string
  step: string
  title: string
  img: string
  desc: string
  detail: string
  side: 'left' | 'right'
}

const panels: Panel[] = [
  {
    n: '01',
    step: 'Step one',
    title: 'Open source',
    img: openSourceImg,
    desc: 'We find a useful but underserved open-source project, improve it, and ship it in the open under a permissive license.',
    detail: 'Contribute upstream or fork and rebrand — everything ships under MIT/Apache so anyone can build on it.',
    side: 'left'
  },
  {
    n: '02',
    step: 'Step two',
    title: 'Trust',
    img: trustImg,
    desc: 'Developers adopt it, file issues, and star it. Credibility compounds in public — no marketing required.',
    detail: 'Stars, issues, and real usage are the proof. A public record replaces a sales team.',
    side: 'right'
  },
  {
    n: '03',
    step: 'Step three',
    title: 'Product',
    img: productImg,
    desc: 'A hosted service or premium tier turns that trust into a sustainable product, while the core stays free.',
    detail: 'Hosting, a managed dashboard, or a pro tier — priced for teams. The open core never disappears.',
    side: 'left'
  }
]

// Scroll reveal: per-panel progress 0→1 as it crosses viewportHeight * 0.8.
// SSR renders every panel fully visible (reveal only kicks in once mounted),
// so the section is complete without JS and never flashes empty.
const revs = ref<number[]>(panels.map(() => 1))
const ready = ref(false)
const panelEls: (HTMLElement | null)[] = []

function setPanel(el: Element | ComponentPublicInstance | null, i: number) {
  panelEls[i] = (el as HTMLElement) ?? null
}

function panelStyle(i: number, side: Panel['side']) {
  if (!ready.value) return undefined
  const p = revs.value[i] ?? 1
  const dir = side === 'left' ? -48 : 48
  return {
    opacity: String(p),
    transform: `translateX(${((1 - p) * dir).toFixed(1)}px)`
  }
}

let frame = 0
function compute() {
  const vh = window.innerHeight
  const line = vh * 0.8
  const next = panelEls.map((el) => {
    if (!el) return 1
    const top = el.getBoundingClientRect().top
    return Math.min(Math.max((line - top) / (vh * 0.34), 0), 1)
  })
  if (next.some((v, i) => v !== revs.value[i])) revs.value = next
}

function onScroll() {
  if (frame) return
  frame = requestAnimationFrame(() => {
    frame = 0
    compute()
  })
}

onMounted(() => {
  // Respect reduced-motion: skip the slide-in entirely, leave panels visible.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  ready.value = true
  compute()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onScroll)
  if (frame) cancelAnimationFrame(frame)
})
</script>

<template>
  <section class="hwb">
    <!-- Intro -->
    <div class="hwb-intro">
      <div class="hwb-eyebrow">
        <span class="hwb-wordmark">Alosha<span class="hwb-accent">®</span></span>
        <span class="hwb-label">How we build</span>
      </div>
      <h2 class="hwb-h1">
        Open source first, <em>commercial</em> where it counts.
      </h2>
      <p class="hwb-subhead">
        Three steps, one arc — from a permissively-licensed core to a sustainable
        product, without ever closing the source.
      </p>
    </div>

    <!-- Split panels -->
    <div class="hwb-panels">
      <article
        v-for="(p, i) in panels"
        :key="p.n"
        :ref="el => setPanel(el, i)"
        class="hwb-panel"
        :class="`hwb-panel--${p.side}`"
        :style="panelStyle(i, p.side)"
      >
        <div class="hwb-media">
          <div class="hwb-media-inner">
            <img
              :src="p.img"
              :alt="`${p.title} — step ${p.n}`"
              loading="lazy"
              decoding="async"
            >
          </div>
          <div class="hwb-scrim" />
          <span class="hwb-num">{{ p.n }}</span>
        </div>
        <div class="hwb-text">
          <span class="hwb-step">{{ p.step }}</span>
          <h3 class="hwb-title">
            {{ p.title }}
          </h3>
          <p class="hwb-desc">
            {{ p.desc }}
          </p>
          <div class="hwb-detail">
            <div class="hwb-detail-inner">
              <span class="hwb-dot" />
              <p class="hwb-detail-text">
                {{ p.detail }}
              </p>
            </div>
          </div>
        </div>
      </article>
    </div>

    <!-- Outro -->
    <div class="hwb-outro">
      <p class="hwb-outro-line">
        The core stays free, forever. That's the deal.
      </p>
      <NuxtLink
        to="/products"
        class="hwb-cta"
      >
        Explore products →
      </NuxtLink>
    </div>
  </section>
</template>

<style scoped>
.hwb {
  /* Editorial palette (design handoff). The section no longer paints its own
     background band — it inherits the site canvas (warm off-white in light,
     --ui-bg in dark); only the panels/type/borders are themed here. */
  --hwb-panel: #ffffff;
  --hwb-border: #d4dccb;
  --hwb-ink: #20241c;
  --hwb-body: #535a4b;
  --hwb-muted: #6d7563;
  --hwb-rule: #e2e6da;
  --hwb-eyebrow-muted: #8f8e86;
  --hwb-accent: #16a34a;
  --hwb-shadow: 0 24px 54px -26px rgba(22, 163, 74, 0.34);
  --hwb-ease: cubic-bezier(0.2, 0.7, 0.2, 1);

  color: var(--hwb-ink);
  font-family: 'Archivo', sans-serif;
}

:global(html.dark .hwb) {
  --hwb-panel: #141613;
  --hwb-border: #2a2f26;
  --hwb-ink: #f2f4ee;
  --hwb-body: #b9c0b1;
  --hwb-muted: #949a8c;
  --hwb-rule: #2a2f26;
  --hwb-eyebrow-muted: #8a9082;
  --hwb-accent: #22c55e;
}

/* Intro ------------------------------------------------------------------ */
.hwb-intro {
  max-width: 1120px;
  margin: 0 auto;
  padding: 100px 48px 44px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.hwb-eyebrow {
  display: flex;
  align-items: center;
  gap: 14px;
}

.hwb-wordmark {
  font-weight: 800;
  font-size: 20px;
  letter-spacing: -0.01em;
}

.hwb-accent {
  color: var(--hwb-accent);
}

.hwb-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--hwb-eyebrow-muted);
}

.hwb-h1 {
  margin: 0;
  font-family: 'Instrument Serif', serif;
  font-weight: 400;
  font-size: 60px;
  line-height: 1.02;
  letter-spacing: -0.01em;
  max-width: 720px;
}

.hwb-h1 em {
  font-style: italic;
  color: var(--hwb-accent);
}

.hwb-subhead {
  margin: 0;
  font-size: 18px;
  line-height: 1.55;
  color: var(--hwb-body);
  max-width: 560px;
}

/* Panels ----------------------------------------------------------------- */
.hwb-panels {
  max-width: 1120px;
  margin: 0 auto;
  padding: 8px 48px 120px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.hwb-panel {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 300px;
  background: var(--hwb-panel);
  border: 1px solid var(--hwb-border);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0);
  transition:
    opacity 0.6s ease,
    transform 0.6s var(--hwb-ease),
    box-shadow 0.4s ease,
    border-color 0.4s ease;
}

/* Alternating sides: right-image panels swap column order. */
.hwb-panel--right .hwb-media {
  order: 2;
}

.hwb-panel:hover {
  border-color: var(--hwb-accent);
  box-shadow: var(--hwb-shadow);
}

/* Image half */
.hwb-media {
  position: relative;
  overflow: hidden;
  min-height: 220px;
}

.hwb-media-inner {
  position: absolute;
  inset: 0;
  transition: transform 0.6s var(--hwb-ease);
}

.hwb-panel:hover .hwb-media-inner {
  transform: scale(1.06);
}

.hwb-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.hwb-scrim {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(21, 26, 18, 0.12), rgba(21, 26, 18, 0.34));
  pointer-events: none;
}

.hwb-num {
  position: absolute;
  top: 22px;
  left: 22px;
  font-family: 'Instrument Serif', serif;
  font-size: 64px;
  line-height: 0.7;
  color: rgba(255, 255, 255, 0.75);
  transition: color 0.4s ease;
  pointer-events: none;
}

.hwb-panel:hover .hwb-num {
  color: rgba(255, 255, 255, 0.95);
}

/* Text half */
.hwb-text {
  padding: 44px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.hwb-step {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--hwb-accent);
}

.hwb-title {
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 600;
  font-size: 30px;
  letter-spacing: -0.01em;
  margin: 10px 0;
  color: var(--hwb-ink);
}

.hwb-desc {
  margin: 0;
  font-size: 16px;
  line-height: 1.6;
  color: var(--hwb-body);
}

/* Hover-reveal detail */
.hwb-detail {
  overflow: hidden;
  max-height: 0;
  opacity: 0;
  transition:
    max-height 0.4s ease,
    opacity 0.4s ease;
}

.hwb-panel:hover .hwb-detail {
  max-height: 120px;
  opacity: 1;
}

.hwb-detail-inner {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  margin-top: 18px;
  padding-top: 16px;
  border-top: 1px solid var(--hwb-rule);
}

.hwb-dot {
  flex: 0 0 auto;
  width: 6px;
  height: 6px;
  margin-top: 7px;
  border-radius: 50%;
  background: var(--hwb-accent);
}

.hwb-detail-text {
  margin: 0;
  font-size: 13px;
  line-height: 1.55;
  color: var(--hwb-muted);
}

/* Outro ------------------------------------------------------------------ */
.hwb-outro {
  max-width: 1120px;
  margin: 0 auto;
  padding: 0 48px 140px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 24px;
}

.hwb-outro-line {
  margin: 0;
  font-family: 'Instrument Serif', serif;
  font-size: 30px;
  line-height: 1.15;
  max-width: 520px;
}

.hwb-cta {
  font-weight: 600;
  font-size: 16px;
  color: #fff;
  background: var(--hwb-accent);
  padding: 15px 28px;
  border-radius: 2px;
  text-decoration: none;
  transition: background 0.2s ease;
}

.hwb-cta:hover {
  background: color-mix(in srgb, var(--hwb-accent) 82%, black);
}

/* Responsive: stack each panel to one column, dial back the intro type. */
@media (max-width: 860px) {
  .hwb-intro {
    padding: 72px 24px 32px;
  }

  .hwb-h1 {
    font-size: 40px;
  }

  .hwb-subhead {
    font-size: 16px;
  }

  .hwb-panels {
    padding: 8px 24px 80px;
  }

  .hwb-panel {
    grid-template-columns: 1fr;
  }

  /* Image always on top when stacked, regardless of alternating side. */
  .hwb-panel--right .hwb-media {
    order: 0;
  }

  .hwb-media {
    min-height: 200px;
    aspect-ratio: 3 / 2;
  }

  .hwb-text {
    padding: 32px 28px;
  }

  .hwb-outro {
    padding: 0 24px 96px;
  }

  .hwb-outro-line {
    font-size: 26px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hwb-panel,
  .hwb-media-inner,
  .hwb-num,
  .hwb-detail,
  .hwb-cta {
    transition: none;
  }
}
</style>
