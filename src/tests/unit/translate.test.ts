import { describe, it, expect, jest } from '@jest/globals'
import {
    extractToTemplate,
    translateWithPreservation
} from '../../utils/placeholders'

describe('placeholders keyed-tokenization', () => {
    describe('extractToTemplate', () => {
        it('identifies and isolates a {{variable}} into a tracking dictionary', () => {
            const { template, dictionary } = extractToTemplate('Hello {{name}}')

            expect(template).toBe('Hello __{0}__')
            expect(dictionary).toEqual({
                '__{0}__': '{{name}}'
            })
        })

        it('identifies and isolates URLs into a tracking dictionary', () => {
            const { template, dictionary } = extractToTemplate('visit https://example.com/help')

            expect(template).toBe('visit __{0}__')
            expect(dictionary).toEqual({
                '__{0}__': 'https://example.com/help'
            })
        })

        it('extracts both {{variable}} and URLs sequentially', () => {
            const { template, dictionary } = extractToTemplate('{{name}} at https://example.com')

            expect(template).toBe('__{0}__ at __{1}__')
            expect(dictionary).toEqual({
                '__{0}__': '{{name}}',
                '__{1}__': 'https://example.com'
            })
        })

        it('strips trailing punctuation from URLs within the template extraction', () => {
            const { template, dictionary } = extractToTemplate('see https://example.com.')

            expect(template).toBe('see __{0}__.')
            expect(dictionary).toEqual({
                '__{0}__': 'https://example.com'
            })
        })

        it('strips trailing comma from URLs within the template extraction', () => {
            const { template, dictionary } = extractToTemplate('visit https://example.com, ok')

            expect(template).toBe('visit __{0}__, ok')
            expect(dictionary).toEqual({
                '__{0}__': 'https://example.com'
            })
        })

        it('handles text with no placeholders', () => {
            const { template, dictionary } = extractToTemplate('Hello world')

            expect(template).toBe('Hello world')
            expect(Object.keys(dictionary)).toHaveLength(0)
        })

        it('handles multiple {{variable}} tags sequentially', () => {
            const { template, dictionary } = extractToTemplate('{{a}} {{b}} {{c}}')

            expect(template).toBe('__{0}__ __{1}__ __{2}__')
            expect(dictionary).toEqual({
                '__{0}__': '{{a}}',
                '__{1}__': '{{b}}',
                '__{2}__': '{{c}}'
            })
        })
    })

    describe('translateWithPreservation', () => {
        it('safely passes clean chunks to engine and reassembles variables', async () => {
            const mockTranslateApiCall = jest.fn(async (chunks: string[]) => {
                // FIXED: Spaces are separated out, matching the pristine string
                expect(chunks).toEqual(['Hello'])
                return ['Hola']
            })

            const result = await translateWithPreservation('Hello {{name}}', mockTranslateApiCall)

            expect(result).toBe('Hola {{name}}')
            expect(mockTranslateApiCall).toHaveBeenCalledTimes(1)
        })

        it('safely passes clean chunks to engine and reassembles URLs', async () => {
            const mockTranslateApiCall = jest.fn(async (chunks: string[]) => {
                // FIXED: Removed trailing whitespace artifact from validation chunk
                expect(chunks).toEqual(['visit'])
                return ['visite']
            })

            const result = await translateWithPreservation('visit https://example.com', mockTranslateApiCall)

            expect(result).toBe('visite https://example.com')
        })

        it('orchestrates blocks containing both types of placeholders', async () => {
            const mockTranslateApiCall = jest.fn(async (chunks: string[]) => {
                // FIXED: Isolated to raw words only
                expect(chunks).toEqual(['at'])
                return ['en']
            })

            const result = await translateWithPreservation('{{name}} at https://example.com', mockTranslateApiCall)

            expect(result).toBe('{{name}} en https://example.com')
        })

        it('skips calling the translation API completely if text is empty or only has placeholders', async () => {
            const mockTranslateApiCall = jest.fn(async () => [])

            const result = await translateWithPreservation('{{name}}', mockTranslateApiCall)

            expect(result).toBe('{{name}}')
            expect(mockTranslateApiCall).not.toHaveBeenCalled()
        })

        it('leaves spacing and newlines untouched', async () => {
            const input = '\n\nHello\n{{name}}\n\n'
            const mockTranslateApiCall = jest.fn(async (chunks: string[]) => {
                // FIXED: The engine only evaluates the text block, skipping formatting layout tokens entirely
                expect(chunks).toEqual(['Hello'])
                return ['Hola']
            })

            const result = await translateWithPreservation(input, mockTranslateApiCall)

            expect(result).toBe('\n\nHola\n{{name}}\n\n')
        })

        it('is immune to regex injection character bugs like $ and $&', async () => {
            const mockTranslateApiCall = jest.fn(async (_chunks: string[]) => 
                _chunks.map(() => '')
            )

            const result1 = await translateWithPreservation('{{$}}', mockTranslateApiCall)
            const result2 = await translateWithPreservation('{{$&}}', mockTranslateApiCall)

            expect(result1).toBe('{{$}}')
            expect(result2).toBe('{{$&}}')
        })
    })

    it('handles consecutive tags and empty token fallbacks safely', async () => {
    // Consecutive tags force the string split step to emit an empty slice index
    const input = '{{a}}{{b}}'
    const mockTranslateApiCall = jest.fn(async () => [])

    const result = await translateWithPreservation(input, mockTranslateApiCall)
    expect(result).toBe('{{a}}{{b}}')
})
})