import axios from "axios"
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import api from "../config/backend"
import "./css/Register.css"

const Logo = new URL('../assets/Logo.jpg', import.meta.url).href;

const Register = () => {
    const [fname, setFname] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    const register = async () => {
        if (loading) return

        setLoading(true)

        const { data, status } = await axios.post(`${api}/Auth/register`, {
            fname, username, password
        })

        setLoading(false)

        if (data.success === false) {
            setError(data.message)

            return
        }

        navigate("/dashboard")
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
                    <div>Name</div>
                    <input onKeyDown={handleKeyDown} value={fname} onChange={e => setFname(e.target.value)} />
                    <div>Username</div>
                    <input onKeyDown={handleKeyDown} value={username} onChange={e => setUsername(e.target.value)} />
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
