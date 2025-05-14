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

const cookieToken = process.env.NEXT_PUBLIC_COOKIE_TOKEN;
const cookieUser = process.env.NEXT_PUBLIC_COOKIE_USER;

// Importamos el command del acceso al API
import { command } from "./api";

// getUser
export function getUser() {
  return getCookie(cookieUser)?JSON.parse(getCookie(cookieUser)):null;
}

// Signup
export function signup(credentials, setUser, setIsLoading, setError, redirect) {
  return auth(signupURL, credentials, setUser, setIsLoading, setError, redirect);
}

// Login
export function login(credentials, setUser, setIsLoading, setError) {
  return auth(loginURL, credentials, setUser, setIsLoading, setError, redirect);
}

// La autorización de signup es la misma. La diferencia es que el usuario se crea con signup
// Este servicio devuelve el token a guardar en la cookie, para invocarlo en todas las llamadas
// Ademas devuelve el usuario por si se quiere guardar en variables globales para el avatar
function auth(url, credentials, setUser, setIsLoading, setError, redirect) {

  const setData = function(data) {
    const user = data.message.user;
    const token = data.message.token;
    setCookie(cookieToken, token);
    setCookie(cookieUser, JSON.stringify(user));
    setUser(user);
    redirect();
  }
  
  command(url, credentials, setData, setIsLoading, setError);

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

function setCookie(cname, cvalue) {
  const d = new Date();
  d.setTime(d.getTime() + COOKIE_EXPIRATION);
  let expires = "expires="+d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

// Logout
export function logout(setUser, redirect) {
  deleteCookie(cookieToken);
  deleteCookie(cookieUser);
  setUser(null);
  command(logoutURL, {}, redirect, function(){}, function(){});
}

function deleteCookie(cname) {
  let expires = "expires=Thu, 01 Jan 1970 00:00:00 UTC";
  document.cookie = cname + "=;" + expires + ";path=/";
}