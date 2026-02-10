import "./css/App.css"
import { RightArrow } from "../assets/Icons.jsx"
import { useAtom } from 'jotai';
import { stepsAtom } from '@org/shared-state';
import { useEffect, useState } from "react";
import axios from "../config/backend"
import { useNavigate } from "react-router-dom";

const AddRecipient = () => {
  const [recipient, setRecipient] = useState("")
  const [toast, setToast] = useState("")
  const [autoComplete, setAutoComplete] = useState([])

  const [step, setStep] = useAtom(stepsAtom);

  const navigate = useNavigate()

  console.log({ step })

  const fetchRecipients = async () => {
    const { data, status } = await axios.post("/Message/fetch-recipient", { recipient })

    if (data.success) {
      setAutoComplete(data.recipients)
    }
  }

  const createRecipient = async () => {
    const { data, status } = await axios.post("/Message/create-recipient", { recipient })

    if (data.success === false) {
      setToast(data.message)

      return
    }

    navigate("/dashboard/create-pixels", { state: { eas: data.eas, recipient } })
  }

  useEffect(() => {
    if (!recipient) return

    const timer = setTimeout(() => {
      fetchRecipients()
    }, 300)

    return () => clearTimeout(timer)
  }, [recipient])

  useEffect(() => {
    let timeout

    if (toast) {
      timeout = setTimeout(() => {
        setToast("")
      }, 5000)
    }

    return () => clearTimeout(timeout)
  }, [toast])

  return (
    <div className="_0giz">
      <div className="tumble-duos">
        <div 
          tabIndex={0}
          onKeyDown={(e) => {
              if (e.key === "Enter" && autoComplete.length > 0) {
                setRecipient(autoComplete[0].address)
              }
            }} 
          className="tzetzes-rhos"
        >
          <label>
            Recipient email †
            <input
              value={recipient}
              onChange={e => setRecipient(e.target.value)}
            />
          </label>
          {toast && <div>{toast}</div>}
          <div onClick={() => createRecipient()} className="besot-exit">
            Create Pixel <RightArrow width="24px" height="24px" fill="white" />
          </div>
          <div
            className="swingers-tuft"
          >
            {autoComplete.map(note => {
              return (
                <div key={note._id} onClick={() => setRecipient(note.address)} className="tithings-yum">
                  {note.address}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddRecipient
