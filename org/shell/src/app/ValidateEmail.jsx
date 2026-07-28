import { useEffect, useRef, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import "./css/ValidateEmail.css"
import { ChevronLeft, LeftArrow } from "../assets/Icons"
import axios from "axios"
import api from "../config/backend"

const Logo = "https://res.cloudinary.com/dkcyztevs/image/upload/f_auto,q_auto/Logo_tcmc8s"

const ValidateEmail = () => {
    const [otp, setOtp] = useState([
        "",
        "",
        "",
        "",
        "",
        ""
    ])

    const [errorToast, setErrorToast] = useState("")

    const navigate = useNavigate()

    const inputRefs = useRef([])

    const [searchParams] = useSearchParams()

    const email =
        searchParams.get("email") || ""

    const handleChange = (value, index) => {
        // Only allow digits
        if (!/^\d?$/.test(value)) return

        const updatedOtp = [...otp]
        updatedOtp[index] = value

        setOtp(updatedOtp)

        // Move to next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus()
        }

        // Auto verify when all 6 digits entered
        const fullOtp = updatedOtp.join("")

        if (fullOtp.length === 6) {
            verifyOtp(fullOtp)
        }
    }

    const handleKeyDown = (e, index) => {
        // Backspace navigation
        if (
            e.key === "Backspace" &&
            !otp[index] &&
            index > 0
        ) {
            inputRefs.current[index - 1]?.focus()
        }
    }

    const verifyOtp = async (code) => {
        const { data, status } = await axios.post(`${api}/Auth/verify`, { email, otp: code })

        if (data.success) {
            navigate("/email-verified")
        }
        else {
            setErrorToast(data.message)

            setOtp(["", "", "", "", "", ""])
            inputRefs.current[0].focus()

            // Hide toast after 5 seconds
            setTimeout(() => {
                setErrorToast("")
            }, 5000)
        }
    }

    const resendVerification = async () => {
        console.log("Resend verification email")

        // API call here
    }

    useEffect(() => {
        inputRefs.current[0]?.focus()
    }, [])

    return (
        <div className="_2yyr">
            <div className="bg-blob blob-1"></div>
            <div className="bg-blob blob-2"></div>
            <div className="bg-blob blob-3"></div>

            <div className="validate-page">
                {errorToast && (
                    <div className="floating-toast">
                        <div className="toast-sphere">
                            <svg viewBox="0 0 24 24" className="toast-symbol">
                                <path
                                    d="M12 7v6"
                                    stroke="white"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                />
                                <circle cx="12" cy="17" r="1.2" fill="white" />
                            </svg>
                        </div>

                        <div className="toast-content">
                            <div className="toast-title">Verification Failed</div>
                            <div className="toast-message">{errorToast}</div>
                        </div>
                    </div>
                )}
                <div className="validate-card">

                    <div className="validate-brand">
                        <img
                            src={Logo}
                            alt="Track Pixels"
                            className="validate-logo"
                        />

                        <div>
                            <div className="brand-title">
                                Track Pixels
                            </div>

                            <div className="brand-subtitle">
                                Send Magic • Track Everything
                            </div>
                        </div>
                    </div>
                    <h2>Verify Email</h2>

                    <div className="verify-description">
                        Enter the 6-digit verification code
                        sent to:
                    </div>

                    <div className="verify-email">
                        {email}
                    </div>

                    <div className="otp-container">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) =>
                                    (inputRefs.current[index] = el)
                                }
                                value={digit}
                                maxLength={1}
                                className="otp-box"
                                inputMode="numeric"
                                autoComplete="one-time-code"
                                onChange={(e) =>
                                    handleChange(
                                        e.target.value,
                                        index
                                    )
                                }
                                onKeyDown={(e) =>
                                    handleKeyDown(e, index)
                                }
                            />
                        ))}
                    </div>
                    <div className="resend-wrapper">
                        Didn’t receive the code?

                        <span onClick={resendVerification}>
                            Resend verification email
                        </span>
                    </div>
                    <button onClick={verifyOtp}>
                        Verify OTP
                    </button>
                    <div
                        className="go-back"
                        onClick={() => navigate("/sign-up")}
                    >
                        <span>Wrong email?</span>Go back to sign up
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ValidateEmail
