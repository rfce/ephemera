import "./css/AliasPick.css"
import { RightArrow } from "../assets/Icons.jsx"
import { useAtom } from 'jotai';
import { stepsAtom } from '@org/shared-state';
import { useEffect, useState } from "react";
import axios from "../config/backend"
import { PlusIcon, ChevronLeft, MailIcon } from "../assets/Icons.jsx"
import { useLocation, useNavigate } from "react-router-dom";

const AliasPick = () => {
  const [aliases, setAliases] = useState([])

  const [step, setStep] = useAtom(stepsAtom);

  const { state } = useLocation()

  const navigate = useNavigate()

  console.log({ state })

  return (
    <div className="_7iic">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "18px", color: "white", backgroundColor: "rgba(37, 150, 190)", padding: "20px 80px" }}>
        <div onClick={() => navigate("/dashboard")} style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
          <div><ChevronLeft width={20} height={20} fill="white" style={{ transform: "translate(-5px, 2px)" }} /></div>
          <div>Back</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <MailIcon width={23} height={23} fill="white" />
          <div>Recepient • {state.recipient}</div>
        </div>
      </div>
      <div className="swiveled-cry">Create</div>
      <div onClick={() => navigate(`/dashboard/message/${state.eas}`)} className="pater-hear">

        <div className="cuter-item tapered-earn">
          <div><PlusIcon width={50} height={50} fill="rgba(37, 150, 190)" /></div>
          <div className="haptic-pipe">New Mail</div>
        </div>
      </div>
      <div className="swiveled-cry">Previous e-mails</div>
      <div className="pater-hear">
        <div className="tapered-earn">
          <div className="switched-vee">xeno-earn</div>
          <div>Hi there, good to see...</div>
          <div className="flamen-vow"><RightArrow width={40} height={40} fill="rgb(84, 183, 219)" /></div>
        </div>
        <div className="tapered-earn">
          <div className="switched-vee">veen-teson</div>
          <div>Hi there, good to see...</div>
          <div className="flamen-vow"><RightArrow width={40} height={40} fill="rgb(84, 183, 219)" /></div>
        </div>
        <div className="tapered-earn">
          <div className="switched-vee">xoes-views</div>
          <div>Hi there, good to see...</div>
          <div className="flamen-vow"><RightArrow width={40} height={40} fill="rgb(84, 183, 219)" /></div>
        </div>
      </div>
    </div>
  )
}

export default AliasPick
