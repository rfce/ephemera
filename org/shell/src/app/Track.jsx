import "./css/Dashboard.css"
import React, { Suspense } from 'react'
import { PuffLoader } from "react-spinners"
import { lazy } from "./helpers/Preload"

const Header = lazy(() => import('create-pixels/Header'))
const TrackMessage = lazy(() => import('pixels/TrackMessage'))

const Track = () => {
    return (
        <div className="_2tow">
            <Header />
            <div className="groaning-zing">
                <div>
                    <TrackMessage />
                </div>
            </div>
        </div>
    )
}

export default Track
