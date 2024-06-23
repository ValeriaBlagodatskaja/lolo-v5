import { ArticleProps } from '@/components/Article'
import Modal, { ModalProps } from '@/components/Modal'
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'

interface ArticleModalProps
  extends Omit<ModalProps, 'children' | 'onClose' | 'title'> {
  articleProps: ArticleProps
  url: string
}

function SkeletonLoader() {
  return (
    <div className="p-4">
      <div className="my-2 h-4 w-full animate-pulse bg-gray-200" />
      <div className="my-2 h-4 w-full animate-pulse bg-gray-200" />
      <div className="my-2 h-4 w-full animate-pulse bg-gray-200" />
      <div className="my-2 h-4 w-full animate-pulse bg-gray-200" />
      <div className="my-2 h-4 w-1/5 animate-pulse bg-gray-200" />
      <br />
      <div className="my-2 h-4 w-full animate-pulse bg-gray-200" />
      <div className="my-2 h-4 w-full animate-pulse bg-gray-200" />
      <div className="my-2 h-4 w-full animate-pulse bg-gray-200" />
      <div className="my-2 h-4 w-full animate-pulse bg-gray-200" />
      <div className="my-2 h-4 w-2/5 animate-pulse bg-gray-200" />
    </div>
  )
}

export default function ArticleModal({
  articleProps,
  open,
  setOpen,
  url,
}: ArticleModalProps) {
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState<null | string>()
  const [error, setError] = useState(false)

  useEffect(() => {
    if (open) {
      // eslint-disable-next-line no-inner-declarations
      async function fetchModalContent() {
        setLoading(true)
        try {
          const response = await fetch(
            `/api/rss?url=${encodeURIComponent('https://uptime-mercury-api.azurewebsites.net/webparser')}`,
            {
              body: JSON.stringify({ url }),
              headers: {
                'Content-Type': 'application/json',
              },
              method: 'POST',
            }
          )
          const json = await response.json()
          if (json.content) {
            setContent(json.content)
          } else {
            setError(true)
            console.error('No content found:', json)
          }
        } catch (error) {
          setError(true)
          console.error('Error loading content:', error)
        } finally {
          setLoading(false)
        }
      }

      fetchModalContent()
    } else {
      setContent(null)
    }
  }, [open, url])

  const fallBackContent = (
    <div className="flex items-center gap-6 p-4">
      <FontAwesomeIcon
        className="size-12 text-red-500"
        icon={faTriangleExclamation}
      />
      <p className="text-gray-700">
        Unfortunately, the full article content could not be loaded. It may have
        been removed or is not accessible due to restrictions. You can check the
        original article source{' '}
        <a
          className="inline text-blue-500 hover:underline"
          href={articleProps.link}
          rel="noopener noreferrer"
          target="_blank"
        >
          here
        </a>
        .
      </p>
    </div>
  )

  const renderModalContent = () => {
    if (loading) {
      return <SkeletonLoader />
    }

    if (error || !content) {
      return fallBackContent
    }

    return (
      <div
        className="external-html-article"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    )
  }

  return (
    <Modal open={open} setOpen={setOpen} title={articleProps.title}>
      {renderModalContent()}
    </Modal>
  )
}
