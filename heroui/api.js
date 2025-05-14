/*!
 * API for React / NextJS / HeroUI
 * 
 * Copyright (c) 1984-2025 Jose Garcia
 * Released under the MIT license
 * https://raw.githubusercontent.com/coronadofactory/hexagonal/refs/heads/main/LICENSE.txt
 *
 * Date: 2025-04-26
*/

// Constantes definidas en .env.local
const baseURL = process.env.NEXT_PUBLIC_API;
const DELAY = process.env.NEXT_PUBLIC_DELAY;

const cookieToken = process.env.NEXT_PUBLIC_COOKIE_TOKEN;
const bearerName = process.env.NEXT_PUBLIC_BEARER;

export function query(service, request, setData, setIsLoading, setError) {
  setIsLoading(true);
  setError(null);
  fetchData(service, request, 'POST')
    .then((response) => setData({success:true, content:response}))
    .catch((error) => setError((error.cause && error.cause==401)?{login:true}:{error:error}))
    .finally(() => setIsLoading(false));
}

export function command(service, request, setData, setIsLoading, setError) {
  setIsLoading(true);
  setError(null);
  fetchData(service, request, 'POST')
    .then((response) => setData({success:true, status:response.status, message:response.message}))
    .catch((error) => setError((error.cause && error.cause==401)?{needsLogin:true}:{hasError:error}))
    .finally(() => setIsLoading(false));
}

async function fetchData(service, request, method) {

  var headers = {
      'Content-Type': 'application/json',
  }

  // Bearer
  setBearer(headers);
  
  // URL & body
  var url, body = null;

  // URL for get
  if (method=='GET') {
    const queryParams = new URLSearchParams(request);
    url = `${baseURL}/${service}?${queryParams.toString()}`;
  } else {
    url = `${baseURL}/${service}`;
    body = JSON.stringify(request);
  } 

  // Options
  const options = {
    method:method?method:'POST',
    headers:headers,
    body:body
  }
  
  // Promise del fetch
  const promise = new Promise((resolve, reject) => {
    fetch(url, options)
      .then(async(response) => {
        if (response.ok) {
            try {
              let contents = await response.json();
              resolve(contents);
            } catch (e) {
              reject(e);
            } 
        } else {
          reject(new Error(response.statusText, {cause:response.status}));
        }
      })
      .catch(e => reject(e));
    });

    return delayPromise(promise, DELAY);
}

// Delay
async function delayPromise(p1, DELAY) {
 
  const p2 = new Promise((resolve) => {
    setTimeout(resolve, DELAY);
  });

  return new Promise((resolve, reject) => {
    Promise.all([p1, p2])
      .then(response => resolve(response[0]))
      .catch(e => reject(e))
  });
 
}

// setBearer
function setBearer(headers) {
  const bearerValue = getCookie(cookieToken);
  if (bearerValue) {
    headers[bearerName]=`Bearer ${bearerValue}`;
  }
}

// Obtencion de la cookie
function getCookie() {
  let name = cookieName + "=";
  let ca = document.cookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return null;

}