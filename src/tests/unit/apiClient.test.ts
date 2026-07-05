import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals'
import { post } from '../../utils/apiClient.ts'

const baseUrl = process.env.BASE_URL as string

let mockFetch: ReturnType<typeof jest.fn>

beforeEach(() => {
  mockFetch = jest.fn<any>()
  globalThis.fetch = mockFetch
})

afterEach(() => {
  delete (globalThis as any).fetch
})

describe('post', () => {
  it('sends a POST request with JSON body and returns parsed response', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ translatedText: 'hola' }),
    })

    const result = await post<{ q: string }, { translatedText: string }>(
      `${baseUrl}/translate`,
      { q: 'hello' },
    )

    expect(result.data.translatedText).toBe('hola')
    expect(result.status).toBe(200)
    expect(mockFetch).toHaveBeenCalledWith(
      `${baseUrl}/translate`,
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ q: 'hello' }),
      }),
    )
  })

  it('includes Authorization header when apiKey is provided', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ translatedText: 'hola' }),
    })

    await post(`${baseUrl}/translate`, { q: 'hello' }, 'my-api-key')

    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer my-api-key',
        },
      }),
    )
  })

  it('throws when response is not ok', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 400,
      json: () => Promise.resolve({ error: 'bad request' }),
    })

    await expect(
      post(`${baseUrl}/translate`, { q: 'hello' }),
    ).rejects.toThrow('Request failed: 400')
  })
})
