import { expect, type Locator, type Page } from '@playwright/test';
import {type Product} from '../utilities/types';
import {verifyHeading, returnNumbersFromText} from '../utilities/functions';

export class ProductsPage{
    readonly page: Page;
    readonly cartButton: Locator;

    constructor(page:Page){
        this.page = page;
        this.cartButton = this.page.getByRole('button').filter({ hasText: 'Cart' });
    }

    public async getAllTheProducts(){
        let products: Product[] = [];
        let productsCardLocators = await this.page
                                            .locator("xpath=(//div[@class='text-center col-4'])")
                                            .all();
        console.log(productsCardLocators);
        for(let productsCard of productsCardLocators){
            let product:Product = {
                name: await productsCard.locator("xpath=/p[1]").innerText(),
                price: returnNumbersFromText(await productsCard.locator("xpath=/p[2]").innerText()),
                addButton: await productsCard.locator("xpath=/button"),
            };
            
            products.push(product);
        }
        return products;
    }

    public filterProductsBasedOnName(products:Product[], name:string){
        return products.filter(product => product.name.toLowerCase()
                                                     .includes(name));
        
    }

    public getLowestOrHighestPricedProduct(products:Product[], priceType:string="lowest"){
        if(priceType === "lowest"){
            return products.reduce((minPriceProduct:Product, currentProduct:Product) => {
                return Number(currentProduct.price) < Number(minPriceProduct.price) ? currentProduct : minPriceProduct;
                });
        }else if(priceType === "highest"){
            return products.reduce((maxPriceProduct:Product, currentProduct:Product) => {
                return Number(currentProduct.price) > Number(maxPriceProduct.price) ? currentProduct : maxPriceProduct;
                });
        }
    }

    public async verifyNumberOfProductsShowedInCartButton(products:Product[]){
        let cartProductCount = returnNumbersFromText(await this.cartButton.innerText());
        expect(cartProductCount).toBe(products.length);
    }

    public async addProductsToCart(productsToOrder){
        let products = await this.getAllTheProducts();
        let productsAddedToCart = [];
        for(let product of productsToOrder){
            let productsFilteredBasedOnName = this.filterProductsBasedOnName(products, 
                                                                            product["nameContains"]);
            let productFilterBasedOnPriceType = this.getLowestOrHighestPricedProduct(productsFilteredBasedOnName, 
                                                                                    product["priceType"]);
            await productFilterBasedOnPriceType["addButton"].click();
            productsAddedToCart.push(productFilterBasedOnPriceType);
        }
        return productsAddedToCart;

    }

    public async clickOnCartButton(){
        await this.cartButton.click();
        await this.page.waitForURL('**/cart');
        await verifyHeading(this.page, "Checkout");
    }
}