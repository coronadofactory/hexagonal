/*!
 * API for React / NextJS / HeroUI
 * 
 * Copyright (c) 1984-2025 Jose Garcia
 * Released under the MIT license
 * https://raw.githubusercontent.com/coronadofactory/hexagonal/refs/heads/main/LICENSE.txt
 *
 * Date: 2025-04-26
*/

const baseURL = process.env.NEXT_PUBLIC_API;
const bearerName = process.env.NEXT_PUBLIC_BEARER;
const cookieName = process.env.NEXT_PUBLIC_COOKIE;
const DELAY = process.env.NEXT_PUBLIC_DELAY;

export function query(service, request, setData, setIsLoading, setError) {
  setIsLoading(true);
  setError(null);
  getDataFromServer(service, request)
    .then((contents) => setData(createResponse(contents)))
    .catch((error) => setError(createError(error)))
    .finally(() => setIsLoading(false));
}

async function getDataFromServer(service, request, method) {

  // URL Builder
  const endpoint = `${baseURL}/${service}`;

  // Options
  var options = {
    method:method?method:'POST',
    headers:{
      'Content-Type': 'application/json',
    }
  }

  // Final URL
  var url = endpoint;

  // URL for get
  if (method=='GET') {
    const queryParams = new URLSearchParams(request);
    url = `${endpoint}?${queryParams.toString()}`;
  }

  // Bearer
  const bearerValue = getCookie(cookieName);
  if (bearerValue) {
    options.headers[bearerName]=bearerValue;
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

// Obtencion de la cookie
function getCookie(cname) {
    let name = cname + "=";
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

// Delay
async function delayPromise(p1, DELAY) {
 
  var p2 = new Promise((resolve) => {
    setTimeout(resolve, DELAY);
  });

  return new Promise((resolve, reject) => {
    Promise.all([p1, p2])
      .then(response => resolve(response[0]))
      .catch(e => reject(e))
  });
 
}

function createResponse(contents) {
  return {success:true, contents:contents}
}

function createError(error) {

  if (error.cause && error.cause==401) {
    return {login:true};
  }

  return {error:error};
  
}
