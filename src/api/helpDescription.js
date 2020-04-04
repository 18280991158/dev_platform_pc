import request from '@/utils/request'
import qs from 'qs'

export function list(query) {
  return request({
    url: '/helpDescription/list',
    method: 'get',
    params: query
  })
}

export function save(data) {
  return request({
    url: '/helpDescription/save',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function del(query) {
  return request({
    url: '/helpDescription/delete',
    method: 'get',
    params: query
  })
}

export function listParents(query) {
  return request({
    url: '/helpDescription/listParents',
    method: 'get',
    params: query
  })
}

