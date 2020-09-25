const MongoClient = require('mongodb').MongoClient
const config = require('../config')
let _connection
let _db

// 连接数据库
function connect () {
    return new Promise( resolve => {
        if (_connection) return resolve(_connection)
        MongoClient.connect(config.db.url + config.db.name, { useNewUrlParser: true, useUnifiedTopology: true},async (err, client) => {
            if (err) throw err
            console.log('connected to mongodb')
            _connection = client
            _db = _connection.db(config.db.name)
            if (await needSetup()) await init()
        })
    })

}

// 是否首次安装
async function needSetup() {
    await connect()
    return new Promise(resolve => {
        _db.collection('admin').find({}).toArray((err, res) => {
            if (err) throw err
            resolve(!res.length)
        })
    })
}

// 初始化数据库
function init() {
    return new Promise(resolve => {
        console.log('initializing database...')
        _db.createCollection('pku', () => {
            _db.createCollection('jj', () => {
                _db.createCollection('cug', () => {
                    _db.createCollection('ng', () => {
                        _db.createCollection('admin', () => {
                            _db.collection('admin').insertOne({account: {username: config.admin.username , password: config.admin.password}}).then(() => {
                                console.log('finish')
                                resolve()
                            })
                        })
                    })
                })
            })
        })
    })
}

// 关闭连接
function closeConnection() {
    _connection.close()
}

/**
 * 查询证书
 * @param id    编号
 * @param type  平台
 * @param index 当前页
 * @param size  每页数据量
 * @param code  验证码
 * @param noview 是否不记录查看次数
 */
function query(id, type, index, size, code, noview) {
    return new Promise( resolve => {
        index = parseInt(index) || 0
        size = parseInt(size) || 1
        const _data = {}
        if (id) {
            id = id.toUpperCase()
            _db.collection(type).find({id}).toArray((err, doc) => {
                if (err) throw err
                console.log("code " + code && doc[0].verifyCode != code)
                if (code && doc[0].verifyCode != code) return resolve({})
                if (noview) {
                    _data.data = doc
                    resolve(_data)
                    return
                }
                _db.collection(type).updateOne({id},
                    {$set: {view: doc[0].view ? doc[0].view + 1 : 1}},(err, res) => {
                        if (err) console.log(err)
                        _data.data = doc
                        resolve(_data)
                    })
            })
            return
        }
        const data = _db.collection(type).find()
        data.skip(index * size).limit(size).toArray(async (err, doc) => {
            if (err) throw err
            _data.count = await data.count()
            _data.data = doc
            resolve(_data)
        })
    })
}

module.exports = {
    connect, init, db: () => _db, connection: () => _connection, closeConnection, query
}
