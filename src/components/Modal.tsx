/**
 * React component for modal dialogs
 * Handles click and escape key events to open and close the modal
 * @param onClose - Callback function triggered to close the modal
 * @param children - Content to display inside the modal
 */
import { useEffect, type ReactNode } from 'react'
import '../styles/Modal.css'

interface ModalProps {
    /** Callback function triggered to close the modal */
    onClose: () => void
    /** Content to display inside the modal */
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
