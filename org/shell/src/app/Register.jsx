import axios from "axios"
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import api from "../config/backend"
import "./css/Register.css"

const Logo = new URL('../assets/Logo.jpg', import.meta.url).href;

const Register = () => {
    const [email, setEmail] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [usernameError, setUsernameError] = useState("")

    const navigate = useNavigate()

    const register = async () => {
        if (loading) return

        setLoading(true)

        const { data, status } = await axios.post(`${api}/Auth/register`, {
            username, email, password
        })

        setLoading(false)

        if (data.success === false) {
            setError(data.message)

            return
        }

        navigate(`/verify?email=${email}`)
    }

    const checkUsername = async () => {
        const { data, status } = await axios.post(`${api}/Auth/is-username`, { username })

        if (data.success) {
            setUsernameError(false)

            return
        }

        setUsernameError(data.message)
    }

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            register()
        }
    }

    useEffect(() => {
        if (error) {
            setTimeout(() => {
                setError("")
            }, 5000)
        }
    }, [error])


    useEffect(() => {
        // Don't check tiny usernames
        if (username.trim().length < 4) {
            setUsernameError("")
            return
        }

        const timeout = setTimeout(() => {
            checkUsername()
        }, 500)

        return () => clearTimeout(timeout)

    }, [username])

    return (
        <div className="_3bqk">
            <div className="_0giz">
                <div onClick={() => navigate("/")} className="trebly-oat">
                    <img className="steep-hiss" src={Logo} alt="Logo" />
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
                    <h2>Sign Up</h2>
                    <div>Username</div>
                    <input className={usernameError ? "error" : undefined} onKeyDown={handleKeyDown} value={username} onChange={e => setUsername(e.target.value)} />
                    {usernameError === false ? <div className="airless-down green">Username available</div> : usernameError ? <div className="airless-down">{usernameError}</div> : undefined}
                    <div>E-mail Address</div>
                    <input onKeyDown={handleKeyDown} value={email} onChange={e => setEmail(e.target.value)} />
                    <div>Password</div>
                    <div className="password-wrapper">
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        <span
                            className="password-toggle"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? "Hide" : "Show"}
                        </span>
                    </div>
                    <br />
                    {error && <div style={{ color: "red" }}>{error}</div>}
                    <button
                        onClick={() => register()}
                        disabled={loading}
                        className={loading ? "loading" : ""}
                    >Proceed</button>
                    Already have an account?&nbsp;
                    <Link to="/sign-in">Login</Link>
                    <br />
                </div>
            </div>
        </div>

    )
}

export default Register
