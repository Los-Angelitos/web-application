import axios from "axios";

const API_BASE_URL = 'https://localhost:44300/api/v1';

const http = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}
});

// Export the http object
export default http;

