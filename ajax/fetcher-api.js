const createError = require("./error-api.js");

const fetchData = async function (endpoint, request, method, BEARER_NAME, bearer) {

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
  
  return p1;
  
}

const AJAX = {'Content-Type': 'application/json; charset=utf-8'};

const isJSON = (response) => {
  const type = response?.headers?.get('content-type')?.toLowerCase() || '';
  return type.includes('application/json');
};

module.exports = fetchData;