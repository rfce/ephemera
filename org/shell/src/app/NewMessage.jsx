import "./css/Dashboard.css"
import React, { Suspense } from 'react'

const Header = React.lazy(() => import('create-pixels/Header'))
const CreateMessage = React.lazy(() => import('pixels/CreateMessage'))

const NewMessage = () => {
    return (
        <div className="_2tow">
            <Suspense fallback={<div>Loading…</div>}>
                <Header />
            </Suspense>
            <Suspense fallback={<div>Loading…</div>}>
                <CreateMessage />
            </Suspense>
        </div>
    )
}

export default NewMessage
