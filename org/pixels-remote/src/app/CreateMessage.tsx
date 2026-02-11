import "./css/CreateMessage.css"
import { RightArrow } from "../assets/Icons.jsx"
import { useAtom } from 'jotai';
import { composeAtom } from '@org/shared-state';
import { useEffect, useRef, useState } from "react";
import axios from "../config/backend"
import { StickerIcon, CopyIcon, TickIcon } from "../assets/Icons.jsx"
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data"
import { parse } from "twemoji-parser";
import { PuffLoader } from "react-spinners";

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
      src="https://ephemera-wglj.onrender.com/api/Image/${unified}.png"
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


const CreateMessage = () => {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [hasEmoji, setHasEmoji] = useState(false)
  const [hasCopied, setHasCopied] = useState(false)
  const [hasPasted, setHasPasted] = useState(false)

  const [text, setText] = useAtom(composeAtom)

  const { eas } = useParams()

  const { state } = useLocation()

  const navigate = useNavigate()

  const tid = state.tid

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
        // Use a custom attribute or modify the src string directly
        firstImg.setAttribute("src", `${src}?tid=${tid}`);
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

    console.log({ data })

    if (data.success && data.paste) {
      setHasPasted(true)
    }
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
    setHasCopied(false)

    const valid = hasNativeEmoji(text)

    if (valid) {
      setHasEmoji(true)

      return
    }

    setHasEmoji(false)
  }, [text])

  useEffect(() => {
    if (hasCopied === false) {
      togglePaste(false)

      return
    }

    if (hasPasted) {
      return
    }

    // Copied is true, check if user pastes into client
    const interval = setInterval(() => {
      hasPaste()
    }, 4000)

    return () => clearInterval(interval)
  }, [hasCopied, hasPasted])

  return (
    <div className="_6pzh">
      <div onClick={() => navigate(-1)} className="flamen-vow">
        <RightArrow className="shuns-ropy" fill="rgb(84, 183, 219)" />
        <div>New E-mail</div>
      </div>
      <div className="gaped-hex">
        <div>Nickname</div>
        <div className="openings-luge">{eas}</div>
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

              <button onClick={() => setOpen(!open)}>
                <StickerIcon className="jocund-zone" />
              </button>

              {open && (
                <div style={{ position: "absolute", bottom: 50, zIndex: 1000 }}>
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
            <div className={hasCopied ? "shoed-mud emoji" : "shoed-mud"}>Copy your email</div>
          </div>}
          {(hasEmoji && hasCopied) && <div style={{ marginTop: "10px" }} className="gonapod-box">
            {hasPasted ? <TickIcon width={25} height={25} fill="#74cd75" /> : <PuffLoader size={16} />}
            <div className={hasPasted ? "shoed-mud emoji" : "shoed-mud"}>Send it from your email app</div>
          </div>}
        </div>
        <div>
          <>
            <div className="sifters-from swiveled-cry">Preview</div>
            <div className="vouchees-awes">
              <div
                ref={contentRef}
                dangerouslySetInnerHTML={{
                  __html: textToTwemojiHtml(text, tid),
                }}
              />
              <button className={hasEmoji ? "shyer-fell" : "shyer-fell disabled"} disabled={!hasEmoji} onClick={handleCopy}>
                {copied ? <TickIcon width={21} height={21} /> : <CopyIcon width={21} height={21} />}
                <div>{copied ? "copied" : "copy"}</div>
              </button>
            </div>
          </>
        </div>
      </div>
    </div>
  )
}

export default CreateMessage
