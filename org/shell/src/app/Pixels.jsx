import "./css/Dashboard.css"
import React, { Suspense } from 'react'

const Header = React.lazy(() => import('create-pixels/Header'))
const AliasPick = React.lazy(() => import('pixels/AliasPick'))

const Dashboard = () => {
    return (
        <div className="_2tow">
            <Suspense fallback={<div>Loading…</div>}>
                <Header />
            </Suspense>
            <Suspense fallback={<div>Loading…</div>}>
                <AliasPick />
            </Suspense>
        </div>
    )
}

export default Dashboard
