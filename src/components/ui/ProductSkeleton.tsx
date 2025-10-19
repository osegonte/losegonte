const ProductSkeleton = () => {
  return (
    <div className="animate-pulse">
      {/* Image skeleton */}
      <div className="bg-gray-200 aspect-[3/4] mb-3"></div>
      
      {/* Text skeletons */}
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 w-3/4 rounded"></div>
        <div className="h-3 bg-gray-200 w-1/2 rounded"></div>
      </div>
    </div>
  )
}

export default ProductSkeleton