const BasePage = require('../base.page')
const env = require('../../../config/env')

class CheckoutPage extends BasePage {
    get email() {
        return $('#email')
    }

    get country() {
        return $('select[name="countryCode"]')
    }

    get firstName() {
        return $('input[placeholder="First name (optional)"]')
    }

    get lastName() {
        return $('input[placeholder="Last name"]')
    }

    get address() {
        return $('#shipping-address1')
    }

    get city() {
        return $('input[autocomplete="shipping address-level2"]')
    }

    get postalCode() {
        return $('input[autocomplete="shipping postal-code"]')
    }

    get phone() {
        return $('input[autocomplete="shipping tel-national"]')
    }

    get payNowButton() {
        return $('#checkout-pay-button')
    }

    get shippingOption() {
        return $('label*=Standard Shipping')
    }

    async fillGuestDetails(customer) {
        await this.#waitForCheckoutForm()
        await this.type(this.email, customer.email)

        if (await this.country.isExisting()) {
            await this.country.selectByVisibleText(customer.country)
        }

        await this.type(this.firstName, customer.firstName)
        await this.type(this.lastName, customer.lastName)
        await this.type(this.address, customer.address)
        await browser.keys('Escape')
        await this.type(this.city, customer.city)
        await this.type(this.postalCode, customer.postalCode)

        if (await this.phone.isExisting() && await this.phone.isDisplayed()) {
            await this.scrollTo(this.phone)
            await this.type(this.phone, customer.phone)
        }

        await this.selectShippingMethod()
    }

    async selectShippingMethod() {
        await browser.waitUntil(async () => {
            const bodyText = await $('body').getText()
            return !bodyText.includes('Enter your shipping address to view available shipping methods')
        }, {
            timeout: env.timeouts.shipping,
            timeoutMsg: 'Shipping methods did not load after entering the address'
        })

        if (await this.shippingOption.isExisting() && await this.shippingOption.isDisplayed()) {
            await this.shippingOption.click()
        }
    }

    async fillTestPayment(payment) {
        await this.#typeInCardIframe('Card number', 'number', payment.cardNumber)
        await this.#typeInCardIframe('Expiration date (MM / YY)', 'expiry', payment.expiry)
        await this.#typeInCardIframe('Security code', 'verification_value', payment.cvv)
        await this.#typeInCardIframe('Name on card', 'name', payment.nameOnCard)
    }

    async placeOrder() {
        await this.scrollTo(this.payNowButton)
        await this.click(this.payNowButton)
    }

    async waitForOrderConfirmation() {
        await browser.waitUntil(async () => {
            const url = await browser.getUrl()
            const bodyText = await $('body').getText()
            return url.includes('thank-you')
                || /thank you|your order is confirmed|order confirmed/i.test(bodyText)
        }, {
            timeout: env.timeouts.confirmation,
            timeoutMsg: 'Order confirmation page did not appear after placing the order'
        })
    }

    async #waitForCheckoutForm() {
        await this.email.waitForDisplayed()
        await this.payNowButton.waitForDisplayed()
    }

    async #typeInCardIframe(title, fieldId, value) {
        const iframe = await $(`iframe[title="${title}"]`)
        await iframe.waitForExist()
        await this.scrollTo(iframe)
        await browser.switchFrame(iframe)
        try {
            const input = await $(`#${fieldId}`)
            await input.waitForExist()
            await browser.execute((el) => {
                el.focus()
                el.value = ''
            }, input)
            await browser.keys(value.split(''))
        } finally {
            await browser.switchFrame(null)
        }
    }
}

module.exports = new CheckoutPage()
