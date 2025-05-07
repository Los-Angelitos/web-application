import {createRouter, createWebHistory} from "vue-router";
import Testing from "../routes/testing.vue";

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Testing
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router;