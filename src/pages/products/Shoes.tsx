import { useState, useEffect } from 'react'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../../firebase/config'
import { Product } from '../../types/Product'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Header from '../../components/layout/Header'
import Footer from '../../components/layout/Footer'

const Shoes = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const q = query(collection(db, 'products'), where('category', '==', 'shoes'))
        const querySnapshot = await getDocs(q)
        const productsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Product[]
        setProducts(productsData)
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-osegonte-black">Loading products...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <section className="pt-32 pb-16 px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center mb-12"
          >
            <h1 className="font-display text-5xl md:text-6xl mb-6 text-osegonte-black">
              Shoes
            </h1>
            <p className="text-lg text-osegonte-black/70 max-w-2xl mx-auto mb-8">
              Wee craft each pair with precision. Every stitch, every curve, built for comfort and time.
            </p>
            
            <Link 
              to="/customize/shoes"
              className="inline-block bg-osegonte-black text-white px-8 py-4 text-sm tracking-wider hover:bg-osegonte-black/80 transition-colors"
            >
              CUSTOMIZE FROM SCRATCH
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="pb-24 px-8">
        <div className="max-w-7xl mx-auto">
          {products.length === 0 ? (
            <p className="text-center text-osegonte-black/60">No products available yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Link to={`/product/shoe/${product.id}`} className="group block">
                    <div className="bg-gray-200 aspect-square mb-4 overflow-hidden">
                      {product.images[0] ? (
                        <img 
                          src={product.images[0]} 
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-gray-400 text-sm">{product.name}</span>
                        </div>
                      )}
                    </div>
                    
                    <h3 className="font-body text-base text-osegonte-black mb-1 group-hover:opacity-60 transition-opacity">
                      {product.name}
                    </h3>
                    <p className="text-sm text-osegonte-black/60">€{product.price}</p>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Shoes