<script>
import AccountDetailFormEdit from '../components/account-detail-form-edit.component.vue';
import AccountInfoOverview from '../components/account-info-overview.component.vue';
import userMock from '../../mocks/iam/user-profile-account.json';

export default {
    name: "GuestPreferencesPage",
    components: {
        AccountDetailFormEdit,
        AccountInfoOverview,
    },
    data() {
      return {
        userData: null,
      };
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
      saveField(field, value) {
        console.log("Saving field:", field, "New value:", value);
        this.userData[field] = value; 
      },
      editField(field, value) {
        console.log("Editing field:", field, "Current value:", value);
      },
    }
}
</script>

<template>
 <div class="user-preferences-container">
  <div class="account-path">
    <span class="account-path-text">Account > Personal Information > My Preferences</span>
  </div>

  <div class="user-preferences-content">
    <AccountInfoOverview v-if="userData" :username="userData.name" :userType="userData.type" />
  </div>
 </div>
</template>

<style scoped>
.user-preferences-container {
  margin: 2rem;
}

.user-preferences-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.account-path {
  margin: 1rem 0;
  font-size: .8rem;
}

</style>