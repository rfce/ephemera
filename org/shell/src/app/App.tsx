import { Route, Routes, Link } from 'react-router-dom';
import Login from "./Login.jsx"
import Register from "./Register.jsx"
import Dashboard from './Dashboard.jsx';
import { Provider } from 'jotai';
import { shellStore } from '../atoms/nucleus.js';

export function App() {
  return (
    <Provider store={shellStore}>
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/sign-up" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
    </Provider>
  );
}

export default App;
