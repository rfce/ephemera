import { RightArrow } from "../assets/Icons";
import "./css/Dashboard.css";
import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import { useAtom } from "jotai";
import { composeAtom } from "@org/shared-state";
import { useNavigate } from "react-router-dom";
import axios from "../config/backend";
import ProfileMenu from "./ProfileMenu";

const Logo = new URL('../assets/Logo-transparent.png', import.meta.url).href

/* Three static slots: every page shows these same icons in the same positions */
const SLOTS = [
    { icon: "chat" },
    { icon: "doc" },
    { icon: "people" },
];

const PAGE_SIZE = 3;
const OUT_MS = 320; // slide-out duration (+ stagger)
const LOCK_MS = 800; // time before another page switch is allowed
const FETCH_DEBOUNCE_MS = 300; // wait after typing before asking the server for suggestions
const MAX_SUGGESTIONS = 8;
const ERROR_TOAST_MS = 5000;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const getStoredRecipient = () => {
    try {
        return localStorage.getItem("recipient") || "";
    } catch {
        return "";
    }
};

/* ---------- JWT (no library needed) ----------
   A JWT is three base64url parts: header.payload.signature. The payload is plain JSON,
   so we can read it with atob. This only DISPLAYS the name; it does not verify the
   signature (the server does that on every API call). */
const decodeJwt = (token) => {
    try {
        const clean = String(token || "").replace(/^"|"$/g, "").replace(/^Bearer\s+/i, "");
        const part = clean.split(".")[1];
        if (!part) return null;
        const b64 = part.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(part.length / 4) * 4, "=");
        // atob gives a binary string; this re-decodes it as UTF-8 so names like "José" survive
        const json = decodeURIComponent(
            atob(b64)
                .split("")
                .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
                .join("")
        );
        return JSON.parse(json);
    } catch {
        return null;
    }
};

/* Pick a friendly first name from whichever claim your backend puts in the token */
const getUsername = () => {
    let token = "";
    try {
        token = localStorage.getItem("token") || "";
    } catch { /* storage unavailable */ }

    const p = decodeJwt(token);
    if (!p) return "";

    const raw =
        p.name || p.fullName || p.username || p.userName || p.given_name || p.firstName ||
        (typeof p.email === "string" ? p.email.split("@")[0] : "");
    const first = String(raw || "").trim().split(/[\s._-]+/)[0];
    return first ? first.charAt(0).toUpperCase() + first.slice(1) : "";
};

const getSalutation = () => {
    const h = new Date().getHours();
    if (h < 5) return "Hello";
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
};

/* Cut at a word boundary where possible (never returns a stray "...") */
const truncate = (str = "", max = 60) => {
    if (str.length <= max) return str;
    const sliced = str.slice(0, max);
    const cut = sliced.lastIndexOf(" ");
    return (cut > 0 ? sliced.slice(0, cut) : sliced) + "...";
};

/* ---------- Icons ---------- */
const Icon = ({ name }) => {
    const p = {
        width: 26,
        height: 26,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: 1.8,
        strokeLinecap: "round",
        strokeLinejoin: "round",
    };
    switch (name) {
        case "chat":
            return (
                <svg {...p}>
                    <path d="M21 11.5a8.4 8.4 0 0 1-9 8.3 9 9 0 0 1-3.3-.6L4 21l1.4-4.2A8.2 8.2 0 0 1 3 11.5C3 6.8 7 3 12 3s9 3.8 9 8.5Z" />
                    <circle cx="8.5" cy="11.5" r=".6" fill="currentColor" />
                    <circle cx="12" cy="11.5" r=".6" fill="currentColor" />
                    <circle cx="15.5" cy="11.5" r=".6" fill="currentColor" />
                </svg>
            );
        case "people":
            return (
                <svg {...p}>
                    <circle cx="9" cy="8" r="3.2" />
                    <path d="M3 20c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5" />
                    <path d="M16 4.9a3.2 3.2 0 0 1 0 6.2M18 14.8c1.8.6 3 2.2 3 4.7" />
                </svg>
            );
        case "doc":
            return (
                <svg {...p}>
                    <path d="M6 3h8l5 5v12a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
                    <path d="M14 3v5h5M8.5 12.5h7M8.5 16h7M8.5 9h2.5" />
                </svg>
            );
        default:
            return null;
    }
};

const Bell = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 9a6 6 0 1 1 12 0c0 5 2 6.5 2 6.5H4S6 14 6 9Z" />
        <path d="M10 19a2.2 2.2 0 0 0 4 0" />
    </svg>
);

const Arrow = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
);

const Chevron = ({ dir }) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d={dir === "left" ? "m15 6-6 6 6 6" : "m9 6 6 6-6 6"} />
    </svg>
);

export default function Dashboard() {
    const navigate = useNavigate();
    const [, setText] = useAtom(composeAtom);

    /* ---------- Greeting ---------- */
    const [username] = useState(getUsername);
    const [salutation] = useState(getSalutation);

    /* ---------- Recipient ---------- */
    // The recipient lives in localStorage ("recipient"), exactly like AddRecipient / AliasPick.
    const [emails, setEmails] = useState(() => {
        const r = getStoredRecipient();
        return r ? [r] : [];
    });
    const [active, setActive] = useState(getStoredRecipient);
    const [swap, setSwap] = useState(0);
    const [editing, setEditing] = useState(() => !getStoredRecipient()); // first-time users start in "enter recipient"
    const [draft, setDraft] = useState("");
    const [error, setError] = useState(false);
    const [shake, setShake] = useState(0);
    const [saving, setSaving] = useState(false);
    const inputRef = useRef(null);

    // Autocomplete
    const [suggestions, setSuggestions] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const skipFetch = useRef(false); // set when the text changes programmatically (Tab / click / start edit)

    /* ---------- Previous emails ---------- */
    const [messages, setMessages] = useState([]);
    const [messagesLoading, setMessagesLoading] = useState(() => !!getStoredRecipient());
    const [creating, setCreating] = useState(false);

    /* ---------- UI ---------- */
    const [toast, setToast] = useState("");
    const toastTimer = useRef(null);
    const [profileOpen, setProfileOpen] = useState(false);

    // Pagination state
    const [page, setPage] = useState(0);
    const [dir, setDir] = useState(1); // 1 = forward (slide from right), -1 = back
    const [phase, setPhase] = useState("in"); // "in" | "out"
    const [busy, setBusy] = useState(false);
    const [nonce, setNonce] = useState(0); // forces cards to remount + replay the slide-in
    const animTimer = useRef(null);
    const lockTimer = useRef(null);

    /* Empty state: no recipient yet -> a centred hero with only the input */
    const hasRecipient = !!active;
    const groupRef = useRef(null);
    const flipFrom = useRef(null); // group's top edge (px) captured just before the hero collapses

    // FLIP: after the layout switches from "centred hero" to "top of page", start the group at its
    // old position and glide it to the new one.
    useLayoutEffect(() => {
        const el = groupRef.current;
        const from = flipFrom.current;
        if (!el || from == null) return;
        flipFrom.current = null;

        if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        const delta = from - el.getBoundingClientRect().top;
        if (!delta) return;

        el.style.transition = "none";
        el.style.transform = `translateY(${delta}px)`;
        el.getBoundingClientRect(); // force reflow so the starting position is applied
        requestAnimationFrame(() => {
            el.style.transition = "transform 0.95s cubic-bezier(0.22, 1, 0.36, 1)";
            el.style.transform = "";
        });
        const clear = () => {
            el.style.transition = "";
            el.removeEventListener("transitionend", clear);
        };
        el.addEventListener("transitionend", clear);
    }, [hasRecipient]);

    const totalPages = Math.max(1, Math.ceil(messages.length / PAGE_SIZE));
    const safePage = Math.min(page, totalPages - 1);
    const pageCards = messages.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE);
    const rangeStart = messages.length ? safePage * PAGE_SIZE + 1 : 0;
    const rangeEnd = safePage * PAGE_SIZE + pageCards.length;

    useEffect(
        () => () => {
            clearTimeout(toastTimer.current);
            clearTimeout(animTimer.current);
            clearTimeout(lockTimer.current);
        },
        []
    );

    // Focus and select the text as soon as edit mode opens
    useEffect(() => {
        if (editing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [editing]);

    const flash = (msg, ms = 2200) => {
        setToast(msg);
        clearTimeout(toastTimer.current);
        toastTimer.current = setTimeout(() => setToast(""), ms);
    };

    // Debounced recipient lookup while the edit field is open (POST /Message/fetch-recipient)
    useEffect(() => {
        if (!editing) return;
        const query = draft.trim();
        if (!query) {
            setSuggestions([]);
            return;
        }
        if (skipFetch.current) {
            skipFetch.current = false;
            return;
        }

        let cancelled = false; // ignore stale responses
        const timer = setTimeout(async () => {
            try {
                const { data } = await axios.post("/Message/fetch-recipient", { recipient: query });
                if (!cancelled && data.success) {
                    setSuggestions((data.recipients || []).slice(0, MAX_SUGGESTIONS));
                    setSelectedIndex(0);
                }
            } catch {
                if (!cancelled) setSuggestions([]);
            }
        }, FETCH_DEBOUNCE_MS);

        return () => {
            cancelled = true;
            clearTimeout(timer);
        };
    }, [draft, editing]);

    // Load previous emails for the active recipient (POST /Message/fetch-messages)
    useEffect(() => {
        // new recipient -> back to page 1 and replay the slide-in
        clearTimeout(animTimer.current);
        clearTimeout(lockTimer.current);
        setBusy(false);
        setPage(0);
        setPhase("in");
        setNonce((n) => n + 1);

        if (!active) {
            setMessages([]);
            setMessagesLoading(false);
            return;
        }

        let cancelled = false;
        const load = async () => {
            setMessagesLoading(true);
            try {
                const { data } = await axios.post("/Message/fetch-messages", { recipient: active });
                if (!cancelled) setMessages(data.success ? data.messages || [] : []);
            } catch {
                if (!cancelled) {
                    setMessages([]);
                    flash("Couldn't load previous emails", ERROR_TOAST_MS);
                }
            } finally {
                if (!cancelled) setMessagesLoading(false);
            }
        };
        load();

        return () => {
            cancelled = true;
        };
    }, [active]);

    const selectEmail = (e) => {
        // first recipient ever: remember where the hero sits so it can slide up
        if (!active && groupRef.current) flipFrom.current = groupRef.current.getBoundingClientRect().top;
        setEditing(false);
        setSuggestions([]);
        setError(false);
        setActive(e);
        setSwap((s) => s + 1);
        try {
            localStorage.setItem("recipient", e);
        } catch { /* storage unavailable */ }
    };

    const removeEmail = (e, ev) => {
        ev.stopPropagation();
        if (emails.length === 1) return;
        const next = emails.filter((x) => x !== e);
        setEmails(next);
        if (active === e) selectEmail(next[0]);
    };

    const startEdit = () => {
        skipFetch.current = true; // don't suggest for the address that's already selected
        setDraft(active);
        setSuggestions([]);
        setError(false);
        setEditing(true);
    };

    const cancelEdit = () => {
        if (!active) return; // nothing to go back to yet
        setEditing(false);
        setSuggestions([]);
        setError(false);
    };

    const pickSuggestion = (address) => {
        if (address !== draft) skipFetch.current = true;
        setDraft(address);
        setSuggestions([]);
        setError(false);
        inputRef.current && inputRef.current.focus();
    };

    /* Save = AddRecipient's createRecipient, minus the navigation (we're already on this page) */
    const saveEdit = async () => {
        if (saving) return;

        const value = draft.trim();
        if (!EMAIL_RE.test(value)) {
            setError(true);
            setShake((s) => s + 1);
            inputRef.current && inputRef.current.focus();
            return;
        }

        // Already registered (it has a chip): just switch to it
        const existing = emails.find((x) => x.toLowerCase() === value.toLowerCase());
        if (existing) {
            if (existing === active) cancelEdit();
            else selectEmail(existing);
            return;
        }

        setSaving(true);
        try {
            const { data } = await axios.post("/Message/create-recipient", { recipient: value });

            if (data.success === false) {
                flash(data.message || "Couldn't save this recipient", ERROR_TOAST_MS);
                return;
            }

            setEmails((prev) => [...prev, value]);
            selectEmail(value); // stores it in localStorage and loads its previous emails
            flash("Recipient saved ✓");
        } catch {
            flash("Something went wrong. Please try again.", ERROR_TOAST_MS);
        } finally {
            setSaving(false);
        }
    };

    const onFieldKey = (e) => {
        const count = suggestions.length;

        if (count && (e.key === "ArrowRight" || e.key === "ArrowDown")) {
            e.preventDefault();
            setSelectedIndex((prev) => (prev + 1) % count);
        } else if (count && (e.key === "ArrowLeft" || e.key === "ArrowUp")) {
            e.preventDefault();
            setSelectedIndex((prev) => (prev === 0 ? count - 1 : prev - 1));
        } else if (count && e.key === "Tab") {
            e.preventDefault();
            pickSuggestion(suggestions[selectedIndex].address);
        } else if (e.key === "Enter") {
            e.preventDefault();
            saveEdit();
        } else if (e.key === "Escape") {
            cancelEdit();
        }
    };

    /* "Compose a new e-mail" = AliasPick's "New Mail" */
    const createMessage = async () => {
        if (creating) return;

        if (!active) {
            flash("Add a recipient first");
            setEditing(true);
            return;
        }

        setCreating(true);
        try {
            const { data } = await axios.post("/Message/create-message", { recipient: active });

            if (data.success) {
                localStorage.removeItem("text");
                setText("");
                navigate(`/dashboard/message/${data.eas}`, { state: { tid: data.tid } });
            } else {
                flash(data.message || "Couldn't create the email", ERROR_TOAST_MS);
            }
        } catch {
            flash("Something went wrong. Please try again.", ERROR_TOAST_MS);
        } finally {
            setCreating(false);
        }
    };

    /* Clicking a previous email: sent -> tracking page, draft -> composer (same as AliasPick) */
    const openMessage = (message) => {
        if (message.text) {
            localStorage.setItem("text", message.text);
            setText(message.text);
        } else {
            localStorage.removeItem("text");
        }

        const tid = message.tid?._id;

        if (message.tid?.fire) {
            navigate(`/dashboard/track-boat/${message.eas}`, { state: { eas: message.eas, tid } });
        } else {
            navigate(`/dashboard/message/${message.eas}`, { state: { tid } });
        }
    };

    /* Page switch: current cards slide out, new ones slide into place */
    const goTo = (p) => {
        if (busy || p === safePage || p < 0 || p >= totalPages) return;
        setDir(p > safePage ? 1 : -1);
        setBusy(true);
        setPhase("out");
        clearTimeout(animTimer.current);
        clearTimeout(lockTimer.current);
        animTimer.current = setTimeout(() => {
            setPage(p);
            setNonce((n) => n + 1);
            setPhase("in");
        }, OUT_MS);
        lockTimer.current = setTimeout(() => setBusy(false), LOCK_MS);
    };

    const onPagerKey = (e) => {
        if (e.key === "ArrowLeft") {
            e.preventDefault();
            goTo(safePage - 1);
        } else if (e.key === "ArrowRight") {
            e.preventDefault();
            goTo(safePage + 1);
        }
    };

    return (
        <div className="_3ujz page">
            {/* Header */}
            <header className="header">
                <a
                    className="logo appear appear--scale"
                    style={{ "--d": "0.08s" }}
                    aria-label="Vesper.ai"
                >
                    <img src={Logo} alt="Logo" />
                    <span>
                        Track Pixels
                    </span>
                </a>
                <div className="avatar-container">
                    <button
                        className={`avatar ${profileOpen ? "avatar-open" : ""}`}
                        aria-label="Account"
                        aria-expanded={profileOpen}
                        onClick={() => setProfileOpen((open) => !open)}
                    >
                        <span className="avatar-orb">
                            <span className="avatar-liquid" />
                            <span className="avatar-highlight" />
                            <span className="avatar-letter">{username ? username.charAt(0).toUpperCase() : "P"}</span>
                        </span>
                    </button>
                    <ProfileMenu
                        open={profileOpen}
                        onClose={() => setProfileOpen(false)}
                        onLogout={() => {
                            // Put your existing logout logic here.
                            console.log("Logout");
                        }}
                    />
                </div>
            </header>

            <main className={`main ${hasRecipient ? "" : "main--empty"}`}>
                {/* soft ambient light behind the hero (fades out once a recipient exists) */}
                <span className="hero-aura" aria-hidden="true" />

                <div className="hero-group" ref={groupRef}>
                {/* Greeting */}
                <div className="greeting" key={hasRecipient ? "g-filled" : "g-empty"}>
                    <h1 className="greeting-title">
                        {username ? (
                            <>{salutation}, <span className="greeting-name">{username}</span></>
                        ) : (
                            <span className="greeting-name">Welcome</span>
                        )}
                    </h1>
                    <p className="greeting-sub">
                        {hasRecipient
                            ? "Pick up where you left off, or start something new."
                            : "Who would you like to email first?"}
                    </p>
                </div>

                {/* Recipient card */}
                <section className="recipient glass">
                    <div className="recipient-top">
                        <div className="env-wrap">
                            <span className="env-ring ring-1" />
                            <span className="env-ring ring-2" />
                            <div className="env">
                                <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="5" width="18" height="14" rx="3" />
                                    <path d="m4 7.5 8 6 8-6" />
                                </svg>
                            </div>
                        </div>
                        <div className="recipient-info">
                            <span className="recipient-label">
                                {editing ? "Who are you sending this email to?" : "Sending to"}
                            </span>
                            {editing ? (
                                <>
                                    <div key={shake} className={`field ${error ? "field-error" : ""}`}>
                                        <svg className="field-ic" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                            <path d="M4 20h4L19 9a2.1 2.1 0 0 0-4-4L4 16v4Z" />
                                            <path d="m13.5 6.5 4 4" />
                                        </svg>
                                        <input
                                            ref={inputRef}
                                            className="field-input"
                                            type="email"
                                            inputMode="email"
                                            autoComplete="off"
                                            spellCheck={false}
                                            placeholder="e.g. john-doe@proton.me"
                                            aria-label="Recipient email"
                                            aria-invalid={error}
                                            value={draft}
                                            onChange={(e) => {
                                                setDraft(e.target.value);
                                                if (error) setError(false);
                                            }}
                                            onKeyDown={onFieldKey}
                                        />
                                        <span className="field-line" />
                                    </div>
                                    <span className={`field-hint ${error ? "field-hint-error" : ""}`}>
                                        {error
                                            ? "Please enter a valid email address"
                                            : suggestions.length
                                                ? "← → to browse · Tab to autofill · Enter to save"
                                                : active
                                                    ? "Press Enter to save · Esc to cancel"
                                                    : "Press Enter to save"}
                                    </span>
                                    {suggestions.length > 0 && (
                                        <div className="suggest" role="listbox" aria-label="Recipient suggestions">
                                            {suggestions.map((s, idx) => (
                                                <button
                                                    key={s._id}
                                                    type="button"
                                                    role="option"
                                                    aria-selected={idx === selectedIndex}
                                                    className={`suggest-item ${idx === selectedIndex ? "suggest-item-active" : ""}`}
                                                    style={{ "--n": idx }}
                                                    onMouseEnter={() => setSelectedIndex(idx)}
                                                    onMouseDown={(ev) => ev.preventDefault()} /* keep focus in the input */
                                                    onClick={() => pickSuggestion(s.address)}
                                                >
                                                    {s.address}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <span key={swap} className="recipient-email">{active}</span>
                            )}
                        </div>
                        <div className="actions">
                            {editing && active && (
                                <button className="btn-cancel" onClick={cancelEdit} aria-label="Cancel editing">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
                                        <path d="M6 6l12 12M18 6 6 18" />
                                    </svg>
                                </button>
                            )}
                            <button
                                className={`btn-change ${editing ? "btn-save" : ""}`}
                                onClick={editing ? saveEdit : startEdit}
                                disabled={saving}
                            >
                                <span>{editing ? (saving ? "Saving…" : "Save") : "Change"}</span>
                                {editing ? (
                                    <svg className="swap-ic" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="m5 12.5 4.5 4.5L19 7.5" />
                                    </svg>
                                ) : (
                                    <svg className="swap-ic" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M4 20h4L19 9a2.1 2.1 0 0 0-4-4L4 16v4Z" />
                                        <path d="m13.5 6.5 4 4" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    {emails.length > 0 && (
                        <div className="chips">
                            {emails.map((e) => (
                                <button
                                    key={e}
                                    className={`chip ${e === active ? "chip-active" : ""}`}
                                    onClick={() => selectEmail(e)}
                                >
                                    <span>{e}</span>
                                    <span className="chip-x" onClick={(ev) => removeEmail(e, ev)} role="button" aria-label={`Remove ${e}`}>
                                        <svg width="11" height="11" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" fill="none">
                                            <path d="M6 6l12 12M18 6 6 18" />
                                        </svg>
                                    </span>
                                </button>
                            ))}
                        </div>
                    )}
                </section>
                </div>

                {/* Only meaningful once there is a recipient */}
                {hasRecipient && (
                <>
                {/* Create new (AliasPick's "New Mail") */}
                <button className="create" onClick={createMessage} disabled={creating} aria-busy={creating}>
                    {/* Dark fluid fill -> frosted glass pane -> content */}
                    <span className="create-fluid" aria-hidden="true">
                        <i className="blob blob-1" />
                        <i className="blob blob-2" />
                        <i className="blob blob-3" />
                    </span>
                    <span className="create-glass" aria-hidden="true" />
                    <span className="create-row">
                        <span className="create-title">{creating ? "Setting things up…" : "Compose a new e-mail"}</span>
                        <RightArrow width={22} fill="white" />
                    </span>
                </button>

                {/* Previous */}
                <section className="previous">
                    <div className="previous-head">
                        <h3 className="previous-title">Previous emails to this person</h3>
                        {!messagesLoading && messages.length > 0 && (
                            <span className="previous-count">{messages.length} total</span>
                        )}
                    </div>

                    <div
                        key={`${safePage}-${nonce}`}
                        className={`cards ${phase === "out" ? "is-out" : "is-in"}`}
                        style={{ "--dir": dir }}
                        aria-live="polite"
                        aria-busy={messagesLoading}
                    >
                        {messagesLoading ? (
                            [0, 1, 2].map((i) => (
                                <article className="card card--draft card-skel" key={i} style={{ "--i": i }} aria-hidden="true">
                                    <span className="card-bar" />
                                    <div className="card-top">
                                        <span className="sk sk-circle" />
                                        <span className="sk sk-pill" />
                                    </div>
                                    <div className="card-body">
                                        <span className="sk sk-line sk-title" />
                                        <span className="sk sk-line" />
                                        <span className="sk sk-line sk-short" />
                                    </div>
                                    <div className="card-foot">
                                        <span className="sk sk-line sk-link" />
                                        <span className="sk sk-line sk-link" />
                                    </div>
                                </article>
                            ))
                        ) : pageCards.length === 0 ? (
                            <div className="cards-empty">
                                {active
                                    ? "No emails to this person yet. Compose your first one above."
                                    : "Add a recipient to see your previous emails."}
                            </div>
                        ) : (
                            pageCards.map((m, i) => {
                                const opens = m.tid?.unix?.length || 0;
                                const newOpens = Math.max(0, opens - (m.tid?.receipt || 0));
                                const sent = !!m.tid?.fire;
                                const status = sent ? (opens ? "read" : "sent") : "draft";

                                return (
                                    <article
                                        key={m.eas}
                                        className={`card card--${status}`}
                                        style={{ "--i": i }}
                                        role="button"
                                        tabIndex={0}
                                        onClick={() => openMessage(m)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" || e.key === " ") {
                                                e.preventDefault();
                                                openMessage(m);
                                            }
                                        }}
                                    >
                                        <span className="card-bar" />

                                        <div className="card-top">
                                            <div className={`card-icon card-icon--${SLOTS[i].icon}`}>
                                                <Icon name={SLOTS[i].icon} />
                                            </div>
                                            <div className="card-top-right">
                                                {sent && (
                                                    <span className={`pill ${opens === 0 ? "pill-zero" : ""}`}>
                                                        {opens} {opens === 1 ? "open" : "opens"}
                                                    </span>
                                                )}
                                                {newOpens > 0 && (
                                                    <span
                                                        className="bell bell-on"
                                                        role="img"
                                                        title={`You have ${newOpens} new ${newOpens === 1 ? "open" : "opens"}`}
                                                        aria-label={`${newOpens} new opens`}
                                                    >
                                                        <Bell />
                                                        <span className="bell-badge">{newOpens}</span>
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="card-body">
                                            <h4 className="card-name" title={m.eas}>{m.eas}</h4>
                                            <p className="card-desc">{m.text ? truncate(m.text, 60) : "No content yet"}</p>
                                        </div>

                                        <div className="card-foot">
                                            <span className="card-link">
                                                {sent ? "View opens" : "Continue draft"} <Arrow />
                                            </span>
                                            <span className={`sent status-${status}`}>
                                                <i className="status-dot" />
                                                {status === "read" ? "Read" : status === "sent" ? "Sent" : "Draft"}
                                            </span>
                                        </div>
                                    </article>
                                );
                            })
                        )}
                    </div>

                    {/* Static pagination (always in the same spot, never animates itself) */}
                    {!messagesLoading && messages.length > PAGE_SIZE && (
                        <nav className="pager" aria-label="Previous emails pagination" onKeyDown={onPagerKey}>
                            <span className="pager-info">
                                {rangeStart}–{rangeEnd} <em>of {messages.length}</em>
                            </span>
                            <div className="pager-controls">
                                <button
                                    className="pager-btn"
                                    onClick={() => goTo(safePage - 1)}
                                    disabled={safePage === 0 || busy}
                                    aria-label="Previous page"
                                >
                                    <Chevron dir="left" />
                                </button>
                                {Array.from({ length: totalPages }, (_, p) => (
                                    <button
                                        key={p}
                                        className={`pager-num ${p === safePage ? "pager-num-active" : ""}`}
                                        onClick={() => goTo(p)}
                                        disabled={busy && p !== safePage}
                                        aria-label={`Page ${p + 1}`}
                                        aria-current={p === safePage ? "page" : undefined}
                                    >
                                        {p + 1}
                                    </button>
                                ))}
                                <button
                                    className="pager-btn"
                                    onClick={() => goTo(safePage + 1)}
                                    disabled={safePage === totalPages - 1 || busy}
                                    aria-label="Next page"
                                >
                                    <Chevron dir="right" />
                                </button>
                            </div>
                            <span className="pager-info pager-info-right">
                                Page {safePage + 1} / {totalPages}
                            </span>
                        </nav>
                    )}
                </section>
                </>
                )}

                <footer className="foot">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="5" y="11" width="14" height="9" rx="2" />
                        <path d="M8 11V8a4 4 0 0 1 8 0v3" />
                    </svg>
                    Your data is private and secure. We only track email opens.
                </footer>
            </main>

            <div className={`toast ${toast ? "toast-show" : ""}`} role="status" aria-live="polite">{toast}</div>
        </div>
    );
}
