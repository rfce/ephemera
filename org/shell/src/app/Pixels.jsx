import "./css/Dashboard.css"
import React, { Suspense } from 'react'
import { PuffLoader } from "react-spinners"

const Header = React.lazy(() => import('create-pixels/Header'))
const AliasPick = React.lazy(() => import('pixels/AliasPick'))

const Dashboard = () => {
    return (
        <div className="_2tow">
            <Suspense fallback={
                <div className="raven-zoea">
                    <PuffLoader color="#e07d6c" />
                </div>
            }>
                <Header />
                <AliasPick />
            </Suspense>
        </div>
    )
}

export default Dashboard
