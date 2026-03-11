import "./css/App.css"
import { RightArrow, HeartIcon } from "../assets/Icons.jsx"
import { useAtom } from 'jotai';
import { stepsAtom } from '@org/shared-state';
import { useEffect, useRef, useState } from "react";
import axios from "../config/backend"
import { useNavigate } from "react-router-dom";

const EmailTick = new URL('../assets/Email Tick.webm', import.meta.url).href;

const Landing = () => {
  const [recipient, setRecipient] = useState("")
  const [toast, setToast] = useState("")
  const [autoComplete, setAutoComplete] = useState([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  const [step, setStep] = useAtom(stepsAtom);

  const navigate = useNavigate()

  const ref = useRef(null)

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

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // animate once, not like a clingy ex
        }
      },
      { threshold: 0.2 }
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, [])

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

         
          <div onClick={() => createRecipient()} className="besot-exit">
            Continue to compose email <RightArrow width="24px" height="24px" fill="white" />
          </div>
         
        </div>
      </div>
      <div ref={ref} className={`slide-in ${isVisible ? "visible" : ""}`}>
        <div className="habanera-logo">
          <video
            src={EmailTick}
            autoPlay
            loop
            muted
            playsInline
            className="tills-loos"
          />
          <div>
            <h1>Track emails the simple way</h1>
            <div className="vixen-atom">fast, private, and zero integrations</div>
          </div>
        </div>
        <ul className="yoghs-loos">
          <li>No OAuth or inbox access required</li>
          <li>Instant setup, zero integrations</li>
          <li>Lightweight & distraction-free</li>
          <li>Privacy-first tracking approach</li>
          <li>Built for speed, not enterprise overhead</li>
        </ul>
      </div>
      <div className="azine-swat">
        <div>Made with&nbsp;</div>
        <HeartIcon /> 
        <div>&nbsp;for better emails</div>
      </div>
    </div>
  )
}

export default Landing
