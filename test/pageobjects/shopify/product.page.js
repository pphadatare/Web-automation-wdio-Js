const BasePage = require('../base.page')

class ProductPage extends BasePage {
    productCard(handle) {
        return $(`a[href*="/products/${handle}"]`)
    }

    get addToCartButton() {
        return $('#add')
    }

    async selectProduct(handle) {
        const card = this.productCard(handle)
        await card.waitForDisplayed()
        await this.scrollTo(card)
        await this.click(card)
        await this.waitForUrl(`/products/${handle}`)
        await this.addToCartButton.waitForDisplayed()
    }

    async addToCart() {
        await this.click(this.addToCartButton)
    }
}

module.exports = new ProductPage()
