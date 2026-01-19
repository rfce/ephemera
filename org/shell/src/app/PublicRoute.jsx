import { useAtom } from 'jotai'
import { Navigate, Outlet } from 'react-router-dom'
import { tokenAtom } from '@org/shared-state'

const PublicRoute = () => {
    const [token] = useAtom(tokenAtom)

    // If a token exists, the user is already logged in. 
    // Redirect them away from Login/Register to the Dashboard.
    if (token) {
        return <Navigate to="/dashboard" replace />
    }

    // If no token, allow them to see the public page
    return <Outlet />
}

export default PublicRoute