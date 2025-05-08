<script>
import userMock from "../../mocks/iam/user-profile-account.json";

export default {
  name: "UserProfileAccountPage",
  data() {
    return {
      userData: null,
    };
  },
  mounted() {
    this.recoverUserData();
  },
  methods: {
    recoverUserData() {
      // Simulate an API call to fetch user data
      setTimeout(() => {
        this.userData = userMock;
        console.log("User data loaded:", this.userData);
      }, 1000);
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
    }
  }
}
</script>

<template>
 <div class="user-profile-account-container">
    <div class="account-path">
      <span class="account-path-text">Account</span>
    </div>

    <div class="account-content">
      <div v-if="userData" class="account-overview">
        <div class="account-info">
          <h2>{{ userData.name }}</h2>
          <p>{{ discoverTypeOfUser() }}</p>
        </div>

        <img :src="userData.image" alt="User Image" class="user-image" />
      </div>
    </div>
 </div>
</template>

<style scoped>
.user-profile-account-container {
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

.user-image {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-left: 1rem;
}
</style>