const createProxyMiddleware = require('http-proxy-middleware');
const { env } = require('process');

const target = env.API_ENDPOINT ? env.API_ENDPOINT :
  'http://taw4-apiservice-jrc23a.azure-api.net';

const context =  [
  "/HealthCheck",
];

module.exports = function(app) {
  const appProxy = createProxyMiddleware(context, {
    target: target,
    secure: false,
    headers: {
      Connection: 'Keep-Alive'
    }
  });

  app.use(appProxy);
};
