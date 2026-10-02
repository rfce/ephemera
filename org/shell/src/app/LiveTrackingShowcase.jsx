import { useEffect, useRef, useState } from 'react'
import './css/LiveTrackingShowcase.css'

const EVENTS = [
  { name: 'Sarah Chen', subject: 'Proposal for Q3', client: 'Gmail', place: 'Austin', hue: 12 },
  { name: 'Marcus Webb', subject: 'Follow-up: pricing', client: 'Apple Mail', place: 'London', hue: 265 },
  { name: 'Priya Nair', subject: 'Intro call this week?', client: 'Outlook', place: 'Mumbai', hue: 200 },
  { name: 'Leo Fischer', subject: 'Contract draft v2', client: 'Spark', place: 'Berlin', hue: 150 },
  { name: 'Ana Souza', subject: 'Quick question', client: 'Superhuman', place: 'Lisbon', hue: 330 },
  { name: 'James Okoro', subject: 'Demo recording', client: 'Airmail', place: 'Lagos', hue: 35 },
]

const TIME_LABELS = ['Just now', '3s ago', '6s ago', '9s ago']

const STEPS = [
  {
    title: 'Drop in one invisible pixel',
    text: "Paste a tiny 1×1 image into your email. Recipients never see it, and it weighs next to nothing.",
    Visual: CodeVisual,
  },
  {
    title: 'They open. We catch it.',
    text: 'The moment an email client loads the pixel, we log the open along with the client and time.',
    Visual: MailVisual,
  },
  {
    title: "You're notified instantly",
    text: 'Get a real-time alert the second it happens, so you can follow up while you’re top of mind.',
    Visual: FeedVisual,
  },
]

const PARTICLES = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  left: `${(i * 37 + 8) % 100}%`,
  size: 4 + (i % 3) * 3,
  delay: `${-((i * 1.7) % 10)}s`,
  duration: `${10 + (i % 5) * 2}s`,
}))

const CHIPS = [
  'Invisible to recipients',
  'Works with every major client',
  'Instant notifications',
]

/* ---------- Icons ---------- */
const BellIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.7 21a2 2 0 0 1-3.4 0" />
  </svg>
)

const EyeIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 6 9 17l-5-5" />
  </svg>
)

/* ---------- Step visuals ---------- */
function CodeVisual() {
  return (
    <div className="lts-code" aria-hidden="true">
      <div className="lts-code__dots"><i /><i /><i /></div>
      <div className="lts-code__body">
        <div><span className="t-tag">&lt;img</span></div>
        <div className="lts-code__indent">
          <span className="t-attr">src</span>=<span className="t-str">"https://px.example.com/o/8f3a2c.png"</span>
        </div>
        <div className="lts-code__indent">
          <span className="lts-code__hl">
            <span className="t-attr">width</span>=<span className="t-str">"1"</span>{' '}
            <span className="t-attr">height</span>=<span className="t-str">"1"</span>
          </span>
        </div>
        <div>
          <span className="t-tag">/&gt;</span>
          <span className="lts-code__caret" />
        </div>
      </div>
    </div>
  )
}

function MailVisual() {
  return (
    <div className="lts-mail" aria-hidden="true">
      <div className="lts-mail__head">
        <span className="lts-mail__avatar" />
        <div className="lts-mail__lines">
          <span className="sk" style={{ width: '55%' }} />
          <span className="sk" style={{ width: '35%' }} />
        </div>
      </div>
      <span className="sk" style={{ width: '100%' }} />
      <span className="sk" style={{ width: '92%' }} />
      <span className="sk" style={{ width: '70%' }} />
      <div className="lts-mail__foot">
        <div className="lts-mail__pixel">
          <span className="ping" />
          <span className="ping ping--2" />
          <span className="dot" />
        </div>
        <span className="lts-mail__tag">Pixel loaded · 0.4s</span>
      </div>
    </div>
  )
}

function FeedVisual({ feed }) {
  const latest = feed[0]
  return (
    <div className="lts-feed">
      <div className="lts-feed__head">
        <span className="lts-feed__live">
          <span className="lts-feed__live-dot" />
          Live opens
        </span>
        <span className="lts-feed__bell" key={latest.id}>
          <BellIcon />
          <b>{latest.id + 1}</b>
        </span>
      </div>
      <ul className="lts-feed__list" aria-live="polite">
        {feed.map((item, i) => (
          <li className="lts-toast" key={item.id}>
            <span className="lts-toast__avatar" style={{ '--h': item.hue }}>
              {item.name[0]}
            </span>
            <div className="lts-toast__text">
              <strong>{item.name.split(' ')[0]} opened</strong>
              <span>“{item.subject}”</span>
              <small>{item.client} · {item.place}</small>
            </div>
            <div className="lts-toast__meta">
              <span className="lts-toast__eye"><EyeIcon /></span>
              <time>{TIME_LABELS[i]}</time>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ---------- Main component ---------- */
export default function LiveTrackingShowcase() {
  const rootRef = useRef(null)
  const counter = useRef(3)
  const [live, setLive] = useState(false)
  const [revealed, setRevealed] = useState(false)
  const [feed, setFeed] = useState(() =>
    [2, 1, 0].map((i) => ({ ...EVENTS[i], id: i }))
  )

  // Scroll reveal + pause animations when off-screen
  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        setLive(entry.isIntersecting)
        if (entry.isIntersecting) setRevealed(true)
      },
      { threshold: 0.15 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // Simulated live feed
  useEffect(() => {
    if (!live) return
    const timer = setInterval(() => {
      setFeed((prev) => {
        const id = counter.current++
        return [{ ...EVENTS[id % EVENTS.length], id }, ...prev].slice(0, 4)
      })
    }, 2800)
    return () => clearInterval(timer)
  }, [live])

  return (
    <section
      ref={rootRef}
      className={`lts ${revealed ? 'is-revealed' : ''} ${live ? 'is-live' : ''}`}
      aria-labelledby="lts-title"
    >
      {/* Full-bleed background */}
      <div className="lts__bg" aria-hidden="true">
        <div className="lts__grid" />
        <div className="lts__blob lts__blob--a" />
        <div className="lts__blob lts__blob--b" />
        {PARTICLES.map((p) => (
          <span
            key={p.id}
            className="lts__particle"
            style={{
              left: p.left,
              width: p.size,
              height: p.size,
              animationDelay: p.delay,
              animationDuration: p.duration,
            }}
          />
        ))}
      </div>

      <div className="lts__inner">
        <header className="lts__header">
          <span className="lts__eyebrow" data-reveal style={{ '--d': '0s' }}>
            <span className="lts__eyebrow-dot" />
            Real-time email tracking
          </span>
          <h2 id="lts-title" className="lts__title" data-reveal style={{ '--d': '.1s' }}>
            From send to <span className="lts__mark">seen</span> in under a second.
          </h2>
          <p className="lts__sub" data-reveal style={{ '--d': '.2s' }}>
            One invisible pixel is all it takes. Know exactly when your email is
            opened, and never wonder if it landed again.
          </p>
        </header>

        <ol className="lts__steps">
          {STEPS.map(({ title, text, Visual }, i) => (
            <li
              className="lts-step"
              key={title}
              data-reveal
              style={{ '--d': `${0.3 + i * 0.15}s`, '--i': i }}
            >
              <article className="lts-card">
                <div className="lts-card__visual">
                  <Visual feed={feed} />
                </div>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            </li>
          ))}
        </ol>

        <ul className="lts__chips">
          {CHIPS.map((c, i) => (
            <li
              key={c}
              data-reveal
              style={{ '--d': `${0.8 + i * 0.1}s` }}
            >
              <span className="lts__chip" style={{ animationDelay: `${i * 0.6}s` }}>
                <span className="lts__chip-icon"><CheckIcon /></span>
                {c}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
