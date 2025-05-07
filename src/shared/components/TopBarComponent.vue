<template>
    <div class="topbar">
      <div class="logo-container">
        <router-link to="/">
          <img src="../../../public/sweetmanager-large-logo.png" alt="Sweet Manager Logo" class="logo" />
        </router-link>
      </div>
      <div class="menu-container">
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
  </template>
  
  <script>
  export default {
    name: 'TopBarComponent',
    data() {
      return {
        currentLanguage: 'ES',
        showUserMenu: false,
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
      },
      goToPreferences() {
        this.$router.push('/preferences');
      },
      goToHotel() {
        this.$router.push('/hotel');
      },
      goToProfile() {
        this.$router.push('/profile');
        this.showUserMenu = false;
      },
      goToSettings() {
        this.$router.push('/settings');
        this.showUserMenu = false;
      },
      logout() {
        // Implement logout logic
        this.$store.dispatch('auth/logout');
        this.$router.push('/login');
        this.showUserMenu = false;
      },
      toggleUserMenu() {
        this.showUserMenu = !this.showUserMenu;
      },
      closeUserMenu(e) {
        if (!this.$el.contains(e.target)) {
          this.showUserMenu = false;
        }
      }
    },
    mounted() {
      document.addEventListener('click', this.closeUserMenu);
    },
    beforeDestroy() {
      document.removeEventListener('click', this.closeUserMenu);
    }
  }
  </script>
  
  <style scoped>
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
  </style>