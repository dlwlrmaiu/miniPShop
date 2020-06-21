import { request } from '../request/request.js'

// 创建订单编号
export const fecthAddOrder = (data, header) => {
  return request({
    url: 'my/orders/create',
    method: 'POST',
    data,
    header
  })
}

// 获取支付参数
export const fecthOrderPay = (data) => {
  return request({
    url: 'my/orders/req_unifiedorder',
    method: 'POST',
    data
  })
}

// 查看订单支付状态
export const fecthOrderState = (data) => {
  return request({
    url: 'my/orders/chkOrder',
    method: 'POST',
    data
  })
}

export const fecthOrderList = (data) => {
  return request({
    url: 'my/orders/all',
    data
  })
}



