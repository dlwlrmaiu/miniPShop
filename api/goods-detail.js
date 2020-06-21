import { request } from './../request/request.js'

export function fetchGoodsDetail(data) {
  return request({
    url: 'goods/detail',
    data
  })
}