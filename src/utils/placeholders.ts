export interface TranslationPayload {
    template: string;
    dictionary: Record<string, string>;
}

/**
 * Replaces variables and URLs within a text string with temporary template keys 
 * and maps them into a lookup dictionary.
 *
 * @param text - The raw input text containing variables or URLs.
 * @returns An object containing the templated string and the lookup dictionary.
 */
export function extractToTemplate(text: string): TranslationPayload {
    const PATTERN = /(\{\{(?:.+?)\}\}|https?:\/\/[^\s<>"']+(?<![.,!?;:)\]}>]))/g;
    const dictionary: Record<string, string> = {};
    let counter = 0;

    const template = text.replace(PATTERN, (match) => {
        const key = `__{${counter}}__`;
        dictionary[key] = match;
        counter++;
        return key;
    });

    return { template, dictionary };
}

/**
 * Splits text into structural segments, invokes a callback to translate 
 * non-placeholder words, and restores the original placeholder values.
 *
 * @param text - The text string containing placeholders to translate.
 * @param translateApiCall - Callback function that translates an array of plain text strings.
 * @returns A promise that resolves to the fully translated text with placeholders restored.
 */
export async function translateWithPreservation(
    text: string,
    translateApiCall: (textChunks: string[]) => Promise<string[]>
): Promise<string> {
    const { template, dictionary } = extractToTemplate(text);

    // Split on template keys and whitespace blocks to isolate individual words
    const SPLIT_PATTERN = /(__\{\d+\}__|\s+)/g;
    const tokens = template.split(SPLIT_PATTERN);

    const translatableChunks = tokens.filter(
        (token) => token !== undefined && !token.match(SPLIT_PATTERN) && token.trim() !== ""
    );

    const translatedResults = translatableChunks.length > 0
        ? await translateApiCall(translatableChunks)
        : [];

    let resultIndex = 0;
    const reconstructed = tokens.map((token) => {
        if (!token) return "";

        if (token.match(SPLIT_PATTERN) || token.trim() === "") {
            return token;
        }

        const translatedValue = translatedResults[resultIndex] ?? token;
        resultIndex++;
        return translatedValue;
    });

    // Swap template keys back to original variables
    let finalString = reconstructed.join("");
    for (const [key, originalValue] of Object.entries(dictionary)) {
        finalString = finalString.split(key).join(originalValue);
    }

    return finalString;
}