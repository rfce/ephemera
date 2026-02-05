import AddRecipient from "./AddRecipient"
import AliasPick from "./AliasPick"
import "./css/App.css"
import { Route, Routes } from "react-router-dom"

const PixelsApp = () => {
  return (
      <Routes>
        <Route path="/" element={<AddRecipient />} />
        <Route path="/select" element={<AliasPick />} />
      </Routes>
  )
}

export default PixelsApp
