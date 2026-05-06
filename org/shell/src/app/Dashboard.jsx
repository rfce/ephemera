import "./css/Dashboard.css"
import React, { Suspense } from 'react'
import { PuffLoader } from "react-spinners"
import { lazy } from "./helpers/Preload"

const PixelsApp = lazy(() => import('pixels/PixelsApp'))
const CreatePixelsApp = lazy(() => import('create-pixels/CreatePixelsApp'))

const Dashboard = () => {
    return (
        <div className="_8bxc">
            <CreatePixelsApp />
            <PixelsApp />
        </div>
    )
}

export default Dashboard
