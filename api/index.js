process.env.NODE_ENV = "production";
import { createRequestListener } from "@react-router/node";
import * as build from "../build/server/index.js";

console.log("CRITICAL: Build properties found:", Object.keys(build));

export default createRequestListener(Object.assign({}, build));
