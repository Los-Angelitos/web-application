<template>
  <div class="topbar-container">
    <!-- Botón hamburguesa solo visible en móviles -->
    <div class="hamburger-menu" @click="toggleMobileMenu">
      <img src="/menu-icon.svg" alt="Menu" width="100%" height="100%" />
    </div>

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
            :class="{ active: currentLanguage === lang.code }"
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
          <div class="menu-item" @click="goToNotifications">
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
    };
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
      this.showUserMenu = !this.showUserMenu;
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
  },
  beforeDestroy() {
    document.removeEventListener('click', this.closeUserMenu);
    window.removeEventListener('resize', this.handleResize);
  }
};
</script>