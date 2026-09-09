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
                .then(([schema, store]) => fillSchema(schema, store))
                .then(schema => renderSchema(schema))
                .then(schema => hidrateSchema(schema, hidrant))
                .then(schema => resolve(schema))
                .catch(err => reject(err))
        })
            
    }

}

import { render } from "./renderer.js";

function fillSchema(schema, store) {
  return {
    ...schema, children: schema.children.map(child => {
      if (!child.store) return child;
      return fillProps(child, store)
    }) 
  };
}

function fillProps(child, store) {
  const props = {};
  child.store.split(',').map(key => key.trim()).filter(Boolean).forEach(key => {
    if (store[key]) props[key] = store[key];
  })
  const { store: _, ...childWithoutStore } = child;
  return {...childWithoutStore, props}
}

function renderSchema(schema) {
  schema.children.filter(el => el.template && el.id).forEach(el => render(el.id, el.template, el.props || {}))
  return schema;
}

function hidrateSchema(schema, hidrate) {
  schema.children.filter(el => el.hidrant && el.id).forEach(el => hidrate(el.hidrant, document.getElementById(el.id)))
  return schema;
}

export default Controller;