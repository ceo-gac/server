const db = require('./index').db
const { genCode, genVerifyCode } = require('../utils/number')
const name = 'pku'

function add (data) {
    return new Promise(async (resolve, reject) => {
        data.id = genCode((await db().collection(name).find({}).count()) + 1)
        data.verifyCode = genVerifyCode()
        db().collection(name).insertOne(data, (err, res) => {
            if (err) reject(err)
            resolve(data.id)
        })
    })
}

module.exports = { add }