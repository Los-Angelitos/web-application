<template>
  <div class="searchbar-container">
    <div class="searchbar" :class="{ 'focused': isFocused, 'results-open': showResults && filteredResults.length > 0 }">
      
      <input
        type="text"
        :placeholder="placeholder"
        v-model="searchQuery"
        @focus="handleFocus"
        @blur="handleBlur"
        @keyup.enter="performSearch"
        @keydown.down="navigateResults('down')"
        @keydown.up="navigateResults('up')"
        @keydown.esc="resetSearch"
        class="search-input"
        ref="searchInput"
      />
      <div v-if="searchQuery" class="clear-button" @click="clearSearch">
        <i class="fas fa-times"></i>
      </div>
      <div class="filter-button" @click="toggleFilters">
        <i class="fas fa-sliders-h"></i>
        <span v-if="activeFiltersCount > 0" class="filter-badge">{{ activeFiltersCount }}</span>
      </div>
      <button class="search-button" @click="performSearch">
        <i class="fas fa-search"></i>
      </button>
    </div>

    <div v-if="showResults && filteredResults.length > 0" class="search-results">
      <div
        v-for="(result, index) in filteredResults"
        :key="result.id"
        class="result-item"
        :class="{ 'selected': selectedIndex === index }"
        @mousedown="selectResult(result)"
        @mouseover="selectedIndex = index"
      >
        <div class="result-icon">
          <i :class="getResultIcon(result.type)"></i>
        </div>
        <div class="result-content">
          <div class="result-title">{{ result.name }}</div>
          <div class="result-detail">{{ result.location }}</div>
        </div>
        <div class="result-type">{{ formatType(result.type) }}</div>
      </div>
      
      <div v-if="hasMoreResults" class="more-results" @mousedown="viewAllResults">
        See results ({{ totalResults }})
      </div>
    </div>

    <transition name="slide">
      <div v-if="showFilters" class="filters-panel">
        <div class="filters-header">
          <h3>Search filter</h3>
          <div class="close-filters" @click="toggleFilters">
            <i class="fas fa-times"></i>
          </div>
        </div>
        
        <div class="filters-body">
          <div class="filter-section">
            <h4>Accommodation type</h4>
            <div class="filter-options">
              <label v-for="option in accommodationTypes" :key="option.value" class="filter-option">
                <input type="checkbox" v-model="filters.types" :value="option.value">
                <span class="checkbox-custom"></span>
                <span>{{ option.label }}</span>
              </label>
            </div>
          </div>
          
          <div class="filter-section">
            <h4>Ranking</h4>
            <div class="rating-filter">
              <div class="stars-container">
                <i v-for="star in 5" :key="star" 
                   :class="['fas', star <= filters.rating ? 'fa-star' : 'fa-star-o']" 
                   @click="filters.rating = star"></i>
              </div>
              <span>{{ filters.rating }} stars or more</span>
            </div>
          </div>
          
          <div class="filter-section">
            <h4>Price range</h4>
            <div class="price-range">
              <div class="price-labels">
                <span>{{ formatCurrency(filters.priceRange[0]) }}</span>
                <span>{{ formatCurrency(filters.priceRange[1]) }}</span>
              </div>
              <div class="range-slider">
                <input 
                  type="range" 
                  v-model.number="filters.priceRange[0]" 
                  :min="priceOptions.min" 
                  :max="filters.priceRange[1]"
                  class="range-min"
                >
                <input 
                  type="range" 
                  v-model.number="filters.priceRange[1]" 
                  :min="filters.priceRange[0]" 
                  :max="priceOptions.max"
                  class="range-max"
                >
              </div>
            </div>
          </div>
          
          <div class="filter-section">
            <h4>Services</h4>
            <div class="filter-options">
              <label v-for="amenity in amenities" :key="amenity.value" class="filter-option">
                <input type="checkbox" v-model="filters.amenities" :value="amenity.value">
                <span class="checkbox-custom"></span>
                <span>{{ amenity.label }}</span>
              </label>
            </div>
          </div>
        </div>
        
        <div class="filters-footer">
          <button class="btn-reset" @click="resetFilters">Clear</button>
          <button class="btn-apply" @click="applyFilters">Apply filters</button>
        </div>
      </div>
    </transition>
    
    <div v-if="showFilters" class="filters-overlay" @click="toggleFilters"></div>
  </div>
</template>

<script>
export default {
  name: 'SearchBar',
  props: {
    placeholder: {
      type: String,
      default: '¿Where do you want to go?'
    }
  },
  data() {
    return {
      searchQuery: '',
      isFocused: false,
      showResults: false,
      showFilters: false,
      isLoading: false,
      selectedIndex: -1,
      resultsLimit: 5,
      searchTimeout: null,
      
      // Filtros
      filters: {
        types: [],
        rating: 0,
        priceRange: [0, 1000],
        amenities: []
      },
      
      accommodationTypes: [
        { value: 'hotel', label: 'Hotels' },
        { value: 'apartment', label: 'Apartments' },
        { value: 'hostel', label: 'Hostels' },
        { value: 'villa', label: 'Villas' },
        { value: 'resort', label: 'Resorts' }
      ],
      amenities: [
        { value: 'wifi', label: 'Free WiFi' },
        { value: 'parking', label: 'Parking' },
        { value: 'pool', label: 'Pool' },
        { value: 'breakfast', label: 'Breakfast' },
        { value: 'ac', label: 'Air Conditioning' },
        { value: 'gym', label: 'Gym' }
      ],
      priceOptions: {
        min: 0,
        max: 1000
      },
      
      allResults: [],
      filteredResults: []
    }
  },
  computed: {
    totalResults() {
      return this.allResults.length;
    },
    hasMoreResults() {
      return this.allResults.length > this.resultsLimit;
    },
    activeFiltersCount() {
      let count = 0;
      if (this.filters.types.length > 0) count++;
      if (this.filters.rating > 0) count++;
      if (this.filters.amenities.length > 0) count++;
      if (this.filters.priceRange[0] > this.priceOptions.min || 
          this.filters.priceRange[1] < this.priceOptions.max) count++;
      return count;
    }
  },
  methods: {
    handleFocus() {
      this.isFocused = true;
      if (this.searchQuery.length > 1) {
        this.fetchResults();
      }
    },
    handleBlur() {
      this.isFocused = false;
      setTimeout(() => {
        this.showResults = false;
      }, 200);
    },
    clearSearch() {
      this.searchQuery = '';
      this.showResults = false;
      this.filteredResults = [];
      this.$refs.searchInput.focus();
    },
    resetSearch() {
      this.showResults = false;
      this.selectedIndex = -1;
    },
    toggleFilters() {
      this.showFilters = !this.showFilters;
      if (this.showFilters) {
        this.showResults = false;
      }
    },
    resetFilters() {
      this.filters = {
        types: [],
        rating: 0,
        priceRange: [this.priceOptions.min, this.priceOptions.max],
        amenities: []
      };
    },
    applyFilters() {
      this.fetchResults();
      this.toggleFilters();
    },
    navigateResults(direction) {
      if (!this.showResults || this.filteredResults.length === 0) return;
      
      if (direction === 'down') {
        if (this.selectedIndex < this.filteredResults.length - 1) {
          this.selectedIndex++;
        } else {
          this.selectedIndex = 0;
        }
      } else {
        if (this.selectedIndex > 0) {
          this.selectedIndex--;
        } else {
          this.selectedIndex = this.filteredResults.length - 1;
        }
      }
    },
    selectResult(result) {
      this.searchQuery = result.name;
      this.showResults = false;
      this.$emit('select', result);
      this.$router.push({
        name: 'hotel-details',
        params: { id: result.id }
      });
    },
    viewAllResults() {
      this.performSearch();
    },
    performSearch() {
      if (this.searchQuery.trim()) {
        this.$emit('search', {
          query: this.searchQuery,
          filters: { ...this.filters }
        });
        this.showResults = false;
        this.$router.push({
          name: 'search-results',
          query: {
            q: this.searchQuery,
            ...this.serializeFilters()
          }
        });
      }
    },
    serializeFilters() {
      const query = {};
      if (this.filters.types.length) query.types = this.filters.types.join(',');
      if (this.filters.rating > 0) query.rating = this.filters.rating;
      if (this.filters.amenities.length) query.amenities = this.filters.amenities.join(',');
      if (this.filters.priceRange[0] > this.priceOptions.min) query.minPrice = this.filters.priceRange[0];
      if (this.filters.priceRange[1] < this.priceOptions.max) query.maxPrice = this.filters.priceRange[1];
      return query;
    },
    fetchResults() {
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout);
      }
      
      if (this.searchQuery.length < 2) {
        this.showResults = false;
        return;
      }
      
      this.isLoading = true;
      
      this.searchTimeout = setTimeout(() => {
        this.simulateApiCall(this.searchQuery, this.filters)
          .then(results => {
            this.allResults = results;
            this.filteredResults = results.slice(0, this.resultsLimit);
            this.showResults = this.filteredResults.length > 0;
            this.selectedIndex = -1;
            this.isLoading = false;
          })
          .catch(error => {
            console.error('Error fetching results:', error);
            this.isLoading = false;
          });
      }, 300);
    },
    simulateApiCall(query, filters) {
      // Esta función simula una llamada a la API
      return new Promise((resolve) => {
        const mockData = [
          { id: 1, name: 'Hotel Plaza Mayor', location: 'Madrid, España', type: 'hotel', price: 150, rating: 4.7, amenities: ['wifi', 'breakfast', 'pool'] },
          { id: 2, name: 'Apartamentos Madrid Centro', location: 'Madrid, España', type: 'apartment', price: 95, rating: 4.3, amenities: ['wifi', 'ac'] },
          { id: 3, name: 'Hotel Barcelona Ramblas', location: 'Barcelona, España', type: 'hotel', price: 175, rating: 4.5, amenities: ['wifi', 'breakfast', 'pool', 'gym'] },
          { id: 4, name: 'Hostal Valencia', location: 'Valencia, España', type: 'hostel', price: 45, rating: 3.8, amenities: ['wifi'] },
          { id: 5, name: 'Resort Costa del Sol', location: 'Málaga, España', type: 'resort', price: 250, rating: 4.9, amenities: ['wifi', 'breakfast', 'pool', 'gym', 'parking'] },
          { id: 6, name: 'Villa Marbella', location: 'Marbella, España', type: 'villa', price: 320, rating: 4.8, amenities: ['wifi', 'pool', 'parking', 'ac'] },
          { id: 7, name: 'Hotel Madrid Norte', location: 'Madrid, España', type: 'hotel', price: 120, rating: 4.0, amenities: ['wifi', 'parking'] },
          { id: 8, name: 'Apartamentos Barcelona Playa', location: 'Barcelona, España', type: 'apartment', price: 110, rating: 4.2, amenities: ['wifi', 'ac', 'parking'] },
          { id: 9, name: 'Hotel Sevilla Centro', location: 'Sevilla, España', type: 'hotel', price: 135, rating: 4.4, amenities: ['wifi', 'breakfast', 'ac'] },
          { id: 10, name: 'Gran Hotel Bilbao', location: 'Bilbao, España', type: 'hotel', price: 160, rating: 4.6, amenities: ['wifi', 'breakfast', 'gym', 'parking'] }
        ];
        
        // Aplicar filtrado por búsqueda
        let results = mockData.filter(item => {
          return item.name.toLowerCase().includes(query.toLowerCase()) || 
                 item.location.toLowerCase().includes(query.toLowerCase());
        });
        
        // Aplicar filtros
        if (filters.types.length > 0) {
          results = results.filter(item => filters.types.includes(item.type));
        }
        
        if (filters.rating > 0) {
          results = results.filter(item => item.rating >= filters.rating);
        }
        
        if (filters.priceRange[0] > 0 || filters.priceRange[1] < this.priceOptions.max) {
          results = results.filter(item => 
            item.price >= filters.priceRange[0] && item.price <= filters.priceRange[1]
          );
        }
        
        if (filters.amenities.length > 0) {
          results = results.filter(item => 
            filters.amenities.every(amenity => item.amenities.includes(amenity))
          );
        }
        
        setTimeout(() => {
          resolve(results);
        }, 200);
      });
    },
    formatCurrency(value) {
      return `${value}$`;
    },
    formatType(type) {
      const types = {
        'hotel': 'Hotel',
        'apartment': 'Apartamento',
        'hostel': 'Hostal',
        'villa': 'Villa',
        'resort': 'Resort'
      };
      return types[type] || type;
    },
    getResultIcon(type) {
      const icons = {
        'hotel': 'fas fa-hotel',
        'apartment': 'fas fa-building',
        'hostel': 'fas fa-bed',
        'villa': 'fas fa-home',
        'resort': 'fas fa-umbrella-beach'
      };
      return icons[type] || 'fas fa-map-marker-alt';
    }
  },
  watch: {
    searchQuery(newValue) {
      if (newValue.length > 1) {
        this.fetchResults();
      } else {
        this.showResults = false;
      }
    }
  },
  mounted() {
    // Escuchar clics fuera del componente para cerrar resultados
    document.addEventListener('click', (e) => {
      if (!this.$el.contains(e.target)) {
        this.showResults = false;
      }
    });
    
    // Inicializar rangos de precio
    this.filters.priceRange = [this.priceOptions.min, this.priceOptions.max];
  },
  beforeDestroy() {
    document.removeEventListener('click', this.handleOutsideClick);
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
  }
}
</script>

<style scoped>
.searchbar-container {
  width: 100%;
  max-width: 850px;
  margin: 0 auto;
  padding: 0 15px;
  position: relative;
}

.searchbar {
  display: flex;
  align-items: center;
  position: relative;
  width: 100%;
  border-radius: 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  transition: all 0.3s ease;
}

.searchbar.focused {
  box-shadow: 0 4px 15px rgba(0, 102, 204, 0.15);
  border-color: #0066cc;
}

.searchbar.results-open {
  border-radius: 20px 20px 0 0;
  border-bottom-color: transparent;
}

.search-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 15px;
  color: #777;
}

.search-input {
  flex: 1;
  padding: 15px;
  font-size: 1rem;
  border: none;
  outline: none;
  color: #333;
  background: transparent;
}

.search-input::placeholder {
  color: #999;
  font-weight: 300;
}

.clear-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 10px;
  color: #999;
  cursor: pointer;
}

.clear-button:hover {
  color: #666;
}

.filter-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  margin: 0 5px;
  border-radius: 50%;
  cursor: pointer;
  color: #666;
  position: relative;
  transition: background-color 0.2s;
}

.filter-button:hover {
  background-color: #f5f5f5;
  color: #0066cc;
}

.filter-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: #0066cc;
  color: white;
  font-size: 10px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background-color: #0066cc;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;
  color: white;
  font-size: 18px;
  border-radius: 50%;
  margin-right: .5rem;
}

.search-button:hover {
  background-color: #0055b3;
}

/* Resultados de búsqueda */
.search-results {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-top: none;
  border-radius: 0 0 15px 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  z-index: 3000;
  max-height: 400px;
  overflow-y: auto;
}

.result-item {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.result-item:hover,
.result-item.selected {
  background-color: #f5f8fc;
}

.result-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #f0f7ff;
  color: #0066cc;
  margin-right: 15px;
}

.result-content {
  flex: 1;
}

.result-title {
  font-weight: 500;
  color: #333;
  margin-bottom: 3px;
}

.result-detail {
  font-size: 0.85rem;
  color: #777;
}

.result-type {
  font-size: 0.85rem;
  color: #0066cc;
  font-weight: 500;
  background-color: #eef5ff;
  padding: 3px 10px;
  border-radius: 12px;
}

.more-results {
  padding: 15px;
  text-align: center;
  border-top: 1px solid #f0f0f0;
  color: #0066cc;
  font-weight: 500;
  cursor: pointer;
}

.more-results:hover {
  background-color: #f5f8fc;
}

/* Panel de filtros */
.filters-panel {
  position: absolute;
  top: 60px;
  right: 15px;
  width: 320px;
  background-color: #ffffff;
  border-radius: 15px;
  box-shadow: 0 5px 25px rgba(0, 0, 0, 0.15);
  z-index: 8000;
  overflow: hidden;
}

.filters-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 3500;
}

.filters-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.filters-header h3 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
}

.close-filters {
  cursor: pointer;
  color: #777;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.close-filters:hover {
  background-color: #f5f5f5;
  color: #333;
}

.filters-body {
  padding: 15px 20px;
  max-height: 400px;
  overflow-y: auto;
}

.filter-section {
  margin-bottom: 20px;
}

.filter-section h4 {
  margin: 0 0 10px;
  font-size: 0.95rem;
  font-weight: 600;
  color: #555;
}

.filter-options {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.filter-option {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 0.9rem;
  color: #555;
}

.filter-option input[type="checkbox"] {
  position: absolute;
  opacity: 0;
}

.checkbox-custom {
  width: 18px;
  height: 18px;
  border: 1.5px solid #ccc;
  border-radius: 4px;
  margin-right: 8px;
  position: relative;
  transition: all 0.2s;
}

.filter-option input[type="checkbox"]:checked + .checkbox-custom {
  background-color: #0066cc;
  border-color: #0066cc;
}

.filter-option input[type="checkbox"]:checked + .checkbox-custom::after {
  content: '';
  position: absolute;
  left: 6px;
  top: 2px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.rating-filter {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.stars-container {
  display: flex;
  gap: 5px;
}

.stars-container i {
  color: #ffc107;
  cursor: pointer;
}

.price-range {
  padding: 10px 0;
}

.price-labels {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 0.9rem;
  color: #555;
}

.range-slider {
  position: relative;
  height: 5px;
  margin: 0 10px;
}

.range-slider input[type="range"] {
  -webkit-appearance: none;
  width: 100%;
  height: 5px;
  border-radius: 5px;
  background: #ddd;
  outline: none;
  position: absolute;
  pointer-events: none;
}

.range-slider input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #0066cc;
  cursor: pointer;
  pointer-events: auto;
  margin-top: -6px;
}

.filters-footer {
  display: flex;
  justify-content: space-between;
  padding: 15px 20px;
  border-top: 1px solid #f0f0f0;
}

.btn-reset {
  padding: 10px 15px;
  background: none;
  border: 1.5px solid #e0e0e0;
  border-radius: 20px;
  color: #555;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-reset:hover {
  border-color: #ccc;
  color: #333;
}

.btn-apply {
  padding: 10px 20px;
  background-color: #0066cc;
  border: none;
  border-radius: 20px;
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-apply:hover {
  background-color: #0055b3;
}

/* Animaciones */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateY(20px);
  opacity: 0;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .searchbar {
    border-radius: 24px;
  }
  
  .searchbar.results-open {
    border-radius: 16px 16px 0 0;
  }

  .search-input {
    padding: 12px;
    font-size: 0.95rem;
  }

  .search-button {
    width: 35px;
    height: 35px;
  }
  
  .filters-panel {
    top: 55px;
    right: 0;
    left: 0;
    width: auto;
    margin: 0 15px;
  }
  
  .filter-options {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .search-icon,
  .filter-button {
    padding: 0 10px;
  }
  
  .result-type {
    display: none;
  }
}
</style>