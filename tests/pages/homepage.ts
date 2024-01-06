import { type Locator, type Page } from '@playwright/test';
import {verifyHeading, returnNumbersFromText} from '../utilities/functions';

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

    public async goTo(){
        this.page.goto("/");
    }

    public async getTempeture(){
        let temperature = await this.temperatureText.innerText();
        return returnNumbersFromText(temperature);
    }

    public async goToSuncscreenPage(){
        await this.buySunscreenButton.click();
        await this.page.waitForURL('**/sunscreen');
        await verifyHeading(this.page,"Sunscreens");
    }

    public async goToMoisturizersPage(){
        await this.buyMoisturizersButton.click();
        await this.page.waitForURL('**/moisturizer');
        await verifyHeading(this.page,"Moisturizers");
    }

    public async chooseSunscreenOrMoisturizers(){
        let temperature = await this.getTempeture();
        if(temperature < 19){
            this.goToMoisturizersPage();
        }else if(temperature > 34){
            this.goToSuncscreenPage();
        }

    }
}