import request from '@/utils/request'
import qs from 'qs'

export function list(data) {
  return request({
    url: '/dictionaryItem/list',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function save(data) {
  return request({
    url: '/dictionaryItem/save',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function del(query) {
  return request({
    url: '/dictionaryItem/delete',
    method: 'get',
    params: query
  })
}

export function isExist(data) {
  return request({
    url: '/dictionaryItem/isExist',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function listCache(query) {
  return request({
    url: '/dictionaryItem/listCache',
    method: 'get',
    params: query
  })
}

