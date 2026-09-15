module.exports = {
    baseUrl: process.env.BASE_URL || 'https://sauce-demo.myshopify.com/',
    tags: process.env.TAGS || '',
    ci: Boolean(process.env.CI || process.env.JENKINS_URL),
    headless: process.env.HEADLESS === 'true' || Boolean(process.env.CI || process.env.JENKINS_URL),
    timeouts: {
        wait: 15000,
        step: 120000,
        shipping: 20000,
        confirmation: 45000
    }
}

