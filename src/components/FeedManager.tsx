import Button from '@/components/Button'
import useFeedList from '@/hooks/useFeedList'
import React, { useState } from 'react'

export default function FeedManager() {
  const { addFeed, editFeed, feeds, initialFeed, removeFeed } = useFeedList()
  const suggestedFeeds = [
    initialFeed,
    'https://www.err.ee/rss',
    'https://digi.geenius.ee/feed/',
  ]

  const [feedUrl, setFeedUrl] = useState('')
  const [editIndex, setEditIndex] = useState(-1)
  const [error, setError] = useState('')
  const isEditing = editIndex !== -1

  const isValidUrl = (url: string) => {
    return url.trim() !== '' && /^(https?:\/\/)/i.test(url)
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()

    if (!isValidUrl(feedUrl)) {
      setError('Please enter a valid URL.')
      return
    }

    if (isEditing) {
      editFeed(feeds[editIndex], feedUrl)
      setEditIndex(-1)
    } else {
      addFeed(feedUrl)
    }

    setFeedUrl('')
    setError('')
  }

  const handleEdit = (index: number) => {
    setEditIndex(index)
    setFeedUrl(feeds[index])
    setError('')
  }

  const handleRemove = (index: number) => {
    if (isEditing && index === editIndex) {
      setEditIndex(-1)
      setFeedUrl('')
    }
    removeFeed(feeds[index])
  }

  const availableFeeds = suggestedFeeds.filter((feed) => !feeds.includes(feed))

  return (
    <div className="flex flex-col gap-2">
      <form onSubmit={handleSubmit}>
        <div className="flex items-center gap-6">
          <input
            className="flex-1 rounded-md border px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 md:px-4 md:py-2"
            onChange={(e) => {
              setFeedUrl(e.target.value)
              setError('')
            }}
            placeholder="Add new feed URL"
            type="text"
            value={feedUrl}
          />
          <Button type="submit"> {isEditing ? 'Edit Feed' : 'Add Feed'}</Button>
        </div>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </form>
      {availableFeeds.length > 0 && (
        <div className="mt-2">
          <div className="flex flex-wrap gap-2 text-gray-700">
            {availableFeeds.map((url) => (
              <Button
                className="bg-gray-200 !text-gray-800 hover:bg-gray-300 focus:outline-none"
                key={url}
                onClick={() => setFeedUrl(url)}
              >
                {new URL(url).hostname}
              </Button>
            ))}
          </div>
        </div>
      )}
      <ul className="divide-y divide-gray-300">
        {feeds.map((feed, i) => (
          <li
            className="flex flex-col items-center justify-between gap-2 py-2 text-sm text-gray-700 md:flex-row md:gap-6"
            key={feed}
          >
            {feed}
            <div className="flex gap-2">
              <Button
                className="bg-gray-200 !text-gray-800 hover:bg-gray-300 focus:outline-none"
                onClick={() => handleEdit(i)}
              >
                Edit
              </Button>
              <Button
                className="bg-red-200 !text-red-800 hover:bg-red-300 focus:outline-none"
                onClick={() => handleRemove(i)}
              >
                Remove
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
