
# Renderer

### Very simple ajax invocation using Appia

```html
<!DOCTYPE html>
<html lang="es">
    <head>
        <meta charset="UTF-8">
        <title>Example using Appia</title>
    </head>
    <body>
        <h1>Table Sample</h1>

        <div id="table-container">Waiting for data...</div>

        <script src="https://cdnjs.cloudflare.com/ajax/libs/ejs/3.1.9/ejs.min.js"></script>
        <script type="module">

            import { Appia } from "/ajax-api/appia.js";
            import { Renderer } from "/ajax-api/renderer.js";

            const DELAY = 3000, BEARER = 'X-Appia-Bearer';

            const api = './', schema = 'schema', req = {};

            window.addEventListener('DOMContentLoaded', (e) =>
                new Renderer(schema, new Appia(api, DELAY, BEARER)).render(req)
            );

        </script>

    </body>
</html>
```

### The JSON Schema

```json

{
    "type": "container",
    "props": "",
    "children": [
        {"type":"ejs", "id":"table-container", "template":"./template.ejs", "props":{}}
    ]
}


```
