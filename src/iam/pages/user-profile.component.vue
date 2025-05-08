<script>
import userMock from "../../mocks/iam/user-profile-account.json";
import BasicCardComponent from "../../shared/components/basic-card.component.vue";
import AccountInfoOverview from "../components/account-info-overview.component.vue";
import AccountDetailFormEdit from "../components/account-detail-form-edit.component.vue";

export default {
    name: "UserProfilePage",
    components: {
        BasicCardComponent,
        AccountInfoOverview,
        AccountDetailFormEdit
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
      <div class="account-info-personal">
        <AccountInfoOverview v-if="userData" :username="userData.name" :userType="userData.type" />
        
        <AccountDetailFormEdit v-if="userData" :userData="userData" />
      </div>

      <div class="account-info-card" v-if="userData">
        
        <BasicCardComponent title="">
          <template #image>
            <img :src="userData.image" alt="User Image" class="user-image" />
          </template>
          <template #header-content>
            <h2>Mis Preferencias</h2>
          </template>
          
        </BasicCardComponent>
      </div>
    </div>
  </div>
  
</template>

<style scoped>
::v-deep(.card-image .user-image) {
  width: 100%;
  height: auto;
  object-fit: cover;
  border-radius: 15px 15px 0 0;
}

::v-deep(.card) {
  padding: 0;
}

.user-profile-container {
  margin: 0 2rem;
}

.account-path {
  margin: 1rem 0;
  font-size: .8rem;
}

.account-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  gap: 10em;
}

.account-info-personal, .account-info-card {
  width: 50%;
} 

.account-info-card {
  display: flex;
  justify-content: center;
  align-items: center;
}

</style>