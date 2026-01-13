import "./css/Dashboard.css"
import React, { Suspense } from 'react'

const PixelsApp = React.lazy(() => import('pixels/PixelsApp'))
const CreatePixelsApp = React.lazy(() => import('create-pixels/CreatePixelsApp'))

const Dashboard = () => {
    return (
        <div className="_8bxc">
            <Suspense fallback={<div>Loading…</div>}>
                <PixelsApp />
            </Suspense>
            <Suspense fallback={<div>Loading…</div>}>
                <CreatePixelsApp />
            </Suspense>
        </div>
    )
}

export default Dashboard
