/**
 * promise 形式 getSetting
 */
export const getSetting = () => {
  return new Promise( (resolve, reject) => {
    wx.getSetting({
      success: (result)=>{
        resolve(result)
      },
      fail: (error)=>{
        reject(error)
      }
    })
  })  
}
/**
 * promise 形式 chooseAddress
 */
export const chooseAddress = () => {
  return new Promise( (resolve, reject) => {
    wx.chooseAddress({
      success: (result)=>{
        resolve(result)
      },
      fail: (error)=>{
        reject(error)
      }
    })
  })  
}
/**
 * promise 形式 openSetting
 */
export const openSetting = () => {
  return new Promise( (resolve, reject) => {
    wx.openSetting({
      success: (result)=>{
        resolve(result)
      },
      fail: (error)=>{
        reject(error)
      }
    })
  })  
}

/**
 * promise 形式 showModal
 * @param {content} param0 参数
 */
export const showModal = ({content}) => {
  return new Promise( (resolve, reject) => {
    wx.showModal({
      title: '提示',
      content,
      success: (res) => {
        resolve(res)
      },
      fail: (error) => {
        reject(error)
      }
    })
  })  
}
/**
 * promise 形式 login
 */
export const login = () => {
  return new Promise( (resolve, reject) => {
    wx.login({
      timeout: 10000,
      success: (res) => {
        resolve(res)
      },
      fail: (error) => {
        reject(error)
      }
    })
  })  
}
/**
 * promise 形式 小程序的微信支付
 * @param {object} pay 支付所必要的参数 
 */
export const requestPayment = (pay) => {
  return new Promise( (resolve, reject) => {
    wx.requestPayment({
      ...pay,
      success: (result)=>{
        resolve(result)
      },
      fail: (error)=>{
        reject(error)
      }
    })
  })  
}
/**
 * promise 形式 showToast
 * @param {string} title 弹窗提示信息
 */
export const showToast = (title) => {
  return new Promise((resolve, reject) => {
    wx.showToast({
      title,
      icon: 'none',
      mask: true,
      success: (result)=>{
        resolve(result)
      },
      fail: (error)=>{
        reject(error)
      }
    })
  })
}