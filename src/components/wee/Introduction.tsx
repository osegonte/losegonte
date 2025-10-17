import { motion } from 'framer-motion'

const Introduction = () => {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center bg-osegonte-beige px-8 py-24">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="max-w-4xl text-center"
      >
        <h1 className="font-display text-5xl md:text-7xl font-light mb-8 text-osegonte-black leading-tight">
          Wee believe elegance is silence expressed in form.
        </h1>
        <p className="text-lg md:text-xl text-osegonte-black/70 leading-relaxed">
          Our craft speaks through materials, not words.
        </p>
      </motion.div>
    </section>
  )
}

export default Introduction