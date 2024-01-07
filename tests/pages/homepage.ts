import { type Locator, type Page } from "@playwright/test";
import { verifyHeading, returnNumbersFromText } from "../utilities/functions";

export class HomePage {
  readonly page: Page;
  readonly temperatureText: Locator;
  readonly buyMoisturizersButton: Locator;
  readonly buySunscreenButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.temperatureText = this.page.locator("css=#temperature");
    this.buyMoisturizersButton = this.page.getByRole("button", {
      name: "Buy moisturizers",
    });
    this.buySunscreenButton = this.page.getByRole("button", {
      name: "Buy sunscreens",
    });
  }

  async goTo() {
    this.page.goto("/");
  }

  async getTempeture() {
    let temperature = await this.temperatureText.innerText();
    return returnNumbersFromText(temperature);
  }

  async goToSuncscreenPage() {
    await this.buySunscreenButton.click();
    await this.page.waitForURL("**/sunscreen");
    await verifyHeading(this.page, "Sunscreens");
  }

  async goToMoisturizersPage() {
    await this.buyMoisturizersButton.click();
    await this.page.waitForURL("**/moisturizer");
    await verifyHeading(this.page, "Moisturizers");
  }

  async chooseSunscreenOrMoisturizers() {
    let temperature = await this.getTempeture();
    if (temperature < 19) {
      await this.goToMoisturizersPage();
      return "moisturizer";
    } else if (temperature > 34) {
      await this.goToSuncscreenPage();
      return "sunscreen";
    }
  }
}
