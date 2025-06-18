import { useAuthenticationStore } from "./authentication.store.js"; // está bien

export function authenticationInterceptor(config) {
    const token = useAuthenticationStore.state.token;
    const isAuthenticated = useAuthenticationStore.state.isAuthenticated;

    if (isAuthenticated && token) {
        config.headers['Authorization'] = `Bearer ${token}`;
        //console.log("🔐 Interceptor: token agregado:", token);
    } else {
        delete config.headers['Authorization'];
        //console.log("🔐 Interceptor: sin token");
    }

    return config;
}
