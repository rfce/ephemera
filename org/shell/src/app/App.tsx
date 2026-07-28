import "./css/App.css"
import { Route, Routes, Link } from 'react-router-dom'
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
import { useEffect, useState } from 'react'
import { preloadAllRemotes } from './helpers/Run.js'
import { PuffLoader } from 'react-spinners'
import ValidateEmail from "./ValidateEmail"
import ValidateEmailSuccess from "./ValidateEmailSuccess"

export function App() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    preloadAllRemotes().then(() => setReady(true))
  }, [])

  if (!ready) {
    return (
      <div className="_8bxc">
        <div className="raven-zoea">
          <PuffLoader color="#e07d6c" />
        </div>
      </div>
    )
  }

  return (
    <Provider store={sharedStore}>
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
    </Provider>
  )
}

export default App
