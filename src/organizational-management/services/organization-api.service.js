// organization-api.service.js - CORREGIDO
import http from "../../shared/services/http-common.js";

export class OrganizationApiService {

    getGuestById(guestId) {
        // CAMBIO: Remover /api/v1 del inicio ya que está en baseURL
        return http.get(`/user/guests/${guestId}`);
    }

    getAllGuests() {
        return http.get('/user/guests');
    }

    updateGuest(guestId, guestData) {
        return http.put(`/user/guests/${guestId}`, guestData);
    }

    getOwners() {
        return http.get('/user/owners');
    }

    getOwnerById(ownerId) {
        return http.get(`/user/owners/${ownerId}`);
    }

    getAdmins() {
        return http.get('/user/admins');
    }

    getAdminById(adminId) {
        return http.get(`/user/admins/${adminId}`);
    }

    updateAdmin(adminId, adminData) {
        return http.put(`/user/admins/${adminId}`, adminData);
    }
}