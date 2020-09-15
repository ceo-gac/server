// 生成数字字母编号
function genCode(number) {
    const pre = Math.floor(number / 100000)
    const alp = genAlphaByNumber(pre)
    return alp + (Array(5).join("0") + (number - pre * 100000)).slice(-5)
}

function genAlphaByNumber(number) {
    if (number <= 26) return 'A' + String.fromCharCode(number + 97).toUpperCase()
    const first = genAlphaByNumber(number - 26)
    return first + 'Z'
}

function getNumberByAlpha(alpha) {
    return alpha.charCodeAt() - 97
}

// 生成四位验证码
function genVerifyCode() {
    return Math.random().toString().slice(-4)
}

module.exports = { genCode, genVerifyCode }