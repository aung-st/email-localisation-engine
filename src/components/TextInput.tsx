import '../styles/TextInput.css'

interface TextInputProps {
  text: string
  onTextChange: (text: string) => void
  onFileError: (error: string) => void
}

export function TextInput({ text, onTextChange, onFileError }: TextInputProps) {
  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const content = await file.text()
      onTextChange(content)
    } catch (e) {
      onFileError(String(e))
    }
  }

  return (
    <fieldset>
      <legend>Source text</legend>
      <input
        type="file"
        id="file-upload"
        accept=".txt,.json,.csv,.docx"
        onChange={handleFileUpload}
        className="file-input"
      />
      <label htmlFor="file-upload" className="file-label">Upload file</label>
      <textarea
        value={text}
        onChange={(e) => onTextChange(e.target.value)}
        placeholder="paste text here"
        rows={20}
      />
    </fieldset>
  )
}
