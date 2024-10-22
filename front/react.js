/*!
 * React Starter
 * 
 * PONGA AQUI SUS DATOS
 * 
 */

import React from "react";
import { createRoot } from "react-dom/client";
import { AppiaConnector } from "./appia";

import App from "../app/App";

export function start(AppiaBackend, ERRORS, root, context, bearer) {

  createRoot(root).render(
    <App connector={new AppiaConnector(context, bearer, ERRORS, AppiaBackend, DELAY)}/>
  );

}

const DELAY = 500;
