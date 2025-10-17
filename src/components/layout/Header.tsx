import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? 'bg-white shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="max-w-[1920px] mx-auto px-8 py-6">
        <div className="flex items-center justify-between">
          {/* Left: Contact Link */}
          <div className="flex-1">
            <Link 
              to="/contact" 
              className={`text-sm tracking-wider hover:opacity-60 transition-opacity ${
                isScrolled ? 'text-black' : 'text-white'
              }`}
            >
              + contact
            </Link>
          </div>

          {/* Center: Empty (no logo) */}
          <div className="flex-1"></div>

          {/* Right: Icons */}
          <div className={`flex-1 flex justify-end items-center gap-6 ${
            isScrolled ? 'text-black' : 'text-white'
          }`}>
            <button className="hover:opacity-60 transition-opacity" aria-label="Shopping Cart">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </button>
            <button className="hover:opacity-60 transition-opacity" aria-label="Account">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>
            <button className="hover:opacity-60 transition-opacity" aria-label="Search">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <button className="flex items-center gap-2 hover:opacity-60 transition-opacity">
              <span className="text-sm tracking-wider">MENU</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header