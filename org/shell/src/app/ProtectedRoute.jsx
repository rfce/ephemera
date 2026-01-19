import { useAtom } from 'jotai'
import { tokenAtom } from '@org/shared-state'
import { Navigate, Outlet } from 'react-router-dom' 

const ProtectedRoute = () => {
    const [token] = useAtom(tokenAtom)

    // If no token, redirect to login
    if (!token) {
        return <Navigate to="/" replace />
    }

    // If token exists, render the child routes
    return <Outlet />
}

export default ProtectedRoute

