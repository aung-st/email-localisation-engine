/**
 * Props interface for the TextInput component
 * Handles text input via direct typing or file upload
 * @param text - Current text content displayed in the component
 * @param onTextChange - Callback triggered when text changes (via typing or file upload)
 * @param onFileError - Callback triggered when file parsing fails
 */
import '../styles/TextInput.css'
import { parseFile } from '../utils/fileParser'

interface TextInputProps {
    /** Current text content displayed in the component */
    text: string
    /** Callback triggered when text changes (via typing or file upload) */
    onTextChange: (text: string) => void
    /** Callback triggered when file parsing fails */
    onFileError: (error: string) => void
}

/**
 * React component for text input with file upload support
 * Allows users to type text directly or upload supported file types
 * (.txt, .json, .csv, .docx) which are automatically parsed and inserted
 */
export function TextInput({ text, onTextChange, onFileError }: TextInputProps) {
    async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file) return

        try {
            const content = await parseFile(file)
            onTextChange(content)
        } catch (e) {
            onFileError(String(e))
        }
    }

    return (
        <fieldset className="source-fieldset">
            <legend>Source text</legend>
            <input
                type="file"
                id="file-upload"
                accept=".txt,.json,.csv,.docx"
                onChange={handleFileUpload}
                className="file-input"
            />
            <label htmlFor="file-upload" className="file-label">
                Upload file
            </label>
            <textarea
                value={text}
                onChange={(e) => onTextChange(e.target.value)}
                placeholder="paste text here"
            />
        </fieldset>
    )
}
