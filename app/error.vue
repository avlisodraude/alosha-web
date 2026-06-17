<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()

const isNotFound = computed(() => props.error?.statusCode === 404)

useSeoMeta({
  title: () => (isNotFound.value ? 'Page not found — Alosha' : 'Something went wrong — Alosha'),
  robots: 'noindex'
})

// In an error state, normal links don't reset the error boundary — clearError does.
function goTo(path: string) {
  clearError({ redirect: path })
}
</script>

<template>
  <NuxtLayout name="hub">
    <UPage>
      <UPageHero
        :title="isNotFound ? '404 — Page not found' : 'Something went wrong'"
        :description="isNotFound
          ? 'The page you’re looking for doesn’t exist or may have moved.'
          : 'An unexpected error occurred. Please try again, or head back home.'"
        :ui="{ container: 'py-16 sm:py-24 lg:py-32' }"
      >
        <template #links>
          <UButton
            size="xl"
            class="btn-grad"
            @click="goTo('/')"
          >
            Back to home
          </UButton>
          <UButton
            size="xl"
            color="neutral"
            variant="subtle"
            @click="goTo('/products')"
          >
            Browse products
          </UButton>
        </template>
      </UPageHero>

      <UPageBody>
        <p class="text-center text-muted">
          Lost? Try the
          <ULink
            class="text-primary"
            @click="goTo('/blog')"
          >blog</ULink>
          or
          <ULink
            class="text-primary"
            @click="goTo('/contact')"
          >get in touch</ULink>.
        </p>
      </UPageBody>
    </UPage>
  </NuxtLayout>
</template>
