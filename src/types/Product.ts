export type Product = {
  id: string
  name: string
  category: 'shoes' | 'bags' | 'jackets' | 'accessories'
  price: number
  description: string
  images: string[]
  leatherOptions: LeatherOption[]
  sizes: string[]
  customizable: boolean
  inStock: boolean
  createdAt: Date
  updatedAt: Date
}

export type LeatherOption = {
  id: string
  name: string
  priceAdjustment: number
}