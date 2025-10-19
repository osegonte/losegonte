import { Link } from 'react-router-dom'

type SubcategoryNavProps = {
  category: string
}

const subcategories = {
  shoes: [
    { name: 'View all', slug: 'all' },
    { name: 'Oxfords', slug: 'oxfords' },
    { name: 'Loafers', slug: 'loafers' },
    { name: 'Boots', slug: 'boots' },
    { name: 'Sneakers', slug: 'sneakers' },
    { name: 'Sandals', slug: 'sandals' },
  ],
  bags: [
    { name: 'View all', slug: 'all' },
    { name: 'Totes', slug: 'totes' },
    { name: 'Shoulder Bags', slug: 'shoulder-bags' },
    { name: 'Crossbody', slug: 'crossbody' },
    { name: 'Backpacks', slug: 'backpacks' },
    { name: 'Clutches', slug: 'clutches' },
  ],
  jackets: [
    { name: 'View all', slug: 'all' },
    { name: 'Leather Jackets', slug: 'leather-jackets' },
    { name: 'Blazers', slug: 'blazers' },
    { name: 'Bomber Jackets', slug: 'bomber-jackets' },
    { name: 'Coats', slug: 'coats' },
  ],
  accessories: [
    { name: 'View all', slug: 'all' },
    { name: 'Belts', slug: 'belts' },
    { name: 'Wallets', slug: 'wallets' },
    { name: 'Gloves', slug: 'gloves' },
    { name: 'Scarves', slug: 'scarves' },
  ],
}

const SubcategoryNav = ({ category }: SubcategoryNavProps) => {
  const items = subcategories[category as keyof typeof subcategories] || []

  if (items.length === 0) return null

  return (
    <div className="border-b border-gray-200 bg-white sticky top-[104px] z-40">
      <div className="max-w-[1920px] mx-auto px-8">
        <nav className="flex items-center gap-8 py-4 overflow-x-auto">
          {items.map((item) => (
            <Link
              key={item.slug}
              to={`/products?category=${category}&subcategory=${item.slug}`}
              className="text-sm tracking-wider text-osegonte-black hover:opacity-60 transition-opacity whitespace-nowrap"
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
}

export default SubcategoryNav