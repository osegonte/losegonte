import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Simple070 from './pages/Simple070'
import Wee from './pages/Wee'
import Shoes from './pages/products/Shoes'
import ProductDetail from './pages/products/ProductDetail'
import AdminDashboard from './pages/admin/AdminDashboard'
import './styles/index.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Simple070 />} />
        <Route path="/wee" element={<Wee />} />
        <Route path="/shoes" element={<Shoes />} />
        <Route path="/product/shoe/:id" element={<ProductDetail />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  )
}

export default App