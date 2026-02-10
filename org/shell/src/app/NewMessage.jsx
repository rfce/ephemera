import "./css/Dashboard.css"
import React, { Suspense } from 'react'

const Header = React.lazy(() => import('create-pixels/Header'))
const CreateMessage = React.lazy(() => import('pixels/CreateMessage'))
const Recommended = React.lazy(() => import('create-pixels/Recommended'))

const NewMessage = () => {
    return (
        <div className="_2tow">
            <Suspense fallback={<div>Loading…</div>}>
                <Header />
            </Suspense>
            <div className="groaning-zing">
                <div>
                    <Suspense fallback={<div>Loading…</div>}>
                        <CreateMessage />
                    </Suspense>
                </div>
                <div>
                    <Suspense fallback={<div>Loading…</div>}>
                        <Recommended />
                    </Suspense>
                </div>
            </div>

        </div>
    )
}

export default NewMessage
