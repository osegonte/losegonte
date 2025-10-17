import { motion } from 'framer-motion'

const materials = [
  { name: "Soft Calfskin", description: "Supple and refined" },
  { name: "Nubuck", description: "Velvety texture" },
  { name: "Heritage Brown", description: "Rich patina" },
  { name: "Deep Black", description: "Timeless classic" }
]

const MaterialsGallery = () => {
  return (
    <section className="relative w-full py-24 bg-osegonte-beige">
      <div className="max-w-7xl mx-auto px-8">
        
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="font-display text-4xl md:text-5xl text-center mb-20 text-osegonte-black"
        >
          Materials
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {materials.map((material, index) => (
            <motion.div
              key={material.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group cursor-pointer"
            >
              {/* Material Texture Placeholder */}
              <div className="bg-gray-300 aspect-square mb-4 overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-500 group-hover:scale-105 transition-transform duration-700 flex items-center justify-center">
                  <span className="text-white/40 text-sm">{material.name}</span>
                </div>
              </div>

              <h3 className="font-body text-base tracking-wide text-osegonte-black mb-1">
                {material.name}
              </h3>
              <p className="text-sm text-osegonte-black/60">
                {material.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default MaterialsGallery