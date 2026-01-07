import { lazy, Suspense } from 'react'
import { loadPixels, loadCreatePixels } from '../remotes'

const PixelsApp = lazy(loadPixels)
const CreatePixelsApp = lazy(loadCreatePixels)

const Dashboard = () => {
    return (
        <div className="_8bxc">
            <Suspense fallback={<div>Loading…</div>}>
                <PixelsApp />
            </Suspense>
            <Suspense fallback={<div>Loading…</div>}>
                <CreatePixelsApp />
            </Suspense>
        </div>
    )
}

export default Dashboard
