import { useEffect, useMemo, useState } from "react"
import "./css/TrackingActive.css"
import axios from "../config/backend"
import { parse } from "twemoji-parser"

const Logo = new URL('../assets/Logo-transparent.png', import.meta.url).href

const formatDate = (date) => {

    if (!date) {
        return "—"
    }

    const parsedDate = new Date(date)

    if (Number.isNaN(parsedDate.getTime())) {
        return "—"
    }

    return new Intl.DateTimeFormat("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit"
    }).format(parsedDate)
}

const getRelativeTime = (date) => {

    /*
        IMPORTANT FIX:
 
        Don't calculate time if there is no date.
    */

    if (!date) {
        return "Not opened yet"
    }

    const timestamp =
        new Date(date).getTime()

    if (Number.isNaN(timestamp)) {
        return "Not opened yet"
    }

    const difference =
        Date.now() - timestamp

    /*
        Future date protection.
    */

    if (difference < 0) {
        return "Just now"
    }

    const seconds =
        Math.floor(difference / 1000)

    if (seconds < 60) {
        return "Just now"
    }

    const minutes =
        Math.floor(seconds / 60)

    if (minutes < 60) {
        return `${minutes} min ago`
    }

    const hours =
        Math.floor(minutes / 60)

    if (hours < 24) {
        return `${hours}h ago`
    }

    const days =
        Math.floor(hours / 24)

    return `${days}d ago`
}

const getBrowser = (ua = "") => {

    if (!ua) {
        return "Unknown"
    }

    if (/Edg/i.test(ua)) {
        return "Microsoft Edge"
    }

    if (/Firefox/i.test(ua)) {
        return "Firefox"
    }

    if (/Chrome/i.test(ua)) {
        return "Google Chrome"
    }

    if (/Safari/i.test(ua)) {
        return "Safari"
    }

    return "Unknown browser"
}


const getDevice = (ua = "") => {

    if (!ua) {
        return "Unknown device"
    }

    if (/iPhone/i.test(ua)) {
        return "iPhone"
    }

    if (/Android/i.test(ua)) {
        return "Android device"
    }

    if (/iPad/i.test(ua)) {
        return "iPad"
    }

    if (/Mobile/i.test(ua)) {
        return "Mobile device"
    }

    return "Desktop device"
}


function getUnifiedFromUrl(url: string) {
    return url.split("/").pop()?.replace(".svg", "");
}

function getTwemojiUrl(emoji) {
    const entities = parse(emoji)

    if (!entities.length) return null

    const unified = getUnifiedFromUrl(entities[0].url)

    return `https://lookup.trackpixels.online/api/Focus/${unified}.png`
}

const TrackingActive = ({ className, setPopup }) => {
    const [showDestroyModal, setShowDestroyModal] = useState(false)
    const [destroying, setDestroying] = useState(false)
    const [loading, setLoading] = useState(false)

    const [track, setTrack] = useState({})

    const hash = localStorage.getItem("hash")

    const visits = Array.isArray(track?.unix)
        ? track.unix
        : []

    const latestVisit =
        visits.length > 0
            ? visits[0]
            : null

    const fetchStatus = async (showLoader = false) => {
        if (showLoader) {
            setLoading(true)
        }

        const { data, status } = await axios.post("/Focus/track-boat", { hash })

        if (data.success) {
            setTrack(data.data)
        }

        if (showLoader) {
            setLoading(false)
        }
    }

    const togglePaste = async (paste) => {
        const hash = localStorage.getItem("hash")

        const { data, status } = await axios.post("/Focus/toggle-copy", { hash, paste })
    }

    useEffect(() => {

        // First page load → show loader
        fetchStatus(true)

        // Subsequent polling → don't show loader
        const interval = setInterval(() => {
            fetchStatus(false)
        }, 3000)

        return () => clearInterval(interval)
    }, [])

    const handleDestroy = async () => {
        await togglePaste(false)

        localStorage.removeItem("hash")
        localStorage.removeItem("has-fire")

        setShowDestroyModal(false)
        setPopup(false)
    }


    const hasOpened =
        visits.length > 0

    return (
        <div className={className}>
            {loading ? <div className="top-loader" /> : undefined}
            <div>
                <div className="tracking-page">


                    {/* =========================
                BACKGROUND
            ========================= */}

                    <div className="tracking-bg-orb orb-one" />
                    <div className="tracking-bg-orb orb-two" />
                    <div className="tracking-bg-grid" />


                    {/* =========================
                TOP BAR
            ========================= */}

                    <header className="tracking-header">
                        <div className="block-kiss">
                            <div className="trebly-oat">
                                <img className="steep-hiss" src={Logo} alt="Logo" />
                                <div>
                                    <div>Track Pixels</div>
                                    <div className="tabarded-tux">Send Magic • Track Everything</div>
                                </div>
                            </div>
                        </div>
                        <div className="header-right">

                            <div className="tracking-live">

                                <span className="live-indicator" />

                                Tracking active

                            </div>


                            <button
                                className="destroy-trigger"
                                onClick={() =>
                                    setShowDestroyModal(true)
                                }
                            >
                                Destroy tracker
                            </button>

                        </div>

                    </header>


                    {/* =========================
                MAIN CONTENT
            ========================= */}

                    <main className="tracking-shell">


                        {/* =========================
                    HERO
                ========================= */}

                        <section className="tracking-hero">

                            <div className="hero-content">

                                <span className="section-label">
                                    TRACKING DASHBOARD
                                </span>

                                <h2>
                                    Your email is being
                                    <span> watched.</span>
                                </h2>

                                <p>
                                    Your tracker is active and ready.
                                    We'll record activity when the recipient's
                                    email client loads your tracked emoji.
                                </p>

                            </div>


                            {/* EMOJI CARD */}


                        </section>

                        <section className="tracking-stats-grid">


                            <div className="stat-card">

                                <div className="stat-icon">
                                    ◷
                                </div>

                                <div>

                                    <span>
                                        TRACKING STARTED
                                    </span>

                                    <strong>
                                        {formatDate(track.firefox)}
                                    </strong>

                                </div>

                            </div>


                            <div className="stat-card">

                                <div className="stat-icon">
                                    <img width={25} height={25} src={getTwemojiUrl(track.text)} alt={track.text} />
                                </div>

                                <div>

                                    <span>
                                        TOTAL OPENS
                                    </span>

                                    <strong>
                                        {visits.length}
                                    </strong>

                                </div>

                            </div>


                            <div className="stat-card">

                                <div className="stat-icon">
                                    ↗
                                </div>

                                <div>

                                    <span>
                                        LAST ACTIVITY
                                    </span>

                                    <strong>

                                        {hasOpened
                                            ? getRelativeTime(
                                                latestVisit?.timestamp
                                            )
                                            : "Not opened yet"
                                        }

                                    </strong>

                                </div>

                            </div>

                        </section>

                        <section
                            className={`
                        current-status
                        ${hasOpened
                                    ? "opened"
                                    : "waiting"
                                }
                    `}
                        >

                            <div className="status-main">

                                <div className="status-symbol">
                                    {hasOpened ? (
                                        <svg
                                            viewBox="0 0 24 24"
                                            aria-hidden="true"
                                            className="status-check"
                                        >
                                            <path d="M5 12.5L9.5 17L19 7" />
                                        </svg>
                                    ) : (
                                        "◌"
                                    )}
                                </div>


                                <div>
                                    <span className="section-label">
                                        CURRENT STATUS
                                    </span>

                                    <h3>

                                        {hasOpened
                                            ? `Opened ${getRelativeTime(
                                                latestVisit?.timestamp
                                            )}`
                                            : "Waiting for an open"
                                        }

                                    </h3>

                                    <p>

                                        {hasOpened
                                            ? "Great news! Your tracked emoji was loaded by the recipient."
                                            : "No opens have been detected yet. Your tracker is listening for activity."
                                        }

                                    </p>

                                </div>

                            </div>

                        </section>

                        {/* =========================
                    CONTENT
                ========================= */}

                        <section className="dashboard-grid">


                            {/* =====================
                        OPEN HISTORY
                    ===================== */}

                            <section className="dashboard-card history-card">

                                <div className="card-header">

                                    <div>

                                        <span className="section-label">
                                            ACTIVITY
                                        </span>

                                        <h3>
                                            Open history
                                        </h3>

                                    </div>


                                    <span className="event-count">

                                        {visits.length} event
                                        {visits.length !== 1
                                            ? "s"
                                            : ""
                                        }

                                    </span>

                                </div>


                                {!hasOpened ? (

                                    <div className="waiting-state">

                                        <div className="radar">

                                            <span className="radar-circle radar-1" />
                                            <span className="radar-circle radar-2" />
                                            <span className="radar-circle radar-3" />

                                            <div className="radar-center">
                                                {track.text}
                                            </div>

                                        </div>


                                        <h4>
                                            Still listening...
                                        </h4>

                                        <p>
                                            Your emoji tracker is active.
                                            Activity will appear here when
                                            someone opens the email.
                                        </p>

                                    </div>

                                ) : (

                                    <div className="history-list">

                                        {visits.map(
                                            (visit, index) => (

                                                <div
                                                    className="history-item"
                                                    key={
                                                        visit.timestamp ||
                                                        index
                                                    }
                                                >

                                                    <div className="timeline">

                                                        <span className="timeline-dot" />

                                                        {index !==
                                                            visits.length - 1 && (

                                                                <span className="timeline-line" />

                                                            )}

                                                    </div>


                                                    <div className="history-content">

                                                        <div className="history-top">

                                                            <div>

                                                                <h4>
                                                                    Email opened
                                                                </h4>

                                                                <p>

                                                                    {getDevice(
                                                                        visit.ua
                                                                    )}

                                                                </p>

                                                            </div>


                                                            <span className="history-relative">

                                                                {getRelativeTime(
                                                                    visit.timestamp
                                                                )}

                                                            </span>

                                                        </div>


                                                        <div className="history-tags">

                                                            <span>

                                                                IP

                                                                <strong>
                                                                    {visit.ip}
                                                                </strong>

                                                            </span>


                                                            <span>

                                                                Browser

                                                                <strong>

                                                                    {getBrowser(
                                                                        visit.ua
                                                                    )}

                                                                </strong>

                                                            </span>

                                                        </div>


                                                        <time>

                                                            {formatDate(
                                                                visit.timestamp
                                                            )}

                                                        </time>

                                                    </div>

                                                </div>

                                            )
                                        )}

                                    </div>

                                )}

                            </section>


                            {/* =====================
                        VISITOR DETAILS
                    ===================== */}

                            <aside className="dashboard-card visitor-card">

                                <div className="card-header">

                                    <div>

                                        <span className="section-label">
                                            LATEST VISITOR
                                        </span>

                                        <h3>
                                            Visitor details
                                        </h3>

                                    </div>

                                </div>


                                {!hasOpened ? (

                                    <div className="visitor-waiting">

                                        <div className="visitor-placeholder">

                                            ◌

                                        </div>

                                        <h4>
                                            No visitor yet
                                        </h4>

                                        <p>
                                            Visitor information will appear
                                            here after the first detected open.
                                        </p>

                                    </div>

                                ) : (

                                    <div className="visitor-data">


                                        <div className="visitor-device">

                                            <div className="device-icon">

                                                {getDevice(
                                                    latestVisit.ua
                                                ).includes("Mobile")
                                                    ? "▯"
                                                    : "▣"
                                                }

                                            </div>


                                            <div>

                                                <strong>

                                                    {getDevice(
                                                        latestVisit.ua
                                                    )}

                                                </strong>

                                                <span>
                                                    Latest detected visitor
                                                </span>

                                            </div>

                                        </div>


                                        <div className="visitor-row">

                                            <span>
                                                IP address
                                            </span>

                                            <strong>
                                                {latestVisit.ip || "Unknown"}
                                            </strong>

                                        </div>


                                        <div className="visitor-row">

                                            <span>
                                                Browser
                                            </span>

                                            <strong>

                                                {getBrowser(
                                                    latestVisit.ua
                                                )}

                                            </strong>

                                        </div>


                                        <div className="visitor-row">

                                            <span>
                                                Opened
                                            </span>

                                            <strong>

                                                {getRelativeTime(
                                                    latestVisit.timestamp
                                                )}

                                            </strong>

                                        </div>


                                        <div className="user-agent">

                                            <span>
                                                USER AGENT
                                            </span>

                                            <p>

                                                {latestVisit.ua ||
                                                    "Not available"
                                                }

                                            </p>

                                        </div>

                                    </div>

                                )}


                                <div className="tracking-info">

                                    <div>
                                        ✦
                                    </div>

                                    <p>
                                        Data is recorded when the recipient's
                                        email client requests the tracked emoji.
                                    </p>

                                </div>

                            </aside>

                        </section>


                        {/* =========================
                    DESTROY SECTION
                ========================= */}

                        <section className="tracker-actions">

                            <div>

                                <span className="section-label">
                                    START OVER
                                </span>

                                <h3>
                                    Want to track another email?
                                </h3>

                                <p>
                                    You can permanently destroy this tracker
                                    and create a brand new one.
                                </p>

                            </div>


                            <button
                                className="create-new-button"
                                onClick={() =>
                                    setShowDestroyModal(true)
                                }
                            >

                                <span>
                                    Create new tracker
                                </span>

                                →

                            </button>

                        </section>


                    </main>


                    {/* =========================
                DESTROY MODAL
            ========================= */}

                    {showDestroyModal && (

                        <div className="destroy-overlay">

                            <div className="destroy-modal">


                                <div className="destroy-icon">

                                    <span>
                                        ×
                                    </span>

                                </div>


                                <span className="section-label danger-label">
                                    DESTROY TRACKER
                                </span>


                                <h2>
                                    Start fresh?
                                </h2>


                                <p>
                                    This will permanently destroy your current
                                    tracker and its recorded activity.
                                    You won't be able to recover it.
                                </p>


                                <div className="destroy-warning">

                                    <span>
                                        ⚠
                                    </span>

                                    <p>
                                        Make sure you no longer need this
                                        tracking information.
                                    </p>

                                </div>


                                <div className="destroy-actions">

                                    <button
                                        className="cancel-destroy"
                                        disabled={destroying}
                                        onClick={() =>
                                            setShowDestroyModal(false)
                                        }
                                    >
                                        Keep tracker
                                    </button>


                                    <button
                                        className="confirm-destroy"
                                        disabled={destroying}
                                        onClick={handleDestroy}
                                    >

                                        {destroying
                                            ? "Destroying..."
                                            : "Destroy & create new"
                                        }

                                    </button>

                                </div>

                            </div>

                        </div>

                    )}


                </div>
            </div>
        </div>
    )
}

export default TrackingActive
