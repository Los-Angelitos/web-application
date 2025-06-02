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
import { HotelApiService } from "../services/hotel-api.service.js";

export default {
  name: 'HotelGallery',
  components: {
    HotelCard
  },
  data() {
    return {
      hotels: [],
      hotelApi: new HotelApiService(),
      hotelsMocked: hotelsMocked // Mocked data
    };
  },
  
  
  async created() {
    try {
      
      const response = await this.hotelApi.getHotels();
      

      console.log(response);
      const data = response.data;
      this.hotels = data.map(hotel => ({
        id: hotel.id,
        logoUrl: this.getLogoHotelImage(hotel.id),
        imageUrl: this.getMainHotelImage(hotel.id),
        name: hotel.name,
        description: hotel.description,
        email: hotel.email,
        address: hotel.address,
        phone: hotel.phone,
        ownerId: hotel.ownerId,
      }));
    } catch (error) {
      console.error("Error fetching hotels:", error);
    }
    //this.hotels = hotelsMocked; 
  },
  methods: {
    onSelectHotel(hotelId) {
      console.log(`Selected hotel ID: ${hotelId}`);
      this.$router.push(`/home/hotel/${hotelId}`);
    },
    getMainHotelImage(hotelId) {
      const response = this.hotelApi.getHotelMainMultimedia(hotelId);
      return response.data.imageUrl || 'https://coffective.com/wp-content/uploads/2018/06/default-featured-image.png.jpg'; // Fallback image URL
    },
    getLogoHotelImage(hotelId) {
      const response = this.hotelApi.getHotelLogoMultimedia(hotelId);
      return response.data.imageUrl || 'https://coffective.com/wp-content/uploads/2018/06/default-featured-image.png.jpg'; // Fallback image URL
  
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
