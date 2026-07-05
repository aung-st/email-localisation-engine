import { useState } from 'react'
import { Modal } from './Modal'
import { emailTemplate } from '../utils/emailTemplate'
import '../styles/EmailPreview.css'

interface EmailPreviewProps {
    translatedText: string
}

export function EmailPreview({ translatedText }: EmailPreviewProps) {
    const [modalOpen, setModalOpen] = useState(false)
    const renderedTemplate = emailTemplate(translatedText)

    return (
        <div className="preview-panel">
            <div className="preview-legend">Translation Preview</div>
            <div className="translated-text">{translatedText}</div>
            <button
                type="button"
                onClick={() => setModalOpen(true)}
                disabled={!translatedText.trim()}
            >
                Preview Email
            </button>

            {modalOpen && (
                <Modal onClose={() => setModalOpen(false)}>
                    <div className="modal-actions">
                        <button
                            type="button"
                            onClick={() => setModalOpen(false)}
                        >
                            Close
                        </button>
                    </div>
                    <iframe
                        title="Email preview"
                        srcDoc={renderedTemplate}
                        className="preview-frame"
                    />
                </Modal>
            )}
        </div>
    )
}
