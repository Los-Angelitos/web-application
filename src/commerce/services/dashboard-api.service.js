import http from "../../shared/services/http-common.js";
import dashboardWeeklyMocked from "../../mocks/commerce/dashboardWeekly.json";
import dashboardMonthlyMocked from "../../mocks/commerce/dashboardMontly.json";

export class DashboardApiService {
    /**
     * Retrieve the dashboard data for a specific user.
     * @param {number} hotelId - The ID of the hotel whose dashboard data is to be retrieved.
     * @returns {Promise<AxiosResponse>} - A promise containing the server's response.
     */
    getWeeklyData(hotelId) {
        return dashboardWeeklyMocked; // For testing purposes, replace with the line below when ready for production
        return http.get(`/v1/payment-owner/weekly-incomes/${hotelId}`);
    }

    getMonthlyData(hotelId) {
        return dashboardMonthlyMocked; // For testing purposes, replace with the line below when ready for production
        return http.get(`/v1/payment-owner/monthly-incomes/${hotelId}`);
    }
}