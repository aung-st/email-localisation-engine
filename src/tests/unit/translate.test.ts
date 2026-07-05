import { describe, it, expect } from '@jest/globals'
import {
    extractPlaceholders,
    restorePlaceholders,
} from '../../utils/placeholders'

describe('placeholders', () => {
    describe('extractPlaceholders', () => {
        it('replaces {{variable}} with a UUID', () => {
            const { scrubbed, map } = extractPlaceholders('Hello {{name}}')

            expect(scrubbed).not.toContain('{{name}}')
            expect(scrubbed).toMatch(
                /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/
            )
            expect(map.size).toBe(1)
            expect(map.values().next().value).toBe('{{name}}')
        })

        it('replaces URLs with a UUID', () => {
            const { scrubbed, map } = extractPlaceholders(
                'visit https://example.com/help'
            )

            expect(scrubbed).not.toContain('https://example.com/help')
            expect(map.size).toBe(1)
            expect(map.values().next().value).toBe('https://example.com/help')
        })

        it('replaces both {{variable}} and URLs', () => {
            const { map } = extractPlaceholders(
                '{{name}} at https://example.com'
            )

            expect(map.size).toBe(2)
            const values = Array.from(map.values())
            expect(values).toContain('{{name}}')
            expect(values).toContain('https://example.com')
        })

        it('strips trailing punctuation from URLs', () => {
            const { map } = extractPlaceholders('see https://example.com.')

            const url = Array.from(map.values())[0]
            expect(url).toBe('https://example.com')
            expect(url).not.toMatch(/\.$/)
        })

        it('strips trailing comma from URLs', () => {
            const { map } = extractPlaceholders('visit https://example.com, ok')

            const url = Array.from(map.values())[0]
            expect(url).toBe('https://example.com')
        })

        it('handles text with no placeholders', () => {
            const { scrubbed, map } = extractPlaceholders('Hello world')

            expect(scrubbed).toBe('Hello world')
            expect(map.size).toBe(0)
        })

        it('handles multiple {{variable}} tags', () => {
            const { map } = extractPlaceholders('{{a}} {{b}} {{c}}')

            expect(map.size).toBe(3)
            const values = Array.from(map.values())
            expect(values).toEqual(['{{a}}', '{{b}}', '{{c}}'])
        })
    })

    describe('restorePlaceholders', () => {
        it('restores {{variable}} from UUID placeholders', () => {
            const { scrubbed, map } = extractPlaceholders('Hello {{name}}')

            const restored = restorePlaceholders(scrubbed, map)

            expect(restored).toBe('Hello {{name}}')
        })

        it('restores URLs from UUID placeholders', () => {
            const { scrubbed, map } = extractPlaceholders(
                'visit https://example.com'
            )

            const restored = restorePlaceholders(scrubbed, map)

            expect(restored).toBe('visit https://example.com')
        })

        it('restores both {{variable}} and URLs', () => {
            const { scrubbed, map } = extractPlaceholders(
                '{{name}} at https://example.com'
            )

            const restored = restorePlaceholders(scrubbed, map)

            expect(restored).toBe('{{name}} at https://example.com')
        })

        it('handles text with no placeholders to restore', () => {
            const { scrubbed, map } = extractPlaceholders('Hello world')

            const restored = restorePlaceholders(scrubbed, map)

            expect(restored).toBe('Hello world')
        })

        it('preserves $ in original values when restoring', () => {
            const { scrubbed, map } = extractPlaceholders('Hello {{$name}}')

            const restored = restorePlaceholders(scrubbed, map)

            expect(restored).toBe('Hello {{$name}}')
        })

        it('preserves $& in original values when restoring', () => {
            const { scrubbed, map } = extractPlaceholders('{{$&}}')

            const restored = restorePlaceholders(scrubbed, map)

            expect(restored).toBe('{{$&}}')
        })

        it('restores multiple {{variable}} tags in order', () => {
            const { scrubbed, map } = extractPlaceholders(
                '{{first}} {{second}} {{third}}'
            )

            const restored = restorePlaceholders(scrubbed, map)

            expect(restored).toBe('{{first}} {{second}} {{third}}')
        })
    })
})
