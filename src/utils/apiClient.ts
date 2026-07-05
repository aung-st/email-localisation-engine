export interface ApiResponse<T> {
    data: T
    status: number
}

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
