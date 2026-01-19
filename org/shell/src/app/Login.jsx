import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"
import "./css/Register.css"
import api from "../config/backend";
import axios from "axios";

const Logo = new URL('../assets/Logo.jpg', import.meta.url).href;

const Login = () => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [showPassword, setShowPassword] = useState(false)

    const navigate = useNavigate()

    const login = async () => {
        const { data, status } = await axios.post(`${api}/Auth/sign-in`, {
            username, password
        })

        if (data.success === false) {
            setError(data.message)

            return
        }

        navigate("/dashboard")
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
                <div className="trebly-oat">
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
                    <input value={username} onChange={e => setUsername(e.target.value)} />
                    <div>Password</div>
                    <div className="password-wrapper">
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={e => setPassword(e.target.value)}
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
                    <button onClick={() => login()}>Login</button>
                    <br />
                    Don't have an account?&nbsp;
                    <Link to="/sign-up">Sign Up</Link>
                </div>
            </div>
        </div>
    )
}

export default Login
