import { useState, type FormEvent } from 'react'
import { site } from '../data/content'
type State = { kind: 'idle' | 'ok' | 'error' | 'info'; msg: string }
export default function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [s, setS] = useState<State>({ kind: 'idle', msg: '' })
  async function submit(e: FormEvent) {
    e.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return setS({ kind: 'error', msg: 'Enter a valid email address, like name@example.com.' })
    if (!site.newsletterEndpoint) return setS({ kind: 'info', msg: 'Subscriptions are not connected yet, so your email has not been saved. Set newsletterEndpoint in src/data/content.ts.' })
    try {
      const r = await fetch(site.newsletterEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) })
      if (!r.ok) throw new Error()
      setS({ kind: 'ok', msg: 'You are subscribed.' }); setEmail('')
    } catch { setS({ kind: 'error', msg: 'We could not subscribe you. Please try again later.' }) }
  }
  const color = s.kind === 'ok' ? 'text-emerald-300' : s.kind === 'error' ? 'text-red-300' : 'text-gold-light'
  return (
    <section id="newsletter" className="bg-navy-900 py-24 text-white">
      <div id="contact" className="container-x mx-auto max-w-3xl text-center">
        <h2 className="h2">Be Part of the Next Big Conversation</h2>
        <p className="mt-4 text-white/75">Stay informed about upcoming conferences, speaker opportunities, and industry insights.</p>
        <form onSubmit={submit} noValidate className="mx-auto mt-9 flex max-w-xl flex-col gap-3 sm:flex-row">
          <label htmlFor="nl-email" className="sr-only">Email address</label>
          <input id="nl-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email address" className="min-h-[48px] flex-1 rounded-full bg-white/10 px-6 text-white placeholder-white/50 outline-none ring-1 ring-white/20 focus:ring-gold" />
          <button className="btn btn-gold">Subscribe</button>
        </form>
        <p role="status" className={`mt-4 min-h-[1.5rem] text-sm ${color}`}>{s.msg}</p>
        <p className="mt-6 text-sm text-white/60">Speaker or partnership enquiries: <a className="text-gold underline" href={`mailto:${site.contact.email}`}>{site.contact.email}</a></p>
      </div>
    </section>
  )
}
