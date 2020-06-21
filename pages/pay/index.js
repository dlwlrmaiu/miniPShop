/*
1. 页面加载的时候
  1. 从缓存中获取购物车数据 渲染到页面中
  2. 这些数据 checked = true
2. 微信支付(前端大概不完整)
  1. 哪些人 哪些账号可以实现微信支付
    1. 企业账号 
    2. 企业账号的小程序后台中 必须给开发者添加上白名单
      1. 一个appid 可以同时绑定多个开发者(个人微信)
      2. 这些开发者就可以公用这个appid和它的开发权限
3. 
   创建订单 获取订单编号 <-- 先获取用户登录的token <-- 需要执行小程序获取用户信息和登录获取相关参数
4. 点击支付按钮
  1. 先判断缓存有没有token
  2. 没有 跳转到授权页面 进行获取token
  3. 有token 发送请求创建订单
  4. 创建订单 获取订单编号
  5. 已经完成了微信支付
  6. 手动删除缓存中已经被选中了的商品
  7. 删除后的购物车数据重新填充回缓存中  
  8. 再跳转页面
*/
import { fecthAddOrder, fecthOrderPay, fecthOrderState } from '../../api/order.js'
import { requestPayment, showToast } from '../../utils/asyncWx.js'
Page({
  data: {
    address: {},
    cart: [],
    totalPrice: 0,
    totalNum: 0
  },
  async handleOrderPay() {
    try {
      let token = wx.getStorageSync('token')
      if(!token) {
        wx.navigateTo({
          url: '/pages/auth/index'
        })
        return
      }
      // 创建订单
      // 准备请求头参数
      const header = { Authorization: token }
      // 总价格
      const order_price = this.data.totalPrice
      // 地址
      const consignee_addr = this.data.address.all
      // 商品
      let goods = []
      this.data.cart.forEach( v => goods.push({
        goods_id: v.goods_id,
        goods_number: v.num,
        goods_price: v.goods_price
      }))
      const orderParams = { order_price, consignee_addr, goods }
      // 发送请求 创建订单
      const { order_number } = await fecthAddOrder(orderParams, header)
      // 获取预支付的接口获取参数
      const { pay } = await fecthOrderPay({ order_number }, header)
      // 发起微信支付
      await requestPayment(pay)
      // 查询后台订单支付状态
      const res = await fecthOrderState({order_number}, header)
      await showToast('支付成功')
      // 手动删除缓存中 已经支付了的商品
      let newCart = wx.getStorageSync('cart')
      newCart = newCart.filter(v => !v.checked)
      wx.setStorageSync('cart', newCart)
      // 支付成功 跳转到订单页面
      wx.navigateTo({
        url: '/pages/order/index'
      })
    } catch (error) {
      console.log(error)
      await showToast('支付失败')
    }
  },
  onShow() {
    // 获取缓存中的地址数据
    let address = wx.getStorageSync('address')
    // 获取缓存中的购物车数据
    let cart = wx.getStorageSync('cart') || []
    // 获取过滤后的购物车数组
    cart = cart.filter(v => v.checked)
    this.setData({
      address
    })
    // 总价格 总数量
    let totalPrice = 0
    let totalNum = 0
    cart.forEach(v => {
      totalPrice += v.goods_price * v.num
      totalNum += v.num
    })
    // 给data赋值
    this.setData({
      cart,
      totalPrice,
      totalNum
    })
  }
})