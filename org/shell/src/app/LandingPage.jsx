import "./css/Dashboard.css"
import React, { Suspense, useRef, useState } from 'react'
import { lazy } from "./helpers/Preload"
import Hero from "./Hero"
import CreativeFooter from "./CreativeFooter"
import Video from "./Video"
import MeshCarousel from "./MeshCarousel"
import PlatformSupport from "./PlatformSupport"

const QuickMode = lazy(() => import('create-pixels/QuickMode'))

const DemoVideo = "https://res.cloudinary.com/dkcyztevs/video/upload/v1773988101/Demo_-video_e1o2o3.mp4"

const LandingPage = () => {
    const [advancedMode, setAdvancedMode] = useState(() => localStorage.getItem("expert") == "true")

    const [tiltStyle, setTiltStyle] = useState({
        // We include translateX(-50%) to ensure it stays centered 
        // as defined in your previous CSS
        transform: 'translateX(-50%) perspective(1200px) rotateX(0deg) rotateY(0deg) scale(1)',
    })

    const containerRef = useRef(null)

    const handleMouseMove = (e) => {
        if (!containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();

        // Calculate cursor position relative to the container
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Find the center of the container
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Determine the tilt intensity (Max 12 degrees)
        const maxTilt = 12;

        // Calculate rotation based on how far cursor is from center
        // Note: Y-axis movement rotates around X-axis, X-axis movement rotates around Y-axis
        const rotateX = ((y - centerY) / centerY) * -maxTilt;
        const rotateY = ((x - centerX) / centerX) * maxTilt;

        setTiltStyle({
            transform: `translateX(-50%) perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`,
            transition: 'transform 0.1s ease-out' // Fast follow on mouse move
        })
    }

    const handleMouseLeave = () => {
        // Reset smoothly back to resting position when mouse leaves
        setTiltStyle({
            transform: 'translateX(-50%) perspective(1200px) rotateX(0deg) rotateY(0deg) scale(1)',
            transition: 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)' // Smooth, premium snap-back
        })
    }

    const toggleMode = () => {
        setAdvancedMode((prev) => {
            localStorage.setItem("expert", !prev)
            return !prev
        })
    }

    return (
        <div className="_6clb">
            {advancedMode ? <>
                <Hero />
                <div className="apteria-hazy">
                    <div
                        className="video-container"
                        ref={containerRef}
                        onMouseMove={handleMouseMove}
                        onMouseLeave={handleMouseLeave}
                        style={tiltStyle} // Apply the dynamic styles here
                    >
                        <div>
                            Watch the magic happen — zero setup. total visibility
                        </div>
                        <Video src={DemoVideo} />
                    </div>
                </div>
                <div className="panels-owls">
                    <div className="headline">
                        Know exactly what happens <br /> after you hit <span className="coral-accent">send.</span>
                    </div>
                    <div className="subheadline">
                        Frictionless tracking — without the enterprise bloat.
                    </div>
                </div>
                <MeshCarousel />
                <PlatformSupport />
                <CreativeFooter />
            </> : undefined}
            <div className="_8bxc">
                <QuickMode hidden={advancedMode} />
                <div className="clouds-gee">
                    <div
                        className={`mode-toggle ${advancedMode ? "advanced" : "quick"}`}
                        onClick={toggleMode}
                    >
                        <div className="mode-pill">
                            {advancedMode ? "Expert Mode" : "Quick Mode"}
                        </div>

                        <div className="mode-option quick-option">
                            Quick Mode
                        </div>

                        <div className="mode-option advanced-option">
                            Expert Mode
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LandingPage
