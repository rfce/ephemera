import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import "./css/ValidateEmailSuccess.css"

const ValidateEmailSuccess = () => {
    const navigate = useNavigate()
    const [countdown, setCountdown] = useState(10)

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer)
                    navigate("/sign-in")
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [navigate])

    return (
        <div className="validate-email-page">
            <div className="success-card">
                <div className="success-icon-wrapper">
                    <div className="success-icon">
                        <svg viewBox="0 0 24 24" fill="none">
                            <path
                                d="M5 13l4 4L19 7"
                                stroke="white"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>
                </div>

                <h1>Email Verified Successfully!</h1>

                <p className="success-message">
                    Your email address has been successfully verified. You can now
                    log in to your Track Pixels account and start tracking your
                    emails with confidence.
                </p>

                <p className="redirect-text">
                    Redirecting to login in <span>{countdown}</span> seconds
                </p>

                <button
                    className="login-button"
                    onClick={() => navigate("/sign-in")}
                >
                    Go to Login
                </button>
            </div>
        </div>
    )
}

export default ValidateEmailSuccess
