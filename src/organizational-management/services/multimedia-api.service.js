import http from "../../shared/services/http-common.js";

export class MultimediaApiService {
    createMultimedia(multimedia) {
        return http.post("/multimedia", multimedia)
            .then(response => response.data) // Assuming the response contains the created multimedia
            .catch(error => {
                console.error("Error creating multimedia:", error);
                throw error;
            });
    }
}