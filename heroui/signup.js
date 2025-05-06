/*!
 * Login for React / NextJS / HeroUI
 * 
 * Copyright (c) 1984-2025 Jose Garcia
 * Released under the MIT license
 * https://raw.githubusercontent.com/coronadofactory/hexagonal/refs/heads/main/LICENSE.txt
 *
 * Date: 2025-04-30
*/

'use client'

const cookieName = process.env.NEXT_PUBLIC_COOKIE;
const loginURL = process.env.NEXT_PUBLIC_LOGIN_URL;

import { command } from "./api";

export function signup(credentials, setFetchedData, setIsLoading, setError) {

  const setData = function(data) {
    setCookie(cookieName, data.message.token)
    setFetchedData(data);
  }
  
  command(loginURL, credentials, setData, setIsLoading, setError);

}

function setCookie(cname, cvalue) {
  const d = new Date();
  d.setTime(d.getTime() + COOKIE_EXPIRATION);
  let expires = "expires="+d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}