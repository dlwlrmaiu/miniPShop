import { login } from '../../utils/asyncWx.js'
import { fetchToken } from '../../api/token.js'
Page({
  // 获取用户信息
  async handleGetUserInfo(e) {
    try {
      // 获取用户信息
      const {encryptedData, rawData, signature,iv } = e.detail
      // 获取小程序登录成功后的code值
      const {code} = await login()
      // 处理参数
      const params = { encryptedData, rawData, signature, iv, code }
      // 发送请求,获取token
      const { token } = await fetchToken(params)
      // token保存在缓存中
      wx.setStorageSync('token', token)
      // 并且返回上一页
      wx.navigateBack({
        delta: 1
      })
    } catch (error) {
      console.log(error)
      // 这里因个人appid获取不到token直接跳转上一页
      wx.navigateBack({
        delta: 1
      })
    }
  }
})