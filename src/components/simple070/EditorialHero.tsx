import { motion } from 'framer-motion'

const EditorialHero = () => {
  return (
    <section className="relative w-full h-screen bg-osegonte-dark">
      {/* Placeholder Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-600 flex items-center justify-center">
        <p className="text-white/30 text-2xl font-display">Editorial Image Placeholder</p>
      </div>

      {/* Caption Text - Bottom Center */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="absolute bottom-16 left-0 right-0 text-center z-10"
      >
        <h3 className="text-white font-display text-2xl md:text-3xl font-light tracking-wide">
          Wee craft each piece by hand in our atelier
        </h3>
      </motion.div>
    </section>
  )
}

export default EditorialHero