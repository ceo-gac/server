const fs = require('fs')
const gm = require('gm')
const config = require('../config')

function generate(info) {
    gm(config.template.front)
        .font(config.template.font)
        .drawText(300,225, "啊")
        .fontSize(40)
        .resize(800, 600)
        .write('./a.jpg', err => {
            if (err) console.error(err)
        })
}

module.exports = { generate }