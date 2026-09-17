import React, { useEffect, useRef } from "react"
import "./css/CreativeFooter.css"
import gazeFrames from "./gaze-frames.json"

const Background = new URL('../assets/footer-scrub.mp4', import.meta.url).href
const BrandLogo = new URL('../assets/track-pixels font.png', import.meta.url).href

const TAU = Math.PI * 2

const HeartIcon = ({
    size = 24,
    fill = "#40E0D0",
    className = "",
    ...props
}) => {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            {...props}
        >
            <path
                fill={fill}
                d="M12 21.2c-.4 0-.8-.15-1.1-.45C8.5 18.9 2.8 14.1 2.8 9c0-3.1 2.4-5.2 5.2-5.2 2 0 3.7 1 4 2.4.3-1.4 2-2.4 4-2.4 2.8 0 5.2 2.1 5.2 5.2 0 5.1-5.7 9.9-8.1 11.75-.3.3-.7.45-1.1.45z"
            />
        </svg>
    )
}

const wrappedAngle = (angle) => {
    return (angle % TAU + TAU) % TAU
}

function timeForAngle(angle) {
    const target = wrappedAngle(angle)

    let nearestTime = gazeFrames[0][1]
    let nearestDistance = Infinity

    for (const [sampleAngle, time] of gazeFrames) {
        const difference = Math.abs(target - sampleAngle)
        const distance = Math.min(difference, TAU - difference)

        if (distance < nearestDistance) {
            nearestDistance = distance
            nearestTime = time
        }
    }

    return nearestTime + 1 / 240
}


function FooterBackground() {
    const videoRef = useRef(null)

    useEffect(() => {
        const video = videoRef.current

        if (!video) return

        let rafId = 0
        let pointer = null
        let pendingTime = null
        let disposed = false

        const mobile = window.matchMedia("(max-width: 700px)")
        const reducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        )

        const applySeek = () => {
            rafId = 0

            if (
                disposed ||
                mobile.matches ||
                reducedMotion.matches ||
                video.readyState < 2 ||
                !Number.isFinite(video.duration)
            ) {
                return
            }

            if (pendingTime === null) {
                return
            }

            const target = Math.max(
                0,
                Math.min(
                    pendingTime,
                    video.duration - 1 / 24
                )
            )

            pendingTime = null

            /*
             * Don't wait for video.seeking here.
             * Setting currentTime is enough. The browser
             * handles the actual decode/seek.
             */
            if (
                Math.abs(video.currentTime - target) > 1 / 120
            ) {
                video.currentTime = target
            }
        }

        const scheduleSeek = () => {
            if (!rafId) {
                rafId = requestAnimationFrame(applySeek)
            }
        }

        const calculateTarget = () => {
            if (
                mobile.matches ||
                reducedMotion.matches ||
                !pointer
            ) {
                return
            }

            const rect = video.getBoundingClientRect()

            if (
                rect.width === 0 ||
                rect.height === 0
            ) {
                return
            }

            /*
             * Original video:
             * 1920 × 1080
             *
             * Eyes midpoint:
             * x = 948
             * y = 418
             */
            const scale = Math.max(
                rect.width / 1920,
                rect.height / 1080
            )

            const eyeX =
                rect.left +
                rect.width / 2 +
                (948 - 960) * scale

            const eyeY =
                rect.top +
                rect.height / 2 +
                (418 - 540) * scale

            const dx = pointer.x - eyeX
            const dy = pointer.y - eyeY

            const distance = Math.hypot(dx, dy)

            /*
             * Ignore the small area directly around
             * the eyes.
             */
            if (distance <= 8) {
                return
            }

            const angle = Math.atan2(dy, dx)

            pendingTime = timeForAngle(angle)

            scheduleSeek()
        }

        const handlePointerMove = (event) => {
            pointer = {
                x: event.clientX,
                y: event.clientY
            }

            calculateTarget()
        }

        const handleResize = () => {
            calculateTarget()
        }

        const handleScroll = () => {
            calculateTarget()
        }

        const startVideo = () => {
            if (
                mobile.matches &&
                !reducedMotion.matches
            ) {
                video.loop = true

                video.play().catch(() => { })
            } else {
                video.loop = false
                video.pause()

                calculateTarget()
            }
        }

        video.addEventListener(
            "loadedmetadata",
            startVideo
        )

        video.addEventListener(
            "loadeddata",
            startVideo
        )

        mobile.addEventListener(
            "change",
            startVideo
        )

        reducedMotion.addEventListener(
            "change",
            startVideo
        )

        window.addEventListener(
            "pointermove",
            handlePointerMove,
            { passive: true }
        )

        window.addEventListener(
            "resize",
            handleResize
        )

        window.addEventListener(
            "scroll",
            handleScroll,
            { passive: true }
        )

        /*
         * Video may already be loaded when React mounts.
         */
        if (video.readyState >= 1) {
            startVideo()
        }

        return () => {
            disposed = true

            if (rafId) {
                cancelAnimationFrame(rafId)
            }

            video.pause()

            video.removeEventListener(
                "loadedmetadata",
                startVideo
            )

            video.removeEventListener(
                "loadeddata",
                startVideo
            )

            mobile.removeEventListener(
                "change",
                startVideo
            )

            reducedMotion.removeEventListener(
                "change",
                startVideo
            )

            window.removeEventListener(
                "pointermove",
                handlePointerMove
            )

            window.removeEventListener(
                "resize",
                handleResize
            )

            window.removeEventListener(
                "scroll",
                handleScroll
            )
        }
    }, [])

    return (
        <div
            className="creative-footer-background"
            aria-hidden="true"
        >
            <video
                ref={videoRef}
                muted
                playsInline
                preload="auto"
                src={Background}
            />
        </div>
    )
}


const CreativeFooter = () => {
    return (
        <footer
            className="creative-footer"
            aria-label="Footer"
        >
            <FooterBackground />

            <div className="creative-footer-jobs">
                <span className="creative-footer-tag">
                    have a fresh idea?
                </span>

                <span className="creative-footer-headline creative-footer-job-title">
                    imagination
                    <br />
                    meets craft
                </span>

                <div className="creative-footer-nav">
                    <span>Made</span>
                    <span>Story</span>
                    <span>In the lab</span>
                    <span>Say hey</span>
                </div>
            </div>

            <div
                className="creative-footer-logo"
                role="img"
                aria-label="Studio logo"
            >
                <img src={BrandLogo} alt="Logo" />
            </div>
            <div className="creative-footer-contact">
                <span className="creative-footer-tag">
                    say hey
                </span>

                <div className="creative-footer-headline creative-footer-contact-links">
                    <span>let’s team up!</span>
                    <span>bring us your idea*</span>
                </div>

                <p className="creative-footer-note">
                    *good things start with one spark. let’s make yours.
                </p>

                <div className="creative-footer-socials">
                    <span aria-label="LinkedIn">
                        <img
                            src="/linkedin.svg"
                            alt=""
                            width="35"
                            height="35"
                        />
                    </span>

                    <span aria-label="Instagram">
                        <img
                            src="/instagram.svg"
                            alt=""
                            width="35"
                            height="35"
                        />
                    </span>

                    <span aria-label="TikTok">
                        <img
                            src="/tiktok.svg"
                            alt=""
                            width="35"
                            height="35"
                        />
                    </span>
                </div>
            </div>
        </footer>
    )
}

export default CreativeFooter
