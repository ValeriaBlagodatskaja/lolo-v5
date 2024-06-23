import { useEffect } from 'react'

type Event = KeyboardEvent | MouseEvent | TouchEvent
type Ref = React.RefObject<HTMLDivElement>
type Handler = (e: Event) => void

export default function useClickOutside(
  ref: Ref,
  condition: boolean,
  handler: Handler
): void {
  useEffect(() => {
    const listener = (event: Event) => {
      if (event.type === 'mousedown' || event.type === 'touchend') {
        if (!ref.current || ref.current.contains(event.target as Node)) {
          return
        }
        handler(event)
      }

      if (
        event.type === 'keydown' &&
        (event as KeyboardEvent).key === 'Escape'
      ) {
        handler(event)
      }
    }

    if (condition) {
      document.addEventListener('mousedown', listener)
      document.addEventListener('touchend', listener)
      document.addEventListener('keydown', listener)
    }

    return () => {
      document.removeEventListener('mousedown', listener)
      document.removeEventListener('touchend', listener)
      document.removeEventListener('keydown', listener)
    }
  }, [ref, handler, condition])
}
