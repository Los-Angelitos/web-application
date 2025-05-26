import { useAuthenticationStore } from "./authentication.store.js";

/**
 * Authentication interceptor for Axios
 * @summary Intercepts requests to add authentication token
 * @param {Object} config - Axios request configuration
 * @returns {Object} - Modified Axios request configuration
 */

export function authenticationInterceptor(config) {
    const authenticationStore = useAuthenticationStore;
    const isAuthenticated = authenticationStore.state.isAuthenticated;

    if (isAuthenticated) {
        const token = authenticationStore.state.token;
        config.headers['Authorization'] = `Bearer ${token}`;

        console.log("Authentication interceptor: Token added to request headers.");
    } else {
        delete config.headers['Authorization'];
    }

    return config;
}