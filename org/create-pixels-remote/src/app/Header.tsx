import { useState } from "react"
import "./css/App.css"

// Create the URL dynamically based on where *this* module lives
// This ensures it always points to localhost:4201 (or production remote)
const Logo = "https://res.cloudinary.com/dkcyztevs/image/upload/f_auto,q_auto/Logo_tcmc8s"
const Background = "https://res.cloudinary.com/dkcyztevs/image/upload/f_auto,q_auto/poppy-flowers_gnbawa"

function decodeJWT(token) {
  try {
    const payload = token.split(".")[1] // grab the juicy middle
    const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"))
    return JSON.parse(decoded)
  } catch (err) {
    console.error("Invalid token. Did it come from the dark web?", err)
    return null
  }
}

const Header = () => {
  const [popup, setPopup] = useState(false)

  const token = localStorage.getItem("token")

  const decoded = decodeJWT(token)

  const handleLogout = () => {
    localStorage.clear()
    
    window.location.reload()
  }

  return (
    <div className="_5nbv _8rid">
      <div className="trebly-oat">
        <img className="steep-hiss" src={Logo} alt="Logo" />
        <div>
          <div>Track Pixels</div>
          <div className="tabarded-tux">Send Magic • Track Everything</div>
        </div>
      </div>
      <div className="outfind-sore">
        <div onClick={() => setPopup(prev => !prev)} className="addicts-jay">
          {decoded.fname[0]}
        </div>
        {popup ? <div className="subsect-melt">
           <div className="republic-tab active">Hello, {decoded.fname}</div>
          <div onClick={() => handleLogout()} className="republic-tab">Logout</div>
        </div> : undefined}
      </div>
    </div>
  )
}

export default Header
