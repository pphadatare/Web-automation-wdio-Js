const { Given, When, Then } = require('@wdio/cucumber-framework')
const { expect } = require('chai')
const { loadData } = require('../utils/dataLoader')
const { homePage, productPage, cartPage, checkoutPage } = require('../pageobjects')

const checkoutData = loadData('shopify-checkout.json')

Given('I open the Sauce Demo store', async () => {
    await homePage.open()
})

When('I open the product catalog', async () => {
    await homePage.openCatalog()
})

When('I select the {string} product', async (productName) => {
    expect(productName).to.equal(checkoutData.product.name)
    await productPage.selectProduct(checkoutData.product.handle)
})

When('I add the product to the cart', async () => {
    await productPage.addToCart()
    await browser.waitUntil(async () => (await homePage.getCartCountText()).includes('(1)'), {
        timeoutMsg: 'Cart count did not update to 1 after adding the product'
    })
})

Then('the header cart should show 1 item', async () => {
    expect(await homePage.getCartCountText()).to.include('My Cart (1)')
})

When('I open the shopping cart', async () => {
    await cartPage.open()
})

Then('the cart should contain {string} with quantity {int} and total {string}', async (productName, quantity, total) => {
    expect(await cartPage.getLineItemName()).to.include(productName)
    expect(await cartPage.getQuantity()).to.equal(String(quantity))
    expect(await cartPage.getTotalText()).to.include(total)
})

When('I proceed to checkout', async () => {
    await cartPage.proceedToCheckout()
})

When('I fill guest shipping and test payment details', async () => {
    await checkoutPage.fillGuestDetails(checkoutData.customer)
    await checkoutPage.fillTestPayment(checkoutData.payment)
})

When('I place the order', async () => {
    await checkoutPage.placeOrder()
})

Then('I should see the order confirmation', async () => {
    await checkoutPage.waitForOrderConfirmation()
})
