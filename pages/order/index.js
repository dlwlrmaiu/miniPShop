/* 
  1. 页面打开的时候 onShow
    0 onShow不同于onLoad 无法在形参上接受options参数
    0.5 判断缓存中有没有token
      1. 没有 直接跳转到授权页面
      2. 有往下进行
    1. 获取url上的参数type
    2. 根据type来决定页面标题的数组元素 哪个被激活选中
    2. 根据type去发送请求获取订单数据
    3. 渲染页面
  2. 点击不同的标题 重新发送请求获取和渲染数据
*/
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orders: [],
    // 传递给子组件的数据
    tabs: [
      {
        id: 0,
        value: '全部',
        isActive: true
      },
      {
        id: 1,
        value: '代付款',
        isActive: false
      },
      {
        id: 2,
        value: '待发货',
        isActive: false
      },
      {
        id: 3,
        value: '退款/退货',
        isActive: false
      }
    ]
  },
  // 根据标题索引来激活选中 标题数组
  changeTitleByIndex(index) {
    let { tabs } = this.data
    tabs.forEach((v,i) => {
      v.id === index ? v.isActive = true : v.isActive = false
    })
    this.setData({
      tabs
    })
  },
  handleTabsItemChange(e) {
    const { index } = e.detail
    this.changeTitleByIndex(index)
    this.getOrderList(index+1)
  },
  // 获取订单列表
  async getOrderList(type) {
    const res = await fecthOrderList({type})
    this.setData({
      orders: res.orders.map(v => ({...v, create_time_cn: (new Date(v.create_time * 1000).toLocaleString())}))
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    const token = wx.getStorageSync('token')
    if(!token) {
      wx.navigateTo({
        url: '/pages/auth/index'
      })
      return
    }
    // 1. 获取当前小程序中的页面栈-数组 长度最大是10页面
    // 2. 数组中 索引最大的页面就是当前页面
    // 获取当前页面栈
    let pages =  getCurrentPages();
    // 获取当前页面
    let currentPage = pages[pages.length-1]
    // 获取页面参数
    let { type } = currentPage.options
    // 激活选中页面标题
    this.changeTitleByIndex(type-1)
    // 发送获取订单请求
    this.getOrderList(type)
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})