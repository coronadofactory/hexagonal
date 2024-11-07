/*!
 * Backend Fetch
 * 
 * Copyright (c) 1984-2024 Jose Garcia
 * Released under the MIT license
 * https://raw.githubusercontent.com/coronadofactory/hexagonal/refs/heads/main/LICENSE.txt
 *
 * Date: 2024-10-03
 */

export function AppiaBackend(wire, service, body, headers, error, delayPromise, DELAY) {

    const promise = new Promise((resolve, reject) => {
      fetch(wire+service.url, options(service.method, body, headers))
        .then(async(response) => {
          if (response.ok) {
              try {
                let result = await response.json();
                resolve(result);
              } catch (e) {
                console.error('Invalid JSON');
                console.error(response);
                reject(new Error(error('e500'), { cause: e }));
              }
          } else {
              if (response.status===401) {
                reject(new Error('401', { cause: response }));
              } else if (response.status===406) {
                reject(new Error(error('e406'), { cause: response }));
              } else if (response.status===408) {  
                  reject(new Error(error('e408'), { cause: response }));
              } else   if (response.status===408) {
                console.error(error('e408'));
                reject(new Error(error('e408'), { cause: response }));
              } else if (response.status>=502 && response.status<=504) {
                console.error(error('e5234'));
                reject(new Error(error('e5234'), { cause: response }));
              } else {
                console.error(response);
                reject(new Error(error('e500'), { cause: response }));
              }
          }
        })
        .catch(e => {
            console.error(e.message);
            reject(new Error(error('e000'), { cause: e }))
        });
    });
  
    return delayPromise(promise, DELAY)
  
  }
  
  function options(method, body, headers) {
  
    var options = {
      method: method,
      headers: body.headers
    }
  
    if (headers.bearer && headers.bearer.value) {
      options.headers[headers.bearer.name]=headers.bearer.value;
    }
  
    if (headers.language && headers.language.value) {
      options.headers[headers.language.name]=headers.language.value;
    }
  
    if (body && body.body && method==="POST") {
      options.body=body.body;
    }
  
    return options;
  
  }
