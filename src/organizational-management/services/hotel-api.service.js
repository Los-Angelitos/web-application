import http from "../../shared/services/http-common.js";
import {Hotel} from "../../shared/model/hotel.entity.js";

export class HotelApiService {
    createHotel(hotel){
        return http.post("/hotels", hotel)
            .then(response => {
                if(response.status === 201) {
                    return response.data;
                }
                else {
                    return null;
                }
            })
            .catch(error => {
                console.error("Error creating hotel:", error);
                throw error;
            });
    }

    updateHotel(hotel) {
        return http.put(`/hotels/${hotel.hotelId}`, hotel)
            .then(response => {
                if(response.status === 201) {
                    return response.data;
                }
                else {
                    return null;
                }
            })
            .catch(error => {
                console.error("Error updating hotel:", error);
                throw error;
            });
    }

    getAllHotels() {
        return http.get("/hotels")
            .then(response => {
                return response.data.map(hotel => new Hotel(
                    hotel.hotelId,
                    hotel.name,
                    hotel.location,
                    hotel.rating
                ));
            })
            .catch(error => {
                console.error("Error fetching all hotels:", error);
                throw error;
            });
    }

    getHotelByOwnerId(ownerId) {
        return http.get(`/hotels/owner/${ownerId}`)
            .then(response => {
                return response.data.map(hotel => new Hotel(
                    hotel.hotelId,
                    hotel.name,
                    hotel.location,
                    hotel.rating
                ));
            })
            .catch(error => {
                console.error("Error fetching hotels by owner ID:", error);
                throw error;
            });
    }
}