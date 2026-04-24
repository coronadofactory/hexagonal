const ERROR_MESSAGE = 'La aplicación está dando un problema. Estamos trabajando en ello'

const createError = function (response, contents) {

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

      console.log(status)
      console.log(message)
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

module.exports = createError;