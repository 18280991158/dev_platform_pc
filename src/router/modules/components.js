const components = {
  'dashboard_super_admin': () => import('@/views/devPlatform/dashboard/index'),
  'menu': () => import('@/views/devPlatform/menu/index'),
  'role': () => import('@/views/devPlatform/role/index'),
  'account': () => import('@/views/devPlatform/account/index'),
  'resource': () => import('@/views/devPlatform/resource/index'),
  'dict': () => import('@/views/devPlatform/dict/index'),
  'dictbiz': () => import('@/views/devPlatform/dictbiz/index'),
  'organization': () => import('@/views/devPlatform/organization/index'),
  'systemParameter': () => import('@/views/devPlatform/systemParameter/index'),
  'myInfo': () => import('@/views/myInfo/index'),
  'changeRole': () => import('@/views/changeRole/index'),
  'userLogin': () => import('@/views/devPlatform/userLogin/index'),
  'helpDescription': () => import('@/views/devPlatform/helpDescription/index')

}

export default components
