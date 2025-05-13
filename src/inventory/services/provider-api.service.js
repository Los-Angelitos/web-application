import http from "../../shared/services/http-common.js";
import {Provider} from "../model/provider.entity.js";
import providersMock from "../../mocks/inventory/providers.json";

export class ProviderApiService {
    createProvider(provider) {
        return http.post('/v1/providers', Provider.toDisplayableProvider(provider));
    }

    getProviders() {
        return providersMock; // For testing purposes, replace with the line below when ready for production
        return http.get('/v1/providers');
    }

    getProviderById(id) {
        return http.get(`/v1/providers/${id}`);
    }

    deleteProvider(providerId) {
        return http.delete(`/v1/providers/${providerId}`);
    }
}