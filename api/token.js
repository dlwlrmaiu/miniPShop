import { request } from '../request/request.js'

export const fetchToken = (data) => {
  return request({
    url: 'users/wxlogin',
    method: 'POST',
    data
  })
}