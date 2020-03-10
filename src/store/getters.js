const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  id: state => state.user.id,
  introduction: state => state.user.introduction,
  roles: state => state.user.roles,
  currRole: state => state.user.currRole,
  permission_routes: state => state.permission.routes,
  errorLogs: state => state.errorLog.logs,
  fileServerUrl: state => state.config.fileServerUrl,
  systemName: state => state.config.systemName,
  logo: state => state.config.logo
}
export default getters
