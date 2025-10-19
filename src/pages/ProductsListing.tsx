import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabase'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import SubcategoryNav from '../components/products/SubcategoryNav'
import ProductSkeleton from '../components/ui/ProductSkeleton'
import { X, Package } from 'lucide-react'

type Product = {
  id: string
  name: string
  slug: string
  category_id: string | null
  base_price: number
  images: string[]
  in_stock: boolean
  created_at: string
}

type Category = {
  id: string
  name: string
  slug: string
}

const PLACEHOLDER_PRODUCTS = Array.from({ length: 12 }, (_, i) => ({
  id: `placeholder-${i}`,
  name: `Product ${String.fromCharCode(65 + (i % 26))}-${String(i + 1).padStart(3, '0')}`,
  slug: `product-${i}`,
  category_id: null,
  base_price: 450 + (i * 50),
  images: [],
  in_stock: true,
  created_at: new Date().toISOString()
}))

const ProductsListing = () => {
  const [searchParams] = useSearchParams()
  
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  const selectedCategory = searchParams.get('category') || 'all'
  const [sortBy, setSortBy] = useState<string>('recommended')
  const [showFilters, setShowFilters] = useState(false)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000])
  const [inStockOnly, setInStockOnly] = useState(false)

  useEffect(() => {
    fetchCategories()
    fetchProducts()
  }, [selectedCategory])

  const fetchCategories = async () => {
    const { data } = await supabase
      .from('categories')
      .select('id, name, slug')
      .eq('is_active', true)
      .order('order', { ascending: true })

    if (data) setCategories(data)
  }

  const fetchProducts = async () => {
    setIsLoading(true)

    let query = supabase
      .from('products')
      .select('*')
      .eq('status', 'published')

    if (selectedCategory !== 'all') {
      const category = categories.find(c => c.slug === selectedCategory)
      if (category) {
        query = query.eq('category_id', category.id)
      }
    }

    const { data } = await query
    
    // Simulate network delay for better UX demonstration
    await new Promise(resolve => setTimeout(resolve, 500))
    
    if (data && data.length > 0) {
      setProducts(data)
    } else {
      setProducts(PLACEHOLDER_PRODUCTS)
    }
    
    setIsLoading(false)
  }

  const getFilteredProducts = () => {
    let filtered = [...products]

    if (inStockOnly) {
      filtered = filtered.filter(product => product.in_stock)
    }

    filtered = filtered.filter(product => 
      product.base_price >= priceRange[0] && product.base_price <= priceRange[1]
    )

    switch (sortBy) {
      case 'price-low':
        return filtered.sort((a, b) => a.base_price - b.base_price)
      case 'price-high':
        return filtered.sort((a, b) => b.base_price - a.base_price)
      case 'newest':
        return filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      default:
        return filtered
    }
  }

  const displayProducts = getFilteredProducts()
  const productCount = displayProducts.length

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {selectedCategory !== 'all' && <SubcategoryNav category={selectedCategory} />}

      <div className={`${selectedCategory !== 'all' ? 'pt-[160px]' : 'pt-[104px]'} pb-16 px-8`}>
        <div className="max-w-[1920px] mx-auto">
          
          {/* Top Controls Bar */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
            <p className="text-sm text-gray-500">
              {isLoading ? '...' : `${productCount} PRODUCTS`}
            </p>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">SORT BY:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-sm text-osegonte-black border-none bg-transparent cursor-pointer focus:outline-none uppercase"
                >
                  <option value="recommended">SUGGESTED</option>
                  <option value="price-low">PRICE: LOW TO HIGH</option>
                  <option value="price-high">PRICE: HIGH TO LOW</option>
                  <option value="newest">NEWEST</option>
                </select>
              </div>

              <button
                onClick={() => setShowFilters(true)}
                className="flex items-center gap-2 text-sm text-osegonte-black hover:opacity-60 transition-opacity uppercase"
              >
                <span>FILTERS</span>
              </button>
            </div>
          </div>

          {/* Filter Sidebar */}
          <AnimatePresence>
            {showFilters && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowFilters(false)}
                  className="fixed inset-0 bg-black/30 z-40"
                />

                <motion.div
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'tween', duration: 0.3 }}
                  className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl overflow-y-auto"
                >
                  <div className="p-8">
                    <button
                      onClick={() => setShowFilters(false)}
                      className="absolute top-6 right-6 text-osegonte-black hover:opacity-60"
                    >
                      <X size={24} />
                    </button>

                    <h2 className="text-sm tracking-widest mb-8 text-osegonte-black">FILTERS</h2>

                    {/* Price Range */}
                    <div className="mb-8">
                      <h3 className="text-xs tracking-widest mb-4 text-osegonte-black">PRICE RANGE</h3>
                      <div className="space-y-4">
                        <input
                          type="range"
                          min="0"
                          max="5000"
                          step="50"
                          value={priceRange[1]}
                          onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                          className="w-full accent-black"
                        />
                        <p className="text-sm text-osegonte-black">
                          €{priceRange[0]} - €{priceRange[1]}
                        </p>
                      </div>
                    </div>

                    {/* Stock Filter */}
                    <div className="mb-8">
                      <h3 className="text-xs tracking-widest mb-4 text-osegonte-black">AVAILABILITY</h3>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={inStockOnly}
                          onChange={(e) => setInStockOnly(e.target.checked)}
                          className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                        />
                        <span className="text-sm text-osegonte-black">In Stock Only</span>
                      </label>
                    </div>

                    {/* Clear Filters */}
                    <button
                      onClick={() => {
                        setPriceRange([0, 5000])
                        setInStockOnly(false)
                      }}
                      className="w-full py-3 border border-osegonte-black text-osegonte-black text-sm tracking-wider hover:bg-osegonte-black hover:text-white transition-colors"
                    >
                      CLEAR FILTERS
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Products Grid */}
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10">
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          ) : displayProducts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-32"
            >
              <Package className="mx-auto mb-6 text-gray-300" size={64} />
              <h2 className="text-xl font-display text-osegonte-black mb-4">
                No products found
              </h2>
              <p className="text-sm text-gray-500 mb-8">
                Try adjusting your filters or browse all products
              </p>
              <button
                onClick={() => {
                  setPriceRange([0, 5000])
                  setInStockOnly(false)
                }}
                className="text-sm text-osegonte-black hover:underline"
              >
                Clear all filters
              </button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10">
              {displayProducts.map((product, index) => {
                const isPlaceholder = product.id.startsWith('placeholder-')
                
                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.02 }}
                  >
                    <Link 
                      to={isPlaceholder ? '#' : `/product/${product.slug}`} 
                      className="group block"
                      onClick={(e) => isPlaceholder && e.preventDefault()}
                    >
                      {/* Product Image */}
                      <div className="relative bg-gray-100 aspect-[3/4] mb-3 overflow-hidden border border-gray-200">
                        {product.images && product.images.length > 0 ? (
                          <img 
                            src={product.images[0]} 
                            alt={product.name}
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 ease-out"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center">
                            <div className="text-center">
                              <p className="text-xs text-gray-400 mb-2">PRODUCT IMAGE</p>
                              <p className="font-display text-lg text-gray-300">OSEGONTE</p>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Product Info */}
                      <div className="space-y-1">
                        <h3 className="text-xs text-osegonte-black tracking-wide group-hover:opacity-60 transition-opacity">
                          {product.name}
                        </h3>
                        <p className="text-xs text-osegonte-black/70">
                          €{product.base_price.toFixed(2)}
                        </p>
                      </div>
                    </Link>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default ProductsListing