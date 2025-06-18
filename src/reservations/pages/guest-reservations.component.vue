<template>
  <div class="reservations-container">
    <div v-if="loading" class="loading">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
      <p>Loading your reservations...</p>
    </div>
    
    <div v-else-if="error" class="error-message">
      <p>{{ error }}</p>
      <v-btn @click="fetchReservations">Retry</v-btn>
    </div>
    
    <div v-else-if="!reservations.length" class="no-reservations">
      <p>You don't have any reservations yet</p>
    </div>
    
    <div v-else class="reservation-cards">
      <v-card
        v-for="reservation in reservations"
        :key="reservation.id"
        class="mb-4 reservation-card"
        elevation="2"
      >
        <div class="d-flex">
          <v-img
            v-if="hotelImages[reservation.roomId]"
            :src="hotelImages[reservation.roomId]"
            height="200"
            width="300"
            cover
            class="rounded-l"
          ></v-img>
          
          <div class="pa-4 flex-grow-1">
            <div class="d-flex justify-space-between align-center">
              <div>
                <h3 class="text-h5">{{ hotelNames[reservation.roomId] || 'Loading...' }}</h3>
                <p class="text-subtitle-1">Room: {{ roomTypes[reservation.roomId] || 'Loading...' }}</p>
              </div>
              <v-chip :color="getStatusColor(reservation.status)" text-color="white">
                {{ reservation.status }}
              </v-chip>
            </div>
            
            <div class="mt-3">
              <p><v-icon>mdi-calendar</v-icon> {{ formatDate(reservation.checkIn) }} - {{ formatDate(reservation.checkOut) }}</p>
              <p><v-icon>mdi-account</v-icon> {{ reservation.guests }} guests</p>
              <p><v-icon>mdi-cash</v-icon> ${{ reservation.totalPrice }}</p>
            </div>
            
            <div class="d-flex justify-end mt-2">
              <v-btn variant="text" color="primary" :to="`/reservations/${reservation.id}`">
                View Details
              </v-btn>
              <v-btn 
                v-if="reservation.status !== 'CANCELLED'" 
                variant="text" 
                color="error" 
                @click="cancelReservation(reservation.id)"
              >
                Cancel
              </v-btn>
            </div>
          </div>
        </div>
      </v-card>
    </div>
  </div>
</template>

<script>
import { format } from 'date-fns';
import { UserProfileService } from '../../iam/services/user-profile.service.js';
import { HotelApiService } from '../../organizational-management/services/hotel-api.service.js';

export default {
  name: 'GuestReservations',
  data() {
    return {
      userService: new UserProfileService(),
      hotelService: new HotelApiService(),
      userId: null,
      loading: true,
      error: null,
      reservations: [],
      reservationDetails: {},
      roomDetails: {},
      hotelDetails: {},
      hotelImages: {},
      hotelNames: {},
      roomTypes: {},
    };
  },
  
  async created() {
    this.userId = this.$route.params.id;
    console.log(`Fetching reservations for user ID: ${this.userId}`);
    await this.fetchReservations();
  },
  
  methods: {
    async fetchReservations() {
      this.loading = true;
      this.error = null;
      
      try {
        // 1. Get all reservations
        const response = await this.userService.getReservationsByUserId(this.userId);
        console.log('Fetched reservations:', response);
        
        this.reservations = response.data;
        console.log('Reservations:', this.reservations);
        
        // 2. Fetch details for all reservations in parallel
        await Promise.all(this.reservations.map(reservation => this.fetchReservationDetails(reservation.id)));
        
      } catch (error) {
        console.error('Error fetching reservations:', error);
        this.error = 'Unable to load your reservations. Please try again later.';
      } finally {
        this.loading = false;
      }
    },
    
    async fetchReservationDetails(reservationId) {
      try {
        // Skip if we already have details for this reservation
        if (this.reservationDetails[reservationId]) {
          return;
        }
        
        const response = await this.userService.getReservationById(reservationId);
        console.log(`Fetched details for reservation ${reservationId}:`, response);
        
        const details = await response.json();
        this.reservationDetails[reservationId] = details;
        
        // Fetch room details if we don't already have them
        if (details.roomId && !this.roomDetails[details.roomId]) {
          this.fetchRoomDetails(details.roomId);
        }
        
      } catch (error) {
        console.error(`Error fetching reservation details for ID ${reservationId}:`, error);
      }
    },
    
    async fetchRoomDetails(roomId) {
      try {
        // Skip if we already have details for this room
        if (this.roomDetails[roomId]) {
          return;
        }
        
        const response = await this.hotelService.getRoomById(roomId);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch details for room ${roomId}`);
        }
        
        const roomData = await response.json();
        this.roomDetails[roomId] = roomData;
        //this.roomTypes[roomId] = roomData.roomType;
        
        // Now fetch hotel details if we don't already have them
        if (roomData.hotelId && !this.hotelDetails[roomData.hotelId]) {
          this.fetchHotelDetails(roomData.hotelId, roomId);
        }
        
      } catch (error) {
        console.error(`Error fetching room details for ID ${roomId}:`, error);
      }
    },
    
    async fetchHotelDetails(hotelId, roomId) {
      try {
        // Skip if we already have details for this hotel
        if (this.hotelDetails[hotelId]) {
          // Just update the mapping for roomId -> hotelId
          this.hotelImages[roomId] = this.hotelDetails[hotelId].mainImage;
          this.hotelNames[roomId] = this.hotelDetails[hotelId].name;
          return;
        }
        
        const responseMultimedia = await this.hotelService.getHotelMainMultimedia(hotelId);
        console.log(`Fetched details for hotel ${hotelId}:`, responseMultimedia);
        const responseHotel = await this.hotelService.getHotelById(hotelId);
        
        console.log(`Fetched hotel data for hotel ${hotelId}:`, responseHotel);
        if (!responseMultimedia.ok || !responseHotel.ok) {
          throw new Error(`Failed to fetch details for hotel ${hotelId}`);
        }
        
        const hotelData = await responseMultimedia.json();
        const hotelInfo = await responseHotel.json();
        this.hotelDetails[hotelId] = hotelData + hotelInfo;
        
        // Map the hotel image and name to the room
        this.hotelImages[roomId] = hotelData.url;
        this.hotelNames[roomId] = hotelInfo.name;
        
      } catch (error) {
        console.error(`Error fetching hotel details for ID ${hotelId}:`, error);
      }
    },
    
    formatDate(dateString) {
      return dateString;
    },
    
    getStatusColor(status) {
      const colorMap = {
        'CONFIRMED': 'success',
        'PENDING': 'warning',
        'CANCELLED': 'error',
        'COMPLETED': 'info'
      };
      
      return colorMap[status] || 'grey';
    },
    
    async cancelReservation(reservationId) {
      // Implementation for cancelling a reservation
      if (confirm('Are you sure you want to cancel this reservation?')) {
        try {
          const response = await fetch(`/api/reservations/${reservationId}/cancel`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (!response.ok) {
            throw new Error('Failed to cancel reservation');
          }
          
          // Update the local reservation status
          const index = this.reservations.findIndex(r => r.id === reservationId);
          if (index !== -1) {
            this.reservations[index].status = 'CANCELLED';
          }
          
          this.$toast.success('Reservation cancelled successfully');
        } catch (error) {
          console.error('Error cancelling reservation:', error);
          this.$toast.error('Failed to cancel reservation');
        }
      }
    }
  }
};
</script>

<style scoped>
.reservations-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.loading, .error-message, .no-reservations {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  text-align: center;
}

.reservation-card {
  transition: transform 0.2s;
}

.reservation-card:hover {
  transform: translateY(-5px);
}
</style>