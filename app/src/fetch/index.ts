import Request from "./request.js";
import { setRequest, setResponse } from "./interceptor.js";
const request = new Request();

setRequest(request);
setResponse(request);

export { request };
