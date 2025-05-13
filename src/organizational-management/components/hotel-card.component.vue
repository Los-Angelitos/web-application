<!-- HotelCard.vue -->
<template>
  <div class="hotel-card" @click="selectHotel">
    <div class="hotel-image-container">
      <img :src="hotel.imageUrl" :alt="hotel.name" class="hotel-image">
      <div class="hotel-logo">
        <img :src="hotel.logoUrl" :alt="hotel.brand" class="logo-image">
      </div>
    </div>
    <div class="hotel-info">
      <h3 class="hotel-location">{{ hotel.location }}</h3>
      <p class="hotel-name">{{ hotel.name }}</p>
    </div>
    <div class="hotel-price">
      <p>From S/ {{ hotel.price }} a night</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HotelCard',
  props: {
    hotel: {
      type: Object,
      required: true,
      validator: (hotel) => {
        return hotel.imageUrl && hotel.name && hotel.location && hotel.price;
      }
    }
  },
  methods: {
    selectHotel() {
      console.log('Hotel selected:', this.hotel.name, this.hotel.id);
      this.$emit('hotel-selected', this.hotel.id);
    }
  }
}
</script>

<style scoped>
.hotel-card {
  cursor: pointer;
  width: 100%;
  border-radius: 10px;
  overflow: hidden;
  /*box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);*/
  background-color: white;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  max-width: 500px;
  margin-bottom: 16px;
}

.hotel-card:hover {
  transform: translateY(-5px);
  /*box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);*/
}

.hotel-image-container {
  position: relative;
  width: 100%;
  height: 260px;
  overflow: hidden;
  border-radius: 10px;
}

.hotel-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.hotel-card:hover .hotel-image {
  transform: scale(1.05);
}

.hotel-logo {
  position: absolute;
  bottom: 15px;
  left: 15px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.logo-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hotel-info {
  padding: 15px 15px 10px;
}

.hotel-location {
  font-size: 16px;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 5px 0;
}

.hotel-name {
  font-size: 14px;
  color: #718096;
  margin: 0;
}

.hotel-price {
  padding: 0 15px 15px;
}

.hotel-price p {
  font-size: 14px;
  font-weight: 600;
  color: #2d3748;
  margin: 0;
}
</style>