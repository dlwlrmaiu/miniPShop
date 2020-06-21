/*
1. 发送请求数据
2. 点击轮播图 预览大图
  1. 给轮播图绑定点击事件
  2. 调用小程序的api previewImage
3. 点击 加入购物车
  1. 先绑定点击事件
  2. 获取缓存中的购物车数据 数组格式
  3. 先判断 当前商品是否已经存在于 购物车
  4. 已经存在 修改商品数据 执行购物车数量 ++ 重新把购物车数组 填充回缓存中
  5. 不存在于购物车的数组中 直接给购物车数组添加一个新元素 新元素带上数量属性num 重新把购物车数组填充回缓存中
  6. 弹出提示
4. 商品收藏
  1. 页面onShow的时候, 加载缓存中的商品收藏的数据
  2. 判断当前商品是不是被收藏
    1. 是 改变页面图标
    2. 不是 不用做改变
  3. 点击商品收藏按钮
    1. 判断商品是否存在于缓存数组中
    2. 已经存在 把该商品删除
    3. 没有存在 把商品添加到收藏数组中存入到缓存中
*/
import { fetchGoodsDetail } from '../../api/goods-detail.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 保存商品详情数据
    goodsDetail: {},
    isCollect: false
  },
  GoodsInfo: {},
  // 点击加入购物车
  handleCartAdd(e) {
    // 获取缓存中的购物车数组
    let cart = wx.getStorageSync('cart') || []
    // 判断 商品对象是否存在于购物车数组中
    let index = cart.findIndex(v => v.goods_id === this.GoodsInfo.goods_id)
    if(index === -1) {
      // 不存在 第一次添加
      this.GoodsInfo.num = 1
      this.GoodsInfo.checked = true
      cart.push(this.GoodsInfo)
    } else {
      // 已经存在于购物车数组中
      cart[index].num++
    }
    // 把购物车重新添加到缓存中
    wx.setStorageSync('cart', cart)
    // 弹窗提示
    wx.showToast({
      title: '加入成功',
      icon: 'success',
      // 防止用户手抖
      mask: true
    })
  },
  // 点击 商品收藏图标
  handleCollect() {
    // 获取缓存中的数组
    let collect = wx.getStorageSync('collect') || []
    this.setData({
      isCollect: !this.data.isCollect
    })
    if(this.data.isCollect) {
      collect.push(this.GoodsInfo)
      wx.showToast({
        title: '收藏成功',
        icon: 'success',
        mask: true
      })
    } else {
      let index = collect.findIndex( v => v.goods_id === this.GoodsInfo.goods_id)
      collect.splice(index, 1)
      wx.showToast({
        title: '取消收藏',
        icon: 'none',
        mask: true
      })
    }
    wx.setStorageSync('collect', collect)
  },
  // 点击轮播图 放大预览
  handlePreviewImage(e) {
    const current = e.currentTarget.dataset.url
    const urls = this.GoodsInfo.pics.map(v => v.pics_mid)
    wx.previewImage({
      // 点击的是哪张图就先开始预览该图片
      current,
      // 预览的图片数据
      urls
    })
  },
  onShow: function (options) {
    let pages =  getCurrentPages()
    let currentPage = pages[pages.length-1]
    const  { goods_id } = currentPage.options
    // 加载商品详情页面时拿到该商品的goods_id
    this.getGoodsDetail({goods_id})
    
  },
  // 获取商品详情页数据
  async getGoodsDetail(params) {
    const res = await fetchGoodsDetail(params)
    this.GoodsInfo = res
    // 获取缓存中的商品收藏的数组
    let collect = wx.getStorageSync('collect') || []
    // 判断当前商品是否被收藏
    // some 其中有一个为true,则返回true
    let isCollect = collect.some(v => v.goods_id === this.GoodsInfo.goods_id)
    this.setData({
      goodsDetail: {
        // 只保存页面需要渲染的数据
        pics: res.pics,
        goods_price: res.goods_price,
        goods_name: res.goods_name,
        // 部分机型不兼容.webp格式图片, 替换成.jpg
        goods_introduce: res.goods_introduce.replace(/\.webp/g, '.jpg')
      },
      isCollect
    })
  }

})