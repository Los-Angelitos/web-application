import http from "../../shared/services/http-common.js";

export class ContractApiService {

    createContractOwner(contractOwner) {
        return http.post("/contract-owner", contractOwner)
            .then(response => {
                return response.data; // Assuming the response contains the created contract owner
            })
            .catch(error => {
                console.error("Error creating contract owner:", error);
                throw error;
            });
    }

    getAllContractOwnersByOwnerId(ownerId) {
        return http.get(`/contract-owner/by-owner/${ownerId}`)
            .then(response => {
                return response.data; // Assuming the response contains an array of contract owners
            })
            .catch(error => {
                console.error("Error fetching contract owners by owner ID:", error);
                throw error;
            });
    }

    getAllContractOwners() {
        return http.get("/contract-owner")
            .then(response => {
                return response.data; // Assuming the response contains an array of all contract owners
            })
            .catch(error => {
                console.error("Error fetching all contract owners:", error);
                throw error;
            });
    }
}