<script>
import userMock from "../../mocks/iam/user-profile-account.json";
import BreadCrumb from "../../shared/components/breadcrumb.component.vue";
import BasicCardComponent from "../../shared/components/basic-card.component.vue";
import AccountInfoOverview from "../components/account-info-overview.component.vue";
import AccountDetailFormEdit from "../components/account-detail-form-edit.component.vue";
import ButtonComponent from "../../shared/components/button.component.vue";

export default {
    name: "UserProfilePage",
    components: {
        BreadCrumb,
        BasicCardComponent,
        AccountInfoOverview,
        AccountDetailFormEdit,
        ButtonComponent
    },
    data() {
        return {
            userData: null,
            breadcrumbPath: [
                { name: "Account", route: "" },
                { name: "Personal Information", route: "" },
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
          console.log("User data fetched:", this.userData);

          this.breadcrumbPath[0].route = `/home/profile/${this.userData.id}`;
          this.breadcrumbPath[1].route = `/home/profile/${this.userData.id}/account`;
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
  <div class="user-profile-container">
    <BreadCrumb :path="breadcrumbPath" />

    <div class="account-content">
      <div class="account-info-personal">
        <AccountInfoOverview v-if="userData" :username="userData.name" :userType="userData.type" />
        
        <AccountDetailFormEdit v-if="userData" :userData="userData" @edit="editField" @save="saveField" />
      </div>

      <div class="account-info-card" v-if="userData">
        
        <BasicCardComponent title="" class="card">
          <template #image>
            <img :src="userData.image" alt="User Image" class="user-image" />
          </template>
          
          <template #header-content class="card-header-content">
            <h2>My Preferences</h2>
          </template>

          <p class="card-body-content">When we have your preferences as a guest, SweetManager it will understand your comfort and will it useful to the hotels!</p>

          <div class="card-wrapper">
            <ButtonComponent :text="'Join'" :width="'80%'" :state="'basic'" :onClick="() => this.$router.push(`/home/profile/${userData.id}/preferences`)" class="button-preferences" />
          </div>
          
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
  max-height: max-content;
}

::v-deep(.card-body) {
  padding: 0 1rem;
}

::v-deep(.card-image) {
  width: 100%;
}

.user-profile-container {
  margin: 2rem;
}

.account-path {
  margin: 1rem 0;
  font-size: .8rem;
}


.account-info-personal {
  width: 60%;
}

.account-info-card {
  width: 40%;
  display: flex;
  justify-content: center;
}

.account-content {
  display: flex;
  justify-content: center;
  align-items: stretch;
  width: 100%;
}

.account-details {
  width: 80%;
}


.card {
  max-width: 80%;
  height: 100%;
  margin: 0;
}

.card-header-content {
  padding: 1.5rem;
}

.card-header-content h2 {
  color: #000;
  font-size: 1.2rem;
  font-weight: 400;
}

.card-body-content {
  font-size: .8rem;
  color: var(--gray-light-color);
  margin-top: .5rem;
  text-align: center;
}

.card-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 1rem 0;
}

</style>