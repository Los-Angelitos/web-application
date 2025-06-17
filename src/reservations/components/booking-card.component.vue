<template>
  <div class="reservation-card">
    <img class="avatar" :src="guest.image || 'https://i.pravatar.cc/150?img=1'" alt="Guest" />
    <p class="guest-name">{{ guest.description }}</p>
    <p class="guest-email">{{ guest.nightCount }}</p>
    <p class="guest-phone">{{ guest.amount }}</p>
    <p class="reservation-dates">
      {{ formatDate(guest.startDate) }} - {{ formatDate(guest.finalDate) }}
    </p>
    <button
        :class="['btn-action', isCheckin ? 'btn-checkin' : 'btn-checkout']"
        @click="$emit('checkin', guest)"
    >
      {{ isCheckin ? 'Check-in' : 'Check-out' }}
    </button>
  </div>
</template>

<script>
export default {
  name: "BookingCard",
  props: {
    guest: {
      type: Object,
      required: true
    }
  },
  computed: {
    isCheckin() {
      return !this.guest.checkedIn;
    }
  },
  methods: {
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

<style scoped>
.reservation-card {
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 1.5rem;
  width: 200px;
  text-align: center;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 1rem;
}

.guest-name {
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: 0.25rem;
}

.guest-email,
.guest-phone,
.reservation-dates {
  font-size: 0.85rem;
  color: #555;
  margin-bottom: 0.25rem;
}

.btn-action {
  margin-top: 0.75rem;
  padding: 6px 12px;
  font-size: 0.8rem;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  width: 100%;
}

.btn-checkin {
  background-color: #0066cc;
  color: white;
}

.btn-checkout {
  background-color: white;
  color: black;
  border: 1px solid #bbb;
}
</style>
