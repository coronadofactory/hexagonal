/*!
 * React Starter
 * 
 * Copyright (c) 1984-2024 Jose Garcia
 * Released under the MIT license
 * https://raw.githubusercontent.com/coronadofactory/hexagonal/refs/heads/main/LICENSE.txt
 *
 * Date: 2024-10-03
 */

import React from "react";
import { createRoot } from "react-dom/client";
import { AppiaConnector } from "./appia";

import App from "../app/App";

export function start(AppiaBackend, ERRORS, root, context, bearer) {

  createRoot(root).render(
    <App connector={new AppiaConnector(context, bearer, ERRORS, AppiaBackend, DELAY)} document={context.document}/>
  );

}

const DELAY = 500;