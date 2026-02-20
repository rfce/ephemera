import { useState, useEffect, useRef } from "react"
import "./css/App.css"

// Create the URL dynamically based on where *this* module lives
// This ensures it always points to localhost:4201 (or production remote)
const Logo = new URL('../assets/Logo.jpg', import.meta.url).href;
const Background = new URL('../assets/poppy-flowers.png', import.meta.url).href;
const Animation = new URL('../assets/AI Searching.webm', import.meta.url).href;

const FloatingVideo = ({ src }) => {
  const vidRef = useRef(null)

  useEffect(() => {
    const el = vidRef.current
    if (!el) return

    const moveRandomly = () => {
      const vw = window.innerWidth
      const vh = window.innerHeight

      const size = 120 // approx video size (adjust if needed)

      const x = Math.random() * (vw - size)
      const y = Math.random() * (vh - size)

      const rotate = (Math.random() * 60 - 30) // -30deg to +30deg
      const duration = 6000 + Math.random() * 4000 // 6–10s

      el.style.transition = `transform ${duration}ms ease-in-out`
      el.style.transform = `translate(${x}px, ${y}px) rotate(${rotate}deg)`

      setTimeout(moveRandomly, duration)
    }

    moveRandomly()
  }, [])

  return (
    <video
      ref={vidRef}
      src={src}
      autoPlay
      loop
      muted
      playsInline
      className="floating-video"
    />
  )
}


const CreatePixelsApp = () => {
  const [name, setName] = useState("")
  const [words, setWords] = useState("")

  return (
    <div className="_8rid">
      <div className="trebly-oat">
        <img className="steep-hiss" src={Logo} alt="Logo" />
        <div>
          <div>Track Pixels</div>
          <div className="tabarded-tux">Send Magic • Track Everything</div>
        </div>
      </div>
      <div className="outfind-sore">
        <div className="debugged-deys">
          <img src={Background} alt="" />
        </div>
        <div className="degut-jug">Emails that tell you when they’re opened.</div>
        <FloatingVideo src={Animation} />
      </div>
      <div className="water-wave">
        <svg viewBox="0 0 1440 200" preserveAspectRatio="none">
          <defs>
            <path
              id="wavePath"
              d="M0,100 C200,160 400,40 720,100 C1040,160 1240,40 1440,100 L1440,200 L0,200 Z"
            />
          </defs>
          <use href="#wavePath" className="wave back" x="0" />
          <use href="#wavePath" className="wave back" x="1440" />
          <use href="#wavePath" className="wave front" x="0" />
          <use href="#wavePath" className="wave front" x="1440" />
        </svg>
      </div>

    </div>
  )
}

export default CreatePixelsApp
