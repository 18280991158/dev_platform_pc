import request from '@/utils/request'
import qs from 'qs'

export function listPage(data) {
  return request({
    url: '/dictionaryItem/listPage',
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

export function del(data) {
  return request({
    url: '/dictionaryItem/delete',
    method: 'post',
    data
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

