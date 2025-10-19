import { useEffect, useState, useCallback } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import Toast from '../components/ui/Toast'
import { ChevronRight, ChevronLeft, ChevronRight as ChevronRightIcon } from 'lucide-react'
import useEmblaCarousel from 'embla-carousel-react'

type Product = {
  id: string
  name: string
  slug: string
  category_id: string | null
  base_price: number
  description: string | null
  images: string[]
  is_customizable: boolean
  in_stock: boolean
  status: string
}

type Category = {
  id: string
  name: string
  slug: string
}

type LeatherType = {
  id: string
  name: string
  description: string | null
}

type Color = {
  id: string
  name: string
  hex: string
}

type Size = {
  id: string
  value: string
  system: string | null
}

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()

  // Product data
  const [product, setProduct] = useState<Product | null>(null)
  const [category, setCategory] = useState<Category | null>(null)
  const [availableLeathers, setAvailableLeathers] = useState<LeatherType[]>([])
  const [availableColors, setAvailableColors] = useState<Color[]>([])
  const [availableSizes, setAvailableSizes] = useState<Size[]>([])

  // UI state
  const [isLoading, setIsLoading] = useState(true)
  const [mainImageIndex, setMainImageIndex] = useState(0)
  const [selectedLeather, setSelectedLeather] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)

  // Embla Carousel for mobile swipe
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false })

  useEffect(() => {
    if (slug) {
      fetchProductData()
    }
  }, [slug])

  useEffect(() => {
    if (!emblaApi) return

    emblaApi.on('select', () => {
      setMainImageIndex(emblaApi.selectedScrollSnap())
    })
  }, [emblaApi])

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  const fetchProductData = async () => {
    setIsLoading(true)

    try {
      // Fetch product
      const { data: productData, error: productError } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single()

      if (productError || !productData) {
        console.error('Product not found:', productError)
        navigate('/404')
        return
      }

      setProduct(productData)

      // Fetch category
      if (productData.category_id) {
        const { data: categoryData } = await supabase
          .from('categories')
          .select('id, name, slug')
          .eq('id', productData.category_id)
          .single()
        
        if (categoryData) {
          setCategory(categoryData)
        }
      }

      // Fetch available leather types
      const { data: leathersData } = await supabase
        .from('product_leather_types')
        .select('leather_type_id, leather_types!inner(id, name, description)')
        .eq('product_id', productData.id)

      if (leathersData && leathersData.length > 0) {
        const leathers: LeatherType[] = []
        leathersData.forEach((item: any) => {
          if (item.leather_types) {
            leathers.push(item.leather_types as LeatherType)
          }
        })
        setAvailableLeathers(leathers)
      }

      // Fetch available colors
      const { data: colorsData } = await supabase
        .from('product_colors')
        .select('color_id, colors!inner(id, name, hex)')
        .eq('product_id', productData.id)

      if (colorsData && colorsData.length > 0) {
        const colors: Color[] = []
        colorsData.forEach((item: any) => {
          if (item.colors) {
            colors.push(item.colors as Color)
          }
        })
        setAvailableColors(colors)
      }

      // Fetch available sizes
      const { data: sizesData } = await supabase
        .from('product_sizes')
        .select('size_id, sizes!inner(id, value, system)')
        .eq('product_id', productData.id)

      if (sizesData && sizesData.length > 0) {
        const sizes: Size[] = []
        sizesData.forEach((item: any) => {
          if (item.sizes) {
            sizes.push(item.sizes as Size)
          }
        })
        setAvailableSizes(sizes)
      }

    } catch (error) {
      console.error('Error fetching product:', error)
      navigate('/404')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddToCart = () => {
    if (!product) return

    const cartItem = {
      productId: product.id,
      productName: product.name,
      productSlug: product.slug,
      price: product.base_price,
      image: product.images?.[0] || '',
      selectedLeather: selectedLeather,
      selectedColor: selectedColor,
      selectedSize: selectedSize,
      quantity: 1,
      timestamp: new Date().toISOString()
    }

    const existingCart = JSON.parse(localStorage.getItem('osegonte_cart') || '[]')
    const updatedCart = [...existingCart, cartItem]
    localStorage.setItem('osegonte_cart', JSON.stringify(updatedCart))

    window.dispatchEvent(new Event('cartUpdated'))

    setShowSuccess(true)
  }

  const isAddToCartDisabled = () => {
    if (!product?.in_stock) return true
    if (availableLeathers.length > 0 && !selectedLeather) return true
    if (availableColors.length > 0 && !selectedColor) return true
    if (availableSizes.length > 0 && !selectedSize) return true
    return false
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-sm text-gray-400">Loading product...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return null
  }

  const productImages = product.images && product.images.length > 0 ? product.images : []

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Toast Notification */}
      <Toast 
        message="Added to cart successfully!"
        type="success"
        isVisible={showSuccess}
        onClose={() => setShowSuccess(false)}
        duration={3000}
      />

      <div className="pt-[160px] pb-24 px-8">
        <div className="max-w-[1600px] mx-auto">
          
          {/* Breadcrumbs */}
          <nav className="mb-8 flex items-center gap-2 text-xs text-gray-500">
            <Link to="/" className="hover:text-black transition-colors">Home</Link>
            <ChevronRight size={14} />
            {category && (
              <>
                <Link 
                  to={`/products?category=${category.slug}`} 
                  className="hover:text-black transition-colors"
                >
                  {category.name}
                </Link>
                <ChevronRight size={14} />
              </>
            )}
            <span className="text-black">{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* LEFT: Image Gallery */}
            <div>
              {productImages.length > 0 ? (
                <>
                  {/* Desktop View - Main Image + Thumbnails */}
                  <div className="hidden md:block">
                    {/* Main Image */}
                    <motion.div
                      key={mainImageIndex}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="bg-gray-50 aspect-[3/4] mb-4 overflow-hidden flex items-center justify-center"
                    >
                      <img 
                        src={productImages[mainImageIndex]} 
                        alt={`${product.name} - View ${mainImageIndex + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </motion.div>

                    {/* Thumbnail Strip */}
                    {productImages.length > 1 && (
                      <div className="grid grid-cols-4 gap-2">
                        {productImages.map((image, index) => (
                          <button
                            key={index}
                            onClick={() => setMainImageIndex(index)}
                            className={`aspect-square bg-gray-50 overflow-hidden border transition-all ${
                              mainImageIndex === index 
                                ? 'border-black' 
                                : 'border-transparent hover:border-gray-300'
                            }`}
                          >
                            <img 
                              src={image} 
                              alt={`Thumbnail ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Mobile View - Swipeable Carousel */}
                  <div className="md:hidden">
                    <div className="relative">
                      <div className="overflow-hidden" ref={emblaRef}>
                        <div className="flex">
                          {productImages.map((image, index) => (
                            <div key={index} className="flex-[0_0_100%] min-w-0">
                              <div className="bg-gray-50 aspect-[3/4] flex items-center justify-center">
                                <img 
                                  src={image} 
                                  alt={`${product.name} - Image ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Navigation Arrows - Mobile */}
                      {productImages.length > 1 && (
                        <>
                          <button
                            onClick={scrollPrev}
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-lg hover:bg-white transition-colors"
                            aria-label="Previous image"
                          >
                            <ChevronLeft size={20} />
                          </button>
                          <button
                            onClick={scrollNext}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-lg hover:bg-white transition-colors"
                            aria-label="Next image"
                          >
                            <ChevronRightIcon size={20} />
                          </button>

                          {/* Dots Indicator */}
                          <div className="flex justify-center gap-2 mt-4">
                            {productImages.map((_, index) => (
                              <button
                                key={index}
                                onClick={() => {
                                  emblaApi?.scrollTo(index)
                                  setMainImageIndex(index)
                                }}
                                className={`h-2 rounded-full transition-all ${
                                  index === mainImageIndex 
                                    ? 'bg-black w-6' 
                                    : 'bg-gray-300 w-2'
                                }`}
                                aria-label={`Go to image ${index + 1}`}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                /* No Images Placeholder */
                <div className="bg-gray-50 aspect-[3/4] flex items-center justify-center border border-gray-200">
                  <div className="text-center">
                    <p className="font-display text-3xl text-gray-200 mb-2">OSEGONTE</p>
                    <p className="text-xs text-gray-400">No image available</p>
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT: Product Info */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {/* Product Name */}
                <h1 className="text-2xl md:text-3xl mb-2 text-osegonte-black">
                  {product.name}
                </h1>
                
                {/* Price */}
                <p className="text-xl text-osegonte-black mb-6">
                  €{product.base_price.toFixed(2)}
                </p>

                {/* Stock Status */}
                <div className="mb-8">
                  {product.in_stock ? (
                    <div className="inline-flex items-center gap-2 text-xs text-green-600">
                      <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                      <span>In Stock</span>
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-2 text-xs text-red-600">
                      <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                      <span>Out of Stock</span>
                    </div>
                  )}
                </div>

                {/* Description */}
                {product.description && (
                  <p className="text-sm text-osegonte-black/70 leading-relaxed mb-10 border-t border-b border-gray-200 py-6">
                    {product.description}
                  </p>
                )}

                {/* Leather Selection */}
                {availableLeathers.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-xs tracking-widest mb-4 text-osegonte-black uppercase">
                      Leather Type
                    </h3>
                    <div className="space-y-2">
                      {availableLeathers.map((leather) => (
                        <button
                          key={leather.id}
                          onClick={() => setSelectedLeather(leather.id)}
                          className={`w-full border p-4 text-left transition-all ${
                            selectedLeather === leather.id 
                              ? 'border-black bg-gray-50' 
                              : 'border-gray-200 hover:border-gray-400'
                          }`}
                        >
                          <p className="text-sm font-medium text-osegonte-black mb-1">
                            {leather.name}
                          </p>
                          {leather.description && (
                            <p className="text-xs text-gray-500">
                              {leather.description}
                            </p>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Color Selection */}
                {availableColors.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-xs tracking-widest mb-4 text-osegonte-black uppercase">
                      Color
                    </h3>
                    <div className="flex flex-wrap gap-4">
                      {availableColors.map((color) => (
                        <button
                          key={color.id}
                          onClick={() => setSelectedColor(color.id)}
                          className="flex flex-col items-center gap-2 group"
                        >
                          <div
                            className={`w-12 h-12 rounded-full border-2 transition-all ${
                              selectedColor === color.id
                                ? 'border-black ring-2 ring-black ring-offset-2'
                                : 'border-gray-300 group-hover:border-gray-400'
                            }`}
                            style={{ backgroundColor: color.hex }}
                          />
                          <span className={`text-xs transition-colors ${
                            selectedColor === color.id 
                              ? 'text-osegonte-black font-medium' 
                              : 'text-gray-500'
                          }`}>
                            {color.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Size Selection */}
                {availableSizes.length > 0 && (
                  <div className="mb-10">
                    <h3 className="text-xs tracking-widest mb-4 text-osegonte-black uppercase">
                      Size
                    </h3>
                    <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                      {availableSizes.map((size) => (
                        <button
                          key={size.id}
                          onClick={() => setSelectedSize(size.id)}
                          className={`border p-3 text-center transition-all ${
                            selectedSize === size.id 
                              ? 'border-black bg-gray-50' 
                              : 'border-gray-200 hover:border-gray-400'
                          }`}
                        >
                          <span className="text-sm text-osegonte-black">
                            {size.system && <span className="text-xs text-gray-500">{size.system} </span>}
                            {size.value}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add to Cart */}
                <div className="space-y-4">
                  <button
                    onClick={handleAddToCart}
                    disabled={isAddToCartDisabled()}
                    className={`w-full py-4 text-xs tracking-widest transition-all uppercase font-medium ${
                      isAddToCartDisabled()
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-osegonte-black text-white hover:bg-osegonte-black/90 active:scale-[0.98]'
                    }`}
                  >
                    {!product.in_stock 
                      ? 'Out of Stock' 
                      : isAddToCartDisabled() 
                      ? 'Select All Options' 
                      : 'Add to Cart'
                    }
                  </button>

                  {/* Additional Actions */}
                  <button
                    className="w-full py-4 text-xs tracking-widest border border-gray-300 text-osegonte-black hover:bg-gray-50 transition-colors uppercase"
                  >
                    Add to Wishlist
                  </button>
                </div>

                {/* Care Instructions */}
                <div className="mt-10 pt-10 border-t border-gray-200">
                  <h4 className="text-xs tracking-widest mb-4 text-osegonte-black uppercase">
                    Care & Details
                  </h4>
                  <div className="space-y-3 text-xs text-osegonte-black/70 leading-relaxed">
                    <p>• Clean with a soft, dry cloth</p>
                    <p>• Store in a cool, dry place away from direct sunlight</p>
                    <p>• Avoid contact with water and harsh chemicals</p>
                    <p>• For deep cleaning, consult a professional leather care specialist</p>
                    <p>• Handcrafted with care in our atelier</p>
                  </div>
                </div>

                {/* Shipping Info */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h4 className="text-xs tracking-widest mb-4 text-osegonte-black uppercase">
                    Shipping & Returns
                  </h4>
                  <div className="space-y-2 text-xs text-osegonte-black/70">
                    <p>Free shipping on all orders</p>
                    <p>Delivered in 3-5 business days</p>
                    <p>30-day return policy</p>
                  </div>
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default ProductDetail