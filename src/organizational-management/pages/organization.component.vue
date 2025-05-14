<template>
  <MainPageNavigation
      :navigationItems="navigationItems"
  />
  <div class="organization-container">
    <!-- Header Section -->
    <div class="org-header">
      <h1>Royal Decameron Punta Sal</h1>
      <span class="subtitle">{{ $t('organization.title') }}</span>
      <button-component
          :text="$t('organization.header.addButton')"
          state="primary"
          class="add-button"
          :width="70"
          :height="28"
          @click="showModal = true"
      />
    </div>

    <!-- Org Chart -->
    <div class="org-chart">
      <!-- Level 1 -->
      <div class="level level-1">
        <div class="node">
          <div class="avatar-container">
            <div class="avatar">
              <img src="../../assets/images/owner.png" :alt="$t('organization.chart.ownerAlt')" />
            </div>
          </div>
          <div class="node-info">
            <div class="name">Carlo Rebagliati</div>
            <div class="title">{{ $t('organization.chart.ownerTitle') }}</div>
          </div>
        </div>
      </div>

      <!-- Connection lines -->
      <div class="connections">
        <div class="vertical-line"></div>
        <div class="horizontal-line"></div>
        <div class="left-vertical-line"></div>
        <div class="right-vertical-line"></div>
      </div>

      <!-- Level 2 -->
      <div class="level level-2">
        <div class="node-container">
          <div class="node">
            <div class="avatar-container">
              <div class="avatar">
                <img src="../../assets/images/admin.png" :alt="$t('organization.chart.adminAlt')" />
              </div>
            </div>
            <div class="node-info">
              <div class="name">Mauricio Rojas</div>
              <div class="title">{{ $t('organization.chart.adminTitle') }}</div>
            </div>
          </div>

          <div class="node">
            <div class="avatar-container">
              <div class="avatar">
                <img src="../../assets/images/admin.png" :alt="$t('organization.chart.adminAlt')" />
              </div>
            </div>
            <div class="node-info">
              <div class="name">Arian Rodriguez</div>
              <div class="title">{{ $t('organization.chart.adminTitle') }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Invite Admin Modal -->
    <div v-if="showModal" class="modal-overlay" @click="closeOnOverlayClick && closeModal()">
      <div class="modal-container" @click.stop>
        <div class="modal-content">
          <!-- Icon -->
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

          <!-- Title -->
          <div class="modal-header">
            <h3>{{ $t('organization.modal.title') }}</h3>
          </div>

          <!-- Email field -->
          <div class="modal-body">
            <div class="input-group">
              <label for="email">{{ $t('organization.modal.emailLabel') }}</label>
              <input
                  type="email"
                  id="email"
                  v-model="email"
                  :placeholder="$t('organization.modal.emailPlaceholder')"
                  class="form-input"
              />
            </div>
          </div>

          <form @submit.prevent="saveUser" class="modal-footer">
            <button-component
                :text="$t('organization.modal.submitButton')"
                state="primary"
                :width="100"
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

export default {
  name: "OrganizationPage",
  components: {
    MainPageNavigation,
    ButtonComponent,
  },
  data() {
    return {
      showModal: false,
      email: '',
      closeOnOverlayClick: true,
      navigationItems: [
        {id: "overview", label: "Overview", path: "/home/hotel/1/overview", icon: OverviewIcon, isActive: false},
        {id: "analytics", label: "Analytics", path: "/home/hotel/1/analytics", icon: AnalyticsIcon, isActive: false},
        {id: "providers", label: "Providers", path: "/home/hotel/1/providers", icon: ProvidersIcon, isActive: false},
        {id: "inventory", label: "Inventory", path: "/home/hotel/1/inventory", icon: InventoryIcon, isActive: false},
        {id: "rooms", label: "Rooms", path: "/home/hotel/1/rooms", icon: RoomsIcon, isActive: false},
        {id: "organization", label: "Organization", path: "/home/hotel/1/organization", icon: OrganizationIcon, isActive: true},
        {id: "devices", label: "Devices", path: "/home/hotel/1/set-up/devices", icon: DevicesIcon, isActive: false}
      ],
    };
  },
  methods: {
    saveUser() {
      if (this.email.trim() === '') {
        alert(this.$t('organization.modal.validation.emailRequired'));
        return;
      } else {
        alert(this.$t('organization.modal.successMessage', { email: this.email }));
      }
      this.email = '';
      this.showModal = false;
    },
    closeModal() {
      this.showModal = false;
    }
  }
};
</script>

<style scoped>
.organization-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.org-header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  position: relative;
  margin-bottom: 40px;
}

.org-header h1 {
  font-size: 24px;
  margin: 0;
  font-weight: bold;
}

.subtitle {
  font-size: 16px;
  color: #666;
}

.add-button {
  position: absolute;
  right: 0;
  top: 0;
}

.org-chart {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  position: relative;
}

.level {
  display: flex;
  justify-content: center;
  width: 100%;
  margin-bottom: 80px;
}

.level-2 .node-container {
  display: flex;
  justify-content: space-between;
  width: 80%;
}

.node {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.avatar-container {
  margin-bottom: 10px;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  background-color: #ddd;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.node-info {
  text-align: center;
}

.name {
  font-weight: bold;
  margin-bottom: 5px;
}

.title {
  color: #666;
  font-size: 14px;
}

.connections {
  position: absolute;
  top: 110px;
  width: 80%;
  height: 200px;
}

.vertical-line {
  position: absolute;
  top: 30px;
  left: 50%;
  width: 1px;
  height: 20px;
  background-color: #ccc;
}

.horizontal-line {
  position: absolute;
  top: 50px;
  left: 20%;
  width: 60%;
  height: 1px;
  background-color: #ccc;
}

.left-vertical-line {
  position: absolute;
  top: 50px;
  left: 20%;
  width: 1px;
  height: 50px;
  background-color: #ccc;
}

.right-vertical-line {
  position: absolute;
  top: 50px;
  left: 80%;
  width: 1px;
  height: 50px;
  background-color: #ccc;
}

/* Modal */
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
  z-index: 100;
}

.modal-container {
  background-color: #fff;
  border-radius: 8px;
  max-width: 90%;
  width: 400px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.modal-content {
  display: flex;
  flex-direction: column;
  padding: 20px;
  align-items: center;
}

.modal-icon {
  margin-bottom: 15px;
}

.icon-circle {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: #e6f0ff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0066cc;
}

.user-plus-icon {
  width: 24px;
  height: 24px;
}

.modal-header h3 {
  font-size: 18px;
  font-weight: 500;
  color: #333;
  margin: 0 0 20px 0;
  text-align: center;
}

.modal-body {
  width: 100%;
}

.input-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
}

.input-group label {
  font-size: 14px;
  color: #666;
  margin-bottom: 6px;
}

.form-input {
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  width: 100%;
  box-sizing: border-box;
}

.form-input:focus {
  border-color: #0066cc;
  outline: none;
  box-shadow: 0 0 0 2px rgba(0, 102, 204, 0.2);
}

.modal-footer {
  margin-top: 20px;
  width: 100%;
  display: flex;
  justify-content: center;
}
</style>
