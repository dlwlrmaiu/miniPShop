import { fetchBanner, fetchCategoryList, fetchFloorList } from '../../api/index.js'
Page({
  data: {
    swiperList: [],
    categoryList: [],
    floorList: []
  },
  //options(Object)
  // 页面开始加载就会触发
  onLoad: async function(options) {
    //1. 发送异步请求获取轮播图数据
    // wx.request({
    //   url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata',
    //   success: (result)=>{
    //     this.setData({
    //       swiperList: result.data.message
    //     })
    //   }
    // });
    this.getSwiperList()
    this.getCategoryList()
    this.getFloorList()
  },
  // 获取轮播图数据
  async getSwiperList() {
    const res = await fetchBanner()
    res.forEach(v => {
      v.navigator_url = v.navigator_url.replace(/main/, 'index')
      v.navigator_url = v.navigator_url.replace(/_/, '-')
    })
    this.setData({
      swiperList: res
    })
  },
  // 获取导航分类数据
  async getCategoryList() {
    const res = await fetchCategoryList()
    this.setData({
      categoryList: res
    })
  },
  // 获取楼层数据
  async getFloorList() {
    const res = await fetchFloorList()
    res.forEach(v => {
      v.product_list.forEach(item => {
        item.navigator_url = item.navigator_url.replace(/_list/, '-list/index')
      })
    })
    this.setData({
      floorList: res
    })
  }
});
  