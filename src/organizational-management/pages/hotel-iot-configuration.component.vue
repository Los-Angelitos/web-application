<template>
  <div class="container">
    <!-- Left Section - Form -->
    <div class="left-section">
      <h1 class="title">{{ getHotelName() }}</h1>
      <p class="subtitle">Hotel's IoT configuration</p>
      
      <div class="form-container">
        <p class="form-title">Complete the next form after you had booked our IoT services</p>
        
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label class="form-label">Name</label>
            <input 
              type="text" 
              class="form-input" 
              v-model="form.name"
              required
            >
          </div>
          
          <div class="form-group">
            <label class="form-label">Server IP Address</label>
            <input 
              type="text" 
              class="form-input" 
              v-model="form.serverIp"
              pattern="^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$"
              required
            >
          </div>
          
          <div class="form-group">
            <label class="form-label">Subnet Mask</label>
            <input 
              type="text" 
              class="form-input" 
              v-model="form.subnetMask"
              pattern="^([0-9]|[1-2][0-9]|3[0-2])$"
              required
            >
          </div>
          
          <button 
            type="submit" 
            class="submit-btn" 
            :disabled="loading"
          >
            <div v-if="loading" class="spinner"></div>
            {{ loading ? 'Saving...' : 'Save' }}
          </button>
          
          <div v-if="showSuccess" class="success-message">
            <span>✓</span>
            Configuration saved successfully!
          </div>
        </form>
      </div>
    </div>
    
    <!-- Right Section - Illustration -->
    <div class="right-section">
      <p class="description">
        Now with your own server within your local network, your customers 
        will be able to enjoy an unforgettable service. Forget about internet 
        failures and service unavailability!
      </p>
      
      <svg class="illustration" viewBox="0 0 500 350" xmlns="http://www.w3.org/2000/svg">
        <!-- Background elements -->
        <defs>
          <linearGradient id="serverGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#6c757d"/>
            <stop offset="100%" style="stop-color:#495057"/>
          </linearGradient>
          <linearGradient id="screenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#007bff"/>
            <stop offset="100%" style="stop-color:#0056b3"/>
          </linearGradient>
        </defs>
        
        <!-- Main Server Rack -->
        <rect x="100" y="120" width="90" height="150" fill="url(#serverGradient)" rx="8"/>
        
        <!-- Server panels -->
        <rect x="110" y="130" width="70" height="18" fill="#343a40" rx="3"/>
        <rect x="110" y="155" width="70" height="18" fill="#343a40" rx="3"/>
        <rect x="110" y="180" width="70" height="18" fill="#343a40" rx="3"/>
        <rect x="110" y="205" width="70" height="18" fill="#343a40" rx="3"/>
        <rect x="110" y="230" width="70" height="18" fill="#343a40" rx="3"/>
        <rect x="110" y="255" width="70" height="12" fill="#343a40" rx="3"/>
        
        <!-- LED indicators -->
        <circle cx="115" cy="139" r="2.5" fill="#28a745"/>
        <circle cx="122" cy="139" r="2.5" fill="#fd7e14"/>
        <circle cx="115" cy="164" r="2.5" fill="#28a745"/>
        <circle cx="122" cy="164" r="2.5" fill="#28a745"/>
        <circle cx="115" cy="189" r="2.5" fill="#28a745"/>
        <circle cx="122" cy="189" r="2.5" fill="#fd7e14"/>
        <circle cx="115" cy="214" r="2.5" fill="#28a745"/>
        <circle cx="122" cy="214" r="2.5" fill="#28a745"/>
        
        <!-- Secondary Server Rack -->
        <rect x="210" y="150" width="70" height="120" fill="url(#serverGradient)" rx="6"/>
        
        <!-- Secondary server panels -->
        <rect x="218" y="158" width="54" height="15" fill="#343a40" rx="2"/>
        <rect x="218" y="178" width="54" height="15" fill="#343a40" rx="2"/>
        <rect x="218" y="198" width="54" height="15" fill="#343a40" rx="2"/>
        <rect x="218" y="218" width="54" height="15" fill="#343a40" rx="2"/>
        <rect x="218" y="238" width="54" height="15" fill="#343a40" rx="2"/>
        <rect x="218" y="258" width="54" height="10" fill="#343a40" rx="2"/>
        
        <!-- Secondary LED indicators -->
        <circle cx="222" cy="165" r="2" fill="#28a745"/>
        <circle cx="228" cy="165" r="2" fill="#28a745"/>
        <circle cx="222" cy="185" r="2" fill="#28a745"/>
        <circle cx="228" cy="185" r="2" fill="#fd7e14"/>
        <circle cx="222" cy="205" r="2" fill="#28a745"/>
        <circle cx="228" cy="205" r="2" fill="#28a745"/>
        
        <!-- Network connections -->
        <path d="M190 180 Q200 170 210 180" stroke="#adb5bd" stroke-width="2" fill="none"/>
        <path d="M190 200 Q200 190 210 200" stroke="#adb5bd" stroke-width="2" fill="none"/>
        
        <!-- Laptop -->
        <rect x="350" y="200" width="80" height="50" fill="#495057" rx="4"/>
        <rect x="355" y="205" width="70" height="40" fill="#212529" rx="3"/>
        <rect x="360" y="210" width="60" height="30" fill="url(#screenGradient)" rx="2"/>
        
        <!-- Laptop base -->
        <ellipse cx="390" cy="250" rx="35" ry="6" fill="#6c757d"/>
        
        <!-- WiFi signals -->
        <g transform="translate(320, 140)">
          <path d="M0 20 Q15 0 30 20" stroke="#007bff" stroke-width="2.5" fill="none" opacity="0.8"/>
          <path d="M5 25 Q15 10 25 25" stroke="#007bff" stroke-width="2.5" fill="none" opacity="0.6"/>
          <path d="M10 30 Q15 20 20 30" stroke="#007bff" stroke-width="2.5" fill="none" opacity="0.4"/>
          <circle cx="15" cy="35" r="2" fill="#007bff"/>
        </g>
        
        <!-- IoT Devices -->
        <!-- Thermometer -->
        <g transform="translate(320, 80)">
          <rect x="0" y="0" width="12" height="30" fill="#e9ecef" rx="6"/>
          <circle cx="6" cy="35" r="6" fill="#dc3545"/>
          <rect x="4" y="8" width="4" height="22" fill="#dc3545"/>
          <text x="18" y="25" font-family="Arial" font-size="10" fill="#6c757d">°C</text>
        </g>
        
        <!-- Security Camera -->
        <g transform="translate(380, 60)">
          <rect x="0" y="0" width="25" height="12" fill="#495057" rx="2"/>
          <circle cx="20" cy="6" r="4" fill="#212529"/>
          <circle cx="20" cy="6" r="2" fill="#007bff"/>
          <rect x="25" y="4" width="8" height="4" fill="#6c757d" rx="1"/>
        </g>
        
        <!-- Door sensor -->
        <g transform="translate(420, 90)">
          <rect x="0" y="0" width="15" height="8" fill="#28a745" rx="2"/>
          <circle cx="3" cy="4" r="1.5" fill="#20c997"/>
          <circle cx="12" cy="4" r="1.5" fill="#20c997"/>
        </g>
        
        <!-- Connection lines -->
        <g stroke="#ced4da" stroke-width="1.5" stroke-dasharray="4,2" fill="none" opacity="0.7">
          <path d="M280 200 L350 220"/>
          <path d="M280 200 L330 100"/>
          <path d="M280 200 L385 75"/>
          <path d="M280 200 L425 100"/>
        </g>
      </svg>
    </div>
  </div>
</template>

<script>
import { HotelApiService } from '../services/hotel-api.service.js';
import { Hotel } from '../../shared/model/hotel.entity.js';
export default {
  name: 'HotelIoTConfigurationPage',
  data() {
    return {
      hotel: null,
      form: {
        name: '',
        serverIp: '',
        subnetMask: ''
      },
      loading: false,
      showSuccess: false,
      hotelService: new HotelApiService()
    }
  },
  async mounted() {
    await this.getHotel();
  },
  methods: {
    getHotelName() {
        return this.hotel ? this.hotel.name : 'Unknown Hotel';
    },
    async getHotel() {
        try {
            let hotelId = localStorage.getItem("hotelId");

            if (!hotelId) {
                hotelId = this.$route.params.id;
            }

            const response = await this.hotelService.getHotelById(hotelId);
            if (response.status === 200) {
                this.hotel = Hotel.fromDisplayableHotel(response.data);
                console.log('Hotel data fetched successfully:', this.hotel);
            } else {
                console.error('Failed to fetch hotel data:', response.status, response.statusText);
            }

        }catch (error) {
          console.error('Error fetching hotel data:', error);
         
        }
    },
    async handleSubmit() {
      this.loading = true;
      this.showSuccess = false;
      
      try {
        // Simulate API request
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Log form data (simulate sending to backend)
        console.log('Sending IoT configuration:', this.form);
        
        // Show success message
        this.showSuccess = true;
        
        // Hide success message after 4 seconds
        setTimeout(() => {
          this.showSuccess = false;
        }, 4000);
        
      } catch (error) {
        console.error('Error:', error);
        alert('Error saving configuration. Please try again.');
      } finally {
        this.loading = false;
      }
    }
  }
}
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  display: flex;
  gap: 60px;
  align-items: flex-start;
  min-height: 100vh;
}

.left-section {
  flex: 1;
  max-width: 400px;
}

.right-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.title {
  font-size: 32px;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 8px;
  line-height: 1.2;
}

.subtitle {
  font-size: 16px;
  color: #6c757d;
  margin-bottom: 40px;
  font-weight: 400;
}

.form-container {
  background: white;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid #e9ecef;
}

.form-title {
  font-size: 16px;
  color: #495057;
  margin-bottom: 24px;
  font-weight: 500;
  line-height: 1.4;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  font-size: 14px;
  color: #495057;
  margin-bottom: 6px;
  font-weight: 500;
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #ced4da;
  border-radius: 6px;
  font-size: 14px;
  color: #495057;
  background-color: #fff;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.submit-btn {
  width: 100%;
  padding: 12px 24px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.submit-btn:hover:not(:disabled) {
  background-color: #0056b3;
  transform: translateY(-1px);
}

.submit-btn:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
  transform: none;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.description {
  text-align: center;
  color: #8e8e93;
  font-size: 16px;
  line-height: 1.5;
  margin-bottom: 40px;
  max-width: 400px;
}

.illustration {
  width: 100%;
  max-width: 450px;
  height: auto;
}

.success-message {
  background-color: #d1ecf1;
  color: #0c5460;
  padding: 12px 16px;
  border-radius: 6px;
  margin-top: 16px;
  border: 1px solid #bee5eb;
  display: flex;
  align-items: center;
  gap: 8px;
}

@media (max-width: 768px) {
  .container {
    flex-direction: column;
    gap: 40px;
    padding: 20px;
  }
  
  .left-section {
    max-width: 100%;
  }
  
  .title {
    font-size: 28px;
  }
}
</style>