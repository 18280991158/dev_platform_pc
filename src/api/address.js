import request from '@/utils/request'

export function list() {
  return request({
    url: '/address/list',
    method: 'get'
  })
}

