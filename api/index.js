import { request } from '../request/request.js'

export function fetchBanner() {
  return request({
    url: 'home/swiperdata'
  })
}

export function fetchCategoryList() {
  return request({
    url: 'home/catitems'
  })
} 

export function fetchFloorList() {
  return request({
    url: 'home/floordata'
  })
}
