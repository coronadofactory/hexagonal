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

        <script type="text/template" id="table-template">
            <table border="1" cellpadding="5" cellspacing="0">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Desire</th>
                    </tr>
                </thead>
                <tbody>
                    <% data.forEach(customer => { %>
                        <tr>
                            <td><%= customer.name %></td>
                            <td><%= customer.desire %></td>
                        </tr>
                    <% }) %>
                </tbody>
            </table>
        </script>

        <script src="https://cdnjs.cloudflare.com/ajax/libs/ejs/3.1.9/ejs.min.js"></script>
        <script type="module">
            import { Appia } from './appia.js';

            const appia = new Appia('/api', 500, 'X-Appia-Bearer');

            window.addEventListener('DOMContentLoaded', () => {
                const template = document.getElementById('table-template');
                const container = document.getElementById('table-container');
                appia.get('customers', {area:"madrid"})
                    .then(data => container.innerHTML = ejs.render(template, { data }));
                    .catch(err => container.innerHTML = err.message);
            });
        </script>
    </body>
</html>
```
