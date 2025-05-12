<template>
  <!-- Botón hamburguesa solo visible en móviles -->
  <div class="hamburger-menu" @click="toggleMobileMenu">
    <img src="/menu-icon.svg" alt="Menu" width="100%" height="100%"/>
  </div>

  <div class="topbar-container">
    <div class="topbar">
      <div class="logo-container">
        <router-link to="/">
          <img src="/sweetmanager-large-logo.png" alt="Sweet Manager Logo" class="logo" />
          <img src="/sweetmanager-short-logo.png" alt="SweetManager Short Logo" class="logo-short" />
        </router-link>
      </div>
      
      <!-- Menú de escritorio -->
      <div class="menu-container desktop-menu">
        <div class="language-selector">
          <button 
            v-for="lang in languages" 
            :key="lang.code"
            :class="{ 'active': currentLanguage === lang.code }"
            @click="changeLanguage(lang.code)"
            class="lang-btn"
          >
            {{ lang.code }}
          </button>
        </div>
        <div class="menu-items">
          <div class="menu-item" @click="goToPreferences">
            <i class="fas fa-cog"></i>
            <span>preferences</span>
          </div>
          <div class="menu-item" @click="goToHotel">
            <i class="fas fa-hotel"></i>
            <span>my hotel</span>
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
            :class="{ 'active': currentLanguage === lang.code }"
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
export default {
  name: 'TopBarComponent',
  data() {
    return {
      currentLanguage: 'ES',
      showUserMenu: false,
      showMobileMenu: false,
      languages: [
        { code: 'ES', name: 'Español' },
        { code: 'EN', name: 'English' }
      ]
    }
  },
  methods: {
    changeLanguage(langCode) {
      this.currentLanguage = langCode;
      this.$i18n.locale = langCode.toLowerCase();
      localStorage.setItem('userLanguage', langCode.toLowerCase());
      if (window.innerWidth <= 768) {
        this.showMobileMenu = false;
      }
    },
    goToPreferences() {
      this.$router.push('/home/profile/1/preferences');
      this.closeMobileMenu();
    },
    goToHotel() {
      this.$router.push('/home/hotel/1/overview');
      this.closeMobileMenu();
    },
    goToProfile() {
      this.$router.push('/home/profile/1');
      this.showUserMenu = false;
      this.closeMobileMenu();
    },
    goToSettings() {
      this.$router.push('/home/profile/1/account');
      this.showUserMenu = false;
      this.closeMobileMenu();
    },
    logout() {
      // Implement logout logic
      this.$router.push('/auth/sign-in');
      this.showUserMenu = false;
      this.closeMobileMenu();
    },
    toggleUserMenu() {
      this.showUserMenu = !this.showUserMenu;
    },
    toggleMobileMenu() {
      this.showMobileMenu = !this.showMobileMenu;
      if (this.showMobileMenu) {
        document.body.style.overflow = 'hidden'; // Bloquear scroll cuando menú está abierto
      } else {
        document.body.style.overflow = ''; // Restaurar scroll
      }
    },
    closeMobileMenu() {
      this.showMobileMenu = false;
      document.body.style.overflow = '';
    },
    closeUserMenu(e) {
      if (!this.$el.contains(e.target)) {
        this.showUserMenu = false;
      }
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
  },
  beforeDestroy() {
    document.removeEventListener('click', this.closeUserMenu);
    window.removeEventListener('resize', this.handleResize);
  }
}
</script>

<style scoped>
.topbar-container {
  margin-bottom: 2rem;
}
.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 2rem;
  background-color: #ffffff;
  height: 70px;
  position: relative;
}

.topbar-divider {
  height: 1.2px;
  background-color: var(--gray-extra-light-color);
  margin-top: -1px;
  margin: 0 2rem;
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

.logo-short {
  height: 32px;
  margin-right: 10px;
  display: none;
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

.language-selector {
  margin-right: 2rem;
}

.lang-btn {
  background: none;
  border: none;
  padding: 0.3rem 0.6rem;
  cursor: pointer;
  color: #666;
  font-weight: 500;
  transition: all 0.2s;
}

.lang-btn.active {
  font-weight: 700;
  color: #0066cc;
  border-bottom: 2px solid #0066cc;
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
  z-index: 100;
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

.hamburger-menu {
  display: none;
  cursor: pointer;
}

/* Menú móvil */
.mobile-menu {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ffffff;
  z-index: 1000;
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
@media (max-width: 768px) {
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

@media (min-width: 769px) {
  .mobile-menu {
    display: none;
  }
}
</style>