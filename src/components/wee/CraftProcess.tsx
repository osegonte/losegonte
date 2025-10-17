import { motion } from 'framer-motion'

const steps = [
  {
    number: "01",
    title: "Wee select full-grain hides",
    description: "Only the finest leather, chosen for character and durability."
  },
  {
    number: "02",
    title: "Wee cut with precision",
    description: "Every piece measured, every edge considered."
  },
  {
    number: "03",
    title: "Wee stitch by hand",
    description: "Patience and attention in every seam."
  },
  {
    number: "04",
    title: "Wee finish for time",
    description: "Built to age beautifully, to last generations."
  }
]

const CraftProcess = () => {
  return (
    <section className="relative w-full py-24 bg-white">
      <div className="max-w-7xl mx-auto px-8">
        
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="font-display text-4xl md:text-5xl text-center mb-20 text-osegonte-black"
        >
          The Process
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="text-center"
            >
              {/* Image Placeholder */}
              <div className="bg-gray-200 aspect-square mb-6 flex items-center justify-center">
                <span className="text-gray-400 text-sm">Step {step.number}</span>
              </div>

              <h3 className="font-display text-xl mb-3 text-osegonte-black">
                {step.title}
              </h3>
              <p className="text-sm text-osegonte-black/60 leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CraftProcess