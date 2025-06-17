import http from "../../shared/services/http-common.js";
import {Provider} from "../model/provider.entity.js";
import providersMock from "../../mocks/inventory/providers.json";

export class ProviderApiService {
    createProvider(provider) {
        return http.post('/providers', Provider.toDisplayableProvider(provider));
    }

    getProviders(hotelId) {
        try {
            return http.get(`/providers/hotel/${hotelId}`)
                .then(response => response.data) // Assuming the response contains the main multimedia
                        .catch(error => {
                            console.error("Error fetching providers by hotel ID:", error);
                            throw error;
                        });
        } catch (error) {
            console.error("Error fetching providers:", error);
            throw error;
        }
    }

    getProviderById(id) {
        return http.get(`/providers/${id}`);
    }

    deleteProvider(providerId) {
        try {
            console.log(`Attempting to delete provider with ID: ${providerId}...`);
            const response = http.delete(`/providers/${providerId}`);
            console.log(`Provider with ID: ${providerId} deleted successfully.`);
            return response;
        } catch (error) {
            console.error(`Error deleting provider with ID: ${providerId}`, error);
            throw error;
        }
    }
}