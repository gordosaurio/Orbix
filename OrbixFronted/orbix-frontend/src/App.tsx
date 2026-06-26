import { Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import CelestialDetailsPage from './pages/CelestialDetailsPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/planet/:id" element={<CelestialDetailsPage />} />
      <Route path="/sun" element={<CelestialDetailsPage />} />
    </Routes>
  )
}

export default App