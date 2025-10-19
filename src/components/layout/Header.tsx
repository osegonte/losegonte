import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Search, ShoppingBag, User, Heart } from 'lucide-react'

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    // Update cart count
    const updateCartCount = () => {
      const cart = localStorage.getItem('osegonte_cart')
      if (cart) {
        try {
          const items = JSON.parse(cart)
          setCartCount(items.length)
        } catch {
          setCartCount(0)
        }
      } else {
        setCartCount(0)
      }
    }

    updateCartCount()

    // Listen for cart updates
    window.addEventListener('storage', updateCartCount)
    // Custom event for same-page updates
    window.addEventListener('cartUpdated', updateCartCount)

    return () => {
      window.removeEventListener('storage', updateCartCount)
      window.removeEventListener('cartUpdated', updateCartCount)
    }
  }, [])

  // Don't show transparent header on product/listing pages (but exclude admin)
  const isProductPage = (location.pathname.includes('/product') || location.pathname.includes('/products') || location.pathname.includes('/cart')) && !location.pathname.includes('/admin')
  const shouldBeWhite = isProductPage || isScrolled

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        shouldBeWhite ? 'bg-white shadow-sm' : 'bg-transparent'
      }`}
    >
      {/* Top Bar */}
      <div className="border-b border-gray-200">
        <div className="max-w-[1920px] mx-auto px-8 py-3">
          <div className="flex items-center justify-between">
            
            {/* Left: Contact */}
            <div className="flex-1">
              <Link 
                to="/contact" 
                className={`text-xs tracking-wider hover:opacity-60 transition-opacity ${
                  shouldBeWhite ? 'text-black' : 'text-white'
                }`}
              >
                + contact
              </Link>
            </div>

            {/* Center: Logo */}
            <div className="flex-1 flex justify-center">
              <Link to="/" className={`font-display text-2xl tracking-widest ${
                shouldBeWhite ? 'text-black' : 'text-white'
              }`}>
                OSEGONTE
              </Link>
            </div>

            {/* Right: Icons */}
            <div className={`flex-1 flex justify-end items-center gap-6 ${
              shouldBeWhite ? 'text-black' : 'text-white'
            }`}>
              <button className="hover:opacity-60 transition-opacity" aria-label="Search">
                <Search size={20} />
              </button>
              <Link to="/wishlist" className="hover:opacity-60 transition-opacity" aria-label="Wishlist">
                <Heart size={20} />
              </Link>
              <Link to="/account" className="hover:opacity-60 transition-opacity" aria-label="Account">
                <User size={20} />
              </Link>
              <Link to="/cart" className="relative hover:opacity-60 transition-opacity" aria-label="Shopping Bag">
                <ShoppingBag size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-osegonte-black text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation - Only on product/cart pages */}
      {isProductPage && (
        <div className="bg-white">
          <div className="max-w-[1920px] mx-auto px-8">
            <nav className="flex items-center justify-center gap-8 py-4">
              <Link 
                to="/products" 
                className={`text-sm tracking-wider hover:opacity-60 transition-opacity ${
                  location.pathname === '/products' && !location.search ? 'text-osegonte-black font-medium' : 'text-osegonte-black'
                }`}
              >
                ALL
              </Link>
              <Link 
                to="/products?category=shoes" 
                className={`text-sm tracking-wider hover:opacity-60 transition-opacity ${
                  location.search.includes('category=shoes') ? 'text-osegonte-black font-medium' : 'text-osegonte-black'
                }`}
              >
                SHOES
              </Link>
              <Link 
                to="/products?category=bags" 
                className={`text-sm tracking-wider hover:opacity-60 transition-opacity ${
                  location.search.includes('category=bags') ? 'text-osegonte-black font-medium' : 'text-osegonte-black'
                }`}
              >
                BAGS
              </Link>
              <Link 
                to="/products?category=jackets" 
                className={`text-sm tracking-wider hover:opacity-60 transition-opacity ${
                  location.search.includes('category=jackets') ? 'text-osegonte-black font-medium' : 'text-osegonte-black'
                }`}
              >
                JACKETS
              </Link>
              <Link 
                to="/products?category=accessories" 
                className={`text-sm tracking-wider hover:opacity-60 transition-opacity ${
                  location.search.includes('category=accessories') ? 'text-osegonte-black font-medium' : 'text-osegonte-black'
                }`}
              >
                ACCESSORIES
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header