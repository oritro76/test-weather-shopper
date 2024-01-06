import { expect, type Page } from '@playwright/test';

export async function verifyHeading(page:Page, headingText:string) {
    let heading = await page.getByRole('heading').innerText();
    expect(heading).toBe(headingText);
}