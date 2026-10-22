import { useState, type FormEvent } from 'react'
import { CheckCircle, AlertCircle } from 'lucide-react'
import { site } from '../data/content'
import { submitContactInquiry, isSupabaseConfigured } from '../lib/supabase'
import Reveal from './Reveal'
import Modal from './Modal'

export default function SpeakerCTA() {
  const [modalOpen, setModalOpen] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [topic, setTopic] = useState('')
  const [bio, setBio] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [status, setStatus] = useState<{ kind: 'idle' | 'ok' | 'error' | 'info'; msg: string }>({ kind: 'idle', msg: '' })

  function openModal() {
    setModalOpen(true)
    setStatus({ kind: 'idle', msg: '' })
  }

  function closeModal() {
    setModalOpen(false)
    setName('')
    setEmail('')
    setTopic('')
    setBio('')
    setStatus({ kind: 'idle', msg: '' })
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!name.trim() || !email.trim()) {
      return setStatus({ kind: 'error', msg: 'Name and email are required.' })
    }

    if (!isSupabaseConfigured) {
      return setStatus({
        kind: 'info',
        msg: 'Supabase is not connected yet. Add your credentials in .env to save submissions.',
      })
    }

    setSubmitting(true)
    const res = await submitContactInquiry({
      name: name.trim(),
      email: email.trim(),
      inquiry_type: 'speaker',
      message: `Topic / Session Title: ${topic.trim()}\n\nBio / Details: ${bio.trim()}`,
    })
    setSubmitting(false)

    if (res.success) {
      setStatus({ kind: 'ok', msg: 'Speaker application received! Our team will review your proposal and get in touch.' })
    } else {
      setStatus({ kind: 'error', msg: res.error || 'Failed to submit application. Please try again.' })
    }
  }

  return (
    <section id="speakers" className="relative overflow-hidden py-28 text-white">
      <img
        loading="lazy"
        src="https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1800&q=60"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-navy-950/95 via-navy-900/90 to-navy-700/80" />
      <div className="absolute -right-24 -top-24 h-96 w-96 animate-pulse rounded-full bg-gold/20 blur-3xl" />
      <Reveal className="container-x relative max-w-3xl text-center">
        <h2 className="h2">Your Voice Can Shape the Future</h2>
        <p className="mt-5 text-lg text-white/80">
          Share your expertise, connect with global professionals, and contribute to meaningful conversations.
        </p>
        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <button type="button" onClick={openModal} className="btn btn-gold">
            Become a Speaker
          </button>
          <a href={site.ctaLinks.community} className="btn btn-ghost">
            Join Our Community
          </a>
        </div>
      </Reveal>

      {modalOpen && (
        <Modal title="Apply to Become a Speaker" onClose={closeModal}>
          <div className="mx-auto max-w-lg rounded-2xl bg-white p-8 text-charcoal shadow-2xl">
            <h3 className="font-display text-2xl font-bold text-navy-950">Become a Speaker</h3>
            <p className="mt-1 text-sm text-charcoal/70">
              Submit your topic proposal for our upcoming conferences.
            </p>

            {status.kind === 'ok' ? (
              <div className="mt-6 flex flex-col items-center py-6 text-center">
                <CheckCircle className="h-12 w-12 text-emerald-500" />
                <p className="mt-4 font-semibold text-emerald-800">{status.msg}</p>
                <button onClick={closeModal} className="btn btn-dark mt-6">
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/70">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Dr. Alex Rivera"
                    className="mt-1.5 w-full rounded-xl border border-charcoal/20 px-4 py-2.5 text-sm outline-none focus:border-navy-900 focus:ring-1 focus:ring-navy-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/70">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex.rivera@institution.org"
                    className="mt-1.5 w-full rounded-xl border border-charcoal/20 px-4 py-2.5 text-sm outline-none focus:border-navy-900 focus:ring-1 focus:ring-navy-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/70">
                    Proposed Talk / Session Topic
                  </label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="The Future of Genomic Medicine & AI"
                    className="mt-1.5 w-full rounded-xl border border-charcoal/20 px-4 py-2.5 text-sm outline-none focus:border-navy-900 focus:ring-1 focus:ring-navy-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/70">
                    Brief Bio / Key Background
                  </label>
                  <textarea
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Briefly describe your expertise, current role, or past speaking experiences..."
                    className="mt-1.5 w-full rounded-xl border border-charcoal/20 px-4 py-2.5 text-sm outline-none focus:border-navy-900 focus:ring-1 focus:ring-navy-900"
                  />
                </div>

                {status.kind === 'error' && (
                  <p className="flex items-center gap-1.5 text-xs text-red-600">
                    <AlertCircle size={14} />
                    {status.msg}
                  </p>
                )}

                {status.kind === 'info' && (
                  <p className="text-xs text-amber-700 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                    {status.msg}
                  </p>
                )}

                <div className="mt-6 flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="rounded-full px-5 py-2.5 text-sm font-semibold text-charcoal/70 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn btn-gold disabled:opacity-50"
                  >
                    {submitting ? 'Submitting...' : 'Submit Proposal'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </Modal>
      )}
    </section>
  )
}
