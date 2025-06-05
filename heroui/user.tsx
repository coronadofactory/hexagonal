/*!
 * User
 * 
 * Copyright (c) 1984-2025 Jose Garcia
 * Released under the MIT license
 * https://raw.githubusercontent.com/coronadofactory/hexagonal/refs/heads/main/LICENSE.txt
 *
 * Date: 2025-06-05
*/

"use client";
import { useEffect, useState } from "react";

const cookieUser: string = "user";

export function getUser() {

    const [user, setUser] = useState(null);

    // Se useEffect necesita para que el document esté activo
    useEffect(() => {
        const cookieValue = getCookie(cookieUser);
        if (cookieValue) setUser(JSON.parse(cookieValue))
    }, []);

    return [user];

}


function getCookie(cname: string): string | null {

    const escapedCname = cname.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(?:^|;)\\s*${escapedCname}=([^;]*)`);

    const match = document.cookie.match(regex);
  
    // If a match is found and the first capturing group exists (which is the cookie value)
    if (match && match[1] !== undefined) {
        return decodeURIComponent(match[1]);
    }

    return null;

}