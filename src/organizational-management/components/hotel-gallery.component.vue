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
    };
  },
  
  async created() {
    try {
      const response = await this.hotelApi.getHotels();
      
      console.log(response);
      const data = response.data;

      for(let i=0; i<data.length; ++i) {
        const imageUrl = await this.getMainHotelImage(data[i].id);
        const logoUrl = await this.getLogoHotelImage(data[i].id);

        this.hotels.push({
          id: data[i].id,
          logoUrl,
          imageUrl,
          name: data[i].name,
          description: data[i].description,
          email: data[i].email,
          address: data[i].address,
          phone: data[i].phone,
          ownerId: data[i].ownerId,
        });

      }
      
    } catch (error) {
      console.error("Error fetching hotels:", error);
    }
  },
  methods: {
    onSelectHotel(hotelId) {
      console.log(`Selected hotel ID: ${hotelId}`);
      this.$router.push(`/home/hotel/${hotelId}`);
    },
    async getMainHotelImage(hotelId) {
      const response = await this.hotelApi.getHotelMainMultimedia(hotelId);
      console.log("repsonse", response);
      return response.data.url || 'https://coffective.com/wp-content/uploads/2018/06/default-featured-image.png.jpg'; // Fallback image URL
    },
    async getLogoHotelImage(hotelId) {
      const response = await this.hotelApi.getHotelLogoMultimedia(hotelId);
      return response.data.url || 'https://coffective.com/wp-content/uploads/2018/06/default-featured-image.png.jpg'; // Fallback image URL
  
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
