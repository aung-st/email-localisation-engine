/**
 * Extracts and replaces placeholders in text for translation
 * Captures {{variable}} merge tags and https:// URLs so they survive
 * translation. Each match is replaced with a UUID placeholder, then
 * restored after the engine translates the scrubbed text.
 * @param text - The original text containing placeholders
 * @returns Object with scrubbed text (placeholders replaced) and map
 */
export function extractPlaceholders(text: string): {
    /** Text with placeholders replaced by UUIDs */
    scrubbed: string
    /** Map from UUID placeholders to original matches */
    map: Map<string, string>
} {
    const PATTERN = /(\{\{(.+?)\}\})|(https?:\/\/[^\s<>"']+(?<![.,!?;:)\]}>]))/g
    const map = new Map<string, string>()
    const scrubbed = text.replace(PATTERN, (match) => {
        const ph = crypto.randomUUID()
        map.set(ph, match)
        return ph
    })
    return { scrubbed, map }
}

/**
 * Restores original placeholders in translated text
 * @param text - The translated text containing UUID placeholders
 * @param map - Map from UUID placeholders to original matches
 * @returns Text with placeholders restored to original content
 */
export function restorePlaceholders(
    text: string,
    map: Map<string, string>
): string {
    for (const [ph, original] of map) {
        text = text.split(ph).join(original)
    }
    return text
}
