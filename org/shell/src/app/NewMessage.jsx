import "./css/Dashboard.css"
import React, { Suspense } from 'react'
import { PuffLoader } from "react-spinners"

const Header = React.lazy(() => import('create-pixels/Header'))
const CreateMessage = React.lazy(() => import('pixels/CreateMessage'))
const Recommended = React.lazy(() => import('create-pixels/Recommended'))

const NewMessage = () => {
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
                        <CreateMessage />
                    </div>
                    <div>
                        <Recommended />
                    </div>
                </div>
            </Suspense>
        </div>
    )
}

export default NewMessage
