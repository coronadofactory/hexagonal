/*!
 * GenUI Controller
 * 
 * Copyright (c) 1984-2026 Jose Garcia
 * Released under the MIT license
 * https://raw.githubusercontent.com/coronadofactory/hexagonal/refs/heads/main/LICENSE.txt
 * 
 * Description: Inicia los controladores de las páginas 
 * Date: 2026-08-27
 * 
*/

export class Controller {

    schema(fetcher) {
        this.schemaFetcher=fetcher;
        return this;
    }

    store(fetcher) {
        this.storeFetcher=fetcher;
        return this;
    }

    hidrant(hidrant) {
        this.hidrant=hidrant;
        return this;
    }

    hidrated(hidrated) {
        this.hidratedEvent=hidrated;
        return this;
    }

    online(online) {
        this.onlineEvent=online;
        return this;
    }

    offline(offline) {
        this.offlineEvent=offline;
        return this;
    }

    async run() {

        const schemaFetcher = this.schemaFetcher?this.schemaFetcher:Promise.resolve({children:[]});
        const storeFetcher = this.storeFetcher?this.storeFetcher:Promise.resolve({});
        const hidrant = this.hidrant;

        return new Promise((resolve,reject) => {
            if (this.onlineEvent) window.addEventListener('online', this.onlineEvent);
            if (this.offlineEvent) window.addEventListener('offline', this.offlineEvent);

            Promise.all([schemaFetcher, storeFetcher])
                .then(([schema, store]) => {
                    return schema;
                })
                .then(schema => {
                    schema.children.filter(el => el.template && el.id).forEach(el => render(el.id, el.template, el.props || {}))
                    return schema;
                })
                .then(schema => {
                    schema.children.filter(el => el.hidrant && el.id).forEach(el => hidrate(document.getElementById(el.id), hidrant, el.hidrant))
                    return schema;
                })
                .then(schema => resolve(schema))
                .catch(err => reject(err))
        })
            
    }

}

import { render } from "./renderer.js";

async function hidrate(el, hidrate, hidrateName) {
    if (!hidrate) return Promise.reject('No hidrant defined');
    return Promise.resolve(hidrate(hidrateName, el))
}

export default Controller;