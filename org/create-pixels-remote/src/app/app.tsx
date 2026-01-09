import { useState } from "react"
import "./css/App.css"

const CreatePixelsApp = () => {
  const [name, setName] = useState("")
  const [words, setWords] = useState("")

  return (
    <div className="_8rid">
      <div className="outfind-sore">
        <div className="reshims-maul">Recepient Name</div>
        <input src={name} onChange={e => setName(e.target.value)} />
        <div className="reshims-maul">Text to be sent</div>
        <input src={words} onChange={e => setWords(e.target.value)} />
        <button>Create Pixel</button>
      </div>
    </div>
  )
}

export default CreatePixelsApp
