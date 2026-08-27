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

    api(fetcher) {
        this.APIFetcher=fetcher;
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

    async run(error) {

        const schemaFetcher = this.schemaFetcher?this.schemaFetcher:Promise.resolve();
        const APIFetcher = this.APIFetcher;
        const hidrant = this.hidrant;

        return new Promise((resolve) => {
            document.addEventListener('DOMContentLoaded', () => {
                if (this.onlineEvent) window.addEventListener('online', this.onlineEvent);
                if (this.offlineEvent) window.addEventListener('offline', this.offlineEvent);
                resolve(schemaFetcher
                    .then(schema => fill(schema, APIFetcher))
                    .then(schema => Promise.all(schema.children.filter(el => el.template).map(el => render(el.id, el.template, el.props || {}))))
                    .then(() => Promise.all([...el?.querySelectorAll('[data-hidrant]')].map(el => hidrate(el, hidrant))).then(() => this.hidratedEvent?.()))
                    .catch(err => error?error(e):console.error(err))
                )
            })
        })
            
    }

}

import { fill } from "./store.js";
import { render } from "./renderer.js";

async function hidrate(el, hidrate) {
    if (!hidrate) return Promise.reject('No hidrant defined');
    return Promise.resolve(hidrate(el.getAttribute('data-hidrant'), el))
}

export default Controller;