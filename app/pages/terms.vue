<script setup lang="ts">
definePageMeta({ layout: 'hub' })

useSeoMeta({
  title: 'Terms of Service — Alosha',
  description: 'The terms that govern your use of the alosha.dev website, the PixSqueeze service, and Alosha paid plans.',
  ogImage: 'https://alosha.dev/og.png',
  twitterImage: 'https://alosha.dev/og.png'
})

// Update this whenever the terms materially change.
const lastUpdated = '17 June 2026'
</script>

<template>
  <UPage>
    <UPageHero
      title="Terms of Service"
      description="The terms that govern your use of our website and paid services."
      :ui="{ container: 'py-12 sm:py-16 lg:py-20' }"
    />
    <UPageBody>
      <article class="max-w-2xl mx-auto space-y-10 text-default leading-relaxed">
        <p class="text-sm text-muted">
          Last updated: {{ lastUpdated }}
        </p>

        <section class="space-y-3">
          <p class="text-lg text-highlighted font-medium">
            These terms ("Terms") govern your use of the alosha.dev website (the "Site") and our
            paid services, including the PixSqueeze API (the "Service"). By using the Site or the
            Service, you agree to them.
          </p>
          <p class="text-muted">
            Our open-source packages are provided under their own separate licenses, stated in each
            repository. Those licenses — not these Terms — govern your use of that code.
          </p>
        </section>

        <section class="space-y-3">
          <h2 class="text-xl font-bold text-highlighted">
            1. Who we are
          </h2>
          <p>
            The Site and Service are operated by <strong>[Legal name]</strong>, trading as
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
            3. Accounts
          </h2>
          <p>
            Some features require an account. You must provide accurate information, keep your
            credentials and API keys confidential, and you are responsible for all activity under
            your account. Tell us promptly at
            <ULink
              to="mailto:hello@alosha.dev"
              class="text-primary"
            >hello@alosha.dev</ULink>
            if you suspect unauthorised use. You must be at least 18, or have the authority to enter
            into these Terms on behalf of an organisation.
          </p>
        </section>

        <section class="space-y-3">
          <h2 class="text-xl font-bold text-highlighted">
            4. Plans, fees and billing
          </h2>
          <ul class="list-disc pl-6 space-y-2">
            <li>
              Paid plans are billed in advance on a recurring basis (the "Billing Cycle"
              <span class="text-muted">[e.g. monthly / annually]</span>) at the prices shown at
              sign-up. <span class="text-muted">[Insert plan names and prices, or link to the pricing page.]</span>
            </li>
            <li>
              Payments are processed by <strong>Stripe</strong>; by subscribing you also agree to
              Stripe's terms. We do not store your full card details.
            </li>
            <li>
              Unless stated otherwise, prices are exclusive of VAT/BTW, which is added where
              applicable.
            </li>
            <li>
              Paid plans renew automatically at the end of each Billing Cycle until cancelled. We
              may change prices or plan features with reasonable advance notice; changes take effect
              from your next Billing Cycle.
            </li>
            <li>
              If a payment fails, we may suspend or downgrade access to paid features until the
              amount due is settled.
            </li>
          </ul>
        </section>

        <section class="space-y-3">
          <h2 class="text-xl font-bold text-highlighted">
            5. Cancellation and refunds
          </h2>
          <p>
            You can cancel a paid plan at any time from your account; cancellation takes effect at
            the end of the current Billing Cycle, and you keep access until then. We do not provide
            pro-rata refunds for partial periods unless required by law.
            <span class="text-muted">[State your refund policy here — e.g. no refunds, or a 14-day money-back guarantee.]</span>
          </p>
          <p>
            If you are a consumer in the EU, you normally have a 14-day right of withdrawal for
            digital services. By starting to use a paid Service within that period you may ask us to
            begin immediately and acknowledge that you lose the right of withdrawal once the Service
            has been fully performed.
          </p>
        </section>

        <section class="space-y-3">
          <h2 class="text-xl font-bold text-highlighted">
            6. Acceptable use of the Service
          </h2>
          <p>When using the Service or API, you agree not to:</p>
          <ul class="list-disc pl-6 space-y-2">
            <li>use it for unlawful, infringing, or harmful content, or to process content you have no right to;</li>
            <li>exceed the rate limits or usage allowances of your plan, or circumvent technical restrictions;</li>
            <li>resell or expose the Service to third parties as your own service without our written agreement;</li>
            <li>attempt to disrupt, reverse-engineer, probe, or gain unauthorised access to the Service or its infrastructure.</li>
          </ul>
          <p>
            We may suspend or terminate access for serious or repeated breaches, ideally with
            notice, but immediately where needed to protect the Service or other users.
          </p>
        </section>

        <section class="space-y-3">
          <h2 class="text-xl font-bold text-highlighted">
            7. Service availability
          </h2>
          <p>
            We work to keep the Service available and reliable, but we do not guarantee uninterrupted
            or error-free operation, and we may perform maintenance or change features over time.
            Free tiers are provided without any availability commitment.
            <span class="text-muted">[If you offer a paid SLA, describe or link it here.]</span>
          </p>
        </section>

        <section class="space-y-3">
          <h2 class="text-xl font-bold text-highlighted">
            8. Intellectual property
          </h2>
          <p>
            The content, design, branding and "Alosha" name on this Site are owned by us or our
            licensors and are protected by intellectual-property law. You may not copy or reuse them
            beyond normal personal browsing without our permission. You retain ownership of the
            content you submit to the Service; you grant us only the limited rights needed to operate
            the Service for you.
          </p>
          <p>
            Our open-source packages are an exception: each is licensed under the terms stated in its
            own repository, and those licenses govern your use of the code.
          </p>
        </section>

        <section class="space-y-3">
          <h2 class="text-xl font-bold text-highlighted">
            9. Links to other sites
          </h2>
          <p>
            The Site links to third-party sites and services (such as our product subdomains, npm and
            GitHub). We are not responsible for the content or practices of sites we do not operate;
            their own terms and policies apply.
          </p>
        </section>

        <section class="space-y-3">
          <h2 class="text-xl font-bold text-highlighted">
            10. No warranty
          </h2>
          <p>
            The Site and Service are provided "as is" and "as available", without warranties of any
            kind. We do not guarantee that they will be uninterrupted, error-free, or that the
            information on them is complete or current.
          </p>
        </section>

        <section class="space-y-3">
          <h2 class="text-xl font-bold text-highlighted">
            11. Limitation of liability
          </h2>
          <p>
            To the fullest extent permitted by law, we are not liable for any indirect or
            consequential loss, lost profits, or lost data arising from your use of, or inability to
            use, the Site or Service. Where we are liable, our total liability is limited to the
            amount you paid us for the Service in the 12 months before the claim. Nothing in these
            Terms limits liability that cannot be limited under Dutch law.
          </p>
        </section>

        <section class="space-y-3">
          <h2 class="text-xl font-bold text-highlighted">
            12. Changes
          </h2>
          <p>
            We may update these Terms from time to time. The "last updated" date above shows when
            they last changed, and continued use of the Site or Service means you accept the current
            version.
          </p>
        </section>

        <section class="space-y-3">
          <h2 class="text-xl font-bold text-highlighted">
            13. Governing law
          </h2>
          <p>
            These Terms are governed by the laws of the Netherlands, and any disputes will be subject
            to the jurisdiction of the competent Dutch courts. Mandatory consumer-protection rights
            in your country of residence are unaffected.
          </p>
        </section>
      </article>
    </UPageBody>
  </UPage>
</template>
