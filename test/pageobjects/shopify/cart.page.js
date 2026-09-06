const BasePage = require('../base.page')

class CartPage extends BasePage {
    get lineItemName() {
        return $('#cart h3 a')
    }

    get cartTotal() {
        return $('#cart .cart.total h2')
    }

    get checkoutButton() {
        return $('#cart #checkout')
    }

    async open() {
        await super.open('/cart')
        await this.lineItemName.waitForDisplayed()
        await this.checkoutButton.waitForDisplayed()
    }

    async getLineItemName() {
        return this.textOf(this.lineItemName)
    }

    async getQuantity() {
        const input = await this.firstDisplayed('#cart .quantity input[name="updates[]"]')
        return input.getValue()
    }

    async getTotalText() {
        return this.textOf(this.cartTotal)
    }

    async proceedToCheckout() {
        await this.click(this.checkoutButton)
        await this.waitForUrl('/checkouts/')
    }
}

module.exports = new CartPage()
