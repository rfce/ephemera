import "./css/Dashboard.css"
import React, { Suspense } from 'react'
import { PuffLoader } from "react-spinners"

const PixelsApp = React.lazy(() => import('pixels/PixelsApp'))
const CreatePixelsApp = React.lazy(() => import('create-pixels/CreatePixelsApp'))

const Dashboard = () => {
    return (
        <div className="_8bxc">
            <Suspense fallback={
                <div className="raven-zoea">
                    <PuffLoader color="#e07d6c" />
                </div>
            }>
                <CreatePixelsApp />
                <PixelsApp />
            </Suspense>
        </div>
    )
}

export default Dashboard
