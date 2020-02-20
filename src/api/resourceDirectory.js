import request from '@/utils/request'
import qs from 'qs'

export function list() {
  return request({
    url: '/resourceDirectory/list',
    method: 'get'
  })
}

export function save(data) {
  return request({
    url: '/resourceDirectory/save',
    method: 'post',
    data: qs.stringify(data)
  })
}
export function del(query) {
  return request({
    url: '/resourceDirectory/del',
    method: 'get',
    params: query
  })
}
