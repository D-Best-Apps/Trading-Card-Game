const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      // IMPORTANT: Make sure this target matches the address of your backend server.
      target: 'http://localhost:5000',
      changeOrigin: true,
    })
  );
};