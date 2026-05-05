import "./css/Dashboard.css"
import React, { Suspense } from 'react'
import { PuffLoader } from "react-spinners"

const Landing = React.lazy(() => import('pixels/Landing'))
const Dashboard = React.lazy(() => import('create-pixels/Dashboard'))

const LandingPage = () => {
    return (
        <div className="_8bxc">
            <Suspense fallback={
                <div className="raven-zoea">
                    <PuffLoader color="#e07d6c" />
                </div>
            }>
                <Dashboard />
                <Landing />
            </Suspense>
        </div>
    )
}

export default LandingPage
