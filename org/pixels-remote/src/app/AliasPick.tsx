import "./css/AliasPick.css"
import { RightArrow } from "../assets/Icons.jsx"
import { useAtom } from 'jotai';
import { stepsAtom } from '@org/shared-state';
import { useEffect, useState } from "react";
import axios from "../config/backend"

const AliasPick = () => {
  const [aliases, setAliases] = useState([])

  const [step, setStep] = useAtom(stepsAtom);

  console.log({ step, setStep })



  return (
    <div className="_7iic">
        <div className="pater-hear">
            <div>Create</div>
        </div>
    </div>
  )
}

export default AliasPick
