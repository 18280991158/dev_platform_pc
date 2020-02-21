import request from '@/utils/request'
import qs from 'qs'

export function save(data) {
  return request({
    url: '/resource/save',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function list(data) {
  return request({
    url: '/resource/listPage',
    method: 'post',
    data: qs.stringify(data)
  })
}
export function del(data) {
  return request({
    url: '/resource/delete',
    method: 'post',
    data
  })
}

export function isExist(data) {
  return request({
    url: '/resource/isExist',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function listResourceIdByRole(query) {
  return request({
    url: '/resource/listResourceIdByRole',
    method: 'get',
    params: query
  })
}
