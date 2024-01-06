import { Homepage } from "./pages/homepage";


function extractPrice(inputString) {
    // Regular expression to match the price pattern
    const priceRegex = /Price: ?(?:Rs\. )?(\d+)/;
  
    // Extracting the price using the regex
    const match = inputString.match(priceRegex);
  
    if (match && match[1]) {
      return match[1]; // Return the extracted price
    } else {
      return "Price not found"; // Return a message if the price is not found
    }
  }

test('has title', async ({ page }) => {
    // await page.goto('https://weathershopper.pythonanywhere.com/moisturizer');
    await page.goto('https://weathershopper.pythonanywhere.com/');
    
    let temperature = await page.locator("css=#temperature").innerText();
    console.log(temperature);
    temperature = Number(temperature.replace(/[^\d\-+\.]/g, ''));
    console.log(temperature);
    let heading;
    //mositurizer
    if(temperature < 19){
        await page.getByRole('button', { name: 'Buy moisturizers' }).click();
        await page.waitForURL('**/moisturizer');
        heading = await page.getByRole('heading').innerText();
        expect(heading).toBe("Moisturizers");


    } else if(temperature > 34){
        await page.getByRole('button', { name: 'Buy sunscreens' }).click();
        await page.waitForURL('**/sunscreen');
        heading = await page.getByRole('heading').innerText();
        expect(heading).toBe("Sunscreens");
    }
    
    //products page
  
    let products = [];
    let productsCardLocators = await page.locator("xpath=(//div[@class='text-center col-4'])").all();
    console.log(productsCardLocators);
    for(let productsCard of productsCardLocators){
        let product = {};
        product["name"] = await productsCard.locator("xpath=/p[1]").innerText();
        product["price"] = extractPrice(await productsCard.locator("xpath=/p[2]").innerText());
        product["addButton"] = await productsCard.locator("xpath=/button");
        products.push(product);
    }
    console.log(products);
    let prdouctsAddToCart = [];
    // Filter products containing 'almond' in their name
    const almondProducts = products.filter(product => product.name.toLowerCase().includes('almond'));
    let lowestPriceAlmondProduct;
    // Find the object with the lowest price among almond products
    if (almondProducts.length > 0) {
        prdouctsAddToCart.push(almondProducts.reduce((minPriceProduct, currentProduct) => {
        return parseInt(currentProduct.price) < parseInt(minPriceProduct.price) ? currentProduct : minPriceProduct;
        }));

        // Output the object with the lowest price containing 'almond'
    } else {
    console.log('No almond products found');
    }

    // Filter products containing 'aloe' in their name
    const aloeProducts = products.filter(product => product.name.toLowerCase().includes('aloe'));
    let lowestPriceAloeProduct;
    // Find the object with the lowest price among almond products
    if (aloeProducts.length > 0) {
        prdouctsAddToCart.push(aloeProducts.reduce((minPriceProduct, currentProduct) => {
        return parseInt(currentProduct.price) < parseInt(minPriceProduct.price) ? currentProduct : minPriceProduct;
        }));

         // Output the object with the lowest price containing 'almond'
    } else {
    console.log('No almond products found');
    }

    for(let product of prdouctsAddToCart){
        await product["addButton"].click();
    }

    await page
    .getByRole('button')
    .filter({ hasText: 'Cart' }).click();
     
    await page.waitForURL('**/cart');
    //checkout page
    heading = await page.getByRole('heading').innerText();
    expect(heading).toBe("Checkout");

    let checkoutItemTds = await page.locator("xpath=//td").all();
    let checkoutPageOrderedProducts = [];
    let orderedProduct = {};
    for(let count = 0; count < checkoutItemTds.length; count++){
        
        if(count % 2 === 0){
            orderedProduct["name"] = await checkoutItemTds[count].innerText();
        }else{
            orderedProduct["price"] = await checkoutItemTds[count].innerText();
            checkoutPageOrderedProducts.push(orderedProduct);
            orderedProduct = {};
        }
        
    }

    console.log(checkoutPageOrderedProducts);

    const numberPattern = /\d+(\.\d+)?/; // Regular expression to match numbers (integer or floating-point)

    
    let totalCheckoutPrice = await page.locator("css=#total").innerText();
    const match = totalCheckoutPrice.match(numberPattern);
    if (match) {
        totalCheckoutPrice = Number(match[0]); // Extracted number
        console.log(totalCheckoutPrice); // Output the extracted number
      } else {
        console.log('No number found in the string');
      }
    console.log(totalCheckoutPrice);
    console.log(prdouctsAddToCart);

    expect(prdouctsAddToCart).toMatchObject(checkoutPageOrderedProducts);

    const totalPrice = prdouctsAddToCart.reduce((accumulator, product) => {
        const price = Number(product.price); // Convert price to float
        return accumulator + price; // Accumulate the prices
      }, 0);

    console.log(totalPrice);
    console.log(totalCheckoutPrice);
    expect(totalPrice).toBe(totalCheckoutPrice);
    
    await page.getByRole("button").filter({ hasText: 'Pay' }).click();

    //stripe payment
    let stripeIframe = await page.frameLocator("iframe")//.locator("css=#email").fill("test@test.com");
    // await expect(stripeIframe).toBeVisible();
    // await stripeIframe.wait
    await stripeIframe.locator("css=#email").fill("test@test.com");
    await stripeIframe.locator("css=#card_number").pressSequentially("4000056655665556");
    await stripeIframe.locator("css=#cc-exp").fill("1225");
    await stripeIframe.locator("css=#cc-csc").fill("123");
    await stripeIframe.locator("css=#billing-zip").fill("123");
    await stripeIframe.getByRole("button").click();

    //confirmation page
    await page.waitForURL('**/confirmation');

    heading = await page.getByRole('heading').innerText();
    expect(heading).toBe("PAYMENT SUCCESS");

    let confirmationMessage = await page.locator("//p[@class='text-justify']").innerText();
    expect(confirmationMessage)
    .toBe("Your payment was successful. You should receive a follow-up call from our sales team.");


});