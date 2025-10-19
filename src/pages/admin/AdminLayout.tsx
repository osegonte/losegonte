import { Link, Outlet, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  FolderTree, 
  Palette, 
  Ruler, 
  Package
} from 'lucide-react'

const AdminLayout = () => {
  const location = useLocation()
  
  const navItems = [
    { path: '/admin', label: 'Overview', icon: LayoutDashboard },
    { path: '/admin/categories', label: 'Categories', icon: FolderTree },
    { path: '/admin/leather-types', label: 'Leather Types', icon: Palette },
    { path: '/admin/colors', label: 'Colors', icon: Palette },
    { path: '/admin/sizes', label: 'Sizes', icon: Ruler },
    { path: '/admin/products', label: 'Products', icon: Package },
  ]

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === path
    }
    return location.pathname.startsWith(path)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar - Apple Style */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-12">
              <Link to="/" className="font-display text-xl">OSEGONTE</Link>
              <div className="hidden md:flex items-center gap-1">
                {navItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${
                        isActive(item.path)
                          ? 'bg-gray-100 text-black font-medium'
                          : 'text-gray-600 hover:text-black hover:bg-gray-50'
                      }`}
                    >
                      <Icon size={16} />
                      <span>{item.label}</span>
                    </Link>
                  )
                })}
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Link to="/" className="text-sm text-gray-600 hover:text-black">
                Preview Site
              </Link>
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-xs font-medium">A</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout