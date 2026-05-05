import "./css/Dashboard.css"
import React, { Suspense } from 'react'
import { PuffLoader } from "react-spinners"

const Header = React.lazy(() => import('create-pixels/Header'))
const TrackMessage = React.lazy(() => import('pixels/TrackMessage'))

const Track = () => {
    return (
        <div className="_2tow">
            <Suspense fallback={
                <div className="raven-zoea">
                    <PuffLoader color="#e07d6c" />
                </div>
            }>
                <Header />
                <div className="groaning-zing">
                    <div>
                        <TrackMessage />
                    </div>
                </div>
            </Suspense>
        </div>
    )
}

export default Track
