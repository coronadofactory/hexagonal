



# index.js

    import {start} from "./infrastructure/react";
    import {AppiaBackend} from "./infrastructure/backend";

    // Appia 001. Bad request. En desarrollo [cliente]

    const root = document.getElementById("root");
    const wire = document.querySelectorAll("[data-wire]")[0].getAttribute("data-wire");
    const language = document.querySelectorAll("[data-language]")[0].getAttribute("data-language");

    start(
        AppiaBackend,
        {
            "e500":"Appia 002. Error de aplicación el servidor",
            "e000":"Appia 003. Socket not ready",
            "e408":"Appia 004. Request timeout",
            "e5234":"Appia 005. Service Unavailable",
            "e400":"Appia 006. Bad request. En desarrollo [servidor]",
            "e406":"Appia 007. Locked"
        },
        root, {wire:wire, language:language}
    );

# App.js

    import { useEffect, useState } from 'react';

    export default function App({connector}) {

        const [status, setStatus] = useState('empty');
        const [error, setError] = useState(null);
        const [item, setItem] = useState(null);

        // Load Manifest

        useEffect(() => {
            connector.start()
            .then(() => init())
            .catch(e => setError(e.message));
        }, [connector]);

        // Load or init date

        function init() {

        }
    } 


    "build": "react-scripts build && mv build/static/js/main*.js build/static/js/main-production.js",
