import request from '@/utils/request'

export function list() {
  return request({
    url: '/menuIcon/list',
    method: 'get'
  })
}
