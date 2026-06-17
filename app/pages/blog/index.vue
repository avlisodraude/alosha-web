<script setup lang="ts">
definePageMeta({ layout: 'hub' })

useSeoMeta({
  title: 'Blog — Alosha',
  description: 'Notes on open-source maintenance, AI-assisted development, and building products in the open.',
  ogTitle: 'Blog — Alosha',
  ogDescription: 'Notes on open-source maintenance, AI-assisted development, and building products in the open.',
  ogImage: 'https://alosha.dev/og-blog.png',
  ogUrl: 'https://alosha.dev/blog',
  twitterCard: 'summary_large_image',
  twitterImage: 'https://alosha.dev/og-blog.png'
})

useBreadcrumbs([
  { name: 'Home', path: '/' },
  { name: 'Blog' }
])

const { data: posts } = await useAsyncData('blog-list', () =>
  queryCollection('blog').order('date', 'DESC').all()
)

const meta = (post: { date: string, author?: string }) =>
  post.author ? `${formatDate(post.date)} · ${post.author}` : formatDate(post.date)
</script>

<template>
  <UPage>
    <UPageHero
      title="Blog"
      description="Notes on open-source maintenance, AI-assisted development, and building products in the open."
    />
    <UPageBody class="max-w-5xl mx-auto px-4 w-full">
      <div
        v-if="posts && posts.length"
        class="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <UPageCard
          v-for="(post, i) in posts"
          :key="post.path"
          :to="post.path"
          :title="post.title"
          :description="post.description"
          :variant="i === 0 ? 'subtle' : 'outline'"
          :class="i === 0 ? 'md:col-span-2' : ''"
          spotlight
        >
          <template #footer>
            <div class="flex items-center justify-between w-full">
              <span class="text-sm text-muted">{{ meta(post) }}</span>
              <UBadge
                v-if="i === 0"
                color="primary"
                variant="subtle"
                size="sm"
              >
                Latest
              </UBadge>
              <span
                v-else
                class="inline-flex items-center gap-1 text-sm font-medium text-primary"
              >
                Read
                <UIcon name="i-lucide-arrow-right" />
              </span>
            </div>
          </template>
        </UPageCard>
      </div>
      <div
        v-else
        class="max-w-xl mx-auto text-center text-muted"
      >
        <UIcon
          name="i-lucide-pencil-line"
          class="size-8 mx-auto mb-3"
        />
        <p>First posts are on the way. Check back soon.</p>
      </div>
    </UPageBody>
  </UPage>
</template>
