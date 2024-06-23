import FeedManager from '@/components/FeedManager'
import Modal from '@/components/Modal'
import { Dispatch, SetStateAction } from 'react'

interface FeedModalProps {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}

export default function FeedModal({ open, setOpen }: FeedModalProps) {
  return (
    <Modal open={open} setOpen={setOpen} title="RSS Controls">
      <FeedManager />
    </Modal>
  )
}
