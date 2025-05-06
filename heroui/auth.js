/*!
 * Signup, Login & Logout for React / NextJS / HeroUI
 * 
 * Copyright (c) 1984-2025 Jose Garcia
 * Released under the MIT license
 * https://raw.githubusercontent.com/coronadofactory/hexagonal/refs/heads/main/LICENSE.txt
 *
 * Date: 2025-04-28
*/

'use client'

// Constantes definidas en .env.local
const signupURL = process.env.NEXT_PUBLIC_SIGNUP_URL;
const loginURL = process.env.NEXT_PUBLIC_LOGIN_URL;
const logoutURL = process.env.NEXT_PUBLIC_LOGOUT_URL;

const cookieName = process.env.NEXT_PUBLIC_COOKIE;

// Importamos el command del acceso al API
import { command } from "./api";

// Signup
export function signup(credentials, setIsLoading, setError, redirect) {
  return auth(signupURL, credentials, setIsLoading, setError, redirect);
}

// Login
export function login(credentials, setIsLoading, setError) {
  return auth(loginURL, credentials, setIsLoading, setError, redirect);
}

// La autorización de signup es la misma. La diferencia es que el usuario se crea con signup
// Este servicio devuelve el token a guardar en la cookie, para invocarlo en todas las llamadas
function auth(url, credentials, setIsLoading, setError, redirect) {

  const setData = function(data) {
    const token = data.message.token;
    setCookie(token);
    redirect();
  }
  
  command(url, credentials, setData, setIsLoading, setError);

}

function setCookie(cvalue) {
  const d = new Date();
  d.setTime(d.getTime() + COOKIE_EXPIRATION);
  let expires = "expires="+d.toUTCString();
  document.cookie = cookieName + "=" + cvalue + ";" + expires + ";path=/";
}

// Logout
export function logout(redirect) {
  deleteCookie();
  command(logoutURL, {}, redirect, function(){}, function(){});
}

function deleteCookie() {
  let expires = "expires=Thu, 01 Jan 1970 00:00:00 UTC";
  document.cookie = cookieName + "=;" + expires + ";path=/";
}