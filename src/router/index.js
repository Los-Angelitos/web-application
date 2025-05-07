import {createRouter, createWebHistory} from "vue-router";
import MainPage from "../pages/overview/MainPage.vue";

const routes = [
    {
        path: '/',
        name: 'Home',
        component: MainPage
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router;