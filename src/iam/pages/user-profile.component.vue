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
        
        <BasicCardComponent title="" class="card" v-if="userData.type === 'guest'">
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

        <BasicCardComponent title="" class="card" v-else>
          <template #image>
            <img :src="userData.image" alt="User Image" class="user-image" />
          </template>
          
          <template #header-content class="card-header-content">
            <div style="display: flex; align-items: center; justify-content: center; gap: 1rem;">
              <img src="../../assets/iam/my-hotel-icon.svg" alt="My Hotel Icon" class="hotel-icon" />
              <h2>My Hotel</h2>
            </div>
          </template>

          <p class="card-body-content">Modify and edit your hotel with the best way. SweetManager will take care of the rest!</p>

          <div class="card-wrapper">
            <ButtonComponent :text="'Join'" :width="'80%'" :state="'basic'" :onClick="() => this.$router.push(`/home/hotel/${userData.hotelId}/overview`)" class="button-preferences" />
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

@media screen and (max-width: 790px) {
  .account-content {
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .account-info-card {
    width: 100%;
    justify-content: center;
    align-items: center;
  }

  .card {
    max-width: 50%;
  }

  .account-info-personal {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
  
  .account-overview {
    align-self:flex-start;
  }

  .account-details {
    margin-top: 0;
    margin-bottom: 2rem;
  }
}

@media screen and (max-width: 500px) {
  .card {
    width:auto;
    max-width: 100%;
  }
}

</style>