import SignInResponse from "../model/sign-in.response.js";
import { AuthenticationService } from "./authentication.service.js";
import { createStore } from "vuex";

const authenticationService = new AuthenticationService();

export const useAuthenticationStore = createStore({
    state: {
        userId: null,
        user: null,
        token: null,
        isAuthenticated: false
    },
    mutations: {
        setUserId(state, userId) {
            state.userId = userId;
        },
        setUser(state, user) {
            state.user = user;
        },
        setToken(state, token) {
            state.token = token;
        },
        setIsAuthenticated(state, isAuthenticated) {
            state.isAuthenticated = isAuthenticated;
        }
    },
    actions: {
        async signIn({ commit }, signInRequest) {
            return authenticationService.signIn(signInRequest)
                .then(response => {
                    let signInResponse = new SignInResponse(
                        response.data.id,
                        response.data.email,
                        response.data.token
                    );
                    
                    commit('setUserId', signInResponse.id);
                    commit('setUser', signInResponse);
                    commit('setToken', signInResponse.token);
                    commit('setIsAuthenticated', true);
                    localStorage.setItem('userId', signInResponse.id);
                    localStorage.setItem('user', JSON.stringify(signInResponse));
                    localStorage.setItem('token', signInResponse.token);

                    console.log("Sign-in successful:", signInResponse);
                    
                })
                .catch(error => {
                    console.error("Sign-in failed:", error);
                    throw error;
                });
        },

        async signUpGuest({ commit }, signUpRequest) {
            return authenticationService.signUpGuest(signUpRequest)
                .then(response => {
                    console.log("Sign-up as guest successful:", response.data);
                    localStorage.removeItem('userId');
                    localStorage.removeItem('user');
                    localStorage.removeItem('token');
                    commit('setUserId', null);
                    commit('setUser', null);
                    commit('setToken', null);
                    commit('setIsAuthenticated', false);
                })
                .catch(error => {
                    console.error("Sign-up as guest failed:", error);
                    throw error;
                });
        },

        async signUpAdmin({ commit }, signUpRequest) {
            return authenticationService.signUpAdmin(signUpRequest)
                .then(response => {
                    console.log("Sign-up as admin successful:", response.data);
                    localStorage.removeItem('userId');
                    localStorage.removeItem('user');
                    localStorage.removeItem('token');
                    commit('setUserId', null);
                    commit('setUser', null);
                    commit('setToken', null);
                    commit('setIsAuthenticated', false);
                })
                .catch(error => {
                    console.error("Sign-up as admin failed:", error);
                    throw error;
                });
        },

        async signUpOwner({ commit }, signUpRequest) {
            return authenticationService.signUpOwner(signUpRequest)
                .then(response => {
                    console.log("Sign-up as owner successful:", response.data);
                    localStorage.removeItem('userId');
                    localStorage.removeItem('user');
                    localStorage.removeItem('token');
                    commit('setUserId', null);
                    commit('setUser', null);
                    commit('setToken', null);
                    commit('setIsAuthenticated', false);
                })
                .catch(error => {
                    console.error("Sign-up as owner failed:", error);
                    throw error;
                });
        },

        logOut({ commit }) {
            commit('setUserId', null);
            commit('setUser', null);
            commit('setToken', null);
            commit('setIsAuthenticated', false);
            localStorage.removeItem('userId');
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            console.log("Logged out successfully");
        }
    }
}); 