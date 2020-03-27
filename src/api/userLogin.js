import request from '@/utils/request'
import qs from 'qs'

export function listPage(data) {
  return request({
    url: '/userLogin/listPage',
    method: 'post',
    data: qs.stringify(data)
  })
}
