import http from "../../shared/services/http-common.js";

export class UserProfileService {
    getGuestById(id) {
        return http.get(`/user/guests/${id}`);
    }

    getGuests() {
        return http.get('/user/guests');
    }

    getAdminById(id) {
        return http.get(`/user/admins/${id}`);
    }

    getAdmins() {
        return http.get('/user/admins');
    }

    getOwnerById(id) {
        return http.get(`/user/owners/${id}`);
    }

    getOwners() {
        return http.get('/user/owners');
    }

    editOwner(id, editRequest) {
        return http.put(`/user/owners/${id}`, editRequest);
    }

    editAdmin(id, editRequest) {
        return http.put(`/user/admins/${id}`, editRequest);
    }

    editGuest(id, editRequest) {
        return http.put(`/user/guests/${id}`, editRequest);
    }

    setPreferences(guestId, temperature) {
        return http.post(`/guest-preferences`, { guestId, temperature });
    }

    getPreferences(guestId) {
        return http.get(`/guest-preferences/guests/${guestId}`);
    }

}