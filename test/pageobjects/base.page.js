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
        await element.scrollIntoView()
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
                timeoutMsg: `URL did not contain "${substring}"`
            }
        )
    }

    async firstDisplayed(selector, timeout = env.timeouts.wait) {
        await browser.waitUntil(async () => {
            const elements = await $$(selector)
            for (const element of elements) {
                if (await element.isDisplayed()) {
                    return true
                }
            }
            return false
        }, {
            timeout,
            timeoutMsg: `No visible element matched "${selector}"`
        })

        const elements = await $$(selector)
        for (const element of elements) {
            if (await element.isDisplayed()) {
                return element
            }
        }

        throw new Error(`No visible element matched "${selector}"`)
    }
}

module.exports = BasePage
