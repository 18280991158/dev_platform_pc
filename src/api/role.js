import request from '@/utils/request'

export function list() {
  return request({
    url: '/role/list',
    method: 'get'
  })
}
