<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-card">
      <img class="guest-avatar" :src="guest.image" alt="Guest" />
      <h3 class="modal-title">Confirm State</h3>

      <h4 class="guest-name">{{ guest.name }}</h4>
      <p class="guest-email">{{ guest.email }}</p>
      <p class="guest-phone">{{ guest.phone }}</p>

      <div class="date-info">
        <i class="fa-regular fa-calendar"></i>
        From: {{ guest.from }}<br />
        To: {{ guest.to }}
      </div>

      <div class="form-group">
        <select v-model="selectedRoom">
          <option disabled value="">Select room</option>
          <option>Room 0001</option>
          <option>Room 0002</option>
          <option>Room 0012</option>
        </select>
      </div>

      <button class="btn-primary">Check-in</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "BookingConfirmCheckInComponent",
  props: {
    guest: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      selectedRoom: ""
    };
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
  background-color: rgba(0, 0, 0, 0.55);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  width: 350px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
}

.guest-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 1rem;
}

.modal-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.guest-name {
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.guest-email,
.guest-phone {
  font-size: 0.85rem;
  color: #444;
  margin-bottom: 0.25rem;
}

.date-info {
  font-size: 0.85rem;
  color: #444;
  margin: 1rem 0;
}

.form-group select {
  width: 100%;
  padding: 0.5rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  margin-bottom: 1rem;
}

.btn-primary {
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
