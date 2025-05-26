import { createStore } from 'vuex';

export default createStore({
    state: {
        userId: null,
        user: null,
        token: null
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
    },
    actions: {
        GetUserId({ commit }, userId) {
            commit('setUserId', userId);
        },
        updateToken({ commit }, token) {
            commit('setToken', token);
            localStorage.setItem('token', token);
        },
        updateUser({ commit }, user) {
            commit('setUser', user);
            localStorage.setItem('user', JSON.stringify(user));
        }
    },
});