import { useState, type FormEvent } from 'react'
import { site } from '../data/content'
import { subscribeNewsletter, isSupabaseConfigured } from '../lib/supabase'

type State = { kind: 'idle' | 'ok' | 'error' | 'info'; msg: string }
export default function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [s, setS] = useState<State>({ kind: 'idle', msg: '' })

  async function submit(e: FormEvent) {
    e.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      return setS({ kind: 'error', msg: 'Enter a valid email address, like name@example.com.' })
    }

    if (!isSupabaseConfigured) {
      return setS({
        kind: 'info',
        msg: 'Supabase is not connected yet. Add your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env to save subscribers.',
      })
    }

    setLoading(true)
    const result = await subscribeNewsletter(email)
    setLoading(false)

    if (result.success) {
      setS({ kind: 'ok', msg: 'Thank you for subscribing! Your email has been saved.' })
      setEmail('')
    } else {
      setS({ kind: 'error', msg: result.error || 'We could not subscribe you. Please try again later.' })
    }
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
          <button disabled={loading} className="btn btn-gold disabled:opacity-50">
            {loading ? 'Subscribing...' : 'Subscribe'}
          </button>
        </form>
        <p role="status" className={`mt-4 min-h-[1.5rem] text-sm ${color}`}>{s.msg}</p>
        <p className="mt-6 text-sm text-white/60">Speaker or partnership enquiries: <a className="text-gold underline" href={`mailto:${site.contact.email}`}>{site.contact.email}</a></p>
      </div>
    </section>
  )
}
