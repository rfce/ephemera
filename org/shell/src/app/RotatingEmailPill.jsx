import { useEffect, useRef, useState } from "react"
import "./css/RotatingEmailPill.css"

const DEFAULT_PLATFORMS = [
  "Outlook",
  "Gmail",
  "Zoho Mail",
  "Spark",
  "Airmail",
  "Apple Mail",
  "Superhuman",
]

export default function RotatingEmailPill({
  platforms = DEFAULT_PLATFORMS,
  duration = 1800,
  className = "",
}) {
  const items = platforms.length > 0 ? platforms : DEFAULT_PLATFORMS

  const [frontIndex, setFrontIndex] = useState(0)
  const [backIndex, setBackIndex] = useState(1 % items.length)

  const frontIndexRef = useRef(0)
  const backIndexRef = useRef(1 % items.length)
  const phaseRef = useRef("front")

  useEffect(() => {
    frontIndexRef.current = 0
    backIndexRef.current = 1 % items.length
    phaseRef.current = "front"

    setFrontIndex(0)
    setBackIndex(1 % items.length)
  }, [items.length])

  useEffect(() => {
    const halfDuration = duration / 2

    const interval = window.setInterval(() => {
      if (phaseRef.current === "front") {
        const nextFrontIndex = backIndexRef.current

        frontIndexRef.current = nextFrontIndex
        setFrontIndex(nextFrontIndex)

        phaseRef.current = "back"
      } else {
        const nextBackIndex =
          (backIndexRef.current + 1) % items.length

        backIndexRef.current = nextBackIndex
        setBackIndex(nextBackIndex)

        phaseRef.current = "front"
      }
    }, halfDuration)

    return () => window.clearInterval(interval)
  }, [duration, items.length])

  const rootClassName = [
    "rotating-email-pill",
    className,
  ]
    .filter(Boolean)
    .join(" ")

  return (
    <div
      className={rootClassName}
      style={{ "--content-duration": `${duration}ms` }}
      role="status"
      aria-live="polite"
      aria-label={`Supported email platform: ${items[frontIndex]}`}
    >
      <span className="rotating-email-pill__liquid" aria-hidden="true">
        <span className="rotating-email-pill__bubble rotating-email-pill__bubble--one" />
        <span className="rotating-email-pill__bubble rotating-email-pill__bubble--two" />
        <span className="rotating-email-pill__bubble rotating-email-pill__bubble--three" />
        <span className="rotating-email-pill__highlight" />
      </span>

      <span className="rotating-email-pill__content-stage">
        <PillContent label={items[frontIndex]} side="front" />
        <PillContent label={items[backIndex]} side="back" />
      </span>
    </div>
  )
}

function PillContent({ label, side }) {
  return (
    <span
      className={`rotating-email-pill__content rotating-email-pill__content--${side}`}
    >
      <span className="rotating-email-pill__dot" />
      <span>{label}</span>
    </span>
  )
}
