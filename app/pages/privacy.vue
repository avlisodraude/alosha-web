<script setup lang="ts">
definePageMeta({ layout: 'hub' })

useSeoMeta({
  title: 'Privacy Policy — Alosha',
  description: 'How Alosha collects, uses and protects personal data across alosha.dev and its products, and the rights you have under the GDPR.',
  ogImage: 'https://alosha.dev/og.png',
  twitterImage: 'https://alosha.dev/og.png'
})

// Update this whenever the policy materially changes.
const lastUpdated = '17 June 2026'
</script>

<template>
  <UPage>
    <UPageHero
      title="Privacy Policy"
      description="How we handle your personal data, and the rights you have over it."
      :ui="{ container: 'py-12 sm:py-16 lg:py-20' }"
    />
    <UPageBody>
      <article class="max-w-2xl mx-auto space-y-10 text-default leading-relaxed">
        <p class="text-sm text-muted">
          Last updated: {{ lastUpdated }}
        </p>

        <section class="space-y-3">
          <p class="text-lg text-highlighted font-medium">
            This policy explains what personal data Alosha collects, why we collect it, who we
            share it with, and the rights you have under the EU General Data Protection Regulation
            (GDPR).
          </p>
          <p>
            We keep data collection to the minimum needed to run our website and products. We do
            not sell personal data, and we do not use it for advertising.
          </p>
        </section>

        <section class="space-y-3">
          <h2 class="text-xl font-bold text-highlighted">
            1. Who we are
          </h2>
          <p>
            The data controller is <strong>[Legal name]</strong>, operating as
            <strong>Alosha</strong> ("Alosha", "we", "us"), based in the Netherlands.
            <span class="text-muted">[KvK number: to be added] · [VAT/BTW number: to be added]</span>
          </p>
          <p>
            For any privacy question or request, contact us at
            <ULink
              to="mailto:hello@alosha.dev"
              class="text-primary"
            >hello@alosha.dev</ULink>.
          </p>
        </section>

        <section class="space-y-3">
          <h2 class="text-xl font-bold text-highlighted">
            2. What data we collect
          </h2>
          <p>We collect personal data only in specific, limited situations:</p>
          <ul class="list-disc pl-6 space-y-2">
            <li>
              <strong>When you use the contact form:</strong> your name, email address, the topic
              and product you select, and your message. For spam prevention and security we also
              record the submission's IP address and browser user-agent.
            </li>
            <li>
              <strong>When you create a PixSqueeze account:</strong> your email address and
              authentication details, handled by our authentication provider, plus any API usage
              data needed to operate the service.
            </li>
            <li>
              <strong>When you pay for a paid plan:</strong> billing is handled by our payment
              processor. We receive limited details (such as your plan, billing status and the last
              four digits of a card) but never your full card number.
            </li>
            <li>
              <strong>When you visit the site:</strong> aggregated, privacy-friendly analytics that
              do not use cookies and do not identify you individually.
            </li>
          </ul>
        </section>

        <section class="space-y-3">
          <h2 class="text-xl font-bold text-highlighted">
            3. Why we use it, and our legal basis
          </h2>
          <ul class="list-disc pl-6 space-y-2">
            <li>
              <strong>To answer your enquiries</strong> sent through the contact form — on the basis
              of our legitimate interest in responding to you, and to take steps at your request.
            </li>
            <li>
              <strong>To provide and secure our products</strong> (accounts, API access, fraud and
              abuse prevention) — to perform our contract with you and pursue our legitimate
              interest in keeping the service secure.
            </li>
            <li>
              <strong>To process payments and meet legal obligations</strong> such as tax and
              accounting — to perform our contract and comply with the law.
            </li>
            <li>
              <strong>To understand and improve the site</strong> through aggregated analytics — on
              the basis of our legitimate interest in a well-functioning website.
            </li>
          </ul>
        </section>

        <section class="space-y-3">
          <h2 class="text-xl font-bold text-highlighted">
            4. Service providers we share data with
          </h2>
          <p>
            We use a small number of trusted processors to run the site and products. They only
            process data on our instructions:
          </p>
          <ul class="list-disc pl-6 space-y-2">
            <li><strong>Vercel</strong> — website and application hosting, and cookieless analytics.</li>
            <li><strong>Cloudflare</strong> — DNS, security and email routing for our domains.</li>
            <li><strong>Supabase</strong> — database and authentication (account data and a backup copy of contact-form messages).</li>
            <li><strong>Resend</strong> — delivery of contact-form messages and transactional email.</li>
            <li><strong>Stripe</strong> — payment processing for paid PixSqueeze plans.</li>
          </ul>
          <p>
            Where a provider processes data outside the European Economic Area, that transfer is
            covered by appropriate safeguards such as the EU Standard Contractual Clauses.
          </p>
        </section>

        <section class="space-y-3">
          <h2 class="text-xl font-bold text-highlighted">
            5. How long we keep it
          </h2>
          <p>
            We retain personal data only as long as needed for the purpose it was collected, or as
            required by law. Contact-form messages are kept while relevant to our correspondence and
            then deleted; account data is kept for the life of your account; and billing records are
            kept for the period required by Dutch tax law.
          </p>
        </section>

        <section class="space-y-3">
          <h2 class="text-xl font-bold text-highlighted">
            6. Your rights
          </h2>
          <p>Under the GDPR you have the right to:</p>
          <ul class="list-disc pl-6 space-y-2">
            <li>access the personal data we hold about you;</li>
            <li>have inaccurate data corrected, or incomplete data completed;</li>
            <li>have your data erased, where there is no overriding reason to keep it;</li>
            <li>restrict or object to certain processing;</li>
            <li>receive your data in a portable format; and</li>
            <li>withdraw consent at any time, where processing is based on consent.</li>
          </ul>
          <p>
            To exercise any of these, email
            <ULink
              to="mailto:hello@alosha.dev"
              class="text-primary"
            >hello@alosha.dev</ULink>. You also have the right to lodge a complaint with the Dutch
            Data Protection Authority (Autoriteit Persoonsgegevens).
          </p>
        </section>

        <section class="space-y-3">
          <h2 class="text-xl font-bold text-highlighted">
            7. Cookies
          </h2>
          <p>
            Our marketing site does not set advertising or tracking cookies, and our analytics are
            cookieless. Strictly necessary cookies may be used to keep you signed in to a PixSqueeze
            account; these are required for the service to function.
          </p>
        </section>

        <section class="space-y-3">
          <h2 class="text-xl font-bold text-highlighted">
            8. Changes to this policy
          </h2>
          <p>
            We may update this policy from time to time. When we do, we will revise the "last
            updated" date above, and significant changes will be communicated where appropriate.
          </p>
        </section>
      </article>
    </UPageBody>
  </UPage>
</template>
