const fs = require('fs')
const path = require('path')
const env = require('./env')

const chromeArgs = ['--window-size=1280,900', '--disable-infobars']
if (env.headless) {
    chromeArgs.push('--headless=new')
}
if (env.ci) {
    chromeArgs.push('--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu')
}

const allureResultsDir = path.join(process.cwd(), 'allure-results')

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
            disableWebdriverStepsReporting: true,
            disableWebdriverScreenshotsReporting: false,
            useCucumberStepReporter: true,
            addConsoleLogs: true,
            reportedEnvironmentVars: {
                FRAMEWORK: 'WebdriverIO + Cucumber',
                NODE_VERSION: process.version,
                BROWSER: 'chrome',
                BASE_URL: env.baseUrl,
                HEADLESS: String(env.headless)
            }
        }]
    ],
    onPrepare: function () {
        fs.rmSync(allureResultsDir, { recursive: true, force: true })
        fs.mkdirSync(allureResultsDir, { recursive: true })
    }
}
