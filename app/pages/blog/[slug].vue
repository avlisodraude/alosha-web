<script setup lang="ts">
definePageMeta({ layout: 'hub' })

const route = useRoute()

const { data: post } = await useAsyncData(`blog-${route.path}`, () =>
  queryCollection('blog').path(route.path).first()
)

if (!post.value) {
  throw createError({ statusCode: 404, statusMessage: 'Post not found', fatal: true })
}

const slug = computed(() => route.path.split('/').filter(Boolean).pop())
const ogImage = computed(() => `https://alosha.dev/og-blog-${slug.value}.png`)

useSeoMeta({
  title: () => `${post.value?.title} — Alosha`,
  description: () => post.value?.description,
  ogTitle: () => post.value?.title,
  ogDescription: () => post.value?.description,
  ogImage: () => ogImage.value,
  ogUrl: () => `https://alosha.dev${route.path}`,
  twitterCard: 'summary_large_image',
  twitterImage: () => ogImage.value
})

const meta = computed(() => {
  const d = formatDate(post.value?.date)
  return post.value?.author ? `${d} · ${post.value.author}` : d
})
</script>

<template>
  <UPage v-if="post">
    <UPageBody>
      <article class="max-w-2xl mx-auto">
        <UButton
          to="/blog"
          variant="link"
          color="neutral"
          size="sm"
          class="px-0 mb-6"
          icon="i-lucide-arrow-left"
        >
          All posts
        </UButton>

        <h1 class="text-3xl font-bold tracking-tight">
          {{ post.title }}
        </h1>
        <p class="text-muted mt-2">
          {{ meta }}
        </p>

        <ContentRenderer
          :value="post"
          class="prose dark:prose-invert mt-8 max-w-none"
        />
      </article>
    </UPageBody>
  </UPage>
</template>
