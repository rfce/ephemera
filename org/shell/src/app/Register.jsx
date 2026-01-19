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

    const navigate = useNavigate()

    const register = async () => {
        const { data, status } = await axios.post(`${api}/Auth/register`, {
            fname, username, password
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
                    <h2>Sign Up</h2>
                    <div>Name</div>
                    <input value={fname} onChange={e => setFname(e.target.value)} />
                    <div>Username</div>
                    <input value={username} onChange={e => setUsername(e.target.value)} />
                    <div>Password</div>
                    <input value={password} onChange={e => setPassword(e.target.value)} />
                    <br />
                    {error && <div style={{ color: "red" }}>{error}</div>}
                    <button onClick={() => register()}>Proceed</button>
                    Already have an account?&nbsp;
                    <Link to="/">Login</Link>
                    <br />
                </div>
            </div>
        </div>

    )
}

export default Register
