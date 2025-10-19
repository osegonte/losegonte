import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Simple070 from './pages/Simple070'
import Wee from './pages/Wee'
import ProductDetail from './pages/ProductDetail'
import ProductsListing from './pages/ProductsListing'
import Cart from './pages/Cart'
import NotFound from './pages/NotFound'
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
        <Route path="/products" element={<ProductsListing />} />
        <Route path="/product/:slug" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        
        {/* Admin routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="categories" element={<Categories />} />
          <Route path="leather-types" element={<LeatherTypes />} />
          <Route path="colors" element={<Colors />} />
          <Route path="sizes" element={<Sizes />} />
          <Route path="products" element={<Products />} />
        </Route>

        {/* 404 - Catch all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}

export default App