import {createRouter, createWebHistory} from "vue-router";
import MainPage from "../pages/overview/MainPage.vue";
import HotelDetailPage from "../pages/overview/HotelDetailPage.vue"
import HotelOverviewPage from "../pages/auth/HotelOverviewPage.vue"
import AnalyticsPage from "../pages/analytics/AnalyticsPage.vue"
import OrganizationPage from "../pages/organization/OrganizationPage.vue"
import ProvidersPage from "../pages/analytics/ProvidersPage.vue"
import InventoryPage from "../pages/analytics/InventoryPage.vue"
import NotificationPage from "../pages/profile/NotificationPage.vue"
import ReservationsPage from "../pages/analytics/ReservationsPage.vue"
import RoomsPage from "../pages/organization/RoomsPage.vue"
import RegisterSubscriptionPlanPage from "../pages/payment/RegisterSubscriptionPlanPage.vue"
import CheckoutPage from "../pages/payment/CheckoutPage.vue"
import HotelSetupReviewPage from "../pages/payment/HotelSetupReview.vue"
import HotelRegisterPage from "../pages/payment/HotelRegisterPage.vue"
import HotelSetupPage from "../pages/payment/HotelSetupPage.vue"
import UserProfilePage from "../pages/profile/UserProfilePage.vue"
import UserProfileAccountPage from "../pages/profile/UserProfileAccountPage.vue"
import GuestPreferencesPage from "../pages/profile/GuestPreferencesPage.vue"
import MyReservationsPage from "../pages/organization/MyReservationsPage.vue"
import SignInPage from "../pages/auth/SignInPage.vue"
import SignUpPage from "../pages/auth/SignUpPage.vue"
import SignUpRolePage from "../pages/auth/SignUpRolePage.vue"

const routes = [
    {
        path: '/',
        redirect: '/home'
    },
    {
        path: '/home',
        name: 'Home',
        component: MainPage
    },
    {
        path: '/home/hotel/:id',
        name: 'Hotel Detail',
        component: HotelDetailPage
    },
    {
        path: '/home/hotel/:id/overview',
        name: 'Hotel Overview',
        component: HotelOverviewPage
    },
    {
        path: '/home/hotel/:id/analytics',
        name: 'Hotel Analytics',
        component: AnalyticsPage
    },
    {
        path: '/home/hotel/:id/organization',
        name: 'Hotel Organization',
        component: OrganizationPage
    },
    {
        path: '/home/hotel/:id/providers',
        name: 'Hotel Providers',
        component: ProvidersPage
    },
    {
        path: '/home/hotel/:id/inventory',
        name: 'Hotel Inventory',
        component: InventoryPage
    },
    {
        path: '/home/hotel/:id/notifications',
        name: 'Hotel Notifications',
        component: NotificationPage
    },
    {
        path: '/home/hotel/:id/reservations',
        name: 'Hotel Reservations',
        component: ReservationsPage
    },
    {
        path: '/home/hotel/:id/rooms',
        name: 'Hotel Rooms',
        component: RoomsPage
    },
    {
        path: '/home/hotel/subscription',
        name: 'Hotel Subscription',
        component: RegisterSubscriptionPlanPage
    },
    {
        path: '/home/hotel/checkout',
        name: 'Hotel Checkout',
        component: CheckoutPage
    },
    {
        path: '/home/hotel/set-up',
        name: 'Hotel Set up',
        component: HotelRegisterPage 
    },
    {
        path: '/home/hotel/set-up/details',
        name: 'Hotel Set up details',
        component: HotelSetupPage
    },
    {
        path: '/home/hotel/set-up/review',
        name: 'Hotel Set up review',
        component: HotelSetupReviewPage
    },
    {
        path: '/home/profile/:id',
        name: 'User profile',
        component: UserProfilePage
    },
    {
        path: '/home/profile/:id/account',
        name: 'User profile account',
        component: UserProfileAccountPage
    },
    {
        path: '/home/profile/:id/preferences',
        name: 'User preferences',
        component: GuestPreferencesPage
    },
    {
        path: '/home/profile/:id/reservations',
        name: 'My reservations',
        component: MyReservationsPage
    },
    {
        path: '/auth/sign-in',
        name: 'Sign in',
        component: SignInPage
    },
    {
        path: '/auth/sign-up',
        name: 'Sign up',
        component: SignUpPage
    },
    {
        path: '/auth/sign-up/role',
        name: 'Sign up role',
        component: SignUpRolePage
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router;