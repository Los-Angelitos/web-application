<template>
  <div class="navigation-container sticky">
    <!-- Desktop Navigation -->
    <nav v-if="!isMobile" class="desktop-navigation">
      <ul class="navigation-list">
        <li 
          v-for="item in navigationItemsData" 
          :key="item.id"
          :class="['navigation-item', { 'active': item.isActive, 'inactive': !item.isActive }]"
          @click="setActiveItem(item.id)"
        >
          <div class="nav-group">
            <span class="navigation-icon"><img :src="item.icon" width="35" height="35" /> </span>
            <span class="navigation-label">{{ item.label }}</span>
          </div>
        </li>
      </ul>
    </nav>

    <!-- Mobile Navigation -->
    <nav v-else class="mobile-navigation">
      <div class="mobile-menu-header">
        <button class="mobile-toggle-button" @click="toggleMobileMenu">
          <span>Categories</span>
          <span class="toggle-icon">{{ isMobileMenuOpen ? '✕' : '☰' }}</span>
        </button>
        <span class="current-selection">{{ currentSelection.label }}</span>
      </div>

      <!-- Mobile Menu Dropdown -->
      <transition name="slide-fade">
        <ul v-if="isMobileMenuOpen" class="mobile-dropdown">
          <li 
            v-for="item in navigationItemsData" 
            :key="item.id"
            :class="['mobile-item', { 'active': item.isActive }]"
            @click="selectMobileItem(item.id)"
          >
            <span class="navigation-icon"><img :src="item.icon" width="45" height="25"/></span>
            <span class="navigation-label">{{ item.label }}</span>
          </li>
        </ul>
      </transition>
    </nav>
  </div>
</template>

<script>
import TrophyIcon from "../../assets/organizational-management/trophy-icon.svg";
import LakeIcon from "../../assets/organizational-management/lake-icon.svg";
import PoolIcon from "../../assets/organizational-management/pool-icon.svg";
import BeachIcon from "../../assets/organizational-management/beach-icon.svg";
import RuralIcon from "../../assets/organizational-management/rural-icon.svg";
import SuiteIcon from "../../assets/organizational-management/bed-icon.svg";

export default {
  name: 'MainPageNavigation',
  props: {
    navigationItems: {
      type: Array,
      default: () => [
        {id: "featured", label: "Featured", path: "", icon: TrophyIcon, isActive: true},
        {id: "lake", label: "Near the lake", path: "", icon: LakeIcon, isActive: false},
        {id: "pool", label: "With a pool", path: "", icon: PoolIcon, isActive: false},
        {id: "beach", label: "Near the beach", path: "", icon: BeachIcon, isActive: false},
        {id: "rural", label: "Rural hotel", path: "", icon: RuralIcon, isActive: false},
        {id: "suite", label: "Master bedroom", path: "", icon: SuiteIcon, isActive: false}
      ]
    }
  },

  data() {
    return {
      isMobile: false,
      isMobileMenuOpen: false,
      navigationItemsData: this.navigationItems, // Initialize with prop data
      screenWidth: window.innerWidth
    };
  },

  computed: {
    currentSelection() {
      return this.navigationItems.find(item => item.isActive) || this.navigationItems[0];
    }
  },

  mounted() {
    this.checkScreenSize();
    window.addEventListener('resize', this.handleResize);
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize);
  },

  methods: {
    setActiveItem(id) {
      this.navigationItemsData = this.navigationItems.map(item => ({
        ...item,
        isActive: item.id === id
      }));
      
      this.$router.push({ path: this.navigationItemsData.find(item => item.id === id).path });
    },

    handleResize() {
      this.checkScreenSize();
    },

    checkScreenSize() {
      this.screenWidth = window.innerWidth;
      this.isMobile = this.screenWidth < 768;

      if (!this.isMobile) {
        this.isMobileMenuOpen = false;
      }
    },

    toggleMobileMenu() {
      this.isMobileMenuOpen = !this.isMobileMenuOpen;
    },

    selectMobileItem(id) {
      this.setActiveItem(id);
      this.isMobileMenuOpen = false;
    }
  }
};
</script>

<style scoped>
.navigation-container {
  margin-top: 20px;
  width: 100%;
}

.desktop-navigation {
  width: 100%;
}

div.sticky {
  position: sticky;
  top: 0;
  z-index: 1000;
  background-color: white;
} 

.navigation-list {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  overflow-x: auto;
  padding: 1rem;  
}

.navigation-item {
  display: flex;
  align-items: center;
  padding: 16px 8px;
  margin-right: 24px;
  cursor: pointer;
  white-space: nowrap;
  color: #adadad;
  transition: all 0.2s ease;
}

.navigation-item:hover {
  color: #666;
}

.navigation-item.inactive img {
  opacity: 0.32;
}

.navigation-item.inactive:hover img {
  opacity: 0.60;
}

.navigation-item.active {
  color: #000;
  font-weight: 600;
  border-bottom: 2px solid #000;
}

.navigation-icon {
  margin-right: 0px;
}

.nav-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.mobile-navigation {
  width: 100%;
}

.mobile-menu-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
}

.mobile-toggle-button {
  display: flex;
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  padding: 0;
}

.toggle-icon {
  margin-left: 8px;
}

.current-selection {
  font-weight: 600;
}

.mobile-dropdown {
  position: absolute;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e2e8f0;
  border-top: none;
  z-index: 50;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.mobile-item {
  display: flex;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #e2e8f0;
  cursor: pointer;
}

.mobile-item.active {
  background-color: #f9fafb;
  font-weight: 600;
}

.mobile-item:last-child {
  border-bottom: none;
}

/* Transition for mobile dropdown */
.slide-fade-enter-active, .slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter, .slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}

@media screen and (max-width: 940px) {
  .navigation-list {
    padding: 0;
  }
  
  .navigation-item {
    margin-right: 0;
    padding: 8px;
  }
  
  .mobile-navigation {
    position: relative;
  }
  
  .mobile-menu-header {
    padding: 1rem 2rem;
  }
  
  .mobile-dropdown {
    width: 100%;
    left: 0;
    right: 0;
    border-radius: 4px;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
    z-index: 50;
  }
}
</style>
