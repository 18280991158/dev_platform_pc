import request from '@/utils/request'
import qs from 'qs'

export function list(data) {
  return request({
    url: '/organization/list',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function save(data) {
  return request({
    url: '/organization/save',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function del(query) {
  return request({
    url: '/organization/delete',
    method: 'get',
    params: query
  })
}

export function isExist(query) {
  return request({
    url: '/organization/isExist',
    method: 'get',
    params: query
  })
}

export function listOrganizationByAccount(query) {
  return request({
    url: '/organization/listOrganizationByAccount',
    method: 'get',
    params: query
  })
}
