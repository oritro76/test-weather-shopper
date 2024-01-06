import { expect, type Page } from '@playwright/test';

export async function verifyHeading(page:Page, headingText:string) {
    let heading = await page.getByRole('heading').innerText();
    expect(heading).toBe(headingText);
}

export function returnNumbersFromText(text:string) {
    const numberPattern = /\d+(\.\d+)?/; // Regular expression to match numbers (integer or floating-point)
    const match = text.match(numberPattern);
    return Number(match[0]);
       
}