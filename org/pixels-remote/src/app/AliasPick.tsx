import "./css/AliasPick.css"
import { RightArrow } from "../assets/Icons.jsx"
import { useAtom } from 'jotai';
import { stepsAtom } from '@org/shared-state';
import { useEffect, useState } from "react";
import axios from "../config/backend"
import { PlusIcon } from "../assets/Icons.jsx"

const AliasPick = () => {
  const [aliases, setAliases] = useState([])

  const [step, setStep] = useAtom(stepsAtom);

  console.log({ step, setStep })

  return (
    <div className="_7iic">
       <div className="swiveled-cry">Create</div>
        <div className="pater-hear">

            <div className="cuter-item tapered-earn">
              <div><PlusIcon width={60} height={60} fill="rgb(98, 197, 98)" /></div>
              <div className="haptic-pipe">New Mail</div>
            </div>
        </div>
        <div className="swiveled-cry">Previous e-mails</div>
        <div className="pater-hear">
            <div className="tapered-earn">
              <div>xeno</div>
              <div>Hi there, good to see...</div>
            </div>
            <div className="tapered-earn">deco</div>
        </div>
    </div>
  )
}

export default AliasPick
