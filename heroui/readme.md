# HERO IU


## API

### Invocation

```javascript
 useEffect(() => {
    query('service', request, setData, isLoading, setError);
  }, [request]);
```

### Configuration in `.env.local`:

    # API for proxy
    NEXT_PUBLIC_API=/api

    # Bearer and cookie
    NEXT_PUBLIC_BEARER=X-Appia-Bearer
    NEXT_PUBLIC_COOKIE=X-Appia-Cookie

    # Signup, login & logout URL
    NEXT_PUBLIC_SIGNUP_URL=http://...../signup
    NEXT_PUBLIC_LOGIN_URL=http://...../login
    NEXT_PUBLIC_LOGOUT_URL=http://...../logout

    # Delay in fetch
    NEXT_PUBLIC_DELAY=1500

<br>

## Formulario de Login

```javascript

  import { login } from "./auth";

  const [isSubmitting, setSubmitting] = useState(true);
  const [error, setError] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    const credentials = Object.fromEntries(new FormData(e.currentTarget));
    login(credentials, isSubmitting, setError, redirect)

  };

  const redirect = async (e) => {
    alert('Listo para reenviar');
  };

```

## Proxy

### 1. Modificar next.config.js incluyendo:

```javascript

const nextConfig = {

  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3000/..../:path*', // Proxy to Backend
      },
    ];
  },
};

module.exports = nextConfig;

```
Cambiar destination finalizando en `/:path`

### 2. Instalar http-proxy-middleware

    mpm install http-proxy-middleware


### 3. Crear directorio api en src o app u crear un fichero llamado proxy.js:

```javascript

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

```

Cambiar el campo target