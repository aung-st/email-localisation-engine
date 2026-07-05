import { describe, it, expect, jest } from '@jest/globals'

const mockExtractRawText = jest.fn<
    (input: { arrayBuffer: ArrayBuffer }) => Promise<{
        value: string
        messages: { type: string; message: string }[]
    }>
>()

jest.mock('mammoth', () => ({
    extractRawText: mockExtractRawText,
}))

import { parseFile } from '../../utils/fileParser'

function makeFile(content: string, name: string): File {
    return new File([content], name)
}

describe('parseFile', () => {
    describe('txt', () => {
        it('returns the file content as text', async () => {
            const result = await parseFile(makeFile('hello world', 'test.txt'))
            expect(result).toBe('hello world')
        })
    })

    describe('json', () => {
        it('extracts string values from a flat object', async () => {
            const result = await parseFile(
                makeFile(JSON.stringify({ a: 'hello', b: 'world' }), 'data.json'),
            )
            expect(result).toBe('hello\nworld')
        })

        it('walks nested objects', async () => {
            const result = await parseFile(
                makeFile(JSON.stringify({ a: { b: { c: 'deep' } } }), 'data.json'),
            )
            expect(result).toBe('deep')
        })

        it('handles arrays of strings', async () => {
            const result = await parseFile(
                makeFile(JSON.stringify(['a', 'b', 'c']), 'data.json'),
            )
            expect(result).toBe('a\nb\nc')
        })

        it('handles mixed nested structures', async () => {
            const result = await parseFile(
                makeFile(JSON.stringify({ a: ['x', { y: 'z' }] }), 'data.json'),
            )
            expect(result).toBe('x\nz')
        })

        it('handles arrays nested inside arrays', async () => {
            const result = await parseFile(
                makeFile(JSON.stringify([['a', 'b'], ['c']]), 'data.json'),
            )
            expect(result).toBe('a\nb\nc')
        })

        it('returns empty string when no strings exist', async () => {
            const result = await parseFile(
                makeFile(JSON.stringify({ a: 1, b: null }), 'data.json'),
            )
            expect(result).toBe('')
        })

        it('throws on invalid JSON', async () => {
            await expect(
                parseFile(makeFile('not json', 'data.json')),
            ).rejects.toThrow()
        })
    })

    describe('csv', () => {
        it('skips header row and first column of data rows', async () => {
            const result = await parseFile(makeFile('section,text\na,b\nc,d', 'data.csv'))
            expect(result).toBe('b\nd')
        })

        it('handles quoted fields with commas', async () => {
            const result = await parseFile(
                makeFile('header\nkey,"hello, world",foo', 'data.csv'),
            )
            expect(result).toBe('hello, world | foo')
        })

        it('handles empty fields after the first column', async () => {
            const result = await parseFile(makeFile('h1,h2,h3\nkey,bar,', 'data.csv'))
            expect(result).toBe('bar | ')
        })

        it('skips empty rows', async () => {
            const result = await parseFile(makeFile('h\n\n', 'data.csv'))
            expect(result).toBe('')
        })
    })

    describe('docx', () => {
        it('calls mammoth.extractRawText with the arrayBuffer', async () => {
            mockExtractRawText.mockResolvedValue({
                value: 'extracted text',
                messages: [],
            })

            const file = makeFile('fake docx content', 'report.docx')
            const result = await parseFile(file)

            expect(mockExtractRawText).toHaveBeenCalledWith({
                arrayBuffer: expect.any(ArrayBuffer),
            })
            expect(result).toBe('extracted text')
        })

        it('forwards mammoth errors', async () => {
            mockExtractRawText.mockRejectedValue(new Error('corrupted file'))

            await expect(
                parseFile(makeFile('garbage', 'bad.docx')),
            ).rejects.toThrow('corrupted file')
        })
    })

    describe('unsupported files', () => {
        it('throws for unsupported extension', async () => {
            await expect(
                parseFile(makeFile('content', 'file.xyz')),
            ).rejects.toThrow('Unsupported file type: .xyz')
        })

        it('throws when file has no extension', async () => {
            await expect(
                parseFile(makeFile('content', 'README')),
            ).rejects.toThrow('File has no extension')
        })
    })
})
