import "./css/Dashboard.css"
import React, { Suspense } from 'react'
import { PuffLoader } from "react-spinners"
import { lazy } from "./helpers/Preload"

const Header = lazy(() => import('create-pixels/Header'))
const AliasPick = lazy(() => import('pixels/AliasPick'))

const Dashboard = () => {
    return (
        <div className="_2tow">
            <Header />
            <AliasPick />
        </div>
    )
}

export default Dashboard
