import { useState } from "react"
import { Link } from "react-router-dom"

const Register = () => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    return (
        <div className="_5big">
            <div className="robbers-woo">
                <h2>Sign Up</h2>
                <div>Username</div>
                <input value={username} onChange={e => setUsername(e.target.value)} />
                <div>Password</div>
                <input value={password} onChange={e => setPassword(e.target.value)} />
                <br />
                <button>Proceed</button>
                <br />
                Already have an account?
                <Link to="/">Login</Link>
            </div>
        </div>
    )
}

export default Register
