<template>
  <div class="topbar-container">
    <!-- Botón hamburguesa solo visible en móviles -->
    <div class="hamburger-menu" @click="toggleMobileMenu">
      <img src="/menu-icon.svg" alt="Menu"/>
    </div>

    <div class="topbar">
      <div class="logo-container">
        <router-link to="/">
          <img src="/sweetmanager-large-logo.png" alt="Sweet Manager Logo" class="logo" />
          <img src="/sweetmanager-short-logo.png" alt="Sweet Manager Logo" class="logo-short" />
        </router-link>
      </div>

      <!-- Menú de escritorio -->
      <div class="menu-container desktop-menu">
        <language-switcher/>
        <div class="menu-items">
          <div class="menu-item" @click="goToPreferences" v-if="roleId === 'guest'">
            <i class="fas fa-cog"></i>
            <span>preferences</span>
          </div>
          <div class="menu-item" @click="goToHotel" v-if="roleId === 'admin' || roleId === 'manager'">
            <i class="fas fa-hotel"></i>
            <span>my hotel</span>
          </div>
          <div class="menu-item" @click="goToNotifications" v-if="roleId === 'admin' || roleId === 'manager'">
            <img src="/bell-icon.svg" alt="Notifications" class="notification-icon" />
          </div>
          <div class="user-profile" @click="toggleUserMenu">
            <div class="avatar">
              <i class="fas fa-user"></i>
            </div>
            <div v-if="showUserMenu" class="user-dropdown">
              <div class="dropdown-item" @click="goToProfile">
                profile
              </div>
              <div class="dropdown-item" @click="goToSettings">
                settings
              </div>
              <div class="dropdown-item" @click="logout">
                logout
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="topbar-divider"></div>
  </div>

  <!-- Menú móvil -->
  <transition name="slide">
    <div v-if="showMobileMenu" class="mobile-menu">
      <div class="mobile-menu-header">
        <div class="logo-container">
          <img src="/sweetmanager-short-logo.png" alt="Sweet Manager Logo" class="logo" />
        </div>
        <div class="close-menu" @click="toggleMobileMenu">
          &times;
        </div>
      </div>

      <div class="mobile-menu-content">
        <div class="mobile-language-selector">
          <button
            v-for="lang in languages"
            :key="lang.code"
            :class="{ active: currentLanguage === lang.code }"
            @click="changeLanguage(lang.code)"
            class="mobile-lang-btn"
          >
            {{ lang.name }}
          </button>
        </div>

        <div class="mobile-user-info">
          <div class="mobile-avatar">
            <i class="fas fa-user"></i>
          </div>
          <div class="mobile-user-name">
            User Name
          </div>
        </div>

        <div class="mobile-menu-items">
          <div class="mobile-menu-item" @click="goToProfile">
            <i class="fas fa-user-circle"></i>
            <span>Profile</span>
          </div>
          <div class="mobile-menu-item" @click="goToHotel">
            <i class="fas fa-hotel"></i>
            <span>My Hotel</span>
          </div>
          <div class="mobile-menu-item" @click="goToPreferences">
            <i class="fas fa-cog"></i>
            <span>Preferences</span>
          </div>
          <div class="mobile-menu-item" @click="goToSettings">
            <i class="fas fa-sliders-h"></i>
            <span>Settings</span>
          </div>
          <div class="mobile-menu-item" @click="logout">
            <i class="fas fa-sign-out-alt"></i>
            <span>Logout</span>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import LanguageSwitcher from "./language-switcher.component.vue";
import {jwtDecode} from "jwt-decode";

export default {
  name: 'TopBarComponent',
  components: {LanguageSwitcher},
  data() {
    return {
      showUserMenu: false,
      showMobileMenu: false,
      roleId: null
    };
  },
  methods: {
    // Using jwt-decode library
    getLocality() {
      const token = localStorage.getItem('token');
      if (!token) {
        return null;
      }
      
      try {
        const decodedToken = jwtDecode(token);
        return decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/locality'];
      } catch (error) {
        console.error('Error decoding JWT token:', error);
        return null;
      }
    },
    goToPreferences() {
      const userId = localStorage.getItem('userId');
      this.$router.push(`/home/profile/${userId}/preferences`);
      this.closeMobileMenu();
    },
    goToHotel() {
      const hotelId = this.getLocality();
      const hotelIdTemp = localStorage.getItem('hotelId');
      const roleId = localStorage.getItem('roleId');
      console.log('Navigating to hotel with ID:', hotelId);
      if(hotelIdTemp) {
        this.$router.push(`/home/hotel/${hotelIdTemp}/overview`);
      }else {
        if(hotelId == 0 || hotelId === null) {
          if(roleId == 2) this.$router.push('/home/hotel/not-found');
          else this.$router.push('/home/hotel/set-up');
        }else {
          this.$router.push(`/home/hotel/${hotelId}/overview`);
        }
      }

      this.closeMobileMenu();
    },
    goToProfile() {
      const userId = localStorage.getItem('userId');
      this.$router.push(`/home/profile/${userId}`);
      this.showUserMenu = false;
      this.closeMobileMenu();
    },
    goToSettings() {
      const userId = localStorage.getItem('userId');
      this.$router.push(`/home/profile/${userId}/account`);
      this.showUserMenu = false;
      this.closeMobileMenu();
    },
    goToNotifications() {
      this.$router.push('/home/hotel/1/notifications');
    },
    logout() {
      this.$router.push('/auth/sign-in');
      this.showUserMenu = false;
      this.closeMobileMenu();
    },
    toggleUserMenu(e) {
      e.stopPropagation();
      if(this.roleId) {
        this.showUserMenu = !this.showUserMenu;
      }else {
        this.$router.push('/auth/sign-in')
      }
    },
    closeUserMenu(e) {
      if (!this.$el.contains(e.target)) {
        this.showUserMenu = false;
      }
    },
    toggleMobileMenu() {
      this.showMobileMenu = !this.showMobileMenu;
      document.body.style.overflow = this.showMobileMenu ? 'hidden' : '';
    },
    closeMobileMenu() {
      this.showMobileMenu = false;
      document.body.style.overflow = '';
    },
    handleResize() {
      if (window.innerWidth > 768 && this.showMobileMenu) {
        this.closeMobileMenu();
      }
    }
  },
  mounted() {
    document.addEventListener('click', this.closeUserMenu);
    window.addEventListener('resize', this.handleResize);

    // Check if roleId is stored in localStorage
    const storedRoleId = localStorage.getItem('roleId');
    if (storedRoleId) {
      if(storedRoleId  === '1') {
        this.roleId = 'manager';
      }
      else if(storedRoleId === '2') {
        this.roleId = 'admin';
      } else {
        this.roleId = 'guest';
      }
    }
  },
  beforeDestroy() {
    document.removeEventListener('click', this.closeUserMenu);
    window.removeEventListener('resize', this.handleResize);
  }
};
</script>

<style scoped>
.notification-icon {
  width: 26px;
  height: 26px;
}

.hamburger-menu {
  display: none;
  cursor: pointer;
  width: 30px;
  height: 30px;
}

.hamburger-menu img {
  width: 100%;
  height: 100%;
}

.logo-short {
  height: 32px;
  margin-right: 10px;
  display: none;
}

.topbar-container {
  margin-bottom: 2rem;
  position: sticky;
  top: 0;
  z-index: 3000;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 2rem;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  border-bottom: 1px solid #f0f0f0;
  height: 70px;
}

.logo-container {
  display: flex;
  align-items: center;
}

.logo-container a {
  display: flex;
  align-items: center;
  text-decoration: none;
}

.logo {
  height: 32px;
  margin-right: 10px;
}

.brand-name {
  font-size: 1.25rem;
  font-weight: 600;
  color: #0066cc;
}

.menu-container {
  display: flex;
  align-items: center;
}

.menu-items {
  display: flex;
  align-items: center;
}

.menu-item {
  display: flex;
  align-items: center;
  margin-right: 1.5rem;
  cursor: pointer;
  color: #555;
  transition: color 0.2s;
}

.menu-item:hover {
  color: #0066cc;
}

.menu-item i {
  margin-right: 8px;
  font-size: 1rem;
}

.user-profile {
  position: relative;
  cursor: pointer;
}

.avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background-color: #f2f7fd;
  border-radius: 50%;
  color: #0066cc;
}

.user-dropdown {
  position: absolute;
  top: 50px;
  right: 0;
  width: 180px;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  z-index: 3000;
  padding: 0.5rem 0;
}

.dropdown-item {
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.dropdown-item:hover {
  background-color: #f5f8fc;
  color: #0066cc;
}

/* Menú móvil */
.mobile-menu {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ffffff;
  z-index: 3000;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}
.mobile-menu-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #f0f0f0;
}
.close-menu {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #555;
  font-size: 2rem;
}
.mobile-menu-content {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  z-index: 3000;
}
.mobile-language-selector {
  display: flex;
  gap: 1rem;
  justify-content: center;
}
.mobile-lang-btn {
  padding: 0.75rem 1.5rem;
  border: 1px solid #e0e0e0;
  background: white;
  border-radius: 30px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}
.mobile-lang-btn.active {
  background: #0066cc;
  color: white;
  border-color: #0066cc;
}
.mobile-user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background-color: var(--gray-extra-light-color);
  border-radius: 12px;
}
.mobile-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  background-color: #ffffff;
  border-radius: 50%;
  color: #0066cc;
  font-size: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 102, 204, 0.1);
}
.mobile-user-name {
  font-weight: 600;
  font-size: 1.1rem;
  color: #333;
}
.mobile-menu-items {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.mobile-menu-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  gap: 1rem;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
}
.mobile-menu-item:hover {
  background-color: #f5f8fc;
}
.mobile-menu-item i {
  width: 24px;
  font-size: 1.25rem;
  color: #0066cc;
  text-align: center;
}
.mobile-menu-item span {
  font-weight: 500;
}
/* Animación del menú móvil */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
/* Media queries */
@media (max-width: 850px) {
  .logo {
    display: none;
  }
  .logo-short {
    display: block;
  }
  .hamburger-menu {
    display: block;
    position: absolute;
    top: 20px;
    right: 20px;
    width: 30px;
    height: 30px;
    z-index: 10;
  }
  .desktop-menu {
    display: none;
  }
}
@media (min-width: 851px) {
  .mobile-menu {
    display: none;
  }
}

</style>