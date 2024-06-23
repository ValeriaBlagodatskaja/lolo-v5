import Button from '@/components/Button'
import FeedModal from '@/components/FeedModal'
import { useState } from 'react'

interface ControlsProps {
  categories: string[]
  selectedCategory: string
  setSelectedCategory: (category: string) => void
}

export default function Controls({
  categories,
  selectedCategory,
  setSelectedCategory,
}: ControlsProps) {
  const [isFeedModalOpen, setIsFeedModalOpen] = useState(false)
  return (
    <div className="sticky top-0 z-10 w-full gap-2 bg-white shadow-md">
      <div className="mx-auto flex w-full max-w-[1664px] items-center justify-between px-8 py-4 text-[14px] tracking-[0.25px]">
        <div>
          <Button onClick={() => setIsFeedModalOpen(true)}>RSS Controls</Button>

          <FeedModal open={isFeedModalOpen} setOpen={setIsFeedModalOpen} />
        </div>
        <select
          className="rounded-md border border-gray-300 px-2 py-1 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 md:max-w-xs md:py-2"
          id="category-select"
          onChange={(e) => setSelectedCategory(e.target.value)}
          value={selectedCategory}
        >
          <option value="">All Categories</option>
          {categories.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
