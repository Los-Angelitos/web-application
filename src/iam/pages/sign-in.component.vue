<script>
import InputTextComponent from "../../shared/components/input-text.component.vue";
import InputPasswordComponent from "../../shared/components/input-password.component.vue";
import { useToast } from "primevue/usetoast";
import Toast from "primevue/toast";
import '@fortawesome/fontawesome-free/css/all.css';
import { mapActions } from 'vuex';
import SignInRequest from "../model/sign-in.request.js";
import DescriptionRadioButtonComponent from "../components/description-radio-button.component.vue";
import { useAuthenticationStore } from "../services/authentication.store";

export default {
  name: "SignInPage",
  components: {
    InputTextComponent,
    DescriptionRadioButtonComponent,
    InputPasswordComponent,
    Toast
  },
  data() {
    return {
      username: '',
      password: '',
      roleSelected: '',
    };
  },
  setup() {
    const toast = useToast();
    return { toast };
  },
  created() {
    localStorage.clear();
  },
  methods: {
    ...mapActions(['GetUserId']),
    async handleLogin() {
      console.log("Handling login with:", this.username, this.password, this.roleSelected);
      if (!this.username || !this.password || !this.roleSelected) {
        this.toast.add({
          severity: 'error',
          summary: 'Campos requeridos',
          detail: 'Por favor completa todos los campos.',
          life: 3000
        });
        return;
      }

      let roleId = null;
      if (this.roleSelected === 'guest') {
        roleId = 3; // ID de rol para Guest
      } else if (this.roleSelected === 'admin') {
        roleId = 2; // ID de rol para Admin
      } else if (this.roleSelected === 'manager') {
        roleId = 1; // ID de rol para Owner
      }

      let signInRequest = new SignInRequest(this.username, this.password, roleId);

      let authenticationStore = useAuthenticationStore;
      await authenticationStore.dispatch("signIn", signInRequest)
        .then(() => {
          this.toast.add({
            severity: 'success',
            summary: 'Login successful',
            detail: 'Welcome back!',
            life: 2000
          });

          localStorage.setItem('roleId', roleId);

          this.$router.push('/home');
        })
        .catch((error) => {
          this.toast.add({
            severity: 'error',
            summary: 'Error logging in',
            detail: error.response?.data || 'An error occurred during login.',
            life: 3000
          });
        });

      //this.GetUserId(user.id);
      //this.$router.push('/home/hotel/:id/overview'); // Ruta simulada
    },
    sendToSignUp() {
      this.$router.push('/auth/sign-up');
    }
  }
};
</script>


<template>
  <Toast />
  <div class="login-container">

    <div class="login-section">
     
      <div class="login-box">

         <div class="login-logo-image">
          <img src="/sweetmanager-circle-logo.png" alt="logo" />
        </div>

      <h2 class="title">Welcome!</h2>
      <text class="ask">Enter your credentials to access</text>
      <text class="ask"> your account</text>


      <InputTextComponent v-model="username" label="User" class="no-movement"  @input="errorMessage = ''"/>
        <InputPasswordComponent v-model="password" label="Password" class="no-movement" />
        
          <a  class="github-link">Forgot your password?</a>

          <div class="role-group">
            <text class="ask">Select your role:</text>
            <DescriptionRadioButtonComponent
              v-model="this.roleSelected"
                  :options="[
          { value: 'guest', label: 'Guest', description: '' },
          { value: 'admin', label: 'Admin', description: '' },
          { value: 'manager', label: 'Owner', description: '' }
        ]"
                  groupName="accountRole"
              />
          </div>
          
          
      <button @click="handleLogin" class="login-button">Log in</button>

        <div class="line-container">
          <span>or continue with</span>

        </div>
        <div class="web-logos">
        <i class="fab fa-google"></i> <!-- Ícono de Google -->
        <i class="fab fa-facebook"></i> <!-- Ícono de Facebook -->
          <i class="fab fa-linkedin"></i>
        </div>
        <div style="margin-top:2rem; font-size:0.8rem;">Do not have an account?</div>
        <button class="crear-cuenta" style="font-size:0.8rem; color: var(--primary-color); background: none; border: none; cursor: pointer; margin-top:-1rem" @click="sendToSignUp">Sign up</button>
      </div>
    </div>
    <div class="logo-section">
      <img src="/image95.png" alt="Company Logo" class="company-logo" />
    </div>
  </div>
</template>

<style scoped>
::v-deep(.radio-group) {
  flex-direction: row;
  justify-content: center;
  gap: 2.5rem;
}

.web-logos{
  display: flex;
  justify-content: center;
  color: var(--primary-color) !important;
  margin-top: 1rem;


}
.web-logos i{
  flex: 1; /* Hace que cada elemento ocupe el mismo espacio */
  text-align: center; /* Centra el contenido dentro de cada elemento */
  font-size: 2rem; /* Tamaño del icono */
}
.web-logos i:hover {
  color: #0056b3; /* Cambia el color al pasar el mouse */
}
.crear-cuenta i:hover {
  color: #0056b3; /* Cambia el color al pasar el mouse */
}
.line-container {
  display: flex;
  align-items: center;
  font-size: 10px;
  margin-top: 1rem;
}

.line-container::before,
.line-container::after {
  content: "";
  flex: 1;
  height: 1px;
  background-color: #ccc;
  margin: 0 10px;
}
.login-container {
  display: flex;
  height: 100vh;

}

.logo-section {
  width: 80vw;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.login-section {
  width: 50vw;
  display: flex;
  justify-content: center;
  align-items: center;
}

.company-logo {
  width: 100%;
  height: 100%;
  object-fit: cover;

}
.login-box label {
  display: block;
  margin-bottom: 5px;
}




.login-box {
  padding: 30px;
  width:25rem;
  height: auto;
  border: 0.5px solid #ccc;
  border-radius: 20px;
  background-color: white;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.1);
  text-align: center;
  position: relative;
  margin: 0 1rem;
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
}

button:hover {
  background-color: #0056b3;
}

/* Enlace a GitHub */
.extra-links {
  margin-top: 15px;
}

.github-link {
  display: block;
  color: #007bff;
  text-decoration: none;
  font-size: 12px;
  margin-bottom: 1rem;
  text-align: right;
}




.login-box h2 {
  margin-top: 2rem;
  font-size: 1.5rem;
  color: #1a1a1a;
}
.no-movement{
  margin-top: 1.5rem
}
.no-movement :deep(input),
.no-movement :deep(.p-inputtext),
.no-movement :deep(.p-password-input) {
  min-width: 100%;
  width: 100%;
  max-width: 100%;
}
.no-movement :deep(.p-password) {
  min-width: 100%;
  width: 100%;
  max-width: 100%;
}
.login-logo-image {
  position: absolute;
  top: -2%;
  left: 50%;
  transform: translate(-50%, -50%);

}

.login-logo-image img {
  max-width: 250px;
  max-height: 250px;
  width: auto;
  height: auto;
}

.welcome {
  font-size: 20px;
  font-weight: bold;
  display: block;
  text-align: center;
  width: 100%;
}

.ask {
  font-size: 0.8rem;
  display: block;
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
  margin-top: 10px;
}
.login-button:hover {
  background-color: #0056b3;
}


.error-message {
  color: red;
  margin-top: -0.5rem;
  text-align: center;
}

@media (max-width: 768px) {

  .logo-section {
    display:none;
  }
  .login-section {
    width: 100vw;
    height: 100vh;
    display: flex; /* Ensure it's a flex container */
    justify-content: center; /* Center horizontally */
  }
}
</style>