const { config: shared } = require('./config/wdio.shared.conf')
const env = require('./config/env')

exports.config = {
    ...shared,
    specs: ['./test/features/**/*.feature'],
    framework: 'cucumber',
    cucumberOpts: {
        require: ['./test/step-definitions/**/*.js'],
        timeout: env.timeouts.step,
        ignoreUndefinedDefinitions: false,
        failAmbiguousDefinitions: true,
        tags: env.tags
    },
    afterStep: async function (_step, _scenario, { error, passed }) {
        if (error || passed === false) {
            await browser.takeScreenshot()
        }
    }
}
