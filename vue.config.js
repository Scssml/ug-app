module.exports = {
  devServer: {
    proxy: 'http://192.168.4.102',
    //proxy: 'http://192.168.4.54',
    // proxy: {
    //   '/api': {
    //     target: 'http://10.0.0.18:3000',
    //     changeOrigin: true,
    //     ws: true,
    //     pathRewrite: {
    //       '^/api': '',
    //     },
    //   },
    // },
  },
  lintOnSave: true,
};
