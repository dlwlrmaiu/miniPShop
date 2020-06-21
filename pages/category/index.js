// pages/category/index.js
import { fecthCategoriesList } from '../../api/category.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 左侧的菜单数据
    leftMenuList: [],
    // 右侧的商品数据
    rightContent: [],
    // 被点击的左侧的菜单
    currentIndex: 0,
    // 右侧内容的滚动条距离顶部的距离
    scrollTop: 0
  },
  // 总数据
  categoriesList: [],
  handleTap(e) {
    // 获取索引
    let { index } = e.currentTarget.dataset
    // 重新设置 右侧内容scroll-view标签距离顶部的距离
    this.setData({
      currentIndex: index,
      rightContent: this.categoriesList[index].children,
      scrollTop: 0
    })
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 请求数据之前判断本地缓存过期没有,过期重新发送请求
    const Cates = wx.getStorageSync("cates");
    if(!Cates) {
      this.getCategoriesList()
    } else {
      if(Date.now() - Cates.time > 1000 * 60 * 5) {
        // 本地数据过期
        this.getCategoriesList()
      } else {
        // 本地数据没有过期
        this.categoriesList = Cates.data
        // 处理左侧的菜单数据
        let leftMenuList = this.categoriesList.map( item => item.cat_name )
        // 处理右侧的商品数据
        let rightContent = this.categoriesList[0].children
        this.setData({
          leftMenuList,
          rightContent
        })
      }
    }
    
  },
  // 获取分类也所有分类数据
  async getCategoriesList() {
    // 发送请求
    const res = await fecthCategoriesList()
    // 赋值
    this.categoriesList = res
    // 设置本地存储
    // web localStorage.setItem("key", "value") localStorage.getItem("key")
    // 小程序 wx.setStorageSync("key", "value") wx.getStorageSync("key")
    wx.setStorageSync("cates", { time: Date.now(), data: this.categoriesList })
    // 处理左侧的菜单数据
    let leftMenuList = this.categoriesList.map( item => item.cat_name)
    // 处理右侧的商品数据
    let rightContent = this.categoriesList[0].children
    this.setData({
      leftMenuList,
      rightContent
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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