import "./css/AliasPick.css"
import { RightArrow } from "../assets/Icons.jsx"
import { useAtom } from 'jotai';
import { composeAtom } from '@org/shared-state';
import { useEffect, useMemo, useState } from "react";
import axios from "../config/backend"
import { PlusIcon, ChevronLeft, MailIcon, ReadReciept, DraftsIcon, SendIcon, BellIcon, DeleteIcon } from "../assets/Icons.jsx"
import { useLocation, useNavigate } from "react-router-dom";
import { Tooltip } from 'react-tooltip'


const truncate = (str = "", max = 50) => {
  if (str.length <= max) return str
  const sliced = str.slice(0, max)
  return sliced.slice(0, sliced.lastIndexOf(" ")) + "..."
}


const AliasPick = () => {
  const [messages, setMessages] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [direction, setDirection] = useState("right")
  const [newOpens, setNewOpens] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(4)

  const totalPages = Math.ceil(messages.length / itemsPerPage)

  const paginatedMessages = useMemo(() => {
    const start = (page - 1) * itemsPerPage
    return messages.slice(start, start + itemsPerPage)
  }, [messages, page])

  const goPrev = () => {
    setDirection("left")
    setPage((p) => Math.max(p - 1, 1))
  }

  const goNext = () => {
    setDirection("right")
    setPage((p) => Math.min(p + 1, totalPages))
  }


  const [text, setText] = useAtom(composeAtom)

  const { state } = useLocation()

  const navigate = useNavigate()

  const recipient = localStorage.getItem("recipient")

  const fetchMessages = async () => {
    const { data, status } = await axios.post("/Message/fetch-messages", { recipient })

    if (data.success) {
      setMessages(data.messages)
    }
  }

  const createMessage = async () => {
    setLoading(true)

    const { data, status } = await axios.post("/Message/create-message", { recipient })

    setLoading(false)

    if (data.success) {
      localStorage.removeItem("text")

      setText("")

      navigate(`/dashboard/message/${data.eas}`, { state: { tid: data.tid } })
    }
  }

  const updateItems = () => {
    setItemsPerPage(window.innerWidth <= 1370 ? 3 : 4);
  }

  useEffect(() => {
    fetchMessages()

    updateItems()
    
    window.addEventListener("resize", updateItems)

    return () => window.removeEventListener("resize", updateItems)
  }, [])

  return (
    <div className="_7iic">
      <div className="mail-header" style={{ paddingBottom: "6px" }}>
        <Tooltip
          id="my-tooltip-1"
          place="bottom"
          content={`You have ${newOpens} new opens`}
        />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "18px", color: "white", backgroundColor: "rgba(37, 150, 190)", padding: "20px 80px" }}>
          <div onClick={() => navigate("/dashboard")} style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
            <div><ChevronLeft width={20} height={20} fill="white" style={{ transform: "translate(-5px, 2px)" }} /></div>
            <div>Back</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <MailIcon width={23} height={23} fill="white" />
            <div>Recepient • {recipient}</div>
          </div>
        </div>
        <div className={`mail-header-loader ${loading ? "active" : ""}`} />
      </div>
      <div className="swiveled-cry">Create</div>
      <div className="pater-hear">
        <div onClick={() => createMessage()} className="cuter-item tapered-earn">
          <div><PlusIcon width={50} height={50} fill="rgba(37, 150, 190)" /></div>
          <div className="haptic-pipe">New Mail</div>
        </div>
      </div>
      {messages.length ? <div className="swiveled-cry">Previous e-mails</div> : undefined}
      <>
        <div className={`pater-hear slide-${direction}`} key={page}>
          {paginatedMessages.map((message, index) => (
            <div
              key={index}
              className="tapered-earn"
              onClick={() => {
                if (message.text) {
                  localStorage.setItem("text", message.text);
                  setText(message.text);
                } else {
                  localStorage.removeItem("text");
                }

                navigate(`/dashboard/track-boat/${message.eas}`, {
                  state: { eas: message.eas, tid: message.tid._id },
                });
              }}
            >
              {message.tid ? (message.tid.receipt < message.tid.unix.length) ? (
                <>
                  <BellIcon
                    className="yoghourt-nix"
                    data-tooltip-id="my-tooltip-1"
                    onMouseEnter={() => setNewOpens(message.tid.unix.length - message.tid.receipt)}
                  />
                  <div className="outbred-log">{message.tid.unix.length - message.tid.receipt}</div>
                </>
              ) : undefined : undefined}
              <div className="switched-vee">
                <div>
                  <div>{message.eas}</div>
                  <div className="deluge-sum left"></div>
                  <div className="deluge-sum right"></div>
                </div>
              </div>
              <div className="snick-suq">{truncate(message.text, 30)}</div>
              <div style={{ width: "100%", display: "flex", alignItems: "center" }}>
                {message.tid?.fire ? (
                  <div className="nonfoam-jury">
                    <div className="harsh-lob">
                      <SendIcon width={25} height={25} fill="#89e694" />
                      <div>Sent</div>
                    </div>
                    {message.tid?.unix.length ? <div className="harsh-lob">
                      <ReadReciept width={25} height={25} fill="#89e694" />
                      <div>Read</div>
                    </div> : undefined}
                  </div>
                ) : undefined}
                {message.tid?.fire ? undefined : (
                  <div className="harsh-lob bg">
                    <DraftsIcon width={23} height={23} fill="#c4c4c4" />
                    <div className="outsail-gyps">Draft</div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {messages.length > itemsPerPage && (
          <div className="grid-pagination">
            <button onClick={goPrev} disabled={page === 1}>
              ← Prev
            </button>

            <span className="page-indicator">
              Page {page} of {totalPages}
            </span>

            <button onClick={goNext} disabled={page === totalPages}>
              Next →
            </button>
          </div>
        )}
      </>
    </div>
  )
}

export default AliasPick
