import "./css/Dashboard.css"
import React, { Suspense } from 'react'
import { PuffLoader } from "react-spinners"
import { lazy } from "./helpers/Preload"

const Landing = lazy(() => import('pixels/Landing'))
const Dashboard = lazy(() => import('create-pixels/Dashboard'))

const LandingPage = () => {
    return (
        <div className="_8bxc">
            <Dashboard />
            <Landing />
        </div>
    )
}

export default LandingPage
