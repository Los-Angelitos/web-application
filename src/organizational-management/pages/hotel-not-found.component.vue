<template>
  <div class="no-hotel-container">
    <div class="content-wrapper">
      <div class="icon-container">
        <i class="material-icons warning-icon">hotel_off</i>
      </div>
      
      <h1 class="page-title">No Hotel Assigned</h1>
      
      <p class="description">
        You currently don't have any hotel assigned to your account. As an administrator, 
        you need to be associated with a hotel to manage its operations.
      </p>

      <div class="card">
        <div class="card-header">
          <i class="material-icons info-icon">info_outline</i>
          <span class="card-title">What can you do?</span>
        </div>

        <ul class="action-list">
          <li class="action-item">
            <i class="material-icons primary-icon">hotel</i>
            <span>Browse available hotels and request assignment</span>
          </li>
          <li class="action-item">
            <i class="material-icons success-icon">person</i>
            <span>Contact system administrator for hotel assignment</span>
          </li>
          <li class="action-item">
            <i class="material-icons indigo-icon">add_home</i>
            <span>Register a new hotel if you are the owner</span>
          </li>
        </ul>
      </div>

      <div class="button-container">
        <button class="primary-button" @click="goToMainPage">
          <i class="material-icons button-icon">search</i>
          Find Hotels
        </button>
      </div>

      <div class="support-link">
        <button class="text-button">
          <i class="material-icons button-icon">email</i>
          Contact Support
        </button>
      </div>
    </div>

    <!-- Footer section with hotel brand elements -->
    <div class="footer-wave">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
        <path 
          fill="#f5f5f5" 
          fill-opacity="1" 
          d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,202.7C672,203,768,181,864,181.3C960,181,1056,203,1152,202.7C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z">
        </path>
      </svg>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NoHotelAssigned',
  methods: {
    goToMainPage() {
      this.$router.push({ name: 'Home' });
    }
  }
}
</script>

<style scoped>
.no-hotel-container {
  min-height: 100vh;
  background-color: white;
  position: relative;
  display: flex;
  flex-direction: column;
  font-family: 'Roboto', Arial, sans-serif;
}

.content-wrapper {
  text-align: center;
  padding: 60px 20px;
  max-width: 800px;
  margin: 0 auto;
}

.icon-container {
  margin-bottom: 32px;
}

.warning-icon {
  font-size: 100px;
  color: #fb8c00;
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 24px;
  color: #333;
}

.description {
  font-size: 18px;
  margin-bottom: 40px;
  color: #555;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
}

.card {
  background-color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  border-radius: 8px;
  padding: 24px;
  max-width: 550px;
  margin: 0 auto 40px auto;
  text-align: left;
}

.card-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.info-icon {
  color: #2196f3;
  margin-right: 8px;
  font-size: 24px;
}

.card-title {
  font-size: 20px;
  font-weight: 500;
}

.action-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.action-item {
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.action-item:last-child {
  border-bottom: none;
}

.action-item .material-icons {
  margin-right: 12px;
  font-size: 20px;
}

.primary-icon {
  color: #1976d2;
}

.success-icon {
  color: #4caf50;
}

.indigo-icon {
  color: #3f51b5;
}

.button-container {
  margin-bottom: 24px;
}

.primary-button {
  background-color: #1976d2;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  min-width: 200px;
  justify-content: center;
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.2);
  transition: background-color 0.3s;
}

.primary-button:hover {
  background-color: #1565c0;
}

.button-icon {
  margin-right: 8px;
  font-size: 18px;
}

.text-button {
  background: transparent;
  border: none;
  color: #757575;
  font-size: 14px;
  padding: 8px 16px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  transition: color 0.3s;
}

.text-button:hover {
  color: #424242;
}

.support-link {
  margin-top: 24px;
}

.footer-wave {
  margin-top: auto;
  width: 100%;
  line-height: 0;
}

@media (max-width: 600px) {
  .page-title {
    font-size: 28px;
  }
  
  .description {
    font-size: 16px;
  }
  
  .card {
    padding: 16px;
  }
}
</style>