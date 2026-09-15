const env = require('../../config/env')

class BasePage {
    async open(path = '/') {
        await browser.url(path)
    }

    async click(element) {
        await element.waitForClickable()
        await element.click()
    }

    async scrollTo(element) {
        const { y } = await element.getLocation()
        await browser.execute((top) => {
            window.scrollTo(0, Math.max(0, top - 180))
        }, y)
    }

    async type(element, value) {
        await element.waitForDisplayed()
        await element.setValue(value)
    }

    async textOf(element) {
        await element.waitForDisplayed()
        return element.getText()
    }

    async waitForUrl(substring, timeout = env.timeouts.wait) {
        await browser.waitUntil(
            async () => (await browser.getUrl()).includes(substring),
            {
                timeout,
                interval: 250,
                timeoutMsg: `URL did not contain "${substring}"`
            }
        )
    }

    async firstDisplayed(selector, timeout = env.timeouts.wait) {
        let match
        await browser.waitUntil(async () => {
            const elements = await $$(selector)
            for (const element of elements) {
                if (await element.isDisplayed()) {
                    match = element
                    return true
                }
            }
            return false
        }, {
            timeout,
            interval: 250,
            timeoutMsg: `No visible element matched "${selector}"`
        })
        return match
    }
}

module.exports = BasePage
