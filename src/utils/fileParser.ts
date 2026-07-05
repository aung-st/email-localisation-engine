import mammoth from 'mammoth'

function collectStrings(value: unknown, acc: string[]): void {
    if (typeof value === 'string') {
        acc.push(value)
    } else if (Array.isArray(value)) {
        for (const item of value) {
            collectStrings(item, acc)
        }
    } else if (value !== null && typeof value === 'object') {
        for (const v of Object.values(value)) {
            collectStrings(v, acc)
        }
    }
}

function parseCsv(raw: string): string {
    const normalised = raw.replace(/\r\n/g, '\n')
    const rows: string[][] = []
    let fields: string[] = []
    let current = ''
    let inQuotes = false

    for (const ch of normalised) {
        if (ch === '"') {
            inQuotes = !inQuotes
        } else if (ch === ',' && !inQuotes) {
            fields.push(current)
            current = ''
        } else if (ch === '\n' && !inQuotes) {
            fields.push(current)
            if (fields.some((f) => f.length > 0)) {
                rows.push(fields)
            }
            fields = []
            current = ''
        } else {
            current += ch
        }
    }
    fields.push(current)
    if (fields.some((f) => f.length > 0)) {
        rows.push(fields)
    }

    const data = rows.slice(1)
    return data
        .map((row) => row.slice(1).join(' | '))
        .filter(Boolean)
        .join('\n')
}

export async function parseFile(file: File): Promise<string> {
    const parts = file.name.split('.')
    if (parts.length < 2) throw new Error('File has no extension')

    const ext = parts[parts.length - 1].toLowerCase()

    switch (ext) {
        case 'txt':
            return file.text()

        case 'json': {
            const raw = await file.text()
            const parsed = JSON.parse(raw) as unknown
            const strings: string[] = []
            collectStrings(parsed, strings)
            return strings.join('\n')
        }

        case 'csv':
            return parseCsv(await file.text())

        case 'docx': {
            const arrayBuffer = await file.arrayBuffer()
            const result = await mammoth.extractRawText({ arrayBuffer })
            return result.value
        }

        default:
            throw new Error(`Unsupported file type: .${ext}`)
    }
}
