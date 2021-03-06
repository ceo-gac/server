const router = require('koa-router')()
const pku = require('../db/pku')
const { query, removeOne } = require('../db/index')
const multer = require('@koa/multer')
const fs = require('fs')
const { generatePku } = require('../utils/license')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const path = `public/pic/${req.headers.picid.slice(0,2)}`
        if (!fs.existsSync(path)) fs.mkdirSync(path)
        cb(null,path)
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split('/')[1];
        cb(null, `${req.headers.picid.substr(2)}.${ext}`);
    }
})

const upload = multer({storage, limits: {fileSize: 1000000}})

router.post('/add', async (ctx, next) => {
    const body = ctx.request.body
    if (!body.type) {
        ctx.body = '格式不正确'
        return
    }
    const type = body.type
    delete body.type
    let id
    switch (type) {
        case 'pku':
            id = await pku.add(body)
            break;
    }
    ctx.body = { code: 20000, id }
})

router.post('/upload', upload.single('pic'), async ctx => {
    ctx.body = {code: 20000}
})

router.get('/query', async ctx => {
    const params = ctx.request.query
    if (!(params.type === 'pku')) return ctx.body = {code: 20000, data: {message: '缺少参数或着参数不合法'}}
    const data = await query(params.id, params.type, params.index, params.size, params.code, params.noview)
    ctx.body = {code: 20000, data}
})

router.get('/remove', async ctx =>　{
    const params = ctx.request.query
    if (!params.type || !params.id ) {
        ctx.body = '格式不正确'
        return
    }
    await removeOne(params.id, params.type)
    ctx.body = {code: 20000}
})

router.get('/license', async ctx => {
    const params = ctx.request.query
    const data = await query(params.id, params.type, null, null, params.code, true)
    const path = await generatePku(data)
    ctx.set('content-type', 'image/jpeg')
    ctx.body = fs.readFileSync(path)
    fs.unlinkSync(path)
})

module.exports = router
