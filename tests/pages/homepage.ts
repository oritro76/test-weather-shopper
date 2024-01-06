import { expect, type Locator, type Page } from '@playwright/test';
import {verifyHeading} from '../utilities/functions';

export class Homepage {
  readonly page: Page;
  readonly temperatureText: Locator;
  readonly buyMoisturizersButton: Locator;
  readonly buySunscreenButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.temperatureText = page.locator("css=#temperature");
    this.buyMoisturizersButton = page.getByRole('button', { name: 'Buy moisturizers' });
    this.buySunscreenButton = page.getByRole('button', { name: 'Buy sunscreens' });
  }

  async goTo(){
    this.page.goto("/");
  }

  async getTempeture(){
    let temperature = await this.temperatureText.innerText();
    return Number(temperature.replace(/[^\d\-+\.]/g, ''));
  }

  async goToSuncscreenPage(){
    await this.buySunscreenButton.click();
    await this.page.waitForURL('**/sunscreen');
    await verifyHeading(this.page,"Sunscreens");
  }

  async goToMoisturizersPage(){
    await this.buyMoisturizersButton.click();
    await this.page.waitForURL('**/moisturizer');
    await verifyHeading(this.page,"Moisturizers");
  }

  async chooseSunscreenOrMoisturizers(){
    let temperature = await this.getTempeture();
    if(temperature < 19){
        this.goToMoisturizersPage();
    }else if(temperature > 34){
        this.goToSuncscreenPage();
    }

  }
}