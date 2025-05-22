import fs from "fs";
import path from "path";
import { expect, test } from "vitest";

import { handler, TextAnalysisResult } from ".";

test('Handler should throw a 400 error on invalid input', async () => {
    const invalidInputs = [
        null,
        undefined,
        {},
        { text: 123 },
        { text: "" },
        { text: "123" },
        { text: "a".repeat(301) }
    ];

    for (const input of invalidInputs) {
        // @ts-expect-error
        const result = await handler(input);
        expect(result.statusCode).toBe(400);
    }
});

test('Handler should produce valid results for valid input', async () => {
    const mocks: { text: string, answers: TextAnalysisResult }[] = JSON.parse(
        fs.readFileSync(path.join(process.cwd(), 'test-mocks.json'), "utf-8"));

    for (const mock of mocks) {
        const result = await handler({ text: mock.text });
        expect(result.statusCode).toBe(200);
        expect(result.body).toBe(JSON.stringify(mock.answers));
    }
});
