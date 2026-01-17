import "./css/App.css"
import { RightArrow } from "../assets/Icons.jsx"
import { useAtom } from 'jotai';
import { userAtom } from '@org/shared-state';

// Create the URL dynamically based on where *this* module lives
// This ensures it always points to localhost:4201 (or production remote)
const Logo = new URL('../assets/Logo.jpg', import.meta.url).href;

const PixelsApp = () => {
 const [user] = useAtom(userAtom);

 console.log({ user })

  return (
    <div className="_0giz">
      <div className="trebly-oat">
        <img className="steep-hiss" src={Logo} alt="Logo" />
        <div>
          <div>Track Pixels</div>
          <div className="tabarded-tux">Send Magic • Track Everything</div>
        </div>
      </div>
      <h2 className="inert-zoo">Pixels <RightArrow width="30px" height="30px" /></h2>
      <div>
        
      </div>
    </div>
  )
}

export default PixelsApp
