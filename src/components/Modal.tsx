import { useEffect, type ReactNode } from 'react'
import '../styles/Modal.css'

interface ModalProps {
    onClose: () => void
    children: ReactNode
}

export function Modal({ onClose, children }: ModalProps) {
    useEffect(() => {
        document.body.style.overflow = 'hidden'

        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }
        document.addEventListener('keydown', handler)

        return () => {
            document.body.style.overflow = ''
            document.removeEventListener('keydown', handler)
        }
    }, [onClose])

    return (
        <div
            role="dialog"
            aria-modal="true"
            onClick={onClose}
            className="modal-backdrop"
        >
            <div onClick={(e) => e.stopPropagation()} className="modal-content">
                {children}
            </div>
        </div>
    )
}
