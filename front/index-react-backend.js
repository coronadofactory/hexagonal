/*!
 * Index.js
 * 
 * Copyright (c) 1984-2024 Jose Garcia
 * Released under the MIT license
 * https://raw.githubusercontent.com/coronadofactory/hexagonal/refs/heads/main/LICENSE.txt
 *
 * Date: 2024-10-03
 */

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
