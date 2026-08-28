import "./css/QuickMode.css"
import { useState, useEffect, useRef } from "react"
import { parse } from "twemoji-parser"
import Picker from "@emoji-mart/react"
import data from "@emoji-mart/data"
import axios from "../config/backend"
import TrackingActive from "./TrackingActive"

const Logo = "https://res.cloudinary.com/dkcyztevs/image/upload/f_auto,q_auto/Logo_tcmc8s"

const reactions = [
    "👍",
    "❤️",
    "😂",
    "😮",
    "😢",
    "😡",
    "🎉",
    "🔥"
]

function getUnifiedFromUrl(url: string) {
    return url.split("/").pop()?.replace(".svg", "");
}

function getTwemojiUrl(emoji) {
    const entities = parse(emoji)

    if (!entities.length) return null

    const unified = getUnifiedFromUrl(entities[0].url)

    return `https://lookup.trackpixels.online/api/Focus/${unified}.png`
}

const getEmojiBackground = (imageSrc) => {
    return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = imageSrc;

        img.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            canvas.width = img.width;
            canvas.height = img.height;

            ctx.drawImage(img, 0, 0);

            const { data } = ctx.getImageData(
                0,
                0,
                canvas.width,
                canvas.height
            );

            let r = 0;
            let g = 0;
            let b = 0;
            let count = 0;

            for (let i = 0; i < data.length; i += 4) {
                const alpha = data[i + 3];

                // Ignore transparent pixels
                if (alpha > 50) {
                    r += data[i];
                    g += data[i + 1];
                    b += data[i + 2];
                    count++;
                }
            }

            r = Math.round(r / count);
            g = Math.round(g / count);
            b = Math.round(b / count);

            // Mix the emoji color heavily with white
            const mix = 0.82;

            r = Math.round(r + (255 - r) * mix);
            g = Math.round(g + (255 - g) * mix);
            b = Math.round(b + (255 - b) * mix);

            resolve(`rgb(${r}, ${g}, ${b})`);
        };
    });
};

function EmojiPreview({ selectedEmoji }) {
    const [background, setBackground] = useState("#f5f5f5");

    useEffect(() => {
        const emojiUrl = getTwemojiUrl(selectedEmoji);

        getEmojiBackground(emojiUrl).then((color) => {
            setBackground(color);
        });
    }, [selectedEmoji]);

    return (
        <div
            className="ebooks-pelf"
            style={{
                backgroundColor: background
            }}
        >
            <img
                width={35}
                height={35}
                src={getTwemojiUrl(selectedEmoji)}
                alt={selectedEmoji}
            />
        </div>
    );
}

function escapeHtml(str: string) {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;")
        .replace(/\n/g, "<br>");
}

function textToTwemojiHtml(
    text: string
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
            src="https://lookup.trackpixels.online/api/Focus/${unified}.png"
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

const QuickMode = ({ hidden }) => {
    const [selectedEmoji, setSelectedEmoji] = useState("")
    const [pickerOpen, setPickerOpen] = useState(false)
    const [emailDetected, setEmailDetected] = useState(false)
    const [copyToast, setCopyToast] = useState(false)
    const [tracking, setTracking] = useState(false)

    const contentRef = useRef(null)

    const toastTimerRef = useRef(null)

    const handleAfterlife = async () => {
        const hash = localStorage.getItem("hash")

        const { data, status } = await axios.post("/Focus/enable-tracking", { hash, text: selectedEmoji })

        if (data.success) {
            setTracking(true)

            localStorage.setItem("has-fire", "true")
        }
    }

    const handleCopy = async () => {
        if (!contentRef.current) return;

        const hash = localStorage.getItem("hash")

        // 1. Use DOMParser instead of creating a div element
        const parser = new DOMParser();
        const doc = parser.parseFromString(contentRef.current.innerHTML, "text/html");

        // 2. Modify the image in the virtual document
        const firstImg = doc.querySelector("img");

        if (firstImg) {
            const src = firstImg.getAttribute("src");
            if (src && !src.includes("hash=")) {
                const unique = crypto.randomUUID()

                // Use a custom attribute or modify the src string directly
                firstImg.setAttribute("src", `${src}?hash=${hash}&r=${unique}`);
            }
        }

        // 3. Extract the modified HTML and plain text
        const html = doc.body.innerHTML
        const text = doc.body.textContent?.trim() || firstImg?.getAttribute("alt") || "🙂"

        try {
            await navigator.clipboard.write([
                new ClipboardItem({
                    "text/html": new Blob([html], { type: "text/html" }),
                    "text/plain": new Blob([text], { type: "text/plain" }),
                }),
            ]);

            setCopyToast(true)

            clearTimeout(toastTimerRef.current)

            toastTimerRef.current = setTimeout(() => {
                setCopyToast(false)
            }, 3000)
        } catch (err) {
            console.error("Copy failed", err);
        }
    };

    const createHash = async () => {
        const { data, status } = await axios.get("/Focus/prepare-hash")

        if (data.success) {
            localStorage.setItem("hash", data.hash)
        }
    }

    const togglePaste = async (paste) => {
        const hash = localStorage.getItem("hash")

        const { data, status } = await axios.post("/Focus/toggle-copy", { hash, paste })

        if (data.success) {
            setEmailDetected(false)
        }
    }

    const hasPaste = async () => {
        const hash = localStorage.getItem("hash")

        const { data, status } = await axios.post("/Focus/has-paste", { hash })

        if (data.success && data.paste) {
            setEmailDetected(true)
        }
    }

    useEffect(() => {
        const fire = localStorage.getItem("has-fire")

        if (fire === "true") {
            setTracking(true)
        }

        const interval = setInterval(() => {
            hasPaste()
        }, 3000)

        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        const hash = localStorage.getItem("hash")

        if (hash === null && tracking === false) {
            createHash()
        }
    }, [tracking])

    useEffect(() => {
        if (emailDetected) {
            togglePaste(false)
        }
    }, [selectedEmoji])

    const setPopup = (e) => {
        setEmailDetected(e)
        setTracking(e)
    }

    return tracking ? (
        <TrackingActive
            className={hidden ? "_3ult hidden" : "_3ult"}
            setPopup={setPopup}
        />
    ) : (
        <div
            className={hidden ? "_2dja hidden" : "_2dja"}
            onClick={() => setPickerOpen(false)}
        >
            <div
                style={{ display: "none" }}
                ref={contentRef}
                dangerouslySetInnerHTML={{
                    __html: textToTwemojiHtml(selectedEmoji),
                }}
            />
            <div className="block-kiss">
                <div className="trebly-oat">
                    <img className="steep-hiss" src={Logo} alt="Logo" />
                    <div>
                        <div>Track Pixels</div>
                        <div className="tabarded-tux">Send Magic • Track Everything</div>
                    </div>
                </div>
                <div className="gawkier-pal">

                    {/* STEP 1 */}
                    <div className="emoji-step">
                        <div className="step-title">
                            <span className="step-badge">01</span>

                            <div className="step-text">
                                <span className="step-label">STEP ONE</span>
                                <h2>Pick an emoji</h2>
                            </div>
                        </div>

                        <p className="step-description">
                            Choose a reaction or add your own emoji.
                        </p>

                        <div className="emoji-grid-shell">
                            <div className="emoji-grid">
                                {reactions.map((emoji, index) => (
                                    <button
                                        className={`emoji-cell ${selectedEmoji === emoji ? "selected" : ""
                                            }`}
                                        key={index}
                                        type="button"
                                        aria-label={`Reaction ${emoji}`}
                                        onClick={() => setSelectedEmoji(emoji)}
                                    >
                                        <span className="emoji">
                                            <img
                                                width={35}
                                                height={35}
                                                src={getTwemojiUrl(emoji)}
                                                alt={emoji}
                                            />
                                        </span>
                                    </button>
                                ))}

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setPickerOpen(prev => !prev);
                                    }}
                                    className="emoji-cell add-cell"
                                    type="button"
                                    aria-label="Add reaction"
                                >
                                    <span className="plus-icon">+</span>
                                </button>

                                {pickerOpen && (
                                    <div className="emoji-picker-popover">
                                        <Picker
                                            data={data}
                                            onEmojiSelect={(e) => {
                                                setSelectedEmoji(e.native);
                                                setPickerOpen(false);
                                            }}
                                            previewPosition="none"
                                            skinTonePosition="none"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>


                    {/* CONNECTOR */}
                    <div className="workflow-divider">
                        <span className="workflow-line"></span>

                        <span className="workflow-arrow">
                            →
                        </span>
                    </div>


                    {/* STEP 2 */}
                    <div className="eutaxies-gnus">

                        <div className="step-title">
                            <span className="step-badge">02</span>

                            <div className="step-text">
                                <span className="step-label">STEP TWO</span>
                                <h2>Your tracked emoji</h2>
                            </div>
                        </div>

                        <p className="step-description">
                            Copy it and paste it into your email to start tracking.
                        </p>

                        <div className="tracked-result">

                            <EmojiPreview selectedEmoji={selectedEmoji} />

                            <div className="tracked-emoji-info">

                                <div className="tracking-ready">
                                    <span></span>
                                    Ready to copy
                                </div>

                                <button
                                    className="copy-button"
                                    type="button"
                                    onClick={handleCopy}
                                >
                                    <span>Copy emoji</span>

                                    <svg
                                        viewBox="0 0 24 24"
                                        width="16"
                                        height="16"
                                        fill="none"
                                        aria-hidden="true"
                                    >
                                        <rect
                                            x="9"
                                            y="9"
                                            width="11"
                                            height="11"
                                            rx="2"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                        />

                                        <path
                                            d="M15 9V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h4"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                </button>

                            </div>

                        </div>
                    </div>

                    <div className="workflow-divider">
                        <div className="workflow-line" />
                        <div className="workflow-arrow">→</div>
                    </div>

                    <div className={`send-step ${emailDetected ? "email-detected" : ""}`}>
                        <div className="step-title">
                            <span className="step-badge step-three-badge">
                                <span className="step-number">03</span>

                                <svg
                                    className="step-check"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    aria-hidden="true"
                                >
                                    <path
                                        d="M6 12.5 10 16l8-8"
                                        stroke="currentColor"
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </span>

                            <div className="step-text">
                                <span className="step-label">
                                    {emailDetected ? "PASTE DETECTED" : "FINAL STEP"}
                                </span>

                                <h2>
                                    {emailDetected ? "Ready to activate" : "Paste and send"}
                                </h2>
                            </div>
                        </div>

                        <p className="step-description">
                            Paste your copied emoji into your email and send it normally using
                            Gmail, Yahoo, Outlook, or another email client.
                        </p>

                        <div className="email-clients">
                            <div className="email-client">
                                <span className="client-icon">G</span>
                                <span>Gmail</span>
                            </div>

                            <div className="email-client">
                                <span className="client-icon">Y</span>
                                <span>Yahoo</span>
                            </div>

                            <div className="email-client">
                                <span className="client-icon">O</span>
                                <span>Outlook</span>
                            </div>
                        </div>

                        <div className={`paste-status ${emailDetected ? "detected" : ""}`}>
                            <div className="paste-status-icon">
                                {emailDetected ? (
                                    <svg
                                        viewBox="0 0 24 24"
                                        width="14"
                                        height="14"
                                        fill="none"
                                        aria-hidden="true"
                                    >
                                        <path
                                            d="M6 12.5 10 16l8-8"
                                            stroke="currentColor"
                                            strokeWidth="2.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                ) : (
                                    <span className="status-pulse" />
                                )}
                            </div>

                            <div>
                                <strong>
                                    {emailDetected
                                        ? "Emoji detected!"
                                        : "Waiting for your emoji..."}
                                </strong>

                                <p>
                                    {emailDetected
                                        ? "Your tracked emoji was detected in an email client."
                                        : "Paste the copied emoji into your email to continue."}
                                </p>
                            </div>
                        </div>

                        <button
                            className="sent-button"
                            type="button"
                            disabled={!emailDetected}
                            onClick={() => {
                                if (!emailDetected) return
                                handleAfterlife()
                            }}
                        >
                            <span>
                                {emailDetected ? "I've sent the email" : "Waiting for paste"}
                            </span>

                            <svg
                                viewBox="0 0 24 24"
                                width="17"
                                height="17"
                                fill="none"
                                aria-hidden="true"
                            >
                                <path
                                    d="M5 12h13"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                />

                                <path
                                    d="m13 6 6 6-6 6"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
                <div className="tracking-flow">
                    <div className="tracking-flow-header">
                        <span className="tracking-eyebrow">
                            HOW IT WORKS
                        </span>

                        <p>
                            One tiny emoji connects your email to meaningful insights.
                        </p>
                    </div>

                    <div className="tracking-journey">
                        <div className="journey-step">
                            <div className="journey-icon emoji-icon">
                                {selectedEmoji || "😊"}
                            </div>

                            <div className="journey-content">
                                <strong>Choose</strong>
                                <span>Pick your emoji</span>
                            </div>
                        </div>

                        <div className="journey-line">
                            <span className="journey-pulse" />
                        </div>

                        <div className="journey-step">
                            <div className="journey-icon">
                                <svg
                                    viewBox="0 0 24 24"
                                    width="20"
                                    height="20"
                                    fill="none"
                                    aria-hidden="true"
                                >
                                    <rect
                                        x="3"
                                        y="5"
                                        width="18"
                                        height="14"
                                        rx="3"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                    />

                                    <path
                                        d="m4 7 8 6 8-6"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </div>

                            <div className="journey-content">
                                <strong>Send</strong>
                                <span>Use your email client</span>
                            </div>
                        </div>

                        <div className="journey-line">
                            <span className="journey-pulse delay" />
                        </div>

                        <div className="journey-step">
                            <div className="journey-icon tracking-icon">
                                <svg
                                    viewBox="0 0 24 24"
                                    width="20"
                                    height="20"
                                    fill="none"
                                    aria-hidden="true"
                                >
                                    <path
                                        d="M4 19V10"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                    />

                                    <path
                                        d="M10 19V5"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                    />

                                    <path
                                        d="M16 19v-8"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                    />

                                    <path
                                        d="M22 19V8"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                    />
                                </svg>
                            </div>

                            <div className="journey-content">
                                <strong>Track</strong>
                                <span>See what happens next</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div
                className={`copy-toast ${copyToast ? "show" : ""}`}
                role="status"
            >
                <div className="copy-toast-icon">
                    <svg
                        viewBox="0 0 24 24"
                        width="18"
                        height="18"
                        fill="none"
                        aria-hidden="true"
                    >
                        <path
                            d="M5 12.5 9.5 17 19 7"
                            stroke="currentColor"
                            strokeWidth="2.4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>

                <div className="copy-toast-content">
                    <strong>Emoji copied!</strong>
                    <span>Now paste it into your email.</span>
                </div>

                <div className="copy-toast-progress" />
            </div>
        </div>
    )
}

export default QuickMode
