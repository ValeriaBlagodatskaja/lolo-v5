import Articles from '@/components/Articles'
import Controls from '@/components/Controls'
import useFeedList from '@/hooks/useFeedList'
import { useEffect, useState } from 'react'
import xmlParser from 'xml-js'

export interface RssItem {
  author?: string
  category: string[]
  description: string
  image?: null | string
  link: string
  pubDate: Date | null
  source: string
  title: string
}

interface ParsedXMLData {
  rss?: {
    channel?: {
      item?: {
        author?: { _cdata?: string } | { _text?: string }
        category:
          | { _cdata?: string }
          | { _text?: string }
          | Array<{ _cdata?: string; _text?: string }>
        description?: { _cdata?: string } | { _text?: string }
        link?: { _text?: string }
        'media:content'?: { _attributes: { url: string } }
        'media:thumbnail'?: { _attributes: { url: string } }
        pubDate?: { _text?: string }
        title?: { _cdata?: string } | { _text?: string }
      }[]
    }
  }
}

function getItemText(itemProp?: { _cdata?: string; _text?: string }): string {
  if (!itemProp) {
    return ''
  }
  if ('_text' in itemProp && itemProp._text !== undefined) {
    return itemProp._text
  }
  if ('_cdata' in itemProp && itemProp._cdata !== undefined) {
    return itemProp._cdata
  }
  return ''
}

function getCategories(
  category?:
    | { _cdata?: string; _text?: string }
    | Array<{ _cdata?: string; _text?: string }>
): string[] {
  if (!category) {
    return []
  }
  if (Array.isArray(category)) {
    return category.map((cat) => getItemText(cat))
  }
  return getItemText(category) ? [getItemText(category)] : []
}

export default function App() {
  const { feeds } = useFeedList()
  const [loading, setLoading] = useState(false)
  const [articles, setArticles] = useState<RssItem[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('')

  useEffect(() => {
    if (feeds.length === 0) {
      setArticles([])
      return
    }

    const fetchFeeds = async () => {
      try {
        setLoading(true)
        const results = await Promise.allSettled(
          feeds.map(async (url) => {
            try {
              const response = await fetch(
                `/api/rss?url=${encodeURIComponent(url)}`
              )
              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
              }
              const data = await response.text()
              const json: ParsedXMLData = xmlParser.xml2js(data, {
                compact: true,
              }) as ParsedXMLData

              const channel = json?.rss?.channel
              if (!channel || !Array.isArray(channel.item)) {
                return []
              }
              return channel.item.map((item) => {
                const pubDateText = item.pubDate?._text
                const mediaContent =
                  item['media:content']?._attributes?.url ||
                  item['media:thumbnail']?._attributes?.url

                return {
                  author: getItemText(item.author),
                  category: getCategories(item.category),
                  description: getItemText(item.description),
                  image: mediaContent,
                  link: item.link?._text || '',
                  pubDate: pubDateText ? new Date(pubDateText) : null,
                  source: url,
                  title: getItemText(item.title),
                }
              })
            } catch (error) {
              console.error(`Error fetching data from ${url}:`, error)
              return []
            }
          })
        )

        const successfulResults = results.flatMap((result) =>
          result.status === 'fulfilled' ? result.value : []
        )

        const sortedArticles = successfulResults.sort((a, b) => {
          const dateA = a.pubDate ? a.pubDate.getTime() : -Infinity
          const dateB = b.pubDate ? b.pubDate.getTime() : -Infinity
          return dateB - dateA
        })

        setArticles(sortedArticles)

        const uniqueCategories = Array.from(
          new Set(
            sortedArticles
              .flatMap((article) => article.category)
              .filter((category) => category.trim() !== '')
          )
        )
        setCategories(uniqueCategories)
      } catch (error) {
        console.error('Error handling feed fetching process:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFeeds()
  }, [feeds])

  const filteredArticles = selectedCategory
    ? articles.filter((article) => article.category.includes(selectedCategory))
    : articles

  return (
    <div>
      <Controls
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      <main className="p-8">
        <Articles
          articles={filteredArticles}
          feedsExist={feeds.length > 0}
          loading={loading}
        />
      </main>
    </div>
  )
}
