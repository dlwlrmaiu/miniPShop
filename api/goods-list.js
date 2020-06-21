import { request } from '../request/request.js'

export function fetchGoodsList(data) {
  return request({
    url: `goods/search`,
    data
  })
}