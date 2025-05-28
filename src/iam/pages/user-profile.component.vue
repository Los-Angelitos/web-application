<script>
import BreadCrumb from '../../shared/components/breadcrumb.component.vue';
import userMock from '../../mocks/iam/user-profile-account.json';
import i18n from "../../i18n.js";
import { UserProfileService } from '../services/user-profile.service.js';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import { User } from '../model/user.entity.js';
import { HttpStatusCode } from 'axios';
import UserEditRequest from '../model/user-edit.request.js';

export default {
  name: 'UserProfile',
  components: {
    BreadCrumb,
    Toast
  },
  setup() {
    const toast = useToast();
    return { toast };
  },
  data() {
    return {
      userProfileService: new UserProfileService(),
      loading: true,
      saving: false,
      userData: {
        id: null,
        name: '',
        email: '',
        phone: '',
        type: '',
        image: null,
        country: '',
        language: 'es',
        preferences: null,
        hotelId: null
      },
      defaultAvatar: 'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg',
      showAvatarUpload: false,
      editingField: false,
      editingFieldKey: null,
      editingFieldValue: null,
      countries: [
        { code: 'pe', name: 'Perú' },
        { code: 'co', name: 'Colombia' },
        { code: 'mx', name: 'México' },
        { code: 'es', name: 'España' },
        { code: 'ar', name: 'Argentina' },
        { code: 'cl', name: 'Chile' }
      ],
      languages: [
        { code: 'es', name: 'Español' },
        { code: 'en', name: 'Inglés' }
      ],
      breadcrumbPath: [
        { name: 'Account', link: '' },
        { name: 'Personal Information', link: '' }
      ]
    };
  },
  computed: {
    personalInfo() {
      return [
        { key: 'name', label: 'Name', labelES: "Nombres", value: this.userData.name },
        { key: 'surname', label: 'Last Name', labelES: "Apellidos", value: this.userData.surname || "N/A" },
        { key: 'email', label: 'Email address', labelES: "Dirección de correo electrónico", value: this.userData.email },
        { key: 'phone', label: 'Phone number', labelES: "Número celular", value: this.userData.phone },
        { key: 'password', label: 'Password', labelES: "Contraseña", value: '••••••••' }
      ];
    },
    editingFieldInfo() {
      return this.personalInfo.find(field => field.key === this.editingFieldKey) || {};
    },
    i18n(){
      return i18n;
    }
  },
  methods: {
    async fetchUserData() {
      this.loading = true;

      const userId = localStorage.getItem('userId');
      const roleId = localStorage.getItem('roleId');

      if (!userId || !roleId) {
        console.error('User ID or Role ID not found in localStorage');
        return;
      }

      try {
        let response = null;
        if(roleId == 3) {
          response =  await this.userProfileService.getGuestById(userId);
        }else if(roleId == 2) {
          response = await this.userProfileService.getAdminById(userId);
        }else if(roleId == 1) {
          response = await this.userProfileService.getOwnerById(userId);
        } else {
          console.error('Invalid role ID:', roleId);
          return;
        }

        if(response.status === HttpStatusCode.Ok) {
          this.user = User.fromDisplayableUser(response.data);
          console.log('User data fetched successfully:', this.user);

          let typeUser;
          if(roleId==3) typeUser = 'guest';
          else if(roleId==2) typeUser = 'admin';
          else if(roleId==1) typeUser = 'owner';

          this.userData = {
            id: this.user.id,
            name: this.user.name,
            email: this.user.email,
            phone: this.user.phone,
            surname: this.user.surname || '',
            state: this.user.state || 'ACTIVE',
            type: typeUser,
            image: this.user.image || this.defaultAvatar,
            country: this.user.country || 'pe',
            language: this.user.language || 'es',
            preferences: this.user.preferences || null,
            hotelId: this.user.hotelId || null
          };

          this.loading = false;

          this.breadcrumbPath[0].route = `/home/profile/${this.user.id}`;
          this.breadcrumbPath[1].route = `/home/profile/${this.user.id}/account`;
        }
      }catch(e) {
        console.error('Error fetching user data:', e);
      }

    },

    startEditing(fieldKey) {
      this.editingFieldKey = fieldKey;
      this.editingFieldValue = fieldKey === 'password' ? '' : this.userData[fieldKey];
      this.editingField = true;
    },

    cancelEditing() {
      this.editingField = false;
      this.editingFieldKey = null;
      this.editingFieldValue = null;
    },

    async saveEditing() {
      if (!this.editingFieldValue) {
        this.toast.add({
          severity: 'warn',
          summary: 'Warning',
          detail: 'Please enter a value to save',
          life: 3000
        });
        return;
      }

      console.log('Saving changes for field:', this.editingFieldKey, 'with value:', this.editingFieldValue);
      const roleId = localStorage.getItem('roleId');

      const fieldToUpdate = this.editingFieldKey;
      const userEdit = new UserEditRequest(this.userData.name, this.userData.surname, this.userData.phone, this.userData.email, this.userData.state, parseInt(roleId, 10));
      userEdit[fieldToUpdate] = this.editingFieldValue;
      console.log('User edit request:', userEdit);
     

      try {
          if (fieldToUpdate !== 'password') {
            const response = await this.userProfileService.editGuest(this.userData.id, userEdit);

            if (response.status !== HttpStatusCode.Ok) {
              throw new Error(response.message);
            }

            this.userData[fieldToUpdate] = this.editingFieldValue;
            this.toast.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Information updated successfully',
              life: 3000
            });
          } else {
            console.log('Password updated:', this.editingFieldValue);
          }
      }catch(error) {
        console.error('Error updating user information:', error);
        this.toast.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message || 'An error occurred while updating information',
          life: 3000
        });
        return;
      }

      this.cancelEditing();
    },

    saveAdditionalInfo() {
      this.saving = true;

      setTimeout(() => {
        this.saving = false;
        this.showNotification('Additional information updated successfully');
      }, 1000);
    },

    openFileUpload() {
      this.$refs.fileInput.click();
    },

    handleAvatarChange(event) {
      const file = event.target.files[0];
      if (!file) return;

      if (!file.type.match('image.*')) {
        alert('Please select a valid image file');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        this.userData.avatar = e.target.result;

        setTimeout(() => {
          this.showNotification('Avatar updated successfully');
        }, 1000);
      };
      reader.readAsDataURL(file);
    },

    goToPreferences() {
      this.$router.push('/home/profile/' + this.userData.id + '/preferences');
    },

    goToHotel() {
      this.$router.push('/home/hotel/' + this.userData.hotelId + '/organization');
    },

    goToReservations() {
      this.$router.push(`/home/profile/${this.userData.id}/reservations`);
    },

    contactSupport() {
      this.$router.push('/support');
    },

    showNotification(message) {
      alert(message);
    },
    obtainRole(type) {
      console.log('User type:', type);
      switch (type) {
        case 'admin':
          return 'Administrator';
        case 'guest':
          return 'Guest';
        case 'owner':
          return 'Chief Owner';
        default:
          return 'Unknown';
      }
    },
    knowLanguage(item) {
      return this.$i18n.locale === 'en' ? item.label : item.labelES;
    }
  },
  created() {
    this.fetchUserData();
  }
};
</script>

<template>
  <Toast position="bottom-right" />
  <BreadCrumb :path="breadcrumbPath" class="breadcrumb" />
  <div class="container">

    <div class="profile-container">
      <!-- Sección principal -->
      <div class="profile-main">
        <!-- Tarjeta de perfil -->
        <div class="card">
          <div class="profile-header">
            <div
                class="profile-avatar"
                @mouseover="showAvatarUpload = true"
                @mouseleave="showAvatarUpload = false"
            >
              <img :src="userData.image || defaultAvatar" alt="Foto de perfil">
              <div class="avatar-upload" v-show="showAvatarUpload" @click="openFileUpload">
                <i class="fas fa-camera"></i>
              </div>
              <input
                  type="file"
                  ref="fileInput"
                  accept="image/*"
                  style="display: none;"
                  @change="handleAvatarChange"
              >
            </div>
            <div class="profile-info">
              <h1 class="profile-name">{{ userData.name }}</h1>
              <p class="profile-role">{{ obtainRole(userData.type) }}</p>
            </div>
          </div>
        </div>

        <!-- Información personal -->
        <div class="card">
          <div class="card-header">
            <h2 class="card-title"> {{ i18n.global.t('user-profile.info-title') }}</h2>
          </div>
          <div class="card-body">
            <div class="info-item" v-for="(field, index) in personalInfo" :key="index">
              <div>
                <div class="info-label">{{ knowLanguage(field) }}</div>
                <div class="info-value">{{ field.value }}</div>
              </div>
              <div class="edit-card" @click="startEditing(field.key)">
                <img src="/icon_pen.svg" alt="Edit icon" class="edit-icon" />
                <button class="edit-button">{{ i18n.global.t('user-profile.edit') }}</button>
              </div>
            </div>

            <!-- Modal para editar -->
            <div class="modal" v-if="editingField">
              <div class="modal-content">
                <div class="modal-header">
                  <h3>{{ i18n.global.t('user-profile.edit') }} {{ editingFieldInfo.label }}</h3>
                  <span class="close-button" @click="cancelEditing">&times;</span>
                </div>
                <div class="modal-body">
                  <div class="form-group">
                    <input
                        v-if="editingFieldInfo.key !== 'password'"
                        type="text"
                        class="form-control"
                        v-model="editingFieldValue"
                        :placeholder="editingFieldInfo.label"
                    >
                    <input
                        v-else
                        type="password"
                        class="form-control"
                        v-model="editingFieldValue"
                        placeholder="{{ i18n.global.t('user-profile.enter') }} your new password"
                    >
                  </div>
                </div>
                <div class="modal-footer">
                  <button class="btn btn-outline" @click="cancelEditing">{{ i18n.global.t('user-profile.cancel') }}</button>
                  <button class="btn btn-primary" @click="saveEditing">{{ i18n.global.t('user-profile.save') }}</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Información adicional -->
        <div class="card">
          <div class="card-header">
            <h2 class="card-title">{{ i18n.global.t('user-profile.info-adittional') }}</h2>
          </div>
          <div class="card-body" v-if="!loading">
            <div class="form-group">
              <label class="form-label">{{ i18n.global.t('user-profile.birth-date') }}</label>
              <input type="date" class="form-control" v-model="userData.dateOfBirth">
            </div>
            <div class="form-group">
              <label class="form-label">{{ i18n.global.t('user-profile.country') }}</label>
              <select class="form-control" v-model="userData.country">
                <option value="">{{ i18n.global.t('user-profile.select-country') }}</option>
                <option v-for="country in countries" :key="country.code" :value="country.code">
                  {{ country.name }}
                </option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">{{ i18n.global.t('user-profile.language') }}</label>
              <select class="form-control" v-model="userData.language">
                <option v-for="language in languages" :key="language.code" :value="language.code">
                  {{ language.name }}
                </option>
              </select>
            </div>
            <button class="btn btn-primary save-changes" @click="saveAdditionalInfo">
              {{ saving ? 'Guardando...' : 'Guardar cambios' }}
            </button>
          </div>
          <div class="card-body" v-else>
            <div class="loading-indicator">
              <i class="fas fa-spinner fa-spin"></i>
              <span>{{ i18n.global.t('user-profile.loading') }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="profile-sidebar">
        <div class="card sidebar-card" v-if="userData.type === 'guest'">
          <h3 class="sidebar-title">{{ i18n.global.t('user-profile.preferences') }}</h3>
          <p class="sidebar-text">{{ i18n.global.t('user-profile.preferences-description') }}</p>
          <button class="btn btn-outline" @click="goToPreferences">{{ i18n.global.t('user-profile.enter') }}</button>
        </div>

        <div class="card sidebar-card" v-else>
          <h3 class="sidebar-title">{{ i18n.global.t('user-profile.hotel') }}</h3>
          <p class="sidebar-text">{{ i18n.global.t('user-profile.hotel-description') }}</p>
          <button class="btn btn-outline" @click="goToHotel">{{ i18n.global.t('user-profile.enter') }}</button>
        </div>

        <div class="card sidebar-card">
          <h3 class="sidebar-title">{{ i18n.global.t('user-profile.reservations') }}</h3>
          <p class="sidebar-text">{{ i18n.global.t('user-profile.reservations-description') }}</p>
          <button class="btn btn-outline" @click="goToReservations">{{ i18n.global.t('user-profile.history') }}</button>
        </div>

        <div class="card sidebar-card">
          <h3 class="sidebar-title">{{ i18n.global.t('user-profile.support') }}</h3>
          <p class="sidebar-text">{{ i18n.global.t('user-profile.support-description') }}</p>
          <button class="btn btn-outline" @click="contactSupport">{{ i18n.global.t('user-profile.contact') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

.container {
  max-width: 1140px;
  margin: 0 auto;
  padding: 20px;
}

.breadcrumb {
  margin: 0 2rem;
}

.breadcrumb span {
  margin: 0 8px;
}

.breadcrumb a {
  color: var(--secondary);
  text-decoration: none;
}

.breadcrumb a:hover {
  color: var(--primary);
}

/* Perfil principal */
.profile-container {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
}

.profile-main {
  flex: 1;
  min-width: 300px;
}

.profile-sidebar {
  width: 300px;
}

.card {
  background: white;
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-bottom: 30px;
}

.card-header {
  padding: 20px;
  border-bottom: 1px solid #eaeaea;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: #000;
}

.card-body {
  padding: 20px;
}

/* Perfil header */
.profile-header {
  display: flex;
  align-items: center;
  gap: 25px;
  padding: 30px;
}

.profile-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  position: relative;
  cursor: pointer;
}

.profile-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-upload {
  position: absolute;
  bottom: 0;
  right: 0;
  background: var(--primary-color);
  color: white;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
}

.avatar-upload:hover {
  background: #0055aa;
}

.profile-info {
  flex: 1;
}

.profile-name {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 5px;
}

.profile-role {
  color: var(--gray-light-color);
  margin-bottom: 15px;
}

/* Formulario */
.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}

.form-control {
  display: block;
  width: 100%;
  padding: 10px 15px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  transition: all 0.3s;
}

.form-control:focus {
  border-color: var(--primary-color);
  outline: none;
  box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.15);
}

.form-control:disabled {
  background-color: #f9f9f9;
  cursor: not-allowed;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #eaeaea;
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  font-weight: 500;
}

.info-value {
  color: var(--gray-light-color);
}

.edit-button {
  background: transparent;
  color: #000;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 14px;
  font-weight: 500;
}

/* Botones */
.btn {
  display: inline-block;
  font-weight: 500;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  user-select: none;
  border: 1px solid transparent;
  padding: 10px 20px;
  font-size: 16px;
  line-height: 1.5;
  border-radius: 8px;
  transition: all 0.3s;
  cursor: pointer;
}

.btn-primary {
  width: 100%;
  color: white;
  background-color: var(--primary-color);
  border-color: var(--primary-color);
}

.btn-primary:hover {
  background-color: #0055aa;
  border-color: #0055aa;
}

.btn-outline {
  color: var(--primary-color);
  background-color: transparent;
  border-color: var(--primary-color);
  width: 100%;
}

.btn-outline:hover {
  color: white;
  background-color: var(--primary-color);
  border-color: var(--primary-color);
}

.edit-card {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}


/* Sidebar */
.sidebar-card {
  padding: 20px;
}

.sidebar-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 15px;
}

.sidebar-text {
  color: var(--gray-light-color);
  margin-bottom: 20px;
}

.save-changes {
  width: max-content;
}

/* Modal */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  border-radius: 10px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  animation: modalFadeIn 0.3s;
}

@keyframes modalFadeIn {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

.modal-header {
  padding: 20px;
  border-bottom: 1px solid #eaeaea;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.close-button {
  font-size: 24px;
  cursor: pointer;
  color: var(--secondary-color);
}

.close-button:hover {
  color: var(--red-color);
}

.modal-body {
  padding: 20px;
}

.modal-footer {
  padding: 15px 20px;
  border-top: 1px solid #eaeaea;
  display: flex;
  justify-content: center;
  gap: 1.5rem;
}

/* Loading indicator */
.loading-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px;
  color: var(--secondary-color);
}

.loading-indicator i {
  font-size: 24px;
  margin-bottom: 15px;
  color: var(--primary-color);
}

/* Responsive */
@media (max-width: 768px) {
  .profile-container {
    flex-direction: column;
  }

  .profile-header {
    flex-direction: column;
    text-align: center;
    padding: 20px;
  }

  .profile-sidebar {
    width: 100%;
  }

  .profile-avatar {
    width: 100px;
    height: 100px;
  }

  .modal-content {
    width: 95%;
  }

  .save-changes {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 10px;
  }

  .card {
    border-radius: 8px;
  }

  .info-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }

  .edit-button {
    margin-top: 5px;
  }

  .profile-name {
    font-size: 24px;
  }

  .btn {
    width: 100%;
  }

  .modal-footer {
    flex-direction: column;
  }

  .modal-footer .btn {
    margin-bottom: 10px;
  }
}
</style>