import { request } from '../request/request.js'
export function fecthCategoriesList() {
  return request({
    url: 'categories'
  })
}