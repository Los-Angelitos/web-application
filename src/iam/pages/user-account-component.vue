<script>
import userMock from "../../mocks/iam/user-profile-account.json";

export default {
  name: "UserProfileAccountPage",
  data() {
    return {
      userData: null,
      possiblePaths: [
        { name: "Personal Information", link: "/profile" },
        { name: "My preferences as a Guest", link: "/preferences" },
        { name: "My Reservations", link: "/reservations" },
        { name: "Logout", link: ""}
      ]
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
      }, 500);
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


      <div class="account-possible-paths">
        <ul>
          <li v-for="(path, index) in possiblePaths" :key="index">
            <router-link :to="path.link" class="account-to-link">{{ path.name }}</router-link>
          </li>
        </ul>
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

.account-possible-paths ul {
  list-style: none;
  padding: 0;
  margin-top: 2rem;
}

.account-possible-paths li {
  position: relative;
  padding-left: 4rem;
  margin-bottom: 0.8rem;
  font-size: 1rem;
}

.account-to-link {
  text-decoration: none;
  color: #000;
  font-weight: 400;
  transition: color 0.5s ease;
  font-size: 1.1rem;
}

.account-to-link:hover {
  opacity: .8;
}

.account-possible-paths li::before {
  content: ">";
  position: absolute;
  left: 0;
}


</style>