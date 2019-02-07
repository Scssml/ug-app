module.exports = {
  devServer: {
    proxy: 'http://10.0.0.18:3000',
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
