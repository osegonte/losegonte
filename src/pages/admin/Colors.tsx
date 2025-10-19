import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Plus, Edit2, Trash2 } from 'lucide-react'

type Color = {
  id: string
  name: string
  hex: string
  finish: string | null
  is_active: boolean
  order: number | null
  created_at: string
  updated_at: string
}

const Colors = () => {
  const [colors, setColors] = useState<Color[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingColor, setEditingColor] = useState<Color | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    hex: '#000000',
    finish: '',
    order: 0,
    is_active: true
  })

  useEffect(() => {
    fetchColors()
  }, [])

  const fetchColors = async () => {
    setIsLoading(true)
    const { data, error } = await supabase
      .from('colors')
      .select('*')
      .order('order', { ascending: true })

    if (error) {
      console.error('Error fetching colors:', error)
    } else {
      setColors(data || [])
    }
    setIsLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const colorData = {
      name: formData.name,
      hex: formData.hex,
      finish: formData.finish || null,
      order: formData.order,
      is_active: formData.is_active,
    }

    if (editingColor) {
      const { error } = await supabase
        .from('colors')
        .update({
          ...colorData,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingColor.id)

      if (error) {
        alert('Error updating color: ' + error.message)
      } else {
        setShowModal(false)
        setEditingColor(null)
        resetForm()
        fetchColors()
      }
    } else {
      const { error } = await supabase
        .from('colors')
        .insert([colorData])

      if (error) {
        alert('Error creating color: ' + error.message)
      } else {
        setShowModal(false)
        resetForm()
        fetchColors()
      }
    }
  }

  const handleEdit = (color: Color) => {
    setEditingColor(color)
    setFormData({
      name: color.name,
      hex: color.hex,
      finish: color.finish || '',
      order: color.order || 0,
      is_active: color.is_active
    })
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this color?')) return

    const { error } = await supabase
      .from('colors')
      .delete()
      .eq('id', id)

    if (error) {
      alert('Error deleting color: ' + error.message)
    } else {
      fetchColors()
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      hex: '#000000',
      finish: '',
      order: colors.length + 1,
      is_active: true
    })
  }

  const openNewModal = () => {
    resetForm()
    setEditingColor(null)
    setShowModal(true)
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold mb-2">Colors</h1>
          <p className="text-gray-600">Build your color palette library</p>
        </div>
        <button
          onClick={openNewModal}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          <Plus size={20} />
          <span>Add Color</span>
        </button>
      </div>

      {/* Colors Grid */}
      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Loading...</p>
        </div>
      ) : colors.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-gray-500 mb-4">No colors yet</p>
          <button
            onClick={openNewModal}
            className="text-sm text-black hover:underline"
          >
            Create your first color
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {colors.map((color) => (
            <div
              key={color.id}
              className="bg-white p-4 rounded-xl border border-gray-200 hover:border-gray-300 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div 
                  className="w-12 h-12 rounded-lg border border-gray-200"
                  style={{ backgroundColor: color.hex }}
                />
                <div className="flex gap-1">
                  <button
                    onClick={() => handleEdit(color)}
                    className="p-1.5 text-gray-600 hover:text-black hover:bg-gray-100 rounded transition-colors"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(color.id)}
                    className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <h3 className="font-semibold text-sm mb-1">{color.name}</h3>
              <p className="text-xs text-gray-500 font-mono mb-2">{color.hex}</p>
              {color.finish && (
                <p className="text-xs text-gray-600 mb-2">{color.finish}</p>
              )}
              
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                color.is_active 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {color.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h2 className="text-xl font-semibold mb-4">
              {editingColor ? 'Edit Color' : 'New Color'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="Cognac"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Color Code (HEX) *</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={formData.hex}
                    onChange={(e) => setFormData({ ...formData, hex: e.target.value })}
                    className="w-16 h-10 border border-gray-300 rounded-lg cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.hex}
                    onChange={(e) => setFormData({ ...formData, hex: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent font-mono"
                    placeholder="#9A6A45"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Finish</label>
                <input
                  type="text"
                  value={formData.finish}
                  onChange={(e) => setFormData({ ...formData, finish: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="Matte, Glossy, Semi-matte"
                />
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
                    setEditingColor(null)
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
                  {editingColor ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Colors