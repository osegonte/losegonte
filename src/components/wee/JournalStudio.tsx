import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const articles = [
  {
    title: "Inside the Atelier",
    description: "A glimpse into where each piece begins.",
    link: "/journal/atelier"
  },
  {
    title: "How We See Time",
    description: "Building for longevity, not trends.",
    link: "/journal/time"
  },
  {
    title: "Material Dialogues",
    description: "Conversations with leather and craft.",
    link: "/journal/materials"
  }
]

const JournalStudio = () => {
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
          Journal
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {articles.map((article, index) => (
            <motion.div
              key={article.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
            >
              <Link to={article.link} className="group block">
                {/* Article Image Placeholder */}
                <div className="bg-gray-200 aspect-[4/3] mb-6 overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 group-hover:scale-105 transition-transform duration-700 flex items-center justify-center">
                    <span className="text-gray-500 text-sm">Coming Soon</span>
                  </div>
                </div>

                <h3 className="font-display text-2xl mb-3 text-osegonte-black group-hover:opacity-60 transition-opacity">
                  {article.title}
                </h3>
                <p className="text-sm text-osegonte-black/60 leading-relaxed">
                  {article.description}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default JournalStudio