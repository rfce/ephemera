import "./css/Dashboard.css"
import React, { Suspense } from 'react'

const Header = React.lazy(() => import('create-pixels/Header'))
const PixelsApp = React.lazy(() => import('pixels/PixelsApp'))

const Dashboard = () => {
    return (
        <div className="_2tow">
            <Suspense fallback={<div>Loading…</div>}>
                <Header />
            </Suspense>
            <Suspense fallback={<div>Loading…</div>}>
                <PixelsApp />
            </Suspense>
        </div>
    )
}

export default Dashboard
