import http from "../../shared/services/http-common.js";

export class DashboardApiService {
    /**
     * Retrieve the dashboard data for a specific user.
     * @param {number} hotelId - The ID of the hotel whose dashboard data is to be retrieved.
     * @returns {Promise<AxiosResponse>} - A promise containing the server's response.
     */
    getWeeklyData(hotelId) {
        return http.get(`/payment-owner/weekly-incomes/${hotelId}`);
    }

    getMonthlyData(hotelId) {
        return http.get(`/payment-owner/monthly-incomes/${hotelId}`);
    }
}