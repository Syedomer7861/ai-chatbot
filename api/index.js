import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { createRequestHandler } = require("@react-router/node");

import * as build from "../build/server/index.js";

export default createRequestHandler(build);
