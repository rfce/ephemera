import "./css/Dashboard.css"
import React, { Suspense, useState } from 'react'
import { lazy } from "./helpers/Preload"

const Landing = lazy(() => import('pixels/Landing'))
const Dashboard = lazy(() => import('create-pixels/Dashboard'))
const QuickMode = lazy(() => import('create-pixels/QuickMode'))

const LandingPage = () => {
    const [advancedMode, setAdvancedMode] = useState(() => localStorage.getItem("expert") == "true")

    const toggleMode = () => {
        setAdvancedMode((prev) => {
            localStorage.setItem("expert", !prev)
            return !prev
        })
    }

    return (
        <div className="_8bxc">
            <Dashboard hidden={!advancedMode} />
            <Landing hidden={!advancedMode} />
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
    )
}

export default LandingPage
