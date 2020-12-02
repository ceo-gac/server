const fs = require('fs')
const gm = require('gm').subClass({ imageMagick: false })
const QRCode = require('qrcode')
const config = require('../config')


function generatePku(info) {
    return new Promise(resolve => {
        info = info.data[0]
        const url = `http://bjdxgac.com/query?id=${info.id}&code=${info.verifyCode}`
        const qrPath = `public/pic/${info.id}.png`
        const target = `public/pic/${info.id.slice(0,2)}/license_${info.id.slice(2)}.jpg`
        // 生成查询二维码
        QRCode.toFile(qrPath, url, {margin: 0, width: 200}, err => {
            if (err) throw err
            // 合成证书
            gm(config.template.front)
                .noProfile()
                .draw('image over 1200, 160 200,200 ' + qrPath)
                .draw('image over 820,400 550,550 public/pic/'+info.id.slice(0,2)+'/'+info.id.slice(2)+'.jpeg')
                .font(config.template.font, 40)
                .fill('#999999')
                .stroke('#999999')
                .drawText(260,200,info.result)
                .drawText(260,285,info.appearance)
                .drawText(260,370,info.weight)
                .drawText(260,465,info.mag)
                .drawText(260,550,"/")
                .drawText(260,635,"/")
                .drawText(260,790,info.appraiser)
                .drawText(260,875,info.reviewer)
                .drawText(940,200,info.id)
                .drawText(940,285,info.verifyCode)
                .setFormat('JPEG')
                .quality(99)
                .strip()
                .write(target, err => {
                    if (err) console.error(err)
                    fs.unlinkSync(qrPath)
                    resolve(target)
                })
        })
    })
}

module.exports = { generatePku }
