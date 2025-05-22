type TextEvent = {
    text: string
}

export type TextAnalysisResult = {
    wordCount: number,
    characterCount: number,
    lineCount: number,
    longestWordLength: number,
    // 'undefined' if all characters are non-alphabetic in this text
    mostCommonLetter: string | undefined;
}

function isAlpha(char: string) {
    return (/[a-zA-Z]/).test(char);
}

function isAlphanumeric(char: string) {
    // Apostrophe included to not break certain words
    return (/[a-zA-Z0-9']/).test(char);
}

function isNewLine(char: string) {
    return (/[\r\n]/).test(char);
}

function analyseText(text: string): Partial<TextAnalysisResult> {
    let wordCount = 0;
    let characterCount = 0;
    let lineCount = 1;
    let longestWordLength = 0;
    let mostCommonLetter = undefined;

    let pointer = 0;
    let lookingAtWord = false;
    let thisWordLength = 0;
    let charMap = new Map<string, number>();

    while (pointer < text.length) {
        const char = text[pointer];
        if (isAlphanumeric(char)) {
            characterCount++;
            thisWordLength++;

            if (!lookingAtWord) {
                wordCount++;
                lookingAtWord = true;
            }

            isAlpha(char) && (charMap.set(char.toLowerCase(), (charMap.get(char) || 0) + 1));
        } else {
            isNewLine(char) && lineCount++;

            if (lookingAtWord) {
                longestWordLength = Math.max(longestWordLength, thisWordLength);
                thisWordLength = 0;
                lookingAtWord = false;
            }
        }

        pointer++;
    }

    let charMapArray = Array.from(charMap);
    if (charMapArray.length > 0) mostCommonLetter =
        charMapArray.sort((a, b) => b[1] - a[1])[0][0];

    return {
        wordCount,
        characterCount,
        lineCount,
        longestWordLength,
        mostCommonLetter
    }
}

export const handler = async (event: TextEvent) => {
    try {
        if (!event || !event.text || typeof event.text !== "string"
            || event.text.length < 5 || event.text.length > 300) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    error: "Invalid input"
                })
            };
        }

        const text = event.text;

        const analysisResult = analyseText(text);

        return {
            statusCode: 200,
            body: JSON.stringify(analysisResult),
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: "Unhandled Lambda function error"
            })
        };
    }
};


