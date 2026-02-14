Very simple ajax invocation using Appia

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
            import { Render } from './render.js';
            const render = new Render('/api', 500, 'X-Appia-Bearer');

            window.addEventListener('DOMContentLoaded'), render.handleInvocation(
                'table-container', './template.ejs', 'customers', 'get', {area:"madrid"}, () => {}
            );
        </script>
    </body>
</html>
```
