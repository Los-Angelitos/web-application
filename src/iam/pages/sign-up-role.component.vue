<script>
import InputTextComponent from "../../shared/components/input-text.component.vue";
import InputPasswordComponent from "../../shared/components/input-password.component.vue";
import RadioButtonComponent from "../../shared/components/radio-button.component.vue";
import DescriptionRadioButtonComponent from "../components/description-radio-button.component.vue";
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import '@fortawesome/fontawesome-free/css/all.css';

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
      roleSelected: ''
    };
  },
  setup() {
    const toast = useToast();
    return { toast };
  },
  methods: {
    handleLogin() {
      if (!this.roleSelected) {
        this.toast.add({
          severity: 'warn',
          summary: 'Rol requerido',
          detail: 'Por favor selecciona un rol para tu cuenta.',
          life: 3000
        });
        return;
      }

      this.toast.add({
        severity: 'success',
        summary: 'Rol seleccionado',
        detail: `Has elegido: ${this.roleSelected}`,
        life: 2000
      });

      this.$router.push('/home');
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
            :options="[
    { value: 'guest', label: 'Guest', description: 'I will use my account to search and book a hotel stay.' },
    { value: 'admin', label: 'Admin', description: 'I will be responsible for managing and handling each stay within a hotel to provide the greatest possible comfort.' },
    { value: 'manager', label: 'Owner', description: 'I will be on top of all the amenities within my hotel and will manage what is necessary for my guests.' }
  ]"
            groupName="accountRole"
        />


        <button @click="handleLogin" class="login-button">Sign Up</button>

        <hr class="line-container"></hr>

        <div style="margin-top:1rem; font-size:0.8rem;">Already have an account?</div>
        <button class="crear-cuenta" style="font-size:0.8rem; color: var(--primary-color); background: none; border: none; cursor: pointer; margin-top:-1rem" @click="sendToSignUp">Log In</button>
      </div>
    </div>
  </div>
</template>

<style scoped>

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




.login-logo-image {
  position: absolute; /* Coloca el logo en una posición absoluta */
  z-index: 1000; /* Asegura que esté en la capa superior */
  top: -10%; /* Ajusta la posición vertical */
  left: 36%; /* Ajusta la posición horizontal */
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
}

button:hover {
  background-color: #0056b3;
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
.login-button:hover {
  background-color: #0056b3;
}


.error-message {
  color: red;
  margin-top: 1rem;
  text-align: center;
}

@media (max-width: 768px) {

  .logo-section img {
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