import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Plus, Edit2, Trash2 } from 'lucide-react'

type Category = {
  id: string
  name: string
  slug: string
}

type Size = {
  id: string
  category_id: string | null
  system: string | null
  value: string
  order: number | null
  is_active: boolean
  created_at: string
}

const Sizes = () => {
  const [sizes, setSizes] = useState<Size[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingSize, setEditingSize] = useState<Size | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const [formData, setFormData] = useState({
    category_id: '',
    system: '',
    value: '',
    order: 0,
    is_active: true
  })

  useEffect(() => {
    fetchCategories()
    fetchSizes()
  }, [])

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('id, name, slug')
      .order('order', { ascending: true })

    if (error) {
      console.error('Error fetching categories:', error)
    } else {
      setCategories(data || [])
    }
  }

  const fetchSizes = async () => {
    setIsLoading(true)
    const { data, error } = await supabase
      .from('sizes')
      .select('*')
      .order('order', { ascending: true })

    if (error) {
      console.error('Error fetching sizes:', error)
    } else {
      setSizes(data || [])
    }
    setIsLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const sizeData = {
      category_id: formData.category_id || null,
      system: formData.system || null,
      value: formData.value,
      order: formData.order,
      is_active: formData.is_active,
    }

    if (editingSize) {
      const { error } = await supabase
        .from('sizes')
        .update(sizeData)
        .eq('id', editingSize.id)

      if (error) {
        alert('Error updating size: ' + error.message)
      } else {
        setShowModal(false)
        setEditingSize(null)
        resetForm()
        fetchSizes()
      }
    } else {
      const { error } = await supabase
        .from('sizes')
        .insert([sizeData])

      if (error) {
        alert('Error creating size: ' + error.message)
      } else {
        setShowModal(false)
        resetForm()
        fetchSizes()
      }
    }
  }

  const handleEdit = (size: Size) => {
    setEditingSize(size)
    setFormData({
      category_id: size.category_id || '',
      system: size.system || '',
      value: size.value,
      order: size.order || 0,
      is_active: size.is_active
    })
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this size?')) return

    const { error } = await supabase
      .from('sizes')
      .delete()
      .eq('id', id)

    if (error) {
      alert('Error deleting size: ' + error.message)
    } else {
      fetchSizes()
    }
  }

  const resetForm = () => {
    setFormData({
      category_id: '',
      system: '',
      value: '',
      order: sizes.length + 1,
      is_active: true
    })
  }

  const openNewModal = () => {
    resetForm()
    setEditingSize(null)
    setShowModal(true)
  }

  const getCategoryName = (categoryId: string | null) => {
    if (!categoryId) return 'All Categories'
    const category = categories.find(c => c.id === categoryId)
    return category?.name || 'Unknown'
  }

  const filteredSizes = selectedCategory === 'all' 
    ? sizes 
    : sizes.filter(s => s.category_id === selectedCategory)

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold mb-2">Sizes</h1>
          <p className="text-gray-600">Build your size library by category</p>
        </div>
        <button
          onClick={openNewModal}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          <Plus size={20} />
          <span>Add Size</span>
        </button>
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              selectedCategory === 'all'
                ? 'bg-black text-white'
                : 'bg-white border border-gray-300 hover:bg-gray-50'
            }`}
          >
            All Categories
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                selectedCategory === category.id
                  ? 'bg-black text-white'
                  : 'bg-white border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Sizes Table */}
      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Loading...</p>
        </div>
      ) : filteredSizes.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-gray-500 mb-4">No sizes yet</p>
          <button
            onClick={openNewModal}
            className="text-sm text-black hover:underline"
          >
            Create your first size
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Category
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider">
                  System
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Value
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Order
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-right px-6 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredSizes.map((size) => (
                <tr key={size.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <span className="text-sm">{getCategoryName(size.category_id)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">{size.system || '—'}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium">{size.value}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">{size.order}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      size.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {size.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(size)}
                        className="p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(size.id)}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h2 className="text-xl font-semibold mb-4">
              {editingSize ? 'Edit Size' : 'New Size'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Category (Optional)</label>
                <select
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">Leave empty if this size applies to all categories</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Size System (Optional)</label>
                <select
                  value={formData.system}
                  onChange={(e) => setFormData({ ...formData, system: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  <option value="">-- Select System (Optional) --</option>
                  <option value="EU">EU (European)</option>
                  <option value="US">US (American)</option>
                  <option value="UK">UK (British)</option>
                  <option value="CM">CM (Centimeters)</option>
                  <option value="Standard">Standard (S/M/L/XL)</option>
                  <option value="Numeric">Numeric (1/2/3/4)</option>
                  <option value="Universal">Universal (One Size)</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">Leave blank if not applicable</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Size Value *</label>
                <input
                  type="text"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="42, Medium, 10.5, XL"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Can be a number (42), letter (M), or both (EU 42)</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Display Order</label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                />
                <label htmlFor="is_active" className="text-sm font-medium">
                  Active (available for products)
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    setEditingSize(null)
                    resetForm()
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  {editingSize ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Sizes