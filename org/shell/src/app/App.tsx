import "./css/App.css"
import { Route, Routes, useLocation } from 'react-router-dom'
import Login from "./Login.jsx"
import Register from "./Register.jsx"
import Dashboard from './Dashboard.jsx'
import ForgotPassword from "./ForgotPassword"
import { Provider } from 'jotai'
import { sharedStore } from '@org/shared-state'
import ProtectedRoute from './ProtectedRoute.jsx'
import PublicRoute from './PublicRoute.jsx'
import Pixels from './Pixels.jsx'
import NewMessage from './NewMessage.jsx'
import Track from './Track.jsx'
import LandingPage from './LandingPage.jsx'
import { Suspense, useEffect } from 'react'
import { scheduleRemainingRemotes } from './helpers/Run.js'
import ValidateEmail from "./ValidateEmail"
import ValidateEmailSuccess from "./ValidateEmailSuccess"

export function App() {
  const { pathname } = useLocation()

  useEffect(() => {
    scheduleRemainingRemotes(pathname)
  }, [pathname])

  return (
    <Provider store={sharedStore}>
      <Suspense
        fallback={
          <div className="app-route-placeholder" aria-live="polite">
            <span className="app-route-placeholder__title">Track Pixels</span>
          </div>
        }
      >
        <div>
          <Routes>
            <Route element={<PublicRoute />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/sign-in" element={<Login />} />
              <Route path="/sign-up" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/verify" element={<ValidateEmail />} />
              <Route path="/email-verified" element={<ValidateEmailSuccess />} />
            </Route>
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/dashboard/create-pixels" element={<Pixels />} />
              <Route path="/dashboard/message/:eas" element={<NewMessage />} />
              <Route path="/dashboard/track-boat/:eas" element={<Track />} />
            </Route>
          </Routes>
        </div>
      </Suspense>
    </Provider>
  )
}

export default App
