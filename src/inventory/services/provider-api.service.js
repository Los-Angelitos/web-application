import http from "../../shared/services/http-common.js";
import {Provider} from "../model/provider.entity.js";

export class ProviderApiService {
    createProvider(provider) {
        return http.post('/v1/providers', Provider.toDisplayableProvider(provider));
    }

    getProviders() {
        return http.get('/v1/providers');
    }

    getProviderById(id) {
        return http.get(`/v1/providers/${id}`);
    }

    deleteProvider(providerId) {
        return http.delete(`/v1/providers/${providerId}`);
    }
}