module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  devServer: {
    port: 3000,
    host: '0.0.0.0',
    disableHostCheck: true
  },
  chainWebpack: config => {
    config
    .plugin('html')
    .tap(args => {
      args[0].title = 'RoPhil Portfolio'
      return args
    })
  }
}
