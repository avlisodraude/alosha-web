<script setup lang="ts">
definePageMeta({ layout: 'hub' })

useSeoMeta({
  title: 'Terms of Use — Alosha',
  description: 'The terms that govern your use of the alosha.dev website and its content.',
  ogImage: 'https://alosha.dev/og.png',
  twitterImage: 'https://alosha.dev/og.png'
})

// Update this whenever the terms materially change.
const lastUpdated = '17 June 2026'
</script>

<template>
  <UPage>
    <UPageHero
      title="Terms of Use"
      description="The terms that govern your use of this website."
      :ui="{ container: 'py-12 sm:py-16 lg:py-20' }"
    />
    <UPageBody>
      <article class="max-w-2xl mx-auto space-y-10 text-default leading-relaxed">
        <p class="text-sm text-muted">
          Last updated: {{ lastUpdated }}
        </p>

        <section class="space-y-3">
          <p class="text-lg text-highlighted font-medium">
            These terms govern your use of the alosha.dev website (the "Site"). By using the Site,
            you agree to them.
          </p>
          <p class="text-muted">
            Our products (such as the PixSqueeze API) and our open-source packages are provided
            under their own separate terms and licenses. These Site terms do not replace those.
          </p>
        </section>

        <section class="space-y-3">
          <h2 class="text-xl font-bold text-highlighted">
            1. Who we are
          </h2>
          <p>
            The Site is operated by <strong>[Legal name]</strong>, trading as
            <strong>Alosha</strong> ("Alosha", "we", "us"), based in the Netherlands.
            <span class="text-muted">[KvK number: to be added] · [VAT/BTW number: to be added]</span>
            You can reach us at
            <ULink
              to="mailto:hello@alosha.dev"
              class="text-primary"
            >hello@alosha.dev</ULink>.
          </p>
        </section>

        <section class="space-y-3">
          <h2 class="text-xl font-bold text-highlighted">
            2. Using the Site
          </h2>
          <p>
            You may browse and use the Site for lawful purposes. You agree not to misuse it — for
            example by attempting to disrupt or gain unauthorised access to it, scraping it in a way
            that places an unreasonable load on our infrastructure, or using it to break the law or
            infringe someone else's rights.
          </p>
        </section>

        <section class="space-y-3">
          <h2 class="text-xl font-bold text-highlighted">
            3. Intellectual property
          </h2>
          <p>
            The content, design, branding and "Alosha" name on this Site are owned by us or our
            licensors and are protected by intellectual-property law. You may not copy or reuse them
            beyond normal personal browsing without our permission.
          </p>
          <p>
            Our open-source packages are an exception: each is licensed under the terms stated in
            its own repository, and those licenses govern your use of the code.
          </p>
        </section>

        <section class="space-y-3">
          <h2 class="text-xl font-bold text-highlighted">
            4. Links to other sites
          </h2>
          <p>
            The Site links to third-party sites and services (such as our product subdomains, npm
            and GitHub). We are not responsible for the content or practices of sites we do not
            operate; their own terms and policies apply.
          </p>
        </section>

        <section class="space-y-3">
          <h2 class="text-xl font-bold text-highlighted">
            5. No warranty
          </h2>
          <p>
            The Site is provided "as is" and "as available", without warranties of any kind. We do
            not guarantee that it will be uninterrupted, error-free, or that the information on it is
            complete or current.
          </p>
        </section>

        <section class="space-y-3">
          <h2 class="text-xl font-bold text-highlighted">
            6. Limitation of liability
          </h2>
          <p>
            To the fullest extent permitted by law, we are not liable for any indirect or
            consequential loss arising from your use of, or inability to use, the Site. Nothing in
            these terms limits liability that cannot be limited under Dutch law.
          </p>
        </section>

        <section class="space-y-3">
          <h2 class="text-xl font-bold text-highlighted">
            7. Changes
          </h2>
          <p>
            We may update these terms from time to time. The "last updated" date above shows when
            they last changed, and continued use of the Site means you accept the current version.
          </p>
        </section>

        <section class="space-y-3">
          <h2 class="text-xl font-bold text-highlighted">
            8. Governing law
          </h2>
          <p>
            These terms are governed by the laws of the Netherlands, and any disputes will be
            subject to the jurisdiction of the competent Dutch courts.
          </p>
        </section>
      </article>
    </UPageBody>
  </UPage>
</template>
