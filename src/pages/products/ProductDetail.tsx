import { useState } from 'react'
import { motion } from 'framer-motion'
import { useParams, Link } from 'react-router-dom'
import Header from '../../components/layout/Header'
import Footer from '../../components/layout/Footer'

const ProductDetail = () => {
  const { id } = useParams()
  const [selectedLeather, setSelectedLeather] = useState('calfskin')
  const [selectedSize, setSelectedSize] = useState('42')
  const [specialNotes, setSpecialNotes] = useState('')

  // Sample product data (you'll fetch real data later)
  const product = {
    name: "Classic Oxford",
    price: "€450",
    description: "Wee craft this timeless oxford with full-grain leather. Hand-stitched soles, refined silhouette.",
    images: ["", "", ""] // Placeholders for multiple images
  }

  const leatherTypes = [
    { id: 'calfskin', name: 'Soft Calfskin', price: '+€0' },
    { id: 'nubuck', name: 'Nubuck', price: '+€50' },
    { id: 'heritage', name: 'Heritage Brown', price: '+€30' },
    { id: 'black', name: 'Deep Black', price: '+€0' }
  ]

  const sizes = ['39', '40', '41', '42', '43', '44', '45', '46']

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <section className="pt-32 pb-24 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Left: Product Images */}
            <div>
              {/* Main Image */}
              <div className="bg-gray-200 aspect-square mb-4 flex items-center justify-center">
                <span className="text-gray-400">Product Image</span>
              </div>
              
              {/* Thumbnail Images */}
              <div className="grid grid-cols-3 gap-4">
                {product.images.map((_, index) => (
                  <div key={index} className="bg-gray-200 aspect-square flex items-center justify-center cursor-pointer hover:opacity-70">
                    <span className="text-gray-400 text-xs">Image {index + 1}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Product Details & Customization */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
              >
                <h1 className="font-display text-4xl md:text-5xl mb-4 text-osegonte-black">
                  {product.name}
                </h1>
                <p className="text-2xl text-osegonte-black mb-8">{product.price}</p>
                <p className="text-base text-osegonte-black/70 leading-relaxed mb-12">
                  {product.description}
                </p>

                {/* Leather Type Selection */}
                <div className="mb-8">
                  <h3 className="text-sm tracking-wider mb-4 text-osegonte-black">SELECT LEATHER TYPE</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {leatherTypes.map((leather) => (
                      <button
                        key={leather.id}
                        onClick={() => setSelectedLeather(leather.id)}
                        className={`border-2 p-4 text-left transition-all ${
                          selectedLeather === leather.id 
                            ? 'border-osegonte-black bg-osegonte-beige' 
                            : 'border-gray-300 hover:border-osegonte-black'
                        }`}
                      >
                        <p className="text-sm font-medium text-osegonte-black">{leather.name}</p>
                        <p className="text-xs text-osegonte-black/60">{leather.price}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Size Selection */}
                <div className="mb-8">
                  <h3 className="text-sm tracking-wider mb-4 text-osegonte-black">SELECT SIZE (EU)</h3>
                  <div className="grid grid-cols-4 gap-3">
                    {sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`border-2 p-3 text-center transition-all ${
                          selectedSize === size 
                            ? 'border-osegonte-black bg-osegonte-beige' 
                            : 'border-gray-300 hover:border-osegonte-black'
                        }`}
                      >
                        <span className="text-sm text-osegonte-black">{size}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Special Notes */}
                <div className="mb-8">
                  <h3 className="text-sm tracking-wider mb-4 text-osegonte-black">SPECIAL NEEDS (OPTIONAL)</h3>
                  <textarea
                    value={specialNotes}
                    onChange={(e) => setSpecialNotes(e.target.value)}
                    placeholder="Tell us about any specific requirements..."
                    className="w-full border-2 border-gray-300 p-4 text-sm focus:border-osegonte-black focus:outline-none resize-none"
                    rows={4}
                  />
                </div>

                {/* Action Buttons */}
                <div className="space-y-4">
                  <button className="w-full bg-osegonte-black text-white py-4 text-sm tracking-wider hover:bg-osegonte-black/80 transition-colors">
                    ADD TO CART
                  </button>
                  <Link 
                    to={`/customize/shoe/${id}`}
                    className="block w-full border-2 border-osegonte-black text-osegonte-black py-4 text-sm tracking-wider text-center hover:bg-osegonte-beige transition-colors"
                  >
                    FULLY CUSTOMIZE THIS
                  </Link>
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default ProductDetail