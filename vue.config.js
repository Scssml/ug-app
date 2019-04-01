module.exports = {
  devServer: {
    proxy: 'http://dev.ug-21.ru',
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
