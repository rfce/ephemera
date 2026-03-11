import "./css/CreateMessage.css"
import { useAtom } from 'jotai'
import { composeAtom } from '@org/shared-state'
import { useEffect, useRef, useState } from "react"
import axios from "../config/backend"
import { MailIcon, RightArrow, ReadReciept, PhoneIcon, DesktopIcon, TabletIcon } from "../assets/Icons.jsx"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { parse } from "twemoji-parser"
import Table from "./Table"
import { format } from "timeago.js"
import { UAParser } from "ua-parser-js"

const Contract = new URL('../assets/contract.png', import.meta.url).href

function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getUnifiedFromUrl(url: string) {
  return url.split("/").pop()?.replace(".svg", "");
}


function textToTwemojiHtml(
  text: string,
  tid: string
): string {
  const entities = parse(text)

  // Wrap everything so text font-size is enforced
  let html = `<span style="font-size:18px; line-height:1.4;">`

  if (entities.length === 0) {
    html += escapeHtml(text)
    html += `</span>`
    return html
  }

  let lastIndex = 0

  for (const emoji of entities) {
    const [start, end] = emoji.indices

    // text before emoji
    html += escapeHtml(text.slice(lastIndex, start))

    const unified = getUnifiedFromUrl(emoji.url)

    // emoji image
    html += `<img
      src="https://backend.trackpixels.online/api/Image/${unified}.png"
      alt="${emoji.text}"
      width="25"
      height="25"
      style="vertical-align:-4px;"
    />`

    lastIndex = end
  }

  // remaining text
  html += escapeHtml(text.slice(lastIndex));

  html += `</span>`;

  return html;
}

function hasNativeEmoji(text) {
  return /\p{Extended_Pictographic}/u.test(text);
}

const renderLastSeen = (track = []) => {
  if (!track.length) {
    return "Waiting for open";
  }

  const latest = new Date(track[0].timestamp);
  const diffMs = Date.now() - latest.getTime();

  // consider "just now" within 30 seconds
  if (diffMs < 30 * 1000) {
    return "Opened just now";
  }

  return `Opened ${format(latest)}`;
};

const formatDate = (dateString) => {
  if (!dateString) return "—"; // or "Not sent yet"

  const date = new Date(dateString);

  // Check invalid date
  if (isNaN(date.getTime())) return "Invalid date";

  const formatter = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  const parts = formatter.formatToParts(date);

  const d = parts.find(p => p.type === 'day')?.value ?? "";
  const m = parts.find(p => p.type === 'month')?.value ?? "";
  const y = parts.find(p => p.type === 'year')?.value ?? "";
  const hr = parts.find(p => p.type === 'hour')?.value ?? "";
  const min = parts.find(p => p.type === 'minute')?.value ?? "";
  const dayPeriod = (parts.find(p => p.type === 'dayPeriod')?.value ?? "").toUpperCase();

  return `${d}-${m}-${y} ${hr}:${min} ${dayPeriod}`.trim();
};


const TrackMessage = () => {
  const [track, setTrack] = useState([])
  const [loading, setLoading] = useState(true)
  const [freshRead, setFreshRead] = useState(0)
  const [sentAt, setSentAt] = useState(undefined)

  const [text, setText] = useAtom(composeAtom)

  const { eas } = useParams()

  const { state } = useLocation()

  const navigate = useNavigate()

  const recipient = localStorage.getItem('recipient')

  const tid = state.tid

  const contentRef = useRef(null)

  const fetchTracking = async () => {
    const { data, status } = await axios.post("/Image/track-boat", { tid: String(tid) })

    setLoading(false)

    if (data.success) {
      setText(data.message.text)
      setTrack(data.track.unix)
      setFreshRead(data.track.unix.length - data.track.receipt)
      setSentAt(data.track.firefox)
    }
    else {
      navigate(`/dashboard/message/${eas}`, { state: { tid } })
    }
  }

  const seenOpens = async () => {
    const { data, status } = await axios.post("/Message/seen-opens", { tid: String(tid) })

  }

  useEffect(() => {
    fetchTracking()
  }, [])

  useEffect(() => {
    if (freshRead) {
      seenOpens()
    }
  }, [freshRead])

  if (loading) {
    return (
      <div>Loading...</div>
    )
  }

  // <div className="eugenics-demy">
  //       <Table rows={track} />
  //     </div>
 
  return (
    <div className="_3ono _6pzh">
      <div onClick={() => navigate("/dashboard/create-pixels", { state: { eas, tid } })} className="flamen-vow">
        <div className="relate-glen">
          <RightArrow className="shuns-ropy" fill="rgb(84, 183, 219)" />
          <div>Dashboard</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <MailIcon width={23} height={23} fill="white" />
          <div>Recepient • {recipient}</div>
          <div style={{ fontSize: "14px", padding: "5px 12px", border: "2px solid #ffc354", backgroundColor: "white", color: "rgb(84, 183, 219)", borderRadius: "20px" }}>{eas}</div>
        </div>
      </div>
      <div className="cordobas-ouzo">
        <div className="athlete-tuna">
  <div className="premium-message-card">
    {/* Header */}
    <div className="pmc-header">
      <div className="pmc-title">Message</div>

      <div className={`pmc-status ${track.length ? "read" : "unread"}`}>
        <ReadReciept fill={track.length ? "rgb(96, 230, 89)" : "#c4c4c4"} />
        <span>{renderLastSeen(track)}</span>
      </div>
    </div>

    {/* Message body */}
    <div
      ref={contentRef}
      className="pmc-body"
      dangerouslySetInnerHTML={{
        __html: textToTwemojiHtml(text, tid),
      }}
    />

    {/* Footer */}
    <div className="pmc-footer">
      <span className="pmc-time-label">Sent</span>
      <span className="pmc-time-value">{formatDate(sentAt)}</span>
    </div>
  </div>
</div>
        <div className="athlete-tuna">
          {track.length ? <div className="insects-cere">History</div> : undefined}
          <div className={track.length ? "tempting-bray" : "laciest-deep"}>
            {track.length ? track.map((data, index) => {
              const parser = new UAParser(data.ua)

              const result = parser.getResult()
                return (
                  <div className={freshRead && (freshRead > index) ? "canny-two highlight" : "canny-two"}>
                    <div className="housefly-fire">New</div>
                    <div className="curst-vugs">
                      {result.device.type === undefined ? <DesktopIcon fill="rgb(95, 175, 222)" /> : (result.device.type === "mobile" ? <PhoneIcon fill="rgb(95, 175, 222)" /> : <TabletIcon fill="rgb(95, 175, 222)" />)}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>

                      <div className="yuans-hex">{formatDate(new Date(data.timestamp))}</div>
                      <div style={{ color: "#6e6e6e" }}>{data.ip}</div>
                      <div style={{ display: "flex" }}>
                        <div className="helios-oafs">{result.os.name}</div>
                        <div className="helios-oafs">{result.browser.name}</div>
                      </div>
                    </div>
                    
                  </div>
                )
            }) : (
              <div className="collect-ahoy canny-two">
                <div>
                  <img src={Contract} alt="" />
                </div>
                <h1>No views yet</h1>
                <h1>Waiting for email to open</h1>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TrackMessage
