import http from "../../shared/services/http-common.js";
import {Supply} from "../model/supply.entity.js";

export class SupplierApiService {
    /**
     * Create a new supply resource.
     * @param {Object} supply - The supply data to create.
     * @returns {Promise<AxiosResponse>} - A promise containing the server's response.
     */
    createSupply(supply) {
        return http.post('/supply/create-supply', Supply.toDisplayableSupply(supply));
    }

    /**
     * Retrieve all supplies for a specific hotel.
     * @param {number} hotelId - The ID of the hotel whose supplies are to be retrieved.
     * @returns {Promise<AxiosResponse>} - A promise containing the server's response.
     */
    getSupplies(hotelId) {
        return http.get(`/supply/get-all-supplies?hotelId=${hotelId}`);
    }

    updateSupply(supplyId, supply) {
        return http.post(`/supply/${supplyId}`, Supply.toDisplayableSupply(supply));
    }
}