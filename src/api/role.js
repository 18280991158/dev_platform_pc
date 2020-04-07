import request from '@/utils/request'

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
    data
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

export function saveRoleMenu(data) {
  return request({
    url: '/role/saveRoleMenu',
    method: 'post',
    data
  })
}

export function saveRoleResource(data) {
  return request({
    url: '/role/saveRoleResource',
    method: 'post',
    data
  })
}

export function refreshCache() {
  return request({
    url: '/role/refreshCache',
    method: 'get'
  })
}

