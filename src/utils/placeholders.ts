export function extractPlaceholders(
    text: string,
): { scrubbed: string; map: Map<string, string> } {
    // Captures {{variable}} merge tags and https:// URLs so they survive
    // translation. Each match is replaced with a UUID placeholder, then
    // restored after the engine translates the scrubbed text.
    const PATTERN = /(\{\{(.+?)\}\})|(https?:\/\/[^\s<>"']+(?<![.,!?;:)\]}>]))/g
    const map = new Map<string, string>()
    const scrubbed = text.replace(PATTERN, (match) => {
        const ph = crypto.randomUUID()
        map.set(ph, match)
        return ph
    })
    return { scrubbed, map }
}

export function restorePlaceholders(
    text: string,
    map: Map<string, string>,
): string {
    for (const [ph, original] of map) {
        text = text.split(ph).join(original)
    }
    return text
}
