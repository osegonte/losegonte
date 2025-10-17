import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-osegonte-dark text-white py-16">
      <div className="max-w-7xl mx-auto px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Column 1: Subscribe */}
          <div>
            <h4 className="text-sm tracking-wider mb-4 font-body">SUBSCRIBE</h4>
            <p className="text-sm text-white/70 mb-4">Join our quiet circle.</p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Email address"
                className="bg-transparent border-b border-white/30 px-2 py-2 text-sm flex-1 focus:outline-none focus:border-white"
              />
              <button className="ml-2 hover:opacity-60 transition-opacity">→</button>
            </div>
          </div>

          {/* Column 2: Customer Care */}
          <div>
            <h4 className="text-sm tracking-wider mb-4 font-body">CUSTOMER CARE</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link to="/returns" className="hover:text-white transition-colors">Returns</Link></li>
              <li><Link to="/shipping" className="hover:text-white transition-colors">Shipping</Link></li>
              <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div>
            <h4 className="text-sm tracking-wider mb-4 font-body">COMPANY</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link to="/wee" className="hover:text-white transition-colors">About Wee</Link></li>
              <li><Link to="/craft" className="hover:text-white transition-colors">Craft</Link></li>
              <li><Link to="/journal" className="hover:text-white transition-colors">Journal</Link></li>
              <li><Link to="/sustainability" className="hover:text-white transition-colors">Sustainability</Link></li>
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div>
            <h4 className="text-sm tracking-wider mb-4 font-body">LEGAL</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link to="/cookies" className="hover:text-white transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>

        </div>

        {/* Social Icons */}
        <div className="flex justify-center gap-6 mb-8 text-white/70">
          <a href="#" className="hover:text-white transition-colors">Instagram</a>
          <a href="#" className="hover:text-white transition-colors">TikTok</a>
          <a href="#" className="hover:text-white transition-colors">Pinterest</a>
          <a href="#" className="hover:text-white transition-colors">YouTube</a>
        </div>

        {/* Copyright */}
        <div className="text-center text-sm text-white/50">
          © OSEGONTE 2025 — Handcrafted Elegance
        </div>

      </div>
    </footer>
  )
}

export default Footer