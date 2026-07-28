import { useState } from "react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("")

  const sendReset = async () => {
    // API call here
  }

  return (
    <div>
      <h2>Reset Password</h2>

      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
      />

      <button onClick={sendReset}>
        Send Reset Link
      </button>
    </div>
  )
}

export default ForgotPassword
