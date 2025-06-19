<template>
  <MainPageNavigation
      :navigationItems="navigationItems"
  />
  <div class="organization-container">
    <div class="org-header">
      <h1>{{ hotelName }}</h1>
      <span class="subtitle">Organization</span>
      <button-component
          text="Add Admin"
          state="primary"
          class="add-button"
          :width="70"
          :height="50"
          @click="showModal = true"
      />
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="loading-container">
      <div class="loading-spinner-large"></div>
      <p>Loading organization...</p>
    </div>

    <!-- Organization Cards -->
    <div v-else class="org-cards-container">
      <!-- Owner/Guest Card -->
      <div class="section">
        <h2 class="section-title">Chief Executive Officer (CEO)</h2>
        <div class="cards-grid">
          <div class="org-card owner-card" v-if="guestData">
            <div class="card-header">
              <div class="avatar-large">
                <img :src="guestData.photoURL || 'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg'" 
                     alt="Guest avatar" />
              </div>
              <div class="status-badge owner-badge">
                Owner
              </div>
            </div>
            <div class="card-content">
              <h3 class="member-name">{{ guestData.name }} {{ guestData.surname }}</h3>
              <p class="member-title">Hotel Owner</p>
              <div class="member-details">
                <div class="detail-item">
                  <span class="detail-label">Email:</span>
                  <span class="detail-value">{{ guestData.email || 'N/A' }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Join Date:</span>
                  <span class="detail-value">{{ formatDate(guestData.createdAt) || 'N/A' }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="org-card error-card" v-else>
            <div class="card-header">
              <div class="avatar-large">
                <img src="https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg" 
                     alt="Default avatar" />
              </div>
            </div>
            <div class="card-content">
              <h3 class="member-name">Error</h3>
              <p class="member-title">Hotel Owner</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Administrators Section -->
      <div class="section">
        <h2 class="section-title">
          Administrators
          <span class="member-count">({{ administrators.length }})</span>
        </h2>
        
        <div class="cards-grid" v-if="administrators.length > 0">
          <div class="org-card admin-card" v-for="admin in administrators" :key="admin.id">
            <div class="card-header">
              <div class="avatar-large">
                <img :src="admin.photoURL || 'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg'" 
                     alt="Administrator avatar" />
              </div>
              <div class="status-badge admin-badge">
                Administrator
              </div>
              <div class="card-actions">
                <button class="action-btn" @click="editAdmin(admin)" title="Edit administrator">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                </button>
                <button class="action-btn danger" @click="removeAdmin(admin)" title="Remove administrator">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3,6 5,6 21,6"></polyline>
                    <path d="m19,6v14a2,2 0 0,1-2,2H7a2,2 0 0,1-2-2V6m3,0V4a2,2 0 0,1 2-2h4a2,2 0 0,1 2,2v2"></path>
                  </svg>
                </button>
              </div>
            </div>
            <div class="card-content">
              <h3 class="member-name">{{ admin.name }} {{ admin.surname }}</h3>
              <p class="member-title">Administrator</p>
              <div class="member-details">
                <div class="detail-item">
                  <span class="detail-label">Email:</span>
                  <span class="detail-value">{{ admin.email }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Join Date:</span>
                  <span class="detail-value">{{ formatDate(admin.createdAt) }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Status:</span>
                  <span class="detail-value status-active">Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="empty-state" v-else>
          <div class="empty-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
            </svg>
          </div>
          <h3>No administrators found</h3>
          <p>There are no administrators assigned to this hotel yet. Add one to get started.</p>
        </div>
      </div>
    </div>

    <!-- Add Administrator Modal -->
    <div v-if="showModal" class="modal-overlay" @click="closeOnOverlayClick && closeModal()">
      <div class="modal-container" @click.stop>
        <div class="modal-content">
          <div class="modal-icon">
            <div class="icon-circle">
              <svg xmlns="http://www.w3.org/2000/svg" class="user-plus-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <line x1="19" y1="8" x2="19" y2="14"></line>
                <line x1="16" y1="11" x2="22" y2="11"></line>
              </svg>
            </div>
          </div>

          <div class="modal-header">
            <h3>Add Administrator</h3>
          </div>

          <div class="modal-body">
            <div class="input-group">
              <label for="email">Email Address</label>
              <input
                  type="email"
                  id="email"
                  v-model="email"
                  placeholder="Enter administrator email"
                  class="form-input"
              />
            </div>
          </div>

          <form @submit.prevent="saveUser" class="modal-footer">
            <button-component
                text="Send Invitation"
                state="primary"
                :width="100"
                :loading="isAddingAdmin"
            />
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ButtonComponent from "../../shared/components/button.component.vue";
import MainPageNavigation from "../components/main-page-navigation.component.vue";
import OverviewIcon from "../../assets/organizational-management/overview-icon.svg";
import AnalyticsIcon from "../../assets/organizational-management/analytics-icon.svg";
import ProvidersIcon from "../../assets/organizational-management/providers-icon.svg";
import InventoryIcon from "../../assets/organizational-management/inventory-icon.svg";
import RoomsIcon from "../../assets/organizational-management/rooms-icon.svg";
import OrganizationIcon from "../../assets/organizational-management/organization-icon.svg";
import DevicesIcon from "../../assets/organizational-management/devices-icon.svg";
import { OrganizationApiService } from "../services/organization-api.service.js";
import i18n from "../../i18n.js";
import {HotelsApiService} from "../../shared/services/hotels-api.service.js";
import {UserProfileService} from "../../iam/services/user-profile.service.js";
import ReservationsIcon from "../../assets/organizational-management/reservations-icon.svg";

export default {
  name: "OrganizationPage",
  computed: {
    i18n() {
      return i18n
    }
  },
  components: {
    MainPageNavigation,
    ButtonComponent,
  },
  data() {
    return {
      hotelName: "",
      hotelId: null,
      roleId: null,
      showModal: false,
      email: '',
      closeOnOverlayClick: true,
      guestData: null,
      administrators: [],
      isLoading: true,
      isAddingAdmin: false,
      navigationItems: [
        {id: "overview", label: "Overview", path: "", icon: OverviewIcon, isActive: true},
        {id: "analytics", label: "Analytics", path: "", icon: AnalyticsIcon, isActive: false},
        {id: "providers", label: "Providers", path: "", icon: ProvidersIcon, isActive: false},
        {id: "inventory", label: "Inventory", path: "", icon: InventoryIcon, isActive: false},
        {id: "rooms", label: "Rooms", path: "", icon: RoomsIcon, isActive: false},
        {id: "organization", label: "Organization", path: "", icon: OrganizationIcon, isActive: false},
        {id: "devices", label: "Devices", path: "", icon: DevicesIcon, isActive: false}
      ],
      organizationService: new OrganizationApiService(),
      hotelService: new HotelsApiService()
    };
  },
  async mounted() {
    this.hotelId = this.$route.params.id || null;
    this.roleId = localStorage.getItem("roleId") || null;
    console.log("Hotel ID from route:", this.hotelId);

    await this.loadNavigationItems();
    await this.loadOrganizationData();
  },
  methods: {
    async loadOrganizationData() {
      try {
        this.isLoading = true;
        
        // Load data in parallel
        await Promise.all([
          this.getHotelById(),
          this.loadGuestData(),
          this.loadAdministrators()
        ]);
        
      } catch (error) {
        console.error("Error loading organization data:", error);
      } finally {
        this.isLoading = false;
      }
    },

    async getHotelById() {
      try {
        const response = await HotelsApiService.getHotelsById(this.hotelId);
        this.hotelName = response?.name || "";
      } catch(e) {
        console.error("Error fetching hotel by id: ", e);
      }
    },

    async loadAdministrators() {
      try {
        console.log(`Loading administrators for hotel ID: ${this.hotelId}`);
        
        // Simulate API call - replace with actual API service
        const response = await this.simulateAdministratorsAPI();
        
        if (response && response.data) {
          this.administrators = response.data;
          this.administrators.forEach(admin => {
            admin.photoURL = 'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg';
          });
          console.log('Administrators loaded successfully:', this.administrators);
        } else {
          console.warn('No administrators data received from API');
          this.administrators = [];
        }

      } catch (error) {
        console.error('Error loading administrators:', error);
        this.administrators = [];
      }
    },

    async simulateAdministratorsAPI() {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data - replace this with actual API call
      const mockAdministrators = [
        {
          id: 1,
          name: 'Mauricio',
          surname: 'Rojas',
          email: 'mauricio.rojas@hotel.com',
          photoURL: '../../assets/images/admin.png',
          createdAt: '2024-01-15T10:30:00Z',
          hotelId: this.hotelId,
          status: 'active'
        },
        {
          id: 2,
          name: 'Arian',
          surname: 'Rodriguez',
          email: 'arian.rodriguez@hotel.com',
          photoURL: '../../assets/images/admin.png',
          createdAt: '2024-02-20T14:15:00Z',
          hotelId: this.hotelId,
          status: 'active'
        },
        {
          id: 3,
          name: 'Sofia',
          surname: 'Martinez',
          email: 'sofia.martinez@hotel.com',
          photoURL: null,
          createdAt: '2024-03-10T09:45:00Z',
          hotelId: this.hotelId,
          status: 'active'
        }
      ];

      return {
        data: mockAdministrators,
        status: 200,
        message: 'Administrators retrieved successfully'
      };
    },

    async loadNavigationItems() {
      if(this.roleId == 1) {
        console.log("Role ID is 1, setting navigation paths accordingly");
        this.navigationItems.forEach(item => {
          item.path = `/home/hotel/${this.hotelId}/${item.id}`;
        });
      } else if(this.roleId == 2) {
        console.log("Role ID is 2, setting navigation paths accordingly");
        const itemsAdmin = [
          {id: "overview", label: "Overview", path: `/home/hotel/${this.hotelId}/overview`, icon: OverviewIcon, isActive: true},
          {id: "analytics", label: "Analytics", path: `/home/hotel/${this.hotelId}/analytics`, icon: AnalyticsIcon, isActive: false},
          {id: "reservations", label: "Reservations", path: `/home/hotel/${this.hotelId}/reservations`, icon: ReservationsIcon, isActive: false},
          {id: "rooms", label: "Rooms", path: `/home/hotel/${this.hotelId}/rooms`, icon: RoomsIcon, isActive: false}
        ];

        this.navigationItems.splice(0, this.navigationItems.length, ...itemsAdmin);
      }
      
      try {
        this.navigationItems.forEach(item => {
          item.isActive = item.path === this.$route.path;
        });
      } catch (error) {
        console.error("Error loading navigation items:", error);
      }
    },

    async loadGuestData() {
      try {
        const guestId = this.getGuestIdFromToken();

        if (!guestId) {
          console.error('Guest ID not found in token');
          this.guestData = null;
          return;
        }

        console.log('Loading guest data for ID:', guestId);
        const response = await this.organizationService.getOwnerById(guestId);

        if (response && response.data) {
          this.guestData = response.data;
          this.guestData.photoUrl = 'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg';
          console.log('Guest data loaded successfully:', this.guestData);
        } else {
          console.warn('No data received from API');
          this.guestData = null;
        }

      } catch (error) {
        console.error('Error loading guest data:', error);
        this.guestData = null;
      }
    },

    getGuestIdFromToken() {
      try {
        const token = localStorage.getItem('token') || this.$store.getters.getToken;

        if (!token) {
          console.error('No token found');
          return null;
        }

        const tokenParts = token.split('.');
        if (tokenParts.length !== 3) {
          console.error('Invalid token structure');
          return null;
        }

        const base64Url = tokenParts[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

        const padLength = 4 - (base64.length % 4);
        const paddedBase64 = base64 + '='.repeat(padLength % 4);

        const jsonPayload = decodeURIComponent(
            atob(paddedBase64)
                .split('')
                .map(function(c) {
                  return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                })
                .join('')
        );

        const decoded = JSON.parse(jsonPayload);
        console.log('Decoded token:', decoded);

        const guestId = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/sid"];

        const currentTime = Math.floor(Date.now() / 1000);
        if (decoded.exp && decoded.exp < currentTime) {
          console.error('Token has expired');
          return null;
        }

        return guestId ? parseInt(guestId) : null;
      } catch (error) {
        console.error('Error decoding token:', error);
        return null;
      }
    },

    async saveUser() {
      if (this.email.trim() === '') {
        alert(this.$t('organization.modal.validation.emailRequired'));
        return;
      }

      try {
        this.isAddingAdmin = true;
        
        // Simulate API call to add administrator
        await this.simulateAddAdminAPI(this.email);
        
        alert(this.$t('organization.modal.successMessage', { email: this.email }));
        
        // Reload administrators list
        await this.loadAdministrators();
        
        this.email = '';
        this.showModal = false;
        
      } catch (error) {
        console.error('Error adding administrator:', error);
        alert(this.$t('organization.modal.errorMessage'));
      } finally {
        this.isAddingAdmin = false;
      }
    },

    async simulateAddAdminAPI(email) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock successful response
      return {
        data: {
          id: Date.now(),
          email: email,
          hotelId: this.hotelId,
          status: 'pending'
        },
        status: 201,
        message: 'Administrator invitation sent successfully'
      };
    },

    editAdmin(admin) {
      console.log('Editing admin:', admin);
      // Implement edit functionality
      alert(`Edit admin: ${admin.name} ${admin.surname}`);
    },

    async removeAdmin(admin) {
      if (confirm(this.$t('organization.actions.confirmRemove', { name: `${admin.name} ${admin.surname}` }))) {
        try {
          // Simulate API call to remove administrator
          await this.simulateRemoveAdminAPI(admin.id);
          
          // Remove from local list
          this.administrators = this.administrators.filter(a => a.id !== admin.id);
          
          alert(this.$t('organization.actions.removeSuccess'));
          
        } catch (error) {
          console.error('Error removing administrator:', error);
          alert(this.$t('organization.actions.removeError'));
        }
      }
    },

    async simulateRemoveAdminAPI(adminId) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        status: 200,
        message: 'Administrator removed successfully'
      };
    },

    formatDate(dateString) {
      if (!dateString) return 'N/A';

    },

    closeModal() {
      this.showModal = false;
      this.email = '';
    }
  }
};
</script>

<style scoped>
.organization-container {
  display: flex;
  flex-direction: column;
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.org-header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  position: relative;
  margin-bottom: 30px;
}

.org-header h1 {
  font-size: 28px;
  margin: 0;
  font-weight: bold;
  color: #1a1a1a;
}

.subtitle {
  font-size: 16px;
  color: #666;
  margin-top: 4px;
}

.add-button {
  position: absolute;
  right: 0;
  top: 0;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
}

.loading-spinner-large {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #0066cc;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

.org-cards-container {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.section {
  display: flex;
  flex-direction: column;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.member-count {
  font-size: 16px;
  color: #666;
  font-weight: normal;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

.org-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid #e5e7eb;
}

.org-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.owner-card {
  border-left: 4px solid #0066cc;
}

.admin-card {
  border-left: 4px solid #16a34a;
}

.error-card {
  border-left: 4px solid #dc2626;
}

.card-header {
  position: relative;
  padding: 20px 20px 0 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.avatar-large {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  background-color: #f3f4f6;
  border: 3px solid #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.avatar-large img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.status-badge {
  position: absolute;
  top: 15px;
  right: 15px;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.owner-badge {
  background-color: #dbeafe;
  color: #1e40af;
}

.admin-badge {
  background-color: #dcfce7;
  color: #166534;
}

.card-actions {
  position: absolute;
  top: 15px;
  left: 15px;
  display: flex;
  gap: 4px;
}

.action-btn {
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 6px;
  background-color: #f8fafc;
  color: #64748b;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background-color: #e2e8f0;
  color: #475569;
}

.action-btn.danger:hover {
  background-color: #fecaca;
  color: #dc2626;
}

.card-content {
  padding: 20px;
  text-align: center;
}

.member-name {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 4px 0;
}

.member-title {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 16px 0;
}

.member-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
  text-align: left;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
}

.detail-label {
  color: #6b7280;
  font-weight: 500;
}

.detail-value {
  color: #1a1a1a;
  font-weight: 400;
}

.status-active {
  color: #16a34a !important;
  font-weight: 600 !important;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  background-color: #f9fafb;
  border-radius: 12px;
  border: 2px dashed #d1d5db;
}

.empty-icon {
  margin-bottom: 16px;
  color: #9ca3af;
}

.empty-state h3 {
  font-size: 18px;
  font-weight: 600;
  color: #374151;
  margin: 0 0 8px 0;
}

.empty-state p {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3500;
}

.modal-container {
  background-color: #fff;
  border-radius: 12px;
  max-width: 90%;
  width: 400px;
  overflow: hidden;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.modal-content {
  display: flex;
  flex-direction: column;
  padding: 24px;
  align-items: center;
}

.modal-icon {
  margin-bottom: 16px;
}

.icon-circle {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: #dbeafe;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1e40af;
}

.user-plus-icon {
  width: 24px;
  height: 24px;
}

.modal-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 20px 0;
  text-align: center;
}

.modal-body {
  width: 100%;
}

.input-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
}

.input-group label {
  font-size: 14px;
  color: #374151;
  margin-bottom: 6px;
  font-weight: 500;
}

.form-input {
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  width: 100%;
  box-sizing: border-box;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.form-input:focus {
  border-color: #0066cc;
  outline: none;
  box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
}

.modal-footer {
  margin-top: 24px;
  width: 100%;
  display: flex;
  justify-content: center;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Responsive Design */
@media (max-width: 768px) {
  .organization-container {
    padding: 16px;
  }
  
  .org-header h1 {
    font-size: 24px;
  }
  
  .cards-grid {
    grid-template-columns: 1fr;
  }
  
  .add-button {
    position: static;
    margin-top: 16px;
    align-self: flex-start;
  }
  
  .org-header {
    flex-direction: column;
    align-items: stretch;
  }
}

@media (max-width: 480px) {
  .org-card {
    margin: 0 -4px;
  }
  
  .card-header {
    padding: 16px 16px 0 16px;
  }
  
  .card-content {
    padding: 16px;
  }
  
  .modal-container {
    width: 95%;
    margin: 0 auto;
  }
}
.modal-container {
    width: 100%;
    max-width: 400px;
    margin: 0 auto;
  }
  
  .modal-content {
    padding: 16px;
  }
  
  .modal-header h3 {
    font-size: 16px;
  }
  
  .modal-body {
    padding: 0;
  }
  
  .input-group {
    margin-bottom: 12px;
  }
  
  .form-input {
    font-size: 14px;
  }
  .modal-footer {
    margin-top: 16px;
  }
  .modal-footer button-component {
    width: 100%;
  }
  .modal-icon {
    margin-bottom: 12px;
  }
  .icon-circle {
    width: 40px;
    height: 40px;
  }
  .user-plus-icon {
    width: 20px;
    height: 20px;
  }
  .modal-header h3 {
    font-size: 18px;
  }
  .modal-body {
    padding: 16px;
  }
  .input-group label {
    font-size: 14px;
  }
  .form-input {
    font-size: 14px;
    padding: 10px 12px;
  }
  .modal-footer {
    margin-top: 20px;
  }
  .modal-footer button-component {
    width: 100%;
  }
</style>