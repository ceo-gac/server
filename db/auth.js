const {db} = require('./index')

function checkLogin(username, password) {
    return new Promise(async (resolve, reject) => {
        db().collection('admin').find({account: { $exists: 1}}).toArray((err, docs) => {
            if (err) reject(err)
            if (!docs.length) resolve(0)
            if (docs[0].account.username === username && docs[0].account.password === password) {
                resolve(1)
            } else {
                resolve(2)
            }
        })
    })
}

module.exports = {
    checkLogin
}