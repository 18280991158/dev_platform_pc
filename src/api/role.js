import request from '@/utils/request'
import qs from 'qs'

export function list() {
  return request({
    url: '/role/list',
    method: 'get'
  })
}

export function save(data) {
  return request({
    url: '/role/save',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function del(query) {
  return request({
    url: '/role/delete',
    method: 'get',
    params: query
  })
}

export function isExist(query) {
  return request({
    url: '/role/isExist',
    method: 'get',
    params: query
  })
}

