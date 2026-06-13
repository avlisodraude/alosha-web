<script setup lang="ts">
definePageMeta({ layout: 'hub' })

useSeoMeta({
  title: 'Blog — Alosha',
  description: 'Notes on open-source maintenance, AI-assisted development, and building products in the open.'
})

const { data: posts } = await useAsyncData('blog-list', () =>
  queryCollection('blog').order('date', 'DESC').all()
)
</script>

<template>
  <UPage>
    <UPageHero
      title="Blog"
      description="Notes on open-source maintenance, AI-assisted development, and building products in the open."
    />
    <UPageBody>
      <div
        v-if="posts && posts.length"
        class="space-y-4 max-w-2xl mx-auto"
      >
        <UPageCard
          v-for="post in posts"
          :key="post.path"
          :title="post.title"
          :description="post.description"
          :to="post.path"
          spotlight
        >
          <template #footer>
            <span class="text-sm text-muted">{{ formatDate(post.date) }}</span>
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
