const env = require('./env')

const chromeArgs = ['--window-size=1280,900', '--disable-infobars']
if (env.headless) {
    chromeArgs.push('--headless=new')
}

exports.config = {
    runner: 'local',
    maxInstances: 1,
    baseUrl: env.baseUrl,
    capabilities: [{
        browserName: 'chrome',
        'goog:chromeOptions': {
            args: chromeArgs,
            prefs: {
                credentials_enable_service: false,
                'profile.password_manager_enabled': false
            }
        }
    }],
    logLevel: process.env.LOG_LEVEL || 'warn',
    bail: 0,
    waitforTimeout: env.timeouts.wait,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,
    reporters: [
        'spec',
        ['allure', {
            outputDir: 'allure-results',
            disableWebdriverScreenshotsReporting: false,
            useCucumberStepReporter: true,
            addConsoleLogs: true
        }]
    ]
}
