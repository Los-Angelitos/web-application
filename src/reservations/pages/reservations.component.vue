<script>
import NewBookingFormComponent from "../components/booking-new.component.vue";
import BookingConfirmCheckInComponent from "../components/booking-confirm-check-in.component.vue";
import {HotelsApiService} from "../../shared/services/hotels-api.service.js";
import {BookingApiService} from "../services/booking-api.service.js";
import OverviewIcon from "../../assets/organizational-management/overview-icon.svg";
import AnalyticsIcon from "../../assets/organizational-management/analytics-icon.svg";
import ProvidersIcon from "../../assets/organizational-management/providers-icon.svg";
import InventoryIcon from "../../assets/organizational-management/inventory-icon.svg";
import RoomsIcon from "../../assets/organizational-management/rooms-icon.svg";
import OrganizationIcon from "../../assets/organizational-management/organization-icon.svg";
import DevicesIcon from "../../assets/organizational-management/devices-icon.svg";
import {Hotel} from "../../shared/model/hotel.entity.js";
import MainPageNavigation from "../../organizational-management/components/main-page-navigation.component.vue";
import BookingCard from "../components/booking-card.component.vue";
import i18n from "../../i18n.js";
import ReservationsIcon from "../../assets/organizational-management/reservations-icon.svg";

export default {
  name: "ReservationsPage",
  components: {
    MainPageNavigation,
    NewBookingFormComponent,
    BookingConfirmCheckInComponent,
    BookingCard
  },
  data() {
    return {
      hotelId: null,
      roleId: null,
      reservations: [],
      bookingsApi: new BookingApiService(),
      hotel: null,
      hotelApi: new HotelsApiService(),
      showNewBookingModal: false,
      showBookingConfirmModal: false,
      navigationItems: [
        {id: "overview", label: "Overview", path: "", icon: OverviewIcon, isActive: true},
        {id: "analytics", label: "Analytics", path: "", icon: AnalyticsIcon, isActive: false},
        {id: "providers", label: "Providers", path: "", icon: ProvidersIcon, isActive: false},
        {id: "inventory", label: "Inventory", path: "", icon: InventoryIcon, isActive: false},
        {id: "rooms", label: "Rooms", path: "", icon: RoomsIcon, isActive: false},
        {id: "organization", label: "Organization", path: "", icon: OrganizationIcon, isActive: false},
        {id: "devices", label: "Devices", path: "", icon: DevicesIcon, isActive: false}
      ],
      selectedGuest: null
    };
  },
  mounted() {
    this.hotelId = this.$route.params.id || null;
    this.roleId = localStorage.getItem("roleId") || null;
    console.log("Hotel ID from route:", this.hotelId);
    this.loadNavigationItems();
  },
  async created() {
    try {
      this.hotelId = this.$route.params.id || null;
      this.roleId = localStorage.getItem("roleId") || null;
      console.log("Hotel ID from route in created:", this.hotelId);

      const res = await HotelsApiService.getHotelsById(this.hotelId);
      this.hotel = Hotel.fromDisplayableHotel(res);
      await this.fetchBookings(); // usa el nuevo método
    } catch (error) {
      console.error("Error al obtener datos:", error);
    }
  },
  computed: {
    i18n() {
      return i18n
    },
    hotelName() {
      return this.hotel?.name ?? "Hotel Name Not Found";
    }
  },
  methods: {
    loadNavigationItems() {
      // update the path with the hotel ID

      if(this.roleId == 1) {
        // reactive navigation items for roleId 3
        console.log("Role ID is 3, setting navigation paths accordingly");
        this.navigationItems.forEach(item => {
          item.path = `/home/hotel/${this.hotelId}/${item.id}`;
        });
      }else if(this.roleId == 2) {
        console.log("Role ID is 2, setting navigation paths accordingly");
        const itemsAdmin = [
          {id: "overview", label: "Overview", path: `/home/hotel/${this.hotelId}/overview`, icon: OverviewIcon, isActive: true},
          {id: "analytics", label: "Analytics", path: `/home/hotel/${this.hotelId}/analytics`, icon: AnalyticsIcon, isActive: false},
          {id: "reservations", label: "Reservations", path: `/home/hotel/${this.hotelId}/reservations`, icon: ReservationsIcon, isActive: false},
          {id: "rooms", label: "Rooms", path: `/home/hotel/${this.hotelId}/rooms`, icon: RoomsIcon, isActive: false}
        ]

        this.navigationItems.splice(0, this.navigationItems.length, ...itemsAdmin);
      }
      try {
        this.navigationItems.forEach(item => {
          item.isActive = item.path === this.$route.path;
        });
      } catch (error) {
        console.error("Error loading navigation items:", error);
      }
    },
    async fetchBookings() {
      try {
        const bookingsRes = await this.bookingsApi.getBookings(this.hotelId);
        this.reservations = bookingsRes.data;

        console.log("Bookings fetched:", this.reservations);
      } catch (error) {
        console.error("Error al actualizar reservas:", error);
      }
    },
    openConfirmModal(guest) {
      this.selectedGuest = guest;
      this.showBookingConfirmModal = true;
    },
    formatDate(dateStr) {
      const date = new Date(dateStr);
      return date.toLocaleDateString("es-PE", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit"
      });
    }
  }
};
</script>

<template>
  <MainPageNavigation :navigationItems="navigationItems" />
  <div class="reservations-page">
    <div class="title-section">
      <h1 class="hotel-title">{{ hotel?.name || "Hotel" }}</h1>
      <h2 class="section-title">{{ i18n.global.t('reservations.title')}}</h2>
    </div>

    <div class="top-bar">
      <button class="btn-primary" @click="showNewBookingModal = true">{{ i18n.global.t('reservations.newBooking')}}</button>
    </div>

    <div class="card-container">
      <BookingCard
          v-for="reservation in reservations"
          :key="reservation.id"
          :guest="reservation"
          @checkin="openConfirmModal"
      />
    </div>

    <NewBookingFormComponent
        v-if="showNewBookingModal"
        @close="showNewBookingModal = false"
        @bookingCreated="fetchBookings"
    />
    <BookingConfirmCheckInComponent
        v-if="showBookingConfirmModal"
        :guest="selectedGuest"
        @close="showBookingConfirmModal = false"
    />
  </div>
</template>

<style scoped>
.reservations-page {
  padding: 2.5rem 3rem;
  font-family: 'Segoe UI', sans-serif;
}

.title-section {
  margin-bottom: 1.5rem;
}

.hotel-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0.25rem;
}

.section-title {
  font-size: 1.1rem;
  color: #666;
}

.top-bar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 2rem;
}

.btn-primary {
  background-color: #0066cc;
  color: white;
  border: none;
  padding: 6px 16px;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  font-size: 0.85rem;
}

.card-container {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}

.title-section {
  margin: 2rem 0 0.5rem 0;
  padding-left: 2rem;
}

.hotel-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0.25rem;
}

.section-title {
  font-size: 1.1rem;
  color: #666;
}

</style>
