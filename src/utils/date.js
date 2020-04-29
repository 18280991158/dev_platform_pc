export function secondToDate(result) {
  var h = Math.floor(result / 3600)
  var m = Math.floor((result / 60 % 60))
  var s = Math.floor((result % 60))
  return h + '小时' + m + '分钟' + s + '秒'
}
