import { useState } from "react"
import "./css/App.css"

// Create the URL dynamically based on where *this* module lives
// This ensures it always points to localhost:4201 (or production remote)
const Logo = new URL('../assets/Logo.jpg', import.meta.url).href;
const Background = new URL('../assets/Developer activity-pana.png', import.meta.url).href;
const Animation = new URL('../assets/AI Searching.webm', import.meta.url).href;

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
        <img src={Background} alt="" width={800} style={{ marginTop: "-20px" }} />
        <div className="degut-jug">Emails that tell you when they’re opened.</div>
         <video
            src={Animation}
            autoPlay
            loop
            muted
            playsInline
          />
      </div>
    </div>
  )
}

export default CreatePixelsApp
