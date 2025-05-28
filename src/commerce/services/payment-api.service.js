import http from "../../shared/services/http-common.js";
import {PaymentOwner} from "../model/payment-owner.entity.js";

export class PaymentApiService {

    createPaymentOwner(paymentOwner) {
        return http.post("/payment-owner", paymentOwner)
            .then(response => {
                return new PaymentOwner(
                    response.data.ownerId,
                    response.data.description,
                    response.data.finalAmount
                );
            })
            .catch(error => {
                console.error("Error creating payment owner:", error);
                throw error;
            });
    }

    getAllPaymentOwnersByOwnerId(ownerId) {
        return http.get(`/payment-owner/by-owner/${ownerId}`)
            .then(response => {
                return response.data.map(owner => new PaymentOwner(
                    owner.ownerId,
                    owner.description,
                    owner.finalAmount
                ));
            })
            .catch(error => {
                console.error("Error fetching payment owners:", error);
                throw error;
            });
    }

    getAllPaymentOwners() {
        return http.get("/payment-owner")
            .then(response => {
                return response.data.map(owner => new PaymentOwner(
                    owner.ownerId,
                    owner.description,
                    owner.finalAmount
                ));
            })
            .catch(error => {
                console.error("Error fetching all payment owners:", error);
                throw error;
            });
    }
}