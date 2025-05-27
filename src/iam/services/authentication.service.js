import http from "../../shared/services/http-common.js";

export class AuthenticationService {
    signIn(signInRequest) {
        return http.post("/authentication/sign-in", signInRequest);
    }

    signUpGuest(signUpRequest) {
        return http.post("/authentication/sign-up-guest", signUpRequest);
    }

    signUpAdmin(signUpRequest) {
        return http.post("/authentication/sign-up-admin", signUpRequest);
    }

    signUpOwner(signUpRequest) {
        return http.post("/authentication/sign-up-owner", signUpRequest);
    }
}