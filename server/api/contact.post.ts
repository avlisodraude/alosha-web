/**
 * Contact form handler for the alosha.dev hub.
 *
 * Accepts a POST from app/pages/contact.vue, validates + spam-checks the
 * submission, then sends it to hello@alosha.dev via the Resend HTTP API.
 * reply_to is set to the submitter so Eduardo can reply straight from Gmail.
 *
 * Spam protection is honeypot-only (no third-party): a hidden `company` field
 * that must stay empty, plus a minimum time-on-page check. Bots tend to fill
 * every field and submit instantly.
 *
 * Each valid submission is also stored in Supabase (public.contact_messages)
 * as a durable backup. That insert is best-effort: if the service key or table
 * is missing, it's logged but never blocks the email send.
 *
 * Required runtime config (see nuxt.config.ts):
 *   resendApiKey   ← NUXT_RESEND_API_KEY (a Resend "Sending" key from the Gmail account)
 *   contactTo      ← NUXT_CONTACT_TO      (default hello@alosha.dev)
 *   contactFrom    ← NUXT_CONTACT_FROM    (default "Alosha Contact <noreply@alosha.dev>")
 * Supabase backup additionally needs NUXT_SUPABASE_SECRET_KEY (sb_secret_...) in env.
 */
import { serverSupabaseServiceRole } from '#supabase/server'

interface ContactBody {
  name?: string
  email?: string
  topic?: string
  product?: string
  message?: string
  company?: string // honeypot — real users never see/fill this
  startedAt?: number // client timestamp (ms) when the form was rendered
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MAX = { name: 120, email: 200, topic: 80, product: 80, message: 5000 }
const MIN_FILL_MS = 3000 // submissions faster than this are almost certainly bots

function clean(v: unknown, max: number): string {
  return typeof v === 'string' ? v.trim().slice(0, max) : ''
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export default defineEventHandler(async (event) => {
  const body = await readBody<ContactBody>(event)
  const config = useRuntimeConfig()

  // --- Spam checks (fail silently as "success" so bots get no signal) ---
  const honeypotTripped = clean(body?.company, 200).length > 0
  const tooFast
    = typeof body?.startedAt === 'number'
      && Number.isFinite(body.startedAt)
      && Date.now() - body.startedAt < MIN_FILL_MS

  if (honeypotTripped || tooFast) {
    return { ok: true }
  }

  // --- Validation ---
  const name = clean(body?.name, MAX.name)
  const email = clean(body?.email, MAX.email)
  const topic = clean(body?.topic, MAX.topic)
  const product = clean(body?.product, MAX.product)
  const message = clean(body?.message, MAX.message)

  if (!name || !email || !message) {
    throw createError({ statusCode: 400, statusMessage: 'Name, email, and message are required.' })
  }
  if (!EMAIL_RE.test(email)) {
    throw createError({ statusCode: 400, statusMessage: 'Please enter a valid email address.' })
  }

  const apiKey = config.resendApiKey
  if (!apiKey) {
    console.error('[contact] RESEND_API_KEY is not configured')
    throw createError({ statusCode: 500, statusMessage: 'Contact form is not configured yet. Please email hello@alosha.dev directly.' })
  }

  const to = config.contactTo || 'hello@alosha.dev'
  const from = config.contactFrom || 'Alosha Contact <noreply@alosha.dev>'

  const subjectBits = [topic || 'Contact', product && product !== 'General / not sure' ? `· ${product}` : '']
    .filter(Boolean)
    .join(' ')
  const subject = `[alosha.dev] ${subjectBits} — ${name}`

  const text = [
    `New contact-form submission from alosha.dev`,
    ``,
    `Name:    ${name}`,
    `Email:   ${email}`,
    `Topic:   ${topic || '—'}`,
    `Product: ${product || '—'}`,
    ``,
    `Message:`,
    message
  ].join('\n')

  const html = `
    <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;line-height:1.5;color:#111">
      <h2 style="margin:0 0 16px">New contact-form submission</h2>
      <table style="border-collapse:collapse;font-size:14px">
        <tr><td style="padding:4px 12px 4px 0;color:#666">Name</td><td><strong>${escapeHtml(name)}</strong></td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#666">Email</td><td><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#666">Topic</td><td>${escapeHtml(topic || '—')}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#666">Product</td><td>${escapeHtml(product || '—')}</td></tr>
      </table>
      <p style="margin:16px 0 4px;color:#666;font-size:14px">Message</p>
      <div style="white-space:pre-wrap;background:#f6f6f6;border-radius:8px;padding:12px;font-size:14px">${escapeHtml(message)}</div>
    </div>`

  // --- Durable backup in Supabase (best-effort; never blocks the email) ---
  try {
    const db = serverSupabaseServiceRole(event)
    const { error: dbErr } = await db.from('contact_messages').insert({
      name,
      email,
      topic: topic || null,
      product: product || null,
      message,
      user_agent: getHeader(event, 'user-agent') || null,
      ip: getRequestIP(event, { xForwardedFor: true }) || null
    })
    if (dbErr) console.error('[contact] Supabase insert failed:', dbErr.message)
  } catch (err) {
    console.error('[contact] Supabase backup skipped:', err)
  }

  try {
    await $fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: { from, to, reply_to: email, subject, text, html }
    })
  } catch (err) {
    console.error('[contact] Resend send failed:', err)
    throw createError({ statusCode: 502, statusMessage: 'Could not send your message right now. Please email hello@alosha.dev directly.' })
  }

  return { ok: true }
})
