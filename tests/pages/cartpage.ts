import {
  type FrameLocator,
  type Locator,
  type Page,
  expect,
} from "@playwright/test";
import { verifyHeading, returnNumbersFromText } from "../utilities/functions";
import { type Product } from "../utilities/types";

export class CartPage {
  readonly page: Page;
  readonly totalCheckoutPrice: Locator;
  readonly payWithCardButton: Locator;
  readonly stripeIframe: FrameLocator;
  readonly stripeEmailInput: Locator;
  readonly stripeCardNumberInput: Locator;
  readonly stripeCardExpiryInput: Locator;
  readonly stripeCVVInput: Locator;
  readonly stripeZipCodeInput: Locator;
  readonly stripePayButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.totalCheckoutPrice = this.page.locator("css=#total");
    this.stripeIframe = this.page.frameLocator("iframe");
    this.payWithCardButton = this.page
      .getByRole("button")
      .filter({ hasText: "Pay" });
    this.stripeEmailInput = this.stripeIframe.locator("css=#email");
    this.stripeCardNumberInput = this.stripeIframe.locator("css=#card_number");
    this.stripeCardExpiryInput = this.stripeIframe.locator("css=#cc-exp");
    this.stripeCVVInput = this.stripeIframe.locator("css=#cc-csc");
    this.stripeZipCodeInput = this.stripeIframe.locator("css=#billing-zip");
    this.stripePayButton = this.stripeIframe.getByRole("button");
  }

  async getOrderedItems() {
    let checkoutItemTds = await this.page.locator("xpath=//td").all();
    let checkoutPageOrderedProducts: Product[] = [];
    let orderedProduct: Partial<Product> = {};
    for (let count = 0; count < checkoutItemTds.length; count++) {
      if (count % 2 === 0) {
        orderedProduct["name"] = await checkoutItemTds[count].innerText();
      } else {
        orderedProduct["price"] = returnNumbersFromText(
          await checkoutItemTds[count].innerText(),
        );
        checkoutPageOrderedProducts.push(orderedProduct);
        orderedProduct = {};
      }
    }
    return checkoutPageOrderedProducts;
  }

  async verifyAddedToCartProductsAndPricesAreShown(
    addedToCartProducts: Product[],
    checkoutPageOrderedProducts: Product[],
  ) {
    expect(addedToCartProducts).toMatchObject(checkoutPageOrderedProducts);
  }

  async verifyTotalPrice(addedToCartProducts: Product[]) {
    let totalCheckoutPrice = returnNumbersFromText(
      await this.totalCheckoutPrice.innerText(),
    );
    const totalPrice = addedToCartProducts.reduce((accumulator, product) => {
      const price = Number(product.price);
      return accumulator + price;
    }, 0);
    expect(totalPrice).toBe(totalCheckoutPrice);
  }

  async payWithStripe(
    email: string,
    cardNumber: string,
    cardExpiry: string,
    cardCVV: string,
    zipCode: string,
  ) {
    await this.payWithCardButton.click();
    await this.stripeEmailInput.fill(email);
    await this.stripeCardNumberInput.pressSequentially(cardNumber);
    await this.stripeCardExpiryInput.fill(cardExpiry);
    await this.stripeCVVInput.fill(cardCVV);
    await this.stripeZipCodeInput.fill(zipCode);
    await this.stripePayButton.click();

    //confirmation page
    await this.page.waitForURL("**/confirmation");

    verifyHeading(this.page, "PAYMENT SUCCESS");

    let confirmationMessage = await this.page
      .locator("//p[@class='text-justify']")
      .innerText();
    expect(confirmationMessage).toBe(
      "Your payment was successful. You should receive a follow-up call from our sales team.",
    );
  }
}
