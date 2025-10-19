import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Plus, Edit2, Trash2, Image as ImageIcon, X, Upload } from 'lucide-react'

type Category = {
  id: string
  name: string
}

type LeatherType = {
  id: string
  name: string
}

type Color = {
  id: string
  name: string
  hex: string
}

type Size = {
  id: string
  value: string
  system: string | null
}

type Product = {
  id: string
  name: string
  slug: string
  category_id: string | null
  base_price: number
  description: string | null
  images: string[]
  is_customizable: boolean
  in_stock: boolean
  status: string
  created_at: string
}

const Products = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [leatherTypes, setLeatherTypes] = useState<LeatherType[]>([])
  const [colors, setColors] = useState<Color[]>([])
  const [sizes, setSizes] = useState<Size[]>([])
  
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    category_id: '',
    base_price: 0,
    description: '',
    is_customizable: true,
    in_stock: true,
    status: 'draft',
    images: [] as string[],
    selectedLeathers: [] as string[],
    selectedColors: [] as string[],
    selectedSizes: [] as string[]
  })

  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])

  useEffect(() => {
    fetchProducts()
    fetchOptions()
  }, [])

  const fetchProducts = async () => {
    setIsLoading(true)
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching products:', error)
    } else {
      setProducts(data || [])
    }
    setIsLoading(false)
  }

  const fetchOptions = async () => {
    const [categoriesRes, leathersRes, colorsRes, sizesRes] = await Promise.all([
      supabase.from('categories').select('id, name').eq('is_active', true),
      supabase.from('leather_types').select('id, name').eq('is_active', true),
      supabase.from('colors').select('id, name, hex').eq('is_active', true),
      supabase.from('sizes').select('id, value, system').eq('is_active', true)
    ])

    setCategories(categoriesRes.data || [])
    setLeatherTypes(leathersRes.data || [])
    setColors(colorsRes.data || [])
    setSizes(sizesRes.data || [])
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    setImageFiles(prev => [...prev, ...files])

    // Create previews
    files.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index))
    setImagePreviews(prev => prev.filter((_, i) => i !== index))
  }

  const removeExistingImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const uploadImages = async (): Promise<string[]> => {
    const uploadedUrls: string[] = []

    for (const file of imageFiles) {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file)

      if (uploadError) {
        console.error('Upload error:', uploadError)
        continue
      }

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath)

      uploadedUrls.push(publicUrl)
    }

    return uploadedUrls
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUploading(true)

    try {
      // Upload new images
      const newImageUrls = await uploadImages()
      const allImages = [...formData.images, ...newImageUrls]

      const productData = {
        name: formData.name,
        slug: formData.slug,
        category_id: formData.category_id || null,
        base_price: formData.base_price,
        description: formData.description || null,
        is_customizable: formData.is_customizable,
        in_stock: formData.in_stock,
        status: formData.status,
        images: allImages
      }

      if (editingProduct) {
        const { data: product, error } = await supabase
          .from('products')
          .update({
            ...productData,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingProduct.id)
          .select()
          .single()

        if (error) {
          alert('Error updating product: ' + error.message)
          return
        }

        await updateProductOptions(product.id)
      } else {
        const { data: product, error } = await supabase
          .from('products')
          .insert([productData])
          .select()
          .single()

        if (error) {
          alert('Error creating product: ' + error.message)
          return
        }

        await updateProductOptions(product.id)
      }

      setShowModal(false)
      setEditingProduct(null)
      resetForm()
      fetchProducts()
    } catch (error) {
      console.error('Error:', error)
      alert('Error saving product')
    } finally {
      setIsUploading(false)
    }
  }

  const updateProductOptions = async (productId: string) => {
    // Delete existing options
    await Promise.all([
      supabase.from('product_leather_types').delete().eq('product_id', productId),
      supabase.from('product_colors').delete().eq('product_id', productId),
      supabase.from('product_sizes').delete().eq('product_id', productId)
    ])

    // Insert new options
    const leatherInserts = formData.selectedLeathers.map(leatherId => ({
      product_id: productId,
      leather_type_id: leatherId
    }))

    const colorInserts = formData.selectedColors.map(colorId => ({
      product_id: productId,
      color_id: colorId
    }))

    const sizeInserts = formData.selectedSizes.map(sizeId => ({
      product_id: productId,
      size_id: sizeId
    }))

    await Promise.all([
      leatherInserts.length > 0 && supabase.from('product_leather_types').insert(leatherInserts),
      colorInserts.length > 0 && supabase.from('product_colors').insert(colorInserts),
      sizeInserts.length > 0 && supabase.from('product_sizes').insert(sizeInserts)
    ])
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)

    if (error) {
      alert('Error deleting product: ' + error.message)
    } else {
      fetchProducts()
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      category_id: '',
      base_price: 0,
      description: '',
      is_customizable: true,
      in_stock: true,
      status: 'draft',
      images: [],
      selectedLeathers: [],
      selectedColors: [],
      selectedSizes: []
    })
    setImageFiles([])
    setImagePreviews([])
  }

  const openNewModal = () => {
    resetForm()
    setEditingProduct(null)
    setShowModal(true)
  }

  const getCategoryName = (categoryId: string | null) => {
    if (!categoryId) return 'Uncategorized'
    const category = categories.find(c => c.id === categoryId)
    return category?.name || 'Unknown'
  }

  const toggleSelection = (id: string, field: 'selectedLeathers' | 'selectedColors' | 'selectedSizes') => {
    const current = formData[field]
    if (current.includes(id)) {
      setFormData({ ...formData, [field]: current.filter(item => item !== id) })
    } else {
      setFormData({ ...formData, [field]: [...current, id] })
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold mb-2">Products</h1>
          <p className="text-gray-600">Manage your product catalog</p>
        </div>
        <button
          onClick={openNewModal}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          <Plus size={20} />
          <span>Add Product</span>
        </button>
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Loading...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-gray-500 mb-4">No products yet</p>
          <button
            onClick={openNewModal}
            className="text-sm text-black hover:underline"
          >
            Create your first product
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-all overflow-hidden"
            >
              <div className="aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
                {product.images && product.images.length > 0 ? (
                  <img 
                    src={product.images[0]} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageIcon className="text-gray-400" size={48} />
                )}
              </div>
              
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{getCategoryName(product.category_id)}</p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => {
                        setEditingProduct(product)
                        setFormData({
                          name: product.name,
                          slug: product.slug,
                          category_id: product.category_id || '',
                          base_price: product.base_price,
                          description: product.description || '',
                          is_customizable: product.is_customizable,
                          in_stock: product.in_stock,
                          status: product.status,
                          images: product.images || [],
                          selectedLeathers: [],
                          selectedColors: [],
                          selectedSizes: []
                        })
                        setShowModal(true)
                      }}
                      className="p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className="text-lg font-semibold">€{product.base_price}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    product.status === 'published'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {product.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-4xl w-full p-6 my-8 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-6">
              {editingProduct ? 'Edit Product' : 'New Product'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Product Images */}
              <div>
                <label className="block text-sm font-medium mb-2">Product Images</label>
                
                {/* Existing Images */}
                {formData.images.length > 0 && (
                  <div className="grid grid-cols-4 gap-4 mb-4">
                    {formData.images.map((img, idx) => (
                      <div key={idx} className="relative aspect-square">
                        <img src={img} alt="" className="w-full h-full object-cover rounded-lg" />
                        <button
                          type="button"
                          onClick={() => removeExistingImage(idx)}
                          className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* New Image Previews */}
                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-4 gap-4 mb-4">
                    {imagePreviews.map((preview, idx) => (
                      <div key={idx} className="relative aspect-square">
                        <img src={preview} alt="" className="w-full h-full object-cover rounded-lg" />
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Upload Button */}
                <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors">
                  <Upload size={20} className="text-gray-600" />
                  <span className="text-sm text-gray-600">Upload Images</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-gray-500 mt-1">You can upload multiple images</p>
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1.5">Product Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Classic Oxford Shoe"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5">URL Slug *</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="classic-oxford-shoe"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5">Category *</label>
                  <select
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1.5">Base Price (€) *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.base_price}
                    onChange={(e) => setFormData({ ...formData, base_price: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="450.00"
                    required
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1.5">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Handcrafted with premium leather..."
                    rows={4}
                  />
                </div>
              </div>

              {/* Available Leather Types */}
              <div>
                <label className="block text-sm font-medium mb-2">Available Leather Types</label>
                <div className="grid grid-cols-2 gap-2">
                  {leatherTypes.map((leather) => (
                    <label
                      key={leather.id}
                      className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                    >
                      <input
                        type="checkbox"
                        checked={formData.selectedLeathers.includes(leather.id)}
                        onChange={() => toggleSelection(leather.id, 'selectedLeathers')}
                        className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                      />
                      <span className="text-sm">{leather.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Available Colors */}
              <div>
                <label className="block text-sm font-medium mb-2">Available Colors</label>
                <div className="grid grid-cols-3 gap-2">
                  {colors.map((color) => (
                    <label
                      key={color.id}
                      className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                    >
                      <input
                        type="checkbox"
                        checked={formData.selectedColors.includes(color.id)}
                        onChange={() => toggleSelection(color.id, 'selectedColors')}
                        className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                      />
                      <div
                        className="w-4 h-4 rounded border border-gray-300"
                        style={{ backgroundColor: color.hex }}
                      />
                      <span className="text-sm">{color.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Available Sizes */}
              <div>
                <label className="block text-sm font-medium mb-2">Available Sizes</label>
                <div className="grid grid-cols-4 gap-2">
                  {sizes.map((size) => (
                    <label
                      key={size.id}
                      className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                    >
                      <input
                        type="checkbox"
                        checked={formData.selectedSizes.includes(size.id)}
                        onChange={() => toggleSelection(size.id, 'selectedSizes')}
                        className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                      />
                      <span className="text-sm">{size.system ? `${size.system} ` : ''}{size.value}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Settings */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2 justify-end">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.is_customizable}
                      onChange={(e) => setFormData({ ...formData, is_customizable: e.target.checked })}
                      className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                    />
                    <span className="text-sm font-medium">Customizable</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.in_stock}
                      onChange={(e) => setFormData({ ...formData, in_stock: e.target.checked })}
                      className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                    />
                    <span className="text-sm font-medium">In Stock</span>
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    setEditingProduct(null)
                    resetForm()
                  }}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={isUploading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-400"
                  disabled={isUploading}
                >
                  {isUploading ? 'Uploading...' : editingProduct ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Products