import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"
import "./css/Register.css"
import api from "../config/backend";
import axios from "axios";
import { useAtom } from 'jotai'
import { tokenAtom } from '@org/shared-state'

const Logo = new URL('../assets/Logo.jpg', import.meta.url).href;

const Login = () => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)

    const [token, setToken] = useAtom(tokenAtom)

    const navigate = useNavigate()

    const login = async () => {
        if (loading) return

        setLoading(true)

        const { data, status } = await axios.post(`${api}/Auth/sign-in`, {
            username, password
        })

        setLoading(false)

        if (data.success === false) {
            setError(data.message)

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

    useEffect(() => {
        if (error) {
            setTimeout(() => {
                setError("")
            }, 5000)
        }
    }, [error])

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
                    <h2>Login</h2>
                    <div>Username</div>
                    <input  onKeyDown={handleKeyDown} value={username} onChange={e => setUsername(e.target.value)} />
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
                        onClick={() => login()}
                        disabled={loading}
                        className={loading ? "loading" : ""}
                    >Login</button>
                    <br />
                    Don't have an account?&nbsp;
                    <Link to="/sign-up">Sign Up</Link>
                </div>
            </div>
        </div>
    )
}

export default Login
