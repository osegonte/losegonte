import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { Package, FolderTree, Palette, Ruler, Plus } from 'lucide-react'

const Dashboard = () => {
  const [stats, setStats] = useState({
    categories: 0,
    leatherTypes: 0,
    colors: 0,
    products: 0,
  })

  useEffect(() => {
    const fetchStats = async () => {
      const [categories, leatherTypes, colors, products] = await Promise.all([
        supabase.from('categories').select('*', { count: 'exact', head: true }),
        supabase.from('leather_types').select('*', { count: 'exact', head: true }),
        supabase.from('colors').select('*', { count: 'exact', head: true }),
        supabase.from('products').select('*', { count: 'exact', head: true }),
      ])

      setStats({
        categories: categories.count || 0,
        leatherTypes: leatherTypes.count || 0,
        colors: colors.count || 0,
        products: products.count || 0,
      })
    }

    fetchStats()
  }, [])

  const statCards = [
    { label: 'Categories', value: stats.categories, icon: FolderTree, link: '/admin/categories' },
    { label: 'Leather Types', value: stats.leatherTypes, icon: Palette, link: '/admin/leather-types' },
    { label: 'Colors', value: stats.colors, icon: Palette, link: '/admin/colors' },
    { label: 'Products', value: stats.products, icon: Package, link: '/admin/products' },
  ]

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold mb-2">Overview</h1>
        <p className="text-gray-600">Manage your OSEGONTE catalog</p>
      </div>

      {/* Stats Grid - Clean Apple Style */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {statCards.map((card) => {
          const Icon = card.icon
          return (
            <Link 
              key={card.label}
              to={card.link}
              className="bg-white p-6 rounded-xl border border-gray-200 hover:border-gray-300 transition-all hover:shadow-sm"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Icon className="text-gray-700" size={20} />
                </div>
              </div>
              <div className="text-3xl font-semibold mb-1">{card.value}</div>
              <div className="text-sm text-gray-600">{card.label}</div>
            </Link>
          )
        })}
      </div>

      {/* Quick Actions - Clean Cards */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link 
            to="/admin/categories"
            className="bg-white p-6 rounded-xl border border-gray-200 hover:border-gray-300 transition-all hover:shadow-sm group"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition-colors">
                <Plus size={20} className="text-gray-700" />
              </div>
              <h3 className="font-medium">Add Category</h3>
            </div>
            <p className="text-sm text-gray-600">Create a new product category</p>
          </Link>

          <Link 
            to="/admin/leather-types"
            className="bg-white p-6 rounded-xl border border-gray-200 hover:border-gray-300 transition-all hover:shadow-sm group"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition-colors">
                <Plus size={20} className="text-gray-700" />
              </div>
              <h3 className="font-medium">Add Leather Type</h3>
            </div>
            <p className="text-sm text-gray-600">Define new leather material</p>
          </Link>

          <Link 
            to="/admin/products"
            className="bg-white p-6 rounded-xl border border-gray-200 hover:border-gray-300 transition-all hover:shadow-sm group"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition-colors">
                <Plus size={20} className="text-gray-700" />
              </div>
              <h3 className="font-medium">Upload Product</h3>
            </div>
            <p className="text-sm text-gray-600">Add new product to catalog</p>
          </Link>
        </div>
      </div>

      {/* Recent Activity Placeholder */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="text-center py-12 text-gray-500">
          <p className="text-sm">No recent activity</p>
        </div>
      </div>
    </div>
  )
}

export default Dashboard