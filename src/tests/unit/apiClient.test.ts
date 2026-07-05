import {
    describe,
    it,
    expect,
    beforeEach,
    afterEach,
    jest,
} from '@jest/globals'
import { post } from '../../utils/apiClient'

const baseUrl = process.env.VITE_BASE_URL as string

let mockFetch: jest.SpiedFunction<typeof globalThis.fetch>

beforeEach(() => {
    mockFetch = jest
        .spyOn(globalThis, 'fetch')
        .mockImplementation(jest.fn<typeof globalThis.fetch>())
})

afterEach(() => {
    mockFetch.mockRestore()
})

describe('post', () => {
    it('sends a POST request with JSON body and returns parsed response', async () => {
        mockFetch.mockResolvedValue(
            new Response(JSON.stringify({ translatedText: 'hola' }), {
                status: 200,
            })
        )

        const result = await post<{ q: string }, { translatedText: string }>(
            `${baseUrl}/translate`,
            { q: 'hello' }
        )

        expect(result.data.translatedText).toBe('hola')
        expect(result.status).toBe(200)
        expect(mockFetch).toHaveBeenCalledWith(
            `${baseUrl}/translate`,
            expect.objectContaining({
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ q: 'hello' }),
            })
        )
    })

    it('includes Authorization header when apiKey is provided', async () => {
        mockFetch.mockResolvedValue(
            new Response(JSON.stringify({ translatedText: 'hola' }), {
                status: 200,
            })
        )

        await post(`${baseUrl}/translate`, { q: 'hello' }, 'my-api-key')

        expect(mockFetch).toHaveBeenCalledWith(
            expect.any(String),
            expect.objectContaining({
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer my-api-key',
                },
            })
        )
    })

    it('throws when response is not ok', async () => {
        mockFetch.mockResolvedValue(
            new Response(JSON.stringify({ error: 'bad request' }), {
                status: 400,
            })
        )

        await expect(
            post(`${baseUrl}/translate`, { q: 'hello' })
        ).rejects.toThrow('Request failed: 400')
    })
})
