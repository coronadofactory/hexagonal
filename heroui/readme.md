# HERO IU

> [!IMPORTANT]
> Esto son solo pruebas de laboratorio


- [x] Install Node
- [ ] Install HeroUI

### Master - Detail with modal

```javascript
'use client'
import { title } from "@/components/primitives";
import { CardSkeleton } from "./skeleton";
import { HorizontalCard } from "./card";

import { useQuery } from "@/components/api-client";
import { ModalCrud } from "./modal";
import { useModal} from '@/components/master-detail';

export default function Cards() {

  const {items, setItems, error, isLoading } = useQuery('cards');
  const {item, method, setMethod, isOpen, onOpenChange, openUpdate, updateList} = useModal();

  const updateListHandle = (item) => updateList(item, items, setItems);

  return (
    <div>
      <h1 className={title()}>Cards</h1>

      {isLoading && 
         <CardSkeleton/>
      }

      {items &&
         <HorizontalCard items={items} openUpdate={openUpdate} />
      }
        
      <ModalCrud isOpen={isOpen} onOpenChange={onOpenChange} item={item} method={method} setMethod={setMethod} updateList={updateListHandle}/>

      {error?.login ? (
          <div><br/>Please login</div>
      ) : error ? (
          <div><br/>{error.message}</div>
      ): null}

    </div>

  );
}
```

[View code](https://gist.github.com/coronadofactory/f253254caf1618729c06ade792c49d59)


### Configuration in `.env.local`:

    # API for proxy
    NEXT_PUBLIC_API=/api

    # Bearer and cookie
    NEXT_PUBLIC_BEARER=X-Appia-Bearer
    NEXT_PUBLIC_COOKIE_TOKEN=X-Appia-Token
    NEXT_PUBLIC_COOKIE_USER=X-Appia-User

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
  const { setUser } = useGlobal();

  const [isSubmitting, setSubmitting] = useState(true);
  const [error, setError] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    const credentials = Object.fromEntries(new FormData(e.currentTarget));
    login(credentials, setUser, isSubmitting, setError, redirect)

  };

  const redirect = async (e) => {
    alert('Listo para reenviar');
  };

```


## use user in navbar

```javascript
 const { user } = useGlobal();
```

## Provider definition for user global. Last user signed

```javascript
export function Providers({ children, themeProps }: ProvidersProps) {
  const [user, setUser] = React.useState<string | null>(getUser());
  const router = useRouter();

  // Value to be provided by the Context
  const globalContextValue: GlobalContextType = {
    user,
    setUser,
  };

  return (
    <GlobalContext.Provider value={globalContextValue}>
      <HeroUIProvider navigate={router.push}>
        <NextThemesProvider {...themeProps}>{children}</NextThemesProvider>
      </HeroUIProvider>
    </GlobalContext.Provider>
  );
}
```

## useGlobal definition

```javascript
export const useGlobal = () => {
  const context = React.useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobal must be used within a Providers component");
  }
  return context;
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