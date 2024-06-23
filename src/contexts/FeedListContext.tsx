import {
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useState,
} from 'react'

const initialFeed = 'https://flipboard.com/@raimoseero/feed-nii8kd0sz.rss'

interface FeedListContextProps {
  addFeed: (url: string) => void
  editFeed: (oldUrl: string, newUrl: string) => void
  feeds: string[]
  initialFeed: string
  removeFeed: (url: string) => void
}

export const FeedListContext = createContext<FeedListContextProps | undefined>(
  undefined
)

export default function FeedListProvider({
  children,
}: {
  children: ReactNode
}) {
  const [feeds, setFeeds] = useState<string[]>([])
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    const storedFeeds = localStorage.getItem('rssFeeds')
    if (storedFeeds) {
      setFeeds(JSON.parse(storedFeeds))
    } else {
      localStorage.setItem('rssFeeds', JSON.stringify([initialFeed]))
      setFeeds([initialFeed])
    }
    setInitialized(true)
  }, [])

  useEffect(() => {
    if (initialized) {
      localStorage.setItem('rssFeeds', JSON.stringify(feeds))
    }
  }, [feeds, initialized])

  const addFeed = useCallback((url: string) => {
    setFeeds((prev) => (prev.includes(url) ? prev : [...prev, url]))
  }, [])

  const editFeed = useCallback((oldUrl: string, newUrl: string) => {
    setFeeds((prev) =>
      prev.map((feedUrl) => (feedUrl === oldUrl ? newUrl : feedUrl))
    )
  }, [])

  const removeFeed = useCallback((url: string) => {
    setFeeds((prev) => prev.filter((f) => f !== url))
  }, [])

  return (
    <FeedListContext.Provider
      value={{ addFeed, editFeed, feeds, initialFeed, removeFeed }}
    >
      {children}
    </FeedListContext.Provider>
  )
}
