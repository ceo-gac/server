const router = require('koa-router')()
const auth = require('../db/auth')
const svgCaptcha = require('svg-captcha');

router.post('/login', async (ctx, next) => {
  if (ctx.request.body.captcha !== ctx.session.captcha) {
    return ctx.body = {}
  }
  const username = ctx.request.body.username
  const res = await auth.checkLogin(username, ctx.request.body.password)
  if (res === 1) {
    ctx.session.user = username
    return ctx.body = {code: 20000, data: {token: username}}
  }
  ctx.body = {}
})

router.get('/info', async (ctx, next) => {
  if (ctx.session.user === ctx.params.token) {
    return ctx.body = {code: 20000, data: {
      roles: ['admin'],
      introduction: 'I am a super administrator',
      avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
      name: 'Super Admin'}}
  }
  ctx.body = {}
})

router.post('/logout', async ctx => {
  ctx.session = null
  ctx.body = {code: 20000}
})

router.get('/captcha', async ctx => {
  const captcha = svgCaptcha.create({noise: 3,ignoreChars: '0o1i', color: true});
  ctx.session.captcha = captcha.text
  ctx.body = captcha.data
})

module.exports = router
