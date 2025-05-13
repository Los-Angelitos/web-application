<!-- HotelGallery.vue -->
<template>
    <div class="hotel-gallery">
      <div class="gallery-grid">
        <hotel-card
          v-for="hotel in hotels"
          :key="hotel.id"
          :hotel="hotel"
          class="gallery-item" @click="onSelectHotel(hotel.id)"
        />
      </div>
    </div>  
  </template>
  
<script>
import HotelCard from "../components/hotel-card.component.vue"
import hotelsMocked from "../../mocks/organizational-management/hotels-data.json"

export default {
  name: 'HotelGallery',
  components: {
    HotelCard
  },
  data() {
    return {
      hotels: hotelsMocked
    };
  },
  methods: {
    onSelectHotel(hotelId) {
      console.log(`Selected hotel ID: ${hotelId}`);
      this.$router.push(`/home/hotel/${hotelId}`);
    }
  }
}
</script>
  
<style scoped>
.hotel-gallery {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;

  padding: 20px;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 20px;
}

/* Responsive grid */
@media (min-width: 640px) {
  .hotel-gallery {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .gallery-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 768px) {
  .gallery-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1024px) {
  .gallery-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>
