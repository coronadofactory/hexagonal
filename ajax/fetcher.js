/*!
 * Fetcher
 * 
 * Copyright (c) 1984-2026 Jose Garcia
 * Released under the MIT license
 * https://raw.githubusercontent.com/coronadofactory/hexagonal/refs/heads/main/LICENSE.txt
 * 
 * Description: Fetcher minimo usado en React, NextJS y 
 * Date: 2026-02-14

    Permitidos al usuario (producción)

    200 Ok
    401 Need login
    402 Payment required
    408 Request timeout
    422 User validation
    423 Locked
    500 Internal server error
    502 Invalid gateway
    503 Service breaker

    Errores de desarrollo que el usuario recibe 500:
    400 revisar si hay que mandarla
    403 role incorrecto o errores de desarrollo. No debería haber llegado aquí o algún problema en desarrollo 
    404 URI
    405 Method
    412 Precondition failed, falta idioma en cabecera 
*/

import { createError } from "./error";

export async function fetchData(endpoint, request, method, DELAY, BEARER_NAME, bearer) {

  // Options
  let options = {method:method, headers:AJAX}
  if (BEARER_NAME && bearer) options.headers[BEARER_NAME]=`Bearer ${bearer}`;

  // Final URL & body
  let url;
  if (method=='GET') {
    const queryParams = new URLSearchParams(request);
    url = `${endpoint}?${queryParams.toString()}`;
  } else {
    url = `${endpoint}`;
    options.body=JSON.stringify(request);
  } 
  
  // Promise del fetch
  const p1 = fetch(url, options)
    .then(async(response) => {
      const contents = isJSON(response)?(await response.json()):(await response.text());
      if (response.ok) {
        return contents;
      } else {
        throw createError(response, contents);
      }
    })
  
  // Promise of first waiting
  const p2 = new Promise((resolve) => {
    setTimeout(resolve, DELAY || 0);
  });

  return new Promise((resolve, reject) => {
    Promise.all([p1, p2])
      .then(response => resolve(response[0]))
      .catch(error => reject(error))
  });
  
}

const AJAX = {'Content-Type': 'application/json; charset=utf-8'};

const isJSON = (response) => {
  const type = response?.headers?.get('content-type')?.toLowerCase() || '';
  return type.includes('application/json');
};