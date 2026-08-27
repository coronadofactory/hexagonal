/*!
 * Store manager
 * 
 * Copyright (c) 1984-2026 Jose Garcia
 * Released under the MIT license
 * https://raw.githubusercontent.com/coronadofactory/hexagonal/refs/heads/main/LICENSE.txt
 * 
 * Description: Carga el almacén de datos en el schema 
 * Date: 2026-08-27
 * 
*/

export async function fill(schema, store) {

    if (!store) return Promise.resolve(schema);

    return store.then(store => ({...schema, children:children(schema.children, store)}))

}

function children(children, store) {

    return children.map(schema => ({...schema, props:props(schema, store)}))

}

function props(schema, store) {

    return {
        ...(schema.props ?? {}),
        ...(store[schema.store] ?? {}),
        ...(schema.stores?.reduce(
                (acc, storeId) => {
                    Object.assign(acc, store[storeId] ?? {});
                    return acc;
                }, {}) ?? {}
            ),
      };

}

export async function render(schema) {

    return Promise.all(
        schema.children
            .filter(el => el.template)
            .map(el => renderTemplate(el.id, el.template, el.props || {}))
    ).then(() => schema) // Para el siguiente .then (hidration)

}

let cache = {};

async function renderTemplate(id, template, payload) {

    return loadTemplate(template)
        .then(template => {
            try {
                ejs.render(template, payload)
            } catch (err) {
                console.error(template)
                console.error(payload)
                console.error(err.message)
                throw err;
            }
            assign(id, ejs.render(template, payload))
        })

}

async function loadTemplate(url) {

    if (cache[url]) {
        return Promise.resolve(cache[url]);
    } else if (url.startsWith('#')) {
        if (!document.querySelector(url)) return Promise.reject(new Error(`${url} not found`))
        cache[url]=unescapeHTML(document.querySelector(url).innerHTML);
        return Promise.resolve(cache[url])
    } else {
        return readTemplate(url);
    }

}
    
async function readTemplate(url) {

    return fetch(url)
        .then(response => {
            if (!response.ok) throw new Error(`Failed to get template ${url}`);
            return response.text();
        })
        .then(template => {
            cache[url]=template;
            return template;
        })

}

function assign(id, value) {

    const container = document.getElementById(id);
    container.innerHTML = value;

}

function unescapeHTML(value) {
    const container = document.createElement("textarea");
    container.innerHTML = value;
    return convertTemplate(container.value);
}

function convertTemplate(input) {
    return convertAllLinks(convertAllImages(convertAllPrints(convertAllMaps(input))));
}

function convertAllMapsv1(input) {
    return input.replace(
        /<ejsmap\s+items="([^"]+)"\s+item="([^"]+)"[^>]*>([\s\S]*?)<\/ejsmap>/g,
        (_, items, item, inner) => {
        return `<% ${items}.map((${item}) => { %>\n${inner}\n<% }); %>`;
        }
    );
}

function convertAllMaps(input) {
    const openTagRegex = /<ejsmap\b[^>]*>/g;
  
    let result = "";
    let i = 0;
  
    while (i < input.length) {
      openTagRegex.lastIndex = i;
      const openMatch = openTagRegex.exec(input);
  
      if (!openMatch) {
        result += input.slice(i);
        break;
      }
  
      // add content before tag
      result += input.slice(i, openMatch.index);
  
      const openTag = openMatch[0];
      const startIndex = openMatch.index + openTag.length;
  
      // extract items + item from tag safely
      const itemsMatch = openTag.match(/items="([^"]+)"/);
      const itemMatch = openTag.match(/item="([^"]+)"/);
  
      if (!itemsMatch || !itemMatch) {
        result += openTag;
        i = startIndex;
        continue;
      }
  
      const items = itemsMatch[1];
      const item = itemMatch[1];
  
      // find matching closing tag safely (supports nesting)
      let depth = 1;
      let j = startIndex;
  
      while (j < input.length) {
        const nextOpen = input.indexOf("<ejsmap", j);
        const nextClose = input.indexOf("</ejsmap>", j);
  
        if (nextClose === -1) break;
  
        if (nextOpen !== -1 && nextOpen < nextClose) {
          depth++;
          j = nextOpen + 7;
        } else {
          depth--;
          j = nextClose + 9;
  
          if (depth === 0) {
            const inner = input.slice(startIndex, nextClose);
  
            result += `<% ${items}.map((${item}) => { %>\n`;
            result += convertAllMaps(inner);
            result += `\n<% }); %>`;
  
            i = j;
            break;
          }
        }
      }
    }
  
    return result;

}

function convertAllPrints(input) {

    return input.replace(
        /<ejsprint\s+value="([^"]+)"[^>]*><\/ejsprint>/g,
        (_, value) => `<%= ${value} %>`
    );

}

function convertAllImages(input) {

    return input.replace(
        /<ejsimage\s+value="([^"]+)"[^>]*><\/ejsimage>/g,
        (_, value) => `<img src="<%= ${value} %>"/>`
    );

}

function convertAllLinks(input) {

    return input.replace(
        /<ejslink\b(?=[^>]*\bhref="([^"]+)")(?=[^>]*\bclass="([^"]+)")[^>]*>([\s\S]*?)<\/ejslink>/g,
        (_,  href, className, inner) => {
        return `<a href="<%= ${href} %>" class="${className}">${inner}</a>`;
        }
    );

}

export async function hidrate(schema, hidrate) {
 
    const id = schema.children
        .find(el => el.template && el.id)?.id

    document.getElementById(id)
        ?.querySelectorAll('[data-handler]')
        .forEach(el => hidrate(el.getAttribute('data-handler'), el));        

    return Promise.resolve()

}