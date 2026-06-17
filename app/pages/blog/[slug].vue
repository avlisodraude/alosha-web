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

useJsonLd({
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  'headline': post.value?.title,
  'description': post.value?.description,
  'datePublished': post.value?.date,
  'dateModified': post.value?.date,
  'author': { '@type': 'Person', 'name': post.value?.author || 'Eduardo' },
  'publisher': {
    '@type': 'Organization',
    'name': 'Alosha',
    'logo': { '@type': 'ImageObject', 'url': 'https://alosha.dev/og.png' }
  },
  'image': ogImage.value,
  'url': `https://alosha.dev${route.path}`,
  'mainEntityOfPage': `https://alosha.dev${route.path}`
})

useBreadcrumbs([
  { name: 'Home', path: '/' },
  { name: 'Blog', path: '/blog' },
  { name: post.value?.title || 'Post' }
])

const meta = computed(() => {
  const d = formatDate(post.value?.date)
  return post.value?.author ? `${d} · ${post.value.author}` : d
})

// Adjacent posts for prev/next navigation (newest-first list).
const { data: allPosts } = await useAsyncData('blog-list-nav', () =>
  queryCollection('blog').order('date', 'DESC').all()
)
const idx = computed(() => allPosts.value?.findIndex(p => p.path === route.path) ?? -1)
const newer = computed(() => (idx.value > 0 ? allPosts.value?.[idx.value - 1] : null))
const older = computed(() => {
  const list = allPosts.value
  return list && idx.value >= 0 && idx.value < list.length - 1 ? list[idx.value + 1] : null
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

        <!-- Prev / next navigation -->
        <template v-if="newer || older">
          <USeparator class="my-12" />
          <nav class="grid grid-cols-2 gap-4">
            <NuxtLink
              v-if="newer"
              :to="newer.path"
              class="group rounded-xl border border-default p-5 transition-colors hover:border-primary/50"
            >
              <span class="inline-flex items-center gap-1 text-xs text-muted">
                <UIcon name="i-lucide-arrow-left" />
                Newer post
              </span>
              <p class="font-semibold text-highlighted mt-1 transition-colors group-hover:text-primary">
                {{ newer.title }}
              </p>
            </NuxtLink>
            <div v-else />

            <NuxtLink
              v-if="older"
              :to="older.path"
              class="group rounded-xl border border-default p-5 text-right transition-colors hover:border-primary/50"
            >
              <span class="inline-flex items-center gap-1 text-xs text-muted">
                Older post
                <UIcon name="i-lucide-arrow-right" />
              </span>
              <p class="font-semibold text-highlighted mt-1 transition-colors group-hover:text-primary">
                {{ older.title }}
              </p>
            </NuxtLink>
            <div v-else />
          </nav>
        </template>
      </article>
    </UPageBody>
  </UPage>
</template>
