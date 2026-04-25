/*!
 * Fetcher
 * 
 * Copyright (c) 1984-2026 Jose Garcia
 * Released under the MIT license
 * https://raw.githubusercontent.com/coronadofactory/hexagonal/refs/heads/main/LICENSE.txt
 * 
 * Description: Normalización de accesos al API via ajax 
 * Date: 2026-02-14
 * V2: 2026-02-24
 * 
*/

import { createError } from "./error-module.js";

export async function fetchData(endpoint, request, method, DELAY, BEARER_NAME, bearer) {

  // Options
  let options = {method:method, headers:AJAX}
  if (BEARER_NAME && bearer) options.headers[BEARER_NAME]=`Bearer ${bearer}`;

  // Final URL & body
  let url;
  if (method=='GET') {
    const queryParams = new URLSearchParams(request);
    url = queryParams.toString()
      ? `${endpoint}?${queryParams.toString()}`
      : `${endpoint}`;
    } else {
    url = `${endpoint}`;
    options.body=JSON.stringify(request);
  } 
  
  // Promise del fetch
  const p1 = fetch(url, options)
    .then(async(response) => {
      const contents = isJSON(response)?(await response.json()):(await response.text());
      if (!response.ok) throw createError(response, contents)
      return contents;
    })
  
  // Promise of first waiting
  const p2 = new Promise((resolve) => {
    setTimeout(resolve, DELAY || 0);
  });

  return new Promise((resolve, reject) => {
    Promise.all([p1, p2])
      .then(response => resolve(response[0]))
      .catch(err => reject(err))
  });
  
}

const AJAX = {'Content-Type': 'application/json; charset=utf-8'};

const isJSON = (response) => {
  const type = response?.headers?.get('content-type')?.toLowerCase() || '';
  return type.includes('application/json');
};