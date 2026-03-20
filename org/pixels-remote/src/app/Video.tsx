import { useEffect, useRef } from "react"

const Video = ({ src }) => {
  const videoRef = useRef(null)

  useEffect(() => {
    const loadVideo = async () => {
      const video = videoRef.current

      // Safari supports HLS natively
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = src
        return
      }

      // Other browsers → use hls.js (lazy loaded)
      const Hls = (await import("hls.js")).default

      if (Hls.isSupported()) {
        const hls = new Hls({
          autoStartLoad: true,
        })

        hls.loadSource(src)
        hls.attachMedia(video)
      }
    }

    loadVideo()
  }, [])

  return (
    <video
      ref={videoRef}
      autoPlay
      muted
      loop
      playsInline
      controls={true}
      style={{
        width: "100%",
        height: "auto",
        display: "block",
      }}
    />
  )
}

export default Video
