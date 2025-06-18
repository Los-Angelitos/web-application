<script>
import InputTextComponent from "../../shared/components/input-text.component.vue";
import InputPasswordComponent from "../../shared/components/input-password.component.vue";
import RadioButtonComponent from "../../shared/components/radio-button.component.vue";
import DescriptionRadioButtonComponent from "../components/description-radio-button.component.vue";
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import '@fortawesome/fontawesome-free/css/all.css';
import { useAuthenticationStore } from "../services/authentication.store.js";
import SignUpRequest from "../model/sign-up.request.js";
import SignInRequest from "../model/sign-in.request.js";

export default {
  name: "SignUpRolePage",
  components: {
    Toast,
    RadioButtonComponent,
    DescriptionRadioButtonComponent,
    InputPasswordComponent,
    InputTextComponent
  },
  data() {
    return {
      username: '',
      password: '',
      roleSelected: '',
      isLoading: false, // Estado para controlar el loading
      loadingMessage: 'Creating account...' // Mensaje dinámico del loading
    };
  },
  setup() {
    const toast = useToast();
    return { toast };
  },
  methods: {
    async handleLogin() {
      if (!this.roleSelected) {
        this.toast.add({
          severity: 'warn',
          summary: 'Rol requerido',
          detail: 'Por favor selecciona un rol para tu cuenta.',
          life: 3000
        });
        return;
      }

      // Activar loading
      this.isLoading = true;
      this.loadingMessage = 'Creating account...';

      this.toast.add({
        severity: 'success',
        summary: 'Rol seleccionado',
        detail: `Has elegido: ${this.roleSelected}`,
        life: 2000
      });

      console.log("Role selected:", this.roleSelected)
      var isSignedUp = false;
      var roleIdSelected = null;
      var authenticationStore = useAuthenticationStore;

      const user = localStorage.getItem("user");
      if (user) {
        var userData = JSON.parse(user);
        userData.role = this.roleSelected;
        this.$store.dispatch('updateUser', userData);

        let signUpRequest = new SignUpRequest(userData.id, userData.name, userData.surname, userData.phone, userData.mail, userData.password);

        try {
          if(this.roleSelected === 'guest') {
            roleIdSelected = 3; // ID de rol para Guest
            await authenticationStore.dispatch('signUpGuest', signUpRequest);
            console.log("User guest signed up successfully");
            isSignedUp = true;
          } else if (this.roleSelected === 'admin') {
            roleIdSelected = 2; // ID de rol para Admin
            await authenticationStore.dispatch('signUpAdmin', signUpRequest);
            console.log("User admin signed up successfully");
            isSignedUp = true;
          } else if (this.roleSelected === 'manager') {
            roleIdSelected = 1; // ID de rol para Owner
            await authenticationStore.dispatch('signUpOwner', signUpRequest);
            console.log("User owner signed up successfully");
            isSignedUp = true;
          } else {
            this.toast.add({
              severity: 'error',
              summary: 'Rol no válido',
              detail: 'Por favor selecciona un rol válido.',
              life: 3000
            });
            this.isLoading = false;
            return;
          }
        } catch (error) {
          this.toast.add({
            severity: 'error',
            summary: 'Error signing up',
            detail: error.response?.data || 'An error occurred during registration.',
            life: 3000
          });
          this.isLoading = false;
          return;
        }
      }

      if (isSignedUp && user) {
        // Cambiar mensaje de loading para el login
        this.loadingMessage = 'Signing you in...';
        
        let signInRequest = new SignInRequest(userData.mail, userData.password, roleIdSelected);

        try {
          await authenticationStore.dispatch('signIn', signInRequest);
          console.log("User signed in successfully");
          localStorage.setItem('roleId', roleIdSelected);
          
          // Pequeño delay para mostrar el mensaje de éxito
          this.loadingMessage = 'Welcome! Redirecting...';
          setTimeout(() => {
            this.$router.push('/home');
          }, 1000);
          
        } catch (error) {
          this.toast.add({
            severity: 'error',
            summary: 'Error al iniciar sesión',
            detail: error.message,
            life: 3000
          });
          this.isLoading = false;
        }
      } else {
        this.isLoading = false;
      }
    },
    sendToSignUp() {
      this.$router.push('/auth/sign-up');
    }
  }
}
</script>

<template>
  <Toast />
  <div class="login-container">

    <div class="login-section">
      <div class="login-box">
        <div class="login-logo-image">
          <img src="/sweetmanager-circle-logo.png" alt="logo" />
        </div>

        <h2 class="title">Last one thing...</h2>
        <p class="ask">At SweetManager we care about</p>
        <p class="ask"> providing the best possible experience.</p>

        <p class="ask" style="margin-top:1.2rem; font-size:1.2rem">Who will be this account for?</p>
        <DescriptionRadioButtonComponent
            v-model="roleSelected"
            :disabled="isLoading"
            :options="[
              { value: 'guest', label: 'Guest', description: 'I will use my account to search and book a hotel stay.' },
              { value: 'admin', label: 'Admin', description: 'I will be responsible for managing and handling each stay within a hotel to provide the greatest possible comfort.' },
              { value: 'manager', label: 'Owner', description: 'I will be on top of all the amenities within my hotel and will manage what is necessary for my guests.' }
            ]"
            groupName="accountRole"
        />

        <button 
          @click="handleLogin" 
          class="login-button" 
          :disabled="isLoading"
          :class="{ 'loading': isLoading }"
        >
          <div v-if="isLoading" class="loading-content">
            <div class="spinner"></div>
            <span>{{ loadingMessage }}</span>
          </div>
          <span v-else>Sign Up</span>
        </button>

        <hr class="line-container" :class="{ 'disabled': isLoading }"></hr>

        <div style="margin-top:1rem; font-size:0.8rem;" :class="{ 'disabled-text': isLoading }">
          Already have an account?
        </div>
        <button 
          class="crear-cuenta" 
          style="font-size:0.8rem; color: var(--primary-color); background: none; border: none; cursor: pointer; margin-top:-1rem" 
          @click="sendToSignUp"
          :disabled="isLoading"
        >
          Log In
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>

.web-logos i{
  flex: 1;
  text-align: center;
  font-size: 2rem;
}

.web-logos i:hover {
  color: #0056b3;
}

.crear-cuenta i:hover {
  color: #0056b3;
}

.line-container {
  display: flex;
  align-items: center;
  font-size: 10px;
  margin-top: 1rem;
  transition: opacity 0.3s ease;
}

.line-container.disabled {
  opacity: 0.5;
}

.disabled-text {
  opacity: 0.5;
  transition: opacity 0.3s ease;
}

.login-logo-image {
  position: absolute;
  z-index: 1000;
  top: -10%;
  left: 36%;
}

.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  position: relative;
}

.login-section {
  display: flex;
  justify-content: center;
  width: 100%;
}

.login-box label {
  display: block;
  margin-bottom: 5px;
}

.login-box {
  position: relative;
  margin: 0 1rem;
  padding: 30px;
  width: 28rem;
  height: 35rem;
  border-radius: 20px;
  background-color: white;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.input-group label {
  display: block;
  margin-bottom: 5px;
}

.input-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: white;
  color: #000;
}

.input-group input:focus {
  outline: none;
  border-color: var(--primary-color) !important;
}

button {
  width: 100%;
  padding: 10px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
  transition: all 0.3s ease;
}

button:hover:not(:disabled) {
  background-color: #0056b3;
}

button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Estilos para el loading spinner */
.login-button.loading {
  background-color: #6c757d;
}

.loading-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.login-box h2 {
  margin-top: 2rem;
  font-size: 1.5rem;
  color: #1a1a1a;
}

.no-movement input,
.no-movement #password{
  min-width: 100%;
  width: 100%;
  max-width: 100%
}

.login-logo-image {
  margin-bottom: 30px;
  margin-left: 1rem;
}

.login-logo-image img {
  max-width: 250px;
  max-height: 250px;
  width: auto;
  height: auto;
}

.ask {
  font-size: 0.9rem;
  width: 100%;
}

.login-button {
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 2rem;
}

.login-button:hover:not(:disabled) {
  background-color: #0056b3;
}

.error-message {
  color: red;
  margin-top: 1rem;
  text-align: center;
}

/* Estilos para radio buttons deshabilitados */
:deep(.p-radiobutton.p-disabled) {
  opacity: 0.6;
}

:deep(.p-radiobutton.p-disabled .p-radiobutton-box) {
  background-color: #f8f9fa;
}

@media (max-width: 768px) {

  .logo-section img {
    display:none;
  }
  .login-section {
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
  }
}
</style>