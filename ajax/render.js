/*!
 * Fetcher Error
 * 
 * Copyright (c) 1984-2026 Jose Garcia
 * Released under the MIT license
 * https://raw.githubusercontent.com/coronadofactory/hexagonal/refs/heads/main/LICENSE.txt
 * 
 * Description: Render
 * Date: 2026-02-14
*/

import {Appia} from "./appia";

export class Render {

    constructor(ENDPOINT, DELAY, BEARER){
        this.appia=new Appia(ENDPOINT, DELAY, BEARER);
        this.cache={};
    }

    handleInvocation(containerId, templateURL, service, method, request, submitter) {
        const appia = this.appia;
        
        return (e) => {
            e.preventDefault();
            submitter(true);
            appia.fetch(service, method, request)
                .then(data => {render(containerId, templateURL, data); submitter(false)})
                .catch(err => {assign(containerId, err.message); submitter(false)})
        };

    }

    fill(containerId, templateURL, data) {
        this.render(containerId, templateURL, data);
    }

}

function render(containerId, templateURL, data) {
    loadTemplate(templateURL)
        .then(template => assign(containerId, ejs.render(template, { data })))
        .catch(err => assign(containerId, err.message))
}

function loadTemplate(templateURL) {
    if (this.cache[templateURL]) {
        return Promise.resolve(this.cache[templateURL]);
    }
    return fetch(templateURL)
        .then(response => {
            if (!response.ok) throw new Error(`Failed to get template ${templateURL}`);
            return response.text();
        }).then(template => {
            this.cache[templateURL]=template;
            return template;
        })
}

function assign(containerId, value) {
    const container = document.getElementById(containerId);
    container.innerHTML = value;
}
