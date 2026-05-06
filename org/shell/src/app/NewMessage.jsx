import "./css/Dashboard.css"
import React, { Suspense } from 'react'
import { PuffLoader } from "react-spinners"
import { lazy } from "./helpers/Preload"

const Header = lazy(() => import('create-pixels/Header'))
const CreateMessage = lazy(() => import('pixels/CreateMessage'))
const Recommended = lazy(() => import('create-pixels/Recommended'))

const NewMessage = () => {
    return (
        <div className="_2tow">
            <Header />
            <div className="groaning-zing">
                <div>
                    <CreateMessage />
                </div>
                <div>
                    <Recommended />
                </div>
            </div>
        </div>
    )
}

export default NewMessage
