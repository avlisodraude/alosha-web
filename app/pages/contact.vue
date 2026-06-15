<script setup lang="ts">
definePageMeta({ layout: 'hub' })

useSeoMeta({
  title: 'Contact — Alosha',
  description: 'Get in touch with Alosha — partnerships, early access, or open-source support.'
})

const packages = [
  {
    name: 'pixsqueeze',
    label: 'PixSqueeze',
    issues: 'https://github.com/avlisodraude/pixsqueeze/issues',
    icon: 'i-lucide-image',
  },
  {
    name: 'monitor',
    label: '@alosha/monitor',
    issues: 'https://github.com/avlisodraude/monitor/issues',
    icon: 'i-lucide-activity',
  },
  {
    name: 'stride',
    label: '@alosha/stride',
    issues: 'https://github.com/avlisodraude/stride/issues',
    icon: 'i-lucide-timer',
  },
  {
    name: 'eu-validate',
    label: '@alosha/eu-validate',
    issues: 'https://github.com/avlisodraude/eu-validate/issues',
    icon: 'i-lucide-badge-check',
  },
]
</script>

<template>
  <UPage>
    <UPageHero
      title="Get in touch"
      description="Questions, partnerships, or early access to what's coming next — reach out any time."
    />
    <UPageBody>
      <div class="max-w-2xl mx-auto space-y-10">

        <!-- General contact -->
        <div class="flex flex-col items-center text-center gap-4">
          <UButton
            to="mailto:hello@alosha.dev"
            size="lg"
            icon="i-lucide-mail"
            class="btn-grad"
          >
            hello@alosha.dev
          </UButton>
          <p class="text-sm text-muted max-w-sm">
            For partnerships, licensing, or anything that doesn't fit a GitHub issue — email is the fastest path.
          </p>
        </div>

        <UDivider />

        <!-- Early access -->
        <div class="text-center space-y-3">
          <p class="text-sm font-semibold uppercase tracking-widest text-muted">
            Early access
          </p>
          <p class="text-base">
            Interested in <strong>Monitor Cloud</strong> — hosted monitoring with a dashboard, team alerts, and uptime history?
          </p>
          <UButton
            to="mailto:hello@alosha.dev?subject=Monitor Cloud early access"
            size="md"
            variant="subtle"
            icon="i-lucide-bell"
          >
            Request early access
          </UButton>
        </div>

        <UDivider />

        <!-- Package support -->
        <div class="space-y-4">
          <p class="text-sm font-semibold uppercase tracking-widest text-muted text-center">
            Open-source support
          </p>
          <p class="text-sm text-muted text-center">
            Bug reports and feature requests belong on GitHub — that's where they get tracked and fixed.
          </p>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <UCard
              v-for="pkg in packages"
              :key="pkg.name"
              class="text-center"
            >
              <div class="flex flex-col items-center gap-3 py-2">
                <UIcon :name="pkg.icon" class="size-6 text-primary" />
                <p class="text-sm font-medium">{{ pkg.label }}</p>
                <UButton
                  :to="pkg.issues"
                  target="_blank"
                  size="xs"
                  color="neutral"
                  variant="outline"
                  icon="i-simple-icons-github"
                >
                  Open an issue
                </UButton>
              </div>
            </UCard>
          </div>
        </div>

      </div>
    </UPageBody>
  </UPage>
</template>
