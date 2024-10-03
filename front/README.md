# Index.js

    import {start} from "./infrastructure/react";
    import {AppiaBackend} from "./infrastructure/backend";

    // Appia 001. Bad request. En desarrollo [cliente]

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
    document.getElementById("root"), 
    MMC.Editor
    );