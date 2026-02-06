import { Route, Routes, Link } from 'react-router-dom'
import Login from "./Login.jsx"
import Register from "./Register.jsx"
import Dashboard from './Dashboard.jsx'
import { Provider } from 'jotai'
import { sharedStore } from '@org/shared-state'
import ProtectedRoute from './ProtectedRoute.jsx'
import PublicRoute from './PublicRoute.jsx'
import Pixels from './Pixels.jsx'

export function App() {
  return (
    <Provider store={sharedStore}>
      <div>
        <Routes>
          <Route element={<PublicRoute />}>
            <Route path="/" element={<Login />} />
            <Route path="/sign-up" element={<Register />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/create-pixels" element={<Pixels />} />
          </Route>
        </Routes>
      </div>
    </Provider>
  )
}

export default App
