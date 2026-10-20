import { useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import "./css/Register.css"
import axios from "../config/backend";
import { useAtom } from 'jotai'
import { tokenAtom } from '@org/shared-state'
// Transparent logo (same file the Dashboard uses) so it sits cleanly on the dark background
const Logo = new URL('../assets/Logo-transparent.png', import.meta.url).href;

const Login = () => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [shake, setShake] = useState(0) // bumps on every failed attempt so the error replays its shake
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [, setToken] = useAtom(tokenAtom)
    const navigate = useNavigate()

    const fail = (message) => {
        setError(message)
        setShake((s) => s + 1)
    }

    const login = async () => {
        if (loading) return
        setLoading(true)

        let res
        try {
            res = await axios.post("/Auth/sign-in", {
                username, password
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

        localStorage.setItem("token", data.token)
        setToken(data.token)
        navigate("/dashboard")
    }

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            login()
        }
    }

    // Space / Enter activate the non-button controls below
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
                                <rect x="4" y="11" width="16" height="10" rx="2.5" />
                                <path d="M8 11V7.5a4 4 0 0 1 8 0V11" />
                                <circle cx="12" cy="16" r=".8" fill="currentColor" />
                            </svg>
                        </div>
                    </div>

                    <h2>Welcome <span className="auth-accent">back</span></h2>
                    <p className="auth-sub">Sign in to pick up where you left off.</p>

                    <div className="auth-field">
                        <label htmlFor="login-username">Username</label>
                        <div className="auth-input">
                            <svg className="auth-ic" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                            </svg>
                            <input
                                id="login-username"
                                placeholder="Enter your username"
                                autoComplete="username"
                                autoCapitalize="none"
                                autoCorrect="off"
                                spellCheck={false}
                                onKeyDown={handleKeyDown}
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="auth-field">
                        <label htmlFor="login-password">Password</label>
                        <div className="auth-input password-wrapper">
                            <svg className="auth-ic" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <rect x="3" y="11" width="18" height="11" rx="2" />
                                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                            </svg>
                            <input
                                id="login-password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                autoComplete="current-password"
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

                    <div className="forgot-password-row">
                        <div
                            className="forgot-password-btn"
                            role="button"
                            tabIndex={0}
                            onClick={() => navigate("/forgot-password")}
                            onKeyDown={onKeyActivate(() => navigate("/forgot-password"))}
                        >
                            Forgot password?
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
                        onClick={() => login()}
                        disabled={loading}
                        aria-busy={loading}
                        className={`auth-btn ${loading ? "loading" : ""}`}
                    >
                        <span>Login</span>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M5 12h14M13 6l6 6-6 6" />
                        </svg>
                    </button>

                    <p className="auth-alt">
                        Don't have an account? <Link to="/sign-up">Sign Up</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
export default Login
