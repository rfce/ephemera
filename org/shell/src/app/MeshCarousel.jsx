import React, { useState, useEffect } from 'react'
import "./css/MeshCarousel.css"

const features = [
  "No inbox access required",
  "Instant setup, zero integrations",
  "Lightweight and distraction-free",
  "Privacy-first tracking approach",
  "Built for speed, not enterprise overhead"
]

export default function MeshCarousel() {
  const [activeIndex, setActiveIndex] = useState(0)

  // Auto-swipe left (moves to the next card) every 3.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % features.length)
    }, 3500)
    return () => clearInterval(interval)
  }, [])

  // Determine positions for the stack (Center, Left, Right, Hidden)
  const getCardPositionClass = (index) => {
    if (index === activeIndex) return "mesh-active"

    const prevIndex = (activeIndex - 1 + features.length) % features.length
    const nextIndex = (activeIndex + 1) % features.length

    if (index === prevIndex) return "mesh-prev" // Left card
    if (index === nextIndex) return "mesh-next" // Right card

    // Cards not in the immediate 3-card stack are hidden
    const prevPrevIndex = (activeIndex - 2 + features.length) % features.length
    if (index === prevPrevIndex) return "mesh-hidden-left"

    return "mesh-hidden-right"
  }

  return (
    <div className="nettling-rye">
      <div className="mesh-carousel-container">
        {features.map((feature, index) => (
          <div
            key={index}
            className={`mesh-card ${getCardPositionClass(index)}`}
            onClick={() => setActiveIndex(index)}
          >
            {/* The animated silver orbs */}
            <div className="mesh-gradient-bg"></div>

            {/* NEW: The Premium Silver Number */}
            <div className="mesh-number">
              0{index + 1}
            </div>

            {/* The tactile static grain overlay */}
            <div className="mesh-grain-overlay"></div>

            {/* Card Content */}
            <div className="mesh-content">
              <h3>{feature}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
