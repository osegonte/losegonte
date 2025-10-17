import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const categories = [
  {
    title: "Women's Bags",
    link: "/women/bags"
  },
  {
    title: "Men's Boots",
    link: "/men/boots"
  },
  {
    title: "Leather Jackets",
    link: "/jackets"
  },
  {
    title: "Accessories",
    link: "/accessories"
  }
]

const CategoryGrid = () => {
  return (
    <section className="relative w-full py-24 bg-white">
      <div className="max-w-7xl mx-auto px-8">
        
        {/* Intro Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <p className="text-osegonte-black text-base md:text-lg leading-relaxed max-w-3xl mx-auto">
            Wee believe elegance is silence expressed in form. Each creation merges 
            heritage craftsmanship with refined design for the modern connoisseur.
          </p>
        </motion.div>

        {/* Women / Men Tabs */}
        <div className="flex justify-center gap-8 mb-16 border-b border-gray-200 pb-4">
          <button className="text-osegonte-black font-body text-sm tracking-wider border-b-2 border-osegonte-black pb-2">
            Women
          </button>
          <button className="text-osegonte-black/50 font-body text-sm tracking-wider hover:text-osegonte-black transition-colors pb-2">
            Men
          </button>
        </div>

        {/* 4-Column Grid with Placeholders */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Link 
                to={category.link}
                className="group block"
              >
                {/* Product Image Placeholder */}
                <div className="relative overflow-hidden bg-gray-200 aspect-square mb-4 flex items-center justify-center">
                  <span className="text-gray-400 text-sm font-body">Image</span>
                </div>
                
                {/* Category Label */}
                <h4 className="text-osegonte-black font-body text-base tracking-wide text-center group-hover:opacity-60 transition-opacity">
                  {category.title}
                </h4>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CategoryGrid