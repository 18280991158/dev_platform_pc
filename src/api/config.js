import request from '@/utils/request'

export function getFileServer() {
  return request({
    url: '/config/getFileServer',
    method: 'get'
  })
}
