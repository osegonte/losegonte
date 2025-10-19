import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import Toast from '../components/ui/Toast'
import { X, Plus, Minus, ShoppingBag, Trash2, ArrowRight } from 'lucide-react'

type CartItem = {
  productId: string
  productName: string
  productSlug: string
  price: number
  image: string
  selectedLeather: string | null
  selectedColor: string | null
  selectedSize: string | null
  quantity: number
  timestamp: string
}

const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('success')

  useEffect(() => {
    loadCart()
  }, [])

  const loadCart = () => {
    setIsLoading(true)
    const savedCart = localStorage.getItem('osegonte_cart')
    if (savedCart) {
      try {
        const items = JSON.parse(savedCart)
        setCartItems(items)
      } catch (error) {
        console.error('Error loading cart:', error)
        setCartItems([])
      }
    }
    setIsLoading(false)
  }

  const updateCart = (updatedItems: CartItem[]) => {
    setCartItems(updatedItems)
    localStorage.setItem('osegonte_cart', JSON.stringify(updatedItems))
    window.dispatchEvent(new Event('cartUpdated'))
  }

  const removeItem = (index: number) => {
    const updatedItems = cartItems.filter((_, i) => i !== index)
    updateCart(updatedItems)
    showNotification('Item removed from cart', 'success')
  }

  const updateQuantity = (index: number, change: number) => {
    const updatedItems = [...cartItems]
    const newQuantity = updatedItems[index].quantity + change
    
    if (newQuantity > 0 && newQuantity <= 10) {
      updatedItems[index].quantity = newQuantity
      updateCart(updatedItems)
    } else if (newQuantity <= 0) {
      removeItem(index)
    } else {
      showNotification('Maximum quantity is 10', 'error')
    }
  }

  const clearCart = () => {
    if (confirm('Are you sure you want to clear your entire cart?')) {
      setCartItems([])
      localStorage.removeItem('osegonte_cart')
      window.dispatchEvent(new Event('cartUpdated'))
      showNotification('Cart cleared successfully', 'info')
    }
  }

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToastMessage(message)
    setToastType(type)
    setShowToast(true)
  }

  const calculateSubtotal = (): number => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  }
  
  const subtotal = calculateSubtotal()
  const shipping: number = subtotal > 0 ? 0 : 0 // Free shipping
  const tax = subtotal * 0.19 // 19% VAT (adjust based on your region)
  const total = subtotal + shipping + tax

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="pt-32 flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-sm text-gray-400">Loading cart...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Toast Notifications */}
      <Toast 
        message={toastMessage}
        type={toastType}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />

      <div className="pt-32 pb-24 px-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12 flex items-center justify-between"
          >
            <div>
              <h1 className="font-display text-3xl md:text-4xl text-osegonte-black mb-2">
                Shopping Bag
              </h1>
              <p className="text-sm text-gray-500">
                {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
              </p>
            </div>

            {cartItems.length > 0 && (
              <button
                onClick={clearCart}
                className="text-sm text-gray-500 hover:text-red-600 transition-colors flex items-center gap-2"
              >
                <Trash2 size={16} />
                <span className="hidden sm:inline">Clear Cart</span>
              </button>
            )}
          </motion.div>

          {/* Empty Cart State */}
          {cartItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-32"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              >
                <ShoppingBag className="mx-auto mb-6 text-gray-300" size={80} strokeWidth={1} />
              </motion.div>
              <h2 className="text-2xl font-display text-osegonte-black mb-4">
                Your shopping bag is empty
              </h2>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                Discover our collection of handcrafted leather goods and add items to your bag
              </p>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 bg-osegonte-black text-white px-8 py-4 text-sm tracking-wider hover:bg-osegonte-black/90 transition-colors"
              >
                <span>EXPLORE PRODUCTS</span>
                <ArrowRight size={16} />
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              
              {/* Left: Cart Items */}
              <div className="lg:col-span-2">
                <AnimatePresence mode="popLayout">
                  {cartItems.map((item, index) => (
                    <motion.div
                      key={`${item.productId}-${item.timestamp}-${index}`}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ 
                        opacity: 0, 
                        x: -100, 
                        height: 0,
                        marginBottom: 0,
                        paddingBottom: 0,
                        transition: { duration: 0.3 }
                      }}
                      transition={{ duration: 0.3 }}
                      className="flex gap-6 pb-8 mb-8 border-b border-gray-200 last:border-0"
                    >
                      {/* Product Image */}
                      <Link 
                        to={`/product/${item.productSlug}`}
                        className="flex-shrink-0 w-24 sm:w-32 h-32 sm:h-40 bg-gray-100 overflow-hidden group"
                      >
                        {item.image ? (
                          <img 
                            src={item.image} 
                            alt={item.productName}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <p className="text-xs text-gray-400">No image</p>
                          </div>
                        )}
                      </Link>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1 pr-4">
                            <Link 
                              to={`/product/${item.productSlug}`}
                              className="text-sm sm:text-base text-osegonte-black hover:opacity-60 transition-opacity block mb-2 font-medium"
                            >
                              {item.productName}
                            </Link>
                            
                            {/* Selected Options */}
                            {(item.selectedLeather || item.selectedColor || item.selectedSize) && (
                              <div className="space-y-1 mb-3">
                                {item.selectedLeather && (
                                  <p className="text-xs text-gray-500">
                                    Leather: <span className="text-gray-700">{item.selectedLeather}</span>
                                  </p>
                                )}
                                {item.selectedColor && (
                                  <p className="text-xs text-gray-500">
                                    Color: <span className="text-gray-700">{item.selectedColor}</span>
                                  </p>
                                )}
                                {item.selectedSize && (
                                  <p className="text-xs text-gray-500">
                                    Size: <span className="text-gray-700">{item.selectedSize}</span>
                                  </p>
                                )}
                              </div>
                            )}

                            {/* Price - Mobile */}
                            <p className="text-sm font-medium text-osegonte-black sm:hidden">
                              €{(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>

                          {/* Remove Button */}
                          <button
                            onClick={() => removeItem(index)}
                            className="text-gray-400 hover:text-red-600 transition-colors p-2 -mr-2"
                            aria-label="Remove item"
                          >
                            <X size={18} />
                          </button>
                        </div>

                        {/* Quantity Controls & Price */}
                        <div className="flex items-center justify-between mt-4">
                          {/* Quantity */}
                          <div className="flex items-center border border-gray-300 rounded">
                            <button
                              onClick={() => updateQuantity(index, -1)}
                              className="p-2 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              aria-label="Decrease quantity"
                              disabled={item.quantity <= 1}
                            >
                              <Minus size={14} />
                            </button>
                            <span className="text-sm w-10 text-center font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(index, 1)}
                              className="p-2 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              aria-label="Increase quantity"
                              disabled={item.quantity >= 10}
                            >
                              <Plus size={14} />
                            </button>
                          </div>

                          {/* Price - Desktop */}
                          <p className="text-base text-osegonte-black font-medium hidden sm:block">
                            €{(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Right: Order Summary */}
              <div className="lg:col-span-1">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-gray-50 p-6 rounded-lg sticky top-32"
                >
                  <h2 className="text-lg font-display text-osegonte-black mb-6">
                    Order Summary
                  </h2>

                  <div className="space-y-4 mb-6">
                    {/* Subtotal */}
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="text-osegonte-black font-medium">€{subtotal.toFixed(2)}</span>
                    </div>

                    {/* Shipping */}
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Shipping</span>
                      <span className="text-green-600 font-medium">
                        {shipping === 0 ? 'Free' : `€${shipping.toFixed(2)}`}
                      </span>
                    </div>

                    {/* Tax */}
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tax (19% VAT)</span>
                      <span className="text-osegonte-black font-medium">€{tax.toFixed(2)}</span>
                    </div>

                    {/* Total */}
                    <div className="pt-4 border-t border-gray-300 flex justify-between">
                      <span className="font-medium text-osegonte-black">Total</span>
                      <span className="font-medium text-osegonte-black text-xl">
                        €{total.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <button
                    className="w-full bg-osegonte-black text-white py-4 text-sm tracking-wider hover:bg-osegonte-black/90 transition-colors mb-3 flex items-center justify-center gap-2"
                  >
                    <span>PROCEED TO CHECKOUT</span>
                    <ArrowRight size={16} />
                  </button>

                  {/* Continue Shopping */}
                  <Link
                    to="/products"
                    className="block w-full text-center py-4 border border-osegonte-black text-osegonte-black text-sm tracking-wider hover:bg-osegonte-beige transition-colors"
                  >
                    CONTINUE SHOPPING
                  </Link>

                  {/* Additional Info */}
                  <div className="mt-6 pt-6 border-t border-gray-300">
                    <h3 className="text-xs tracking-widest text-osegonte-black mb-3 uppercase">
                      We Accept
                    </h3>
                    <div className="flex gap-2 mb-4">
                      <div className="w-12 h-8 bg-white border border-gray-200 rounded flex items-center justify-center text-xs font-semibold">
                        VISA
                      </div>
                      <div className="w-12 h-8 bg-white border border-gray-200 rounded flex items-center justify-center text-xs font-semibold">
                        MC
                      </div>
                      <div className="w-12 h-8 bg-white border border-gray-200 rounded flex items-center justify-center text-xs font-semibold">
                        AMEX
                      </div>
                    </div>
                    <div className="space-y-2 text-xs text-gray-500 leading-relaxed">
                      <p>✓ Free shipping on all orders</p>
                      <p>✓ Secure checkout with SSL encryption</p>
                      <p>✓ 30-day return policy</p>
                      <p>✓ All prices include VAT</p>
                    </div>
                  </div>
                </motion.div>
              </div>

            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default Cart