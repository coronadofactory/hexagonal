/*!
 * Proxy
 * 
 * Copyright (c) 1984-2025 Jose Garcia
 * Released under the MIT license
 * https://raw.githubusercontent.com/coronadofactory/hexagonal/refs/heads/main/LICENSE.txt
 *
 * Date: 2025-04-26
*/

import { createProxyMiddleware } from 'http-proxy-middleware';

export const config = {
  api: {
    bodyParser: false,
  },
};

const proxy = createProxyMiddleware({
  target: 'http://localhost:3000/....',
  changeOrigin: true,
  pathRewrite: { '^/api/proxy': '' },
});

export default function handler(req, res) {
  proxy(req, res, (err) => {
    if (err) {
      res.status(500).send('Proxy error');
    }
  });
}