/*!
 * Fetcher Error
 * 
 * Copyright (c) 1984-2026 Jose Garcia
 * Released under the MIT license
 * https://raw.githubusercontent.com/coronadofactory/hexagonal/refs/heads/main/LICENSE.txt
 * 
 * Description: Mini Queue Manager
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

const ERROR_MESSAGE = 'La aplicación está dando un problema. Estamos trabajando en ello'

export function createError(response, contents) {

    if (response?.status) {
      if ([400,422].includes(response.status)) {
        if (contents.error) {
          return new ApplicationError(response.status, contents.error)
        } else if (contents.errors) {
          return new ValidationError(response.status, contents.errors)
        } else {
          return new ApplicationError(response.status, response.statusText)
        }
      } else if ([401].includes(response.status)) {
        return new AuthorizationError(response.status)
      } else if ([403,404,405,412].includes(response.status)) {
        return new ApplicationError(response.status, 'No debe haber llegado aquí')
      } else if ([503].includes(response.status)) {
        if (contents.error) {
          return new CircuitBreakerError(response.status, contents.error)
        } else {
          return new CircuitBreakerError(response.status)
        }          
      } else {
        return new ApplicationError(response.status, response.statusText)
      }
    } else {
      return new ApplicationError('500', 'Unknown error')
    }
  
  }
  
  class ApplicationError extends Error {
    constructor(status, message) {
      super(message);
      this.name = 'ApplicationError';
      this.status = status;
      this.error=ERROR_MESSAGE;
      this.consequence = 'errorFatal';

      console.error(`status:${status} message:${message}`)
    }
  }
  
  class ValidationError extends Error {
    constructor(status, errors) {
      super('Validation errors');
      this.name = 'ValidationError';
      this.status = status;
      this.errors = errors;
      this.consequence = 'modifyAndSend';
    }
  }
  
  class AuthorizationError extends Error {
    constructor(status) {
      super('Authorization error');
      this.name = 'AuthorizationError';
      this.status = status;
      this.consequence = 'needLogin';
    }
  }
    
  class CircuitBreakerError extends Error {
    constructor(status, error) {
      super('CircuitBreaker error');
      this.name = 'CircuitBreaker';
      this.status = status;
      this.error = error;
      this.consequence = 'tryLater';
    }
  }