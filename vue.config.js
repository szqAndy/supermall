module.exports = {
  transpileDependencies: true,
  configureWebpack: { // 配置路径别名
    resolve: {
      alias: {
        'assets': '@/assets',
        'common': '@/common',
        'components': '@/components',
        'network': '@/network',
        'view': '@/view'
      }
    }
  }
}
