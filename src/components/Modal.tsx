import useClickOutside from '@/hooks/useClickOutside'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import clsx from 'clsx'
import { Dispatch, ReactNode, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

export interface ModalProps {
  children: ReactNode
  className?: string
  onClose?: () => void
  open: boolean
  setOpen: Dispatch<React.SetStateAction<boolean>>
  title: string
}

export default function Modal({
  children,
  className,
  onClose,
  open,
  setOpen,
  title,
}: ModalProps) {
  useEffect(() => {
    if (open) {
      document.body.classList.add('overflow-hidden')
    } else {
      document.body.classList.remove('overflow-hidden')
    }

    return () => {
      document.body.classList.remove('overflow-hidden')
    }
  }, [open])

  const modalContentRef = useRef(null)
  useClickOutside(modalContentRef, open, () => {
    setOpen(false)
    onClose?.()
  })

  const portalDiv = document.getElementById('portal') as HTMLElement | null
  if (!portalDiv) {
    console.error('The portal div is not found in the document.')
    return null
  }

  return createPortal(
    open ? (
      <>
        <div className="fixed inset-0 z-30 flex items-center justify-center">
          <div
            className="relative mx-6 max-h-[90%] w-full max-w-3xl overflow-y-auto rounded-lg bg-white"
            ref={modalContentRef}
          >
            <header className="flex items-start justify-between rounded-t border-b border-solid p-4">
              <h3 className="text-xl font-semibold">{title}</h3>
              <button
                className="ml-8 flex size-7 shrink-0 items-center justify-center rounded-md border transition-colors hover:bg-gray-200"
                onClick={() => setOpen(false)}
              >
                <FontAwesomeIcon
                  className="size-5 text-gray-800"
                  icon={faXmark}
                />
              </button>
            </header>
            <div className={clsx('p-4', className)}>{children}</div>
          </div>
        </div>
        <div className="fixed inset-0 z-20 bg-black opacity-25"></div>
      </>
    ) : null,
    portalDiv
  )
}
