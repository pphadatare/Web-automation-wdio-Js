const BasePage = require('../base.page')

class HomePage extends BasePage {
    get catalogLink() {
        return $('#main-menu a[href="/collections/all"]')
    }

    get cartToggle() {
        return $('a.toggle-drawer')
    }

    async open() {
        await super.open('/')
        await this.catalogLink.waitForDisplayed()
    }

    async openCatalog() {
        await this.click(this.catalogLink)
        await this.waitForUrl('/collections/all')
    }

    async getCartCountText() {
        return this.textOf(this.cartToggle)
    }
}

module.exports = new HomePage()
