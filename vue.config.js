module.exports = {
  devServer: {
    proxy: 'http://dev2.ug-21.ru',
    // proxy: 'http://192.168.4.54',
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
};
