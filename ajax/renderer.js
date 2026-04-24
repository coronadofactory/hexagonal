/*!
 * Renderer
 * 
 * Copyright (c) 1984-2026 Jose Garcia
 * Released under the MIT license
 * https://raw.githubusercontent.com/coronadofactory/hexagonal/refs/heads/main/LICENSE.txt
 * 
 * Description: Fetch + EJS + Dom
 * Date: 2026-02-14
 * V2: 2026-02-24
 * 
*/

export class Renderer {

    constructor(schemaService, appia) {
        this.schemaService=schemaService;
        this.appia=appia;
        this.cache={};
    }

    render(req) {

        return this._readSchema(this.schemaService, req, this.appia)
            .then(schema => Promise.all(
                schema.children
                    .filter(el => el.type === 'ejs')
                    .map(el => this._renderTemplate(el.id, el.template, el.props))
            ));

    }

    // Read schema
    _readSchema(schemaService, req, appia) {

        if (!schemaService) throw new Error('Bad request')
        return appia.fetch(schemaService, "GET", req);

    }

    // Load template & render
    async _renderTemplate(id, template, payload) {

        return this._loadTemplate(template)
            .then(template => this._assign(id, ejs.render(template, payload)))

    }

    async _loadTemplate(url) {

        if (this.cache[url]) {
            return Promise.resolve(this.cache[url]);
        } else if (url.startsWith('#')) {
            if (!document.querySelector(url)) return Promise.reject(new Error(`${url} not found`))
            this.cache[url]=unescapeHTML(document.querySelector(url).innerHTML);
            return Promise.resolve(this.cache[url])
        } else {
            return this._readTemplate(url);
        }

    }
    
    async _readTemplate(url) {

        return fetch(url)
            .then(response => {
                if (!response.ok) throw new Error(`Failed to get template ${url}`);
                return response.text();
            })
            .then(template => {
                this.cache[url]=template;
                return template;
            })

    }

    _assign(id, value) {
        const container = document.getElementById(id);
        container.innerHTML = value;
    }

}

function unescapeHTML(value) {
    const container = document.createElement("textarea");
    container.innerHTML = value;
    return container.value;
}