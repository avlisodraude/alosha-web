---
title: Website monitoring that lives in your repo
description: Most uptime tools are dashboards you log into. Monitor is a config file and two commands — real-browser checks, alerts and reports, versioned with your code.
date: 2026-06-17
author: Eduardo
---

Most website monitoring tools are someone else's dashboard. You sign up, click through a wizard, paste in some URLs, and your checks now live in a SaaS account that's disconnected from the codebase they're meant to protect. When the site changes, the checks drift, because updating them means logging into a separate place and remembering to.

**Monitor** takes the opposite approach. Your checks are a config file in your repository, and you run them with two commands. They're versioned, reviewed, and deployed exactly like the rest of your code.

## Real browsers, not just pings

A plain HTTP ping tells you the server answered. It doesn't tell you the page rendered, the JavaScript ran, or the redirect resolved where it should. Monitor uses Playwright under the hood, so each check is a real headless browser — it catches the failures a status-code check sails right past.

```ts
// monitor.config.ts
export default {
  checks: [
    { name: 'Homepage', url: 'https://yoursite.com', interval: '5m' },
    { name: 'API', url: 'https://api.yoursite.com/health', interval: '1m' },
  ],
  notify: { slack: { webhookUrl: process.env.SLACK_WEBHOOK_URL } }
}
```

```bash
npx monitor run     # once, e.g. in CI
npx monitor watch   # continuously, each check on its own interval
```

## When something breaks, you'll know what

Failures are configurable to retry before they alert, so a flaky network blip doesn't page you at 3am. When a check does fail for real, Monitor saves a full-page screenshot of the broken state and sends an alert to email, Slack, Discord, or any webhook — wherever your team already is. After every run it writes an HTML report you can open in a browser or hand to a colleague.

## Run it where you already work

Because it's just a package and a config, Monitor fits the places you already automate: a `monitor run` step in CI, a scheduled job, or a long-lived `monitor watch` process. There's a built-in scheduler, so you don't need cron or an external trigger to keep checks firing on their own intervals.

You can see what a run looks like — checks, assertions, alerts and the report — on the [live demo](https://monitor.alosha.dev/demo).

## Open source first

Monitor is MIT licensed and free on npm. A hosted version for teams who'd rather not run the `watch` process themselves is on the roadmap, but the core — the checks, the retries, the reports — stays open.

```bash
npm install -D @alosha/monitor
```
