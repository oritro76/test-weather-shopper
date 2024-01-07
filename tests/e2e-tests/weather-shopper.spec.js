import { test, expect } from "@playwright/test";
import { HomePage } from "../pages/homepage";
import { ProductsPage } from "../pages/productspage";
import { CartPage } from "../pages/cartpage";

test("pay with stripe", async ({ page }) => {
  const productsToOrder = {
    moisturizer: [
      {
        nameContains: "aloe",
        priceType: "lowest",
      },
      {
        nameContains: "almond",
        priceType: "lowest",
      },
    ],
    sunscreen: [
      {
        nameContains: "spf-50",
        priceType: "lowest",
      },
      {
        nameContains: "spf-30",
        priceType: "lowest",
      },
    ],
  };
  const homePage = new HomePage(page);
  const productsPage = new ProductsPage(page);
  const cartPage = new CartPage(page);

  await homePage.goTo();
  const productType = await homePage.chooseSunscreenOrMoisturizers();
  const productsToAddToCart = productsToOrder[productType];
  const productsAddedToCart =
    await productsPage.addProductsToCart(productsToAddToCart);
  await productsPage.verifyNumberOfProductsShowedInCartButton(
    productsAddedToCart,
  );
  await productsPage.clickOnCartButton();
  const checkoutPageOrderedProducts = await cartPage.getOrderedItems();
  await cartPage.verifyAddedToCartProductsAndPricesAreShown(
    productsAddedToCart,
    checkoutPageOrderedProducts,
  );
  await cartPage.verifyTotalPrice(productsAddedToCart);
  await cartPage.payWithStripe(
    "test@test.com",
    "4000056655665556",
    "1225",
    "123",
    "123",
  );
});
