import "./css/Dashboard.css"
import React, { Suspense } from 'react'

const Landing = React.lazy(() => import('pixels/Landing'))
const Dashboard = React.lazy(() => import('create-pixels/Dashboard'))

const LandingPage = () => {
    return (
        <div className="_8bxc">
            <Suspense fallback={<div>Loading…</div>}>
                <Dashboard />
            </Suspense>
            <Suspense fallback={<div>Loading…</div>}>
                <Landing />
            </Suspense>
        </div>
    )
}

export default LandingPage
