module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/vuetify-admin-template/' : '/',
  devServer: {
    disableHostCheck: true,
    proxy: {
      '/apiURL': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        pathRewrite: { '^/apiURL': '' },
      },
    }
  },
  transpileDependencies: [
    'vuetify'
  ],
  runtimeCompiler: true,
  configureWebpack:{
    performance: {
      hints: false
    },
    optimization: {
      splitChunks: {
        minSize: 10000,
        maxSize: 250000,
      }
    }
  },
}
