import "./css/CreateMessage.css"
import { useAtom } from 'jotai';
import { composeAtom } from '@org/shared-state';
import { useEffect, useRef, useState } from "react";
import axios from "../config/backend"
import { StickerIcon, CopyIcon, TickIcon, ChevronLeft, RightArrow } from "../assets/Icons.jsx"
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data"
import { parse } from "twemoji-parser";
import { PuffLoader } from "react-spinners";

const SentEmail = new URL('../assets/Email sent.webm', import.meta.url).href;

function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
    .replace(/\n/g, "<br>");
}

function getUnifiedFromUrl(url: string) {
  return url.split("/").pop()?.replace(".svg", "");
}

const QUICK_EMOJIS = ["😀", "❤️", "😂", "😍", "🙌"]

function getTwemojiUrl(emoji) {
  const entities = parse(emoji)

  if (!entities.length) return null

  const unified = getUnifiedFromUrl(entities[0].url)

  return `https://lookup.trackpixels.online/api/Image/${unified}.png`
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
      src="https://lookup.trackpixels.online/api/Image/${unified}.png"
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

const QuickEmojiBar = ({ onEmojiSelect, onMore }) => {
  return (
    <div className="quick-emoji-bar">

      <div className="quick-emoji-list">
        {QUICK_EMOJIS.map((emoji) => {
          const src = getTwemojiUrl(emoji)

          return (
            <button
              key={emoji}
              type="button"
              className="quick-emoji"
              onClick={() => onEmojiSelect(emoji)}
              aria-label={`Insert ${emoji}`}
            >
              <img
                src={src}
                alt={emoji}
                draggable="false"
              />
            </button>
          )
        })}
      </div>

      <div className="quick-emoji-divider" />

      <button
        type="button"
        className="quick-emoji-more"
        onClick={onMore}
        aria-label="More emojis"
      >
        <span>+</span>
      </button>

    </div>
  )
}

const CreateMessage = () => {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [hasEmoji, setHasEmoji] = useState(false)
  const [hasCopied, setHasCopied] = useState(false)
  const [hasPasted, setHasPasted] = useState(false)
  const [popup, setPopup] = useState(false)
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const [showCopyGuide, setShowCopyGuide] = useState(false)
  const [copyButtonRect, setCopyButtonRect] = useState(null)
  const [copyGuideSeen, setCopyGuideSeen] = useState(() => {
    return localStorage.getItem("copy_tutorial_seen") === "true"
  })

  const copyButtonRef = useRef(null)

  const [text, setText] = useAtom(composeAtom)

  const { eas } = useParams()

  const { state } = useLocation()

  const navigate = useNavigate()

  const tid = state.tid

  const recipient = localStorage.getItem("recipient")

  const textareaRef = useRef()

  const insertAtCursor = (emoji) => {
    const textarea = textareaRef.current
    const start = textarea.selectionStart
    const end = textarea.selectionEnd

    setText(
      text.slice(0, start) + emoji + text.slice(end)
    )

    requestAnimationFrame(() => {
      textarea.selectionStart = textarea.selectionEnd = start + emoji.length
      textarea.focus()
    })

    setOpen(false)
  }

  const contentRef = useRef(null)

  const handleCopy = async () => {
    if (!contentRef.current) return;

    // 1. Use DOMParser instead of creating a div element
    const parser = new DOMParser();
    const doc = parser.parseFromString(contentRef.current.innerHTML, "text/html");

    // 2. Modify the image in the virtual document
    const firstImg = doc.querySelector("img");

    if (firstImg) {
      const src = firstImg.getAttribute("src");
      if (src && !src.includes("tid=")) {
        const unique = crypto.randomUUID()

        // Use a custom attribute or modify the src string directly
        firstImg.setAttribute("src", `${src}?tid=${tid}&r=${unique}`);
      }
    }

    // 3. Extract the modified HTML and plain text
    const html = doc.body.innerHTML;
    const text = doc.body.textContent || "";

    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          "text/html": new Blob([html], { type: "text/html" }),
          "text/plain": new Blob([text], { type: "text/plain" }),
        }),
      ]);
      setCopied(true);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  const togglePaste = async (paste) => {
    const { data, status } = await axios.post("/Image/toggle-copy", { tid: String(tid), paste })
  }

  const hasPaste = async () => {
    const { data, status } = await axios.post("/Image/has-paste", { tid: String(tid) })

    if (data.success && data.paste) {
      setHasPasted(true)
    }
  }

  const handleConfirmSend = () => {
    if (sending) return

    setSending(true)

    enableTracking()
  }

  const enableTracking = async () => {
    await axios.post("/Image/enable-tracking", { tid: String(tid), text })

    const { data, status } = await axios.post("/Image/track-boat", { tid: String(tid) })

    if (data.success) {
      navigate(`/dashboard/track-boat/${eas}`, {
        state: { eas: eas, tid: tid },
      })
    }
  }

  const saveMessage = async (wait = false) => {
    if (wait) setLoading(true)
    try {
      await axios.post("/Message/save-message", {
        eas,
        tid: String(tid),
        text,
      })
    } catch (err) {
      console.error("Auto-save failed", err)
    }

    setLoading(false)
  }

  const discardMessage = async () => {
    if (!text) {
      await saveMessage(true)
    }
    setText("")
    navigate(`/dashboard/create-pixels`, { state: { eas, tid } })
  }

  useEffect(() => {
    let timeout = undefined

    if (copied) {
      timeout = setTimeout(() => {
        setCopied(false)
      }, 4000)

      setHasCopied(true)
    }

    return () => clearTimeout(timeout)
  }, [copied])

  useEffect(() => {
    if (!text) return

    // Save or discard message
    const handler = setTimeout(() => {
      saveMessage()
    }, 1000)

    return () => {
      clearTimeout(handler)
    }
  }, [text])

  useEffect(() => {
    setHasCopied(false)

    const valid = hasNativeEmoji(text)

    if (valid) {
      setHasEmoji(true)

      return
    }

    setHasEmoji(false)
  }, [text])

  useEffect(() => {
    if (
      !hasEmoji ||
      !text.trim() ||
      hasCopied ||
      copyGuideSeen
    ) {
      return
    }

    const timer = setTimeout(() => {
      if (!copyButtonRef.current) return

      const rect = copyButtonRef.current.getBoundingClientRect()

      setCopyButtonRect({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height
      })

      setShowCopyGuide(true)
    }, 2000)

    return () => clearTimeout(timer)
  }, [
    text,
    hasEmoji,
    hasCopied,
    copyGuideSeen
  ])

  useEffect(() => {
    if (hasCopied === false) {
      togglePaste(false)

      setHasPasted(false)

      return
    }

    if (hasPasted) {
      return
    }

    // Copied is true, check if user pastes into client
    const interval = setInterval(() => {
      hasPaste()
    }, 3000)

    return () => clearInterval(interval)
  }, [hasCopied, hasPasted])

  useEffect(() => {
    const tex = localStorage.getItem("text")

    if (tex && !text) {
      setText(tex)
    }
  }, [])


  return (
    <div className="_6pzh">
      {popup && (
        <div className="tsarist-haws">
          <div className="finder-gasp">
            <video
              src={SentEmail}
              autoPlay
              loop
              muted
              playsInline
              style={{ width: "100px" }}
            />
            <h2>Did you send this e-mail?</h2>
            <p>Please confirm that you have pasted the message into Gmail or Outlook and sent the email to enable tracking.</p>
            <div className="beefy-hear">
              <div onClick={() => setPopup(false)} className="crays-cad">
                <ChevronLeft className="scouted-foe" />
                go back
              </div>
              <button
                className={`curlew-goer ${sending ? "loading" : ""}`}
                onClick={handleConfirmSend}
                disabled={sending}
              >
                Yes, I've sent it
                <RightArrow className="nursing-nag" />
              </button>
            </div>
          </div>
        </div>
      )}
      {loading && (
        <div className="tsarist-haws">
          <PuffLoader color="white" />
        </div>
      )}
      <div className="blurry-woo">
        <div onClick={() => discardMessage()} className="flamen-vow">
          <RightArrow className="shuns-ropy" fill="rgb(84, 183, 219)" />
          <div>New E-mail</div>
          <div onClick={(e) => e.stopPropagation()} className="oversat-yore">
            <div>
              <div>
                <div className="nickname-label">Recipient</div>
                <div className="openings-luge nickname-value">{recipient}</div>
              </div>
              <div>
                <div className="nickname-label">Nickname</div>
                <div className="openings-luge nickname-value">{eas}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="cordobas-ouzo">
          <div>
            <div className="swiveled-cry">Compose</div>
            <div className="pater-hear">
              <div className="swoop-bit">
                <textarea
                  ref={textareaRef}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Type message"
                  rows={4}
                />

                <QuickEmojiBar
                  onEmojiSelect={insertAtCursor}
                  onMore={() => setOpen(!open)}
                />

                {open && (
                  <div className="emoji-picker-popover">
                    <Picker
                      data={data}
                      onEmojiSelect={(e) => insertAtCursor(e.native)}
                      previewPosition="none"
                      skinTonePosition="none"
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="gonapod-box">
              {hasEmoji ? <TickIcon width={25} height={25} fill="#74cd75" /> : <PuffLoader size={16} />}
              <div className={hasEmoji ? "shoed-mud emoji" : "shoed-mud"}>Add at least one emoji to enable tracking</div>
            </div>
            {hasEmoji && <div style={{ marginTop: "10px" }} className="gonapod-box">
              {hasCopied ? <TickIcon width={25} height={25} fill="#74cd75" /> : <PuffLoader size={16} />}
              <div className={hasCopied ? "shoed-mud emoji" : "shoed-mud"}>
                Copy your email
              </div>
            </div>}
            {(hasEmoji && hasCopied) && <div style={{ marginTop: "10px" }} className="gonapod-box">
              {hasPasted ? <TickIcon width={25} height={25} fill="#74cd75" /> : <PuffLoader size={16} />}
              <div className={hasPasted ? "shoed-mud emoji" : "shoed-mud"}>Send to recipient from your email app</div>
              <div className="tidings-did">
                <div onClick={() => window.open("https://mail.google.com", "_blank", "noreferrer")}>Gmail</div>
                <div onClick={() => window.open("https://outlook.live.com", "_blank", "noreferrer")}>Outlook</div>
                <div onClick={() => window.open("https://mail.yahoo.com", "_blank", "noreferrer")}>Yahoo</div>
                <div>etc</div>
              </div>
            </div>}
          </div>
          <div>
            <>
              <div className="sifters-from swiveled-cry">Preview</div>

              <div className="vouchees-awes premium-preview">
                <div
                  className="preview-content"
                  ref={contentRef}
                  dangerouslySetInnerHTML={{
                    __html: textToTwemojiHtml(text, tid),
                  }}
                />

                <button
                  ref={copyButtonRef}
                  className={hasEmoji ? "shyer-fell" : "shyer-fell disabled"}
                  disabled={!hasEmoji}
                  onClick={handleCopy}
                >
                  <div className="coelom-resh left"></div>
                  <div className="coelom-resh right"></div>
                  <span className="copy-inner">
                    {copied ? <TickIcon width={21} height={21} /> : <CopyIcon width={21} height={21} />}
                    <span className="copy-text">{copied ? "Copied" : "Copy"}</span>
                  </span>
                </button>
              </div>
            </>
          </div>
        </div>
        <div className="cardia-ess">
          <button onClick={() => setPopup(true)} disabled={!hasPasted}>
            Next Step
            <RightArrow className="elegits-yip" />
          </button>
        </div>
      </div>
      {showCopyGuide && copyButtonRect && (
        <div className="copy-guide-overlay">

          {/* Spotlight */}
          <div
            className="copy-guide-spotlight"
            style={{
              top: copyButtonRect.top - 10,
              left: copyButtonRect.left - 10,
              width: copyButtonRect.width + 20,
              height: copyButtonRect.height + 20
            }}
          />

          {/* Pointer / message */}
          <div
            className="copy-guide-tooltip"
            style={{
              top: copyButtonRect.top + copyButtonRect.height + 24,
              left: Math.max(
                20,
                copyButtonRect.left +
                copyButtonRect.width / 2 -
                145
              )
            }}
          >
            <div className="copy-guide-arrow" />

            <div className="copy-guide-icon">
              <CopyIcon width={19} height={19} />
            </div>

            <div className="copy-guide-content">
              <div className="copy-guide-title">
                Your email is ready
              </div>

              <div className="copy-guide-message">
                Click <strong>Copy</strong> to copy the
                trackable email to your clipboard.
              </div>
            </div>

            <button
              className="copy-guide-ok"
              onClick={() => {
                setShowCopyGuide(false)
                setCopyGuideSeen(true)
                localStorage.setItem(
                  "copy_tutorial_seen",
                  "true"
                )
              }}
            >
              OK
            </button>
          </div>

        </div>
      )}
    </div>
  )
}

export default CreateMessage
