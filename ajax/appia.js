/*!
 * Appia
 * 
 * Copyright (c) 1984-2026 Jose Garcia
 * Released under the MIT license
 * https://raw.githubusercontent.com/coronadofactory/hexagonal/refs/heads/main/LICENSE.txt
 * 
 * Description: Normalización de accesos al API via ajax 
 * Date: 2026-02-14

*/

import { fetchData } from "./fetcher";

export class Appia {
    constructor(ENDPOINT, DELAY, BEARER) {
        this.ENDPOINT=ENDPOINT;
        this.DELAY = DELAY;
        this.BEARER = BEARER;
    }

    get(service, request) {
        return fetchData(`${this.endpoint}/${service}`, request, "GET", DELAY, BEARER_NAME, this._getBearer());
    }

    post(service, fetchData) {
        return fetchData(`${this.endpoint}/${service}`, request, "POST", this.DELAY, this.BEARER_NAME, this._getBearer());
    }

    _getBearer() {
        return this._getCookie(this.BEARER);
    }

    _getCookie(cookieName) {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            const [key, value] = cookie.trim().split('=');
            if (key === cookieName) return value;
        }
        return null;
    }

}