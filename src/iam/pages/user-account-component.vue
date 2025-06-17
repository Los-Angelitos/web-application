<script>
import BreadCrumb from "../../shared/components/breadcrumb.component.vue";
import userIcon from "../../assets/iam/user-icon.svg";
import preferencesIcon from "../../assets/iam/preferences-icon.svg";
import reservationsIcon from "../../assets/iam/schedule-icon.svg";
import logoutIcon from "../../assets/iam/logout-icon.svg";
import userMock from "../../mocks/iam/user-profile-account.json";
import i18n from "../../i18n.js";
import { UserProfileService } from "../services/user-profile.service.js";
import {User} from "../model/user.entity.js";
import { HttpStatusCode } from "axios";


export default {
  name: 'ProfileView',
  components: {
    BreadCrumb
  },
  data() {
    return {
      breadcrumbPath: [
        { name: 'Account', route: '' }
      ],
      activeTab: 'personal',
      user: null,
      defaultAvatar: 'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg',
      menuItems: [
        { 
          id: 'personal', 
          label: 'Personal Information',
          labelES: 'Información personal',
          icon: userIcon
        },
        { 
          id: 'preferences', 
          label: 'My preferences as a Guest',
          labelES: 'Mis preferencias como Huésped',
          icon: preferencesIcon
        },
        { 
          id: 'reservations', 
          label: 'My Reservations',
          labelES: 'Mis Reservas',
          icon: reservationsIcon
        },
        {
          id: 'hotel-configuration',
          label: 'Hotel Configuration',
          labelES: 'Configuración del Hotel',
          icon: preferencesIcon
        },
        { 
          id: 'logout', 
          label: 'Logout',
          labelES: 'Cerrar sesión',
          icon: logoutIcon
        }
      ],
      chevronIcon: '<svg xmlns="http://www.w3.org/2000/svg" class="chevron" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>',
      userProfileService: new UserProfileService()
    }
  },
  mounted() {
    this.fetchUserData();
  },
  computed: {
    i18n() {
      return i18n
    }
  },
  methods: {
    navigateTo(routeName) {
      console.log('Navigating to:', routeName);
      switch(routeName) {
        case 'personal':
          this.$router.push('/home/profile/' + this.user.id + '/account');
          break;
        case 'preferences':
          this.$router.push('/home/profile/' + this.user.id + '/preferences');
          break;
        case 'reservations':
          this.$router.push('/home/profile/' + this.user.id + '/reservations');
          break;
        case 'logout':
          this.$router.push('/home/logout');
          break;
        case 'hotel-configuration':
          this.$router.push('/home/hotel/' + this.user.hotelId + '/configuration');
        default:
          console.error('Unknown route:', routeName);
      }
    },
    async fetchUserData() {
      const userId = localStorage.getItem('userId');
      const roleId = localStorage.getItem('roleId');

      if (!userId || !roleId) {
        console.error('User ID or Role ID not found in localStorage');
        return;
      }

      try {
        let response = null;
        if(roleId == 3) {
          response =  await this.userProfileService.getGuestById(userId);
        }else if(roleId == 2) {
          response = await this.userProfileService.getAdminById(userId);
        }else if(roleId == 1) {
          response = await this.userProfileService.getOwnerById(userId);
        } else {
          console.error('Invalid role ID:', roleId);
          return;
        }

        if(response.status === HttpStatusCode.Ok) {
          this.user = User.fromDisplayableUser(response.data);
          console.log('User data fetched successfully:', this.user);

          this.breadcrumbPath[0].route = '/home/profile/' + this.user.id;
        }
      }catch(e) {
        console.error('Error fetching user data:', e);
      }

    },
    obtainRole(type) {
      switch (type) {
        case 2:
          return 'Administrator';
        case 3:
          return 'Guest';
        case 1:
          return 'Owner';
        default:
          return 'Unknown';
      }
    },
    knowLanguage(item) {
      return this.$i18n.locale === 'en' ? item.label : item.labelES;
    },
    shouldDisplayItem(item) {
      if (!this.user) return false;

      const roleId = this.user.roleId;

      // Oculta 'preferences' y 'reservations' si NO es Guest (3)
      if ((item.id === 'preferences' || item.id === 'reservations') && roleId !== 3) {
        return false;
      }

      // 'hotel-configuration' solo visible para Owner (1)
      if (item.id === 'hotel-configuration' && roleId !== 1) {
        return false;
      }

      return true; // Mostrar todo lo demás
    }

  }
}
</script>

<!-- ProfileView.vue -->
<template>
  <BreadCrumb :path="breadcrumbPath" class="breadcrumb" />

  <div class="profile-container" v-if="user">
    <div class="profile-header"></div>

    <!-- Profile Info -->
    <div class="profile-info">
      <div class="profile-image-container">
        <img 
          :src="user.photoURL || defaultAvatar"
          :alt="user.name" 
          alt="Profile picture" 
          class="profile-image"
        />
        <div class="status-indicator"></div>
      </div>
      
      <div class="profile-details">
        <h2>{{ user.name }}</h2>
        <p>{{ obtainRole(user.roleId) }}</p>
      </div>
    </div>
    
    <!-- Navigation Menu -->
    <nav class="profile-menu">
      <button 
      v-for="item in menuItems.filter(shouldDisplayItem)" 
      :key="item.id"
      class="menu-item"
      :class="{ 'active': activeTab === item.id, 'logout': item.id === 'logout' }"
      @click="activeTab = item.id; navigateTo(item.id)"
    >
        <div class="menu-item-content">
          <img 
            v-if="item.icon" 
            :src="item.icon" 
            alt="" 
            class="menu-icon"
          />
          <span class="menu-label">{{ knowLanguage(item) }}</span>
        </div>
        <span v-if="item.id !== 'logout'" class="chevron-icon" v-html="chevronIcon"></span>
      </button>
    </nav>
    
    <!-- Footer -->
    <div class="profile-footer">
      <p>SweetManager</p>
    </div>
  </div>
</template>

<style scoped>

.breadcrumb {
  margin: 0 2rem;
}
.profile-container {
  max-width: 500px;
  margin: 0 auto;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin: 2rem auto;
}

.profile-header {
  background: var(--primary-color);
  padding: 24px;
  color: white;
}

.profile-header h1 {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
}

.profile-info {
  display: flex;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #e5e7eb;
}

.profile-image-container {
  position: relative;
}

.profile-image {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.status-indicator {
  position: absolute;
  bottom: 10%;
  right: 5%;
  width: 16px;
  height: 16px;
  background-color: #10b981; /* Verde para online */
  border-radius: 50%;
  border: 2px solid white;
}

.profile-details {
  margin-left: 16px;
}

.profile-details h2 {
  margin: 0 0 4px 0;
  font-size: 20px;
  font-weight: 700;
}

.profile-details p {
  margin: 0;
  color: #6b7280;
}

/* Menú de navegación */
.profile-menu {
  display: flex;
  flex-direction: column;
}

.menu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 16px 24px;
  text-align: left;
  background: none;
  border: none;
  border-bottom: 1px solid #e5e7eb;
  cursor: pointer;
  transition: background-color 0.2s;
}

.menu-item:hover {
  background-color: #f9fafb;
}

.menu-item.active {
  background-color: #f0f7ff;
}

.menu-item-content {
  display: flex;
  align-items: center;
}

.menu-icon {
  display: flex;
  align-items: center;
  margin-right: 12px;
}

.menu-icon svg {
  width: 20px;
  height: 20px;
}

.icon-personal {
  color: #4f46e5; /* Índigo */
}

.icon-preferences {
  color: #ec4899; /* Rosa */
}

.icon-reservations {
  color: #10b981; /* Verde */
}

.icon-settings {
  color: #6b7280; /* Gris */
}

.icon-logout {
  color: #C13515; /* Rojo */
}

.menu-label {
  font-size: 16px;
  color: #1f2937;
}

.menu-item.logout .menu-label {
  color: #C13515;
  font-weight: 500;
}

.chevron-icon {
  display: flex;
  align-items: center;
}

.chevron {
  width: 20px;
  height: 20px;
  color: #9ca3af;
}

/* Footer */
.profile-footer {
  padding: 24px;
  background-color: #f9fafb;
  text-align: center;
}

.profile-footer p {
  margin: 0;
  font-size: 14px;
  color: #6b7280;
}

@media screen and (max-width: 560px) {
  .profile-container {
    margin: 2rem;
  }
}
</style>