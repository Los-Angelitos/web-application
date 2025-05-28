// http.js
import axios from "axios";
import { authenticationInterceptor } from "../../iam/services/authentication.interceptor.js";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const http = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
    },
});

http.interceptors.request.use(authenticationInterceptor);
console.log("🔐 Interceptor: autenticación configurada", http);
export default http;
