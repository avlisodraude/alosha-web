<script setup lang="ts">
// Staggered "rise-in" scroll reveal (design handoff — package matrix).
// Wrap each grid/list item: it starts hidden below its place and rises + fades
// in when it scrolls into view, delayed by `index` for a reading-order stagger.
// Client-only work: SSR renders the final state (content is visible without JS),
// and prefers-reduced-motion skips the animation entirely.
const props = withDefaults(defineProps<{ index?: number }>(), { index: 0 })

const el = ref<HTMLElement | null>(null)
// The project's TS setup resolves two conflicting `Element` declarations, so a
// template-ref element isn't seen as assignable to IntersectionObserver.observe.
// Pin the observe target to observe's own parameter type (runtime is unaffected).
type ObserveTarget = Parameters<IntersectionObserver['observe']>[0]
const armed = ref(false) // hidden start-state applied (post-mount)
const animate = ref(false) // transition enabled (frame after arming)
const shown = ref(false)

let observer: IntersectionObserver | null = null

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  // Arm the hidden state instantly. Grids using this sit below the fold, so the
  // hide happens off-screen — no flash. The transition is enabled next frame so
  // only the reveal animates, never the initial hide.
  armed.value = true
  requestAnimationFrame(() => {
    animate.value = true
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            shown.value = true
            observer?.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.28, rootMargin: '0px 0px -8% 0px' }
    )
    if (el.value) observer.observe(el.value as unknown as ObserveTarget)
  })
})

onBeforeUnmount(() => observer?.disconnect())

const style = computed(() => {
  if (!armed.value) return undefined
  return {
    opacity: shown.value ? '1' : '0',
    transform: shown.value ? 'translateY(0)' : 'translateY(72px)',
    transition: animate.value
      ? 'opacity 1180ms ease, transform 1180ms cubic-bezier(0.2, 0.7, 0.2, 1)'
      : 'none',
    transitionDelay: `${props.index * 90}ms`
  }
})
</script>

<template>
  <div
    ref="el"
    :style="style"
  >
    <slot />
  </div>
</template>
