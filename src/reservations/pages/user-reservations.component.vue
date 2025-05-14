<template>
  <BreadCrumb :path="breadcrumbPath" class="breadcrumb"/>
  <div class="reservations-page">

    <h1 class="page-title">{{ $t('user-reservations.title') }}</h1>
    <p class="page-subtitle">
      {{ $t('user-reservations.subtitle') }}
    </p>

    <div class="reservations-container">
      <BasicCardComponent
          v-for="(hotel, index) in hotels"
          :key="index"
          :title="hotel.name"
          class="reservation-card"
      >
        <template #image>
          <div class="hotel-logo-container">
            <img :src="hotel.logo" :alt="`${hotel.name} Logo`" class="hotel-logo" />
          </div>
        </template>
        <template #header-content>
          <div class="hotel-phone">
            <span class="phone-icon">📞</span>
            <span>{{ hotel.phone }}</span>
          </div>
        </template>
        <div class="hotel-status">
          <div :class="['status-badge', hotel.isActive ? 'active' : 'inactive']">
            {{ hotel.isActive ? $t('user-reservations.activeStatus') : $t('user-reservations.inactiveStatus') }}
          </div>
          <button
              v-if="hotel.isActive"
              class="cancel-button"
              @click="cancelReservation(index)"
          >
            {{ $t('user-reservations.cancelButton') }}
          </button>
        </div>
      </BasicCardComponent>
    </div>

    <div class="actions">
      <button class="back-button" @click="backToPreviousPage">{{ $t('user-reservations.backButton') }}</button>
    </div>
  </div>
</template>

<script>
import BreadCrumb from "../../shared/components/breadcrumb.component.vue";
import BasicCardComponent from "../../shared/components/basic-card.component.vue";
import userMock from "../../mocks/iam/user-profile-account.json";

export default {
  name: "MyReservationsPage",
  components: {
    BreadCrumb,
    BasicCardComponent
  },
  data() {
    return {
      userData: null,
      breadcrumbPath: [
        { name: "Account", route: "" },
        { name: "My Reservations", route: "" }
      ],
      hotels: [
        {
          name: "Hoteles Decameron Perú",
          logo: new URL('../../assets/images/hotel-image-4.png', import.meta.url).href,
          phone: "(072) 596730",
          isActive: true
        },
        {
          name: "Hotel Hilton",
          logo: new URL('../../assets/images/hotel-image-4.png', import.meta.url).href,
          phone: "(072) 596730",
          isActive: false
        },
        {
          name: "San Isidro Inn",
          logo: new URL('../../assets/images/hotel-image-4.png', import.meta.url).href,
          phone: "(072) 596730",
          isActive: false
        }
      ]
    };
  },
  mounted() {
    this.fetchUserData();
  },
  methods: {
    fetchUserData() {
      setTimeout(() => {
        this.userData = userMock;
        this.breadcrumbPath[0].route = `/home/profile/${this.userData.id}`;
        this.breadcrumbPath[1].route = `/home/profile/${this.userData.id}/reservations`;
      }, 300);
    },
    cancelReservation(index) {
      const confirmMessage = this.$t('user-reservations.cancelConfirmation', { hotelName: this.hotels[index].name });
      if (confirm(confirmMessage)) {
        this.hotels[index].isActive = false;
        console.log(this.$t('user-reservations.cancelSuccess', { hotelName: this.hotels[index].name }));
      }
    },
    backToPreviousPage() {
      this.$router.push(`/home/profile/${this.userData.id}`);
    }
  }
};
</script>

<style scoped>
.reservations-page {
  font-family: Arial, sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.breadcrumb {
  margin: 0 2rem;
}

.breadcrumb-separator {
  margin: 0 8px;
}

.page-title {
  font-size: 28px;
  margin-bottom: 10px;
  font-weight: bold;
  color: #333;
}

.page-subtitle {
  color: #666;
  margin-bottom: 30px;
  font-size: 16px;
  line-height: 1.4;
}

.reservations-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: flex-start;
}

.reservation-card {
  width: 100%;
  max-width: 250px;
  min-height: 150px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.hotel-logo-container {
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
}

.hotel-logo {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.hotel-phone {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  margin-top: 5px;
  color: #333;
}

.phone-icon {
  color: #cc0000;
}

.hotel-status {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
}

.status-badge {
  padding: 6px 10px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: bold;
  width: 100%;
  text-align: center;
}

.active {
  background-color: #e6f7ff;
  color: #0074cc;
}

.inactive {
  background-color: #ffb3b3;
  color: #cc0000;
}

.cancel-button {
  width: 100%;
  padding: 8px 15px;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.cancel-button:hover {
  background-color: #f5f5f5;
}

.actions {
  display: flex;
  justify-content: flex-start;
  margin-top: 20px;
}

.back-button {
  padding: 10px 30px;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.2s;
}

.back-button:hover {
  background-color: #f5f5f5;
}

@media (max-width: 768px) {
  .reservations-container {
    justify-content: center;
  }

  .page-title {
    font-size: 24px;
  }
}

@media (max-width: 480px) {
  .page-subtitle {
    font-size: 14px;
  }

  .breadcrumb {
    font-size: 12px;
  }
}
</style>
