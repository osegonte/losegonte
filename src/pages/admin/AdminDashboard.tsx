import { useState } from 'react'
import { collection, addDoc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '../../firebase/config'
import Header from '../../components/layout/Header'

const AdminDashboard = () => {
  const [productName, setProductName] = useState('')
  const [category, setCategory] = useState<'shoes' | 'bags' | 'jackets' | 'accessories'>('shoes')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [images, setImages] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploading(true)

    try {
      // Upload images to Firebase Storage
      const imageUrls: string[] = []
      for (const image of images) {
        const imageRef = ref(storage, `products/${category}/${Date.now()}_${image.name}`)
        await uploadBytes(imageRef, image)
        const url = await getDownloadURL(imageRef)
        imageUrls.push(url)
      }

      // Add product to Firestore
      await addDoc(collection(db, 'products'), {
        name: productName,
        category,
        price: parseFloat(price),
        description,
        images: imageUrls,
        leatherOptions: [
          { id: 'calfskin', name: 'Soft Calfskin', priceAdjustment: 0 },
          { id: 'nubuck', name: 'Nubuck', priceAdjustment: 50 },
          { id: 'heritage', name: 'Heritage Brown', priceAdjustment: 30 },
          { id: 'black', name: 'Deep Black', priceAdjustment: 0 }
        ],
        sizes: category === 'shoes' ? ['39', '40', '41', '42', '43', '44', '45', '46'] : ['S', 'M', 'L', 'XL'],
        customizable: true,
        inStock: true,
        createdAt: new Date(),
        updatedAt: new Date()
      })

      alert('Product uploaded successfully!')
      
      // Reset form
      setProductName('')
      setPrice('')
      setDescription('')
      setImages([])
      
    } catch (error) {
      console.error('Error uploading product:', error)
      alert('Error uploading product')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="pt-32 pb-24 px-8">
        <div className="max-w-4xl mx-auto bg-white p-8 shadow-lg">
          <h1 className="font-display text-4xl mb-8 text-osegonte-black">Admin Dashboard</h1>
          <p className="text-sm text-osegonte-black/60 mb-8">Upload new products to the store</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Product Name */}
            <div>
              <label className="block text-sm tracking-wider mb-2 text-osegonte-black">PRODUCT NAME</label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                required
                className="w-full border-2 border-gray-300 p-3 text-sm focus:border-osegonte-black focus:outline-none"
                placeholder="e.g. Classic Oxford"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm tracking-wider mb-2 text-osegonte-black">CATEGORY</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full border-2 border-gray-300 p-3 text-sm focus:border-osegonte-black focus:outline-none"
              >
                <option value="shoes">Shoes</option>
                <option value="bags">Bags</option>
                <option value="jackets">Jackets</option>
                <option value="accessories">Accessories</option>
              </select>
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm tracking-wider mb-2 text-osegonte-black">PRICE (€)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                className="w-full border-2 border-gray-300 p-3 text-sm focus:border-osegonte-black focus:outline-none"
                placeholder="450"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm tracking-wider mb-2 text-osegonte-black">DESCRIPTION</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={4}
                className="w-full border-2 border-gray-300 p-3 text-sm focus:border-osegonte-black focus:outline-none resize-none"
                placeholder="Wee craft this timeless oxford with full-grain leather..."
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm tracking-wider mb-2 text-osegonte-black">PRODUCT IMAGES</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                required
                className="w-full border-2 border-gray-300 p-3 text-sm focus:border-osegonte-black focus:outline-none"
              />
              {images.length > 0 && (
                <p className="text-xs text-osegonte-black/60 mt-2">{images.length} image(s) selected</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={uploading}
              className="w-full bg-osegonte-black text-white py-4 text-sm tracking-wider hover:bg-osegonte-black/80 transition-colors disabled:opacity-50"
            >
              {uploading ? 'UPLOADING...' : 'UPLOAD PRODUCT'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard