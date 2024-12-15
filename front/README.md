
# Installation

First of all, you must install the technology you want to use. Right now it's only available for react.
the future will be ready for Framework 7.

1. For install react use:

        cf install react

2. For install form module:

        cf install form

3. For install proxy module:

        cf install proxy

# index.js

    import {start} from "./infrastructure/react";
    import {AppiaBackend} from "./infrastructure/backend";

    // Appia 001. Bad request. En desarrollo [cliente]

    const root = document.getElementById("root");
    const wire = document.querySelector("[data-wire]").getAttribute("data-wire");
    const language = document.querySelector("[data-language]").getAttribute("data-language");
    const id = JSON.parse(atob(decodeURIComponent(document.querySelector("[data-id]").getAttribute("data-id"))));

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

# For Deploy app

    "build": "react-scripts build && mv build/static/js/main*.js build/static/js/main-production.js",
