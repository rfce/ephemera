import "./css/App.css"
import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { StackedCarousel } from "react-stacked-center-carousel"

// Create the URL dynamically based on where *this* module lives
// This ensures it always points to localhost:4201 (or production remote)
const Logo = "https://res.cloudinary.com/dkcyztevs/image/upload/f_auto,q_auto/Logo_tcmc8s"
const Background = "https://res.cloudinary.com/dkcyztevs/image/upload/f_auto,q_auto/poppy-flowers_gnbawa"
const GmailIcon = "https://res.cloudinary.com/dkcyztevs/image/upload/f_auto,q_auto/v1774073230/Gmail_Icon_uigcyc.png"
const GMXIcon = "https://res.cloudinary.com/dkcyztevs/image/upload/f_auto,q_auto/v1774073230/GMX_Icon_wa39gq.png"
const OutlookIcon = "https://res.cloudinary.com/dkcyztevs/image/upload/f_auto,q_auto/v1774073231/Outlook_Icon_tumep2.png"
const TutaIcon = "https://res.cloudinary.com/dkcyztevs/image/upload/f_auto,q_auto/v1774073230/Tuta_Icon_j2qlaf.png"
const MailcomIcon = "https://res.cloudinary.com/dkcyztevs/image/upload/f_auto,q_auto/v1774073230/Mail.com_Icon_r4wwss.png"
const YahooIcon = "https://res.cloudinary.com/dkcyztevs/image/upload/f_auto,q_auto/v1774073231/Yahoo_Icon_ptjyuz.png"
const ZohoIcon = "https://res.cloudinary.com/dkcyztevs/image/upload/f_auto,q_auto/v1774073231/Zoho_Icon_kilrzq.png"
const InfomaniakIcon = "https://res.cloudinary.com/dkcyztevs/image/upload/f_auto,q_auto/v1774073230/Infomaniak_Icon_cr92pf.png"
const AOLIcon = "https://res.cloudinary.com/dkcyztevs/image/upload/f_auto,q_auto/v1774073230/AOL_Icon_yjccal.jpg"
const iCloudIcon = "https://res.cloudinary.com/dkcyztevs/image/upload/f_auto,q_auto/v1774073230/icloud_Icon_a8ygkj.png"

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
