const fs = require('fs')
const path = require('path')

function loadData(fileName) {
    const filePath = path.join(process.cwd(), 'test/testData', fileName)
    return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

module.exports = { loadData }
