import "./css/App.css"
import { RightArrow, HeartIcon, TickIcon } from "../assets/Icons.jsx"
import { useAtom } from 'jotai';
import { stepsAtom } from '@org/shared-state';
import { useEffect, useRef, useState } from "react";
import axios from "../config/backend"
import { useNavigate } from "react-router-dom";
import Video from "./Video";

const Shield = new URL('../assets/Shield.png', import.meta.url).href;
const DemoVideo = "https://res.cloudinary.com/dkcyztevs/video/upload/sp_auto/Demo_-video_e1o2o3.m3u8"

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
    <div className="_2sww _0giz">
      <div className="tumble-duos">
        <div className="tzetzes-rhos">
          <div

            className="video-container"
          >
            <Video src={DemoVideo} />
          </div>
        </div>
      </div>
      <div ref={ref} className={`slide-in ${isVisible ? "visible" : ""}`}>
        <div className="habanera-logo">
          <div>
            <h1>Track emails the simple way</h1>
            <div className="vixen-atom">fast, private, and zero integrations</div>
          </div>
        </div>
        <ul className="yoghs-loos">
          <li>
            <TickIcon />
            No inbox access required
          </li>
          <li>
            <TickIcon />
            Instant setup, zero integrations
          </li>
          <li>
            <TickIcon />
            Lightweight and distraction-free</li>
          <li>

            <TickIcon />
            Privacy-first tracking approach</li>
          <li><TickIcon />
            Built for speed, not enterprise overhead</li>
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
