import "./css/App.css"
import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { StackedCarousel } from "react-stacked-center-carousel"

// Create the URL dynamically based on where *this* module lives
// This ensures it always points to localhost:4201 (or production remote)
const Logo = new URL('../assets/Logo.jpg', import.meta.url).href;
const Background = new URL('../assets/poppy-flowers.png', import.meta.url).href;
const GmailIcon = new URL('../assets/Gmail Icon.png', import.meta.url).href;
const GMXIcon = new URL('../assets/GMX Icon.png', import.meta.url).href;
const OutlookIcon = new URL('../assets/Outlook Icon.png', import.meta.url).href;
const TutaIcon = new URL('../assets/Tuta Icon.png', import.meta.url).href;
const MailcomIcon = new URL('../assets/Mail.com Icon.png', import.meta.url).href;
const YahooIcon = new URL('../assets/Yahoo Icon.png', import.meta.url).href;
const ZohoIcon = new URL('../assets/Zoho Icon.png', import.meta.url).href;
const InfomaniakIcon = new URL('../assets/Infomaniak Icon.png', import.meta.url).href;
const AOLIcon = new URL('../assets/AOL Icon.jpg', import.meta.url).href;
const iCloudIcon = new URL('../assets/icloud Icon.png', import.meta.url).href;

const data = [
  { image: GmailIcon, name: "Gmail" },
  { image: OutlookIcon, name: "Outlook" },
  { image: YahooIcon, name: "Yahoo Mail" },
  { image: iCloudIcon, name: "Apple Mail" },
  { image: TutaIcon, name: "Tuta Mail" },
  { image: GMXIcon, name: "GMX Mail" },
  { image: MailcomIcon, name: "Mail.com" },
  { image: ZohoIcon, name: "Zoho Mail" },
  { image: InfomaniakIcon, name: "Infomaniak Mail" },
  { image: AOLIcon, name: "AOL Mail" },
]

const Dashboard = () => {
  const [activeIndex, setActiveIndex] = useState(0)

  const carouselRef = useRef()

  const navigate = useNavigate()

  useEffect(() => {
    const interval = setInterval(() => {
      if (carouselRef.current) {
        carouselRef.current.goNext()
      }
    }, 2500)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="_8rid">
      <div className="trebly-oat">
        <img className="steep-hiss" src={Logo} alt="Logo" />
        <div>
          <div>Track Pixels</div>
          <div className="tabarded-tux">Send Magic • Track Everything</div>
        </div>
        <div className="panter-voes">
          <div onClick={() => navigate("/sign-in")}>Login</div>
          <div onClick={() => navigate("/sign-up")}>Sign Up</div>
        </div>
      </div>
      <div className="outfind-sore">
        <div className="debugged-deys">
          <img src={Background} alt="" />
          <div className="greater-lux">
            <div className="partners-premium">
              <div className="partners-header-card">
                <div className="partners-heading">
                  <div className="partners-label">
                    EMAIL PLATFORM SUPPORT
                  </div>
                  <h2>
                    Works with your favorite
                    <span className="accent-text"> email platforms</span>
                  </h2>
                  <p>
                    Track Pixels works seamlessly with the tools you already use.
                    No integrations, plugins, or inbox access required.
                  </p>
                </div>
                <div className="partners-divider" />
                <div className="partners-active">
                  <span className="platform-dot"></span>
                  {data[activeIndex]?.name}
                </div>
              </div>
              <StackedCarousel
                ref={carouselRef}
                data={data}
                slideWidth={220}
                carouselWidth={1400}
                maxVisibleSlide={5}
                onActiveSlideChange={(index) => setActiveIndex(index)}
                slideComponent={({ dataIndex, data }) => {

                  const isActive = dataIndex === activeIndex

                  return (
                    <div className={`partner-logo-wrapper ${isActive ? "active" : ""}`}>
                      <img
                        src={data[dataIndex].image}
                        className="partner-logo"
                        alt="partner"
                      />
                    </div>
                  )
                }}
              />

            </div>
          </div>
        </div>
        <div className="degut-jug">Emails that tell you when they’re opened.</div>
      </div>
      <div className="water-wave">

      </div>

    </div>
  )
}

export default Dashboard
