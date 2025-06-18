import {createRouter, createWebHistory} from "vue-router";
import MainPage from "../organizational-management/pages/main-page.component.vue";
import HotelDetailPage from "../organizational-management/pages/hotel-details.component.vue"
import HotelOverviewPage from "../organizational-management/pages/hotel.component.vue"
import AnalyticsPage from "../commerce/pages/analytics-pages.component.vue"
import OrganizationPage from "../organizational-management/pages/organization.component.vue"
import ProvidersPage from "../inventory/pages/providers.component.vue"
import InventoryPage from "../inventory/pages/inventory.component.vue"
import NotificationPage from "../communication/pages/notifications.component.vue"
import ReservationsPage from "../reservations/pages/reservations.component.vue"
import RoomsPage from "../reservations/pages/rooms.component.vue"
import RegisterSubscriptionPlanPage from "../commerce/pages/subscription-plan-register.component.vue"
import CheckoutPage from "../commerce/pages/checkout.component.vue"
import HotelSetupReviewPage from "../organizational-management/pages/hotel-setup-review.component.vue"
import HotelRegisterPage from "../organizational-management/pages/hotel-register.component.vue"
import HotelSetupPage from "../organizational-management/pages/hotel-setup.component.vue"
import HotelDevicesIoTPage from "../organizational-management/pages/hotel-devices-iot.component.vue"
import UserProfilePage from "../iam/pages/user-profile.component.vue"
import UserProfileAccountPage from "../iam/pages/user-account-component.vue"
import GuestPreferencesPage from "../iam/pages/guest-preferences.component.vue"
import MyReservationsPage from "../reservations/pages/user-reservations.component.vue"
import SignInPage from "../iam/pages/sign-in.component.vue"
import SignUpPage from "../iam/pages/sign-up.component.vue"
import SignUpRolePage from "../iam/pages/sign-up-role.component.vue"
import HotelIoTConfigurationPage from "../organizational-management/pages/hotel-iot-configuration.component.vue";
import HotelBookingSystem from "../organizational-management/pages/hotel-booking.component.vue";
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
        path: '/home/hotel/:id/configuration',
        name: 'Hotel IoT Configuration',
        component: HotelIoTConfigurationPage
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
        path: '/home/hotel/checkout/:id',
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
        path: '/home/hotel/:id/set-up/devices',
        name: 'Hotel Set up devices',
        component: HotelDevicesIoTPage
    },
    {
        path: '/home/profile/:id',
        name: 'User profile',
        component: UserProfileAccountPage
    },
    {
        path: '/home/profile/:id/account',
        name: 'User profile account',
        component: UserProfilePage
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
    },
    {
        path: '/home/hotel/:id/bookings/:userId',
        name: 'Hotel Bookings',
        component: HotelBookingSystem
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router;