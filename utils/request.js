// 同时发送异步代码的次数
let ajaxTimes = 0
export const request = (params) => {
  ajaxTimes++
  // 显示加载中 效果
  wx.showLoading({
    title: '加载中',
    mask: true
  })
  // 定义公共url
  const baseUrl = 'https://api-hmugo-web.itheima.net/api/public/v1/'
  return new Promise((resolve, reject) => {
    wx.request({
      ...params,
      url: baseUrl + params.url,
      success: (result)=>{
        // 直接返回数据
        resolve(result.data.message)
      },
      fail: (error)=>{
        reject(error)
      },
      complete: () => {
        ajaxTimes--
        if(ajaxTimes ===0 ) {
          // 关闭正在等待的图标
          wx.hideLoading()
        }
      }
    })
  })
}