<template>
  <div class="app-container">

    <!-- Main Content -->
    <main class="main-content" v-if="hotelData">
      <!-- Step 1: Room Selection -->
      <div v-if="currentStep === 'rooms'" class="rooms-section">
        <div class="page-header">
          <h1 class="hotel-title">{{ hotelData.name }}</h1>
          <p class="hotel-location">{{ hotelData.location }}</p>
          <p class="hotel-description">
            Discover the best rooms available at our hotel. Choose your perfect stay from our selection of comfortable and luxurious rooms.
            Click on a room to see more details and proceed with your booking.
            </p>
        </div>

        <!-- Room Grid -->
        <div class="rooms-grid">
          <div 
            v-for="room in rooms" 
            :key="room.id"
            class="room-card"
            @click="selectRoom(room)"
          >
            <div class="room-image">
              <img :src="room.image" :alt="room.name">
            </div>
            <div class="room-content">
              <h3 class="room-name">{{ room.name }}</h3>
              <p class="room-description">{{ room.description }}</p>
              <div class="room-pricing">
                <span class="room-price">S/ {{ room.price }}</span>
                <span class="price-period">by night</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Step 2: Date Selection -->
      <div v-if="currentStep === 'dates'" class="dates-section">
        <div class="form-container">
          <div class="back-button-container">
            <button @click="goBack" class="back-button">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
              </svg>
              Back
            </button>
          </div>

          <h2 class="section-title">Select your dates</h2>
          
          <!-- Selected Room Info -->
          <div class="selected-room-info">
            <div class="room-summary">
              <img :src="selectedRoom.image" :alt="selectedRoom.name" class="room-thumbnail">
              <div class="room-details">
                <h3 class="room-name">{{ selectedRoom.name }}</h3>
                <p class="room-price-info">S/ {{ selectedRoom.price }} by night</p>
              </div>
            </div>
          </div>

          <!-- Date Form -->
          <form @submit.prevent="proceedToPayment" class="date-form">
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Check-in Date</label>
                <input 
                  type="date" 
                  v-model="booking.checkIn" 
                  required
                  class="form-input"
                >
              </div>
              <div class="form-group">
                <label class="form-label">Check-out Date</label>
                <input 
                  type="date" 
                  v-model="booking.checkOut" 
                  required
                  class="form-input"
                >
              </div>
            </div>

            <div v-if="nightsCount > 0" class="booking-summary">
              <div class="summary-content">
                <span class="nights-count">{{ nightsCount }} nights</span>
                <span class="total-price">Total: S/ {{ totalPrice }}</span>
              </div>
            </div>

            <button 
              type="submit" 
              class="continue-button"
              :disabled="nightsCount <= 0"
            >
              Continue to Payment
            </button>
          </form>
        </div>
      </div>

      <!-- Step 3: Payment -->
      <div v-if="currentStep === 'payment'" class="payment-section">
        <div class="form-container">
          <div class="back-button-container">
            <button @click="goBack" class="back-button">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
              </svg>
              Volver
            </button>
          </div>

          <h2 class="section-title">Completa tu reserva</h2>

          <!-- Booking Summary -->
          <div class="reservation-summary">
            <h3 class="summary-title">Resumen de la reserva</h3>
            <div class="summary-details">
              <div class="summary-row">
                <span>Habitación:</span>
                <span>{{ selectedRoom.name }}</span>
              </div>
              <div class="summary-row">
                <span>Fecha de entrada:</span>
                <span>{{ formatDate(booking.checkIn) }}</span>
              </div>
              <div class="summary-row">
                <span>Fecha de salida:</span>
                <span>{{ formatDate(booking.checkOut) }}</span>
              </div>
              <div class="summary-row">
                <span>Noches:</span>
                <span>{{ nightsCount }}</span>
              </div>
              <hr class="summary-divider">
              <div class="summary-row total-row">
                <span>Total:</span>
                <span class="total-amount">S/ {{ totalPrice }}</span>
              </div>
            </div>
          </div>

          <!-- Payment Form -->
          <form @submit.prevent="processPayment" class="payment-form">
            <div class="form-group">
              <label class="form-label">Nombre completo</label>
              <input 
                type="text" 
                v-model="payment.fullName" 
                required
                class="form-input"
                placeholder="Ingresa tu nombre completo"
              >
            </div>

            <div class="form-group">
              <label class="form-label">Email</label>
              <input 
                type="email" 
                v-model="payment.email" 
                required
                class="form-input"
                placeholder="tu@email.com"
              >
            </div>

            <div class="form-group">
              <label class="form-label">Teléfono</label>
              <input 
                type="tel" 
                v-model="payment.phone" 
                required
                class="form-input"
                placeholder="+51 999 999 999"
              >
            </div>

            <div class="form-group">
              <label class="form-label">Número de tarjeta</label>
              <input 
                type="text" 
                v-model="payment.cardNumber" 
                required
                class="form-input"
                placeholder="1234 5678 9012 3456"
                maxlength="19"
                @input="formatCardNumber"
              >
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Fecha de expiración</label>
                <input 
                  type="text" 
                  v-model="payment.expiryDate" 
                  required
                  class="form-input"
                  placeholder="MM/YY"
                  maxlength="5"
                  @input="formatExpiryDate"
                >
              </div>
              <div class="form-group">
                <label class="form-label">CVV</label>
                <input 
                  type="text" 
                  v-model="payment.cvv" 
                  required
                  class="form-input"
                  placeholder="123"
                  maxlength="3"
                >
              </div>
            </div>

            <button 
              type="submit" 
              class="pay-button"
              :disabled="isProcessing"
            >
              {{ isProcessing ? 'Procesando...' : `Pagar S/ ${totalPrice}` }}
            </button>
          </form>
        </div>
      </div>

      <!-- Step 4: Confirmation -->
      <div v-if="currentStep === 'confirmation'" class="confirmation-section">
        <div class="confirmation-container">
          <div class="success-icon">
            <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
          </div>
          <h2 class="confirmation-title">¡Reserva confirmada!</h2>
          <p class="confirmation-message">Tu reserva ha sido procesada exitosamente</p>
          
          <div class="confirmation-details">
            <h3 class="details-title">Detalles de la reserva</h3>
            <div class="details-content">
              <div class="detail-row">
                <span>Código de reserva:</span>
                <span class="booking-code">#{{ bookingId }}</span>
              </div>
              <div class="detail-row">
                <span>Hotel:</span>
                <span>{{ hotelData.name }}</span>
              </div>
              <div class="detail-row">
                <span>Habitación:</span>
                <span>{{ selectedRoom.name }}</span>
              </div>
              <div class="detail-row">
                <span>Fechas:</span>
                <span>{{ formatDate(booking.checkIn) }} - {{ formatDate(booking.checkOut) }}</span>
              </div>
              <div class="detail-row">
                <span>Total pagado:</span>
                <span class="paid-amount">S/ {{ totalPrice }}</span>
              </div>
            </div>
          </div>

          <button 
            @click="goToHome" 
            class="home-button"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { HotelApiService } from '../services/hotel-api.service.js';
export default {
  name: 'HotelBookingSystem',
  data() {
    return {
    hotelApi: new HotelApiService(),
      currentStep: 'rooms', // rooms, dates, payment, confirmation
      hotelId: null,
      isProcessing: false,
      bookingId: null,
      hotelData: {
        name: '',
        location: ''
      },
      rooms: [
        {
          id: 1,
          name: 'Standard Room',
          description: 'Standar room with city view',
          price: 320,
          image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=400&h=300&fit=crop'
        },
        {
          id: 2,
          name: 'Deluxe Room',
          description: 'Deluxe room with sea view',
          price: 450,
          image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop'
        },
        {
          id: 3,
          name: 'Suite Junior',
          description: 'Bright and spacious suite',
          price: 680,
          image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400&h=300&fit=crop'
        },
        {
          id: 4,
          name: 'Suite Master',
          description: 'Luxurious suite with private balcony',
          price: 1200,
          image: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=400&h=300&fit=crop'
        }
      ],
      selectedRoom: null,
      booking: {
        checkIn: '',
        checkOut: '',
        roomId: null
      },
      payment: {
        fullName: '',
        email: '',
        phone: '',
        cardNumber: '',
        expiryDate: '',
        cvv: ''
      }
    }
  },
  computed: {
    nightsCount() {
      if (!this.booking.checkIn || !this.booking.checkOut) return 0;
      const checkIn = new Date(this.booking.checkIn);
      const checkOut = new Date(this.booking.checkOut);
      const diffTime = checkOut - checkIn;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 0;
    },
    totalPrice() {
      if (!this.selectedRoom || this.nightsCount <= 0) return 0;
      return this.selectedRoom.price * this.nightsCount;
    }
  },
  async mounted() {
    // Simular obtención del hotelId desde la URL
    this.hotelId = this.$route?.params?.id || '1';
    await this.loadHotelData();
  },
  methods: {
    async loadHotelData() {
        try {
            const hotel = await this.hotelApi.getHotelById(this.hotelId)
            this.hotelData = {
                name: hotel.data?.name,
                location: hotel.data?.address
            }
        }catch(e) {
            console.error('Error al cargar los datos del hotel:', e);
            this.hotelData = {
                name: 'Hotel Desconocido',
                location: 'Ubicación no disponible'
            };
        }
    },
    selectRoom(room) {
      this.selectedRoom = room;
      this.booking.roomId = room.id;
      this.currentStep = 'dates';
    },
    proceedToPayment() {
      if (this.nightsCount <= 0) {
        alert('Por favor selecciona fechas válidas');
        return;
      }
      this.currentStep = 'payment';
    },
    async processPayment() {
      this.isProcessing = true;
      
      try {
        // Preparar datos para enviar al backend
        const bookingData = {
          hotelId: this.hotelId,
          roomId: this.booking.roomId,
          checkIn: this.booking.checkIn,
          checkOut: this.booking.checkOut,
          nights: this.nightsCount,
          totalPrice: this.totalPrice,
          guestInfo: {
            fullName: this.payment.fullName,
            email: this.payment.email,
            phone: this.payment.phone
          },
          paymentInfo: {
            cardNumber: this.payment.cardNumber.replace(/\s/g, ''),
            expiryDate: this.payment.expiryDate,
            cvv: this.payment.cvv
          }
        };

        // Simular llamada al backend
        const response = await this.submitBooking(bookingData);
        
        if (response.success) {
          this.bookingId = response.bookingId;
          this.currentStep = 'confirmation';
        } else {
          throw new Error(response.message || 'Error al procesar el pago');
        }
      } catch (error) {
        alert('Error al procesar el pago: ' + error.message);
        console.error('Payment error:', error);
      } finally {
        this.isProcessing = false;
      }
    },
    async submitBooking(bookingData) {
      // Simular llamada al backend - reemplaza con tu endpoint real
      return new Promise((resolve) => {
        setTimeout(() => {
          // Simular respuesta exitosa
          resolve({
            success: true,
            bookingId: 'BK' + Date.now().toString().substr(-6)
          });
        }, 2000);
      });
      
      // Código real para el backend:
      /*
      try {
        const response = await fetch('/api/bookings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(bookingData)
        });
        
        if (!response.ok) {
          throw new Error('Error en la respuesta del servidor');
        }
        
        return await response.json();
      } catch (error) {
        throw error;
      }
      */
    },
    goBack() {
      if (this.currentStep === 'dates') {
        this.currentStep = 'rooms';
      } else if (this.currentStep === 'payment') {
        this.currentStep = 'dates';
      }
    },
    goToHome() {
      this.currentStep = 'rooms';
      this.selectedRoom = null;
      this.booking = { checkIn: '', checkOut: '', roomId: null };
      this.payment = { fullName: '', email: '', phone: '', cardNumber: '', expiryDate: '', cvv: '' };
    },
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    },
    formatCardNumber(event) {
      let value = event.target.value.replace(/\s/g, '');
      value = value.replace(/(.{4})/g, '$1 ').trim();
      if (value.length > 19) value = value.substr(0, 19);
      this.payment.cardNumber = value;
    },
    formatExpiryDate(event) {
      let value = event.target.value.replace(/\D/g, '');
      if (value.length >= 2) {
        value = value.substr(0, 2) + '/' + value.substr(2, 2);
      }
      this.payment.expiryDate = value;
    }
  }
}
</script>

<style scoped>
/* Reset y estilos base */
* {
  box-sizing: border-box;
}

.app-container {
  min-height: 100vh;
}

/* Header */
.header {
  background-color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.header-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
}

.logo {
  display: flex;
  align-items: center;
  font-size: 24px;
  font-weight: bold;
  color: #2563eb;
}

.logo-icon {
  background-color: #2563eb;
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  margin-right: 8px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.language {
  font-size: 14px;
  color: #6b7280;
}

.user-avatar {
  width: 32px;
  height: 32px;
  background-color: #d1d5db;
  border-radius: 50%;
}

/* Main Content */
.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 20px;
}

/* Room Selection Section */
.rooms-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.page-header {
  text-align: center;
}

.hotel-title {
  font-size: 32px;
  font-weight: bold;
  color: #111827;
  margin-bottom: 8px;
}

.hotel-location {
  color: #6b7280;
  font-size: 16px;
}

.rooms-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
}

.room-card {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  cursor: pointer;
  transition: box-shadow 0.3s ease;
}

.room-card:hover {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.room-image {
  height: 200px;
  background-color: #f3f4f6;
  position: relative;
}

.room-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.room-icon {
  position: absolute;
  bottom: 8px;
  left: 8px;
  background-color: white;
  border-radius: 50%;
  padding: 8px;
  color: #2563eb;
}

.room-content {
  padding: 16px;
}

.room-name {
  font-weight: 600;
  font-size: 18px;
  margin-bottom: 4px;
  color: #111827;
}

.room-description {
  color: #6b7280;
  font-size: 14px;
  margin-bottom: 12px;
}

.room-pricing {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.room-price {
  font-weight: 600;
  font-size: 20px;
    color: #2563eb;
}
.price-period {
  color: #6b7280;
  font-size: 14px;
}

.back-button-container {
  margin-bottom: 16px;
}

.back-button {
  display: flex;
  align-items: center;
  background-color: transparent;
  border: none;
  color: #2563eb;
  font-size: 16px;
  cursor: pointer;
  transition: color 0.2s ease;
}

.back-button:hover {
  color: #1d4ed8;
}

.form-container {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  padding: 24px;
}

.form-row {
  display: flex;
  gap: 16px;
}

.form-group {
  flex: 1;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #111827;
}

.form-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 16px;
  color: #111827;
  transition: border-color 0.2s ease;
}

.form-input:focus {
  border-color: #2563eb;
  outline: none;
}

.booking-summary {
  margin-top: 24px;
  padding: 16px;
  background-color: #f3f4f6;
  border-radius: 8px;
}

.summary-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nights-count {
  font-weight: 600;
  color: #111827;
}

.total-price {
  font-weight: 600;
  color: #2563eb;
}

.continue-button {
  width: 100%;
  padding: 12px;
  background-color: #2563eb;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.continue-button:disabled {
  background-color: #93c5fd;
  cursor: not-allowed;
}

.confirmation-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 40px;
}

.confirmation-container {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 24px;
}

.success-icon {
  width: 64px;
  height: 64px;
  background-color: #d1fae5;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
}

.confirmation-title {
  font-size: 24px;
  font-weight: 600;
  color: #16a34a;
  margin-bottom: 8px;
}

.confirmation-message {
  color: #6b7280;
  font-size: 16px;
  margin-bottom: 24px;
}

.confirmation-details {
  margin-top: 24px;
  padding: 16px;
  background-color: #f3f4f6;
  border-radius: 8px;
}

.details-title {
  font-weight: 600;
  color: #111827;
  margin-bottom: 12px;
}

.details-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  color: #111827;
}

.booking-code {
  font-weight: 600;
  color: #2563eb;
}

.paid-amount {
  font-weight: 600;
  color: #16a34a;
}

.home-button {
  margin-top: 24px;
  padding: 12px 24px;
  background-color: #2563eb;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.home-button:hover {
  background-color: #1d4ed8;
}

@media (min-width: 640px) {
  .rooms-grid {
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  }
}

@media (min-width: 768px) {
  .rooms-grid {
    grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
  }
}

@media (min-width: 1024px) {
  .rooms-grid {
    grid-template-columns: repeat(auto-fill, minmax(600px, 1fr));
  }
}

@media (min-width: 1280px) {
  .rooms-grid {
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  }
}

/* Spinner moderno */

.spinner {
  border: 6px solid #f3f3f3;
  border-top: 6px solid #2563eb;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Estilos adicionales para el modal */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}
.modal-fade-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}
.modal-fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
.modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  cursor: pointer;
  color: #6b7280;
  transition: color 0.2s ease;
}
.modal-close:hover {
  color: #111827;
}
.modal-image {
  width: 100%;
  height: 200px;
  background-color: #f3f4f6;
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-image img {
  max-width: 100%;
  max-height: 100%;
  object-fit: cover;
}
.modal-header {
  padding: 16px;
  color: #3D3D67;
}
.modal-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #111827;
}
.modal-body {
  padding: 16px;
  overflow-y: auto;
}
.modal-footer {
  padding: 16px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}
.modal-fade-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}
.modal-fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
.date-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
}
.room-price-info {
    margin-bottom: 1rem;
}

.room-summary {
    display: flex;
    align-items: center;
    background-color: #f3f4f638;
    padding: 16px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-bottom: 24px;
    gap: 16px;
    margin-bottom: 24px;
}

.room-summary img {
    object-fit: cover;
    border-radius: 8px;
    margin-right: 16px; 
    text-align: center;
}

.section-title {
    padding-bottom: 1rem;
}
</style>