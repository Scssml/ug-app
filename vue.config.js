require("dotenv").config();

module.exports = {
  devServer: {
    proxy: 'http://85.113.45.98:89',
  },
  lintOnSave: true,
  chainWebpack: (config) => {
    config.module.rules.delete('eslint');
  },
};
