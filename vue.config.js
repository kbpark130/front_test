module.exports = {
  devServer: {
    port: process.env.VUE_APP_PORT || 8081,
    proxy: {
      '/posts': {
        target: 'http://localhost:8080', // API 서버 주소
        changeOrigin: true,
      },
    },
  },
};