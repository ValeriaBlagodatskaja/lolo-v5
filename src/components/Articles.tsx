import Article, { ArticleProps } from '@/components/Article'
import Button from '@/components/Button'
import useFeedList from '@/hooks/useFeedList'
import autoAnimate from '@formkit/auto-animate'
import { faBoxOpen } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useRef } from 'react'

export interface ArticlesProps {
  articles: ArticleProps[]
  feedsExist: boolean
  loading: boolean
}

function SkeletonLoader() {
  return (
    <div className="mx-auto grid w-full max-w-[1600px] gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div className="w-full rounded-md border p-4 shadow-md" key={index}>
          <div className="flex flex-row items-center gap-2">
            <div className="my-2 h-4 w-4 animate-pulse rounded-full bg-gray-200" />
            <div className="my-2 h-3 w-1/3 animate-pulse bg-gray-200" />
            <div className="my-2 ml-auto h-3 w-1/5 animate-pulse bg-gray-200" />
          </div>
          <div className="my-2 h-[198px] w-full animate-pulse rounded-md bg-gray-200 md:h-64" />
          <div className="my-2 h-5 w-full animate-pulse bg-gray-200" />
          <div className="my-2 h-5 w-1/5 animate-pulse bg-gray-200" />
          <br />
          <div className="my-2 h-4 w-full animate-pulse bg-gray-200" />
          <div className="my-2 h-4 w-full animate-pulse bg-gray-200" />
          <div className="my-2 h-4 w-full animate-pulse bg-gray-200" />
          <div className="my-2 h-4 w-full animate-pulse bg-gray-200" />
          <div className="my-2 h-4 w-2/5 animate-pulse bg-gray-200" />
          <br />
          <div className="flex flex-row gap-2">
            <div className="my-2 h-3 w-3 animate-pulse bg-gray-200" />
            <div className="my-2 h-3 w-1/5 animate-pulse bg-gray-200" />
            <div className="my-2 ml-6 h-3 w-3 animate-pulse bg-gray-200" />
            <div className="my-2 h-3 w-1/6 animate-pulse bg-gray-200" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function Articles({
  articles,
  feedsExist,
  loading,
}: ArticlesProps) {
  const parent = useRef(null)
  const { addFeed, initialFeed } = useFeedList()

  useEffect(() => {
    parent.current && autoAnimate(parent.current)
  }, [parent, articles])

  if (loading) {
    return <SkeletonLoader />
  }

  if (articles.length === 0 || !feedsExist) {
    return (
      <div className="flex flex-col items-center justify-center pt-16">
        <FontAwesomeIcon className="size-44 text-blue-500" icon={faBoxOpen} />
        <p className="text-xl text-gray-700">
          It looks like there are no valid RSS feeds available at the moment.
        </p>
        <p className="mb-4 text-sm text-gray-600">
          You can also customize your feeds from the RSS controls in the header.
        </p>
        <Button onClick={() => addFeed(initialFeed)}>
          Add a Default Flipboard RSS Feed
        </Button>
      </div>
    )
  }

  return (
    <div
      className="mx-auto grid max-w-[1600px] gap-4 md:grid-cols-2 lg:grid-cols-3"
      ref={parent}
    >
      {articles.map(
        ({
          author,
          category,
          description,
          image,
          link,
          pubDate,
          source,
          title,
        }) => (
          <Article
            author={author}
            category={category}
            description={description}
            image={image}
            key={link + title + pubDate + source}
            link={link}
            pubDate={pubDate}
            source={source}
            title={title}
          />
        )
      )}
    </div>
  )
}
