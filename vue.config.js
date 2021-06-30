require("dotenv").config();

module.exports = {
  devServer: {
    proxy: process.env.VUE_APP_DEV_SERVER_PROXY,
  },
  lintOnSave: true,
  chainWebpack: (config) => {
    config.module.rules.delete('eslint');
  },
};
