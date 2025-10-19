import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Simple070 from './pages/Simple070'
import Wee from './pages/Wee'
import AdminLayout from './pages/admin/AdminLayout'
import Dashboard from './pages/admin/Dashboard'
import Categories from './pages/admin/Categories'
import LeatherTypes from './pages/admin/LeatherTypes'
import Colors from './pages/admin/Colors'
import Sizes from './pages/admin/Sizes'
import Products from './pages/admin/Products'
import './styles/index.css'

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Simple070 />} />
        <Route path="/wee" element={<Wee />} />
        
        {/* Admin routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="categories" element={<Categories />} />
          <Route path="leather-types" element={<LeatherTypes />} />
          <Route path="colors" element={<Colors />} />
          <Route path="sizes" element={<Sizes />} />
          <Route path="products" element={<Products />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App