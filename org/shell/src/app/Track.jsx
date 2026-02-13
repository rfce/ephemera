import "./css/Dashboard.css"
import React, { Suspense } from 'react'

const Header = React.lazy(() => import('create-pixels/Header'))
const TrackMessage = React.lazy(() => import('pixels/TrackMessage'))

const Track = () => {
    return (
        <div className="_2tow">
            <Suspense fallback={<div>Loading…</div>}>
                <Header />
            </Suspense>
            <div className="groaning-zing">
                <div>
                    <Suspense fallback={<div>Loading…</div>}>
                        <TrackMessage />
                    </Suspense>
                </div>
            </div>

        </div>
    )
}

export default Track
