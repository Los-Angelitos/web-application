<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-card">
      <div class="modal-icon">📱</div>
      <h3 class="modal-title">New Booking</h3>

      <div class="form-group">
        <label>Name</label>
        <input v-model="form.name" type="text" placeholder="Name" />
      </div>

      <div class="form-group">
        <label>DNI</label>
        <input v-model="form.dni" type="text" placeholder="DNI" />
      </div>

      <div class="form-dates">
        <div class="form-group">
          <label>From</label>
          <input v-model="form.from" type="date" />
        </div>
        <div class="form-group">
          <label>To</label>
          <input v-model="form.to" type="date" />
        </div>
      </div>

      <div class="form-group">
        <label>Room</label>
        <select v-model="form.room">
          <option disabled value="">Select a room</option>
          <option>Room 0001</option>
          <option>Room 0002</option>
          <option>Room 0012</option>
        </select>
      </div>

      <button class="btn-submit" @click="submitBooking">
        Check-in
      </button>
    </div>
  </div>
</template>

<script>
import { Booking } from "../model/booking.entity.js";
import { BookingApiService } from "../services/booking-api.service.js";

const bookingService = new BookingApiService();

export default {
  name: "NewBookingComponent",
  emits: ["close"],
  data() {
    return {
      form: {
        name: "",
        dni: "",
        from: "",
        to: "",
        room: ""
      }
    };
  },
  methods: {
    async submitBooking() {
      try {
        const priceRoom = 100;
        const fromDate = new Date(this.form.from);
        const toDate = new Date(this.form.to);
        const nightCount = this.calculateNights(fromDate, toDate);
        const amount = priceRoom * nightCount;

        const booking = new Booking(
            null,
            3, // paymentCustomerId (parametrizarlo luego)
            3, // roomId (parametrizarlo luego)
            `${this.form.name} - ${this.form.dni}`,
            fromDate.toISOString(),
            toDate.toISOString(),
            priceRoom,
            nightCount,
            amount,
            "ACTIVE",
            3 // (parametrizarlo luego)
        );

        console.log("Payload enviado al backend:", Booking.toDisplayableBooking(booking));
        await bookingService.createBooking(booking);

        console.log("Booking created:", booking);
        this.$emit("bookingCreated");
        this.$emit("close");
      } catch (error) {
        console.error("Error creating booking:", error.response?.data || error.message);
      }
    },
    calculateNights(from, to) {
      const start = new Date(from);
      const end = new Date(to);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    }
  }
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.55);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 3500;
}

.modal-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  width: 400px;
  max-width: 90vw;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.modal-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.modal-title {
  font-weight: bold;
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
  text-align: left;
}

.form-group label {
  font-size: 0.85rem;
  margin-bottom: 0.25rem;
}

.form-group input,
.form-group select {
  padding: 0.5rem;
  border-radius: 6px;
  border: 1px solid #ccc;
}

.form-dates {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}

.btn-submit {
  background-color: #0066cc;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  font-weight: 500;
  font-size: 0.9rem;
  cursor: pointer;
}
</style>
