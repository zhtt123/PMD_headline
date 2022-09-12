// .env.development和.env.production是环境变量配置文件
// NODE_ENV变量名是固定的，自定义变量名必须VUE_APP_开头

if (process.env.NODE_ENV === 'production') {
  // process是Node环境全部变量, 运行时根据敲击的命令不同, 脚手架会取环境变量给env添加属性和值
  console.log = function () {} // 覆盖所有打印语句
  console.error = function () {}
  console.dir = function () {}
  console.warning = function () {}
}
