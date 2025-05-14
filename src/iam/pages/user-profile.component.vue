<script>
import BreadCrumb from '../../shared/components/breadcrumb.component.vue';
import userMock from '../../mocks/iam/user-profile-account.json';

export default {
  name: 'UserProfile',
  components: {
    BreadCrumb
  },
  data() {
    return {
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
        { key: 'fullName', label: 'Full name', value: this.userData.name },
        { key: 'email', label: 'Email address', value: this.userData.email },
        { key: 'phone', label: 'Phone number', value: this.userData.phone },
        { key: 'password', label: 'Password', value: '••••••••' }
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
    fetchUserData() {
      this.loading = true;

      setTimeout(() => {
        const apiResponse = userMock;

        this.breadcrumbPath[0].route = `/home/profile/${apiResponse.id}`;
        this.breadcrumbPath[1].route = `/home/profile/${apiResponse.id}/account`;

        this.userData = { ...apiResponse, country: "pe", language: "es" };
        this.loading = false;
      }, 800);
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

    saveEditing() {
      if (!this.editingFieldValue) {
        alert('This field cannot be empty');
        return;
      }

      const fieldToUpdate = this.editingFieldKey;

      if (fieldToUpdate !== 'password') {
        this.userData[fieldToUpdate] = this.editingFieldValue;
      } else {
        console.log('Password updated:', this.editingFieldValue);
      }

      this.cancelEditing();

      this.showNotification('Information updated successfully');
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
      switch (type) {
        case 'guest':
          return 'Guest';
        case 'admin':
          return 'Administrator';
        case 'owner':
          return 'Chief Owner';
        default:
          return 'Unknown Type';
      }
    }
  },
  created() {
    this.fetchUserData();
  }
};
</script>

<template>
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
                <div class="info-label">{{ field.label }}</div>
                <div class="info-value">{{ field.value }}</div>
              </div>
              <div class="edit-card" @click="startEditing(field.key)">
                <img src="/icon_pen.svg" alt="Edit icon" class="edit-icon" />
                <button class="edit-button">Edit</button>
              </div>
            </div>

            <!-- Modal para editar -->
            <div class="modal" v-if="editingField">
              <div class="modal-content">
                <div class="modal-header">
                  <h3>Edit {{ editingFieldInfo.label }}</h3>
                  <span class="close-button" @click="cancelEditing">&times;</span>
                </div>
                <div class="modal-body">
                  <div class="form-group">
                    <input
                        v-if="editingFieldInfo.key !== 'password'"
                        type="text"
                        class="form-control"
                        v-model="editingFieldValue"
                        :placeholder="'Enter your ' + editingFieldInfo.label.toLowerCase()"
                    >
                    <input
                        v-else
                        type="password"
                        class="form-control"
                        v-model="editingFieldValue"
                        placeholder="Enter your new password"
                    >
                  </div>
                </div>
                <div class="modal-footer">
                  <button class="btn btn-outline" @click="cancelEditing">Cancel</button>
                  <button class="btn btn-primary" @click="saveEditing">Save</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Información adicional -->
        <div class="card">
          <div class="card-header">
            <h2 class="card-title">Additional information</h2>
          </div>
          <div class="card-body" v-if="!loading">
            <div class="form-group">
              <label class="form-label">Birth date</label>
              <input type="date" class="form-control" v-model="userData.dateOfBirth">
            </div>
            <div class="form-group">
              <label class="form-label">Country</label>
              <select class="form-control" v-model="userData.country">
                <option value="">Select country</option>
                <option v-for="country in countries" :key="country.code" :value="country.code">
                  {{ country.name }}
                </option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Favorite language</label>
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
              <span>Loading information...</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="profile-sidebar">
        <div class="card sidebar-card" v-if="userData.type === 'guest'">
          <h3 class="sidebar-title">My preferences</h3>
          <p class="sidebar-text">By having your preferences, SweetManager will understand your amenities and services for hotels to consider.</p>
          <button class="btn btn-outline" @click="goToPreferences">Enter</button>
        </div>

        <div class="card sidebar-card" v-else>
          <h3 class="sidebar-title">My hotel</h3>
          <p class="sidebar-text">Modify and edit your hotel in the best way, SweetManager will take care of the rest!</p>
          <button class="btn btn-outline" @click="goToHotel">Enter</button>
        </div>

        <div class="card sidebar-card">
          <h3 class="sidebar-title">Reservations History</h3>
          <p class="sidebar-text">Check your previous and future reservations.</p>
          <button class="btn btn-outline" @click="goToReservations">See history</button>
        </div>

        <div class="card sidebar-card">
          <h3 class="sidebar-title">Support and help</h3>
          <p class="sidebar-text">Having problems with your account or need help?</p>
          <button class="btn btn-outline" @click="contactSupport">Contact support</button>
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