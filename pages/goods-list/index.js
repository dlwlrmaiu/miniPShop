// pages/goods-list/index.js
import { fetchGoodsList } from '../../api/goods-list.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 传递给子组件的数据
    tabs: [
      {
        id: 0,
        value: '综合',
        isActive: true
      },
      {
        id: 1,
        value: '销量',
        isActive: false
      },
      {
        id: 2,
        value: '价格',
        isActive: false
      }
    ],
    goodsList: []
  },
  // 总页数
  totalPages: 1,
  // 接口需要的数据
  QueryParams: {
    query: '',
    cid: '',
    pagenum: 1,
    pagesize: 10,
  },
  // 标题点击事件 从子组件传递过来
  handleTabsItemChange(e) {
    // 1. 获取被点击的索引
    const { index } = e.detail
    // 2. 修改原数组
    let { tabs } = this.data
    tabs.forEach((v, i) => {
      return i === index ?  v.isActive = true : v.isActive = false
    })
    this.setData({
      tabs
    })
  },
  // 获取商品列表数据
  async getGoodsList() {
    const res = await fetchGoodsList(this.QueryParams)
    this.totalPages = Math.ceil( res.total / this.QueryParams.pagesize )
    this.setData({
      // 页面上拉触底时重新获取数据时需要拼接,而不是赋值
      goodsList: [...this.data.goodsList, ...res.goods]
    })
    // 关闭下拉刷新的窗口
    wx.stopPullDownRefresh()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.QueryParams.cid = options.cid || ''
    this.QueryParams.query = options.query || ''
    this.getGoodsList()
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    // 重置数组
    this.setData({
      goodsList: []
    })
    // 重置页码
    this.QueryParams.pagenum = 1
    // 重新发送请求
    this.getGoodsList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if(this.QueryParams.pagenum >= this.totalPages) {
      // 没有下一页数据了
      wx.showToast({
        title: '我是有底线的~'
      })
    } else {
      this.QueryParams.pagenum++
      this.getGoodsList()
    }
  }
})