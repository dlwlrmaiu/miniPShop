/* 
  1. 点击+触发tap点击事件
    1. 获取小程序内置的选择图片的api
    2. 获取到图片路径的数组
    3. 把图片路径存到data变量中
    4. 页面就可以根据图片数组进行循环显示 自定义组件
  2. 点击 自定义图片组件
    1. 获取被点击的元素的索引
    2. 获取data中的图片数组
    3. 根据索引数组中删除对应的元素
    4. 把数组重新设置会data中
  3. 点击提交
    1. 获取文本域内容 类似 输入框的获取
      1. data中定义变量 表示 输入框中的内容
      2. 文本域 绑定输入事件 事件触发的时候 把输入框的值 存入到变量中
    2. 对这些内容 合法性验证
    3. 验证通过 用户选择的图片 上传到专门的图片的服务器 返回图片外网的链接
      1. 遍历图片数组
      2. 挨个上传
      3. 自己再维护图片数组 存放图片上传后的外网的链接
    4. 文本域和外网的图片的路径 一起提交到服务器 前端的模拟 不会发送请求到后台
    5. 清空当前页面
    6. 返回上一页
*/
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 传递给子组件的数据
    tabs: [
      {
        id: 0,
        value: '体验问题',
        isActive: true
      },
      {
        id: 1,
        value: '商品、商家投诉',
        isActive: false
      }
    ],
    chooseImgs: [],
    // 文本域的内容
    textVal: ''
  },
  // 外网的图片的路径数组
  upLoadImgs: [],
  // 提交按钮的点击事件
  handleFormSubmit() {
    const { textVal, chooseImgs } = this.data
    // 合法性的验证
    if(!textVal.trim()) {
      // 不合法
      wx.showToast({
        title: '输入不合法',
        icon: 'none',
        mask: true
      })
      return
    }
    // 3. 准备上传图片到专门的服务器
    // 上传文件的api不支持多个文件同时上传的 遍历数组 挨个上传
    // 显示正在等待的图片
    wx.showLoading({
      title: '正在上传中',
      mask: true
    })
    // 判断有没有上传的图片数组
    if(chooseImage.length !== 0) {
      chooseImgs.forEach(v => {
        wx.uploadFile({
          // 图片要上传到哪里
          url: 'https://img.coolcr.cn/index/api.html',
          // 被上传的图片的路径
          filePath: v,
          // 上传的文件的名称 后台来获取文件 file
          name: 'image',
          // 上传图片的额外的文本信息
          formData: {},
          success: (result)=>{
            console.log(result.data)
            let url = JSON.parse(result.data)
            this.upLoadImgs.push(url)
            // 所有图片上传完毕菜触发
            if(i === chooseImage.length-1) {
              wx.hideLoading()
              console.log("把文本的内容和外网的图片数组 提交到后台中")
              // 提交成功
              // 重置页面
              this.setData({
                textVal: '',
                chooseImage: []
              })
              // 并返回上一页面
              wx.navigateBack({
                delta: 1
              })
            }
          }
        })
      })
    } else {
      wx.hideLoading()
      console.log('知识提交了文本')
      wx.navigateBack({
        delta: 1
      })
    }
  },
  // 文本域的输入事件
  handleTextInput(e) {
    this.setData({
      textVal: e.detail.value
    })
  },
  // 点击删除上传的按钮
  handleRemoveImg(e) {
    // 获取被点击图片的索引
    const { index } = e.currentTarget.dataset
    let { chooseImgs } = this.data
    chooseImgs.splice(index, 1)
    this.setData({
      chooseImgs
    })
  },
  //点击上传图片按钮
  handleChooseImg() {
    //获取小程序内置的选择图片的api
    wx.chooseImage({
      // 同时选中图片数量
      count: 9,
      // 格式 原格式 压缩后的格式
      sizeType: ['original','compressed'],
      // 图片的来源 相册 照相机
      sourceType: ['album','camera'],
      success: (result)=>{
        this.setData({
          // 图片数组 拼接
          chooseImgs: [...this.data.chooseImgs,...result.tempFilePaths]
        })
      },
      fail: ()=>{},
      complete: ()=>{}
    });
  },
  handleTabsItemChange(e) {
    const { index } = e.detail
    let { tabs } = this.data
    tabs.forEach((v,i) => {
      v.id === index ? v.isActive = true : v.isActive = false
    })
    this.setData({
      tabs
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