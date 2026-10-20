import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "../config/backend";
import "./css/Register.css"

// Transparent logo (same file Login and Dashboard use) so it sits cleanly on the dark background
const Logo = new URL('../assets/Logo-transparent.png', import.meta.url).href;

const Register = () => {
    const [email, setEmail] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [shake, setShake] = useState(0) // bumps on every failed attempt so the error replays its shake
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    // "" = nothing to show, false = username is available, string = why it can't be used
    const [usernameError, setUsernameError] = useState("")
    const [checking, setChecking] = useState(false) // username availability request in flight

    const navigate = useNavigate()

    const fail = (message) => {
        setError(message)
        setShake((s) => s + 1)
    }

    const register = async () => {
        if (loading) return

        setLoading(true)

        let res
        try {
            res = await axios.post("/Auth/register", {
                username, email, password
            })
        } catch {
            // network / server error: don't leave the button stuck in its loading state
            setLoading(false)
            fail("Something went wrong. Please try again.")
            return
        }

        setLoading(false)

        const data = res?.data
        if (!data || data.success === false) {
            fail(data?.message || "Something went wrong. Please try again.")

            return
        }

        navigate(`/verify?email=${email}`)
    }

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            register()
        }
    }

    // Space / Enter activate the non-button control below
    const onKeyActivate = (action) => (e) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            action()
        }
    }

    useEffect(() => {
        if (!error) return
        const timer = setTimeout(() => {
            setError("")
        }, 5000)
        return () => clearTimeout(timer)
    }, [error, shake])


    useEffect(() => {
        // Don't check tiny usernames
        if (username.trim().length < 4) {
            setUsernameError("")
            return
        }

        // a new name invalidates whatever we last said about the old one
        setUsernameError("")

        let cancelled = false // ignore a slow response for a name that's no longer in the box

        const timeout = setTimeout(async () => {
            setChecking(true)
            try {
                const { data } = await axios.post("/Auth/is-username", { username })
                if (cancelled) return

                setUsernameError(data.success ? false : (data.message || "That username isn't available"))
            } catch {
                if (!cancelled) setUsernameError("")
            } finally {
                if (!cancelled) setChecking(false)
            }
        }, 500)

        return () => {
            cancelled = true
            clearTimeout(timeout)
            setChecking(false)
        }

    }, [username])

    const usernameState = usernameError === false ? "is-ok" : usernameError ? "is-error" : ""

    return (
        <div className="_3bqk auth-dark">
            <div className="_0giz">
                <div onClick={() => navigate("/")} className="trebly-oat">
                    <img className="steep-hiss auth-logo" src={Logo} alt="Logo" />
                    <div>
                        <div>Track Pixels</div>
                        <div className="tabarded-tux">Send Magic • Track Everything</div>
                    </div>
                </div>
            </div>
            <div className="_5big">
                <div className="bg-shape blob-1"></div>
                <div className="bg-shape blob-2"></div>
                <div className="bg-shape blob-3"></div>

                <div className="robbers-woo">
                    <div className="auth-orb-wrap" aria-hidden="true">
                        <span className="auth-ring" />
                        <span className="auth-ring r2" />
                        <div className="auth-orb">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                <circle cx="9" cy="7" r="4" />
                                <line x1="19" y1="8" x2="19" y2="14" />
                                <line x1="22" y1="11" x2="16" y2="11" />
                            </svg>
                        </div>
                    </div>

                    <h2>Create your <span className="auth-accent">account</span></h2>
                    <p className="auth-sub">Start sending emails and tracking every open.</p>

                    <div className="auth-field">
                        <div className="auth-field-head">
                            <label htmlFor="reg-username">Username</label>
                            <span className="auth-status-slot" aria-live="polite">
                                {usernameError === false && <span className="auth-status ok">Username available</span>}
                                {usernameError && <span className="auth-status bad">{usernameError}</span>}
                            </span>
                        </div>
                        <div className={`auth-input ${usernameState}`}>
                            <svg className="auth-ic" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                            </svg>
                            <input
                                id="reg-username"
                                placeholder="Choose a username"
                                autoComplete="username"
                                autoCapitalize="none"
                                autoCorrect="off"
                                spellCheck={false}
                                aria-invalid={!!usernameError}
                                onKeyDown={handleKeyDown}
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                            />
                            {checking && <span className="auth-mini-spin" aria-hidden="true" />}
                            {!checking && usernameError === false && (
                                <svg className="auth-state-ic ok" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <circle cx="12" cy="12" r="10" />
                                    <path d="m8 12.2 2.8 2.8L16 9.5" />
                                </svg>
                            )}
                            {!checking && usernameError && (
                                <svg className="auth-state-ic bad" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="12" y1="8" x2="12" y2="12" />
                                    <line x1="12" y1="16" x2="12.01" y2="16" />
                                </svg>
                            )}
                        </div>
                    </div>

                    <div className="auth-field">
                        <label htmlFor="reg-email">E-mail Address</label>
                        <div className="auth-input">
                            <svg className="auth-ic" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <rect x="3" y="5" width="18" height="14" rx="3" />
                                <path d="m4 7.5 8 6 8-6" />
                            </svg>
                            <input
                                id="reg-email"
                                type="email"
                                inputMode="email"
                                placeholder="you@example.com"
                                autoComplete="email"
                                autoCapitalize="none"
                                autoCorrect="off"
                                spellCheck={false}
                                onKeyDown={handleKeyDown}
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="auth-field auth-field--last">
                        <label htmlFor="reg-password">Password</label>
                        <div className="auth-input password-wrapper">
                            <svg className="auth-ic" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <rect x="3" y="11" width="18" height="11" rx="2" />
                                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                            </svg>
                            <input
                                id="reg-password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Create a password"
                                autoComplete="new-password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                            <span
                                className="password-toggle"
                                role="button"
                                tabIndex={0}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                                title={showPassword ? "Hide password" : "Show password"}
                                onMouseDown={(e) => e.preventDefault()} /* keep focus in the input */
                                onClick={() => setShowPassword(!showPassword)}
                                onKeyDown={onKeyActivate(() => setShowPassword((v) => !v))}
                            >
                                {showPassword ? (
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                        <line x1="1" y1="1" x2="23" y2="23" />
                                    </svg>
                                ) : (
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                        <circle cx="12" cy="12" r="3" />
                                    </svg>
                                )}
                            </span>
                        </div>
                    </div>

                    {error && (
                        <div key={shake} className="auth-error" role="alert">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="8" x2="12" y2="12" />
                                <line x1="12" y1="16" x2="12.01" y2="16" />
                            </svg>
                            <span>{error}</span>
                        </div>
                    )}

                    <button
                        onClick={() => register()}
                        disabled={loading}
                        aria-busy={loading}
                        className={`auth-btn ${loading ? "loading" : ""}`}
                    >
                        <span>Proceed</span>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M5 12h14M13 6l6 6-6 6" />
                        </svg>
                    </button>

                    <p className="auth-alt">
                        Already have an account? <Link to="/sign-in">Login</Link>
                    </p>
                </div>
            </div>
        </div>

    )
}

export default Register
