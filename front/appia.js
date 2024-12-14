/*!
 * Appia Connector
 * 
 * Copyright (c) 1984-2024 Jose Garcia
 * Released under the MIT license
 * https://raw.githubusercontent.com/coronadofactory/hexagonal/refs/heads/main/LICENSE.txt
 *
 * Date: 2024-10-03
 */

const bearerName = "X-Appia-Bearer";
const languageName = 'X-Appia-Language';
const manifestService = "api/manifest";
const loginService = "login";
const COOKIE_EXPIRATION = (1*24*60*60*1000);
const GENERIC_ERROR = 'Un error ha ocurrido en el sistema.  Hable con el administrador';

export function AppiaConnector(context, bearerValue, ERRORS, backend, DELAY) {

  var wire = context.wire, languageValue = context.language;

  var bearer, language;

  if (bearerValue) {
    bearer={name:bearerName,value:bearerValue};
  } else if (getCookie(bearerName)) {
    bearer={name:bearerName,value:getCookie(bearerName)};
  }

  if (languageValue) {
    language={name:languageName,value:languageValue};
  }

  var user, rest, messages, properties;

  return {

    start:function() {

      const THIS = this;

      return new Promise((resolve,reject) => {
        THIS.fetch(manifestService, {headers:{"Content-Type": "application/json; charset=utf-8"}})
        .then(data => {
          user=data.user
          rest=data.rest
          messages=data.messages
          properties=data.properties
          resolve();
        })
        .catch(e => reject(e))
      });

    },

    fetch:function(service, request) {

      var serviceMethod = serviceMediator(service, rest);
      if (!serviceMethod) {
        return new Promise((resolve,reject) => reject(errorMessage('e400', null, messages, ERRORS)));
      }

      return backend(wire, serviceMethod, request, {bearer:bearer, language:language}, function(code){return errorBackend(code,ERRORS)}, delayPromise, DELAY);

    },

    url:function(service, id) {

      var serviceMethod = serviceMediator(service, rest);
      if (!serviceMethod) {
        return
      }

      return serviceMethod.url+"/"+languageValue+"/"+btoa(encodeURI(JSON.stringify(id)));

    },

    setBearer:function(value) {
      setCookie(bearerName,value);
    },

    getMessage:function(code, e) {
      return errorMessage(code, e, messages);
    },

    getMessages:function() {
      return messages;
    },

    getUser:function() {
      return user;
    },

    getProperty:function(code) {
      return properties[code];
    }

  }

}

function serviceMediator(service, rest) {

  if (!service) {
    console.error("No service defined");
    return null;
  } else if (service===manifestService || service===loginService) {
    return {url:"/"+service, method:"POST"};
  } else if (!rest[service] || !rest[service].fetch) {
    console.error("No service '"+service+"' found in rest catalof");
    return null;
  } else {
    return rest[service].fetch;
  }

}

async function delayPromise(p1, DELAY) {
 
  var p2 = new Promise((resolve) => {
    setTimeout(resolve, DELAY);
  });

  return new Promise((resolve, reject) => {
    Promise.all([p1, p2])
      .then(response => resolve(response[0]))
      .catch(e => reject(e))
  });
 
};

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

function setCookie(cname, cvalue) {
  const d = new Date();
  d.setTime(d.getTime() + COOKIE_EXPIRATION);
  let expires = "expires="+d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function errorBackend(code,ERRORS) {
  if (!code) {
    console.error('No code message');
    return GENERIC_ERROR;
  } if (ERRORS && ERRORS[code]) {
    return ERRORS[code];
  } else {
    console.error('No messages defined for code '+code);
    return GENERIC_ERROR;
  }
}

function errorMessage(code, e, messages, ERRORS) {

  if (code && messages && messages[code]) {
    return messages[code];
  } else if (code && ERRORS && ERRORS[code]) {
    return ERRORS[code];
  } else if (e && e.message) {
    return e.message;
  } else if (!messages) {
    console.error('No messages defined');
    return GENERIC_ERROR;
  } else if (!messages[code]) {
    console.error('No messages['+code+'] defined');
    return GENERIC_ERROR;
  }

}
