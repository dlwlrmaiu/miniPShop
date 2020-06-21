// pages/user/index.js
Page({
  data: {
    userinfo: {},
    // 被收藏的商品的数量
    collectNums: 0
  },
  onShow() {
    const userinfo = wx.getStorageSync('userinfo')
    let collect = wx.getStorageSync('collect') || []
    let collectNums = collect.length
    this.setData({
      userinfo,
      collectNums
    })
  }
})