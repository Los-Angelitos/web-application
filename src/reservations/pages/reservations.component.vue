<script>
import NewBookingFormComponent from "../components/booking-new.component.vue";

export default {
  name: "ReservationsPage",
  components: {
    NewBookingFormComponent
  },
  data() {
    return {
      hotelName: "Royal Decameron Punta Sal",
      showNewBookingModal: false
    };
  }
};
</script>

<template>
  <div class="reservations-page">
    <h1 class="hotel-title">{{ hotelName }}</h1>
    <h2 class="section-title">Reservations</h2>

    <div class="top-bar">
      <button class="btn-primary" @click="showNewBookingModal = true">
        New Booking
      </button>
    </div>

    <div class="card-container">
      <div class="reservation-card">
        <img class="avatar" src="https://i.pravatar.cc/150?img=10" alt="Guest" />
        <h3 class="guest-name">Arian Rodriguez</h3>
        <p class="guest-email">arian@mono.com</p>
        <p class="guest-phone">+51 999 888 487</p>
        <p class="reservation-dates">14/05/25 - 24/05/25</p>
        <button class="btn-checkin">Check-in</button>
      </div>
    </div>
  </div>
  <NewBookingFormComponent
      v-if="showNewBookingModal"
      @close="showNewBookingModal = false"
  />
</template>

<style scoped>
.reservations-page {
  padding: 2rem;
  font-family: 'Segoe UI', sans-serif;
}

.hotel-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0.25rem;
}

.section-title {
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
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

.reservation-card {
  background-color: white;
  border: 1px solid #eee;
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  width: 200px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.04);
}

.avatar {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 1rem;
}

.guest-name {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.guest-email,
.guest-phone,
.reservation-dates {
  font-size: 0.85rem;
  color: #555;
  margin-bottom: 0.25rem;
}

.btn-checkin {
  margin-top: 0.75rem;
  padding: 6px 12px;
  font-size: 0.8rem;
  background-color: #0066cc;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
}
</style>
