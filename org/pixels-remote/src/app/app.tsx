import "./css/App.css"
import Logo from "../assets/Logo.jpg"
import { RightArrow } from "../assets/Icons.jsx"
import { useAtom } from 'jotai';
import { userAtom } from '@org/shared-state';

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
