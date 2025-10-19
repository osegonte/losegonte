import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const CollectionSelector = () => {
  return (
    <section className="relative w-full py-32 bg-osegonte-beige">
      <div className="max-w-7xl mx-auto px-8">
        {/* Season Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-5xl md:text-6xl font-light mb-6 text-osegonte-black">
            Fall / Winter 2025
          </h2>
          <p className="text-lg text-osegonte-black/70 max-w-2xl mx-auto leading-relaxed">
            A new age of craftsmanship — merging heritage with refinement.
          </p>
        </motion.div>

        {/* For Her / For Him Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="flex justify-center gap-16 mt-20"
        >
          <Link 
            to="/products" 
            className="group relative text-2xl md:text-3xl font-display tracking-wide text-osegonte-black hover:opacity-60 transition-opacity"
          >
            FOR HER
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-osegonte-black group-hover:w-full transition-all duration-500"></span>
          </Link>

          <Link 
            to="/products" 
            className="group relative text-2xl md:text-3xl font-display tracking-wide text-osegonte-black hover:opacity-60 transition-opacity"
          >
            FOR HIM
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-osegonte-black group-hover:w-full transition-all duration-500"></span>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

export default CollectionSelector