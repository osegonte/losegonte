import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import { Home, Search } from 'lucide-react'

const NotFound = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="pt-32 pb-24 px-8">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            {/* 404 Number */}
            <h1 className="font-display text-9xl md:text-[12rem] text-gray-200 mb-8">
              404
            </h1>

            {/* Message */}
            <h2 className="font-display text-3xl md:text-4xl text-osegonte-black mb-4">
              Page Not Found
            </h2>
            <p className="text-base text-osegonte-black/70 mb-12 max-w-md mx-auto">
              The page you're looking for doesn't exist or has been moved.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 bg-osegonte-black text-white px-8 py-4 text-sm tracking-wider hover:bg-osegonte-black/80 transition-colors"
              >
                <Home size={20} />
                <span>GO HOME</span>
              </Link>

              <Link
                to="/products"
                className="inline-flex items-center justify-center gap-2 border border-osegonte-black text-osegonte-black px-8 py-4 text-sm tracking-wider hover:bg-osegonte-beige transition-colors"
              >
                <Search size={20} />
                <span>BROWSE PRODUCTS</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default NotFound