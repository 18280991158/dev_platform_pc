import request from '@/utils/request'

export function list() {
  return request({
    url: '/menuComponent/list',
    method: 'get'
  })
}
