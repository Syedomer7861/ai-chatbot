import * as rrNode from "@react-router/node";
const createRequestHandler = rrNode.createRequestHandler || rrNode.default?.createRequestHandler;

import * as build from "../build/server/index.js";

export default createRequestHandler(build);
