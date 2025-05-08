<script>
import userMock from "../../mocks/iam/user-profile-account.json";
export default {
    name: "UserProfilePage",
    data() {
        return {
            userData: null,
            notShowFields: ["id", "type", "created_at", "updated_at", "image", "preferences"],
        };
    },
    computed: {
      filteredFields() {
        if (!this.userData) return [];
        return Object.keys(this.userData).filter(key => !this.notShowFields.includes(key));
      }
    },
    mounted() {
        this.fetchUserData();
    },
    methods: {
      fetchUserData() {
        setTimeout(() => {
          this.userData = userMock;
          console.log("User data fetched:", this.userData);
        }, 300);
      },
      discoverTypeOfUser() {
        switch(this.userData.type) {
          case "guest":
            return "Guest";
          case "admin":
            return "Administrator";
          case "owner":
            return "Chief Owner";
          default:
            return "Unknown Type";
        }
      },
      formatFieldName(field) {
        return field.charAt(0).toUpperCase() + field.slice(1).replace(/_/g, ' ');
      }
    }
}
</script>

<template>
  <div class="user-profile-container">
    <div class="account-path">
      <span class="account-path-text">Account     >     Personal Information</span>
    </div>

    <div class="account-content">
      <div v-if="userData" class="account-overview">
        <div class="account-info">
          <h2>{{ userData.name }}</h2>
          <p>{{ discoverTypeOfUser() }}</p>
        </div>
      </div>
      <div v-if="userData" class="account-details">
        <div v-for="(key, index) in filteredFields" :key="index" class="account-detail-item">
          <div class="item-fields">
            <p class="account-detail-item__field">{{ formatFieldName(key) }}</p> 
            <p class="account-detail-item__field-value">{{ userData[key] }}</p>
          </div>

          <div class="item-edit">
            <p class="account-detail-item__edit">Edit</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  
</template>

<style scoped>
.user-profile-container {
  margin: 0 2rem;
}

.account-path {
  margin: 1rem 0;
  font-size: .8rem;
}

.account-overview {
  display: flex;
  align-items: center;
}

.account-info h2 {
  font-size: 2rem;
  font-weight: 400;
}

.account-info p {
  font-size: 1.2rem;
  color: var(--gray-light-color);
}

.account-details {
  margin-top: 2rem;
}

.account-detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid var(--gray-light-color);
  width: 40%;
  
}

.item-fields{
  display: flex;
  flex-direction: column;
  padding: 1rem 0;
}

.account-detail-item__field {
  font-size: 1.2rem;
}

.account-detail-item__field-value {
  font-size: .9rem;
  color: var(--gray-light-color);
}

</style>