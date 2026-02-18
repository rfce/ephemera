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
  const [selectedIndex, setSelectedIndex] = useState(0)

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

    localStorage.setItem("recipient", recipient)

    navigate("/dashboard/create-pixels", { state: { eas: data.eas, tid: data.tid, recipient: data.recipient } })
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
            if (!autoComplete.length) return

            if (e.key === "ArrowRight") {
              e.preventDefault()
              setSelectedIndex((prev) => (prev + 1) % autoComplete.length)
            }

            if (e.key === "ArrowLeft") {
              e.preventDefault()
              setSelectedIndex((prev) =>
                prev === 0 ? autoComplete.length - 1 : prev - 1
              )
            }

            if (e.key === "Tab") {
              e.preventDefault()
              setRecipient(autoComplete[selectedIndex].address)
            }

            if (e.key === "Enter") {
              e.preventDefault()
              createRecipient()
            }
          }}

          className="tzetzes-rhos"
        >

          <label>
            Who are you sending this email to?
            <input
              placeholder="e.g. john-doe@proton.me"
              value={recipient}
              onChange={e => setRecipient(e.target.value)}
            />
          </label>
          {toast && <div>{toast}</div>}
          <div onClick={() => createRecipient()} className="besot-exit">
            Continue to compose email <RightArrow width="24px" height="24px" fill="white" />
          </div>
          <div
            className="swingers-tuft"
          >
            {autoComplete.map((note, idx) => {
              return (
                <div key={note._id}
                  className={idx === selectedIndex ? "tithings-yum active" : "tithings-yum"}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  onClick={() => setRecipient(note.address)}
                >
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
