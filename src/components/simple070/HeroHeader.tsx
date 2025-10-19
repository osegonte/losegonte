import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const HeroHeader = () => {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-white">
      {/* Background Image Layer */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=2940')`,
        }}
      >
        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* OSEGONTE Text - Smaller & Higher */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-8" style={{ marginTop: '-8vh' }}>
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-white font-display font-bold text-center"
          style={{
            fontSize: 'clamp(5rem, 11vw, 13rem)',
            letterSpacing: '0.02em',
            lineHeight: 0.9,
            textTransform: 'uppercase'
          }}
        >
          OSEGONTE
        </motion.h1>

        {/* Men's & Women's Links Below */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="flex gap-8 mt-12"
        >
          <Link 
            to="/products" 
            className="text-white text-lg tracking-wider hover:opacity-60 transition-opacity font-light"
          >
            WOMEN
          </Link>
          <span className="text-white text-lg">|</span>
          <Link 
            to="/products" 
            className="text-white text-lg tracking-wider hover:opacity-60 transition-opacity font-light"
          >
            MEN
          </Link>
        </motion.div>
      </div>

      {/* Subline - Bottom Left */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.7 }}
        className="absolute bottom-12 left-12 text-white max-w-md z-10"
      >
        <p className="text-sm tracking-wide leading-relaxed">
          Wee craft timeless leather for a quiet kind of luxury.
        </p>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.7 }}
        className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-10"
      >
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1 h-3 bg-white rounded-full mt-2"
          />
        </div>
      </motion.div>
    </section>
  )
}

export default HeroHeader