import { motion } from 'framer-motion'

const ContactCTA = () => {
  return (
    <section className="relative w-full py-32 bg-osegonte-beige">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-3xl mx-auto text-center px-8"
      >
        <h2 className="font-display text-4xl md:text-5xl mb-8 text-osegonte-black">
          For bespoke inquiries or collaborations, contact Wee.
        </h2>
        <a 
          href="mailto:inquiries@osegonte.com"
          className="inline-block text-lg text-osegonte-black border-b-2 border-osegonte-black hover:opacity-60 transition-opacity"
        >
          inquiries@osegonte.com
        </a>
      </motion.div>
    </section>
  )
}

export default ContactCTA