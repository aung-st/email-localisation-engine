/**
 * React component for displaying translation previews and email templates
 * Shows the translated text and provides a modal to preview the full email
 * @param translatedText - The translated text to display and preview
 */
import { useState } from 'react'
import { Modal } from './Modal'
import { emailTemplate } from '../utils/emailTemplate'
import '../styles/EmailPreview.css'

interface EmailPreviewProps {
    /** The translated text to display and use in the email template */
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
