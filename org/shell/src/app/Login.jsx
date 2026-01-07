import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"

const Login = () => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const navigate = useNavigate()

    return (
        <div className="_5big">
            <div className="robbers-woo">
                <h2>Login</h2>
                <div>Username</div>
                <input value={username} onChange={e => setUsername(e.target.value)} />
                <div>Password</div>
                <input value={password} onChange={e => setPassword(e.target.value)} />
                <br />
                <button onClick={() => navigate("/dashboard")}>Login</button>
                <br />
                Don't have an account?
                <Link to="/sign-up">Sign Up</Link>
            </div>
        </div>
    )
}

export default Login
