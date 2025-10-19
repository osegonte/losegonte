import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Plus, Edit2, Trash2 } from 'lucide-react'

type LeatherType = {
  id: string
  name: string
  finish: string | null
  description: string | null
  image_url: string | null
  is_active: boolean
  grain: string | null
  tanning: string | null
  created_at: string
  updated_at: string
}

const LeatherTypes = () => {
  const [leatherTypes, setLeatherTypes] = useState<LeatherType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingLeather, setEditingLeather] = useState<LeatherType | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    finish: '',
    description: '',
    grain: '',
    tanning: '',
    is_active: true
  })

  useEffect(() => {
    fetchLeatherTypes()
  }, [])

  const fetchLeatherTypes = async () => {
    setIsLoading(true)
    const { data, error } = await supabase
      .from('leather_types')
      .select('*')
      .order('name', { ascending: true })

    if (error) {
      console.error('Error fetching leather types:', error)
    } else {
      setLeatherTypes(data || [])
    }
    setIsLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const leatherData = {
      name: formData.name,
      finish: formData.finish || null,
      description: formData.description || null,
      grain: formData.grain || null,
      tanning: formData.tanning || null,
      is_active: formData.is_active,
    }

    if (editingLeather) {
      const { error } = await supabase
        .from('leather_types')
        .update({
          ...leatherData,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingLeather.id)

      if (error) {
        alert('Error updating leather type: ' + error.message)
      } else {
        setShowModal(false)
        setEditingLeather(null)
        resetForm()
        fetchLeatherTypes()
      }
    } else {
      const { error } = await supabase
        .from('leather_types')
        .insert([leatherData])

      if (error) {
        alert('Error creating leather type: ' + error.message)
      } else {
        setShowModal(false)
        resetForm()
        fetchLeatherTypes()
      }
    }
  }

  const handleEdit = (leather: LeatherType) => {
    setEditingLeather(leather)
    setFormData({
      name: leather.name,
      finish: leather.finish || '',
      description: leather.description || '',
      grain: leather.grain || '',
      tanning: leather.tanning || '',
      is_active: leather.is_active
    })
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this leather type?')) return

    const { error } = await supabase
      .from('leather_types')
      .delete()
      .eq('id', id)

    if (error) {
      alert('Error deleting leather type: ' + error.message)
    } else {
      fetchLeatherTypes()
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      finish: '',
      description: '',
      grain: '',
      tanning: '',
      is_active: true
    })
  }

  const openNewModal = () => {
    resetForm()
    setEditingLeather(null)
    setShowModal(true)
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold mb-2">Leather Types</h1>
          <p className="text-gray-600">Build your leather material library</p>
        </div>
        <button
          onClick={openNewModal}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          <Plus size={20} />
          <span>Add Leather Type</span>
        </button>
      </div>

      {/* Leather Types Grid */}
      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Loading...</p>
        </div>
      ) : leatherTypes.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-gray-500 mb-4">No leather types yet</p>
          <button
            onClick={openNewModal}
            className="text-sm text-black hover:underline"
          >
            Create your first leather type
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {leatherTypes.map((leather) => (
            <div
              key={leather.id}
              className="bg-white p-6 rounded-xl border border-gray-200 hover:border-gray-300 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">{leather.name}</h3>
                  {leather.finish && (
                    <p className="text-sm text-gray-600 mb-2">{leather.finish}</p>
                  )}
                  {leather.description && (
                    <p className="text-sm text-gray-500 mb-3">{leather.description}</p>
                  )}
                  <div className="flex flex-wrap gap-2 text-xs">
                    {leather.grain && (
                      <span className="px-2 py-1 bg-gray-100 rounded">Grain: {leather.grain}</span>
                    )}
                    {leather.tanning && (
                      <span className="px-2 py-1 bg-gray-100 rounded">Tanning: {leather.tanning}</span>
                    )}
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleEdit(leather)}
                    className="p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(leather.id)}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  leather.is_active 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {leather.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">
              {editingLeather ? 'Edit Leather Type' : 'New Leather Type'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Calfskin"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5">Finish</label>
                  <input
                    type="text"
                    value={formData.finish}
                    onChange={(e) => setFormData({ ...formData, finish: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Smooth, Matte, Glossy"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="Premium full-grain leather with natural patina"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Grain Type</label>
                  <input
                    type="text"
                    value={formData.grain}
                    onChange={(e) => setFormData({ ...formData, grain: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Full-grain, Top-grain"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5">Tanning Method</label>
                  <input
                    type="text"
                    value={formData.tanning}
                    onChange={(e) => setFormData({ ...formData, tanning: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Chrome, Vegetable"
                  />
                </div>
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
                    setEditingLeather(null)
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
                  {editingLeather ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default LeatherTypes