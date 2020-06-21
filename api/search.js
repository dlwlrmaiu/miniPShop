import { request } from '../request/request.js'

export const fetchSearchList = (data) => {
  return request({
    url: 'goods/qsearch',
    data
  })
}