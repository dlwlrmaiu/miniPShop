/*
  1. 获取用户的收货地址
   1. 绑定点击事件
   2. 调用小程序内置api 获取用户的收货地址 wx.chooseAddress

   2. 获取用户对小程序所授予获取地址的权限状态scope
    1. 假设用户点击获取收获地址的提示框 点击的是确定
      scope 值 true authSetting scope.address true
    2. 假设用户点击获取收获地址的提示框 点击的是取消
      scope 值 false authSetting scope.address false
      1. 引导用户自己代开 授权设置页面(wx.openSetting) 当用户重新给与 获取地址权限的时候
      2. 获取收货地址
    3. 假设用户没有点击获取收获地址的提示框
      scope.address 值 undefined
    1.3 满足都能直接调用收获地址 2需要给scope.address重新赋值为true

    4. 把获取到的地址 存入到本地存储中
  2. 页面加载完毕
    0. onLoad onShow
    1. 获取本地存储中的地址数据
    2. 把数据设置给data中的一个变量
  3. onShow 
    0. 回到了商品详情页面 第一次添加商品的时候 手动添加了属性
      1. num = 1
      2. checked = true
    1. 获取缓存中的数据
    2. 把购物车的数据填充到data中
  4. 全选的实现 数据的展示
    1. onShow 获取缓存中的购物车数据
    2. 根据购物车中的商品数据 所有的商品都被选中 checked = true 全选就被选中
  5. 总价格和总数量
    1. 都需要商品被选中 我们才能他来计算
    2. 获取购物车数组
    3. 遍历
    4. 判断商品是否被选中
    5. 总价格 += 商品的单价 * 商品的数量
    6. 总数量 += 商品的数量
    7. 把计算后的价格和数量 设置会data中即可  
  6. 商品的选中功能
    1. 绑定change事件
    2. 获取到被修改的商品对象
    3. 商品对象的选中状态 取反
    4. 重新填充回data中和缓存中
    5. 重新计算全选 总价格 总数量等等
  7. 全选和反选
    1. 全选复选框绑定事件 change
    2. 获取data中的全选变量 allChecked
    3. 直接取反 allChecked = !allChecked
    4. 遍历购物车数组 让里面商品的选中状态跟着allChecked改变而改变
    5. 把购物车数组和选中状态重新设置回data 把购物车重新设置回缓存中
  8. 商品数量的编辑功能
    1. "+" "-" 绑定同一个点击事件 自定义属性 
      1. "+" "+1"
      2. "-" "-1"
    2. 传递被点击的商品id goods_id
    3. 获取data中的购物车数组 来获取需要被修改的商品对象
    4. 当购物车数量 =1 同时 用户点击-按钮
      弹窗提示 wx.showModal 询问用户是否要删除
        1. 确定 直接执行删除
        2. 取消 什么都不做
    5. 直接修改商品对象的数量num
    6. 把cart数组重新设置回缓存中和data中 this.cartSet
*/
import { getSetting, chooseAddress, openSetting, showModal } from '../../utils/asyncWx.js'
Page({
  data: {
    address: {},
    cart: [],
    allChecked: false,
    totalPrice: 0,
    totalNum: 0
  },
  // 点击结算
  async handlePay() {
    if(this.data.totalNum === 0) {
      await showModal({content: '您还没有选购商品哦'})
      return
    } else if(!this.data.address.userName) {
      await showModal({content: '您还没有选择收货地址哦'})
      return
    }
    wx.navigateTo({
      url: '/pages/pay/index'
    })
  },
  // 商品数量的编辑功能
  async handleItemNumEdit(e) {
    // 获取传递过来的商品id和操作符
    const { id, operation } = e.currentTarget.dataset
    // 获取购物车数据
    const { cart } = this.data
    // 获取该商品在购物车数组中的下标
    const index = cart.findIndex( v => v.goods_id === id)
    // 判断是否要执行删除
    if(cart[index].num === 1 && operation === -1) {
      // 弹窗提示
      const res = await showModal({content: '您是否要删除该商品?'})
      if(res.confirm) {
        cart.splice(index, 1)
        this.setCart(cart)
      }
    } else {
      // 通过该操作符直接修改该商品在购物车数组中的num
      cart[index].num += operation
      // 重新设置回data和缓存中
      this.setCart(cart)
    }
  },
  // 商品的全选功能
  handleItemAllChecked() {
    let { allChecked, cart } = this.data
    allChecked = !allChecked
    cart.forEach(v => v.checked = allChecked )
    this.setCart(cart)
  },
  // 商品的选中事件
  handleItemChange(e) {
    // 获取被修改的商品的id
    let goodsId = e.currentTarget.dataset.id
    // 获取购物车数组
    let { cart } = this.data
    // 找到被修改的商品对象
    let index = cart.findIndex( v => v.goods_id === goodsId)
    // 选中状态取反
    cart[index].checked = !cart[index].checked
    // 把数据重新设置回data和缓存中
    this.setCart(cart)
    
  },
  onShow() {
    // 获取缓存中的地址数据
    let address = wx.getStorageSync('address')
    // 获取缓存中的购物车数据
    let cart = wx.getStorageSync('cart') || []
    // 计算全选
    // 空数组 调用every 返回值也是true
    //const allChecked = cart.length?cart.every(v => v.checked) : false
    this.setData({
      address
    })
    this.setCart(cart)
  },
  // 点击收获地址
  async handleChooseAddress() {
    try {
      // 获取用户对小程序所授予地址的权限状态
      const res = await getSetting()
      let scopeAddress = res.authSetting['scope.address']
      // 判断权限状态
      if(scopeAddress === false) {
        await openSetting()
      }
      // 调用获取收获地址的api
      const address = await chooseAddress()
      address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo
      // 存入到缓存中
      wx.setStorageSync('address', address)
    } catch (error) {
      console.log(error)
    }
  },
  // 设置购物车状态 同时 重新计算 底部工具栏的数据 全选 总价格 购买的数量
  setCart(cart) { 
    let allChecked = true
    // 总价格 总数量
    let totalPrice = 0
    let totalNum = 0
    cart.forEach(v => {
      if(v.checked) {
        totalPrice += v.goods_price * v.num
        totalNum += v.num
      } else {
        allChecked = false
      }
    })
    // 判断数组是否为空
    allChecked = cart.length != 0 ? allChecked : false
    // 给data赋值
    this.setData({
      cart,
      allChecked,
      totalPrice,
      totalNum
    })
    wx.setStorageSync('cart', cart)
  }
})