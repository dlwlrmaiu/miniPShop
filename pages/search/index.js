/* 
  1. 输入框 值改变事件 input事件
    1. 获取到输入框中的值
    2. 合法性判断 
    3. 检验通过 把收入框的值发送到后台
    4. 返回的数据打印到页面上
  2. 防抖(防止抖动):定时器 节流
    0. 防抖 一般 输入框中 防止重复输入 重复发送请求
    1. 节流 一般是用做页面的下拉和上拉
    1. 定义全局定时器id
*/
import { fetchSearchList } from '../../api/search.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods: [],
    // 取消按钮 是否显示
    isFoucs: false,
    // 输入框的值
    inpValue: ''
  },
  TimeId: -1,
  // 点击取消
  handleCancel() {
    this.setData({
      inpValue: '',
      isFoucs: false,
      goods: []
    })
  },
  // 输入框的值发生改变 就会触发的事件
  handleInput(e) {
    // 获取输入框的值
    const { value } = e.detail
    // 监测合法性
    if(!value.trim()) {
      this.setData({
        goods: [],
        isFoucs: false
      })
      // 值把不合法
      return
    }
    this.setData({
      isFoucs: true
    })
    // 准备发送请求获取数据
    // 清除定时器
    clearTimeout(this.TimeId)
    this.TimeId = setTimeout(() => {
      this.getSearchList({query: value})
    }, 1000)
  },
  async getSearchList(query) {
    const res = await fetchSearchList(query) || []
    this.setData({
      goods: res
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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