module.exports = {
    baseUrl: process.env.BASE_URL || 'https://sauce-demo.myshopify.com/',
    tags: process.env.TAGS || '',
    headless: process.env.HEADLESS === 'true',
    timeouts: {
        wait: 15000,
        step: 120000,
        shipping: 20000,
        confirmation: 45000
    }
}
