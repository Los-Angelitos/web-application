import http from "../../shared/services/http-common.js";
import {Provider} from "../model/provider.entity.js";
import providersMock from "../../mocks/inventory/providers.json";

export class ProviderApiService {
    createProvider(provider) {
        return http.post('/providers', Provider.toDisplayableProvider(provider));
    }

    getProviders() {
        return http.get('/providers');
    }

    getProviderById(id) {
        return http.get(`/providers/${id}`);
    }

    deleteProvider(providerId) {
        return http.delete(`/providers/${providerId}`);
    }
}