import ArticleModal from '@/components/ArticleModal'
import stringToColor from '@/helpers/stringToColor'
import {
  faArrowUpRightFromSquare,
  faCalendar,
  faUserPen,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import dayjs from 'dayjs'
import { useState } from 'react'

export interface ArticleProps {
  author?: string
  category?: string[]
  description?: string
  image?: null | string
  link: string
  pubDate: Date | null
  source: string
  title: string
}

export default function Article(props: ArticleProps) {
  const { author, category, description, image, link, pubDate, source, title } =
    props
  const [open, setOpen] = useState(false)

  const openModal = () => setOpen(true)

  return (
    <article className="rounded-md border p-4 shadow-md">
      <ArticleModal
        articleProps={props}
        open={open}
        setOpen={setOpen}
        url={link}
      />
      <div className="mb-2 flex items-center gap-2">
        <div
          className="size-3 shrink-0 rounded-full"
          style={{ backgroundColor: stringToColor(source) }}
        />
        <small className="block text-sm text-gray-600">
          RSS Feed: {new URL(source).hostname}
        </small>

        {link && (
          <a
            className="ml-auto inline-flex items-center gap-2 text-sm text-blue-500 hover:text-blue-600"
            href={link}
            rel="noreferrer"
            target="_blank"
          >
            Source
            <FontAwesomeIcon
              className="size-3"
              icon={faArrowUpRightFromSquare}
            />
          </a>
        )}
      </div>
      {image && (
        <img
          alt={title}
          className="mb-2 h-[200px] w-full cursor-pointer rounded-lg border object-cover md:h-[260px]"
          onClick={openModal}
          src={image}
        />
      )}
      {title && (
        <h3
          className="mb-2 cursor-pointer text-xl font-semibold"
          onClick={openModal}
        >
          {title}
        </h3>
      )}
      {description && (
        <p
          className="external-html-article mb-4 cursor-pointer text-gray-700"
          dangerouslySetInnerHTML={{ __html: description }}
          onClick={openModal}
        />
      )}
      {category && category.length > 0 && (
        <div className="mb-2 flex flex-wrap items-center gap-2 text-sm">
          {category.map((cat, index) => (
            <span
              className="inline-block rounded-md bg-gray-200 px-2 py-1 text-xs font-semibold text-gray-800"
              key={index}
            >
              {cat}
            </span>
          ))}
        </div>
      )}
      <div className="mb-6 flex items-center text-sm text-gray-500">
        {author && (
          <div className="mr-6 flex items-center gap-2">
            <FontAwesomeIcon className="h-4 w-4" icon={faUserPen} />
            <p>{author}</p>
          </div>
        )}
        <div className="flex items-center gap-2">
          <FontAwesomeIcon className="h-4 w-4" icon={faCalendar} />
          {pubDate && <time>{dayjs(pubDate).format('DD/MM/YYYY')}</time>}
        </div>
      </div>
    </article>
  )
}
