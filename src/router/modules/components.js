const components = {
  'dashboard_super_admin': () => import('@/views/devPlatform/dashboard/index'),
  'menu_manage': () => import('@/views/devPlatform/menu/index'),
  'dictionary_directory_manage': () => import('@/views/devPlatform/dictionaryDirectory/index'),
  'role_manage': () => import('@/views/devPlatform/role/index'),
  'account_manage': () => import('@/views/devPlatform/account/index'),
  'resource_manage': () => import('@/views/devPlatform/resource/index'),
  'resource_directory_manage': () => import('@/views/devPlatform/resourceDirectory/index')

}

export default components
