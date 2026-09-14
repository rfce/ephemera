import React, { useRef, useEffect } from "react"

const Video = ({ src }) => {
  const videoRef = useRef(null)

  // This simple useEffect ensures the video plays on iOS/Safari in low-power mode
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.warn("Browser prevented autoplay:", error)
      })
    }
  }, [])

  return (
    <video
      ref={videoRef}
      src={src}
      autoPlay
      muted
      loop
      playsInline
      controls={false}
      style={{
        width: "100%",
        height: "auto",
        display: "block",
        
        /* The Chromium Hardware Acceleration Fixes */
        transform: "translate3d(0, 0, 0)",
        WebkitTransform: "translate3d(0, 0, 0)",
        willChange: "transform",
        backgroundColor: "transparent",
        backfaceVisibility: "hidden"
      }}
    />
  )
}

export default Video
