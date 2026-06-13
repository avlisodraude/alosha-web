<script setup lang="ts">
definePageMeta({ layout: 'hub' })

useSeoMeta({
  title: 'Contact — Alosha',
  description: 'Get in touch with Alosha.'
})
</script>

<template>
  <UPage>
    <UPageHero
      title="Contact"
      description="Questions, partnerships, or early access to upcoming products?"
    />
    <UPageBody>
      <div class="max-w-xl mx-auto text-center">
        <UButton
          to="mailto:hello@alosha.dev"
          size="lg"
          icon="i-lucide-mail"
          class="btn-grad"
        >
          hello@alosha.dev
        </UButton>
        <p class="text-sm text-muted mt-4">
          For PixSqueeze support, open an issue on
          <ULink
            to="https://github.com/avlisodraude/pixsqueeze/issues"
            target="_blank"
          >GitHub</ULink>.
        </p>
      </div>
    </UPageBody>
  </UPage>
</template>
