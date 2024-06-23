import { FeedListContext } from '@/contexts/FeedListContext'
import { useContext } from 'react'

export default function useFeedList() {
  const context = useContext(FeedListContext)
  if (context === undefined) {
    throw new Error('useFeedList must be used within a FeedListProvider')
  }
  return context
}
