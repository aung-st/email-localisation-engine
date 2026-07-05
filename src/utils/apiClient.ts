export interface ApiResponse<T> {
    /** Response data of type T */
    data: T
    /** HTTP status code */
    status: number
}

/**
 * Makes a POST request to the specified URL with JSON body
 * @param url - Target URL for the request
 * @param body - Request body payload
 * @param apiKey - Optional API key for authentication
 * @returns Promise resolving to ApiResponse with parsed data and status
 * @throws Error if response status indicates failure
 */
export async function post<TBody, TResponse>(
    url: string,
    body: TBody,
    apiKey?: string
): Promise<ApiResponse<TResponse>> {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    }

    if (apiKey) {
        headers['Authorization'] = `Bearer ${apiKey}`
    }

    const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
    })

    if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`)
    }

    const data: TResponse = await response.json()

    return { data, status: response.status }
}
