import { useState } from "react"
import "./css/App.css"
import { useAtom } from 'jotai';
import { composeAtom } from '@org/shared-state';

const Recommended = () => {
  const [text, setText] = useAtom(composeAtom)

  return (
    <div className="_8rid">
      <div className="mettle-bang">
        <div className="franc-fink">Recommended</div>

        <div className="docken-papa">
          Under development
        </div>
      </div>
    </div>
  )
}

export default Recommended
